import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword } from './crypto.js';

test('hashPassword generates correct SHA-256 hash', async () => {
  const password = 'testPassword123';
  const expectedHash = 'e2b4acd109102ad7a518d36bb43ba20092fd360bc6967b2ca8f160d806c03688';
  const actualHash = await hashPassword(password);
  assert.equal(actualHash, expectedHash);
});

test('hashPassword is deterministic', async () => {
  const password = 'testPassword123';
  const hash1 = await hashPassword(password);
  const hash2 = await hashPassword(password);
  assert.equal(hash1, hash2);
});

test('hashPassword returns different hashes for different inputs', async () => {
  const hash1 = await hashPassword('password');
  const hash2 = await hashPassword('Password'); // Capital P
  assert.notEqual(hash1, hash2);
});

test('hashPassword handles empty string', async () => {
  const expectedHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  const actualHash = await hashPassword('');
  assert.equal(actualHash, expectedHash);
});
