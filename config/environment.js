/* jshint node: true */

module.exports = function(environment) {
  // var apiDomain = 'http://sketchbook.comingle.io'
  var apiDomain = ' http://localhost:3000'
  var ENV = {
    modulePrefix: 'chrome-app',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    domain: apiDomain,
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV.contentSecurityPolicy = {
    'default-src': "'none'",
    'script-src': "'self'",
    'font-src': "'self'",
    'connect-src': "'self' " + apiDomain,
    'img-src': "'self'",
    'style-src': "'self' 'unsafe-inline'",
    'media-src': "'self'"
  }

  if (environment === 'development') {
    ENV.locationType = 'hash';
    ENV['simple-auth'] = {
      authorizer: 'authorizer:custom',
      serverTokenEndpoint: apiDomain + '/api/v1/sessions',
      crossOriginWhitelist: [apiDomain]
    };
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'hash';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.locationType = 'hash';
    ENV['simple-auth'] = {
      authorizer: 'authorizer:custom',
      store: 'store:chrome-storage',
      serverTokenEndpoint: apiDomain + '/api/v1/sessions',
      crossOriginWhitelist: [apiDomain]
    };
  }

  return ENV;
};
