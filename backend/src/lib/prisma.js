// ─────────────────────────────────────────────────────────
// Prisma Client Singleton
// Prevents connection pool exhaustion during hot-reload (nodemon)
// ─────────────────────────────────────────────────────────

const { PrismaClient } = require('@prisma/client');

/** @type {PrismaClient} */
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In dev, attach to globalThis so nodemon restarts don't
  // create a new connection pool every time.
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClient({
      log: ['warn', 'error'],
    });
  }
  prisma = globalThis.__prisma;
}

module.exports = prisma;
