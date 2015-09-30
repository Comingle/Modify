import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['basic-pattern'],
  classNameBindings: ['active'],
  showOptions: true,

  active: function () {
    return this.get('pattern.active');
  }.property('pattern.active'),

  isPlaying: function () {
    return this.get('pattern.active');
  }.property('pattern.active'),

  actions: {
    maxValueChanged: function (controlOption, newValue) {
      this.sendAction('maxValueChanged', this.get('pattern'), controlOption, 'max', newValue);
    },

    pausePattern: function () {
      this.set('pattern.active', false);
      this.sendAction('stopPlayingPattern');
    },

    playPattern: function () {
      this.set('pattern.active', true);
      this.sendAction('startPlayingPattern', this.get('pattern'));
    },

    toggleOptions: function () {
      if (this.get('showOptions')) {
        this.set('showOptions', false);
        // this.sendAction('openPattern', null);
      } else {
        this.set('showOptions', true);
        // this.sendAction('openPattern', this.get('pattern'));
      }
    }
  }
});
