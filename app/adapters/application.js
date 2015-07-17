import config from '../config/environment';
import DS from 'ember-data';


export default DS.ActiveModelAdapter.extend({
  host: config.domain + '/api/v1'
});
