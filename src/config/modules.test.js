import { test } from 'node:test';
import assert from 'node:assert';
import { getNavigationForRole, APP_MODULES } from './modules.js';

test('getNavigationForRole', async (t) => {
  await t.test('Happy path: correctly groups allowed modules', () => {
    // Pick two modules that are in the same group and one in a different group
    const allowedIds = ['alumnos', 'profesores', 'perfil'];
    const result = getNavigationForRole(allowedIds);

    // Check if the output is an array of length 2 (Gestión Académica, Cuenta)
    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 2);

    // Check specific group 'Gestión Académica'
    const gestionGroup = result.find(g => g.group === 'Gestión Académica');
    assert.ok(gestionGroup);
    assert.strictEqual(gestionGroup.items.length, 2);
    assert.strictEqual(gestionGroup.items[0].id, 'alumnos');
    assert.strictEqual(gestionGroup.items[1].id, 'profesores');

    // Check specific group 'Cuenta'
    const cuentaGroup = result.find(g => g.group === 'Cuenta');
    assert.ok(cuentaGroup);
    assert.strictEqual(cuentaGroup.items.length, 1);
    assert.strictEqual(cuentaGroup.items[0].id, 'perfil');
  });

  await t.test('Empty input: returns an empty array', () => {
    const result = getNavigationForRole([]);
    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 0);
  });

  await t.test('No input: defaults to an empty array and returns an empty array', () => {
    const result = getNavigationForRole();
    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 0);
  });

  await t.test('Unknown IDs: ignores IDs that do not exist in APP_MODULES', () => {
    const allowedIds = ['dashboard', 'unknown-id-123', 'fake-module'];
    const result = getNavigationForRole(allowedIds);

    // Only dashboard should be processed
    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 1);

    const principalGroup = result.find(g => g.group === 'Principal');
    assert.ok(principalGroup);
    assert.strictEqual(principalGroup.items.length, 1);
    assert.strictEqual(principalGroup.items[0].id, 'dashboard');
  });
});
