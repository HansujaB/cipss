// ─────────────────────────────────────────────────────────
// LLM Insights Service — Gemini via Vertex AI
//
// This service enriches the heuristic scoring layer with
// LLM-generated analysis.  Every function gracefully falls
// back to `null` if Gemini is unavailable, so the platform
// works without GCP credentials (just without LLM features).
// ─────────────────────────────────────────────────────────

const gemini = require('../lib/gemini');
const prisma = require('../lib/prisma');

// ── Cache TTL for LLM insights (6 hours) ────────────────
const LLM_CACHE_HOURS = 6;

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

/**
 * Check the DB-level LLM cache first to avoid redundant
 * Gemini calls.  Returns cached response or null.
 */
async function _getCachedInsight(queryKey) {
  try {
    const cached = await prisma.lLMInsight.findUnique({
      where: { queryKey },
    });
    if (cached && new Date(cached.expiresAt) > new Date()) {
      return JSON.parse(cached.response);
    }
    // Expired — delete stale entry
    if (cached) {
      await prisma.lLMInsight.delete({ where: { queryKey } });
    }
  } catch {
    // ignore cache errors
  }
  return null;
}

/**
 * Store an LLM response in the DB cache.
 */
async function _setCachedInsight(queryKey, prompt, response) {
  try {
    const expiresAt = new Date(Date.now() + LLM_CACHE_HOURS * 3600 * 1000);
    await prisma.lLMInsight.upsert({
      where: { queryKey },
      update: {
        prompt,
        response: JSON.stringify(response),
        expiresAt,
      },
      create: {
        queryKey,
        prompt,
        response: JSON.stringify(response),
        model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
        expiresAt,
      },
    });
  } catch {
    // ignore cache write errors
  }
}

// ─────────────────────────────────────────────────────────
// 1.  Campaign Recommendation
//     Given heuristic scores + context, ask Gemini for a
//     strategic recommendation.
// ─────────────────────────────────────────────────────────

/**
 * Generate an LLM-powered strategic recommendation for a campaign.
 *
 * @param {object} campaign  - Campaign record from DB
 * @param {object} hotspotContext - Nearby hotspot data
 * @returns {Promise<string|null>}
 */
async function getCampaignRecommendation(campaign, hotspotContext = null) {
  if (!gemini.isAvailable()) return null;

  const queryKey = `campaign_rec:${campaign.id}`;
  const cached = await _getCachedInsight(queryKey);
  if (cached) return cached;

  const prompt = `You are an expert social-impact strategist analysing data for an NGO platform in India.

CAMPAIGN DATA:
- Title: ${campaign.title}
- Domain: ${campaign.domain}
- Area: ${campaign.area || 'Unknown'}
- Location: (${campaign.lat}, ${campaign.lng})
- Need Score (heuristic): ${campaign.needScore ?? 'Not computed'}
- Trust Score (heuristic): ${campaign.trustScore ?? 'Not computed'}
- Status: ${campaign.status}
- Planned volunteers: ${campaign.plannedVolunteers ?? 'N/A'}
- Planned waste collection: ${campaign.plannedWasteKg ?? 'N/A'} kg

${hotspotContext ? `NEARBY HOTSPOT DATA:\n${JSON.stringify(hotspotContext, null, 2)}` : ''}

Based on this data, provide:
1. A brief assessment of the campaign's strategic value (2-3 sentences).
2. Specific, actionable recommendations to maximise impact (3-5 bullet points).
3. Potential risks or challenges to watch for.
4. A suggested priority level: HIGH, MEDIUM, or LOW.

Return your analysis as JSON with keys: assessment, recommendations (array of strings), risks (array of strings), priority.`;

  const result = await gemini.generateJSON(prompt);
  if (result) {
    await _setCachedInsight(queryKey, prompt, result);
  }
  return result;
}

// ─────────────────────────────────────────────────────────
// 2.  Hotspot Analysis
//     Enrich the heuristic hotspot data with contextual
//     reasoning about WHY certain areas are high-need.
// ─────────────────────────────────────────────────────────

/**
 * Ask Gemini to analyse a set of hotspots and provide insights.
 *
 * @param {Array} hotspots - Array of hotspot objects from hotspot.js
 * @param {string} domain
 * @returns {Promise<object|null>}
 */
async function analyseHotspots(hotspots, domain) {
  if (!gemini.isAvailable() || hotspots.length === 0) return null;

  const queryKey = `hotspot_analysis:${domain}:${hotspots.length}`;
  const cached = await _getCachedInsight(queryKey);
  if (cached) return cached;

  const prompt = `You are a data analyst for a social-impact platform in India.

DOMAIN: ${domain}
HOTSPOT DATA (sorted by need score, highest first):
${JSON.stringify(hotspots.slice(0, 5), null, 2)}

Analyse these hotspots and provide:
1. summary: A 2-3 sentence overview of the patterns you see.
2. insights: Array of 3-5 specific observations about the data (e.g., geographic clustering, severity trends, gaps in coverage).
3. recommended_actions: Array of 2-3 concrete next steps for NGOs working in this domain.
4. data_quality_notes: Any concerns about data quality or biases you notice.

Return as JSON.`;

  const result = await gemini.generateJSON(prompt);
  if (result) {
    await _setCachedInsight(queryKey, prompt, result);
  }
  return result;
}

