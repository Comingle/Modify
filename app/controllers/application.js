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
    return this.get('currentRouteName') === 'account';
  }.property('currentRouteName'),

  isConnected: function () {
    return this.get('toy.connectionId') > 0;
  }.property('toy.connectionId'),

  hasDevice: function () {
    return this.get('toy.hasDevice');
  }.property('toy.hasDevice'),

  actions: {
    chooseDevice: function (device) {
      this.get('toy').connectDevice(device);
    },

    invalidateSession: function() {
      var _this = this;
      this.get('session').invalidate().then( function () {
        _this.transitionTo('/');
      });
    }

  }
});
