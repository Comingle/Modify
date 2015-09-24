import Ember from 'ember';


export default Ember.Controller.extend({
  actions: {
    getDefault: function() {
      let controller = this;
      let toy = controller.get('toy');
      toy.getDefault().then(function() {
        controller.get('toy').sendSketch();
      });
    },

    // We need a general "uploader" service/component that does overlay/ status updates.
    restoreDefault: function(sketchId) {
      let _this = this;
      let toy = this.get('toy');
      if (toy.get('device')) {
        toy.getSketchById("default")
        .then(toy.sendSketch.bind(toy))
        .then(function() {
          _this.transitionTo("/user/quicky");
        })
      }
    }

  }

});
