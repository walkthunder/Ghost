let debug = require('ghost-ignition').debug('crawler');
let crawllinkAPI = require('../../../api/crawllinks');
let crawlsiteAPI = require('../../../api/crawlsites');
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

const crawl = function (log) {
    debug('crawl log - ', log);
    return puppeter(log)
};

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
    }
};
