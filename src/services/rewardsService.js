// Rewards and redemption system
export const REWARDS_DATA = {
  userCoins: 2500,
  userPoints: 1100,
  rewards: [
    {
      id: 'reward_1',
      name: 'Eco Warrior Badge',
      description: 'Special environmental achievement badge',
      category: 'badges',
      cost: 500,
      type: 'badge',
      icon: '🌱',
      rarity: 'common',
      available: true,
      claimed: false,
      requirements: { minLevel: 'Bronze', domain: 'environment' },
    },
    {
      id: 'reward_2',
      name: 'Double Points Power-Up',
      description: '2x points for next 5 campaigns',
      category: 'powerups',
      cost: 800,
      type: 'powerup',
      icon: '⚡',
      rarity: 'rare',
      available: true,
      claimed: false,
      requirements: { minLevel: 'Silver' },
    },
    {
      id: 'reward_3',
      name: 'Mentor Session',
      description: '1-hour session with top mentor',
      category: 'experiences',
      cost: 1200,
      type: 'experience',
      icon: '🤝',
      rarity: 'epic',
      available: true,
      claimed: false,
      requirements: { minLevel: 'Gold' },
    },
    {
      id: 'reward_4',
      name: 'Volunteer T-Shirt',
      description: 'Exclusive volunteer program t-shirt',
      category: 'merchandise',
      cost: 1500,
      type: 'physical',
      icon: '👕',
      rarity: 'common',
      available: true,
      claimed: false,
      requirements: {},
    },
    {
      id: 'reward_5',
      name: 'Streak Shield',
      description: 'Protect your streak for 7 days',
      category: 'powerups',
      cost: 600,
      type: 'powerup',
      icon: '🛡️',
      rarity: 'uncommon',
      available: true,
      claimed: false,
      requirements: { minStreak: 7 },
    },
    {
      id: 'reward_6',
      name: 'Team Boost',
      description: '+500 points for your entire team',
      category: 'team',
      cost: 1000,
      type: 'team',
      icon: '🚀',
      rarity: 'rare',
      available: true,
      claimed: false,
      requirements: { hasTeam: true },
    },
    {
      id: 'reward_7',
      name: 'Profile Customization',
      description: 'Custom banner and profile theme',
      category: 'customization',
      cost: 300,
      type: 'digital',
      icon: '🎨',
      rarity: 'common',
      available: true,
      claimed: false,
      requirements: {},
    },
    {
      id: 'reward_8',
      name: 'Priority Support',
      description: 'Get priority help for 1 month',
      category: 'premium',
      cost: 2000,
      type: 'premium',
      icon: '⭐',
      rarity: 'legendary',
      available: true,
      claimed: false,
      requirements: { minLevel: 'Platinum' },
    },
  ],
  categories: [
    { key: 'badges', name: 'Badges', icon: '🏆', color: '#F59E0B' },
    { key: 'powerups', name: 'Power-Ups', icon: '⚡', color: '#8B5CF6' },
    { key: 'experiences', name: 'Experiences', icon: '🎯', color: '#3B82F6' },
    { key: 'merchandise', name: 'Merchandise', icon: '🛍️', color: '#EC4899' },
    { key: 'team', name: 'Team', icon: '👥', color: '#10B981' },
    { key: 'customization', name: 'Customization', icon: '🎨', color: '#F97316' },
    { key: 'premium', name: 'Premium', icon: '💎', color: '#6366F1' },
  ],
  redemptionHistory: [
    {
      id: 'redemption_1',
      rewardId: 'reward_1',
      rewardName: 'Eco Warrior Badge',
      cost: 500,
      date: '2024-04-15',
      status: 'completed',
      type: 'badge',
    },
    {
      id: 'redemption_2',
      rewardId: 'reward_5',
      rewardName: 'Streak Shield',
      cost: 600,
      date: '2024-04-10',
      status: 'active',
      type: 'powerup',
    },
  ],
  dailyBonus: {
    lastClaimed: '2024-04-19',
    streak: 3,
    nextBonus: 50,
  },
  achievements: [
    { id: 'ach_1', name: 'First Redemption', description: 'Claim your first reward', coins: 100, unlocked: true },
    { id: 'ach_2', name: 'Collector', description: 'Claim 10 rewards', coins: 500, unlocked: false },
    { id: 'ach_3', name: 'Big Spender', description: 'Spend 5000 coins', coins: 1000, unlocked: false },
  ],
};

export const getUserCoins = () => {
  return REWARDS_DATA.userCoins;
};

export const getUserPoints = () => {
  return REWARDS_DATA.userPoints;
};

export const updateUserCoins = (amount) => {
  REWARDS_DATA.userCoins += amount;
  return REWARDS_DATA.userCoins;
};

export const getRewards = (category = null) => {
  if (category) {
    return REWARDS_DATA.rewards.filter(reward => reward.category === category);
  }
  return REWARDS_DATA.rewards;
};

