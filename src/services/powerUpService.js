// Power-ups and boosts system
export const POWER_UPS = {
  doublePoints: {
    id: 'double_points',
    name: 'Double Points',
    icon: '⚡',
    description: '2x points for next 3 campaigns',
    duration: 3,
    cost: 100,
    effect: 'multiplier',
    value: 2,
    category: 'points',
  },
  instantComplete: {
    id: 'instant_complete',
    name: 'Instant Complete',
    icon: '⏩',
    description: 'Complete any campaign instantly',
    duration: 1,
    cost: 200,
    effect: 'instant',
    value: 1,
    category: 'time',
  },
  shield: {
    id: 'shield',
    name: 'Streak Shield',
    icon: '🛡️',
    description: 'Protect your streak for 1 missed day',
    duration: 1,
    cost: 150,
    effect: 'protection',
    value: 1,
    category: 'streak',
  },
  boost: {
    id: 'boost',
    name: 'Rank Boost',
    icon: '🚀',
    description: 'Jump 5 ranks in leaderboard',
    duration: 1,
    cost: 300,
    effect: 'rank',
    value: 5,
    category: 'leaderboard',
  },
  magnet: {
    id: 'magnet',
    name: 'Point Magnet',
    icon: '🧲',
    description: 'Attract 50 bonus points instantly',
    duration: 1,
    cost: 80,
    effect: 'bonus',
    value: 50,
    category: 'points',
  },
  reveal: {
    id: 'reveal',
    name: 'Achievement Reveal',
    icon: '👁️',
    description: 'Reveal hidden achievement requirements',
    duration: 1,
    cost: 120,
    effect: 'reveal',
    value: 1,
    category: 'achievement',
  },
};

export const USER_POWER_UPS = {
  doublePoints: { owned: 2, active: false, expiresAt: null },
  instantComplete: { owned: 1, active: false, expiresAt: null },
  shield: { owned: 3, active: false, expiresAt: null },
  boost: { owned: 0, active: false, expiresAt: null },
  magnet: { owned: 5, active: false, expiresAt: null },
  reveal: { owned: 1, active: false, expiresAt: null },
};

export const USER_COINS = 750;

export const usePowerUp = (powerUpId, userPoints) => {
  const powerUp = POWER_UPS[powerUpId];
  const userPowerUp = USER_POWER_UPS[powerUpId];
  
  if (!powerUp || !userPowerUp || userPowerUp.owned <= 0) {
    return { success: false, message: 'Power-up not available' };
  }
  
  if (userPoints < powerUp.cost) {
    return { success: false, message: 'Insufficient points' };
  }
  
  // Activate power-up
  userPowerUp.owned -= 1;
  userPowerUp.active = true;
  
  // Set expiration
  if (powerUp.duration > 1) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + powerUp.duration);
    userPowerUp.expiresAt = expiresAt;
  } else {
    userPowerUp.expiresAt = new Date();
  }
  
  return { 
    success: true, 
    message: `${powerUp.name} activated!`,
    effect: powerUp.effect,
    value: powerUp.value,
  };
};

export const buyPowerUp = (powerUpId, userCoins) => {
  const powerUp = POWER_UPS[powerUpId];
  
  if (!powerUp) {
    return { success: false, message: 'Power-up not found' };
  }
  
  if (userCoins < powerUp.cost) {
    return { success: false, message: 'Insufficient coins' };
  }
  
  USER_POWER_UPS[powerUpId].owned += 1;
  
  return { 
    success: true, 
    message: `Purchased ${powerUp.name}!`,
    newBalance: userCoins - powerUp.cost,
  };
};

export const getActivePowerUps = () => {
  const active = [];
  const now = new Date();
  
  Object.keys(USER_POWER_UPS).forEach(key => {
    const powerUp = USER_POWER_UPS[key];
    if (powerUp.active && powerUp.expiresAt) {
      if (new Date(powerUp.expiresAt) > now) {
        active.push({
          ...POWER_UPS[key],
          expiresAt: powerUp.expiresAt,
        });
      } else {
        // Expired power-up
        powerUp.active = false;
        powerUp.expiresAt = null;
      }
    }
  });
  
  return active;
};

export const checkPowerUpEffect = (effectType, context = {}) => {
  const activePowerUps = getActivePowerUps();
  
  for (const powerUp of activePowerUps) {
    if (powerUp.effect === effectType) {
      switch (effectType) {
        case 'multiplier':
          return { active: true, multiplier: powerUp.value };
        case 'bonus':
          return { active: true, bonus: powerUp.value };
        case 'rank':
          return { active: true, rankBoost: powerUp.value };
        case 'protection':
          return { active: true, protected: true };
        case 'instant':
          return { active: true, instant: true };
        case 'reveal':
          return { active: true, revealed: true };
      }
    }
  }
  
  return { active: false };
};
