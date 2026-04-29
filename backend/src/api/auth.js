// ─────────────────────────────────────────────────────────
// Auth Routes — /api/v1/auth
// Register & Login (issues JWTs)
// ─────────────────────────────────────────────────────────

const { Router } = require('express');
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { handleValidationErrors } = require('../middleware/validate');

const router = Router();
const ROLE_ALIASES = {
  ngo: 'ngo_admin',
  donor: 'company',
};

function normalizeRole(role) {
  return ROLE_ALIASES[role] || role;
}

// ── POST /auth/register ──────────────────────────────────

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('name').optional().isString(),
    body('role')
      .isIn(['volunteer', 'influencer', 'company', 'ngo_admin', 'ngo', 'donor'])
      .withMessage('Role must be volunteer, influencer, company, or ngo_admin'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const { email, password, name } = req.body;
      const role = normalizeRole(req.body.role);

      // Check if user already exists
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(12);
      const hashed = await bcrypt.hash(password, salt);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashed,
          name,
          role,
          volunteerProfile: role === 'volunteer' ? { create: {} } : undefined,
          influencerProfile: role === 'influencer' ? { create: {} } : undefined,
          companyProfile: role === 'company' ? { create: {} } : undefined,
          ngoProfile: role === 'ngo_admin' ? { create: {} } : undefined,
        },
        select: { id: true, email: true, name: true, role: true, createdAt: true },
      });

      // Issue JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.status(201).json({ user, token });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /auth/login ─────────────────────────────────────

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
