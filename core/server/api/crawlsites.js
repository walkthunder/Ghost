// # Posts API
// RESTful API for the Post resource
const Promise = require('bluebird'),
    _ = require('lodash'),
    pipeline = require('../lib/promise/pipeline'),
    localUtils = require('./utils'),
    models = require('../models'),
    common = require('../lib/common'),
    docName = 'crawlsites',

    allowedIncludes = [
        'res_url', 'query_rule', 'interval', 'status', 'created_at', 'updated_at'
    ],
    unsafeAttrs = [];

let crawlsites;

/**
 * ### crawlSites API Methods
 *
 * **See:** [API Methods](constants.js.html#api%20methods)
 */

crawlsites = {
    /**
     * ## Browse
     * Find a paginated set of Crawlsites
     *
     * @public
     * @param {{context, page, limit, status}} options (optional)
     * @returns {Promise<Crawlsites>} Crawlsites Collection with Meta
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
            return models.Crawlsite.findPage(options);
        }

        // Push all of our tasks into a `tasks` array in the correct order
        tasks = [
            localUtils.validate(docName, {opts: permittedOptions}),
            localUtils.convertOptions(allowedIncludes, models.Crawlsite.allowedFormats),
            localUtils.handlePublicPermissions(docName, 'browse', unsafeAttrs),
            modelQuery
        ];

        // Pipeline calls each task passing the result of one to be the arguments for the next
        return pipeline(tasks, options);
    },

    /**
     * ## Read
     * Find a Crawlsite, by ID, status, or res_url
     *
     * @public
     * @param {Object} options
     * @return {Promise<Crawlsite>} Crawlsites
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
            return models.Crawlsite.findOne(options.data, _.omit(options, ['data']))
                .then(function onModelResponse(model) {
                    if (!model) {
                        return Promise.reject(new common.errors.NotFoundError({
                            message: common.i18n.t('errors.api.posts.postNotFound')
                        }));
                    }

                    return {
                        crawlsites: [model.toJSON(options)]
                    };
                });
        }

        // Push all of our tasks into a `tasks` array in the correct order
        tasks = [
            localUtils.validate(docName, {attrs: attrs, opts: extraAllowedOptions}),
            localUtils.convertOptions(allowedIncludes, models.Crawlsite.allowedFormats),
            localUtils.handlePublicPermissions(docName, 'read', unsafeAttrs),
            modelQuery
        ];

        // Pipeline calls each task passing the result of one to be the arguments for the next
        return pipeline(tasks, options);
    },

    /**
     * ## Edit
     * Update properties of a Crawlsite
     *
     * @public
     * @param {Crawlsite} object Crawlsite or specific properties to update
     * @param {{id (required), context, include,...}} options
     * @return {Promise(Crawlsite)} Edited Crawlsite
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
            return models.Crawlsite.edit(options.data['crawlsites'][0], _.omit(options, ['data']))
                .then(function onModelResponse(model) {
                    if (!model) {
                        return Promise.reject(new common.errors.NotFoundError({
                            message: common.i18n.t('errors.api.posts.postNotFound')
                        }));
                    }

                    return {
                        crawlsites: [model.toJSON(options)]
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
     * Create a new Crawlsite along with any tags
     *
     * @public
     * @param {Crawlsites} object
     * @param {{context, include,...}} options
     * @return {Promise(Crawlsite)} Created Crawlsite
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
            return models.Crawlsite.add(options.data['crawlsites'][0], _.omit(options, ['data']))
                .then(function onModelResponse(model) {
                    return {crawlsites: [model.toJSON(options)]};
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
     * Delete a crawlSite, cleans up tag relations, but not unused tags.
     * You can only delete a crawlSite by `id`.
     *
     * @public
     * @param {{id (required), context,...}} options
     * @return {Promise}
     */
    destroy: function destroy(options) {
        var tasks;

        /**
         * @function deleteCrawlsite
         * @param  {Object} options
         */
        function deleteCrawlsite(options) {
            const opts = _.defaults({require: true}, options);

            return models.Crawlsite.destroy(opts).return(null)
                .catch(models.Crawlsite.NotFoundError, function () {
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
            deleteCrawlsite
        ];

        // Pipeline calls each task passing the result of one to be the arguments for the next
        return pipeline(tasks, options);
    }
};

module.exports = crawlsites;
