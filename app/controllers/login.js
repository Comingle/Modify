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
      var controller = this;
      var data = this.getProperties('identifier', 'password');
      return this.get('session').authenticate('authenticator:custom', data).then( function () {
        let id = controller.get('session.secure.id');
        controller.transitionToRoute('user', id);
      });
    },

    chooseDevice: function(device) {
      this.get('toy').connectDevice(device);
    }


  }
});
