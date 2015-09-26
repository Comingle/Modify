import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['overlay-pattern'],
  classNameBindings: ['active'],

  active: function () {
    return this.get('pattern.active');
  }.property('pattern.active'),

  isPlaying: function () {
    return this.get('pattern.active');
  }.property('pattern.active'),

  actions: {

    pausePattern: function () {
      this.set('pattern.active', false);
      this.sendAction('stopPlayingPattern');
    },

    playPattern: function () {
      this.set('pattern.active', true);
      this.sendAction('selectPattern', this.get('pattern'));
    },

    addToCurrentPatterns: function() {
      this.sendAction('addPattern', this.get('pattern'));
    }
  }
});
