import Ember from 'ember';

export default Ember.Controller.extend({

  serialObj: function () {
    return chrome.serial;
  }.property(),

  isConnected: function () {
    return this.get('toy.connectionId') > 0;
  }.property('toy.connectionId'),

  actions: {
    chooseDevice: function (device) {
      this.get('toy').connectDevice(device);
    }
  }
});
