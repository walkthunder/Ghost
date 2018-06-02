let CronJob = require('cron').CronJob;

exports.init = function (task, runTime = '00 * * * *') {
    if (typeof task === 'function') {
        let crawlJob = new CronJob({
            cronTime: '00 * * * * *',
            onTick: task,
            start: true
        });
        crawlJob.start();
        return crawlJob;
    }
};
