import { module, test } from 'qunit';
import { setupTest } from 'globe-trotter/tests/helpers';

module('Unit | Controller | add', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:add');
    assert.ok(controller);
  });
});
