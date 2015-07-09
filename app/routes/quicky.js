import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function (controller) {
    let motorOne = this.store.createRecord('motor', {
      percentAmplitudeMin: 50,
      percentAmplitudeMax: 100,
      cyclesPerSecond: 2,
      percentPhaseShift: 25,
      color: '#d28dbf'
    });

    let motorTwo = this.store.createRecord('motor', {
      percentAmplitudeMin: 25,
      percentAmplitudeMax: 50,
      cyclesPerSecond: 2,
      percentPhaseShift: 30,
      color: '#fec742'
    });

    let motorThree = this.store.createRecord('motor', {
      percentAmplitudeMin: 0,
      percentAmplitudeMax: 100,
      cyclesPerSecond: 2,
      percentPhaseShift: 35,
      color: '#dbe546'
    });

    let frame = this.store.createRecord('frame');

    controller.set('motorOne', motorOne);
    controller.set('motorTwo', motorTwo);
    controller.set('motorThree', motorThree);
    controller.set('frame', frame);
  }
});
