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

  runMotors: function (time) {
    let controller = this;
    if (this.get('running')) {
      Ember.run.later( function() {
        let frame = controller.get('frame').setProperties({
          motorOne: parseInt(controller.get('motorOneSin').at(time)),
          motorTwo: parseInt(controller.get('motorTwoSin').at(time)),
          motorThree: parseInt(controller.get('motorThreeSin').at(time))
        });
        controller.get('toy').nextFrame(frame);
        controller.runMotors(time + 2);
      }, 2 );
    } else {
      controller.get('toy').stop();
    }
  },

  baseData: function () {
    return Ember.Object.create({min: 0, max: 100 });
  }.property(),

  actions: {
    minAmplitudeOneChanged: function (data, newValue) {
      this.get('frames');
      let sine = this.get('sineWaveOne.percentAmplitudeMin')
      console.log('sine', sine)
      console.log('right', newValue);
    },

    maxAmplitudeOneChanged: function (data, newValue) {
      console.log('right', newValue)
    },

    frequencyOneChanged: function (data, newValue) {
      console.log('right', newValue)
    },

    shiftOneChanged: function (data, newValue) {
      console.log('right', newValue)
    },



    minAmplitudeTwoChanged: function (data, newValue) {
      console.log('right', newValue)
    },

    maxAmplitudeTwoChanged: function (data, newValue) {
      console.log('right', newValue)
    },

    frequencyTwoChanged: function (data, newValue) {
      console.log('right', newValue)
    },

    shiftTwoChanged: function (data, newValue) {
      console.log('right', newValue)
    },



    minAmplitudeThreeChanged: function (data, newValue) {
      console.log('right', newValue)
    },

    maxAmplitudeThreeChanged: function (data, newValue) {
      console.log('right', newValue)
    },

    frequencyThreeChanged: function (data, newValue) {
      console.log('right', newValue)
    },

    shiftThreeChanged: function (data, newValue) {
      console.log('right', newValue)
    },


    startMotors: function () {
      if (!this.get('running')) {
        this.set('running', true);
        this.runMotors(0);
      }
    },

    stopMotors: function () {
      this.set('running', false);
    }
  }
});
