// ─────────────────────────────────────────────────────────
// Impact Score — "How much real impact did a campaign deliver?"
// ─────────────────────────────────────────────────────────

/**
 * Compute the Impact Score after a campaign is completed.
 *
 * @param {object} params
 * @param {number} params.workDone        - Actual output (e.g., waste_kg collected)
 * @param {number} params.workPlanned     - Planned output
 * @param {number} params.volunteerRate   - actual / planned volunteers (0–1+)
 * @param {boolean} params.proofSubmitted - were images / geo-verified?
 * @returns {number} Score from 0 to 100
 */
function computeImpactScore({ workDone, workPlanned, volunteerRate, proofSubmitted }) {
  if (!workPlanned || workPlanned === 0) return 0;

  const completionRate   = Math.min(workDone / workPlanned, 1.5); // cap at 150%
  const proofMultiplier  = proofSubmitted ? 1.0 : 0.6;
  const volunteerFactor  = Math.min(volunteerRate, 1.2);

  const raw = completionRate * volunteerFactor * proofMultiplier;
  return parseFloat((Math.min(raw, 1) * 100).toFixed(2));
}

module.exports = { computeImpactScore };
