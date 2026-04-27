// ─────────────────────────────────────────────────────────
// Application Entry Point
// Data-Driven Social Impact Platform — Backend API
// ─────────────────────────────────────────────────────────

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const prisma = require('./lib/prisma');
const { errorHandler } = require('./middleware/errorHandler');

// ── Route imports ────────────────────────────────────────
const authRoutes = require('./api/auth');
const ngoRoutes = require('./api/ngo');
const campaignRoutes = require('./api/campaigns');
const scoreRoutes = require('./api/scores');
const insightRoutes = require('./api/insights');

const app = express();
const PORT = process.env.PORT || 3000;

// ─────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────────────────

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
});

// ─────────────────────────────────────────────────────────
// API Routes — /api/v1
// ─────────────────────────────────────────────────────────

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ngo', ngoRoutes);
app.use('/api/v1/campaigns', campaignRoutes);
app.use('/api/v1/score', scoreRoutes);
app.use('/api/v1/insights', insightRoutes);

// ─────────────────────────────────────────────────────────
// 404 Handler
// ─────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({
    error: 'Route not found',
    hint: 'All API routes are under /api/v1',
    available_routes: {
      auth: '/api/v1/auth/register | /api/v1/auth/login',
      ngo: '/api/v1/ngo | /api/v1/ngo/upload | /api/v1/ngo/:id/metrics',
      campaigns: '/api/v1/campaigns | /api/v1/campaigns/recommended | /api/v1/campaigns/:id/complete',
      scores: '/api/v1/score/need | /api/v1/score/trust | /api/v1/score/impact',
      insights: '/api/v1/insights/hotspots | /api/v1/insights/trends | /api/v1/insights/need-score',
    },
  });
});

// ─────────────────────────────────────────────────────────
// Global Error Handler (must be last)
// ─────────────────────────────────────────────────────────

app.use(errorHandler);

// ─────────────────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚀  CIPSS Backend running on http://localhost:${PORT}`);
  console.log(`📡  API Base: http://localhost:${PORT}/api/v1`);
  console.log(`💚  Health:   http://localhost:${PORT}/health\n`);
});

// ─────────────────────────────────────────────────────────
// Graceful Shutdown
// ─────────────────────────────────────────────────────────

async function shutdown(signal) {
  console.log(`\n${signal} received — shutting down gracefully…`);
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

module.exports = app;
