// Blockchain-based achievement verification service
export const BLOCKCHAIN_DATA = {
  network: {
    name: 'CIPSS Chain',
    type: 'private',
    consensus: 'Proof of Impact',
    blockTime: 15, // seconds
    gasPrice: 0.001, // CIPSS tokens
    nativeToken: 'CIPSS',
    explorerUrl: 'https://explorer.cipss.io',
  },
  contracts: {
    achievement: {
      address: '0x1234567890123456789012345678901234567890',
      abi: 'AchievementRegistry',
      deployedAt: '2024-01-15T00:00:00Z',
      version: '1.0.0',
    },
    identity: {
      address: '0x2345678901234567890123456789012345678901',
      abi: 'IdentityRegistry',
      deployedAt: '2024-01-15T00:00:00Z',
      version: '1.0.0',
    },
    reputation: {
      address: '0x3456789012345678901234567890123456789012',
      abi: 'ReputationSystem',
      deployedAt: '2024-01-15T00:00:00Z',
      version: '1.0.0',
    },
  },
  achievements: [
    {
      id: 'achievement_blockchain_1',
      userId: 'user_1',
      type: 'volunteer_hours',
      title: '100 Hours Champion',
      description: 'Completed 100+ volunteer hours',
      metadata: {
        hours: 125,
        organization: 'Education First NGO',
        campaign: 'Teaching Excellence Program',
        date: '2024-04-20T00:00:00Z',
        impactScore: 85,
      },
      transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      blockNumber: 1234567,
      timestamp: '2024-04-20T10:30:00Z',
      verified: true,
      verifications: 12,
      reputationScore: 95,
      nftTokenId: '0x12345678-1234-1234-1234-123456789012',
      isPublic: true,
      isTransferable: false,
    },
    {
      id: 'achievement_blockchain_2',
      userId: 'user_1',
      type: 'leadership',
      title: 'Team Leader Excellence',
      description: 'Led team of 10+ volunteers successfully',
      metadata: {
        teamSize: 12,
        projectDuration: '3 months',
        projectImpact: 450,
        leadershipScore: 92,
        feedbackRating: 4.8,
      },
      transactionHash: '0xbcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      blockNumber: 1234568,
      timestamp: '2024-04-18T14:20:00Z',
      verified: true,
      verifications: 8,
      reputationScore: 88,
      nftTokenId: '0x23456789-1234-1234-1234-123456789012',
      isPublic: true,
      isTransferable: false,
    },
    {
      id: 'achievement_blockchain_3',
      userId: 'user_2',
      type: 'learning',
      title: 'Environmental Champion',
      description: 'Completed Environmental Conservation learning path',
      metadata: {
        learningPath: 'Environmental Conservation',
        coursesCompleted: 4,
        averageScore: 94,
        certificateIssued: true,
        skillsAcquired: ['Conservation', 'Sustainability', 'Community Engagement'],
      },
      transactionHash: '0xcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      blockNumber: 1234569,
      timestamp: '2024-04-15T09:15:00Z',
      verified: true,
      verifications: 15,
      reputationScore: 91,
      nftTokenId: '0x34567890-1234-1234-1234-123456789012',
      isPublic: true,
      isTransferable: true,
    },
  ],
  verifications: [
    {
      id: 'verification_1',
      achievementId: 'achievement_blockchain_1',
      verifierId: 'org_1',
      verifierName: 'Education First NGO',
      verifierType: 'organization',
      timestamp: '2024-04-20T10:35:00Z',
      transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      verified: true,
      signature: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      comments: 'Verified volunteer hours and impact contribution',
    },
    {
      id: 'verification_2',
      achievementId: 'achievement_blockchain_1',
      verifierId: 'user_2',
      verifierName: 'Rahul Kumar',
      verifierType: 'peer',
      timestamp: '2024-04-20T11:00:00Z',
      transactionHash: '0x234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      verified: true,
      signature: '0xbcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      comments: 'Can confirm excellent volunteer work',
    },
  ],
  nftMetadata: {
    '0x12345678-1234-1234-1234-123456789012': {
      name: '100 Hours Champion',
      description: 'NFT representing completion of 100+ volunteer hours',
      image: 'https://nft.cipss.io/achievements/100-hours.png',
      attributes: [
        { trait_type: 'Type', value: 'Volunteer Hours' },
        { trait_type: 'Hours', value: 125 },
        { trait_type: 'Organization', value: 'Education First NGO' },
        { trait_type: 'Impact Score', value: 85 },
        { trait_type: 'Rarity', value: 'Rare' },
      ],
      external_url: 'https://cipss.io/achievements/achievement_blockchain_1',
    },
    '0x23456789-1234-1234-1234-123456789012': {
      name: 'Team Leader Excellence',
      description: 'NFT representing exceptional leadership in volunteer projects',
      image: 'https://nft.cipss.io/achievements/team-leader.png',
      attributes: [
        { trait_type: 'Type', value: 'Leadership' },
        { trait_type: 'Team Size', value: 12 },
        { trait_type: 'Project Duration', value: '3 months' },
        { trait_type: 'Leadership Score', value: 92 },
        { trait_type: 'Rarity', value: 'Epic' },
      ],
      external_url: 'https://cipss.io/achievements/achievement_blockchain_2',
    },
  },
  wallet: {
    address: '0x1234567890123456789012345678901234567890',
    balance: 1250.50, // CIPSS tokens
    nonce: 42,
    connected: true,
    networkId: 1337, // CIPSS Chain ID
  },
  settings: {
    autoVerify: true,
    publicByDefault: true,
    transferableAchievements: false,
    gasOptimization: true,
    notificationThreshold: 5, // minimum verifications
    reputationWeight: 0.7, // weight of reputation in scoring
    verificationReward: 10, // CIPSS tokens for verification
  },
  stats: {
    totalAchievements: 156,
    totalVerifications: 892,
    averageReputationScore: 87.5,
    totalNFTsMinted: 156,
    gasUsed: 125000, // total gas used
    averageVerificationTime: 2.3, // minutes
    mostVerifiedType: 'volunteer_hours',
  },
};

