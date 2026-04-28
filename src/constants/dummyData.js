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


export const MOCK_LEADERBOARD = {
  volunteers: [
    { rank: 1, name: 'Priya Sharma', points: 2850, campaigns: 12, badges: ['🥇', '⭐', '🔥'] },
    { rank: 2, name: 'Rahul Verma', points: 2640, campaigns: 10, badges: ['🥈', '⭐'] },
    { rank: 3, name: 'Anjali Patel', points: 2420, campaigns: 9, badges: ['🥉', '⭐'] },
    { rank: 4, name: 'Vikram Singh', points: 2180, campaigns: 8, badges: ['⭐'] },
    { rank: 5, name: 'Neha Gupta', points: 1950, campaigns: 7, badges: ['⭐'] },
    { rank: 6, name: 'Arjun Reddy', points: 1820, campaigns: 6, badges: [] },
    { rank: 7, name: 'Kavya Iyer', points: 1690, campaigns: 6, badges: [] },
    { rank: 8, name: 'Rohan Das', points: 1540, campaigns: 5, badges: [] },
  ],
  ngos: [
    { rank: 1, name: 'Green Earth Foundation', points: 8500, campaigns: 25, badges: ['🥇', '🌟', '💚'] },
    { rank: 2, name: 'Hope for Children', points: 7200, campaigns: 20, badges: ['🥈', '🌟'] },
    { rank: 3, name: 'Clean Water Trust', points: 6800, campaigns: 18, badges: ['🥉', '🌟'] },
    { rank: 4, name: 'Education First', points: 5900, campaigns: 15, badges: ['🌟'] },
    { rank: 5, name: 'Health for All', points: 5200, campaigns: 12, badges: [] },
  ],
  donors: [
    { rank: 1, name: 'Amit Agarwal', points: 15000, campaigns: 30, badges: ['🥇', '💎', '👑'] },
    { rank: 2, name: 'Sunita Kapoor', points: 12500, campaigns: 25, badges: ['🥈', '💎'] },
    { rank: 3, name: 'Rajesh Kumar', points: 10200, campaigns: 20, badges: ['🥉', '💎'] },
    { rank: 4, name: 'Meera Joshi', points: 8900, campaigns: 18, badges: ['💎'] },
    { rank: 5, name: 'Sanjay Mehta', points: 7500, campaigns: 15, badges: [] },
  ],
  influencers: [
    { rank: 1, name: 'Riya Malhotra', points: 9500, campaigns: 15, badges: ['🥇', '📱', '🎬'] },
    { rank: 2, name: 'Karan Johar', points: 8200, campaigns: 12, badges: ['🥈', '📱'] },
    { rank: 3, name: 'Ananya Pandey', points: 7100, campaigns: 10, badges: ['🥉', '📱'] },
    { rank: 4, name: 'Varun Dhawan', points: 6300, campaigns: 9, badges: ['📱'] },
    { rank: 5, name: 'Shraddha Kapoor', points: 5800, campaigns: 8, badges: [] },
  ],
};


export const ACHIEVEMENTS = {
  first_campaign: {
    id: 'first_campaign',
    title: 'First Steps',
    description: 'Join your first campaign',
    icon: '🎯',
    category: 'milestone',
    points: 100,
    rarity: 'common',
  },
  five_campaigns: {
    id: 'five_campaigns',
    title: 'Getting Started',
    description: 'Complete 5 campaigns',
    icon: '⭐',
    category: 'milestone',
    points: 250,
    rarity: 'common',
  },
  ten_campaigns: {
    id: 'ten_campaigns',
    title: 'Dedicated Volunteer',
    description: 'Complete 10 campaigns',
    icon: '🌟',
    category: 'milestone',
    points: 500,
    rarity: 'rare',
  },
  top_donor: {
    id: 'top_donor',
    title: 'Generous Heart',
    description: 'Donate ₹10,000 or more',
    icon: '💎',
    category: 'donation',
    points: 1000,
    rarity: 'epic',
  },
  streak_7: {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    category: 'streak',
    points: 300,
    rarity: 'rare',
  },
  streak_30: {
    id: 'streak_30',
    title: 'Monthly Champion',
    description: 'Maintain a 30-day streak',
    icon: '👑',
    category: 'streak',
    points: 1500,
    rarity: 'legendary',
  },
  team_player: {
    id: 'team_player',
    title: 'Team Player',
    description: 'Join 3 team campaigns',
    icon: '👥',
    category: 'social',
    points: 200,
    rarity: 'common',
  },
  influencer: {
    id: 'influencer',
    title: 'Social Influencer',
    description: 'Refer 10 friends',
    icon: '📱',
    category: 'social',
    points: 800,
    rarity: 'epic',
  },
};

