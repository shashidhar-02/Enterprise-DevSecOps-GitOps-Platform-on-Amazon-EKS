const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { randomBytes } = require('node:crypto');
const jwt = require('jsonwebtoken');
const { createApp } = require('../src/app');

async function fixture(t, query) {
  const secret = randomBytes(32).toString('hex');
  const { app } = createApp({ pool: { query }, jwtSecret: secret });
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const token = jwt.sign({}, secret, { subject: '1', issuer: 'cravedrop', audience: 'cravedrop-web', expiresIn: '1d' });
  const request = (path, options = {}) => fetch(`http://127.0.0.1:${server.address().port}/api${path}`, options);
  const headers = { authorization: `Bearer ${token}`, 'content-type': 'application/json' };
  const csrf = await request('/auth/csrf', { headers });
  headers.cookie = csrf.headers.getSetCookie().map((cookie) => cookie.split(';')[0]).join('; ');
  headers['x-csrf-token'] = (await csrf.json()).csrfToken;
  return { request, headers };
}

test('liveness, readiness, security headers and origin rejection have independent semantics', async (t) => {
  const { request } = await fixture(t, async () => { throw new Error('database connection secret'); });
  const health = await request('/health');
  assert.equal(health.status, 200);
  assert.equal(health.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(health.headers.get('x-powered-by'), null);
  const ready = await request('/ready');
  assert.equal(ready.status, 503);
  assert.equal((await ready.json()).error, 'Service unavailable');
  assert.equal((await request('/health', { headers: { origin: 'https://untrusted.example' } })).status, 403);
  assert.equal((await request('/missing')).status, 404);
});

test('order endpoints reject anonymous, cross-account and non-admin writes before changing data', async (t) => {
  const queries = [];
  const { request, headers } = await fixture(t, async (sql) => {
    queries.push(sql);
    return { rows: [{ id: 1, role: 'customer' }] };
  });
  assert.equal((await request('/orders/1')).status, 401);
  assert.equal((await request('/orders/user/2', { headers })).status, 403);
  assert.equal((await request('/orders', { method: 'POST', headers, body: JSON.stringify({ user_id: 2 }) })).status, 403);
  assert.equal((await request('/orders/1/status', { method: 'PUT', headers, body: JSON.stringify({ status: 'Delivered' }) })).status, 403);
  assert.ok(queries.every((sql) => sql.startsWith('SELECT id, name, email, role FROM users')));
});

test('checkout persists authenticated identity and server-calculated totals', async (t) => {
  let values;
  const { request, headers } = await fixture(t, async (sql, args) => {
    if (sql.includes('FROM users')) return { rows: [{ id: 1, role: 'customer' }] };
    if (sql.includes('FROM dishes')) return { rows: [{ id: 4, name: 'Meal', price: '12.25' }] };
    values = args;
    return { rows: [{ id: 9, total_amount: args[3], user_id: args[0] }] };
  });
  const response = await request('/orders', { method: 'POST', headers,
    body: JSON.stringify({ restaurant_id: 3, items: [{ id: 4, quantity: 2, price: 0 }], total_amount: 0, taxes: 0 }) });
  assert.equal(response.status, 201);
  assert.equal(values[0], '1');
  assert.equal(values[3], '89.50');
  assert.deepEqual(values.slice(4), [45, 20, 'Order Received']);
});

test('invalid and oversized JSON fail closed with client errors', async (t) => {
  const { request } = await fixture(t, async () => ({ rows: [] }));
  const headers = { 'content-type': 'application/json' };
  const invalid = await request('/auth/login', { method: 'POST', headers, body: '{invalid' });
  assert.equal(invalid.status, 400);
  assert.equal((await invalid.json()).error, 'Invalid JSON');
  assert.equal((await request('/auth/login', { method: 'POST', headers,
    body: JSON.stringify({ data: 'x'.repeat(33000) }) })).status, 413);
});

test('mutation requests reject missing, forged and cross-session CSRF tokens', async (t) => {
  const { request, headers } = await fixture(t, async () => ({ rows: [] }));
  const body = '{}';
  assert.equal((await request('/auth/logout', { method: 'POST', headers: { 'content-type': 'application/json' }, body })).status, 403);
  assert.equal((await request('/auth/logout', { method: 'POST', headers: { ...headers, 'x-csrf-token': 'forged' }, body })).status, 403);
  assert.equal((await request('/auth/logout', { method: 'POST', headers: { ...headers,
    cookie: 'cravedrop_csrf=forged', 'x-csrf-token': 'forged' }, body })).status, 403);
  assert.equal((await request('/auth/logout', { method: 'POST', headers: { ...headers, authorization: 'Bearer different-session' }, body })).status, 403);
  assert.equal((await request('/auth/logout', { method: 'POST', headers, body })).status, 200);
});
