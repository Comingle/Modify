import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function (controller) {
    let motorOne = this.store.createRecord('motor', {
      percentAmplitude: 50,
      cyclesPerSecond: 2,
      percentPhaseShift: 25,
      color: 'pink'
    });

    let motorTwo = this.store.createRecord('motor', {
      percentAmplitude: 75,
      cyclesPerSecond: 2,
      percentPhaseShift: 30,
      color: 'green'
    });

    let motorThree = this.store.createRecord('motor', {
      percentAmplitude: 100,
      cyclesPerSecond: 2,
      percentPhaseShift: 35,
      color: 'orange'
    });

    controller.set('motorOne', motorOne)
    controller.set('motorTwo', motorTwo)
    controller.set('motorThree', motorThree)
  }
});
