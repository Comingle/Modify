import Ember from 'ember';
import Arduino from 'chrome-app/lib/arduino-library/arduino';
import config from '../config/environment';

export default Ember.Service.extend({
  kBitrate: 9600,
  sendTimeout: 1000,
  receiveTimeout: 1000,
  serverFindSketchEndpoint: "/api/v1/sketches/find",
  defaultSketchEndpoint: "/api/v1/sketches/default",

  // download sketch from toy in intel HEX format.
  getSketchParams: function () {
    let _this = this;
    console.log("getSketchParams");

    // our actual sketch-grabbing callback. called from Avr109.readPageHandler
    let f = function(sketch) {
      console.log("callback");
      this.set('sketch', sketch);
      this.reviveConnection();
    }.bind(this);

    let arduino = new Arduino(chrome.serial);

    return new Promise (function(resolve, reject) {
      arduino.connect(_this.get('device')).then(function() {
        arduino.getSketch(f).then(resolve, reject);
      },
      function() { // reject
        console.log("Could not connect to Mod.");
        reject();
      });
    });
  },

  sendSketch: function () {
    let _this = this;
    let arduino = new Arduino(chrome.serial);
    return new Promise (function(resolve, reject) {
      arduino.connect(_this.get('device')).then(function() {
        if (!_this.get('sketch')) {
          reject("Could not find sketch.");
        } else {
          arduino.uploadSketch(_this.get('sketch')).then(function() {
            _this.reviveConnection();
            resolve();
          });
        }
      },
      function() {
        console.log("Could not connect to Mod.");
        reject("Could not connect to Mod.");
      });
    });
  },

  // wait till we have a sketch, then add a 'device_lost' error listener
  // since the toy goes away after bootloader programming.
  // we give it 5 2-second long attempts for the device to show up.
  reviveConnection: function() {
    let _this = this;
    if (!_this.get('sketch')) return;
    _this.set('connectionAttempts', 0);

    let getDevicesLoop = function() {
      chrome.serial.getDevices(function(devs) {
        let found = -1;
        for (let i = 0; i < devs.length; i++) {
          if (devs[i].path === _this.get('device.path')) {
            found = i;
            break;
          }
        }
        if (found < 0) {
          let connectionAttempts = _this.get('connectionAttempts');
          if (connectionAttempts > 5) {
            console.log("connection timeout"); // XXX handle an error here.
          } else {
            _this.set('connectionAttempts', connectionAttempts+1);
            setTimeout(getDevicesLoop, 2000);
          }
        } else {
          _this.connectDevice(_this.get('device'));
        }
      });
    }

    let deviceLost = function(info) {
      if (info.error === 'device_lost') {
        setTimeout(function() {
          getDevicesLoop(); //
          chrome.serial.onReceiveError.removeListener(deviceLost);
        }, 2000);
      }
    };
    chrome.serial.onReceiveError.addListener(deviceLost);

  },

  // fetches the default sketch from the backend and stores it in toy.sketch
  getDefault: function () {
    let _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax({
        url:        config.domain + _this.defaultSketchEndpoint,
        type:       'GET',
        dataType:   'json',
        success:    function(data, status, xhr) {
          _this.set('sketch', data.hex);
          resolve(data, status, xhr);
          },
        error:      function(xhr, status, error) { reject(xhr, status, error); },
        beforeSend: function(xhr, settings) {
          xhr.setRequestHeader('Accept', settings.accepts.json);
        }
      });
    });
  },

  // take the hex file in toy.sketch and send it to the server. set toy.config with result json.
  findSketch: function() {
    let _this = this;
    let data = {sketch: _this.get('sketch') };
    return new Promise(function(sketchFound, sketchError) {
      try {
        Ember.$.ajax({
          url:        config.domain + _this.serverFindSketchEndpoint,
          type:       'POST',
          data:       data,
          dataType:   'json',
          success:    function(data, status, xhr) {
            _this.set('config', data.sketch.config);
            _this.set('fingerprint', data.sketch.fingerprint);
            sketchFound(data, status, xhr); },
          error:      function(xhr, status, error) {
            _this.set('config', null);
            sketchError(xhr, status, error); },
          beforeSend: function(xhr, settings) {
            xhr.setRequestHeader('Accept', settings.accepts.json);
          }
        });
      } catch(e) {
        sketchError("", "", e);
      };
    });
  },

  connectDevice: function (device) {
    this.set('device', device);
    return this._connect(device);
  },

  // connects to a device, sends it data, and rates the connection based on
  // ability to connect (0 for no connection, 1 for connection), and receiving the correct response after
  // sending it a ping command ("i,0" -- get the value of input 0, so the toy should respond
  // with a value between 0 and 1023 inclusive.
  testDevice: function (device) {
    let _this = this;
    _this.connectDevice(device).then(function() {
      console.log('testDevice');
      let connectionId = _this.get('connectionId');
      if (chrome.serial) {

        //  put receiver and errorReceiver in variables so they can
        //  reference themselves and remove their listener.
        let receiver = function(info) {
          if (info.connectionId === connectionId) {
            _this.set('hasDevice', 1);
            _this.set("deviceStatus", "Connected with communication errors.");
            if (0 <= parseInt(info.data) < 1024) {
              _this.set('hasDevice', 2);
              _this.set("deviceStatus", "Connected.");
            }
            chrome.serial.update(info.connectionId, { receiveTimeout: 0 }, function() {
              console.log("Received first.");
              chrome.serial.onReceive.removeListener(receiver);
              chrome.serial.disconnect(info.connectionId, function (b) {
                if (b) {
                  _this.connectionId = null;
                }
                console.log("Disconnect: " + b);
              });
            });
          }
        };

        let errorReceiver = function (info) {
          if (info.error === 'timeout' && info.connectionId === connectionId) {
            chrome.serial.update(info.connectionId, { receiveTimeout: 0}, function() {
              console.log("Receive error first. Removing timeout.");
              _this.set('hasDevice', 0);
              _this.set("deviceStatus", "Connection timeout.");
              chrome.serial.onReceiveError.removeListener(errorReceiver);
              chrome.serial.disconnect(info.connectionId, function (b) {
                if (b) {
                  _this.connectionId = null;
                }
                console.log("Disconnect: " + b);
              });
            });
          }
        };

        // we're going to send data, start a timeout and race onReceive versus onReceiveError:
        // if onReceive gets it first, then we're good
        // if onReceiveError gets it first, then we've timed out and our device/connection is bad.
        chrome.serial.onReceive.addListener(receiver);
        chrome.serial.onReceiveError.addListener(errorReceiver);

        // start the test
        // "i,0" command (read from first input). expect an int from 0-1023 inclusive.
        let testString = _this._stringToBinary("i,0\r\n");
        chrome.serial.update(connectionId, { receiveTimeout: _this.receiveTimeout}, function(result) {
          if (result) {
            chrome.serial.send(connectionId, testString, function(info) {
              console.log("Sent: ");
              console.log(info);
            });
          } else {
            console.log('serial update failed.');
          }
        });

      }
    });

  },

  nextFrame: function (frame) {
    var newBinary = this._getNewBinary(frame);
    var callback = function () {};
    if (chrome.serial) {
      chrome.serial.send(this.get('connectionId'), newBinary, callback);
    }
  },

  startPlaying: function (frames) {
    this.stopPlaying();
    this.set('playFrames', frames);
    var totalIndexes = frames.get('length') - 1;
    var currentIndex = 0;
    this.set('play', true);
    this.playNextRecursion(currentIndex, totalIndexes);
  },

  playNextRecursion: function (currentIndex, totalIndexes) {
    var _this = this;
    var frame = this.get('playFrames').objectAt(currentIndex);
    if (frame) { this.nextFrame(frame);}
    var playNextTimeout = setTimeout( function () {
      if (_this.get('play')) {
        currentIndex = currentIndex + 1;
        if (currentIndex > totalIndexes) {
          currentIndex = 0;
        }
        _this.playNextRecursion(currentIndex, totalIndexes);
      }
    }, frame.get('timeMS'));

    this.set('playNextTimeout', playNextTimeout);
  },

  stopPlaying: function () {
    this.set('play', false);
    clearTimeout(this.get('playNextTimeout'));
    this.stop();
  },

  stop: function () {
    var stopVals = "{ 0, 0, 0 }";
    var newBinary = this._stringToBinary(stopVals);
    var callback = function () {};
    if (chrome.serial) {
      chrome.serial.send(this.get('connectionId'), newBinary, callback);
    }
  },


  _connect: function (device) {
    var _this = this;
    return new Ember.RSVP.Promise(function(go, nogo) {
      chrome.serial.connect(device.path, { bitrate: _this.kBitrate, sendTimeout: _this.sendTimeout }, function (args) {
        if (chrome.runtime.lastError) {
          console.log("Runtime LastError:" + chrome.runtime.lastError.message);
          _this.set("hasDevice", 0);
          _this.set("deviceStatus", chrome.runtime.lastError.message);
          nogo();
        } else {
          // successful connection, setup event handlers
          if (!chrome.serial.onReceiveError.hasListener(_this._receiveErrorCallback)) {
            console.log('adding receive error callback');
            chrome.serial.onReceiveError.addListener(_this._receiveErrorCallback);
          }
          _this.set('connectionId', args.connectionId);
          console.log('CONNECTION : ' + _this.get('connectionId'));
          go(args.connectionId, _this);
        }
      });
    });
  },

  _getNewBinary: function (frame) {
    var newVals = "{ " + frame.get('motorOne') + ", " + frame.get('motorTwo') + ", " + frame.get('motorThree') + " }";
    return this._stringToBinary(newVals);
  },

  _stringToBinary: function (str) {
    // potentially replace this function with:
    // var uint8array = new TextEncoder(encoding).encode(string);
    var buffer = new ArrayBuffer(str.length);
    var bufferView = new Uint8Array(buffer);
    for (var i = 0; i < str.length; i++) {
      bufferView[i] = str.charCodeAt(i);
    }
    return buffer;
  },

  _binaryToString: function (uint8array) {
    return new TextDecoder("utf-8").decode(uint8array);
  },

  _receiveErrorCallback: function (info) {
    if (info.error === 'timeout') {
      chrome.serial.update(info.connectionId, { receiveTimeout: 0}, function() {
        console.log("Receive timeout. Removing timeout.");
      });
    }
    console.log('receiveErrorCallback');
    console.log("Receive error: " + info.error);
    console.log(info);
  }
});
