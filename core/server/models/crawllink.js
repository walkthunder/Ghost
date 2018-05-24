// # Post Model
var ghostBookshelf = require('./base'),
    Crawllink,
    Crawllinks;

Crawllink = ghostBookshelf.Model.extend({

    tableName: 'crawllinks',

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
            status: 'pending'
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

Crawllinks = ghostBookshelf.Collection.extend({
    model: Crawllink
});

module.exports = {
    Crawllink: ghostBookshelf.model('Crawllink', Crawllink),
    Crawllinks: ghostBookshelf.collection('Crawllinks', Crawllinks)
};
