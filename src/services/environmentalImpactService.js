// Environmental impact calculator service
export const ENVIRONMENTAL_IMPACT_DATA = {
  impactCategories: [
    {
      id: 'carbon',
      name: 'Carbon Footprint',
      unit: 'kg CO2e',
      icon: '🌍',
      description: 'Greenhouse gas emissions from activities',
      color: '#EF4444',
      factors: {
        transportation: {
          car: 0.21, // kg CO2e per km
          bus: 0.08,
          train: 0.04,
          bicycle: 0,
          walking: 0,
        },
        energy: {
          electricity: 0.5, // kg CO2e per kWh
          natural_gas: 2.0, // kg CO2e per cubic meter
          solar: 0,
          wind: 0,
        },
        waste: {
          landfill: 0.5, // kg CO2e per kg waste
          recycling: -0.3, // negative impact (good)
          composting: -0.2,
        },
      },
    },
    {
      id: 'water',
      name: 'Water Usage',
      unit: 'liters',
      icon: '💧',
      description: 'Water consumption and conservation',
      color: '#3B82F6',
      factors: {
        daily: {
          shower: 80, // liters per 10-minute shower
          toilet: 6, // liters per flush
          dishwashing: 20, // liters per session
          laundry: 50, // liters per load
        },
        conservation: {
          water_bottle: 0.5, // liters saved per reusable bottle
          short_shower: 40, // liters saved per 5-minute reduction
          leak_repair: 3000, // liters saved per month per leak
        },
      },
    },
    {
      id: 'waste',
      name: 'Waste Reduction',
      unit: 'kg',
      icon: '♻️',
      description: 'Waste generation and recycling efforts',
      color: '#22C55E',
      factors: {
        reduction: {
          reusable_bag: 0.05, // kg saved per reusable bag use
          digital_documents: 0.01, // kg saved per digital document
          compost: 0.3, // kg diverted from landfill
        },
        recycling: {
          paper: 0.9, // kg CO2e saved per kg recycled
          plastic: 1.2,
          glass: 0.3,
          metal: 2.0,
        },
      },
    },
    {
      id: 'energy',
      name: 'Energy Conservation',
      unit: 'kWh',
      icon: '⚡',
      description: 'Energy consumption and renewable usage',
      color: '#F59E0B',
      factors: {
        savings: {
          led_bulb: 50, // kWh saved per year per bulb
          unplugged_device: 0.5, // kWh saved per day per device
          smart_thermostat: 180, // kWh saved per year
        },
        renewable: {
          solar_panel: 400, // kWh generated per month per panel
          wind_turbine: 1000, // kWh generated per month
        },
      },
    },
    {
      id: 'biodiversity',
      name: 'Biodiversity Impact',
      unit: 'points',
      icon: '🌿',
      description: 'Impact on local ecosystems and wildlife',
      color: '#10B981',
      factors: {
        positive: {
          tree_planted: 10,
          garden_created: 25,
          habitat_restored: 50,
          wildlife_protected: 30,
        },
        negative: {
          habitat_destroyed: -20,
          pesticide_use: -5,
          pollution: -10,
        },
      },
    },
  ],
  activities: [
    {
      id: 'activity_1',
      name: 'Beach Cleanup',
      category: 'waste',
      description: 'Participating in beach cleanup activities',
      impact: {
        waste_collected: 5, // kg
        plastic_recycled: 3, // kg
        community_impact: 15,
      },
      duration: 120, // minutes
      frequency: 'weekly',
      difficulty: 'moderate',
    },
    {
      id: 'activity_2',
      name: 'Tree Planting',
      category: 'biodiversity',
      description: 'Planting trees in local parks and communities',
      impact: {
        trees_planted: 3,
        carbon_offset: 21, // kg CO2e per year per tree
        biodiversity_improved: 10,
      },
      duration: 180, // minutes
      frequency: 'monthly',
      difficulty: 'moderate',
    },
    {
      id: 'activity_3',
      name: 'Bike to Work',
      category: 'carbon',
      description: 'Using bicycle instead of car for commuting',
      impact: {
        carbon_saved: 4.2, // kg CO2e per 20km round trip
        health_benefit: 5,
        community_impact: 3,
      },
      duration: 60, // minutes
      frequency: 'daily',
      difficulty: 'easy',
    },
    {
      id: 'activity_4',
      name: 'Community Garden',
      category: 'biodiversity',
      description: 'Maintaining community garden plots',
      impact: {
        food_produced: 2, // kg
        biodiversity_created: 15,
        community_engagement: 20,
      },
      duration: 240, // minutes
      frequency: 'weekly',
      difficulty: 'moderate',
    },
  ],
  userImpact: {
    userId: 'user_1',
    totalImpact: {
      carbon: -450.5, // negative means reduction
      water: 1250,
      waste: 85.2,
      energy: 320,
      biodiversity: 180,
    },
    monthlyTrend: {
      carbon: [-120, -135, -145, -150.5],
      water: [280, 300, 320, 350],
      waste: [18, 20, 22, 25.2],
      energy: [70, 75, 80, 90],
      biodiversity: [35, 40, 45, 50],
    },
    activities: [
      {
        activityId: 'activity_1',
        date: '2024-04-20T10:00:00Z',
        duration: 120,
        impact: {
          waste_collected: 5,
          plastic_recycled: 3,
        },
      },
      {
        activityId: 'activity_2',
        date: '2024-04-18T14:00:00Z',
        duration: 180,
        impact: {
          trees_planted: 3,
          carbon_offset: 63,
        },
      },
    ],
    goals: [
      {
        id: 'goal_1',
        category: 'carbon',
        target: -500, // kg CO2e reduction
        current: -450.5,
        deadline: '2024-12-31T23:59:59Z',
        unit: 'kg CO2e',
      },
      {
        id: 'goal_2',
        category: 'waste',
        target: 100, // kg waste reduced
        current: 85.2,
        deadline: '2024-12-31T23:59:59Z',
        unit: 'kg',
      },
    ],
    achievements: [
      {
        id: 'achievement_1',
        name: 'Eco Warrior',
        description: 'Reduced carbon footprint by 400kg',
        icon: '🌟',
        unlockedAt: '2024-04-15T10:00:00Z',
        category: 'carbon',
      },
      {
        id: 'achievement_2',
        name: 'Green Guardian',
        description: 'Planted 10 trees',
        icon: '🌳',
        unlockedAt: '2024-04-10T14:30:00Z',
        category: 'biodiversity',
      },
    ],
    comparisons: {
      individual: {
        average: {
          carbon: 200,
          water: 800,
          waste: 50,
          energy: 250,
          biodiversity: 50,
        },
        ranking: {
          carbon: 15, // percentile
          water: 75,
          waste: 85,
          energy: 60,
          biodiversity: 90,
        },
      },
      community: {
        total_volunteers: 1250,
        collective_impact: {
          carbon: -125000,
          water: 450000,
          waste: 25000,
          energy: 125000,
          biodiversity: 45000,
        },
      },
    },
  },
  challenges: [
    {
      id: 'challenge_1',
      name: 'Zero Waste Week',
      description: 'Go one week without producing any landfill waste',
      category: 'waste',
      duration: 7,
      difficulty: 'hard',
      participants: 234,
      impact_potential: 15,
      rewards: ['Zero Waste Badge', 'Eco Points: 100'],
      start_date: '2024-05-01T00:00:00Z',
      end_date: '2024-05-07T23:59:59Z',
      status: 'upcoming',
    },
    {
      id: 'challenge_2',
      name: 'Carbon Neutral Month',
      description: 'Offset your monthly carbon footprint through activities',
      category: 'carbon',
      duration: 30,
      difficulty: 'extreme',
      participants: 89,
      impact_potential: 100,
      rewards: ['Climate Champion Badge', 'Eco Points: 500'],
      start_date: '2024-04-01T00:00:00Z',
      end_date: '2024-04-30T23:59:59Z',
      status: 'active',
    },
  ],
  tips: [
    {
      id: 'tip_1',
      category: 'carbon',
      title: 'Switch to LED Bulbs',
      description: 'LED bulbs use 75% less energy than traditional bulbs',
      impact: 'Save 400 kWh per year per bulb',
      difficulty: 'easy',
      cost: 'low',
    },
    {
      id: 'tip_2',
      category: 'water',
      title: 'Fix Leaky Faucets',
      description: 'A dripping faucet can waste 3000 liters per month',
      impact: 'Save 36000 liters per year per leak',
      difficulty: 'moderate',
      cost: 'low',
    },
    {
      id: 'tip_3',
      category: 'waste',
      title: 'Start Composting',
      description: 'Composting reduces landfill waste and creates nutrient-rich soil',
      impact: 'Divert 200kg waste per year',
      difficulty: 'moderate',
      cost: 'low',
    },
  ],
  analytics: {
    total_calculations: 15420,
    active_users: 8934,
    total_impact: {
      carbon: -1250000, // kg CO2e
      water: 4500000, // liters
      waste: 250000, // kg
      energy: 1250000, // kWh
      biodiversity: 450000, // points
    },
    popular_activities: ['Beach Cleanup', 'Tree Planting', 'Bike to Work'],
    monthly_growth: 0.15,
    engagement_rate: 0.68,
  },
  settings: {
    notifications: {
      daily_reminders: true,
      weekly_reports: true,
      achievement_alerts: true,
      challenge_updates: true,
    },
    privacy: {
      share_progress: false,
      public_profile: false,
      anonymous_data: true,
    },
    units: {
      carbon: 'kg CO2e',
      water: 'liters',
      waste: 'kg',
      energy: 'kWh',
      distance: 'km',
      temperature: 'celsius',
    },
  },
};

