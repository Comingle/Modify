import Ember from 'ember';

export default Ember.Service.extend({
  kBitrate: 9600,

  connectDevice: function (device) {
    this.set('device', device);
    this._connect(device);
  },

  _connect: function (device) {
    var _this = this;
    chrome.serial.connect(device.path, { bitrate: this.kBitrate }, function (args) {
      _this.set('connectionId', args.connectionId);
      console.log('CONNECTION : ' + _this.get('connectionId'));
    });
  },
});
