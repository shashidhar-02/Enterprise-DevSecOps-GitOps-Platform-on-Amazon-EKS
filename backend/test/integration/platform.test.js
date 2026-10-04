const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { randomBytes } = require('node:crypto');
const { io: connect } = require('socket.io-client');
const { createApp } = require('../../src/app');
const { initSockets } = require('../../src/socket');

test('PostgreSQL signup, ownership, checkout, migrations and authenticated order sockets', async (t) => {
  assert.equal(process.env.NODE_ENV, 'test', 'Integration tests require NODE_ENV=test');
  assert.match(process.env.DB_NAME || '', /^cravedrop_test(?:_[a-z0-9]+)?$/, 'Use a disposable cravedrop_test database');
  const { pool, initDB } = require('../../src/db');
  t.after(() => pool.end());
  await initDB();
  await pool.query('ALTER TABLE orders DROP COLUMN updated_at, DROP COLUMN delivery_fee, DROP COLUMN taxes');
  await initDB();
  await pool.query('TRUNCATE users, restaurants, dishes, addresses, reviews, orders RESTART IDENTITY CASCADE');
  let sockets;
  const { app, security } = createApp({ pool, jwtSecret: randomBytes(32).toString('hex'),
    emit: (order) => sockets.to(`order_${order.id}`).emit('order_status_updated', { orderId: order.id, status: order.status }) });
  const server = http.createServer(app);
  sockets = initSockets(server, pool, security);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => sockets.close(resolve)));
  const origin = `http://localhost:${server.address().port}`;
  const request = async (path, method = 'GET', body, cookie) => {
    const headers = { 'content-type': 'application/json', ...(cookie ? { cookie } : {}) };
    if (method !== 'GET') {
      const csrf = await fetch(`${origin}/api/auth/csrf`, { headers });
      assert.equal(csrf.status, 200);
      headers.cookie = [cookie, ...csrf.headers.getSetCookie().map((value) => value.split(';')[0])].filter(Boolean).join('; ');
      headers['x-csrf-token'] = (await csrf.json()).csrfToken;
    }
    const response = await fetch(`${origin}/api${path}`, { method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body) });
    return { status: response.status, data: await response.json(), cookie: response.headers.get('set-cookie')?.split(';')[0] };
  };
  const password = ' whitespace preserved password ';
  const alice = await request('/auth/signup', 'POST', { name: 'Alice', email: 'ALICE@example.test', password, role: 'admin', address: 'Test street' });
  assert.equal(alice.status, 201);
  assert.equal(alice.data.user.role, 'customer');
  assert.equal(alice.data.token, undefined);
  assert.ok(alice.cookie.startsWith('cravedrop_session='));
  const stored = await pool.query('SELECT password FROM users WHERE id = $1', [alice.data.user.id]);
  assert.notEqual(stored.rows[0].password, password);
  assert.equal((await request('/auth/login', 'POST', { email: 'alice@example.test', password })).status, 200);
  assert.equal((await request('/auth/login', 'POST', { email: 'alice@example.test', password: password.trim() })).status, 401);
  assert.equal((await request('/auth/signup', 'POST', { name: 'Duplicate', email: 'alice@example.test', password })).status, 409);
  const bob = await request('/auth/signup', 'POST', { name: 'Bob', email: 'bob@example.test', password });
  const restaurant = await request('/restaurants', 'POST', { name: 'Kitchen', category: 'Lunch' }, alice.cookie);
  assert.equal(restaurant.status, 201);
  const restaurantId = restaurant.data.id;
  assert.equal((await request(`/restaurants/${restaurantId}`, 'DELETE', undefined, bob.cookie)).status, 404);
  assert.equal((await request(`/restaurants/${restaurantId}/dishes`, 'POST', { name: 'Meal', price: '10.10', is_veg: true }, bob.cookie)).status, 404);
  const dish = await request(`/restaurants/${restaurantId}/dishes`, 'POST', { name: 'Meal', price: '10.10', is_veg: true }, alice.cookie);
  assert.equal(dish.status, 201);
  const order = await request('/orders', 'POST', { restaurant_id: restaurantId, items: [{ id: dish.data.id, quantity: 2, price: 0 }], total_amount: 0 }, alice.cookie);
  assert.equal(order.status, 201);
  assert.equal(order.data.total_amount, '85.20');
  assert.equal(order.data.user_id, String(alice.data.user.id));
  assert.equal((await request(`/orders/${order.data.id}`, 'GET', undefined, bob.cookie)).status, 404);
  assert.equal((await request(`/orders/user/${alice.data.user.id}`, 'GET', undefined, bob.cookie)).status, 403);
  assert.equal((await request(`/orders/${order.data.id}/status`, 'PUT', { status: 'Delivered' }, bob.cookie)).status, 403);
  assert.equal((await request(`/restaurants/${restaurantId}`, 'DELETE', undefined, alice.cookie)).status, 409);
  const review = await request('/reviews', 'POST', { restaurant_id: restaurantId, author: 'spoofed', rating: 5, comment: 'Good meal' }, alice.cookie);
  assert.equal(review.status, 201);
  assert.equal(review.data.author, 'Alice');
  assert.equal((await request(`/reviews/${review.data.id}`, 'DELETE', undefined, bob.cookie)).status, 404);
  const anonymous = connect(origin, { transports: ['websocket'], reconnection: false });
  t.after(() => anonymous.disconnect());
  await new Promise((resolve, reject) => { anonymous.once('connect_error', resolve); anonymous.once('connect', () => reject(new Error('Anonymous socket connected'))); });
  const client = connect(origin, { transports: ['websocket'], reconnection: false, extraHeaders: { cookie: alice.cookie } });
  t.after(() => client.disconnect());
  await new Promise((resolve, reject) => { client.once('connect', resolve); client.once('connect_error', reject); });
  assert.deepEqual(await client.timeout(2000).emitWithAck('join_order', order.data.id), { ok: true });
  assert.deepEqual(await client.timeout(2000).emitWithAck('join_order', order.data.id + 100), { ok: false });
  const update = new Promise((resolve) => client.once('order_status_updated', resolve));
  assert.equal((await request(`/orders/${order.data.id}`, 'DELETE', undefined, alice.cookie)).status, 200);
  assert.equal((await update).status, 'Cancelled');
  assert.equal((await request(`/orders/${order.data.id}`, 'GET', undefined, alice.cookie)).data.status, 'Cancelled');
  assert.equal((await request('/auth/logout', 'POST', {}, alice.cookie)).status, 200);
});
