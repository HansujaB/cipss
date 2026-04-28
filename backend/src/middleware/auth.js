// ─────────────────────────────────────────────────────────
// JWT Auth Middleware
// ─────────────────────────────────────────────────────────

const jwt = require('jsonwebtoken');

/**
 * Verifies the Bearer token from the Authorization header.
 * On success, attaches the decoded payload to `req.user`.
 */
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Role-based access control.  Pass allowed roles as arguments.
 * Must be used AFTER authMiddleware.
 *
 * @example router.get('/admin', authMiddleware, requireRole('ngo_admin'), handler)
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

module.exports = { authMiddleware, requireRole };
