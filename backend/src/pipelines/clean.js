// ─────────────────────────────────────────────────────────
// Data Cleaning Pipeline
// Normalises messy NGO-uploaded data into consistent formats.
// ─────────────────────────────────────────────────────────

// ── Domain synonym mapping ───────────────────────────────
const DOMAIN_MAP = {
  garbage: 'waste_management',
  trash: 'waste_management',
  waste: 'waste_management',
  'waste management': 'waste_management',
  rubbish: 'waste_management',
  litter: 'waste_management',
  cleanup: 'waste_management',
  'clean up': 'waste_management',
  trees: 'environment',
  planting: 'environment',
  forest: 'environment',
  forestry: 'environment',
  green: 'environment',
  conservation: 'environment',
  wildlife: 'environment',
  schooling: 'education',
  school: 'education',
  teaching: 'education',
  literacy: 'education',
  tutoring: 'education',
};

/**
 * Normalise a raw domain string to a canonical key.
 * @param {string} raw
 * @returns {string}
 */
function normalizeDomain(raw) {
  if (!raw) return 'unknown';
  const cleaned = raw.toLowerCase().trim();
  return DOMAIN_MAP[cleaned] || cleaned;
}

// ── Unit conversion ──────────────────────────────────────

/**
 * Normalise a waste quantity to kilograms.
 * Handles tons, tonnes, grams, and plain numbers.
 * @param {number|string} value
 * @param {string}        [unit]
 * @returns {number|null}
 */
function normalizeWasteKg(value, unit) {
  if (value === null || value === undefined || value === '') return null;

  const num = typeof value === 'string'
    ? parseFloat(value.replace(/[^0-9.\-]/g, ''))
    : value;

  if (isNaN(num)) return null;

  const u = (unit || '').toLowerCase().trim();
  if (u === 'tons' || u === 'tonne' || u === 'tonnes' || u === 't') {
    return num * 1000;
  }
  if (u === 'grams' || u === 'g') {
    return num / 1000;
  }
  if (u === 'lbs' || u === 'pounds') {
    return num * 0.453592;
  }
  return num; // assume kg
}

// ── Coordinate validation ────────────────────────────────

// India bounding box (generous)
const INDIA_BOUNDS = {
  latMin: 6.5,
  latMax: 35.7,
  lngMin: 68.1,
  lngMax: 97.4,
};

/**
 * Validate that coordinates fall within India.
 * @param {number} lat
 * @param {number} lng
 * @returns {boolean}
 */
function validateCoords(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (isNaN(lat) || isNaN(lng)) return false;
  return (
    lat >= INDIA_BOUNDS.latMin &&
    lat <= INDIA_BOUNDS.latMax &&
    lng >= INDIA_BOUNDS.lngMin &&
    lng <= INDIA_BOUNDS.lngMax
  );
}

// ── Integer parsing ──────────────────────────────────────

/**
 * Parse a value to a non-negative integer, or null.
 */
function parsePositiveInt(value) {
  if (value === null || value === undefined || value === '') return null;
  const num = parseInt(String(value).replace(/[^0-9]/g, ''), 10);
  return isNaN(num) || num < 0 ? null : num;
}

// ── Date parsing ─────────────────────────────────────────

/**
 * Parse a date from various formats.  Returns a Date object or null.
 */
function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

module.exports = {
  normalizeDomain,
  normalizeWasteKg,
  validateCoords,
  parsePositiveInt,
  parseDate,
  DOMAIN_MAP,
  INDIA_BOUNDS,
};
