// Featured spotlights service
export const SPOTLIGHT_DATA = {
  spotlights: [
    {
      id: 'spotlight_1',
      type: 'volunteer',
      title: 'Volunteer of the Month',
      subtitle: 'Sarah Johnson',
      description: 'Sarah has dedicated over 200 hours this month to environmental conservation, leading 5 beach cleanup initiatives and mentoring 15 new volunteers.',
      image: '👩‍🌾',
      category: 'individual',
      featured: true,
      priority: 'high',
      date: '2024-04-20',
      expires: '2024-05-20',
      stats: {
        hours: 200,
        campaigns: 5,
        mentorship: 15,
        impact: '500kg waste removed',
      },
      tags: ['environment', 'leadership', 'mentorship'],
      featuredBy: 'admin',
      likes: 245,
      shares: 89,
      views: 1250,
    },
    {
      id: 'spotlight_2',
      type: 'team',
      title: 'Team Excellence Award',
      subtitle: 'Green Warriors',
      description: 'This amazing team has collectively contributed 1,500 hours, completed 12 campaigns, and reduced carbon footprint by 2 tons through their innovative sustainability projects.',
      image: '🏆',
      category: 'team',
      featured: true,
      priority: 'high',
      date: '2024-04-18',
      expires: '2024-05-18',
      stats: {
        members: 25,
        hours: 1500,
        campaigns: 12,
        impact: '2 tons CO2 reduced',
      },
      tags: ['teamwork', 'sustainability', 'innovation'],
      featuredBy: 'admin',
      likes: 189,
      shares: 67,
      views: 980,
    },
    {
      id: 'spotlight_3',
      type: 'campaign',
      title: 'Campaign Spotlight',
      subtitle: 'Ocean Cleanup Initiative',
      description: 'An incredible campaign that united 500 volunteers to remove 10 tons of plastic waste from coastal areas, creating lasting impact on marine ecosystems.',
      image: '🌊',
      category: 'campaign',
      featured: true,
      priority: 'medium',
      date: '2024-04-15',
      expires: '2024-05-15',
      stats: {
        volunteers: 500,
        hours: 2500,
        duration: '3 months',
        impact: '10 tons plastic removed',
      },
      tags: ['environment', 'ocean', 'community'],
      featuredBy: 'admin',
      likes: 312,
      shares: 145,
      views: 2100,
    },
    {
      id: 'spotlight_4',
      type: 'organization',
      title: 'Partner Spotlight',
      subtitle: 'Tech for Good Foundation',
      description: 'This organization has been instrumental in developing digital solutions for volunteer management, impacting over 10,000 volunteers nationwide.',
      image: '💻',
      category: 'organization',
      featured: false,
      priority: 'medium',
      date: '2024-04-12',
      expires: '2024-05-12',
      stats: {
        volunteersImpacted: 10000,
        solutions: 15,
        partnerships: 25,
        reach: 'nationwide',
      },
      tags: ['technology', 'innovation', 'partnership'],
      featuredBy: 'admin',
      likes: 156,
      shares: 78,
      views: 650,
    },
    {
      id: 'spotlight_5',
      type: 'achievement',
      title: 'Milestone Achievement',
      subtitle: '1000 Hours Club',
      description: 'Celebrating volunteers who have reached the incredible milestone of 1,000+ hours of service, demonstrating exceptional commitment to social impact.',
      image: '⭐',
      category: 'achievement',
      featured: false,
      priority: 'low',
      date: '2024-04-10',
      expires: '2024-05-10',
      stats: {
        members: 12,
        totalHours: 15000,
        averageHours: 1250,
        years: '3-5 years',
      },
      tags: ['milestone', 'dedication', 'achievement'],
      featuredBy: 'admin',
      likes: 425,
      shares: 189,
      views: 3200,
    },
  ],
  categories: [
    { key: 'all', name: 'All Spotlights', icon: '🌟' },
    { key: 'individual', name: 'Individuals', icon: '👤' },
    { key: 'team', name: 'Teams', icon: '👥' },
    { key: 'campaign', name: 'Campaigns', icon: '🎯' },
    { key: 'organization', name: 'Organizations', icon: '🏢' },
    { key: 'achievement', name: 'Achievements', icon: '🏆' },
  ],
  nominations: [
    {
      id: 'nomination_1',
      nomineeId: 'user_123',
      nomineeName: 'Alex Chen',
      nominatorId: 'user_456',
      nominatorName: 'Maria Rodriguez',
      type: 'volunteer',
      reason: 'Alex has been instrumental in organizing weekly food drives, serving over 500 families in the past month alone.',
      evidence: ['Photos of food drive events', 'Testimonials from families served', 'Volunteer hours log'],
      status: 'pending',
      submitted: '2024-04-19',
      reviewedBy: null,
    },
    {
      id: 'nomination_2',
      nomineeId: 'team_789',
      nomineeName: 'Digital Innovators',
      nominatorId: 'user_101',
      nominatorName: 'John Smith',
      type: 'team',
      reason: 'This team developed a mobile app that connects volunteers with local opportunities, increasing engagement by 40%.',
      evidence: ['App screenshots', 'Usage statistics', 'User testimonials'],
      status: 'approved',
      submitted: '2024-04-15',
      reviewed: '2024-04-17',
      reviewedBy: 'admin',
    },
  ],
  spotlightHistory: [
    {
      id: 'history_1',
      title: 'Environmental Champion',
      spotlightType: 'volunteer',
      featuredDate: '2024-03-20',
      archivedDate: '2024-04-20',
      totalViews: 3500,
      totalLikes: 420,
      totalShares: 180,
    },
    {
      id: 'history_2',
      title: 'Education Heroes',
      spotlightType: 'team',
      featuredDate: '2024-03-15',
      archivedDate: '2024-04-15',
      totalViews: 2800,
      totalLikes: 310,
      totalShares: 120,
    },
  ],
};

