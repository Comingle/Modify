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
    highOptionValueChanged: function (controlOption, newValue) {
      this.sendAction('optionValueChanged', this.get('pattern'), controlOption, 'highValue', newValue);
    },

    lowOptionValueChanged: function (controlOption, newValue) {
      this.sendAction('optionValueChanged', this.get('pattern'), controlOption, 'lowValue', newValue);
    },

    pausePattern: function () {
      this.set('pattern.active', false);
      this.sendAction('stopPlayingPattern');
    },

    playPattern: function () {
      this.set('pattern.active', true);
      this.sendAction('startPlayingPattern', this.get('pattern'));
    },

    toggleActive: function () {
      if (this.get('pattern.active')) {
        this.set('pattern.active', false);
        this.sendAction('activatePattern', null);
      } else {
        this.set('pattern.active', true);
        this.sendAction('activatePattern', this.get('pattern'));
      }
    }
  }
});
