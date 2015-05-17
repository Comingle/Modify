import Ember from 'ember';

export default Ember.Controller.extend({

  serialObj: function () {
    return chrome.serial;
  }.property(),

  isConnected: function () {
    return this.get('toy.connectionId') > 0;
  }.property('toy.connectionId'),

  setNextFrame: function () {
    this.get('toy').nextFrame(this.get('model'));
  },

  actions: {
    chooseDevice: function (device) {
      this.get('toy').connectDevice(device);
    },

    changeMotor: function (motorNum, newValue) {
      this.get('model').set(motorNum, newValue);
      this.setNextFrame();
    }
  }
});