export const getSpotlights = (filters = {}) => {
  let spotlights = SPOTLIGHT_DATA.spotlights;
  
  if (filters.category && filters.category !== 'all') {
    spotlights = spotlights.filter(s => s.category === filters.category);
  }
  
  if (filters.featured !== undefined) {
    spotlights = spotlights.filter(s => s.featured === filters.featured);
  }
  
  if (filters.type) {
    spotlights = spotlights.filter(s => s.type === filters.type);
  }
  
  if (filters.priority) {
    spotlights = spotlights.filter(s => s.priority === filters.priority);
  }
  
  // Sort by priority and date
  return spotlights.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(b.date) - new Date(a.date);
  });
};

export const getSpotlightById = (id) => {
  return SPOTLIGHT_DATA.spotlights.find(s => s.id === id);
};

export const getFeaturedSpotlights = (limit = 3) => {
  return getSpotlights({ featured: true }).slice(0, limit);
};

export const getCategories = () => {
  return SPOTLIGHT_DATA.categories;
};

export const createSpotlight = (spotlightData) => {
  const spotlight = {
    id: `spotlight_${Date.now()}`,
    ...spotlightData,
    featured: spotlightData.featured || false,
    date: new Date().toISOString().split('T')[0],
    expires: spotlightData.expires || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    stats: spotlightData.stats || {},
    tags: spotlightData.tags || [],
    featuredBy: 'admin',
    likes: 0,
    shares: 0,
    views: 0,
  };
  
  SPOTLIGHT_DATA.spotlights.unshift(spotlight);
  return { success: true, spotlight };
};

export const updateSpotlight = (id, updates) => {
  const spotlight = getSpotlightById(id);
  if (!spotlight) {
    return { success: false, message: 'Spotlight not found' };
  }
  
  Object.assign(spotlight, updates);
  return { success: true, spotlight };
};

export const deleteSpotlight = (id) => {
  const index = SPOTLIGHT_DATA.spotlights.findIndex(s => s.id === id);
  if (index === -1) {
    return { success: false, message: 'Spotlight not found' };
  }
  
  const deleted = SPOTLIGHT_DATA.spotlights.splice(index, 1)[0];
  
  // Add to history
  SPOTLIGHT_DATA.spotlightHistory.push({
    id: `history_${Date.now()}`,
    title: deleted.title,
    spotlightType: deleted.type,
    featuredDate: deleted.date,
    archivedDate: new Date().toISOString().split('T')[0],
    totalViews: deleted.views,
    totalLikes: deleted.likes,
    totalShares: deleted.shares,
  });
  
  return { success: true, deleted };
};

export const likeSpotlight = (id) => {
  const spotlight = getSpotlightById(id);
  if (!spotlight) {
    return { success: false, message: 'Spotlight not found' };
  }
  
  spotlight.likes += 1;
  return { success: true, likes: spotlight.likes };
};

