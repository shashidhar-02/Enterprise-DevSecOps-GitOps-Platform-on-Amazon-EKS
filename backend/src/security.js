const crypto = require('node:crypto');
const { promisify } = require('node:util');
const jwt = require('jsonwebtoken');
const scrypt = promisify(crypto.scrypt);
const COOKIE_NAME = 'cravedrop_session';
const SCRYPT_OPTIONS = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const wrap = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

function positiveId(value) {
  if (typeof value !== 'number' && (typeof value !== 'string' || !/^[1-9]\d*$/.test(value))) {
    throw new HttpError(400, 'A positive integer ID is required');
  }
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
    throw new HttpError(400, 'A positive integer ID is required');
  }
  return id;
}

function text(value, max, required = true) {
  if (!required && (value === undefined || value === null || value === '')) return '';
  if (typeof value !== 'string' || !value.trim() || value.length > max) {
    throw new HttpError(400, `Expected non-empty text of at most ${max} characters`);
  }
  return value.trim();
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = await scrypt(password, salt, 64, SCRYPT_OPTIONS);
  return `scrypt-v1$${salt}$${key.toString('hex')}`;
}

async function verifyPassword(password, stored) {
  if (typeof password !== 'string' || password.length > 128 || typeof stored !== 'string') return false;
  const match = /^scrypt-v1\$([a-f0-9]{32})\$([a-f0-9]{128})$/.exec(stored);
  if (!match) return false;
  const key = await scrypt(password, match[1], 64, SCRYPT_OPTIONS);
  return crypto.timingSafeEqual(key, Buffer.from(match[2], 'hex'));
}

function createSecurity(pool, secret, production) {
  if (typeof secret !== 'string' || secret.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters');
  }
  const cookieOptions = { httpOnly: true, sameSite: 'strict', secure: production, path: '/' };
  const verify = (token) => jwt.verify(token, secret, {
    algorithms: ['HS256'], issuer: 'cravedrop', audience: 'cravedrop-web',
  });
  const tokenFrom = (req) => req.cookies?.[COOKIE_NAME] ||
    (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : '');
  const userForToken = async (token) => {
    let payload;
    try { payload = verify(token); } catch { throw new HttpError(401, 'Invalid session'); }
    const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [positiveId(payload.sub)]);
    if (!result.rows[0]) throw new HttpError(401, 'Invalid session');
    return result.rows[0];
  };
  return {
    cookieOptions, tokenFrom, userForToken,
    authenticate: wrap(async (req, _res, next) => {
      const token = tokenFrom(req);
      if (!token) throw new HttpError(401, 'Authentication required');
      req.user = await userForToken(token);
      next();
    }),
    issue: (res, user) => {
      const token = jwt.sign({}, secret, {
        subject: String(user.id), algorithm: 'HS256', issuer: 'cravedrop',
        audience: 'cravedrop-web', expiresIn: '1d',
      });
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 86400000 });
    },
    logout: (res) => res.clearCookie(COOKIE_NAME, cookieOptions),
  };
}

function passwordInput(value, minimum = 1) {
  if (typeof value !== 'string' || value.length < minimum || value.length > 128) {
    throw new HttpError(400, `Password must contain ${minimum} to 128 characters`);
  }
  return value;
}

module.exports = { COOKIE_NAME, HttpError, wrap, positiveId, text, passwordInput, hashPassword, verifyPassword, createSecurity };
