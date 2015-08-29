import Ember from 'ember';

export default Ember.Service.extend({
  kBitrate: 9600,

  connectDevice: function (device) {
    this.set('device', device);
    this._connect(device);
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
    chrome.serial.connect(device.path, { bitrate: this.kBitrate }, function (args) {
      _this.set('connectionId', args.connectionId);
      console.log('CONNECTION : ' + _this.get('connectionId'));
    });
  },

  _getNewBinary: function (frame) {
    var newVals = "{ " + frame.get('motorOne') + ", " + frame.get('motorTwo') + ", " + frame.get('motorThree') + " }";
    return this._stringToBinary(newVals);
  },

  _stringToBinary: function (str) {
    var buffer = new ArrayBuffer(str.length);
    var bufferView = new Uint8Array(buffer);
    for (var i = 0; i < str.length; i++) {
      bufferView[i] = str.charCodeAt(i);
    }
    return buffer;
  }
});
