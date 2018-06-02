let crawlTask = require('./crawl').siteCrawler;
let cron = require('./cron');

exports.init = function () {
    console.log('---crawlTask--', crawlTask);
    let job = cron.init(crawlTask);
    console.log('job - ', job.running);
    return job;
};
