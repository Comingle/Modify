import Ember from 'ember';

export default Ember.Component.extend({

  input: function (val) {
    this.sendAction('changeMotor', this.get('motorNum'), val.target.valueAsNumber);
  }
});
