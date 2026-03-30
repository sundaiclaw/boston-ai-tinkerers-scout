const test = require('node:test');
const assert = require('node:assert/strict');
const { getConfig, normalizePort } = require('../src/config');

test('normalizePort preserves 0 for ephemeral-port startup smoke checks', () => {
  assert.equal(normalizePort('0', 8080), 0);
  assert.equal(normalizePort(0, 8080), 0);
});

test('normalizePort falls back for invalid values', () => {
  assert.equal(normalizePort('', 8080), 8080);
  assert.equal(normalizePort('not-a-number', 8080), 8080);
  assert.equal(normalizePort('-1', 8080), 8080);
});

test('getConfig reads PORT without forcing 0 back to 8080', () => {
  const originalPort = process.env.PORT;

  process.env.PORT = '0';

  try {
    assert.equal(getConfig().port, 0);
  } finally {
    if (originalPort === undefined) {
      delete process.env.PORT;
    } else {
      process.env.PORT = originalPort;
    }
  }
});
