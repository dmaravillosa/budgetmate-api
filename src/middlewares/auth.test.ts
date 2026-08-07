import assert from 'assert';
import { isPublicRoute } from './auth';

function run() {
  assert.strictEqual(isPublicRoute('/auth/google'), true);
  assert.strictEqual(isPublicRoute('/expenses'), false);
  assert.strictEqual(isPublicRoute('/health'), true);
  console.log('auth middleware checks passed');
}

run();
