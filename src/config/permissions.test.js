import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { canAccess } from './permissions.js';

describe('canAccess RBAC function', () => {
  it('should return true for valid role and permitted view', () => {
    assert.equal(canAccess('Administrador', 'dashboard'), true);
    assert.equal(canAccess('Alumno', 'mi-horario'), true);
  });

  it('should return false for valid role but unpermitted view', () => {
    assert.equal(canAccess('Alumno', 'profesores'), false);
    assert.equal(canAccess('Profesor', 'alumnos'), false);
  });

  it('should return false for an invalid or unknown role', () => {
    assert.equal(canAccess('UnknownRole', 'dashboard'), false);
    assert.equal(canAccess(null, 'dashboard'), false);
    assert.equal(canAccess(undefined, 'dashboard'), false);
  });

  it('should return false for an undefined view', () => {
    assert.equal(canAccess('Secretaria', undefined), false);
    assert.equal(canAccess('Secretaria', null), false);
  });
});
