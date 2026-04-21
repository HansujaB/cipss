export const campaigns = [
  {
    id: '1',
    title: 'Beach Cleanup Drive',
    location: 'Delhi',
    domain: 'waste',
    description:
      'Organizing a large-scale beach and riverbank cleanup to reduce plastic pollution and restore natural ecosystems.',
    needScore: 8,
    trustScore: 7,
    expectedImpact: 9,
    fundingGoal: 50000,
    fundingRaised: 32000,
    volunteers: 120,
    image: 'https://via.placeholder.com/300x180',
  },
  {
    id: '2',
    title: 'Tree Plantation Campaign',
    location: 'Gurgaon',
    domain: 'environment',
    description:
      'Planting 10,000 native trees across urban zones to improve air quality and combat the urban heat island effect.',
    needScore: 7,
    trustScore: 8,
    expectedImpact: 8,
    fundingGoal: 80000,
    fundingRaised: 61000,
    volunteers: 200,
    image: 'https://via.placeholder.com/300x180',
  },
  {
    id: '3',
    title: 'Rural Digital Literacy',
    location: 'Jaipur',
    domain: 'education',
    description:
      'Providing digital skills training to rural youth and women to open up employment and entrepreneurship opportunities.',
    needScore: 9,
    trustScore: 8,
    expectedImpact: 9,
    fundingGoal: 120000,
    fundingRaised: 45000,
    volunteers: 60,
    image: 'https://via.placeholder.com/300x180',
  },
  {
    id: '4',
    title: 'Clean Water Initiative',
    location: 'Mumbai',
    domain: 'health',
    description:
      'Installing water purification units in underserved communities to ensure safe drinking water access for thousands.',
    needScore: 10,
    trustScore: 9,
    expectedImpact: 10,
    fundingGoal: 200000,
    fundingRaised: 180000,
    volunteers: 85,
    image: 'https://via.placeholder.com/300x180',
  },
];

export const domainColors = {
  waste: '#F97316',
  environment: '#22C55E',
  education: '#3B82F6',
  health: '#EC4899',
};

export const domainLabels = {
  waste: '♻️ Waste',
  environment: '🌱 Environment',
  education: '📚 Education',
  health: '💧 Health',
};