export const getImpactCategories = () => {
  return ENVIRONMENTAL_IMPACT_DATA.impactCategories;
};

export const getImpactCategoryById = (id) => {
  return ENVIRONMENTAL_IMPACT_DATA.impactCategories.find(category => category.id === id);
};

export const calculateActivityImpact = (activityId, duration, intensity = 'normal') => {
  const activity = ENVIRONMENTAL_IMPACT_DATA.activities.find(a => a.id === activityId);
  
  if (!activity) {
    return { success: false, message: 'Activity not found' };
  }
  
  const intensityMultiplier = {
    light: 0.7,
    normal: 1.0,
    moderate: 1.3,
    intense: 1.6,
  }[intensity] || 1.0;
  
  const durationMultiplier = duration / activity.duration;
  
  const impact = {};
  Object.keys(activity.impact).forEach(key => {
    impact[key] = activity.impact[key] * durationMultiplier * intensityMultiplier;
  });
  
  return { success: true, impact };
};

export const calculateCustomImpact = (category, action, value) => {
  const categoryData = getImpactCategoryById(category);
  
  if (!categoryData) {
    return { success: false, message: 'Category not found' };
  }
  
  const factors = categoryData.factors;
  let impact = 0;
  
  // Simple calculation based on factors
  if (category === 'carbon' && factors.transportation[action]) {
    impact = factors.transportation[action] * value;
  } else if (category === 'water' && factors.daily[action]) {
    impact = factors.daily[action] * value;
  } else if (category === 'energy' && factors.savings[action]) {
    impact = factors.savings[action] * value;
  }
  
  return { success: true, impact, unit: categoryData.unit };
};

