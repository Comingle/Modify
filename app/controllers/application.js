import Ember from 'ember';

export default Ember.Controller.extend({

  quickyIsActive: function () {
    return this.get('currentRouteName') === 'quicky';
  }.property('currentRouteName'),

  getIntimateIsActive: function () {
    return this.get('currentRouteName') === 'get_intimate';
  }.property('currentRouteName'),

  accessoryIsActive: function () {
    return this.get('currentRouteName') === '?';
  }.property('currentRouteName'),

  myAccountIsActive: function () {
    return this.get('currentRouteName') === '?';
  }.property('currentRouteName'),

  serialObj: function () {
    return chrome.serial;
  }.property(),

  isConnected: function () {
    return this.get('toy.connectionId') > 0;
  }.property('toy.connectionId'),

  actions: {
    chooseDevice: function (device) {
      this.get('toy').connectDevice(device);
    },

    invalidateSession: function() {
      this.get('session').invalidate();
    }
  }
});
