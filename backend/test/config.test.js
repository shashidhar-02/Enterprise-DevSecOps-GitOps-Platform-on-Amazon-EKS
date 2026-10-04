const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { randomBytes } = require('node:crypto');
const { loadSecretFiles } = require('../src/config');

test('mounted secrets preserve password whitespace and cannot override application mode', (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cravedrop-secrets-'));
  const keys = ['SECRETS_DIR', 'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET', 'NODE_ENV'];
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  t.after(() => {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
    fs.rmSync(directory, { recursive: true });
  });
  const password = ` ${randomBytes(24).toString('hex')} `;
  const values = { DB_HOST: 'localhost', DB_NAME: 'cravedrop_test', DB_USER: 'test',
    DB_PASSWORD: password, JWT_SECRET: randomBytes(32).toString('hex'), NODE_ENV: 'development' };
  for (const [key, value] of Object.entries(values)) fs.writeFileSync(path.join(directory, key), `${value}\n`, { mode: 0o600 });
  process.env.SECRETS_DIR = directory;
  process.env.NODE_ENV = 'production';
  loadSecretFiles();
  assert.equal(process.env.DB_PASSWORD, password);
  assert.equal(process.env.JWT_SECRET, values.JWT_SECRET);
  assert.equal(process.env.NODE_ENV, 'production');
  fs.unlinkSync(path.join(directory, 'JWT_SECRET'));
  assert.throws(loadSecretFiles, { code: 'ENOENT' });
});
