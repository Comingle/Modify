import Ember from 'ember';
import PatternUpdaterMixin from '../../mixins/pattern-updater';

export default Ember.Controller.extend(PatternUpdaterMixin, {

  // makeActive: function (selectedPattern) {
  //   this.get('model').forEach( function (pattern) {
  //     pattern.set('active', false);
  //   });
  //
  //   selectedPattern.set('active', true);
  // },
  //
  // actions: {
  //   maxOptionValueChanged: function (pattern, option, property, value) {
  //     console.log('CHANGE', value)
  //     option.set(property, value);
  //     this.updatePattern(pattern);
  //     if (pattern.get('active')) {
  //       this.get('toy').startPlaying(pattern.get('frames'));
  //     }
  //   },
  //
  //   startPlayingPattern: function (pattern) {
  //     this.makeActive(pattern);
  //     this.get('toy').startPlaying(pattern.get('frames'));
  //   },
  //
  //   stopPlayingPattern: function () {
  //     this.get('toy').stopPlaying();
  //   }
  // }
});
