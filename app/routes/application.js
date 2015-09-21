import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  actions: {
    sessionAuthenticationSucceeded: function() {
      let _this = this;
      let controller = this.controllerFor('application');
      let toy = controller.get('toy');
      if (toy.get('device')) {
        toy.getSketchParams()
        .then(toy.findSketch.bind(toy)).then(function() {
          // findSketch sets config with server response
          let config = toy.get('config');
          if (!config) {
            _this.transitionTo('/not_found');
          } else {
            _this.transitionTo('/quicky');
          }
        }, function(e) { console.log(e); });
      // no device -- restore mode.
      } else {
        let restore = _this.controllerFor('restore');
        if (chrome.serial) {
          chrome.serial.getDevices(function (devices) {
            restore.set('devices', devices);
            _this.transitionTo('/restore');
          });
        }

      }
    }
  }
});
