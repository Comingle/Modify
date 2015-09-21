import Ember from 'ember';
import SignWaveFrames from 'chrome-app/models/sine-wave-frames';

export default Ember.Controller.extend({
  second: 1000,
  maxY: 255,

  frames: function () {
    let waves = [this.get('sineWaveOne'), this.get('sineWaveTwo'), this.get('sineWaveThree')];
    return SignWaveFrames.create({ sineWaves: Ember.A(waves), store: this.store });
  }.property('sineWaveOne.percentAmplitudeMin',
             'sineWaveOne.percentAmplitudeMax',
             'sineWaveOne.cyclesPerSecond',
             'sineWaveOne.percentPhaseShift',
             'sineWaveTwo.percentAmplitudeMin',
             'sineWaveTwo.percentAmplitudeMax',
             'sineWaveTwo.cyclesPerSecond',
             'sineWaveTwo.percentPhaseShift',
             'sineWaveThree.percentAmplitudeMin',
             'sineWaveThree.percentAmplitudeMax',
             'sineWaveThree.cyclesPerSecond',
             'sineWaveThree.percentPhaseShift'),

  // runMotors: function (time) {
  //   let controller = this;
  //   if (this.get('running')) {
  //     Ember.run.later( function() {
  //       let frame = controller.get('frame').setProperties({
  //         motorOne: parseInt(controller.get('motorOneSin').at(time)),
  //         motorTwo: parseInt(controller.get('motorTwoSin').at(time)),
  //         motorThree: parseInt(controller.get('motorThreeSin').at(time))
  //       });
  //       controller.get('toy').nextFrame(frame);
  //       controller.runMotors(time + 2);
  //     }, 2 );
  //   } else {
  //     controller.get('toy').stop();
  //   }
  // },

  // baseData: function () {
  //   return Ember.Object.create({min: 0, max: 100 });
  // }.property(),

  // actions: {
  //   startMotors: function () {
  //     if (!this.get('running')) {
  //       this.set('running', true);
  //       this.runMotors(0);
  //     }
  //   },

  //   stopMotors: function () {
  //     this.set('running', false);
  //   }
  // }

});
