import Ember from 'ember';

export default Ember.Controller.extend({

  serialObj: function () {
    return chrome.serial;
  }.property(),

  actions: {
    chooseDevice: function (device) {
      console.log(device);
    }
  }
});
