// Leaderboard history and trends service
export const HISTORY_DATA = {
  rankHistory: [
    { date: '2024-01-01', rank: 45, points: 120, campaigns: 2 },
    { date: '2024-01-15', rank: 38, points: 280, campaigns: 5 },
    { date: '2024-02-01', rank: 28, points: 450, campaigns: 8 },
    { date: '2024-02-15', rank: 22, points: 580, campaigns: 10 },
    { date: '2024-03-01', rank: 18, points: 720, campaigns: 11 },
    { date: '2024-03-15', rank: 12, points: 850, campaigns: 12 },
    { date: '2024-04-01', rank: 8, points: 980, campaigns: 13 },
    { date: '2024-04-15', rank: 7, points: 1100, campaigns: 14 },
  ],
  weeklyTrends: [
    { week: 'W1 Jan', rank: 45, points: 120, change: 0, trend: 'stable' },
    { week: 'W2 Jan', rank: 38, points: 160, change: -7, trend: 'up' },
    { week: 'W3 Jan', rank: 32, points: 170, change: -6, trend: 'up' },
    { week: 'W4 Jan', rank: 28, points: 170, change: -4, trend: 'up' },
    { week: 'W1 Feb', rank: 25, points: 130, change: -3, trend: 'up' },
    { week: 'W2 Feb', rank: 22, points: 130, change: -3, trend: 'up' },
    { week: 'W3 Feb', rank: 20, points: 140, change: -2, trend: 'up' },
    { week: 'W4 Feb', rank: 18, points: 140, change: -2, trend: 'up' },
    { week: 'W1 Mar', rank: 15, points: 170, change: -3, trend: 'up' },
    { week: 'W2 Mar', rank: 12, points: 130, change: -3, trend: 'up' },
    { week: 'W3 Mar', rank: 10, points: 130, change: -2, trend: 'up' },
    { week: 'W4 Mar', rank: 8, points: 130, change: -2, trend: 'up' },
    { week: 'W1 Apr', rank: 7, points: 120, change: -1, trend: 'up' },
    { week: 'W2 Apr', rank: 7, points: 120, change: 0, trend: 'stable' },
  ],
  monthlyComparison: {
    current: {
      month: 'April 2024',
      rank: 7,
      points: 1100,
      campaigns: 14,
      hours: 78,
      achievements: 3,
    },
    previous: {
      month: 'March 2024',
      rank: 8,
      points: 850,
      campaigns: 12,
      hours: 65,
      achievements: 2,
    },
    growth: {
      rankChange: -1,
      pointsChange: 250,
      campaignsChange: 2,
      hoursChange: 13,
      achievementsChange: 1,
    },
  },
  competitorTrends: {
    user_1: [
      { date: '2024-01-01', rank: 3, points: 1800 },
      { date: '2024-02-01', rank: 2, points: 2000 },
      { date: '2024-03-01', rank: 1, points: 2200 },
      { date: '2024-04-01', rank: 1, points: 2450 },
    ],
    user_2: [
      { date: '2024-01-01', rank: 5, points: 1500 },
      { date: '2024-02-01', rank: 4, points: 1700 },
      { date: '2024-03-01', rank: 3, points: 1900 },
      { date: '2024-04-01', rank: 2, points: 2100 },
    ],
    user_3: [
      { date: '2024-01-01', rank: 8, points: 1200 },
      { date: '2024-02-01', rank: 6, points: 1400 },
      { date: '2024-03-01', rank: 4, points: 1600 },
      { date: '2024-04-01', rank: 3, points: 1850 },
    ],
  },
  milestones: [
    { date: '2024-01-15', title: 'Top 50', description: 'Entered top 50 volunteers', rank: 38 },
    { date: '2024-02-28', title: 'Top 30', description: 'Reached top 30 milestone', rank: 18 },
    { date: '2024-03-15', title: 'Top 20', description: 'Breaking into top 20', rank: 12 },
    { date: '2024-04-01', title: 'Top 10', description: 'Elite top 10 volunteer', rank: 8 },
  ],
  predictions: {
    nextMonth: {
      projectedRank: 5,
      projectedPoints: 1350,
      confidence: 85,
      factors: ['Consistent performance', 'Upcoming challenges', 'Team contributions'],
    },
    nextQuarter: {
      projectedRank: 3,
      projectedPoints: 2000,
      confidence: 75,
      factors: ['Skill improvement', 'Mentorship impact', 'New campaigns'],
    },
  },
};

