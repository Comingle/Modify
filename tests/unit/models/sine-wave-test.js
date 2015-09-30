import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('sine-wave', {
  needs: []
});

test('it has the right values for simple input', function (assert) {
  let params = {
    percentAmplitudeMin: 0,
    percentAmplitudeMax: 100,
    cyclesPerSecond:   1,
    percentPhaseShift: 0
  };

  let model = this.subject(params);
  assert.equal(model.get('totalPercentAmplitude'), 100);
  assert.equal(model.get('amplitude'), 127.5);
  assert.equal(model.get('amplitudeMin'), 0);
  assert.equal(model.get('cycle'), 0.006283185307179587);
  assert.equal(model.get('frequency'), 0.006283185307179587);
  assert.equal(model.get('phaseShift'), 0);
});

test('it has the right values for more complex input', function (assert) {
  let params = {
    percentAmplitudeMin: 20,
    percentAmplitudeMax: 80,
    cyclesPerSecond:   5,
    percentPhaseShift: 20
  };

  let model = this.subject(params);
  assert.equal(model.get('totalPercentAmplitude'), 60);
  assert.equal(model.get('amplitude'), 76.5);
  assert.equal(model.get('amplitudeMin'), 25.5);
  assert.equal(model.get('cycle'), 0.006283185307179587);
  assert.equal(model.get('frequency'), 0.031415926535897934);
  assert.equal(model.get('phaseShift'), 0.000031415926535897935);
});

test('it gives the right y value for a given time', function (assert) {
  let params = {
    percentAmplitudeMin: 20,
    percentAmplitudeMax: 80,
    cyclesPerSecond:   5,
    percentPhaseShift: 20
  };

  let model = this.subject(params);
  assert.equal(model.at(0), 25.5024033183796);
  assert.equal(model.at(1), 27.90532520077808);
  assert.equal(model.at(10), 49.142085749623355);
  assert.equal(model.at(100), 25.497596681620383);
  assert.equal(model.at(1000), 25.50240331837977);
});
