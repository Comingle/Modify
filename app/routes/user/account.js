import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function () {
    let _this = this;
    return _this.store.find('user', _this.get('session.secure.id')).then(function (u) {
      return Ember.RSVP.hash({
        user: u,
        sketchHistory: u.get('sketchHistory')
      });
    })
  },
  setupController: function (controller, model) {
    let user = model.user;
    let sh = model.sketchHistory;
    controller.set('model', model);
    controller.set('user', user);
    controller.set('sketchHistory', sh)
  }
});