export const getUserImpact = (userId) => {
  // In real app, this would fetch user-specific data
  return ENVIRONMENTAL_IMPACT_DATA.userImpact;
};

export const updateUserImpact = (userId, category, impact) => {
  const userImpact = getUserImpact(userId);
  userImpact.totalImpact[category] += impact;
  
  // Update monthly trend
  const currentMonth = new Date().getMonth();
  if (!userImpact.monthlyTrend[category]) {
    userImpact.monthlyTrend[category] = [];
  }
  userImpact.monthlyTrend[category][currentMonth] = userImpact.totalImpact[category];
  
  return { success: true, impact: userImpact.totalImpact };
};

export const logActivity = (userId, activityId, duration, intensity = 'normal') => {
  const result = calculateActivityImpact(activityId, duration, intensity);
  
  if (!result.success) {
    return result;
  }
  
  const userImpact = getUserImpact(userId);
  
  // Add to activities
  const activityLog = {
    activityId,
    date: new Date().toISOString(),
    duration,
    intensity,
    impact: result.impact,
  };
  
  userImpact.activities.push(activityLog);
  
  // Update total impact
  Object.keys(result.impact).forEach(key => {
    if (userImpact.totalImpact[key] !== undefined) {
      userImpact.totalImpact[key] += result.impact[key];
    }
  });
  
  // Check achievements
  checkAchievements(userId);
  
  return { success: true, activity: activityLog, impact: result.impact };
};

