let puppeteer = require('puppeteer');
let auth = require('./auth.js');
let debug = require('ghost-ignition').debug('puppeter');

module.exports = function (log) {
    if (!log) {
        return Promise.reject();
    }
    const url = log.res_url;
    const query = log.query_rule;
    let brow;
    return puppeteer.launch()
        .then(insta => {
            brow = insta;
            return brow.newPage();
        })
        .then(page => {
            return page.goto(url)
                .then((resp) => {
                    debug('page - ', resp);
                    return auth(page).then(() => {
                        return page.pdf({path: './page.001.pdf',  format: 'A4'})
                    })
                })
                .then(() => {
                    return page.$$(query)
                })
                .then((list) => {
                    debug('---list---', list && list.length);
                    return list;
                })
        })
        .then((res) => {
            brow.close();
            return res;
        });
}

