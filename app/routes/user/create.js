import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  setupController: function (controller) {
    let sineWaveOne = this.store.createRecord('sine-wave', {
      percentAmplitudeMin: 50,
      percentAmplitudeMax: 100,
      cyclesPerSecond: 2,
      percentPhaseShift: 25,
      color: '#d28dbf'
    });

    let sineWaveTwo = this.store.createRecord('sine-wave', {
      percentAmplitudeMin: 25,
      percentAmplitudeMax: 50,
      cyclesPerSecond: 2,
      percentPhaseShift: 30,
      color: '#fec742'
    });

    let sineWaveThree = this.store.createRecord('sine-wave', {
      percentAmplitudeMin: 0,
      percentAmplitudeMax: 100,
      cyclesPerSecond: 2,
      percentPhaseShift: 35,
      color: '#dbe546'
    });

    controller.set('sineWaveOne', sineWaveOne);
    controller.set('sineWaveTwo', sineWaveTwo);
    controller.set('sineWaveThree', sineWaveThree);
  }
});
