export const calculateImpactScore = (need, trust, expected) => {
  const n = Number(need) || 0;
  const t = Number(trust) || 0;
  const e = Number(expected) || 0;
  const weighted = n * 0.3 + t * 0.3 + e * 0.4;
  return Math.round(weighted * 10) / 10;
};

export const getScoreColor = (score) => {
  const s = Number(score);
  if (s >= 8) return '#22C55E';
  if (s >= 6) return '#F59E0B';
  return '#EF4444';
};

export const getScoreLabel = (score) => {
  const s = Number(score);
  if (s >= 8) return 'High Impact';
  if (s >= 6) return 'Moderate Impact';
  return 'Needs Review';
};
