import Ember from 'ember';

export default Ember.Component.extend({
  showCollapse: false,

  actions: {

    toggleCollapse: function () {
      if (this.get('showCollapse')) {
        this.set('showCollapse', false);
      } else {
        this.set('showCollapse', true);
      }
    },

    restore: function(id) {
      this.sendAction('restore', id);
    }
  }
});