export const shareSpotlight = (id) => {
  const spotlight = getSpotlightById(id);
  if (!spotlight) {
    return { success: false, message: 'Spotlight not found' };
  }
  
  spotlight.shares += 1;
  return { success: true, shares: spotlight.shares };
};

export const viewSpotlight = (id) => {
  const spotlight = getSpotlightById(id);
  if (!spotlight) {
    return { success: false, message: 'Spotlight not found' };
  }
  
  spotlight.views += 1;
  return { success: true, views: spotlight.views };
};

export const createNomination = (nominationData) => {
  const nomination = {
    id: `nomination_${Date.now()}`,
    ...nominationData,
    status: 'pending',
    submitted: new Date().toISOString().split('T')[0],
    reviewedBy: null,
  };
  
  SPOTLIGHT_DATA.nominations.unshift(nomination);
  return { success: true, nomination };
};

export const getNominations = (status = null) => {
  let nominations = SPOTLIGHT_DATA.nominations;
  if (status) {
    nominations = nominations.filter(n => n.status === status);
  }
  return nominations;
};

export const reviewNomination = (id, decision, reviewerId) => {
  const nomination = SPOTLIGHT_DATA.nominations.find(n => n.id === id);
  if (!nomination) {
    return { success: false, message: 'Nomination not found' };
  }
  
  nomination.status = decision;
  nomination.reviewedBy = reviewerId;
  nomination.reviewed = new Date().toISOString().split('T')[0];
  
  if (decision === 'approved') {
    // Create spotlight from nomination
    const spotlightData = {
      type: nomination.type,
      title: `Spotlight: ${nomination.nomineeName}`,
      subtitle: nomination.nomineeName,
      description: nomination.reason,
      category: nomination.type === 'team' ? 'team' : 'individual',
      featured: false,
      priority: 'medium',
      tags: ['nominated', 'community'],
    };
    
    createSpotlight(spotlightData);
  }
  
  return { success: true, nomination };
};

export const getSpotlightStats = () => {
  const totalSpotlights = SPOTLIGHT_DATA.spotlights.length;
  const featuredSpotlights = SPOTLIGHT_DATA.spotlights.filter(s => s.featured).length;
  const totalViews = SPOTLIGHT_DATA.spotlights.reduce((sum, s) => sum + s.views, 0);
  const totalLikes = SPOTLIGHT_DATA.spotlights.reduce((sum, s) => sum + s.likes, 0);
  const totalShares = SPOTLIGHT_DATA.spotlights.reduce((sum, s) => sum + s.shares, 0);
  const pendingNominations = SPOTLIGHT_DATA.nominations.filter(n => n.status === 'pending').length;
  
  const categoryStats = {};
  SPOTLIGHT_DATA.categories.slice(1).forEach(cat => {
    categoryStats[cat.key] = SPOTLIGHT_DATA.spotlights.filter(s => s.category === cat.key).length;
  });
  
  return {
    totalSpotlights,
    featuredSpotlights,
    totalViews,
    totalLikes,
    totalShares,
    pendingNominations,
    categoryStats,
  };
};

export const getSpotlightHistory = () => {
  return SPOTLIGHT_DATA.spotlightHistory.sort((a, b) => 
    new Date(b.archivedDate) - new Date(a.archivedDate)
  );
};

export const searchSpotlights = (query) => {
  const lowerQuery = query.toLowerCase();
  return SPOTLIGHT_DATA.spotlights.filter(spotlight =>
    spotlight.title.toLowerCase().includes(lowerQuery) ||
    spotlight.subtitle.toLowerCase().includes(lowerQuery) ||
    spotlight.description.toLowerCase().includes(lowerQuery) ||
    spotlight.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getTrendingSpotlights = (limit = 5) => {
  return SPOTLIGHT_DATA.spotlights
    .sort((a, b) => (b.likes + b.shares) - (a.likes + a.shares))
    .slice(0, limit);
};

export const getExpiredSpotlights = () => {
  const today = new Date().toISOString().split('T')[0];
  return SPOTLIGHT_DATA.spotlights.filter(s => s.expires < today && s.featured);
};

export const archiveExpiredSpotlights = () => {
  const expired = getExpiredSpotlights();
  const archived = [];
  
  expired.forEach(spotlight => {
    const result = deleteSpotlight(spotlight.id);
    if (result.success) {
      archived.push(result.deleted);
    }
  });
  
  return { success: true, archived };
};
