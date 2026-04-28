// ─────────────────────────────────────────────────────────
// Trust Score — "How credible is this NGO or influencer?"
// ─────────────────────────────────────────────────────────
//
// Heuristic weights:
const W_ENGAGEMENT   = 0.25;
const W_AUTHENTICITY = 0.30;
const W_CONSISTENCY  = 0.25;
const W_PAST_IMPACT  = 0.20;

/**
 * Compute the Trust Score for an NGO.
 *
 * @param {object} params
 * @param {number} params.engagement   - 0 to 1 (engagement rate)
 * @param {number} params.authenticity - 0 to 1 (follower quality score)
 * @param {number} params.consistency  - 0 to 1 (campaign completion rate)
 * @param {number} params.pastImpact   - 0 to 1 (verified past impact)
 * @returns {number} Score from 0 to 100
 */
function computeTrustScore({ engagement, authenticity, consistency, pastImpact }) {
  const raw =
    W_ENGAGEMENT   * Math.min(engagement, 1) +
    W_AUTHENTICITY * Math.min(authenticity, 1) +
    W_CONSISTENCY  * Math.min(consistency, 1) +
    W_PAST_IMPACT  * Math.min(pastImpact, 1);

  return parseFloat((raw * 100).toFixed(2));
}

module.exports = { computeTrustScore };
