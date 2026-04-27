// ─────────────────────────────────────────────────────────
// NGO Routes — /api/v1/ngo
// ─────────────────────────────────────────────────────────

const { Router } = require('express');
const { body, param, query } = require('express-validator');
const multer = require('multer');
const prisma = require('../lib/prisma');
const { handleValidationErrors } = require('../middleware/validate');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { ingestCSV, ingestJSON } = require('../pipelines/ingest');

const router = Router();

// Multer config — store CSV files in memory for processing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['text/csv', 'application/json', 'application/vnd.ms-excel'];
    if (allowed.includes(file.mimetype) || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and JSON files are accepted'));
    }
  },
});

// ── POST /ngo — Create a new NGO ─────────────────────────

router.post(
  '/',
  authMiddleware,
  [
    body('name').notEmpty().withMessage('NGO name is required'),
    body('domain')
      .isIn(['waste_management', 'education', 'environment'])
      .withMessage('Domain must be waste_management, education, or environment'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const { name, domain } = req.body;

      const ngo = await prisma.nGO.create({
        data: { name, domain },
      });

      res.status(201).json(ngo);
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /ngo/:id — Get NGO details ───────────────────────

router.get(
  '/:id',
  [param('id').isUUID().withMessage('Invalid NGO ID'), handleValidationErrors],
  async (req, res, next) => {
    try {
      const ngo = await prisma.nGO.findUnique({
        where: { id: req.params.id },
        include: {
          _count: { select: { metrics: true, campaigns: true } },
        },
      });

      if (!ngo) {
        return res.status(404).json({ error: 'NGO not found' });
      }

      res.json(ngo);
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /ngo/upload — Upload NGO metrics (CSV or JSON) ──

router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  [
    body('ngo_id').isUUID().withMessage('Valid NGO ID is required'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const ngoId = req.body.ngo_id;

      // Verify NGO exists
      const ngo = await prisma.nGO.findUnique({ where: { id: ngoId } });
      if (!ngo) {
        return res.status(404).json({ error: 'NGO not found' });
      }

      let result;

      if (req.file) {
        // ── CSV Upload ───────────────────────────────
        const buffer = req.file.buffer.toString('utf-8');
        result = await ingestCSV(buffer, ngoId);
      } else if (req.body.metrics && Array.isArray(req.body.metrics)) {
        // ── JSON body upload ─────────────────────────
        result = await ingestJSON(req.body.metrics, ngoId);
      } else {
        return res.status(400).json({
          error: 'Provide a CSV file (field: "file") or a JSON "metrics" array in the body',
        });
      }

      res.status(201).json({
        message: `Ingestion complete: ${result.inserted} inserted, ${result.skipped} skipped`,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /ngo/:id/metrics — Get metrics for an NGO ────────

router.get(
  '/:id/metrics',
  [
    param('id').isUUID().withMessage('Invalid NGO ID'),
    query('domain').optional().isString(),
    query('limit').optional().isInt({ min: 1, max: 500 }),
    query('offset').optional().isInt({ min: 0 }),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { domain, limit = '50', offset = '0' } = req.query;

      // Verify NGO exists
      const ngo = await prisma.nGO.findUnique({ where: { id } });
      if (!ngo) {
        return res.status(404).json({ error: 'NGO not found' });
      }

      const where = { ngoId: id };
      if (domain) where.domain = domain;

      const [metrics, total] = await Promise.all([
        prisma.nGOMetric.findMany({
          where,
          orderBy: { date: 'desc' },
          take: parseInt(limit),
          skip: parseInt(offset),
        }),
        prisma.nGOMetric.count({ where }),
      ]);

      res.json({
        metrics,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
