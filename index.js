var Service;
var Characteristic;
var debug = require("debug")("FoscamSensorAccessory");
var crypto = require("crypto");
var MotionUpdater = require('./lib/logChecker').LogChecker;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory("homebridge-foscamsensor", "FoscamSensor", FoscamSensorAccessory);
}

function FoscamSensorAccessory(log, config) {
  this.log = log;

  // url info
  this.name = config["name"];
  this.ip = config["ip"];
  this.interval = config["interval"] || 3000;
  this.user = config["user"];
  this.pwd = config["pwd"];

  if(config["sn"]){
      this.sn = config["sn"];
  } else {
      var shasum = crypto.createHash('sha1');
      shasum.update(this.path);
      this.sn = shasum.digest('base64');
      debug('Computed SN ' + this.sn);
  }
}

FoscamSensorAccessory.prototype = {

  getServices: function() {

    // you can OPTIONALLY create an information service if you wish to override
    // the default values for things like serial number, model, etc.
    var informationService = new Service.AccessoryInformation();

    informationService
      .setCharacteristic(Characteristic.Name, this.name)
      .setCharacteristic(Characteristic.Manufacturer, "Homebridge")
      .setCharacteristic(Characteristic.Model, "Foscam Sensor")
      .setCharacteristic(Characteristic.SerialNumber, this.sn);

    var service, changeAction;
    
    service = new Service.MotionSensor();
    changeAction = function(newState){
        service.getCharacteristic(Characteristic.MotionDetected)
                .setValue(newState);
    };
    

    var motionHandler = function(){
        var d = new Date();
        if(d.getTime() - stats.mtime.getTime() <= (this.window_seconds * 1000)){
            var newState = this.inverse ? false : true;
            changeAction(newState);
            if(this.timer !== undefined) clearTimeout(this.timer);
            this.timer = setTimeout(function(){changeAction(!newState);}, this.window_seconds * 1000);
        }
    }.bind(this);



	var motionChecker = new MotionUpdater({
		time: this.time,
		ip: this.ip,
		user: this.user,
		pwd: this.pwd
	});

	motionChecker.init();
	motionChecker.on('motion',motionHandler);


    return [informationService, service];
  }
};