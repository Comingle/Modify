import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),

  // default value means min or max?
  // need defaultMin and defaultMax
  defaultValue: DS.attr('number'),
  min: DS.attr('number'),
  max: DS.attr('number'),

  value: function () {
    return this.get('defaultValue');
  }.property('defaultValue')
});
