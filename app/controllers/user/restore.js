import Ember from 'ember';


export default Ember.Controller.extend({
  actions: {
    logDevices: function() {
      console.log(this.get('devices'));
    },

    // pick out new device from old, get default sketch from server, send to toy
    // test connection
    restore: function() {
      let _this = this;
      let toy = _this.get('toy');

      _this.set('restoreStatus', "Finding your toy...");
      _this.findNewDevice()
      .then(function() {
        return new Promise(function(go) {
          _this.set('restoreStatus', "Downloading sofware from server...");
          go();
        });
      }.bind(_this))
      .then(toy.getDefault.bind(toy))
      .then(function() {
        return new Promise(function(go) {
          _this.set('restoreStatus', "Uploading software to toy...");
          go();
        });
      }.bind(_this))
      .then(toy.sendSketch.bind(toy))
      .then(function() {
        _this.set('restoreStatus', "Finished!");
        _this.transitionTo('/quicky');
      }, function(err) {
        console.log('restoreStatus', err);
        _this.set('restoreStatus', err);
      });
    },

    setStatus: function(status) {
      this.set('restoreStatus', status);
    }
  },

  status: function() {
    console.log("status");
    return this.get('restoreStatus');
  }.property('restoreStatus'),

  findNewDevice: function() {
    let _this = this;
    _this.set('connectionAttempts', 0);
    let toy = _this.get('toy');
    return new Promise(function(resolve, reject) {
      let getDevicesLoop = function() {
        chrome.serial.getDevices(function (devices) {
          let oldDevices = _this.get('devices');
          for (let i = 0; i < devices.length; i++) {
            for (let j = 0; j < oldDevices.length; j++) {
              if (devices[i].path === oldDevices[j].path) {
                devices.splice(i,1);
              }
            }
          }
          if (devices.length > 0) {
            toy.set('device', devices[0]);
            console.log('found this:');
            console.log(devices[0]);
            resolve();
          } else {
            let connectionAttempts = _this.get('connectionAttempts');
            if (connectionAttempts > 8) {
              console.log("connection timeout"); // XXX handle an error here.
              reject("Connection timeout.");
            } else {
              _this.set('connectionAttempts', connectionAttempts+1);
              setTimeout(getDevicesLoop, 1000);
            }
          }
        });
      };
      getDevicesLoop();
    });

  }


});
