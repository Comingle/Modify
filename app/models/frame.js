import DS from 'ember-data';

export default DS.Model.extend({
  motor1: DS.attr('integer', { defaultValue: 0 }),
  motor2: DS.attr('integer', { defaultValue: 0 }),
  motor3: DS.attr('integer', { defaultValue: 0 }),
  timeMS: DS.attr('integer', { defaultValue: 10 })
});
