// ─────────────────────────────────────────────────────────
// Data Ingestion Pipeline
// Handles CSV and JSON uploads from NGOs.
// Cleans → standardises → deduplicates → bulk inserts.
// ─────────────────────────────────────────────────────────

const { parse } = require('csv-parse/sync');
const prisma = require('../lib/prisma');
const { standardizeRow } = require('./standardize');

/**
 * Ingest a CSV buffer.  Parses the CSV, cleans each row, deduplicates,
 * and bulk-inserts the valid rows into the database.
 *
 * @param {Buffer|string} buffer  - Raw CSV content
 * @param {string}        ngoId   - The uploading NGO's UUID
 * @returns {Promise<{ inserted: number, skipped: number, errors: Array }>}
 */
async function ingestCSV(buffer, ngoId) {
  const records = parse(buffer, {
    columns: true,        // first row = headers
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  });

  return _processRows(records, ngoId);
}

/**
 * Ingest a JSON array of metrics.
 *
 * @param {Array}  data   - Array of raw metric objects
 * @param {string} ngoId  - The uploading NGO's UUID
 * @returns {Promise<{ inserted: number, skipped: number, errors: Array }>}
 */
async function ingestJSON(data, ngoId) {
  if (!Array.isArray(data)) {
    return { inserted: 0, skipped: 0, errors: ['Payload must be an array'] };
  }
  return _processRows(data, ngoId);
}

// ─────────────────────────────────────────────────────────
// Internal: shared processing logic
// ─────────────────────────────────────────────────────────

async function _processRows(rows, ngoId) {
  const validRows = [];
  const errorLog = [];
  const seen = new Set();

  for (let i = 0; i < rows.length; i++) {
    const { valid, data, errors } = standardizeRow(rows[i], ngoId);

    if (!valid) {
      errorLog.push({ row: i + 1, errors });
      continue;
    }

    // ── Deduplication ────────────────────────────────
    // Same NGO + same date + same location = duplicate
    const dedupeKey = `${ngoId}|${data.date.toISOString().slice(0, 10)}|${data.lat}|${data.lng}`;
    if (seen.has(dedupeKey)) {
      errorLog.push({ row: i + 1, errors: ['Duplicate row (same NGO, date, location)'] });
      continue;
    }
    seen.add(dedupeKey);

    validRows.push(data);
  }

  // ── Check for existing duplicates in DB ────────────
  // Build a quick lookup of existing records
  if (validRows.length > 0) {
    const existingMetrics = await prisma.nGOMetric.findMany({
      where: { ngoId },
      select: { lat: true, lng: true, date: true },
    });

    const existingKeys = new Set(
      existingMetrics.map(
        (m) => `${ngoId}|${new Date(m.date).toISOString().slice(0, 10)}|${m.lat}|${m.lng}`
      )
    );

    // Filter out records that already exist in DB
    const freshRows = [];
    for (const row of validRows) {
      const key = `${ngoId}|${row.date.toISOString().slice(0, 10)}|${row.lat}|${row.lng}`;
      if (existingKeys.has(key)) {
        errorLog.push({
          row: null,
          errors: [`Duplicate in DB: ${row.area || ''} on ${row.date.toISOString().slice(0, 10)}`],
        });
      } else {
        freshRows.push(row);
      }
    }

    // ── Bulk insert ──────────────────────────────────
    if (freshRows.length > 0) {
      await prisma.nGOMetric.createMany({
        data: freshRows,
        skipDuplicates: true,
      });
    }

    return {
      inserted: freshRows.length,
      skipped: rows.length - freshRows.length,
      errors: errorLog,
    };
  }

  return {
    inserted: 0,
    skipped: rows.length,
    errors: errorLog,
  };
}

module.exports = { ingestCSV, ingestJSON };
