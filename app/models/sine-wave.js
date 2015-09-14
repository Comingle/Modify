import DS from 'ember-data';

export default DS.Model.extend({
  percentAmplitudeMin: DS.attr('integer'),
  percentAmplitudeMax: DS.attr('integer'),
  cyclesPerSecond:   DS.attr('integer'),
  percentPhaseShift: DS.attr('integer'),
  color: DS.attr('string'),
  second: 1000,
  maxY: 255,

  // INTERFACE
  at: function (time) {
    return this.get('amplitudeMin') + (this.get('amplitude') * Math.sin((time * this.get('frequency')) + this.get('phaseShift')));
  },

  integrate: function (motor) {
    this.set('percentAmplitudeMin', motor.percentAmplitudeMin);
    this.set('percentAmplitudeMax', motor.percentAmplitudeMax);
    this.set('cyclesPerSecond', motor.cyclesPerSecond);
    this.set('percentPhaseShift', motor.percentPhaseShift);
  },

  // IMPLEMENTATION
  totalPercentAmplitude: function () {
    return this.get('percentAmplitudeMax') - this.get('percentAmplitudeMin');
  }.property('percentAmplitudeMax', 'percentAmplitudeMin'),

  amplitude: function () {
    return this.amplitudePercentToValue(this.get('totalPercentAmplitude'));
  }.property('percentAmplitudeMin', 'percentAmplitudeMax'),

  amplitudeMin: function () {
    return this.amplitudePercentToValue(this.get('percentAmplitudeMin'));
  }.property('percentAmplitudeMin'),

  cycle: function () {
    // a constant one cycle per second
    return (2 * Math.PI) / this.get('second');
  }.property('second'),

  frequency: function () {
    return this.get('cyclesPerSecond') * this.get('cycle');
  }.property('cyclesPerSecond', 'cycle'),

  phaseShift: function () {
    let numOfCycles = this.get('cyclesPerSecond') / this.get('second');
    let shift = this.get('percentPhaseShift') / 100;
    return numOfCycles * shift * this.get('frequency');
  }.property('second', 'cyclesPerSecond', 'percentPhaseShift', 'frequency'),

  amplitudePercentToValue: function (percent) {
    if (percent === 0) {
      return 0;
    }
    let realValue = percent / 100;
    let relationToZero = this.get('maxY') / 2;
    return realValue * relationToZero;
  }
});
