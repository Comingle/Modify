import DS from 'ember-data';

export default DS.Model.extend({
  sketchId: DS.attr('number'),
  note: DS.attr('string'),
  date: DS.attr('date'),
  user: DS.belongsTo('user'),

  niceDate: function() {
    let dateObj = new Date(this.get('date'));
    return dateObj.toDateString() + ", " + dateObj.toLocaleTimeString();
  }.property('date')
});
