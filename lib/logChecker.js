var events = require('events'),
	request = require('request'),
	sugar = require('sugar'),
	moment = require('moment');
function LogChecker(options) {
	
	this.options = options;
	
    this.time = options.time;
    this.events = [];
    var that;
    events.EventEmitter.call(this);

	this.makeRequest = function(callback){
		request({
		  uri: "http://"+that.options.ip+"/get_log.cgi?",
		  method: "GET",
		  qs: {
		    user: that.options.user,
		    pwd:that.options.pwd
		  }
		}, function(error, response, body) {
		  
		  if(!error && response.statusCode == 200){
			  callback(body)
		  }
		 });
		 
	}
    this.init = function()
    {
        that = this;
        console.log("Log updater started...");
        that.makeRequest(function(body) {
		  
		  var logs = body.remove("var log_text='").remove("';").split("\\n").compact(true);
		  that.events = logs
		 });
        //Start interval
        setInterval(that.run,that.time);
    };

    this.run = function()
    {
	    
	    that.makeRequest(function(body) {
		  
		  var logs = body.remove("var log_text='").remove("';").split("\\n").compact(true);
		  var current = logs.last();
		  var last_motion = that.events.last();
		  if(current !== last_motion){
			  var motionTime = logs.last().split("  ")[0].split(", ")[1]; 
			  that.emit('motion', {
				  time: motionTime,
				  timeStamp: moment(motionTime).unix()
				  
			  });
			  that.events = logs;
			  console.log("Motion detected! emitting event");
		  }
		});
	    
    };
}

LogChecker.prototype.__proto__ = events.EventEmitter.prototype;

exports.LogChecker = LogChecker;

