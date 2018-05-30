let debug = require('ghost-ignition').debug('crawler');
let crawllinkAPI = require('../../../api/crawllinks');
let crawlsiteAPI = require('../../../api/crawlsites');
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
    return [];
};

module.exports = {
    run: function () {
        debug('engine start');
        let workingLog;
        return loadLog()
            .then((resp) => {
                debug('load log from DB - ', resp);

                if (!(resp && resp.crawlsites)) {
                    return Promise.reject(new Error('Load log failed'));
                }
                workingLog = resp.crawlsites[0];
                return crawl(workingLog);
            })
            .then((cls) => {
                let addPromises = cls.map((cl) => {
                    return crawllinkAPI.add(cl)
                        .then((resp) => {
                            debug('added crawllink resp - ', resp);
                            return resp;
                        });
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
            });
    }
};
