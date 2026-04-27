// ─────────────────────────────────────────────────────────
// Redis Client — Graceful Fallback
// If Redis is unavailable the app still works; caching is
// simply skipped and a warning is logged once.
// ─────────────────────────────────────────────────────────

const Redis = require('ioredis');

let redis = null;
let warned = false;

try {
  redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 3) return null; // stop retrying
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
  });

  redis.on('error', (err) => {
    if (!warned) {
      console.warn('[Redis] Connection failed — caching disabled:', err.message);
      warned = true;
    }
  });
} catch {
  console.warn('[Redis] Could not initialise client — caching disabled');
}

// ── Cache helpers ────────────────────────────────────────

/**
 * Get a cached value by key. Returns null if cache miss or Redis unavailable.
 */
async function cacheGet(key) {
  if (!redis) return null;
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Set a cached value with TTL (seconds).
 */
async function cacheSet(key, value, ttlSeconds = 3600) {
  if (!redis) return;
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch {
    // fail silently
  }
}

/**
 * Delete a cached key (for invalidation).
 */
async function cacheDel(key) {
  if (!redis) return;
  try {
    await redis.del(key);
  } catch {
    // fail silently
  }
}

module.exports = { redis, cacheGet, cacheSet, cacheDel };