export const getActivities = (filters = {}) => {
  let activities = ENVIRONMENTAL_IMPACT_DATA.activities;
  
  if (filters.category) {
    activities = activities.filter(activity => activity.category === filters.category);
  }
  
  if (filters.difficulty) {
    activities = activities.filter(activity => activity.difficulty === filters.difficulty);
  }
  
  if (filters.frequency) {
    activities = activities.filter(activity => activity.frequency === filters.frequency);
  }
  
  return activities;
};

export const getActivityById = (id) => {
  return ENVIRONMENTAL_IMPACT_DATA.activities.find(activity => activity.id === id);
};

export const getChallenges = (filters = {}) => {
  let challenges = ENVIRONMENTAL_IMPACT_DATA.challenges;
  
  if (filters.category) {
    challenges = challenges.filter(challenge => challenge.category === filters.category);
  }
  
  if (filters.status) {
    challenges = challenges.filter(challenge => challenge.status === filters.status);
  }
  
  if (filters.difficulty) {
    challenges = challenges.filter(challenge => challenge.difficulty === filters.difficulty);
  }
  
  return challenges.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
};

export const joinChallenge = (userId, challengeId) => {
  const challenge = ENVIRONMENTAL_IMPACT_DATA.challenges.find(c => c.id === challengeId);
  
  if (!challenge) {
    return { success: false, message: 'Challenge not found' };
  }
  
  if (challenge.status !== 'upcoming' && challenge.status !== 'active') {
    return { success: false, message: 'Challenge is not available' };
  }
  
  // In real app, this would add user to challenge participants
  challenge.participants += 1;
  
  return { success: true, challenge };
};

export const getTips = (filters = {}) => {
  let tips = ENVIRONMENTAL_IMPACT_DATA.tips;
  
  if (filters.category) {
    tips = tips.filter(tip => tip.category === filters.category);
  }
  
  if (filters.difficulty) {
    tips = tips.filter(tip => tip.difficulty === filters.difficulty);
  }
  
  if (filters.cost) {
    tips = tips.filter(tip => tip.cost === filters.cost);
  }
  
  return tips;
};

export const getTipById = (id) => {
  return ENVIRONMENTAL_IMPACT_DATA.tips.find(tip => tip.id === id);
};

export const getEnvironmentalAnalytics = () => {
  return ENVIRONMENTAL_IMPACT_DATA.analytics;
};

export const updateEnvironmentalAnalytics = () => {
  // Update analytics based on current data
  return ENVIRONMENTAL_IMPACT_DATA.analytics;
};

export const getEnvironmentalSettings = () => {
  return ENVIRONMENTAL_IMPACT_DATA.settings;
};

export const updateEnvironmentalSettings = (updates) => {
  ENVIRONMENTAL_IMPACT_DATA.settings = { ...ENVIRONMENTAL_IMPACT_DATA.settings, ...updates };
  return { success: true, settings: ENVIRONMENTAL_IMPACT_DATA.settings };
};

export const generateImpactReport = (userId, period = 'month') => {
  const userImpact = getUserImpact(userId);
  
  const report = {
    userId,
    period,
    generatedAt: new Date().toISOString(),
    totalImpact: userImpact.totalImpact,
    monthlyTrend: userImpact.monthlyTrend,
    activities: userImpact.activities.slice(-10), // Last 10 activities
    goals: userImpact.goals,
    achievements: userImpact.achievements,
    comparisons: userImpact.comparisons,
    recommendations: generateRecommendations(userImpact),
  };
  
  return { success: true, report };
};

