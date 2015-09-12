import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {

  model: function (params) {
    let id = this.get('session.secure.id');
    return this.store.find('user', id);
  }
});
