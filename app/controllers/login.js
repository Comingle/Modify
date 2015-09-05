import Ember from 'ember';

export default Ember.Controller.extend({
  identifier: '',
  password: '',

  actions: {
    authenticate: function() {
      var controller = this;
      var data = this.getProperties('identifier', 'password');
      return this.get('session').authenticate('authenticator:custom', data).then( function () {
        controller.transitionToRoute('/quicky');
      });
    }
  }

});
