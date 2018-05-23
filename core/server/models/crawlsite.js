// # Post Model
var ghostBookshelf = require('./base'),
    Crawlsite,
    Crawlsites;

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
            status: 'open'
        };
    }
}, {
    orderDefaultOptions: function orderDefaultOptions() {
        return {};
    },
    processOptions: function processOptions(options) {
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
