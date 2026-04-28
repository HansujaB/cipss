// ─────────────────────────────────────────────────────────
// Need Score — "How urgently does this area need intervention?"
// ─────────────────────────────────────────────────────────
//
// Heuristic weights (tune these as needed):
const ALPHA = 0.3; // frequency weight
const BETA  = 0.3; // severity weight
const GAMMA = 0.2; // recency weight
const DELTA = 0.2; // past-action weight

// Normalization caps
const MAX_FREQUENCY = 50;    // reports
const MAX_SEVERITY  = 1000;  // kg
const RECENCY_WINDOW = 30;   // days

/**
 * Compute the Need Score for an area / grid cell.
 *
 * @param {object} params
 * @param {number} params.frequency   - Number of reports in area (last 30 days)
 * @param {number} params.severity    - e.g., waste_kg reported
 * @param {number} params.recency     - Days since last report (lower = more recent)
 * @param {number} params.pastAction  - 0 to 1 — how much action has been taken (1 = lots)
 * @returns {number} Score from 0 to 100
 */
function computeNeedScore({ frequency, severity, recency, pastAction }) {
  // Normalize each factor to 0–1
  const F = Math.min(frequency / MAX_FREQUENCY, 1);
  const S = Math.min(severity / MAX_SEVERITY, 1);
  const R = Math.max(0, 1 - recency / RECENCY_WINDOW); // recent = closer to 1
  const A = 1 - Math.min(pastAction, 1);                // low action = higher need

  const raw = ALPHA * F + BETA * S + GAMMA * R + DELTA * A;
  return parseFloat((raw * 100).toFixed(2));
}

module.exports = { computeNeedScore };
