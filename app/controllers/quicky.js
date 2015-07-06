import Ember from 'ember';
import SineWave from 'chrome-app/lib/sine-wave';

export default Ember.Controller.extend({
  second: 1000,
  maxY: 255,

  motorOneSin: function () {
    let motor = this.get('motorOne');
    return new SineWave(
      motor.get('percentAmplitudeMin'),
      motor.get('percentAmplitudeMax'),
      motor.get('cyclesPerSecond'),
      motor.get('percentPhaseShift'),
      this.get('second'),
      this.get('maxY')
    )
  }.property('motorOne.percentAmplitudeMin',
             'motorOne.percentAmplitudeMax',
             'motorOne.cyclesPerSecond',
             'motorOne.percentPhaseShift'),

  motorTwoSin: function () {
    let motor = this.get('motorTwo');
    return new SineWave(
      motor.get('percentAmplitudeMin'),
      motor.get('percentAmplitudeMax'),
      motor.get('cyclesPerSecond'),
      motor.get('percentPhaseShift'),
      this.get('second'),
      this.get('maxY')
    )
  }.property('motorTwo.percentAmplitudeMin',
             'motorTwo.percentAmplitudeMax',
             'motorTwo.cyclesPerSecond',
             'motorTwo.percentPhaseShift'),

  motorThreeSin: function () {
    let motor = this.get('motorThree');
    return new SineWave(
      motor.get('percentAmplitudeMin'),
      motor.get('percentAmplitudeMax'),
      motor.get('cyclesPerSecond'),
      motor.get('percentPhaseShift'),
      this.get('second'),
      this.get('maxY')
    )
  }.property('motorThree.percentAmplitudeMin',
             'motorThree.percentAmplitudeMax',
             'motorThree.cyclesPerSecond',
             'motorThree.percentPhaseShift'),

  runMotors: function (time) {
    let controller = this;
    if (this.get('running')) {
      Ember.run.later( function() {
        let frame = controller.get('frame').setProperties({
          motorOne: parseInt(controller.get('motorOneSin').at(time)),
          motorTwo: parseInt(controller.get('motorTwoSin').at(time)),
          motorThree: parseInt(controller.get('motorThreeSin').at(time))
        });
        controller.get('toy').nextFrame(frame)
        controller.runMotors(time + 2);
      }, 2 );
    } else {
      controller.get('toy').stop();
    }
  },

  actions: {
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
