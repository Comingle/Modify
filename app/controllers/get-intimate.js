import Ember from 'ember';

export default Ember.Controller.extend({

  makeActive: function (selectedPattern) {
    this.get('model').forEach( function (pattern) {
      pattern.set('active', false);
    });

    selectedPattern.set('active', true);
  },

  actions: {
    maxOptionValueChanged: function (pattern, option, property, value) {
      option.set(property, value);

      // TODO: this will need to be handled much better for each pattern
      // to do this any better we really need to be able to build them on the client
      // to me that means we should build out sin functions
      if (option.get('name') === 'time') {
        pattern.get('frames').forEach( (frame) => {
          frame.set('timeMS', value);
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
