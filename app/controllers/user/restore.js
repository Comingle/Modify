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

      _this.get('target').send("displayOverlay");
      toy.set('progress', "Finding your toy...");
      _this.findNewDevice()
      .then(toy.getDefault.bind(toy))
      .then(toy.sendSketch.bind(toy))
      .then(function() {
        let toy = _this.get('toy');
        toy.set('progress', "Finished!");
        _this.get('target').send("hideOverlay");
        _this.transitionTo('/user/quicky');
      }.bind(toy), function(err) {
        _this.set('toy.progress', err);
        console.log('restoreStatus', err);
      });
    }

  },

  //  runs chrome.serial.getDevices multiple times, presumably after the user
  //  has dropped their toy in to bootloader mode. it sometimes takes a few
  //  seconds for the serial port to reappear.
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
            // bootloader is only active for 8 seconds
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
