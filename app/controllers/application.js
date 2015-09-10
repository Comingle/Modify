import Ember from 'ember';

export default Ember.Controller.extend({

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
