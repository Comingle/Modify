import DS from 'ember-data';

export default DS.Model.extend({
  motorOne: DS.attr('number', { defaultValue: 0 }),
  motorTwo: DS.attr('number', { defaultValue: 0 }),
  motorThree: DS.attr('number', { defaultValue: 0 }),
  timeMS: DS.attr('number', { defaultValue: 10 })
});
