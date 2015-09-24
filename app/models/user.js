import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  password: DS.attr('string'),
  passwordConfirmation: DS.attr('string'),
  avatar: DS.attr('string'),
  username: DS.attr('string'),
  sketchHistory: DS.hasMany('sketch-history')
});
