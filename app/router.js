import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route('quicky');
  this.route('get_intimate');
  this.route('login');
  this.route('account');
  this.route('create');
  this.resource('users', function () {
    this.route('new');
    this.route('show', { path: '/:user_id' });
  });
});
