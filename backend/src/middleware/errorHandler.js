// ─────────────────────────────────────────────────────────
// Global Error Handler
// Always returns clean JSON — never exposes raw DB errors.
// ─────────────────────────────────────────────────────────

function errorHandler(err, req, res, _next) {
  console.error('[Error]', err);

  // Prisma known-request errors
  if (err.code && err.code.startsWith('P')) {
    return res.status(400).json({
      error: 'Database operation failed',
      code: err.code,
      ...(process.env.NODE_ENV !== 'production' && { detail: err.message }),
    });
  }

  // JWT / auth errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: err.message });
  }

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large (max 10 MB)' });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Unexpected file field' });
  }

  // Fallback
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

module.exports = { errorHandler };
