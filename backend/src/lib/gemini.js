// ─────────────────────────────────────────────────────────
// Vertex AI — Gemini Client
// Provides an LLM intelligence layer on top of heuristic
// scoring.  Used for:
//   • Generating strategic recommendations for campaigns
//   • Enriching hotspot analysis with contextual reasoning
//   • Summarising trends in natural language
//   • Validating / explaining trust & impact scores
// ─────────────────────────────────────────────────────────

const { VertexAI } = require('@google-cloud/vertexai');

let vertexAI = null;
let generativeModel = null;
let initialised = false;

/**
 * Lazily initialise the Vertex AI client.
 * We defer so the module can be required even if env vars
 * aren't set yet (useful during testing / CI).
 */
function _ensureInit() {
  if (initialised) return;
  initialised = true;

  const project = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

  if (!project) {
    console.warn(
      '[Gemini] GOOGLE_CLOUD_PROJECT not set — LLM features disabled'
    );
    return;
  }

  try {
    vertexAI = new VertexAI({ project, location });
    generativeModel = vertexAI.getGenerativeModel({
      model,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.4, // slightly creative but factual
        topP: 0.8,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_ONLY_HIGH',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_ONLY_HIGH',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_ONLY_HIGH',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_ONLY_HIGH',
        },
      ],
    });
    console.log(`[Gemini] Initialised — model=${model}  project=${project}`);
  } catch (err) {
    console.warn('[Gemini] Failed to initialise:', err.message);
  }
}

// ── Public API ───────────────────────────────────────────

/**
 * Returns true if the Gemini client is available.
 */
function isAvailable() {
  _ensureInit();
  return !!generativeModel;
}

/**
 * Send a prompt to Gemini and get a text response.
 * Returns `null` if Gemini is unavailable or the call fails.
 *
 * @param {string} prompt
 * @returns {Promise<string|null>}
 */
async function generate(prompt) {
  _ensureInit();
  if (!generativeModel) return null;

  try {
    const result = await generativeModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    const response = result.response;
    const text =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
    return text;
  } catch (err) {
    console.error('[Gemini] Generation failed:', err.message);
    return null;
  }
}

/**
 * Structured generation — asks Gemini to return valid JSON
 * and parses it.  Falls back to `null` on parse failure.
 *
 * @param {string} prompt  Must instruct Gemini to reply in JSON
 * @returns {Promise<object|null>}
 */
async function generateJSON(prompt) {
  const raw = await generate(
    prompt + '\n\nIMPORTANT: Reply ONLY with valid JSON. No markdown fences, no explanations.'
  );
  if (!raw) return null;

  try {
    // Strip possible markdown code fences
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    console.warn('[Gemini] Could not parse JSON response');
    return null;
  }
}

module.exports = { isAvailable, generate, generateJSON };
