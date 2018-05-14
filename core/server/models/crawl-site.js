// # Post Model
var _ = require('lodash'),
    uuid = require('uuid'),
    ghostBookshelf = require('./base'),
    CrawlSite,
    CrawlSites;

CrawlSite = ghostBookshelf.Model.extend({

    tableName: 'crawl_sites',

    /**
     * ## NOTE:
     * We define the defaults on the schema (db) and model level.
     * When inserting resources, the defaults are available **after** calling `.save`.
     * But they are available when the model hooks are triggered (e.g. onSaving).
     * It might be useful to keep them in the model layer for any connected logic.
     *
     * e.g. if `model.get('status') === draft; do something;
     */
    defaults: function defaults() {
        return {
            uuid: uuid.v4(),
            status: 'open'
        };
    }
}, {
    orderDefaultOptions: function orderDefaultOptions() {
        return {
            status: 'ASC',
            created_at: 'DESC',
            updated_at: 'DESC',
            id: 'DESC'
        };
    },
    processOptions: function processOptions(options) {
        if (!options.status) {
            return options;
        }

        // This is the only place that 'options.where' is set now
        options.where = {statements: []};
        const valideStatus = ['open', 'paused', 'shut'];
        // Unless `all` is passed as an option, filter on
        // the status provided.
        if (options.status && options.status !== 'all') {
            // make sure that status is valid
            options.status = _.includes(valideStatus, options.status) ? options.status : 'open';
            options.where.statements.push({prop: 'status', op: '=', value: options.status});
            delete options.status;
        } else if (options.status === 'all') {
            options.where.statements.push({prop: 'status', op: 'IN', value: valideStatus});
            delete options.status;
        }

        return options;
    }
});

CrawlSites = ghostBookshelf.Collection.extend({
    model: CrawlSite
});

module.exports = {
    CrawlSite: ghostBookshelf.model('CrawlSite', CrawlSite),
    CrawlSites: ghostBookshelf.collection('CrawlSites', CrawlSites)
};
