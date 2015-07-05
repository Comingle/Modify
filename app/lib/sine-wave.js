class SineWave {

  constructor (percentAmplitude, cyclesPerSecond, percentPhaseShift, second, maxY) {
    this.second = second || 1000; // resolution defaults to milliseconds
    this.maxY = maxY || 255; // defaults to the hightest a motor can go
    this.maxAmplitude = this.maxY / 2;
    this.amplitude = (percentAmplitude / 100) * this.maxAmplitude;
    this.cycle = (2 * Math.PI) / this.second; // a constant one cycle per second
    this.frequency = cyclesPerSecond * this.cycle;
    this.phaseShift = (this.second / cyclesPerSecond) * (percentPhaseShift / 100) * this.frequency;
  }

  at (time) {
    return (this.maxAmplitude) + (this.amplitude * Math.sin((time * this.frequency) + this.phaseShift));
  }
}

export default SineWave;
