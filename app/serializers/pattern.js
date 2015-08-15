import DS from 'ember-data';

export default DS.ActiveModelSerializer.extend({

  extractArray: function(store, type, payload) {
    var patterns = payload.components;
    var frames = [];
    var controlOptions = [];
    var getUniqueId = this.getUniqueId;

    patterns.forEach( function (pattern) {
      var frameIds = [];
      var controlOptionIds = [];

      pattern.testride.steps.forEach( function (step, index) {
        var frame = {};
        var uid = getUniqueId(pattern.id, index);
        frame.id = uid;
        frame.motorOne = parseInt(step[0]);
        frame.motorTwo = parseInt(step[1]);
        frame.motorThree = parseInt(step[2]);
        frame.timeMS = parseInt(step[3]);

        frames.push(frame);
        frameIds.push(uid);
      });

      pattern.options.forEach(function (option, index) {
        var uid = getUniqueId(pattern.id, index);
        option.id = uid;
        option.defaultValue = parseInt(option.default);
        delete option.default;
        controlOptions.push(option);
        controlOptionIds.push(uid);
      });

      pattern.controlOptions = controlOptionIds;
      pattern.frames = frameIds;
      delete pattern.testride;
    });

    payload = { patterns: patterns, frames: frames, controlOptions: controlOptions };
    return this._super(store, type, payload);
  },

  getUniqueId: function (parentId, childIndex) {
    return `${parentId}:${childIndex}`;
  }
});
