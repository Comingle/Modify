class SineWave {

  constructor (percentAmplitudeMin, percentAmplitudeMax, cyclesPerSecond, percentPhaseShift, second, maxY) {
    this.second = second || 1000; // resolution defaults to milliseconds
    this.maxY = maxY || 255; // defaults to the hightest a motor can go
    this.amplitude = this.amplitudePercentToValue((percentAmplitudeMax) - (percentAmplitudeMin));
    this.amplitudeMin = this.amplitudePercentToValue(this.amplitude + percentAmplitudeMin);
    this.cycle = (2 * Math.PI) / this.second; // a constant one cycle per second
    this.frequency = cyclesPerSecond * this.cycle;
    this.phaseShift = (this.second / cyclesPerSecond) * (percentPhaseShift / 100) * this.frequency;
  }

  at (time) {
    return (this.amplitudeMin) + (this.amplitude * Math.sin((time * this.frequency) + this.phaseShift));
  }

  amplitudePercentToValue (percent) {
    return (percent / 100) * this.maxY / 2;
  }
}

export default SineWave;
