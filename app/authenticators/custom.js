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
      _this.makeRequest(data).then(function(resp, status, xhr) {
        Ember.run(function() {
          // resolve must be given an argument, or else session data won't be stored
          // this argument WILL NOT actually make it to the *session* authenticate.then(resolve) function
          resolve(resp);
        });
      }, function(xhr, status, error) {
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
    let _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax({
        url:        config.domain + _this.serverTokenEndpoint,
        type:       'POST',
        data:       data,
        dataType:   'json',
        success:    function(data, status, xhr) { resolve(data, status, xhr) },
        error:      function(xhr, status, error) { reject(xhr, status, error) },
        beforeSend: function(xhr, settings) {
          xhr.setRequestHeader('Accept', settings.accepts.json);
        }
      });
    });
  }
});
