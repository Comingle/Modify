import Ember from 'ember';

export default Ember.Route.extend({

  model: function (params) {
    let id = this.get('session.secure.id');
    return this.store.find('user', id);
  }
});
