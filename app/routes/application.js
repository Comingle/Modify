import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  actions: {
    // successfully auth'd, now get info from our toy:
    sessionAuthenticationSucceeded: function() {
      let _this = this;
      let controller = this.controllerFor('application');
      let toy = controller.get('toy');

      // if our toy reported a fingerprint, ping the server to find that sketch
      if (toy.get('fingerprint')) {
        toy.getSketchById(toy.get('fingerprint'))
        .then(_this.haveConfig.bind(_this), function() {
          _this.downloadSketchFromToy()
          .then(_this.haveConfig.bind(_this), _this.missingConfig.bind(_this));
        });
      // else, drop in to bootloader and download the flash memory.
      } else if (toy.get('device')) {
        _this.downloadSketchFromToy()
        .then(_this.haveConfig.bind(_this), _this.missingConfig.bind(_this));
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
    },

    // reset state on logout. XXX must be a better way to do this.
    sessionInvalidationSucceeded: function() {
      let controller = this.get('controller');
      let toy = controller.get('toy');
      console.log(this);
      if (toy.get('connectionId')) {
        chrome.serial.disconnect(toy.get('connectionId'), function(b) {
          if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
          }
        });
      }
      toy.set('connectionId', null);
      toy.set('config', null);
      toy.set('device', null);
      toy.set('hasDevice', null);
      toy.set('deviceStatus', null);
      toy.set('fingerprint', null);
      toy.set('sketch', null);
      this.transitionTo('/login');
    },

    displayOverlay: function(model) {
      let controller = this.controllerFor('overlay');
      $("body").addClass("overlay");
      return this.render('components/overlay', {
        into: 'application',
        outlet: 'overlay',
        controller: controller
      });
    },
    hideOverlay: function () {
      $("body").removeClass('overlay');
      return this.disconnectOutlet({
        outlet: 'overlay',
        parentView: 'application'
      });
    }

  },

  downloadSketchFromToy: function() {
    let _this = this;
    let controller = this.controllerFor('application');
    let toy = controller.get('toy');

    return new Ember.RSVP.Promise(function(resolve, reject) {
      toy.getSketchParams()
      .then(toy.findSketch.bind(toy))
      .then(resolve, reject);
    });
  },

  haveConfig: function() {
    this.transitionTo('/quicky');
  },

  missingConfig: function() {
    this.transitionTo('/not_found');
  }

});