// ─────────────────────────────────────────────────────────
// 3.  Impact Assessment
//     After a campaign completes, ask Gemini to evaluate
//     the real-world significance of the impact score.
// ─────────────────────────────────────────────────────────

/**
 * Generate an LLM-powered impact assessment for a completed campaign.
 *
 * @param {object} campaign - Completed campaign with scores
 * @returns {Promise<object|null>}
 */
async function assessImpact(campaign) {
  if (!gemini.isAvailable()) return null;

  const queryKey = `impact_assess:${campaign.id}`;
  const cached = await _getCachedInsight(queryKey);
  if (cached) return cached;

  const prompt = `You are evaluating the impact of a completed social-impact campaign in India.

CAMPAIGN:
- Title: ${campaign.title}
- Domain: ${campaign.domain}
- Area: ${campaign.area || 'Unknown'}
- Impact Score (heuristic): ${campaign.impactScore}
- Planned vs Actual Volunteers: ${campaign.plannedVolunteers} → ${campaign.actualVolunteers}
- Planned vs Actual Waste (kg): ${campaign.plannedWasteKg} → ${campaign.actualWasteKg}
- Duration: ${campaign.startDate} to ${campaign.endDate}

Provide:
1. impact_summary: 2-3 sentence assessment of the campaign's real-world impact.
2. score_explanation: Why the heuristic score of ${campaign.impactScore} is appropriate or may need adjustment.
3. improvement_suggestions: Array of 2-3 suggestions for future campaigns.
4. comparable_benchmarks: How this compares to typical campaigns in the ${campaign.domain} domain.

Return as JSON.`;

  const result = await gemini.generateJSON(prompt);
  if (result) {
    await _setCachedInsight(queryKey, prompt, result);
  }
  return result;
}

// ─────────────────────────────────────────────────────────
// 4.  Trend Narration
//     Convert time-series data into a human-readable
//     narrative for the frontend dashboard.
// ─────────────────────────────────────────────────────────

/**
 * Generate a natural-language summary of trend data.
 *
 * @param {Array}  trendData - Array of { date, value, ... } objects
 * @param {string} domain
 * @param {string} area
 * @returns {Promise<string|null>}
 */
async function narrateTrend(trendData, domain, area) {
  if (!gemini.isAvailable() || trendData.length === 0) return null;

  const queryKey = `trend_narrate:${domain}:${area}:${trendData.length}`;
  const cached = await _getCachedInsight(queryKey);
  if (cached) return cached;

  const prompt = `You are a data storyteller for a social-impact platform.

DOMAIN: ${domain}
AREA: ${area}
TIME-SERIES DATA (recent first):
${JSON.stringify(trendData.slice(0, 20), null, 2)}

Write a concise, 3-4 sentence narrative summarising the trend. Mention:
- Overall direction (improving, worsening, stable)
- Any notable spikes or drops
- What this means for NGOs working in the area

Return as JSON with keys: narrative (string), trend_direction ("improving" | "worsening" | "stable"), confidence ("high" | "medium" | "low").`;

  const result = await gemini.generateJSON(prompt);
  if (result) {
    await _setCachedInsight(queryKey, prompt, result);
  }
  return result;
}

// ─────────────────────────────────────────────────────────
// 5.  Trust Score Validation
//     Ask Gemini to cross-check whether a heuristic
//     trust score seems reasonable given the data.
// ─────────────────────────────────────────────────────────

/**
 * Validate a trust score using LLM reasoning.
 *
 * @param {object} ngo       - NGO record
 * @param {number} trustScore - Heuristic trust score
 * @param {object} factors   - The factors used to compute the score
 * @returns {Promise<object|null>}
 */
async function validateTrustScore(ngo, trustScore, factors) {
  if (!gemini.isAvailable()) return null;

  const queryKey = `trust_validate:${ngo.id}`;
  const cached = await _getCachedInsight(queryKey);
  if (cached) return cached;

  const prompt = `You are a fraud analyst for a social-impact NGO verification platform.

NGO:
- Name: ${ngo.name}
- Domain: ${ngo.domain}
- Verified: ${ngo.verified}

TRUST SCORE: ${trustScore}/100

FACTORS USED:
- Engagement rate: ${factors.engagement}
- Authenticity (follower quality): ${factors.authenticity}
- Consistency (completion rate): ${factors.consistency}
- Past verified impact: ${factors.pastImpact}

Assess:
1. is_reasonable: boolean — does this score make sense given the factors?
2. flags: Array of any red flags or concerns (empty array if none).
3. confidence: "high" | "medium" | "low" — how confident are you in this assessment?
4. suggestion: A brief note on whether the score should be adjusted.

Return as JSON.`;

  const result = await gemini.generateJSON(prompt);
  if (result) {
    await _setCachedInsight(queryKey, prompt, result);
  }
  return result;
}

module.exports = {
  getCampaignRecommendation,
  analyseHotspots,
  assessImpact,
  narrateTrend,
  validateTrustScore,
};
