import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createUser: function() {
      var controller = this;
      var model = controller.get('model');
      model.save().then( function (user) {
        var data = {}
        data.password = model.get('password');
        data.identifier = model.get('email') || model.get('username');
        return controller.get('session').authenticate('authenticator:custom', data).then( function () {
          controller.transitionTo('users.show', user);
        });
      });
    }
  }
});
