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
    // f(time) = amplitude * sin(frequency * time - phaseShift)
    let centerOfGraph = this.get('maxY') / 2;
    return centerOfGraph + (this.get('amplitude') * Math.sin((time * this.get('frequency')) - this.get('phaseShift')));
  },

  integrate: function (motor) {
    this.set('percentAmplitudeMin', motor.percentAmplitudeMin);
    this.set('percentAmplitudeMax', motor.percentAmplitudeMax);
    this.set('cyclesPerSecond', motor.cyclesPerSecond);
    this.set('percentPhaseShift', motor.percentPhaseShift);
  },

  // IMPLEMENTATION
  amplitude: function () {
    let totalPercentAmplitude = this.get('percentAmplitudeMax') - this.get('percentAmplitudeMin');
    return this.amplitudePercentToValue(totalPercentAmplitude) / 2;
  }.property('percentAmplitudeMin', 'percentAmplitudeMax'),

  amplitudeMin: function () {
    return this.amplitudePercentToValue(this.get('percentAmplitudeMin'));
  }.property('percentAmplitudeMin'),

  frequency: function () {
    let cycle = (2 * Math.PI) / this.get('second'); // a constant one cycle per second
    return this.get('cyclesPerSecond') * cycle;
  }.property('cyclesPerSecond'),

  phaseShift: function () {
    let numOfCycles = this.get('cyclesPerSecond') * this.get('second');
    let shift = this.get('percentPhaseShift') / 100;
    return numOfCycles * shift * this.get('frequency');
  }.property('second', 'cyclesPerSecond', 'percentPhaseShift', 'frequency'),

  amplitudePercentToValue: function (percent) {
    if (percent === 0) {
      return 0;
    }
    let realValue = percent / 100;
    return realValue * this.get('maxY');
  }
});
