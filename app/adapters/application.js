import config from '../config/environment';
import DS from 'ember-data';


export default DS.ActiveModelAdapter.extend({
  host: config.domain + '/api/v1',
  suffix: '.json',

  pathForType: function(type) {
    return this._super(type) + this.get('suffix');
  }
});
