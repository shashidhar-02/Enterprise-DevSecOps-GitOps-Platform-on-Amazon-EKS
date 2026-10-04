const test = require('node:test');
const assert = require('node:assert/strict');
const { randomBytes } = require('node:crypto');
const jwt = require('jsonwebtoken');
const { hashPassword, verifyPassword, createSecurity, positiveId, passwordInput } = require('../src/security');
const { priceOrder } = require('../src/pricing');

test('passwords are salted, whitespace-preserving and never stored as plaintext', async () => {
  const password = ' a sufficiently long password ';
  const first = await hashPassword(password);
  const second = await hashPassword(password);
  assert.notEqual(first, second);
  assert.ok(!first.includes(password));
  assert.equal(await verifyPassword(password, first), true);
  assert.equal(await verifyPassword(password.trim(), first), false);
  assert.equal(await verifyPassword(password, password), false);
  assert.equal(await verifyPassword(password, 'invalid'), false);
  assert.equal(passwordInput(password, 12), password);
  assert.throws(() => passwordInput('short', 12), { status: 400 });
});

test('IDs reject coercion tricks and oversized database integers', () => {
  for (const id of [true, null, {}, [], '1e2', '1.0', ' 1', -1, 0, 1.5, 2147483648]) {
    assert.throws(() => positiveId(id), { status: 400 });
  }
  assert.equal(positiveId('42'), 42);
});

test('order pricing uses catalogue cents, combines quantities, and ignores submitted prices', () => {
  const result = priceOrder([{ id: 1, quantity: 2, price: 0 }, { id: 1, quantity: 1 }, { id: 2, quantity: 3 }],
    [{ id: 1, name: 'Meal', price: '10.10' }, { id: 2, name: 'Drink', price: '0.20' }]);
  assert.equal(result.total, '95.90');
  assert.equal(result.items[0].quantity, 3);
  assert.equal(result.items[0].price, '10.10');
  assert.throws(() => priceOrder([{ id: 3, quantity: 1 }], []), { status: 400 });
  for (const quantity of [0, -1, 100, 1.1, '2']) {
    assert.throws(() => priceOrder([{ id: 1, quantity }], []), { status: 400 });
  }
  assert.throws(() => priceOrder([{ id: 1, quantity: 50 }, { id: 1, quantity: 50 }], []), { status: 400 });
});

test('sessions require the expected issuer, algorithm and a current database account', async () => {
  const secret = randomBytes(32).toString('hex');
  const pool = { query: async (_sql, values) => ({ rows: values[0] === 7 ? [{ id: 7, role: 'customer' }] : [] }) };
  const security = createSecurity(pool, secret, true);
  let session;
  security.issue({ cookie: (name, token, options) => { session = { name, token, options }; } }, { id: 7 });
  assert.equal(session.options.httpOnly, true);
  assert.equal(session.options.secure, true);
  assert.equal(session.options.sameSite, 'strict');
  assert.equal((await security.userForToken(session.token)).id, 7);
  const firstToken = session.token;
  security.issue({ cookie: (_name, token) => { session.token = token; } }, { id: 7 });
  assert.notEqual(session.token, firstToken);
  await assert.rejects(security.userForToken(jwt.sign({ sub: '7' }, secret)), { status: 401 });
  await assert.rejects(security.userForToken(jwt.sign({}, secret, {
    subject: '8', issuer: 'cravedrop', audience: 'cravedrop-web', expiresIn: '1d',
  })), { status: 401 });
  assert.throws(() => createSecurity(pool, 'weak', true));
});
