import Ember from 'ember';


export default Ember.Controller.extend({
  rowBasis: "col-sm-8 col-md-offset-2",

  username: function () {
    return this.get('user.username');
  }.property(),

  email: function () {
    return this.get('user.email');
  }.property(),

  actions: {

    toggleCollapse: function () {
      if (this.get('showCollapse')) {
        this.set('showCollapse', false);
      } else {
        this.set('showCollapse', true);
      }
    },

    // upload the selected sketch to the toy.
    restore: function(sketchId) {
      let _this = this;
      let toy = this.get('toy');
      if (toy.get('device')) {
        _this.get('target').send('displayOverlay');
        toy.getSketchById(sketchId)
        .then(toy.sendSketch.bind(toy))
        .then(function() {
          _this.get('target').send('hideOverlay');
          _this.transitionTo("/user/quicky");
        })
      }
    }
  },




});
