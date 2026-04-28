// Domain-specific leaderboards service
export const DOMAIN_DATA = {
  domains: [
    {
      id: 'environment',
      name: 'Environment',
      icon: '🌱',
      description: 'Environmental conservation and sustainability',
      color: '#22C55E',
      categories: ['Tree Planting', 'Waste Management', 'Ocean Cleanup', 'Wildlife Protection'],
      stats: {
        totalVolunteers: 245,
        activeCampaigns: 18,
        totalHours: 3420,
        impactScore: 89,
      },
    },
    {
      id: 'education',
      name: 'Education',
      icon: '📚',
      description: 'Teaching, mentoring, and educational initiatives',
      color: '#3B82F6',
      categories: ['Teaching', 'Mentoring', 'Library Support', 'Digital Literacy'],
      stats: {
        totalVolunteers: 189,
        activeCampaigns: 12,
        totalHours: 2890,
        impactScore: 85,
      },
    },
    {
      id: 'health',
      name: 'Healthcare',
      icon: '💊',
      description: 'Medical services and health awareness',
      color: '#EF4444',
      categories: ['Medical Camps', 'Health Awareness', 'Blood Donation', 'Mental Health'],
      stats: {
        totalVolunteers: 156,
        activeCampaigns: 8,
        totalHours: 1980,
        impactScore: 82,
      },
    },
    {
      id: 'community',
      name: 'Community',
      icon: '🤝',
      description: 'Community development and social welfare',
      color: '#F59E0B',
      categories: ['Food Distribution', 'Shelter Support', 'Senior Care', 'Youth Programs'],
      stats: {
        totalVolunteers: 203,
        activeCampaigns: 15,
        totalHours: 2670,
        impactScore: 78,
      },
    },
    {
      id: 'technology',
      name: 'Technology',
      icon: '💻',
      description: 'Tech for good and digital inclusion',
      color: '#8B5CF6',
      categories: ['Digital Literacy', 'IT Support', 'App Development', 'Data Analysis'],
      stats: {
        totalVolunteers: 98,
        activeCampaigns: 6,
        totalHours: 1240,
        impactScore: 75,
      },
    },
    {
      id: 'arts',
      name: 'Arts & Culture',
      icon: '🎨',
      description: 'Cultural preservation and creative expression',
      color: '#EC4899',
      categories: ['Art Therapy', 'Cultural Events', 'Music Education', 'Heritage Preservation'],
      stats: {
        totalVolunteers: 76,
        activeCampaigns: 4,
        totalHours: 890,
        impactScore: 71,
      },
    },
  ],
  domainLeaderboards: {
    environment: [
      { id: 'user_1', name: 'Rahul Sharma', points: 1850, campaigns: 12, hours: 156, badge: '🌟' },
      { id: 'user_2', name: 'Priya Patel', points: 1650, campaigns: 10, hours: 134, badge: '🌟' },
      { id: 'user_current', name: 'You', points: 1450, campaigns: 8, hours: 112, badge: '🌱' },
      { id: 'user_3', name: 'Amit Kumar', points: 1320, campaigns: 9, hours: 98, badge: '🌿' },
      { id: 'user_4', name: 'Sneha Reddy', points: 1180, campaigns: 7, hours: 87, badge: '🌿' },
    ],
    education: [
      { id: 'user_5', name: 'Vikram Singh', points: 1420, campaigns: 8, hours: 124, badge: '📚' },
      { id: 'user_6', name: 'Neha Joshi', points: 1280, campaigns: 7, hours: 108, badge: '📖' },
      { id: 'user_current', name: 'You', points: 980, campaigns: 5, hours: 89, badge: '🎓' },
      { id: 'user_7', name: 'Rohit Verma', points: 890, campaigns: 6, hours: 76, badge: '📝' },
    ],
    health: [
      { id: 'user_8', name: 'Dr. Sarah Johnson', points: 1680, campaigns: 6, hours: 145, badge: '💊' },
      { id: 'user_9', name: 'Michael Chen', points: 1520, campaigns: 5, hours: 128, badge: '🏥' },
      { id: 'user_current', name: 'You', points: 720, campaigns: 3, hours: 56, badge: '❤️' },
    ],
    community: [
      { id: 'user_10', name: 'Maria Rodriguez', points: 1340, campaigns: 9, hours: 118, badge: '🤝' },
      { id: 'user_11', name: 'James Wilson', points: 1190, campaigns: 8, hours: 102, badge: '🏘️' },
      { id: 'user_current', name: 'You', points: 890, campaigns: 6, hours: 78, badge: '👥' },
    ],
    technology: [
      { id: 'user_12', name: 'Alex Kim', points: 1120, campaigns: 4, hours: 89, badge: '💻' },
      { id: 'user_13', name: 'Lisa Wang', points: 980, campaigns: 3, hours: 72, badge: '📱' },
      { id: 'user_current', name: 'You', points: 450, campaigns: 2, hours: 34, badge: '💡' },
    ],
    arts: [
      { id: 'user_14', name: 'David Martinez', points: 890, campaigns: 3, hours: 67, badge: '🎨' },
      { id: 'user_15', name: 'Sophie Laurent', points: 720, campaigns: 2, hours: 54, badge: '🎭' },
      { id: 'user_current', name: 'You', points: 280, campaigns: 1, hours: 23, badge: '🎪' },
    ],
  },
  userDomainStats: {
    user_current: {
      environment: { rank: 3, points: 1450, level: 'Expert', contribution: '35%' },
      education: { rank: 3, points: 980, level: 'Advanced', contribution: '25%' },
      health: { rank: 3, points: 720, level: 'Intermediate', contribution: '15%' },
      community: { rank: 3, points: 890, level: 'Advanced', contribution: '20%' },
      technology: { rank: 3, points: 450, level: 'Beginner', contribution: '5%' },
      arts: { rank: 3, points: 280, level: 'Beginner', contribution: '5%' },
    },
  },
  trendingDomains: [
    { domainId: 'environment', growth: '+15%', trend: 'up', reason: 'Earth Day campaigns' },
    { domainId: 'education', growth: '+8%', trend: 'up', reason: 'Summer teaching programs' },
    { domainId: 'health', growth: '+5%', trend: 'stable', reason: 'Regular health camps' },
    { domainId: 'community', growth: '-2%', trend: 'down', reason: 'Seasonal variation' },
  ],
};

