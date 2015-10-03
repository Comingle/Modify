import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  type: DS.attr('string'),
  pretty_name: DS.attr('string'),
  defaultValue: DS.attr('number'),
  min: DS.attr('number'),
  max: DS.attr('number'),
  color: DS.attr('string'),

  value: function () {
    return this.get('defaultValue');
  }.property('defaultValue'),

  // we need to be getting a default lowValue and a default highValue actually
  // This is an intentionally bad hack to make us do the refactor
  lowValue: function () {
    return this.get('value');
  }.property('value'),

  highValue: function () {
    return this.get('value');
  }.property('value')
});
