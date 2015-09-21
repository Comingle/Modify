import Ember from 'ember';

export default Ember.Controller.extend({
  identifier: '',
  password: '',

  hasDevice: function () {
    return this.get('toy.hasDevice');
  }.property('toy.hasDevice'),

  deviceStatus: function () {
    return this.get('toy.deviceStatus');
  }.property('toy.deviceStatus'),

  device: function () {
    return this.get('toy.device');
  }.property('toy.device'),

  actions: {
    authenticate: function() {
      let controller = this;
      let toy = controller.get('toy');
      var data = this.getProperties('identifier', 'password');
      controller.get('session').authenticate('authenticator:custom', data);
    },

    testDevice: function(device) {
      this.get('toy').testDevice(device);
    },

    setMissingDevice: function() {
      this.set('toy.device', undefined);
      this.set('toy.hasDevice', 0);
      this.set('toy.deviceStatus', "Sign in to restore your toy's software");
    }


  }
});
