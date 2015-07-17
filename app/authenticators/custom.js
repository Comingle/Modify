import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';
import config from '../config/environment';

export default Base.extend({

  serverTokenEndpoint: '/api/v1/sessions',
  tokenAttributeName: 'token',
  identificationAttributeName: 'email',

  restore: function(properties) {
    var props = Ember.Object.create(properties);
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(props.get('authentication_token'))) {
        resolve(properties);
      } else {
        reject();
      }
    });
  },

  authenticate: function(credentials) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var data = {};
      data['session'] = { password: credentials.password};
      data['session']['identifier'] = credentials.identifier || credentials.email || credentials.username;
      _this.makeRequest(data).then( function(response) {
        Ember.run(function() {
          resolve(response);
        });
      }, function(xhr) {
        Ember.run(function() {
          reject(xhr.responseJSON || xhr.responseText);
        });
      });
    });
  },

  invalidate: function() {
    return Ember.RSVP.resolve();
  },

  makeRequest: function(data) {
    return Ember.$.ajax({
      url:        config.domain + this.serverTokenEndpoint,
      type:       'POST',
      data:       data,
      dataType:   'json',
      beforeSend: function(xhr, settings) {
        xhr.setRequestHeader('Accept', settings.accepts.json);
      }
    });
  }
});
