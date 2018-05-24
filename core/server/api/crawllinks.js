// # Posts API
// RESTful API for the Post resource
const Promise = require('bluebird'),
    _ = require('lodash'),
    pipeline = require('../lib/promise/pipeline'),
    localUtils = require('./utils'),
    models = require('../models'),
    common = require('../lib/common'),
    docName = 'crawllinks',

    allowedIncludes = [
        'crawlsite_id', 'post_id', 'query_rule', 'status', 'created_at', 'updated_at'
    ],
    unsafeAttrs = [];

let crawllinks;

/**
 * ### crawllinks API Methods
 *
 * **See:** [API Methods](constants.js.html#api%20methods)
 */

crawllinks = {
    /**
     * ## Browse
     * Find a paginated set of Crawllinks
     *
     * @public
     * @param {{context, page, limit, status}} options (optional)
     * @returns {Promise<Crawllinks>} Crawllinks Collection with Meta
     */
    browse: function browse(options) {
        var extraOptions = [],
            permittedOptions,
            tasks;

        permittedOptions = localUtils.browseDefaultOptions.concat(extraOptions);

        /**
         * ### Model Query
         *  Make the call to the Model layer
         * @param {Object} options
         * @returns {Object} options
         */
        function modelQuery(options) {
            return models.Crawllink.findPage(options);
        }

        // Push all of our tasks into a `tasks` array in the correct order
        tasks = [
            localUtils.validate(docName, {opts: permittedOptions}),
            localUtils.convertOptions(allowedIncludes, models.Crawllink.allowedFormats),
            localUtils.handlePublicPermissions(docName, 'browse', unsafeAttrs),
            modelQuery
        ];

        // Pipeline calls each task passing the result of one to be the arguments for the next
        return pipeline(tasks, options);
    },

    /**
     * ## Read
     * Find a Crawllink, by ID, status, or res_url
     *
     * @public
     * @param {Object} options
     * @return {Promise<Crawllink>} Crawllinks
     */
    read: function read(options) {
        var attrs = ['id', 'res_url', 'status'],
            // NOTE: the scheduler API uses the post API and forwards custom options
            extraAllowedOptions = options.opts || ['formats'],
            tasks;

        /**
         * ### Model Query
         * Make the call to the Model layer
         * @param {Object} options
         * @returns {Object} options
         */
        function modelQuery(options) {
            return models.Crawllink.findOne(options.data, _.omit(options, ['data']))
                .then(function onModelResponse(model) {
                    if (!model) {
                        return Promise.reject(new common.errors.NotFoundError({
                            message: common.i18n.t('errors.api.posts.postNotFound')
                        }));
                    }

                    return {
                        crawllinks: [model.toJSON(options)]
                    };
                });
        }

        // Push all of our tasks into a `tasks` array in the correct order
        tasks = [
            localUtils.validate(docName, {attrs: attrs, opts: extraAllowedOptions}),
            localUtils.convertOptions(allowedIncludes, models.Crawllink.allowedFormats),
            localUtils.handlePublicPermissions(docName, 'read', unsafeAttrs),
            modelQuery
        ];

        // Pipeline calls each task passing the result of one to be the arguments for the next
        return pipeline(tasks, options);
    },

    /**
     * ## Edit
     * Update properties of a Crawllink
     *
     * @public
     * @param {Crawllink} object Crawllink or specific properties to update
     * @param {{id (required), context, include,...}} options
     * @return {Promise(Crawllink)} Edited Crawllink
     */
    edit: function edit(object, options) {
        var tasks;

        /**
         * ### Model Query
         * Make the call to the Model layer
         * @param {Object} options
         * @returns {Object} options
         */
        function modelQuery(options) {
            return models.Crawllink.edit(options.data.crawllinks[0], _.omit(options, ['data']))
                .then(function onModelResponse(model) {
                    if (!model) {
                        return Promise.reject(new common.errors.NotFoundError({
                            message: common.i18n.t('errors.api.posts.postNotFound')
                        }));
                    }

                    return {
                        crawllinks: [model.toJSON(options)]
                    };
                });
        }

        // Push all of our tasks into a `tasks` array in the correct order
        tasks = [
            localUtils.validate(docName, {opts: localUtils.idDefaultOptions}),
            localUtils.convertOptions(allowedIncludes),
            localUtils.handlePermissions(docName, 'edit'),
            modelQuery
        ];

        // Pipeline calls each task passing the result of one to be the arguments for the next
        return pipeline(tasks, object, options);
    },

    /**
     * ## Add
     * Create a new Crawllink along with any tags
     *
     * @public
     * @param {Crawllinks} object
     * @param {{context, include,...}} options
     * @return {Promise(Crawllink)} Created Crawllink
     */
    add: function add(object, options) {
        var tasks;
        /**
         * ### Model Query
         * Make the call to the Model layer
         * @param {Object} options
         * @returns {Object} options
         */
        function modelQuery(options) {
            return models.Crawllink.add(options.data.crawllinks[0], _.omit(options, ['data']))
                .then(function onModelResponse(model) {
                    return {crawllinks: [model.toJSON(options)]};
                });
        }

        // Push all of our tasks into a `tasks` array in the correct order
        tasks = [
            localUtils.validate(docName),
            localUtils.convertOptions(allowedIncludes),
            localUtils.handlePermissions(docName, 'add', unsafeAttrs),
            modelQuery
        ];

        // Pipeline calls each task passing the result of one to be the arguments for the next
        return pipeline(tasks, object, options);
    },

    /**
     * ## Destroy
     * Delete a Crawllink, cleans up tag relations, but not unused tags.
     * You can only delete a Crawllink by `id`.
     *
     * @public
     * @param {{id (required), context,...}} options
     * @return {Promise}
     */
    destroy: function destroy(options) {
        var tasks;

        /**
         * @function deleteCrawllink
         * @param  {Object} options
         */
        function deleteCrawllink(options) {
            const opts = _.defaults({require: true}, options);

            return models.Crawllink.destroy(opts).return(null)
                .catch(models.Crawllink.NotFoundError, function () {
                    throw new common.errors.NotFoundError({
                        message: common.i18n.t('errors.api.posts.postNotFound')
                    });
                });
        }

        // Push all of our tasks into a `tasks` array in the correct order
        tasks = [
            localUtils.validate(docName, {opts: localUtils.idDefaultOptions}),
            localUtils.convertOptions(allowedIncludes),
            localUtils.handlePermissions(docName, 'destroy', unsafeAttrs),
            deleteCrawllink
        ];

        // Pipeline calls each task passing the result of one to be the arguments for the next
        return pipeline(tasks, options);
    }
};

module.exports = crawllinks;
