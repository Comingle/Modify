import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['basic-pattern'],
  classNameBindings: ['active'],
  showOptions: false,

  active: function () {
    return this.get('pattern.active');
  }.property('pattern.active'),

  isPlaying: function () {
    return this.get('pattern.active');
  }.property('pattern.active'),

  active: function () {
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

    toggleOptions: function () {
      if (this.get('showOptions')) {
        this.set('showOptions', false);
      } else {
        this.set('showOptions', true);
      }
    }
  }
});