export const USER_ACHIEVEMENTS = {
  first_campaign: { unlocked: true, unlockedAt: '2024-01-15', progress: 1, total: 1 },
  five_campaigns: { unlocked: true, unlockedAt: '2024-02-20', progress: 5, total: 5 },
  ten_campaigns: { unlocked: false, progress: 7, total: 10 },
  top_donor: { unlocked: false, progress: 5000, total: 10000 },
  streak_7: { unlocked: true, unlockedAt: '2024-03-10', progress: 7, total: 7 },
  streak_30: { unlocked: false, progress: 12, total: 30 },
  team_player: { unlocked: true, unlockedAt: '2024-02-05', progress: 3, total: 3 },
  influencer: { unlocked: false, progress: 4, total: 10 },
};


export const STREAK_DATA = {
  currentStreak: 12,
  longestStreak: 28,
  totalDays: 45,
  lastActivity: '2024-04-28',
  streakHistory: [
    { date: '2024-04-28', active: true, points: 50 },
    { date: '2024-04-27', active: true, points: 50 },
    { date: '2024-04-26', active: true, points: 50 },
    { date: '2024-04-25', active: true, points: 50 },
    { date: '2024-04-24', active: true, points: 50 },
    { date: '2024-04-23', active: true, points: 50 },
    { date: '2024-04-22', active: true, points: 50 },
    { date: '2024-04-21', active: false, points: 0 },
    { date: '2024-04-20', active: true, points: 50 },
    { date: '2024-04-19', active: true, points: 50 },
  ],
  milestones: [
    { days: 7, name: 'Week Warrior', reached: true, reward: '🔥', points: 100 },
    { days: 14, name: 'Two Week Champion', reached: false, reward: '⚡', points: 250 },
    { days: 30, name: 'Monthly Legend', reached: false, reward: '👑', points: 500 },
    { days: 60, name: 'Diamond Streak', reached: false, reward: '💎', points: 1000 },
    { days: 100, name: 'Century Master', reached: false, reward: '🏆', points: 2000 },
  ],
};

export const LEVEL_SYSTEM = {
  currentLevel: 4,
  currentPoints: 2850,
  nextLevelXP: 3500,
  levelPerks: {
    'Beginner': ['Access to basic campaigns', 'View leaderboard'],
    'Novice': ['Profile customization', 'Join team campaigns'],
    'Contributor': ['Create campaigns', 'Access analytics'],
    'Advocate': ['Team leadership', 'Priority matching'],
    'Champion': ['Priority support', 'Exclusive badges', 'Advanced analytics'],
    'Hero': ['Exclusive events', 'Mentorship access', 'Custom profile'],
    'Legend': ['All features unlocked', 'VIP support', 'Special recognition'],
  },
  levels: [
    { level: 1, name: 'Beginner', minPoints: 0, maxPoints: 500, icon: '🌱', badge: '🌱', perks: ['Basic access'] },
    { level: 2, name: 'Novice', minPoints: 500, maxPoints: 1000, icon: '⭐', badge: '⭐', perks: ['Profile customization'] },
    { level: 3, name: 'Contributor', minPoints: 1000, maxPoints: 2000, icon: '🌟', badge: '🌟', perks: ['Create campaigns'] },
    { level: 4, name: 'Advocate', minPoints: 2000, maxPoints: 3500, icon: '💫', badge: '💫', perks: ['Team features'] },
    { level: 5, name: 'Champion', minPoints: 3500, maxPoints: 5500, icon: '🏅', badge: '🏅', perks: ['Priority support'] },
    { level: 6, name: 'Hero', minPoints: 5500, maxPoints: 8000, icon: '🦸', badge: '🦸', perks: ['Exclusive events'] },
    { level: 7, name: 'Legend', minPoints: 8000, maxPoints: 999999, icon: '👑', badge: '👑', perks: ['All features unlocked'] },
  ],
};
