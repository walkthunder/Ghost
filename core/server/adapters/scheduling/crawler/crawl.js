let debug = require('ghost-ignition').debug('crawler');
let _ = require('lodash');
let uuid = require('uuid');
let ObjectId = require('bson-objectid');
let crawllinkAPI = require('../../../api/crawllinks');
let crawlsiteAPI = require('../../../api/crawlsites');
let postsAPI = require('../../../api/posts');
let models = require('../../../models');
let puppeter = require('./puppeter');
/**
 * Crawler task engine component
 */
const loadLog = function () {
    debug('load log from DB');
    return crawlsiteAPI.read({
        status: 'open'
    });
};
const updateLog = function (options) {
    debug('update log to DB - ', options);
    return crawlsiteAPI.edit({crawlsites: [{status: 'done'}]}, options);
};

function markdownToMobiledoc(content) {
    var mobiledoc = {
        version: '0.3.1',
        markups: [],
        atoms: [],
        cards: [
            ['markdown', {
                cardName: 'markdown',
                markdown: content || ''
            }]
        ],
        sections: [[10, 0]]
    };
    return JSON.stringify(mobiledoc);
}

function createPost(overrides) {
    overrides = overrides || {};

    var newObj = _.cloneDeep(overrides),
        mobiledocObj;

    if (!newObj.mobiledoc) {
        newObj.mobiledoc = markdownToMobiledoc('## markdown');
    }

    if (!newObj.html) {
        mobiledocObj = JSON.parse(newObj.mobiledoc);
        newObj.html = mobiledocObj.cards && mobiledocObj.cards[0][1].markdown;
    }

    return models.User.findOne({
        slug: 'ghost'
    }).then(function (collector = {}) {
        let postData = _.defaults(newObj, {
            id: ObjectId.generate(),
            uuid: uuid.v4(),
            title: 'iInsert002',
            status: 'published',
            feature_image: null,
            featured: false,
            page: false,
            author_id: collector.id || '1',
            updated_at: new Date(),
            updated_by: collector.id || '1',
            created_at: new Date(),
            created_by: collector.id || '1',
            published_at: new Date(),
            published_by: collector.id || '1',
            visibility: 'public'
        });
        return postsAPI.add(postData)
            .then(function onModelResponse(model) {
                var post = model.toJSON();
                return {posts: [post]};
            });
    });
}
const html = '<section><body><h2>H2 Title</h2><p>body content</p></body></section>';
const mockData = {
    title: 'iInsert003',
    slug: 'html-ipsum',
    html,
    mobiledoc: markdownToMobiledoc(html),
    published_at: new Date(),
    custom_excerpt: html,
    feature_image: 'https://casper.ghost.org/v1.0.0/images/writing.jpg'
};

const crawl = function (log) {
    debug('crawl log - ', log);
    return puppeter(log)
};

const _crawlLink = function (link) {
    debug('_crawlLink', link)
    return puppeter(link, 'link')
}

const crawlLinks = function (links = []) {
    return links.reduce((res, link) => {
        return res.then((finalRespArray) => {
            return new Promise((resolve) => {
                return _crawlLink(link)
                    .then(linkResp => {
                        finalRespArray.push(linkResp)
                        return resolve(finalRespArray)
                    })
                    .catch(err => {
                        debug('crawl links error - ', err)
                        return resolve(finalRespArray)
                    })
            })
        })
    }, Promise.resolve([]))
}

const formatCL = function (cl) {
    return cl ? {
        crawllinks: [cl]
    } : null
}

module.exports = {
    siteCrawler: function () {
        debug('engine start');
        let workingLog;
        return loadLog()
            .then((resp) => {
                debug('load log from DB - ', resp);

                if (!(resp && resp.crawlsites)) {
                    return Promise.reject(new Error('Load log failed'));
                }
                workingLog = resp.crawlsites[0];
                return crawl(workingLog)
                    .then(res => {
                        console.log('crawl result - ', res);
                        if (res) {
                            return res.map(link => {
                                if (link) {
                                    return {
                                        crawlsite_id: workingLog.id,
                                        query_rule: workingLog.sub,
                                        status: 'pending',
                                        uri: link
                                    }
                                }
                            })
                        }
                    });
            })
            .then((cls) => {
                const context = {
                    context: {
                        user: '1'
                    }
                };
                let addPromises = cls.map((cl) => {
                    if (cl) {
                        cl = formatCL(cl)
                    }
                    if (!cl) {
                        return Promise.resolve();
                    }
                    const fromID = cl.crawllinks[0].crawlsite_id
                    const uri = cl.crawllinks[0].uri

                    return crawllinkAPI.read({
                        crawlsiteId: fromID,
                        uri
                    })
                        .then(item => {
                            if (item && item.crawllinks && item.crawllinks[0]) {
                                debug('crawllink item exists', item.crawllinks[0])
                                return Promise.resolve()
                            } else {
                                return crawllinkAPI.add(cl, context)
                                    .then((resp) => {
                                        debug('added crawllink resp - ', resp);
                                        return resp;
                                    });
                            }
                        })
                        .catch(err => {
                            debug('read error - ', err)
                            if (err && (err.statusCode === 404)) {
                                return crawllinkAPI.add(cl, context)
                                    .then((resp) => {
                                        debug('added crawllink resp - ', resp);
                                        return resp;
                                    });
                            }
                            return Promise.reject(err)
                        })
                });
                return Promise.all(addPromises)
                    .then((allAdded) => {
                        debug('all added - ', allAdded);
                        return allAdded;
                    })
                    .catch((err) => {
                        debug('add crawllinks failed - ', err);
                        // TODO: Should reschedule tasks
                        return Promise.reject(new Error('Add crawllinks failed' + err));
                    });
            })
            .then(() => {
                // Update crawlsite item state
                // TODO: Set pagination handler
                const context = {
                    id: workingLog.id,
                    context: {
                        user: '1'
                    }
                };
                return updateLog(context);
            })
            .catch((err) => {
                debug(err);
            });
    },
    linkCrawler: function () {
        debug('link engine start')
        // Load link
        let crawllinks = []
        return crawllinkAPI.browse({
            status: 'pending'
        })
            .then(resp => {
                if (resp && resp.crawllinks) {
                    crawllinks = resp.crawllinks
                }
            })
            .then(() => {
                return crawlLinks(crawllinks)
            })
            .then((links) => {
                debug('links crawlled back with - ', links)
                let updateDBPromises = links.map(link => {
                    return createPost({
                        title: link.title,
                        slug: '',
                        status: 'draft',
                        published_at: new Date(),
                        mobiledoc: markdownToMobiledoc(link.content),
                        html: link.content
                    })
                })
                return Promise.all(updateDBPromises)
                    .then(() => {
                        console.log()
                    })
            })
            .catch(err => {
                debug('linkCrawler error - ', err)
            })
        // crawl
        // generate post
        // update link record
    }
};
