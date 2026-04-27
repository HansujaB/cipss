// ─────────────────────────────────────────────────────────
// Seed Script — Populates the database with realistic
// sample data for development & testing.
//
// Usage: node scripts/seed.js
// ─────────────────────────────────────────────────────────

require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ── Helper ───────────────────────────────────────────────

function randomBetween(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(4));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysBack) {
  const d = new Date();
  d.setDate(d.getDate() - randomInt(0, daysBack));
  return d;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Data ─────────────────────────────────────────────────

const NGOS = [
  { name: 'CleanDelhi Foundation', domain: 'waste_management' },
  { name: 'GreenEarth India', domain: 'environment' },
  { name: 'EduReach Trust', domain: 'education' },
  { name: 'SwachhBharat Volunteers', domain: 'waste_management' },
  { name: 'TreePlant India', domain: 'environment' },
];

const AREAS = [
  { name: 'Najafgarh', lat: 28.61, lng: 76.98 },
  { name: 'Dwarka', lat: 28.59, lng: 77.04 },
  { name: 'Rohini', lat: 28.73, lng: 77.12 },
  { name: 'Shahdara', lat: 28.68, lng: 77.29 },
  { name: 'Okhla', lat: 28.53, lng: 77.27 },
  { name: 'Mundka', lat: 28.68, lng: 77.02 },
  { name: 'Nehru Place', lat: 28.55, lng: 77.25 },
  { name: 'Chandni Chowk', lat: 28.65, lng: 77.23 },
  { name: 'Janakpuri', lat: 28.62, lng: 77.08 },
  { name: 'Saket', lat: 28.52, lng: 77.21 },
];

const CAMPAIGN_TITLES = [
  'Zero Waste Drive',
  'Clean River Campaign',
  'Tree Plantation Day',
  'Plastic-Free Zone',
  'Digital Literacy Workshop',
  'Community Garden Setup',
  'Waste Segregation Training',
  'School Tutoring Program',
  'Solar Panel Installation',
  'Water Conservation Drive',
];

// ─────────────────────────────────────────────────────────
// Main Seed Function
// ─────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Seeding database…\n');

  // ── 1. Clear existing data (order matters for FK constraints)
  console.log('  🗑️  Clearing existing data…');
  await prisma.lLMInsight.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.nGOMetric.deleteMany();
  await prisma.nGO.deleteMany();
  await prisma.user.deleteMany();

  // ── 2. Create Users ──────────────────────────────────
  console.log('  👤 Creating users…');
  const passwordHash = await bcrypt.hash('password123', 12);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@cipss.dev',
        password: passwordHash,
        role: 'ngo_admin',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Volunteer Priya',
        email: 'priya@cipss.dev',
        password: passwordHash,
        role: 'volunteer',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Influencer Raj',
        email: 'raj@cipss.dev',
        password: passwordHash,
        role: 'influencer',
      },
    }),
    prisma.user.create({
      data: {
        name: 'CSR Manager Anita',
        email: 'anita@cipss.dev',
        password: passwordHash,
        role: 'company',
      },
    }),
  ]);
  console.log(`     ✅ ${users.length} users created`);

  // ── 3. Create NGOs ───────────────────────────────────
  console.log('  🏢 Creating NGOs…');
  const ngos = [];
  for (const ngoData of NGOS) {
    const ngo = await prisma.nGO.create({
      data: {
        name: ngoData.name,
        domain: ngoData.domain,
        verified: Math.random() > 0.3, // 70% verified
      },
    });
    ngos.push(ngo);
  }
  console.log(`     ✅ ${ngos.length} NGOs created`);

  // ── 4. Create NGO Metrics ────────────────────────────
  console.log('  📊 Creating NGO metrics…');
  let metricCount = 0;

  for (const ngo of ngos) {
    const numMetrics = randomInt(8, 15);
    for (let i = 0; i < numMetrics; i++) {
      const area = pickRandom(AREAS);

      await prisma.nGOMetric.create({
        data: {
          ngoId: ngo.id,
          lat: area.lat + randomBetween(-0.02, 0.02),
          lng: area.lng + randomBetween(-0.02, 0.02),
          area: area.name,
          domain: ngo.domain,
          wasteKg:
            ngo.domain === 'waste_management'
              ? randomBetween(10, 500)
              : null,
          volunteers: randomInt(5, 100),
          beneficiaries: randomInt(20, 500),
          date: randomDate(60),
          rawData: {
            source: 'seed_script',
            original_unit: 'kg',
          },
        },
      });
      metricCount++;
    }
  }
  console.log(`     ✅ ${metricCount} metrics created`);

  // ── 5. Create Campaigns ──────────────────────────────
  console.log('  📢 Creating campaigns…');
  const campaigns = [];

  for (let i = 0; i < 10; i++) {
    const ngo = pickRandom(ngos);
    const area = pickRandom(AREAS);
    const status = pickRandom(['draft', 'active', 'completed']);
    const plannedVolunteers = randomInt(10, 200);
    const plannedWasteKg =
      ngo.domain === 'waste_management' ? randomBetween(50, 2000) : null;

    const campaign = await prisma.campaign.create({
      data: {
        ngoId: ngo.id,
        title: pickRandom(CAMPAIGN_TITLES),
        domain: ngo.domain,
        lat: area.lat + randomBetween(-0.01, 0.01),
        lng: area.lng + randomBetween(-0.01, 0.01),
        area: area.name,
        status,
        needScore: randomBetween(20, 95),
        trustScore: randomBetween(30, 90),
        impactScore: status === 'completed' ? randomBetween(40, 100) : null,
        plannedVolunteers,
        actualVolunteers:
          status === 'completed' ? randomInt(5, plannedVolunteers + 20) : null,
        plannedWasteKg,
        actualWasteKg:
          status === 'completed' && plannedWasteKg
            ? randomBetween(plannedWasteKg * 0.5, plannedWasteKg * 1.3)
            : null,
        startDate: randomDate(30),
        endDate: status === 'completed' ? randomDate(5) : null,
      },
    });
    campaigns.push(campaign);
  }
  console.log(`     ✅ ${campaigns.length} campaigns created`);

  // ── Summary ──────────────────────────────────────────
  console.log('\n✨ Seed complete!\n');
  console.log('  📧 Test Credentials:');
  console.log('     Email:    admin@cipss.dev');
  console.log('     Password: password123');
  console.log('     (All seeded users share the same password)\n');
}

// ─────────────────────────────────────────────────────────
// Run
// ─────────────────────────────────────────────────────────

seed()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