const generateRecommendations = (userImpact) => {
  const recommendations = [];
  
  if (userImpact.totalImpact.carbon > -200) {
    recommendations.push({
      category: 'carbon',
      title: 'Increase Carbon Reduction',
      description: 'Try biking to work or using public transportation more often',
      potential_impact: 50, // kg CO2e per month
    });
  }
  
  if (userImpact.totalImpact.waste < 50) {
    recommendations.push({
      category: 'waste',
      title: 'Reduce Waste Further',
      description: 'Start composting and use reusable bags',
      potential_impact: 10, // kg per month
    });
  }
  
  if (userImpact.totalImpact.biodiversity < 100) {
    recommendations.push({
      category: 'biodiversity',
      title: 'Support Local Ecosystems',
      description: 'Join tree planting or community garden activities',
      potential_impact: 25, // points per month
    });
  }
  
  return recommendations;
};

export const checkAchievements = (userId) => {
  const userImpact = getUserImpact(userId);
  const newAchievements = [];
  
  // Check for various achievements
  if (Math.abs(userImpact.totalImpact.carbon) >= 400 && !userImpact.achievements.find(a => a.name === 'Eco Warrior')) {
    newAchievements.push({
      id: 'achievement_new',
      name: 'Eco Warrior',
      description: 'Reduced carbon footprint by 400kg',
      icon: '🌟',
      unlockedAt: new Date().toISOString(),
      category: 'carbon',
    });
  }
  
  if (userImpact.totalImpact.biodiversity >= 50 && !userImpact.achievements.find(a => a.name === 'Green Guardian')) {
    newAchievements.push({
      id: 'achievement_new2',
      name: 'Green Guardian',
      description: 'Created significant biodiversity impact',
      icon: '🌳',
      unlockedAt: new Date().toISOString(),
      category: 'biodiversity',
    });
  }
  
  userImpact.achievements.push(...newAchievements);
  
  return newAchievements;
};

export const setGoal = (userId, category, target, deadline) => {
  const userImpact = getUserImpact(userId);
  
  const newGoal = {
    id: `goal_${Date.now()}`,
    category,
    target,
    current: userImpact.totalImpact[category] || 0,
    deadline,
    unit: getImpactCategoryById(category)?.unit || 'points',
  };
  
  userImpact.goals.push(newGoal);
  
  return { success: true, goal: newGoal };
};

export const updateGoal = (userId, goalId, updates) => {
  const userImpact = getUserImpact(userId);
  const goalIndex = userImpact.goals.findIndex(g => g.id === goalId);
  
  if (goalIndex === -1) {
    return { success: false, message: 'Goal not found' };
  }
  
  userImpact.goals[goalIndex] = { ...userImpact.goals[goalIndex], ...updates };
  
  return { success: true, goal: userImpact.goals[goalIndex] };
};

export const calculateFootprint = (userId, period = 'month') => {
  const userImpact = getUserImpact(userId);
  const activities = userImpact.activities.filter(activity => {
    const activityDate = new Date(activity.date);
    const now = new Date();
    
    if (period === 'month') {
      return activityDate.getMonth() === now.getMonth() && 
             activityDate.getFullYear() === now.getFullYear();
    } else if (period === 'year') {
      return activityDate.getFullYear() === now.getFullYear();
    }
    
    return true;
  });
  
  const footprint = {
    carbon: 0,
    water: 0,
    waste: 0,
    energy: 0,
    biodiversity: 0,
  };
  
  activities.forEach(activity => {
    Object.keys(activity.impact).forEach(key => {
      if (footprint[key] !== undefined) {
        footprint[key] += activity.impact[key];
      }
    });
  });
  
  return { success: true, footprint, activities };
};

export const compareWithCommunity = (userId) => {
  const userImpact = getUserImpact(userId);
  const analytics = getEnvironmentalAnalytics();
  
  const comparison = {
    user: userImpact.totalImpact,
    community_average: {
      carbon: analytics.total_impact.carbon / analytics.active_users,
      water: analytics.total_impact.water / analytics.active_users,
      waste: analytics.total_impact.waste / analytics.active_users,
      energy: analytics.total_impact.energy / analytics.active_users,
      biodiversity: analytics.total_impact.biodiversity / analytics.active_users,
    },
    ranking: {
      carbon: userImpact.comparisons.individual.ranking.carbon,
      water: userImpact.comparisons.individual.ranking.water,
      waste: userImpact.comparisons.individual.ranking.waste,
      energy: userImpact.comparisons.individual.ranking.energy,
      biodiversity: userImpact.comparisons.individual.ranking.biodiversity,
    },
  };
  
  return { success: true, comparison };
};
