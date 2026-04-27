/**
 * Calculate a weighted impact score
 */
export const calculateImpactScore = (need, trust, expected) => {
  // 🔥 Safety defaults
  const n = Number(need) || 0;
  const t = Number(trust) || 0;
  const e = Number(expected) || 0;

  // Weighted formula (explainable in demo)
  const weighted = n * 0.3 + t * 0.3 + e * 0.4;

  // 🔥 Return NUMBER (not string)
  return Math.round(weighted * 10) / 10;
};

/**
 * Color based on score
 */
export const getScoreColor = (score) => {
  const s = Number(score);

  if (s >= 8) return '#22C55E';   // green
  if (s >= 6) return '#F59E0B';   // amber
  return '#EF4444';               // red
};

/**
 * Label based on score
 */
export const getScoreLabel = (score) => {
  const s = Number(score);

  if (s >= 8) return 'High Impact';
  if (s >= 6) return 'Moderate Impact';
  return 'Needs Review';
};