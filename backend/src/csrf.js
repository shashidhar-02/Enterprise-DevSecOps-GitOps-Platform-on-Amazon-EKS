const crypto = require('node:crypto');
const { doubleCsrf } = require('csrf-csrf');

function createCsrf(security, jwtSecret, production) {
  const cookieName = production ? '__Host-cravedrop_csrf' : 'cravedrop_csrf';
  const nonceName = production ? '__Host-cravedrop_csrf_id' : 'cravedrop_csrf_id';
  const secret = crypto.createHmac('sha256', jwtSecret).update('cravedrop-csrf-v1').digest('hex');
  const { generateCsrfToken, validateRequest, doubleCsrfProtection, invalidCsrfTokenError } = doubleCsrf({
    getSecret: () => secret,
    getSessionIdentifier: (req) => security.tokenFrom(req) || req.cookies[nonceName] || '',
    cookieName, cookieOptions: security.cookieOptions,
  });
  return {
    token: (req, res) => {
      if (!/^[a-f0-9]{64}$/.test(req.cookies[nonceName] || '')) {
        const nonce = crypto.randomBytes(32).toString('hex');
        req.cookies[nonceName] = nonce;
        res.cookie(nonceName, nonce, security.cookieOptions);
      }
      const overwrite = !validateRequest({ ...req, headers: { ...req.headers,
        'x-csrf-token': req.cookies[cookieName] } });
      res.set('Cache-Control', 'no-store');
      res.json({ csrfToken: generateCsrfToken(req, res, { overwrite }) });
    },
    protect: (req, res, next) => {
      if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
      // Enforce exact header/cookie equality before the library verifies the signed,
      // session-bound token. The request header is never inferred from a cookie.
      if (req.cookies[cookieName] !== req.headers['x-csrf-token']) return next(invalidCsrfTokenError);
      return doubleCsrfProtection(req, res, next);
    },
  };
}
module.exports = { createCsrf };
