let github = require('./auth.json').github;

console.log('----username----', github.username);

const auth = function (pageInst) {
    if (pageInst) {
        let url = pageInst.url();
        console.log(' - ', url.replace(/^http(s)?:\/\//, ''));
        if (url.replace(/^http(s)?:\/\//i, '').startsWith(`${github.host}/login`)) {
            return pageInst.click(github.USERNAME_SELECTOR)
                .then(() => {
                    return pageInst.keyboard.type(github.username);
                })
                .then(() => {
                    return pageInst.click(github.PASSWORD_SELECTOR);
                })
                .then(() => {
                    return pageInst.keyboard.type(github.password);
                })
                .then(() => {
                    return pageInst.click(github.BUTTON_SELECTOR);
                })
                .then(() => {
                    return pageInst.waitForNavigation();
                })
        } else {
            return Promise.resolve();
        }
    }
};

module.exports = auth;
