// ─────────────────────────────────────────────────────────
// Validation Middleware (express-validator wrapper)
// ─────────────────────────────────────────────────────────

const { validationResult } = require('express-validator');

/**
 * Runs after express-validator check chains.
 * Collects errors and returns a structured 400 response.
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
        value: e.value,
      })),
    });
  }
  next();
}

module.exports = { handleValidationErrors };
