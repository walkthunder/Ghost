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
        if (!options.status) {
            return options;
        }

        // This is the only place that 'options.where' is set now
        options.where = {statements: []};
        const sllStatuses = ['pending', 'done', 'failed'];
        // Unless `all` is passed as an option, filter on
        // the status provided.
        if (options.status && options.status !== 'all' && (sllStatuses.indexOf(options.status) > -1)) {
            // make sure that status is valid
            options.where.statements.push({prop: 'status', op: '=', value: options.status});
            delete options.status;
        } else {
            options.where.statements.push({prop: 'status', op: 'IN', value: sllStatuses});
            delete options.status;
        }

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
                findPage: ['status'],
                findAll: ['columns', 'filter']
            };

        if (validOptions[methodName]) {
            options = options.concat(validOptions[methodName]);
        }
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
