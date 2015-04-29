import Ember from 'ember';

export default Ember.Component.extend({

  change: function (val) {
    this.sendAction('changeMotor', this.get('motorNum'), val.target.valueAsNumber);
  }

});
