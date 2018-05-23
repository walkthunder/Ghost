// # uncapitalise Middleware
// Usage: uncapitalise(req, res, next)
// After:
// Before:
// App: Admin|Site|API
//
// Detect upper case in req.path.
//
//  Example req:
//  req.originalUrl = /blog/ghost/signin/?asdAD=asdAS
//  req.url = /ghost/signin/?asdAD=asdAS
//  req.baseUrl = /blog
//  req.path =  /ghost/signin/

var urlService = require('../../services/url'),
    common = require('../../lib/common'),
    localUtils = require('../utils'),
    uncapitalise;

uncapitalise = function uncapitalise(req, res, next) {
    var pathToTest = (req.baseUrl ? req.baseUrl : '') + req.path,
        isSignupOrReset = pathToTest.match(/^(.*\/ghost\/(signup|reset)\/)/i),
        isAPI = pathToTest.match(/^(.*\/ghost\/api\/v[\d\.]+\/.*?\/)/i),
        redirectPath, decodedURI;
    console.log('----un capitalise----');
    if (isSignupOrReset) {
        pathToTest = isSignupOrReset[1];
    }

    // Do not lowercase anything after /api/v0.1/ to protect :key/:slug
    if (isAPI) {
        pathToTest = isAPI[1];
    }

    try {
        decodedURI = decodeURIComponent(pathToTest);
    } catch (err) {
        return next(new common.errors.NotFoundError({
            message: common.i18n.t('errors.errors.pageNotFound'),
            err: err
        }));
    }
    console.log('----un capitalise----', decodedURI);

    /**
     * In node < 0.11.1 req.path is not encoded, afterwards, it is always encoded such that | becomes %7C etc.
     * That encoding isn't useful here, as it triggers an extra uncapitalise redirect, so we decode the path first
     */
    if (/[A-Z]/.test(decodedURI)) {
        redirectPath = (localUtils.removeOpenRedirectFromUrl((req.originalUrl || req.url).replace(pathToTest, pathToTest.toLowerCase())));
        console.log('----un capitalise----', redirectPath);

        return urlService.utils.redirect301(res, redirectPath);
    }
    console.log('----un capitalise----');

    next();
};

module.exports = uncapitalise;
