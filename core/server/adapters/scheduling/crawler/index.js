let crawlTask = require('./crawl').siteCrawler;
let cron = require('./cron');

exports.init = function () {
    let job = cron.init(crawlTask);
    console.log('job - ', job.running);
    return job;
};
