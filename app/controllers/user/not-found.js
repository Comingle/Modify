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

    restoreDefault: function(sketchId) {
      let _this = this;
      let toy = this.get('toy');
      if (toy.get('device')) {
        _this.get('target').send('displayOverlay');
        toy.getSketchById("default")
        .then(toy.sendSketch.bind(toy))
        .then(function() {
          _this.get('target').send('hideOverlay');
          _this.transitionTo("/user/quicky");
        })
      }
    }

  }

});
