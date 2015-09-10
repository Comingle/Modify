import Ember from 'ember';

export default Ember.Service.extend({
  kBitrate: 9600,
  sendTimeout: 1000,
  receiveTimeout: 1000,

  connectDevice: function (device) {
    this.set('device', device);
    this._connect(device).then(this.testConnection.bind(this));
  },

  testConnection: function () {
    let _this = this;
    console.log('testConnection');
    let connectionId = _this.get('connectionId');
    if (chrome.serial) {
      let receiver = function(info) {
        if (info.connectionId === connectionId) {
          chrome.serial.update(info.connectionId, { receiveTimeout: 0 }, function() {
            console.log("Received first.");
            chrome.serial.onReceive.removeListener(receiver);
            _this.set('hasDevice', true);
            _this.set("deviceStatus", "Connection is good!")
            chrome.serial.disconnect(info.connectionId, function (b) {
              console.log("Disconnect: " + b);
            });
          });
        }
      };
      let errorReceiver = function (info) {
        if (info.error === 'timeout' && info.connectionId === connectionId) {
          chrome.serial.update(info.connectionId, { receiveTimeout: 0}, function() {
            console.log("Receive error first. Removing timeout.");
            _this.set('hasDevice', false);
            _this.set("deviceStatus", "Connection timeout.");
            chrome.serial.onReceiveError.removeListener(errorReceiver);
            chrome.serial.disconnect(info.connectionId, function (b) {
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
      // "stop" command, expect "stop" response
      let testString = this._stringToBinary("i,0\r\n");
      chrome.serial.update(connectionId, { receiveTimeout: this.receiveTimeout}, function(result) {
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
          _this.set("hasDevice", false);
          _this.set("deviceStatus", chrome.runtime.lastError.message);
          nogo();
        } else {
          // successful connection, setup event handlers
          if (!chrome.serial.onReceiveError.hasListener(_this._receiveErrorCallback)) {
            console.log('adding receive error callback');
            chrome.serial.onReceiveError.addListener(_this._receiveErrorCallback);
          }
          if (!chrome.serial.onReceive.hasListener(_this._receiveCallback)) {
            console.log('adding receive callback');
            chrome.serial.onReceive.addListener(_this._receiveCallback);
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
        console.log("Receive timeout. Removing timeout.")
      });
    }
    console.log('receiveErrorCallback');
    console.log("Receive error: " + info.error);
    console.log(info);
  },

  _receiveCallback: function (info) {
    console.log('receiveCallback');
    console.log("Received: ");
    console.log(info);
    //console.log(this._binaryToString(info.data));
  }
});
