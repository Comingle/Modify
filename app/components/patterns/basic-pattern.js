import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['basic-pattern'],
  classNameBindings: ['active'],

  active: function () {
    return this.get('pattern.active');
  }.property('pattern.active'),

  click: function () {
    if (this.get('pattern.active')) {
      this.set('pattern.active', false);
      this.sendAction('stopPlayingPattern');
    } else {
      this.set('pattern.active', true);
      this.sendAction('selectPattern', this.get('pattern'));
    }
  }

});