export const getBlockchainNetwork = () => {
  return BLOCKCHAIN_DATA.network;
};

export const getWalletInfo = () => {
  return BLOCKCHAIN_DATA.wallet;
};

export const connectWallet = () => {
  // Simulate wallet connection
  BLOCKCHAIN_DATA.wallet.connected = true;
  BLOCKCHAIN_DATA.wallet.address = '0x1234567890123456789012345678901234567890';
  BLOCKCHAIN_DATA.wallet.balance = 1250.50;
  
  return {
    success: true,
    address: BLOCKCHAIN_DATA.wallet.address,
    network: BLOCKCHAIN_DATA.network.name,
  };
};

export const disconnectWallet = () => {
  BLOCKCHAIN_DATA.wallet.connected = false;
  BLOCKCHAIN_DATA.wallet.address = null;
  
  return { success: true };
};

export const getBlockchainAchievements = (userId = null) => {
  let achievements = BLOCKCHAIN_DATA.achievements;
  
  if (userId) {
    achievements = achievements.filter(a => a.userId === userId);
  }
  
  return achievements.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const getAchievementById = (id) => {
  return BLOCKCHAIN_DATA.achievements.find(a => a.id === id);
};

export const mintAchievementNFT = (achievementData) => {
  const nftTokenId = generateNFTTokenId();
  
  const blockchainAchievement = {
    id: `achievement_blockchain_${Date.now()}`,
    userId: achievementData.userId,
    type: achievementData.type,
    title: achievementData.title,
    description: achievementData.description,
    metadata: achievementData.metadata,
    transactionHash: generateTransactionHash(),
    blockNumber: BLOCKCHAIN_DATA.stats.totalAchievements + 1234567,
    timestamp: new Date().toISOString(),
    verified: false,
    verifications: 0,
    reputationScore: calculateInitialReputation(achievementData),
    nftTokenId,
    isPublic: BLOCKCHAIN_DATA.settings.publicByDefault,
    isTransferable: BLOCKCHAIN_DATA.settings.transferableAchievements,
  };
  
  BLOCKCHAIN_DATA.achievements.push(blockchainAchievement);
  
  // Create NFT metadata
  BLOCKCHAIN_DATA.nftMetadata[nftTokenId] = {
    name: achievementData.title,
    description: achievementData.description,
    image: `https://nft.cipss.io/achievements/${nftTokenId}.png`,
    attributes: [
      { trait_type: 'Type', value: achievementData.type },
      { trait_type: 'Rarity', value: calculateRarity(achievementData) },
      ...Object.entries(achievementData.metadata).map(([key, value]) => ({
        trait_type: key.charAt(0).toUpperCase() + key.slice(1),
        value: typeof value === 'object' ? JSON.stringify(value) : value,
      })),
    ],
    external_url: `https://cipss.io/achievements/${blockchainAchievement.id}`,
  };
  
  // Update stats
  BLOCKCHAIN_DATA.stats.totalAchievements += 1;
  BLOCKCHAIN_DATA.stats.totalNFTsMinted += 1;
  
  return {
    success: true,
    achievement: blockchainAchievement,
    nftTokenId,
    transactionHash: blockchainAchievement.transactionHash,
  };
};

export const verifyAchievement = (achievementId, verifierId, verifierName, verifierType, comments = '') => {
  const achievement = getAchievementById(achievementId);
  if (!achievement) {
    return { success: false, message: 'Achievement not found' };
  }
  
  // Check if already verified by this verifier
  const existingVerification = BLOCKCHAIN_DATA.verifications.find(
    v => v.achievementId === achievementId && v.verifierId === verifierId
  );
  
  if (existingVerification) {
    return { success: false, message: 'Already verified by this verifier' };
  }
  
  const verification = {
    id: `verification_${Date.now()}`,
    achievementId,
    verifierId,
    verifierName,
    verifierType,
    timestamp: new Date().toISOString(),
    transactionHash: generateTransactionHash(),
    verified: true,
    signature: generateSignature(),
    comments,
  };
  
  BLOCKCHAIN_DATA.verifications.push(verification);
  
  // Update achievement
  achievement.verifications += 1;
  achievement.verified = achievement.verifications >= BLOCKCHAIN_DATA.settings.notificationThreshold;
  
  // Update reputation score
  achievement.reputationScore = calculateUpdatedReputation(achievement, verification);
  
  // Reward verifier
  if (BLOCKCHAIN_DATA.wallet.connected) {
    BLOCKCHAIN_DATA.wallet.balance += BLOCKCHAIN_DATA.settings.verificationReward;
  }
  
  // Update stats
  BLOCKCHAIN_DATA.stats.totalVerifications += 1;
  
  return {
    success: true,
    verification,
    newReputationScore: achievement.reputationScore,
    reward: BLOCKCHAIN_DATA.settings.verificationReward,
  };
};

export const getAchievementVerifications = (achievementId) => {
  return BLOCKCHAIN_DATA.verifications.filter(v => v.achievementId === achievementId);
};

export const getNFTMetadata = (tokenId) => {
  return BLOCKCHAIN_DATA.nftMetadata[tokenId];
};

export const transferNFT = (tokenId, fromAddress, toAddress) => {
  const achievement = BLOCKCHAIN_DATA.achievements.find(a => a.nftTokenId === tokenId);
  
  if (!achievement) {
    return { success: false, message: 'NFT not found' };
  }
  
  if (!achievement.isTransferable) {
    return { success: false, message: 'NFT is not transferable' };
  }
  
  // Simulate NFT transfer
  const transferTransaction = {
    hash: generateTransactionHash(),
    from: fromAddress,
    to: toAddress,
    tokenId,
    timestamp: new Date().toISOString(),
    blockNumber: BLOCKCHAIN_DATA.stats.totalAchievements + 1234567,
  };
  
  return {
    success: true,
    transaction: transferTransaction,
    message: 'NFT transferred successfully',
  };
};

export const getReputationScore = (userId) => {
  const userAchievements = getBlockchainAchievements(userId);
  
  if (userAchievements.length === 0) {
    return 0;
  }
  
  const totalScore = userAchievements.reduce((sum, achievement) => sum + achievement.reputationScore, 0);
  return Math.round(totalScore / userAchievements.length);
};

export const getBlockchainSettings = () => {
  return BLOCKCHAIN_DATA.settings;
};

export const updateBlockchainSettings = (updates) => {
  BLOCKCHAIN_DATA.settings = { ...BLOCKCHAIN_DATA.settings, ...updates };
  return { success: true, settings: BLOCKCHAIN_DATA.settings };
};

export const getBlockchainStats = () => {
  return BLOCKCHAIN_DATA.stats;
};

export const getTransactionDetails = (transactionHash) => {
  // Simulate transaction lookup
  return {
    hash: transactionHash,
    blockNumber: 1234567,
    timestamp: new Date().toISOString(),
    status: 'confirmed',
    gasUsed: 21000,
    gasPrice: BLOCKCHAIN_DATA.network.gasPrice,
    from: BLOCKCHAIN_DATA.wallet.address,
    to: BLOCKCHAIN_DATA.contracts.achievement.address,
    value: 0,
    confirmations: 12,
  };
};

export const validateAchievementIntegrity = (achievementId) => {
  const achievement = getAchievementById(achievementId);
  if (!achievement) {
    return { success: false, message: 'Achievement not found' };
  }
  
  // Simulate blockchain integrity check
  const isValid = achievement.transactionHash && achievement.blockNumber;
  
  return {
    success: true,
    isValid,
    transactionHash: achievement.transactionHash,
    blockNumber: achievement.blockNumber,
    timestamp: achievement.timestamp,
    verifications: achievement.verifications,
  };
};

export const generateVerificationReport = (achievementId) => {
  const achievement = getAchievementById(achievementId);
  const verifications = getAchievementVerifications(achievementId);
  
  if (!achievement) {
    return { success: false, message: 'Achievement not found' };
  }
  
  const report = {
    achievementId,
    achievementTitle: achievement.title,
    achievementType: achievement.type,
    reputationScore: achievement.reputationScore,
    totalVerifications: verifications.length,
    verificationBreakdown: {
      organizations: verifications.filter(v => v.verifierType === 'organization').length,
      peers: verifications.filter(v => v.verifierType === 'peer').length,
      system: verifications.filter(v => v.verifierType === 'system').length,
    },
    verificationTimeline: verifications.map(v => ({
      verifier: v.verifierName,
      type: v.verifierType,
      timestamp: v.timestamp,
      comments: v.comments,
    })),
    blockchainProof: {
      transactionHash: achievement.transactionHash,
      blockNumber: achievement.blockNumber,
      timestamp: achievement.timestamp,
      nftTokenId: achievement.nftTokenId,
    },
    generatedAt: new Date().toISOString(),
  };
  
  return { success: true, report };
};

// Helper functions
const generateNFTTokenId = () => {
  return '0x' + Math.random().toString(36).substr(2, 8) + '-' +
         Math.random().toString(36).substr(2, 4) + '-' +
         Math.random().toString(36).substr(2, 4) + '-' +
         Math.random().toString(36).substr(2, 4) + '-' +
         Math.random().toString(36).substr(2, 12);
};

const generateTransactionHash = () => {
  return '0x' + Array(64).fill(0).map(() => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

const generateSignature = () => {
  return '0x' + Array(132).fill(0).map(() => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

const calculateInitialReputation = (achievementData) => {
  let baseScore = 50;
  
  // Add points based on achievement type
  const typeScores = {
    volunteer_hours: 30,
    leadership: 25,
    learning: 20,
    impact: 35,
    community: 15,
  };
  
  baseScore += typeScores[achievementData.type] || 10;
  
  // Add points based on metadata
  if (achievementData.metadata.impactScore) {
    baseScore += Math.min(20, achievementData.metadata.impactScore / 5);
  }
  
  if (achievementData.metadata.hours) {
    baseScore += Math.min(15, achievementData.metadata.hours / 10);
  }
  
  return Math.min(100, Math.round(baseScore));
};

const calculateUpdatedReputation = (achievement, newVerification) => {
  const verifierWeights = {
    organization: 0.8,
    peer: 0.6,
    system: 1.0,
  };
  
  const weight = verifierWeights[newVerification.verifierType] || 0.5;
  const currentScore = achievement.reputationScore;
  
  // Weighted average calculation
  const totalWeight = achievement.verifications * 0.7 + weight;
  const weightedScore = (currentScore * (achievement.verifications - 1) * 0.7 + 100 * weight) / totalWeight;
  
  return Math.min(100, Math.round(weightedScore));
};

const calculateRarity = (achievementData) => {
  const rarityScores = {
    volunteer_hours: achievementData.metadata.hours > 100 ? 'Rare' : 'Common',
    leadership: achievementData.metadata.teamSize > 10 ? 'Epic' : 'Rare',
    learning: achievementData.metadata.averageScore > 90 ? 'Rare' : 'Common',
    impact: achievementData.metadata.impactScore > 80 ? 'Epic' : 'Rare',
  };
  
  return rarityScores[achievementData.type] || 'Common';
};
