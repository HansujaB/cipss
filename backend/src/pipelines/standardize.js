// ─────────────────────────────────────────────────────────
// Row Standardizer
// Applies all cleaning functions to a single raw data row
// and returns a clean object ready for DB insertion.
// ─────────────────────────────────────────────────────────

const {
  normalizeDomain,
  normalizeWasteKg,
  validateCoords,
  parsePositiveInt,
  parseDate,
} = require('./clean');

/**
 * Standardise a single row of raw data.
 *
 * @param {object} row - Raw data row (from CSV parse or JSON upload)
 * @param {string} ngoId - The uploading NGO's ID
 * @returns {{ valid: boolean, data: object|null, errors: string[] }}
 */
function standardizeRow(row, ngoId) {
  const errors = [];

  // ── Latitude / Longitude ─────────────────────────────
  const lat = parseFloat(row.lat ?? row.latitude ?? row.Lat ?? row.Latitude);
  const lng = parseFloat(row.lng ?? row.lon ?? row.longitude ?? row.Lng ?? row.Lon ?? row.Longitude);

  if (isNaN(lat) || isNaN(lng)) {
    errors.push('Missing or invalid coordinates');
  } else if (!validateCoords(lat, lng)) {
    errors.push(`Coordinates (${lat}, ${lng}) outside India bounds`);
  }

  // ── Domain ───────────────────────────────────────────
  const rawDomain = row.domain ?? row.Domain ?? row.category ?? row.Category ?? '';
  const domain = normalizeDomain(rawDomain);

  // ── Date ─────────────────────────────────────────────
  const rawDate = row.date ?? row.Date ?? row.report_date ?? row.reportDate;
  const date = parseDate(rawDate);
  if (!date) {
    errors.push('Missing or invalid date');
  }

  // ── Numeric fields ───────────────────────────────────
  const wasteKg = normalizeWasteKg(
    row.waste_kg ?? row.wasteKg ?? row.waste ?? row.Waste,
    row.unit ?? row.Unit ?? row.waste_unit
  );
  const volunteers = parsePositiveInt(row.volunteers ?? row.Volunteers ?? row.volunteer_count);
  const beneficiaries = parsePositiveInt(row.beneficiaries ?? row.Beneficiaries ?? row.beneficiary_count);

  // ── Area ─────────────────────────────────────────────
  const area = (row.area ?? row.Area ?? row.location ?? row.Location ?? '')
    .toString().trim() || null;

  // ── Build result ─────────────────────────────────────
  if (errors.length > 0) {
    return { valid: false, data: null, errors };
  }

  return {
    valid: true,
    data: {
      ngoId,
      lat,
      lng,
      area,
      domain,
      wasteKg,
      volunteers,
      beneficiaries,
      date,
      rawData: row, // store the original for audit trail
    },
    errors: [],
  };
}

module.exports = { standardizeRow };
