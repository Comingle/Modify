import Ember from 'ember';


export default Ember.Controller.extend({
  actions: {
    getDefault: function() {
      let controller = this;
      let toy = controller.get('toy');
      toy.getDefault().then(function() {
        controller.get('toy').sendSketch();
      });
    }
  }

});
