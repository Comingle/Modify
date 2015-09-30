import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  setupController: function (controller) {
    let sineWaveOne = this.store.createRecord('sine-wave', {
      percentAmplitudeMin: 0,
      percentAmplitudeMax: 100,
      cyclesPerSecond: 3,
      percentPhaseShift: 10,
      color: '#d28dbf'
    });

    let sineWaveTwo = this.store.createRecord('sine-wave', {
      percentAmplitudeMin: 0,
      percentAmplitudeMax: 100,
      cyclesPerSecond: 1,
      percentPhaseShift: 20,
      color: '#fec742'
    });

    let sineWaveThree = this.store.createRecord('sine-wave', {
      percentAmplitudeMin: 0,
      percentAmplitudeMax: 100,
      cyclesPerSecond: 1,
      percentPhaseShift: 30,
      color: '#dbe546'
    });

    controller.set('sineWaveOne', sineWaveOne);
    controller.set('sineWaveTwo', sineWaveTwo);
    controller.set('sineWaveThree', sineWaveThree);
  }
});
