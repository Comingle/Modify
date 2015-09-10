import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],

  currentRouteName: function () {
    return this.get('controllers.application.currentRouteName');
  }.property('controllers.application.currentRouteName'),

  quickyIsActive: function () {
    return this.get('currentRouteName').indexOf('quicky') > -1;
  }.property('currentRouteName'),

  getIntimateIsActive: function () {
    return this.get('currentRouteName').indexOf('get_intimate') > -1;
  }.property('currentRouteName'),

  myAccountIsActive: function () {
    return this.get('currentRouteName').indexOf('account') > -1;
  }.property('currentRouteName')
});
