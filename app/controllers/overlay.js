import Ember from 'ember';

export default Ember.Controller.extend( {
  message: '',

  messageUpdate: function() {
    this.set('message', this.get('toy.progress'));
  }.observes('toy.progress').on('init'),

});
