import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('pattern', {
  needs: ['model:frame', 'model:control-option']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
