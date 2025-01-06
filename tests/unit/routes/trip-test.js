import { module, test } from 'qunit';
import { setupTest } from 'globe-trotter/tests/helpers';

module('Unit | Route | trip', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:trip');
    assert.ok(route);
  });
});
