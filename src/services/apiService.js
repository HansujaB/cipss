// Leaderboard API service for integrations
export const API_CONFIG = {
  baseUrl: 'https://api.leaderboard.cipss.com',
  version: 'v1',
  endpoints: {
    leaderboard: '/leaderboard',
    users: '/users',
    teams: '/teams',
    campaigns: '/campaigns',
    achievements: '/achievements',
    analytics: '/analytics',
    webhooks: '/webhooks',
  },
  rateLimits: {
    requestsPerMinute: 100,
    requestsPerHour: 1000,
    requestsPerDay: 10000,
  },
};

export const API_KEYS = {
  development: 'dev_key_1234567890abcdef',
  staging: 'staging_key_1234567890abcdef',
  production: 'prod_key_1234567890abcdef',
};

export const WEBHOOK_EVENTS = [
  'user.rank_changed',
  'user.achievement_unlocked',
  'user.streak_milestone',
  'team.rank_changed',
  'campaign.completed',
  'campaign.started',
  'reward.claimed',
  'mentorship.session_scheduled',
];

export const INTEGRATION_DATA = {
  activeIntegrations: [
    {
      id: 'integration_1',
      name: 'Corporate Partner Portal',
      type: 'webhook',
      status: 'active',
      apiKey: 'cp_1234567890abcdef',
      events: ['user.rank_changed', 'user.achievement_unlocked'],
      created: '2024-03-15',
      lastActivity: '2024-04-20',
    },
    {
      id: 'integration_2',
      name: 'School Dashboard',
      type: 'api',
      status: 'active',
      apiKey: 'school_1234567890abcdef',
      endpoints: ['/leaderboard', '/users', '/teams'],
      created: '2024-04-01',
      lastActivity: '2024-04-19',
    },
    {
      id: 'integration_3',
      name: 'NGO Analytics',
      type: 'webhook',
      status: 'inactive',
      apiKey: 'ngo_1234567890abcdef',
      events: ['campaign.completed', 'campaign.started'],
      created: '2024-02-20',
      lastActivity: '2024-04-10',
    },
  ],
  apiUsage: {
    current: {
      requests: 245,
      bandwidth: '12.3 MB',
      errors: 2,
    },
    limits: {
      requestsPerMinute: 100,
      requestsPerHour: 1000,
      requestsPerDay: 10000,
      bandwidthPerDay: '1 GB',
    },
    history: [
      { date: '2024-04-20', requests: 320, bandwidth: '15.2 MB', errors: 1 },
      { date: '2024-04-19', requests: 280, bandwidth: '13.8 MB', errors: 3 },
      { date: '2024-04-18', requests: 195, bandwidth: '9.4 MB', errors: 0 },
      { date: '2024-04-17', requests: 410, bandwidth: '18.7 MB', errors: 2 },
    ],
  },
  webhookLogs: [
    {
      id: 'webhook_1',
      integrationId: 'integration_1',
      event: 'user.rank_changed',
      url: 'https://partner.example.com/webhook',
      status: 'delivered',
      attempts: 1,
      timestamp: '2024-04-20T14:30:00',
      responseTime: '245ms',
    },
    {
      id: 'webhook_2',
      integrationId: 'integration_2',
      event: 'user.achievement_unlocked',
      url: 'https://partner.example.com/webhook',
      status: 'failed',
      attempts: 3,
      timestamp: '2024-04-20T13:15:00',
      error: 'Connection timeout',
    },
  ],
};

// API Endpoints
export const getLeaderboard = async (params = {}) => {
  const {
    type = 'volunteers',
    limit = 50,
    offset = 0,
    domain = null,
    timeframe = 'all',
  } = params;

  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          leaderboard: generateMockLeaderboard(type, limit, offset),
          pagination: {
            total: 100,
            limit,
            offset,
            hasMore: offset + limit < 100,
          },
          filters: { type, domain, timeframe },
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      });
    }, 100);
  });
};

export const getUserProfile = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          user: generateMockUser(userId),
          stats: generateMockUserStats(userId),
          achievements: generateMockAchievements(userId),
          history: generateMockUserHistory(userId),
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      });
    }, 150);
  });
};

export const getTeamLeaderboard = async (params = {}) => {
  const { limit = 20, offset = 0 } = params;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          leaderboard: generateMockTeamLeaderboard(limit, offset),
          pagination: {
            total: 50,
            limit,
            offset,
            hasMore: offset + limit < 50,
          },
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      });
    }, 120);
  });
};

export const getAnalytics = async (params = {}) => {
  const { 
    type = 'overview',
    startDate = '2024-01-01',
    endDate = '2024-04-20',
    granularity = 'monthly'
  } = params;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: generateMockAnalytics(type, startDate, endDate, granularity),
        meta: {
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      });
    }, 200);
  });
};

export const createWebhook = async (webhookData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          webhook: {
            id: `webhook_${Date.now()}`,
            ...webhookData,
            status: 'active',
            created: new Date().toISOString(),
          },
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      });
    }, 150);
  });
};

export const testWebhook = async (webhookId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      resolve({
        success: true,
        data: {
          webhookId,
          testResult: {
            status: success ? 'delivered' : 'failed',
            responseTime: success ? `${Math.floor(Math.random() * 500)}ms` : null,
            error: success ? null : 'Connection timeout',
          },
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      });
    }, 300);
  });
};

