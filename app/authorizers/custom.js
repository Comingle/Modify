import Ember from 'ember';
import Base from 'simple-auth/authorizers/base';

export default Base.extend({

  tokenAttributeName: 'token',
  identificationAttributeName: 'email',

  authorize: function(jqXHR) {
    var secureData = this.get('session.secure');
    var token      = secureData['authentication_token'];
    var identifier = secureData['identifier'];

    if (this.get('session.isAuthenticated') && token && identifier) {
      var authData = JSON.stringify({ authentication_token: token, identifier: identifier });
      jqXHR.setRequestHeader('Authorization', authData);
    }
  }
});
