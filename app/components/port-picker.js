import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['port-picker'],

  isSelecting: false,

  devices: [],

  init: function () {
    this._super();
    this.setDevices();
  },

  setDevices: function () {
    var _this = this;
    if (chrome.serial) {
      chrome.serial.getDevices(function (devices) {
        _this.set('devices', devices);
      });
    }
  },

  devicesFound: function () {
    return this.get('devices.length') > 0;
  }.property('devices'),

  actions: {
    startSelecting: function () {
      this.set('isSelecting', true);
    },

    chooseDevice: function (device) {
      this.sendAction('chooseDevice', device);
    },

    resetDevices: function () {
      this.setDevices();
    }
  }
});