export const getRewardById = (rewardId) => {
  return REWARDS_DATA.rewards.find(reward => reward.id === rewardId);
};

export const getCategories = () => {
  return REWARDS_DATA.categories;
};

export const claimReward = (rewardId) => {
  const reward = getRewardById(rewardId);
  if (!reward) {
    return { success: false, message: 'Reward not found' };
  }

  if (!reward.available) {
    return { success: false, message: 'Reward not available' };
  }

  if (reward.claimed) {
    return { success: false, message: 'Reward already claimed' };
  }

  const userCoins = getUserCoins();
  if (userCoins < reward.cost) {
    return { success: false, message: 'Insufficient coins' };
  }

  // Check requirements
  if (reward.requirements.minLevel) {
    // This would check user level in a real app
    // For demo, we'll assume user meets requirements
  }

  // Deduct coins and claim reward
  updateUserCoins(-reward.cost);
  reward.claimed = true;
  reward.available = false;

  // Add to redemption history
  const redemption = {
    id: `redemption_${Date.now()}`,
    rewardId: reward.id,
    rewardName: reward.name,
    cost: reward.cost,
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    type: reward.type,
  };

  REWARDS_DATA.redemptionHistory.unshift(redemption);

  return { 
    success: true, 
    message: `Successfully claimed ${reward.name}!`,
    redemption,
    newBalance: getUserCoins()
  };
};

export const getRedemptionHistory = () => {
  return REWARDS_DATA.redemptionHistory;
};

export const getDailyBonus = () => {
  const today = new Date().toISOString().split('T')[0];
  const lastClaimed = REWARDS_DATA.dailyBonus.lastClaimed;
  
  if (lastClaimed === today) {
    return { 
      available: false, 
      message: 'Daily bonus already claimed',
      nextBonus: REWARDS_DATA.dailyBonus.nextBonus
    };
  }

  // Check if streak is broken (missed a day)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (lastClaimed !== yesterdayStr) {
    REWARDS_DATA.dailyBonus.streak = 0;
  }

  REWARDS_DATA.dailyBonus.streak += 1;
  const bonusAmount = 50 * REWARDS_DATA.dailyBonus.streak;
  
  return {
    available: true,
    bonusAmount,
    streak: REWARDS_DATA.dailyBonus.streak,
  };
};

export const claimDailyBonus = () => {
  const bonusInfo = getDailyBonus();
  
  if (!bonusInfo.available) {
    return { success: false, message: bonusInfo.message };
  }

  updateUserCoins(bonusInfo.bonusAmount);
  REWARDS_DATA.dailyBonus.lastClaimed = new Date().toISOString().split('T')[0];
  
  return {
    success: true,
    message: `Claimed ${bonusInfo.bonusAmount} coins!`,
    bonusAmount: bonusInfo.bonusAmount,
    streak: bonusInfo.streak,
    newBalance: getUserCoins()
  };
};

export const getRewardsByRarity = (rarity) => {
  return REWARDS_DATA.rewards.filter(reward => reward.rarity === rarity);
};

export const getAffordableRewards = () => {
  const userCoins = getUserCoins();
  return REWARDS_DATA.rewards.filter(reward => 
    reward.available && !reward.claimed && reward.cost <= userCoins
  );
};

export const searchRewards = (query) => {
  const lowerQuery = query.toLowerCase();
  return REWARDS_DATA.rewards.filter(reward =>
    reward.name.toLowerCase().includes(lowerQuery) ||
    reward.description.toLowerCase().includes(lowerQuery)
  );
};

export const getRewardStats = () => {
  const totalRewards = REWARDS_DATA.rewards.length;
  const claimedRewards = REWARDS_DATA.rewards.filter(r => r.claimed).length;
  const availableRewards = REWARDS_DATA.rewards.filter(r => r.available && !r.claimed).length;
  const totalSpent = REWARDS_DATA.redemptionHistory.reduce((sum, r) => sum + r.cost, 0);
  
  return {
    totalRewards,
    claimedRewards,
    availableRewards,
    totalSpent,
    userCoins: getUserCoins(),
    userPoints: getUserPoints(),
  };
};

export const getAchievements = () => {
  return REWARDS_DATA.achievements;
};

export const unlockAchievement = (achievementId) => {
  const achievement = REWARDS_DATA.achievements.find(a => a.id === achievementId);
  if (achievement && !achievement.unlocked) {
    achievement.unlocked = true;
    updateUserCoins(achievement.coins);
    return { success: true, coins: achievement.coins };
  }
  return { success: false };
};

export const getRarityColor = (rarity) => {
  switch (rarity) {
    case 'common': return '#6B7280';
    case 'uncommon': return '#22C55E';
    case 'rare': return '#3B82F6';
    case 'epic': return '#8B5CF6';
    case 'legendary': return '#F59E0B';
    default: return '#6B7280';
  }
};
