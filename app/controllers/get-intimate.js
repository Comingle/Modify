import Ember from 'ember';

export default Ember.Controller.extend({

  makeActive: function (selectedPattern) {
    this.get('model').forEach( function (pattern) {
      pattern.set('active', false);
    });

    selectedPattern.set('active', true)
  },

  actions: {
    selectPattern: function (pattern) {
      this.makeActive(pattern);
      this.get('toy').startPlaying(pattern.get('frames'));
    },

    stopPlayingPattern: function () {
      this.get('toy').stopPlaying();
    }
  }

});
