# CIPSS

Data-driven social impact platform connecting NGOs, CSR teams, influencers, and volunteers.

## Stack

- Main database: PostgreSQL via Prisma
- Google services: Vertex AI (Gemini), Google Maps, optional Google Cloud Storage
- Frontends: React Native app in [src](/Users/meharkapoor7/cipss/src) and React web app in [web](/Users/meharkapoor7/cipss/web)
- Backend API: Express in [backend/src](/Users/meharkapoor7/cipss/backend/src)

## Core backend capabilities

- Auth with role-aware onboarding
- Campaign creation, participation, check-in, proof submission, and certificates
- CSR funding with Razorpay order creation and signature verification
- NGO metrics, hotspots, need/trust/impact scoring
- Influencer profiles, trust scoring, and fraud signal detection
- Reward credits and certificate issuance for volunteers

## Environment

Backend env lives in [backend/.env.example](/Users/meharkapoor7/cipss/backend/.env.example).

Important variables:

- `DATABASE_URL`: PostgreSQL connection string
- `GOOGLE_CLOUD_PROJECT`
- `GOOGLE_CLOUD_LOCATION`
- `GEMINI_MODEL`
- `GOOGLE_MAPS_API_KEY`
- `GCS_BUCKET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

## Local setup

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```

### Mobile app

```bash
npm install
npm test
npx react-native run-android
```

### Web app

```bash
cd web
npm install
npm run dev
```

## PostgreSQL + Google Cloud note

Use PostgreSQL as the source of truth. Google services should complement it, not replace it:

- Cloud SQL PostgreSQL for production data
- Vertex AI for LLM insights
- Google Maps for campaign geocoding and hotspot navigation
- Google Cloud Storage for media proof uploads

## Current migration status

The Prisma schema in [backend/prisma/schema.prisma](/Users/meharkapoor7/cipss/backend/prisma/schema.prisma) includes the latest PostgreSQL and Google-service feature slice, but the generated migration files are not committed yet. Run `npx prisma migrate dev` in [backend](/Users/meharkapoor7/cipss/backend) against the target database to create and apply the migration before deploying.
