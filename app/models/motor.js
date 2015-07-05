import DS from 'ember-data';

export default DS.Model.extend({
  percentAmplitude:  DS.attr('integer'),
  cyclesPerSecond:   DS.attr('integer'),
  percentPhaseShift: DS.attr('integer'),
  color: DS.attr('string')
});
