// ─────────────────────────────────────────────────────────
// Hotspot Detection Service
// Grid-based hotspot detection that identifies high-need areas
// by bucketing NGO metric reports into ~5km grid cells,
// scoring each cell, and returning the top-N hotspots.
// ─────────────────────────────────────────────────────────

const prisma = require('../lib/prisma');
const { cacheGet, cacheSet } = require('../lib/redis');
const { computeNeedScore } = require('./needScore');

// Grid size in degrees — roughly 5 km at Indian latitudes
const GRID_SIZE = 0.05;

// Cache TTL for hotspot results (1 hour)
const CACHE_TTL = 3600;

/**
 * Snap a coordinate pair to the bottom-left corner of its grid cell.
 */
function toCell(lat, lng) {
  return {
    cellLat: parseFloat((Math.floor(lat / GRID_SIZE) * GRID_SIZE).toFixed(4)),
    cellLng: parseFloat((Math.floor(lng / GRID_SIZE) * GRID_SIZE).toFixed(4)),
  };
}

/**
 * Retrieve the top high-need grid cells for a given domain.
 *
 * @param {string}  domain   - e.g. 'waste_management'
 * @param {number}  [limit]  - max hotspots to return (default 10)
 * @param {object}  [geo]    - optional { lat, lng, radius } to filter by area
 * @returns {Promise<Array>} sorted hotspot list (highest need first)
 */
async function getHotspots(domain, limit = 10, geo = null) {
  // ── Check cache ──────────────────────────────────────
  const cacheKey = `hotspots:${domain}:${limit}:${geo?.lat || ''}:${geo?.lng || ''}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  // ── Query recent metrics ─────────────────────────────
  const whereClause = { domain };

  // Optional rough bounding-box filter (not PostGIS, just basic lat/lng range)
  if (geo?.lat && geo?.lng && geo?.radius) {
    const degreeOffset = geo.radius / 111_000; // metres → rough degrees
    whereClause.lat = {
      gte: geo.lat - degreeOffset,
      lte: geo.lat + degreeOffset,
    };
    whereClause.lng = {
      gte: geo.lng - degreeOffset,
      lte: geo.lng + degreeOffset,
    };
  }

  const metrics = await prisma.nGOMetric.findMany({
    where: whereClause,
    orderBy: { date: 'desc' },
    take: 500,
  });

  if (metrics.length === 0) return [];

  // ── Bucket into grid cells ───────────────────────────
  const cells = {};

  for (const m of metrics) {
    const { cellLat, cellLng } = toCell(m.lat, m.lng);
    const key = `${cellLat},${cellLng}`;

    if (!cells[key]) {
      cells[key] = {
        cellLat,
        cellLng,
        area: m.area,
        reports: [],
        totalWaste: 0,
        lastReported: m.date,
      };
    }

    cells[key].reports.push(m);
    cells[key].totalWaste += m.wasteKg || 0;

    // Track most recent report date
    if (new Date(m.date) > new Date(cells[key].lastReported)) {
      cells[key].lastReported = m.date;
    }
  }

  // ── Score each cell ──────────────────────────────────
  // Count completed campaigns in each cell for "pastAction"
  const campaignCounts = await prisma.campaign.groupBy({
    by: ['area'],
    where: { domain, status: 'completed' },
    _count: { id: true },
  });
  const campaignMap = {};
  for (const c of campaignCounts) {
    if (c.area) campaignMap[c.area] = c._count.id;
  }

  const scored = Object.values(cells).map((cell) => {
    const recencyDays = Math.min(
      ...cell.reports.map((r) => (Date.now() - new Date(r.date).getTime()) / 86_400_000)
    );

    // pastAction: ratio of completed campaigns to report count (rough proxy)
    const completedInArea = campaignMap[cell.area] || 0;
    const pastAction = Math.min(completedInArea / Math.max(cell.reports.length, 1), 1);

    const needScore = computeNeedScore({
      frequency: cell.reports.length,
      severity: cell.totalWaste,
      recency: recencyDays,
      pastAction,
    });

    return {
      area: cell.area || null,
      lat: cell.cellLat,
      lng: cell.cellLng,
      need_score: needScore,
      domain,
      report_count: cell.reports.length,
      total_waste_kg: parseFloat(cell.totalWaste.toFixed(2)),
      last_reported: cell.lastReported,
    };
  });

  const result = scored
    .sort((a, b) => b.need_score - a.need_score)
    .slice(0, limit);

  // ── Cache result ─────────────────────────────────────
  await cacheSet(cacheKey, result, CACHE_TTL);

  return result;
}

module.exports = { getHotspots, toCell, GRID_SIZE };
