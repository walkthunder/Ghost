var util = require('util');

// If this require does not work, then your content folder structure is different
// So change the require path so that your adapter can import the scheduling base.
var SchedulingBase = require('../../core/server/adapters/scheduling/SchedulingBase');

class Collector extends SchedulingBase {
  constructor(options) {
    super(options);
  }
  schedule(object) {
    // when the job should be executed (time is a UTC timestamp)
    var time = object.time;
    // the url you need to execute when the time is reached
    var url = object.url;

    // the HTTP method you need to use
    var httpMethod = object.extra.httpMethod;
  };
}

Collector.prototype.reschedule = function(object) {
    // see Collector.prototype.schedule

    // the time when the url was scheduled before (oldTime is a UTC timestamp)
    var oldTime = object.extra.oldTime;
};

Collector.prototype.unschedule = function(object) {
    // see Collector.prototype.schedule
};

//this function is called on server bootstrap
Collector.prototype.run = function() {
  console.log('----auto collector----');
};

module.exports = Collector;