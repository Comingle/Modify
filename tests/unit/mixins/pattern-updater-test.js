import Ember from 'ember';
import PatternUpdaterMixin from '../../../mixins/pattern-updater';
import { module, test } from 'qunit';

module('PatternUpdaterMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var PatternUpdaterObject = Ember.Object.extend(PatternUpdaterMixin);
  var subject = PatternUpdaterObject.create();
  assert.ok(subject);
});
