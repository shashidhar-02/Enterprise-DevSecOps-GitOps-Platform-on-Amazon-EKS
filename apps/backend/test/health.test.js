import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createApp } from '../src/app.js';

test('health endpoint returns ok', async () => {
  const app = createApp();
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, 'ok');
    assert.equal(body.service, 'cloudmart-backend');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
