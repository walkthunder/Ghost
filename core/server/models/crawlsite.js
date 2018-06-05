// # Post Model
var ghostBookshelf = require('./base'),
    Crawlsite,
    Crawlsites;
const {CRAWLSITE_INTERVAL} = require('../config/vars');

Crawlsite = ghostBookshelf.Model.extend({

    tableName: 'crawlsites',

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
            interval: CRAWLSITE_INTERVAL,
            status: 'open'
        };
    }
}, {
    orderDefaultOptions: function orderDefaultOptions() {
        return {};
    },
    processOptions: function processOptions(options) {
        return options;
    },
    /**
     * Returns an array of keys permitted in a method's `options` hash, depending on the current method.
     * @param {String} methodName The name of the method to check valid options for.
     * @return {Array} Keys allowed in the `options` hash of the model's method.
     */
    permittedOptions: function permittedOptions(methodName) {
        var options = ghostBookshelf.Model.permittedOptions(),

            // whitelists for the `options` hash argument on methods, by method name.
            // these are the only options that can be passed to Bookshelf / Knex.
            validOptions = {
                findOne: ['columns', 'importing', 'withRelated', 'require'],
                findPage: ['page', 'limit', 'status', 'crawlsiteId', 'postId'],
                findAll: ['columns', 'filter']
            };

        if (validOptions[methodName]) {
            options = options.concat(validOptions[methodName]);
        }
        return options;
    }
});

Crawlsites = ghostBookshelf.Collection.extend({
    model: Crawlsite
});

module.exports = {
    Crawlsite: ghostBookshelf.model('Crawlsite', Crawlsite),
    Crawlsites: ghostBookshelf.collection('Crawlsites', Crawlsites)
};
