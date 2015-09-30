import Ember from 'ember';
import config from '../config/environment';

export default Ember.Mixin.create({

  updatePattern: function (pattern) {
    let self = this;
    let params = { id: pattern.get('id'), settings: pattern.get('updateOptionValues') };
    let patternId = pattern.get('id');
    let frames = pattern.get('frames');
    console.log(frames);
    return self.callForNewFrames(params).done( function (framesData) {
      framesData.steps.forEach(function (frameData, index) {
        let formattedFrameData = self.formatFrameData(frameData);
        let id = self.getUniqueId(patternId, index);
        let frame = frames.findBy("id", id);

        if (frame) {
          frame.setProperties(formattedFrameData);
        } else {
          formattedFrameData['id'] = id;
          frame = self.store.createRecord('frame', formattedFrameData);
          frames.addObject(frame);
        }
      });

      return pattern;
    });
  },

  callForNewFrames: function (params) {
    let url = config.domain + `/api/v1/components/test_pattern?id=${params.id}&settings=${JSON.stringify(params.settings)}`;
    return Ember.$.post(url);
  },

  getUniqueId: function (parentId, childIndex) {
    return `${parentId}:${childIndex}`;
  },

  formatFrameData: function (data) {
    return { motorOne: data[0] ,motorTwo: data[1] ,motorThree: data[2] ,timeMS: data[3] };
  }
});
