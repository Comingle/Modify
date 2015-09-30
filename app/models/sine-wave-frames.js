import Ember from 'ember';

export default Ember.ArrayProxy.extend({
  tickOffset: 5,

  init: function () {
    this._super();
    this.set('content', []);
    this.buildFrames();
  },

  buildFrames: function () {
    this.createOrUpdateFrame(0);
  },

  createOrUpdateFrame: function (tick) {
    let frameParams, frame, time;
    time = this.get('tickOffset') * tick;
    // this should likely be detemined by the actual phase instead of the time
    // meaning it should end at the end of the phase rather than the end of the second
    // but that doesn't work when frames are used to create a graph that uses other sine waves with their own phase
    if (time < 1000) {
      frameParams = this.getFrameParamsAt(time);
      if (frame = this.get('content').objectAt(tick)) {
        frame.updateRecord(frameParams);
      } else {
        frame = this.get('store').createRecord('frame', frameParams);
        this.get('content').insertAt(tick, frame);
      }
      this.createOrUpdateFrame(tick + 1);
    }
  },

  getFrameParamsAt: function (time) {
    let sineWaves = this.get('sineWaves');
    return {
      motorOne: sineWaves[0].at(time),
      motorTwo: sineWaves[1].at(time),
      motorThree: sineWaves[2].at(time),
      timeMS: this.get('tickOffset')
    };
  }
});