export const getApiUsage = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: INTEGRATION_DATA.apiUsage,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      });
    }, 100);
  });
};

export const getIntegrations = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          integrations: INTEGRATION_DATA.activeIntegrations,
          total: INTEGRATION_DATA.activeIntegrations.length,
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      });
    }, 120);
  });
};

export const createApiKey = async (name, permissions = []) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          apiKey: {
            id: `key_${Date.now()}`,
            name,
            key: generateApiKey(),
            permissions,
            status: 'active',
            created: new Date().toISOString(),
            lastUsed: null,
          },
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      });
    }, 150);
  });
};

export const revokeApiKey = async (apiKeyId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          apiKeyId,
          status: 'revoked',
          revokedAt: new Date().toISOString(),
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      });
    }, 100);
  });
};

// Helper functions
const generateRequestId = () => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const generateApiKey = () => {
  return `key_${Math.random().toString(36).substr(2, 16)}${Math.random().toString(36).substr(2, 16)}`;
};

const generateMockLeaderboard = (type, limit, offset) => {
  const users = [];
  for (let i = offset; i < offset + limit; i++) {
    users.push({
      id: `user_${i + 1}`,
      rank: i + 1,
      name: `User ${i + 1}`,
      points: Math.floor(Math.random() * 2000) + 100,
      campaigns: Math.floor(Math.random() * 20) + 1,
      hours: Math.floor(Math.random() * 200) + 10,
      badges: ['🌟', '💚', '🔥'].slice(0, Math.floor(Math.random() * 3) + 1),
    });
  }
  return users;
};

const generateMockUser = (userId) => ({
  id: userId,
  name: 'Demo User',
  email: 'demo@example.com',
  avatar: '👤',
  rank: 7,
  points: 1100,
  campaigns: 12,
  hours: 78,
  level: 'Bronze',
  badges: ['🌟', '💚', '🔥'],
  streak: 7,
  joined: '2024-01-15',
});

const generateMockUserStats = (userId) => ({
  totalPoints: 1100,
  weeklyPoints: 150,
  monthlyPoints: 450,
  totalCampaigns: 12,
  completedCampaigns: 10,
  totalHours: 78,
  averageHoursPerCampaign: 6.5,
  rankHistory: [
    { date: '2024-01-01', rank: 45 },
    { date: '2024-02-01', rank: 28 },
    { date: '2024-03-01', rank: 18 },
    { date: '2024-04-01', rank: 7 },
  ],
});

const generateMockAchievements = (userId) => [
  { id: 'ach_1', name: 'First Steps', description: 'Complete your first campaign', earned: '2024-01-20' },
  { id: 'ach_2', name: 'Week Warrior', description: '7-day streak achieved', earned: '2024-02-15' },
  { id: 'ach_3', name: 'Team Player', description: 'Join a team', earned: '2024-03-10' },
];

const generateMockUserHistory = (userId) => [
  { date: '2024-04-20', action: 'campaign_completed', details: 'Beach Cleanup Drive' },
  { date: '2024-04-18', action: 'achievement_unlocked', details: 'Eco Warrior Badge' },
  { date: '2024-04-15', action: 'rank_changed', details: 'Rank 8 → 7' },
];

const generateMockTeamLeaderboard = (limit, offset) => {
  const teams = [];
  for (let i = offset; i < offset + limit; i++) {
    teams.push({
      id: `team_${i + 1}`,
      rank: i + 1,
      name: `Team ${i + 1}`,
      points: Math.floor(Math.random() * 5000) + 500,
      members: Math.floor(Math.random() * 20) + 5,
      campaigns: Math.floor(Math.random() * 15) + 3,
      icon: '🏆',
    });
  }
  return teams;
};

const generateMockAnalytics = (type, startDate, endDate, granularity) => {
  switch (type) {
    case 'overview':
      return {
        totalUsers: 1250,
        activeUsers: 890,
        totalCampaigns: 45,
        completedCampaigns: 38,
        totalHours: 15670,
        averageEngagement: 78,
        growthRate: 15.3,
      };
    case 'engagement':
      return {
        dailyActiveUsers: [120, 135, 142, 128, 155, 148, 162],
        weeklyRetention: [85, 88, 82, 90, 87, 91, 89],
        campaignCompletionRate: 84.5,
        averageSessionDuration: 25, // minutes
      };
    case 'performance':
      return {
        apiResponseTime: '145ms',
        uptime: '99.9%',
        errorRate: 0.2,
        throughput: 1250, // requests per minute
      };
    default:
      return {};
  }
};

// Rate limiting
export const checkRateLimit = async (apiKey) => {
  // Simulate rate limit check
  return {
    allowed: true,
    remaining: 75,
    resetTime: new Date(Date.now() + 60000).toISOString(),
  };
};

// Webhook delivery
export const deliverWebhook = async (webhookUrl, event, data) => {
  // Simulate webhook delivery
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = Math.random() > 0.05; // 95% success rate
      resolve({
        success,
        responseTime: success ? Math.floor(Math.random() * 500) : null,
        error: success ? null : 'Delivery failed',
      });
    }, 200);
  });
};
