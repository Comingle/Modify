import DS from 'ember-data';

export default DS.Model.extend({
  motorOne: DS.attr('integer', { defaultValue: 0 }),
  motorTwo: DS.attr('integer', { defaultValue: 0 }),
  motorThree: DS.attr('integer', { defaultValue: 0 }),
  timeMS: DS.attr('integer', { defaultValue: 10 })
});
