const fs = require('node:fs');
const path = require('node:path');

function loadSecretFiles() {
  const directory = process.env.SECRETS_DIR;
  if (!directory) return;
  for (const name of ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET']) {
    process.env[name] = fs.readFileSync(path.join(directory, name), 'utf8').replace(/\r?\n$/, '');
  }
}
module.exports = { loadSecretFiles };
