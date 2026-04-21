/**
 * Calculate a weighted impact score from three sub-scores.
 * @param {number} need - How urgently the campaign is needed (0-10)
 * @param {number} trust - How trustworthy the NGO/organizer is (0-10)
 * @param {number} expected - Expected impact of the campaign (0-10)
 * @returns {string} Weighted average score rounded to 1 decimal
 */
export const calculateImpactScore = (need, trust, expected) => {
  // Weighted: need 30%, trust 30%, expected impact 40%
  const weighted = need * 0.3 + trust * 0.3 + expected * 0.4;
  return weighted.toFixed(1);
};

/**
 * Returns a color label based on score value.
 * @param {number|string} score
 * @returns {string} hex color
 */
export const getScoreColor = (score) => {
  const s = parseFloat(score);
  if (s >= 8) return '#22C55E';   // green - high
  if (s >= 6) return '#F59E0B';   // amber - medium
  return '#EF4444';               // red - low
};

/**
 * Returns a text label for a score range.
 * @param {number|string} score
 * @returns {string}
 */
export const getScoreLabel = (score) => {
  const s = parseFloat(score);
  if (s >= 8) return 'High Impact';
  if (s >= 6) return 'Moderate Impact';
  return 'Needs Review';
};