export const getDomainLeaderboard = (domainId) => {
  return DOMAIN_DATA.domainLeaderboards[domainId] || [];
};

export const getDomainInfo = (domainId) => {
  return DOMAIN_DATA.domains.find(domain => domain.id === domainId);
};

export const getUserDomainStats = (userId = 'user_current') => {
  return DOMAIN_DATA.userDomainStats[userId] || {};
};

export const getDomainsByPopularity = () => {
  return DOMAIN_DATA.domains.sort((a, b) => b.stats.totalVolunteers - a.stats.totalVolunteers);
};

export const getTrendingDomains = () => {
  return DOMAIN_DATA.trendingDomains.map(trend => ({
    ...trend,
    domain: getDomainInfo(trend.domainId),
  }));
};

export const getUserBestDomain = (userId = 'user_current') => {
  const userStats = getUserDomainStats(userId);
  const domains = Object.entries(userStats);
  
  if (domains.length === 0) return null;
  
  const bestDomain = domains.reduce((best, [domainId, stats]) => 
    stats.points > best.points ? { domainId, ...stats } : best,
    { domainId: '', points: 0 }
  );
  
  return {
    ...bestDomain,
    domain: getDomainInfo(bestDomain.domainId),
  };
};

export const calculateDomainImpact = (domainId) => {
  const domain = getDomainInfo(domainId);
  if (!domain) return 0;
  
  const { totalVolunteers, activeCampaigns, totalHours, impactScore } = domain.stats;
  
  // Simple impact calculation formula
  const impact = (totalVolunteers * 0.3) + 
                 (activeCampaigns * 0.2) + 
                 (totalHours * 0.3) + 
                 (impactScore * 0.2);
  
  return Math.round(impact);
};

export const getRecommendedDomains = (userId = 'user_current') => {
  const userStats = getUserDomainStats(userId);
  const userDomains = Object.keys(userStats);
  
  // Recommend domains where user has low participation but high impact potential
  return DOMAIN_DATA.domains
    .filter(domain => !userDomains.includes(domain.id))
    .sort((a, b) => calculateDomainImpact(b.id) - calculateDomainImpact(a.id))
    .slice(0, 3);
};

export const joinDomain = (domainId, userId = 'user_current') => {
  const domain = getDomainInfo(domainId);
  if (!domain) return { success: false, message: 'Domain not found' };
  
  // Add user to domain with initial stats
  if (!DOMAIN_DATA.userDomainStats[userId]) {
    DOMAIN_DATA.userDomainStats[userId] = {};
  }
  
  DOMAIN_DATA.userDomainStats[userId][domainId] = {
    rank: DOMAIN_DATA.domainLeaderboards[domainId].length + 1,
    points: 50, // Starting points
    level: 'Beginner',
    contribution: '1%',
  };
  
  // Add to domain leaderboard
  if (!DOMAIN_DATA.domainLeaderboards[domainId]) {
    DOMAIN_DATA.domainLeaderboards[domainId] = [];
  }
  
  DOMAIN_DATA.domainLeaderboards[domainId].push({
    id: userId,
    name: 'You',
    points: 50,
    campaigns: 0,
    hours: 0,
    badge: domain.icon,
  });
  
  // Update domain stats
  domain.stats.totalVolunteers += 1;
  
  return { success: true, message: `Joined ${domain.name} domain!` };
};
