let puppeteer = require('puppeteer');
let auth = require('./auth.js');
let debug = require('ghost-ignition').debug('puppeter');

module.exports = function (log) {
    if (!log) {
        return Promise.reject();
    }
    const url = log.res_url;
    const query = log.query_rule;
    const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
    let brow;
    return puppeteer.launch()
        .then(insta => {
            brow = insta;
            return brow.newPage();
        })
        .then(page => {
            return page.setUserAgent(UA)
                .then(() => {
                    return page.goto(url)
                })
                .then((resp) => {
                    return auth(page).then(() => {
                        return page.pdf({path: `./page.${url}.pdf`,  format: 'A4'})
                    })
                })
                .then((res) => {
                    return page.evaluate((sel) => {
                        return [...(document.querySelectorAll(sel) || [])].map(item => {
                            return item.href;
                        })
                    }, query)
                })
        })
        .then((res) => {
            console.log('final res - ', res)
            brow.close();
            return res;
        });
}