export const getRankHistory = (period = 'monthly') => {
  switch (period) {
    case 'weekly':
      return HISTORY_DATA.weeklyTrends;
    case 'monthly':
      return HISTORY_DATA.rankHistory;
    default:
      return HISTORY_DATA.rankHistory;
  }
};

export const getTrendAnalysis = (userId = 'current') => {
  const history = HISTORY_DATA.rankHistory;
  if (history.length < 2) return { trend: 'insufficient_data', change: 0 };

  const recent = history.slice(-4);
  const older = history.slice(-8, -4);
  
  const recentAvg = recent.reduce((sum, item) => sum + item.rank, 0) / recent.length;
  const olderAvg = older.reduce((sum, item) => sum + item.rank, 0) / older.length;
  
  const change = olderAvg - recentAvg;
  let trend = 'stable';
  
  if (change > 3) trend = 'improving';
  else if (change < -3) trend = 'declining';
  
  return { trend, change: Math.round(change) };
};

export const getCompetitorComparison = () => {
  const currentHistory = HISTORY_DATA.rankHistory;
  const currentUserRank = currentHistory[currentHistory.length - 1].rank;
  
  const comparisons = [];
  
  Object.entries(HISTORY_DATA.competitorTrends).forEach(([userId, history]) => {
    const competitorRank = history[history.length - 1].rank;
    const gap = currentUserRank - competitorRank;
    
    comparisons.push({
      userId,
      gap,
      trend: gap < 0 ? 'ahead' : 'behind',
      gapSize: Math.abs(gap),
    });
  });
  
  return comparisons.sort((a, b) => a.gap - b.gap);
};

export const getMilestones = () => {
  return HISTORY_DATA.milestones.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getPredictions = (timeframe = 'nextMonth') => {
  return HISTORY_DATA.predictions[timeframe];
};

export const calculateGrowthRate = (metric = 'rank') => {
  const history = HISTORY_DATA.rankHistory;
  if (history.length < 2) return 0;
  
  const first = history[0];
  const last = history[history.length - 1];
  
  if (metric === 'rank') {
    return ((first.rank - last.rank) / first.rank) * 100;
  } else if (metric === 'points') {
    return ((last.points - first.points) / first.points) * 100;
  }
  
  return 0;
};

export const getBestStreak = () => {
  const weeklyTrends = HISTORY_DATA.weeklyTrends;
  let bestStreak = 0;
  let currentStreak = 0;
  
  for (let i = 1; i < weeklyTrends.length; i++) {
    const change = weeklyTrends[i].change;
    if (change < 0) { // rank improved (lower number is better)
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  return bestStreak;
};

export const getPerformanceInsights = () => {
  const trendAnalysis = getTrendAnalysis();
  const growthRate = calculateGrowthRate('rank');
  const bestStreak = getBestStreak();
  const competitorComparison = getCompetitorComparison();
  
  const insights = [];
  
  if (trendAnalysis.trend === 'improving') {
    insights.push({
      type: 'positive',
      title: 'Strong Momentum',
      description: `You've improved ${trendAnalysis.change} ranks recently`,
    });
  }
  
  if (growthRate > 50) {
    insights.push({
      type: 'positive',
      title: 'Excellent Growth',
      description: `Your rank has improved by ${Math.round(growthRate)}% overall`,
    });
  }
  
  if (bestStreak > 4) {
    insights.push({
      type: 'positive',
      title: 'Consistent Performer',
      description: `Best streak: ${bestStreak} weeks of improvement`,
    });
  }
  
  const closeCompetitors = competitorComparison.filter(c => c.gapSize <= 3);
  if (closeCompetitors.length > 0) {
    insights.push({
      type: 'warning',
      title: 'Close Competition',
      description: `${closeCompetitors.length} competitors within 3 ranks`,
    });
  }
  
  return insights;
};
