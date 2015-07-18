import DS from 'ember-data';

var Pattern = DS.Model.extend({
  name: DS.attr('string'),
  prettyName: DS.attr('string'),
  description: DS.attr('string'),
  frames: DS.hasMany('frame'),
  controlOptions: DS.hasMany('control-option'),
  active: DS.attr('boolean', { defaultValue: false })
});

export default Pattern;
