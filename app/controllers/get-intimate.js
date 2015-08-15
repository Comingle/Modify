import Ember from 'ember';

export default Ember.Controller.extend({

  makeActive: function (selectedPattern) {
    this.get('model').forEach( function (pattern) {
      pattern.set('active', false);
    });

    selectedPattern.set('active', true);
  },

  actions: {
    editPatternOptions: function (pattern, optionName, property, value) {
      pattern.get('controlOptions').findBy('name', optionName).set(property, value);

      if (optionName === 'time') {
        pattern.get('frames').forEach( (frame) => {
          frame.set(property, value);
        });
      }

      if (pattern.get('active')) {
        this.get('toy').startPlaying(pattern.get('frames'));
      }
    },

    startPlayingPattern: function (pattern) {
      this.makeActive(pattern);
      this.get('toy').startPlaying(pattern.get('frames'));
    },

    stopPlayingPattern: function () {
      this.get('toy').stopPlaying();
    }
  }
});
