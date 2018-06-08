let puppeteer = require('puppeteer');
let auth = require('./auth.js');
let debug = require('ghost-ignition').debug('puppeter');

module.exports = function (log, type = 'site') {
    if (!log) {
        return Promise.reject();
    }
    const url = (type === 'link') ? log.uri : log.res_url
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
                .then(() => {
                    return auth(page).then(() => {
                        return page.pdf({path: `./page.${url}.pdf`,  format: 'A4'})
                    })
                })
                .then(() => {
                    /* global document, window */
                    return page.evaluate((sel) => {
                        if (type === 'site') {
                            return [...(document.querySelectorAll(sel) || [])].map(item => item.href) // eslint-disable-line arrow-body-style
                        }
                        let target = document.querySelectorAll(sel)
                        return {
                            title: document.title || window.location.href,
                            content: target.innerHTML
                        }
                    }, query)
                })
        })
        .then((res) => {
            debug('final res - ', res)
            brow.close();
            return res;
        });
}

