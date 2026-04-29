// Script to seed more campaigns on production
const https = require('https');

const BASE_HOST = 'cipss-backend-416772230892.us-central1.run.app';
const NGO_ID = '07decda4-1930-4458-9a73-6ead3497b67f';

function request(path, method, body, token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: BASE_HOST,
      path: `/api/v1${path}`,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

const CAMPAIGNS = [
  { title: 'Child Nutrition Program', description: 'Providing nutritious meals to 5000 underprivileged children daily in Bihar.', domain: 'education', area: 'Bihar', funding_goal: 150000, planned_volunteers: 80 },
  { title: 'Solar Energy for Villages', description: 'Installing solar panels in 50 off-grid villages to provide clean electricity.', domain: 'environment', area: 'Rajasthan', funding_goal: 300000, planned_volunteers: 45 },
  { title: 'Urban Waste Recycling', description: 'Setting up recycling centers in 10 urban areas to reduce landfill waste by 60%.', domain: 'waste_management', area: 'Bangalore', funding_goal: 90000, planned_volunteers: 150 },
  { title: 'Mental Health Awareness', description: 'Free counseling and mental health workshops for college students across India.', domain: 'education', area: 'Hyderabad', funding_goal: 75000, planned_volunteers: 30 },
  { title: 'Mangrove Restoration', description: 'Restoring 500 acres of mangrove forests along the coastline to prevent erosion.', domain: 'environment', area: 'Kerala', funding_goal: 200000, planned_volunteers: 200 },
  { title: 'Digital Skills for Women', description: 'Teaching coding and digital marketing to 1000 rural women for employment.', domain: 'education', area: 'Uttar Pradesh', funding_goal: 110000, planned_volunteers: 60 },
  { title: 'Clean Air Initiative', description: 'Planting air-purifying plants in schools and hospitals across Delhi NCR.', domain: 'environment', area: 'Delhi NCR', funding_goal: 60000, planned_volunteers: 300 },
  { title: 'Flood Relief & Rehabilitation', description: 'Emergency relief and long-term rehabilitation for flood-affected families.', domain: 'waste_management', area: 'Assam', funding_goal: 500000, planned_volunteers: 500 },
];

async function seed() {
  const loginData = await request('/auth/login', 'POST', { email: 'admin@cipss.dev', password: 'password123' });
  const token = loginData.token;
  console.log('✅ Logged in');

  for (const c of CAMPAIGNS) {
    const data = await request('/campaigns', 'POST', { ...c, ngo_id: NGO_ID }, token);
    if (data.title) {
      console.log(`✅ Created: ${data.title}`);
    } else {
      console.log(`❌ Failed: ${JSON.stringify(data)}`);
    }
  }
  console.log('🎉 Done!');
}

seed().catch(console.error);
