import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['port-picker'],

  isSelecting: false,

  devices: [],

  init: function () {
    this._super();
    this.setDevices();
  },

  updateIcon: function() {
    let hasDevice = this.get("hasDevice");
    let newClass = "";
    let color = "";
    let el = "label span"
    if (hasDevice === 0) {
      newClass = "glyphicon glyphicon-remove";
      color = "#ff0000";
    } else if (hasDevice === 1) {
      newClass = "glyphicon glyphicon-exclamation-sign";
      color = "#ff7700";
    } else if (hasDevice === 2) {
      newClass = "glyphicon glyphicon-ok";
      color = "#00ff00";
    }
    this.$(el).removeClass();
    this.$(el).addClass(newClass);
    this.$(el).css("color", color);
    this.$(el).css("display", "inline");
    this.$(el).attr("data-original-title", this.get('deviceStatus'));
    this.$(el).tooltip('show');
    setTimeout(function() {
      this.$(el).tooltip('hide');
    }, 6000);
  }.observes('deviceStatus'),

  deviceChanged: function() {
    let chosenPort = this.get('chosenPort');
    if (typeof(chosenPort) != undefined) {
      if (!chosenPort.missing) {
        this.sendAction('testDevice', chosenPort);
      } else {
        this.sendAction('setMissingDevice');
      }

    }
  }.observes('chosenPort'),

  setDevices: function () {
    var _this = this;
    if (chrome.serial) {
      chrome.serial.getDevices(function (devices) {
        // The toy is probably the last serial port to show up
        devices.unshift({path:"My toy isn't visible here",missing:true});
        _this.set('devices', devices.reverse());
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
