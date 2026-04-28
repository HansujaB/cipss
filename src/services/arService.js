// AR badges view service
export const AR_DATA = {
  badges: [
    {
      id: 'ar_badge_1',
      name: 'Environmental Champion',
      description: 'Awarded for exceptional dedication to environmental conservation',
      icon: '🌱',
      rarity: 'legendary',
      arModel: {
        type: '3d_model',
        url: 'https://ar-assets.cipss.com/models/environmental_champion.glb',
        scale: { x: 1.0, y: 1.0, z: 1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        animation: 'idle',
      },
      effects: {
        particles: [
          { type: 'leaves', color: '#22C55E', count: 50, duration: 3000 },
          { type: 'sparkles', color: '#F59E0B', count: 30, duration: 2000 },
        ],
        sound: 'achievement_legendary.mp3',
        lighting: {
          ambient: 0.6,
          directional: 0.8,
          color: '#FFFFFF',
        },
      },
      earned: true,
      earnedDate: '2024-04-15',
      viewCount: 15,
      shareCount: 3,
    },
    {
      id: 'ar_badge_2',
      name: 'Team Leadership',
      description: 'Recognizing outstanding team leadership and collaboration',
      icon: '👑',
      rarity: 'epic',
      arModel: {
        type: '3d_model',
        url: 'https://ar-assets.cipss.com/models/team_leadership.glb',
        scale: { x: 0.8, y: 0.8, z: 0.8 },
        rotation: { x: 0, y: 0, z: 0 },
        animation: 'crown_glow',
      },
      effects: {
        particles: [
          { type: 'stars', color: '#F59E0B', count: 40, duration: 2500 },
          { type: 'rays', color: '#8B5CF6', count: 20, duration: 3000 },
        ],
        sound: 'achievement_epic.mp3',
        lighting: {
          ambient: 0.7,
          directional: 0.9,
          color: '#FBBF24',
        },
      },
      earned: true,
      earnedDate: '2024-04-10',
      viewCount: 8,
      shareCount: 2,
    },
    {
      id: 'ar_badge_3',
      name: 'Campaign Hero',
      description: 'Hero of the Beach Cleanup Campaign',
      icon: '🌊',
      rarity: 'rare',
      arModel: {
        type: '3d_model',
        url: 'https://ar-assets.cipss.com/models/campaign_hero.glb',
        scale: { x: 1.2, y: 1.2, z: 1.2 },
        rotation: { x: 0, y: 0, z: 0 },
        animation: 'wave_motion',
      },
      effects: {
        particles: [
          { type: 'bubbles', color: '#3B82F6', count: 35, duration: 2000 },
          { type: 'water_splash', color: '#06B6D4', count: 25, duration: 1500 },
        ],
        sound: 'achievement_rare.mp3',
        lighting: {
          ambient: 0.5,
          directional: 0.7,
          color: '#60A5FA',
        },
      },
      earned: true,
      earnedDate: '2024-04-05',
      viewCount: 12,
      shareCount: 1,
    },
    {
      id: 'ar_badge_4',
      name: 'Volunteer Spirit',
      description: 'Exemplifying the true spirit of volunteerism',
      icon: '💚',
      rarity: 'common',
      arModel: {
        type: '3d_model',
        url: 'https://ar-assets.cipss.com/models/volunteer_spirit.glb',
        scale: { x: 0.9, y: 0.9, z: 0.9 },
        rotation: { x: 0, y: 0, z: 0 },
        animation: 'heartbeat',
      },
      effects: {
        particles: [
          { type: 'hearts', color: '#EF4444', count: 20, duration: 1800 },
        ],
        sound: 'achievement_common.mp3',
        lighting: {
          ambient: 0.6,
          directional: 0.6,
          color: '#FFFFFF',
        },
      },
      earned: true,
      earnedDate: '2024-03-28',
      viewCount: 6,
      shareCount: 0,
    },
  ],
  arSettings: {
    enabled: true,
    autoStartCamera: true,
    soundEnabled: true,
    hapticFeedback: true,
    quality: 'high', // low, medium, high
    trackingMode: 'world', // world, face, image
    environment: 'adaptive', // adaptive, indoor, outdoor
    maxDistance: 5.0, // meters
    showInstructions: true,
  },
  arStats: {
    totalViews: 41,
    totalShares: 6,
    averageViewDuration: 45, // seconds
    mostViewed: 'ar_badge_1',
    favoriteBadge: 'ar_badge_2',
    arSessions: 12,
    totalArTime: 540, // minutes
  },
  arFilters: [
    {
      id: 'filter_pride',
      name: 'Pride',
      description: 'Rainbow pride filter',
      colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
      intensity: 0.8,
    },
    {
      id: 'filter_golden',
      name: 'Golden',
      description: 'Golden glow effect',
      colors: ['#FFD700', '#FFA500'],
      intensity: 0.6,
    },
    {
      id: 'filter_nature',
      name: 'Nature',
      description: 'Green nature filter',
      colors: ['#22C55E', '#16A34A'],
      intensity: 0.7,
    },
  ],
  arBackgrounds: [
    {
      id: 'bg_space',
      name: 'Space',
      description: 'Starfield background',
      url: 'https://ar-assets.cipss.com/backgrounds/space.jpg',
      type: 'image',
    },
    {
      id: 'bg_beach',
      name: 'Beach',
      description: 'Sandy beach scene',
      url: 'https://ar-assets.cipss.com/backgrounds/beach.mp4',
      type: 'video',
    },
    {
      id: 'bg_forest',
      name: 'Forest',
      description: 'Lush forest environment',
      url: 'https://ar-assets.cipss.com/backgrounds/forest.mp4',
      type: 'video',
    },
  ],
};

export const getArBadges = (filters = {}) => {
  let badges = AR_DATA.badges;
  
  if (filters.earned !== undefined) {
    badges = badges.filter(b => b.earned === filters.earned);
  }
  
  if (filters.rarity) {
    badges = badges.filter(b => b.rarity === filters.rarity);
  }
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    badges = badges.filter(b => 
      b.name.toLowerCase().includes(search) ||
      b.description.toLowerCase().includes(search)
    );
  }
  
  return badges;
};

export const getArBadgeById = (id) => {
  return AR_DATA.badges.find(b => b.id === id);
};

export const getArSettings = () => {
  return AR_DATA.arSettings;
};

export const updateArSettings = (settings) => {
  AR_DATA.arSettings = { ...AR_DATA.arSettings, ...settings };
  return { success: true, settings: AR_DATA.arSettings };
};

export const getArStats = () => {
  return AR_DATA.arStats;
};

export const recordArView = (badgeId, duration) => {
  const badge = getArBadgeById(badgeId);
  if (!badge) {
    return { success: false, message: 'Badge not found' };
  }
  
  badge.viewCount += 1;
  AR_DATA.arStats.totalViews += 1;
  AR_DATA.arStats.totalArTime += Math.floor(duration / 60);
  AR_DATA.arStats.arSessions += 1;
  
  // Update most viewed if needed
  const mostViewedBadge = getArBadgeById(AR_DATA.arStats.mostViewed);
  if (!mostViewedBadge || badge.viewCount > mostViewedBadge.viewCount) {
    AR_DATA.arStats.mostViewed = badgeId;
  }
  
  return { success: true, badgeId, duration };
};

export const recordArShare = (badgeId) => {
  const badge = getArBadgeById(badgeId);
  if (!badge) {
    return { success: false, message: 'Badge not found' };
  }
  
  badge.shareCount += 1;
  AR_DATA.arStats.totalShares += 1;
  
  return { success: true, badgeId };
};

export const getArFilters = () => {
  return AR_DATA.arFilters;
};

export const getArBackgrounds = () => {
  return AR_DATA.arBackgrounds;
};

export const createArSession = (badgeId, options = {}) => {
  const badge = getArBadgeById(badgeId);
  if (!badge) {
    return { success: false, message: 'Badge not found' };
  }
  
  const session = {
    id: `ar_session_${Date.now()}`,
    badgeId,
    startTime: new Date().toISOString(),
    duration: 0,
    interactions: [],
    settings: {
      ...AR_DATA.arSettings,
      ...options,
    },
    status: 'active',
  };
  
  return { success: true, session };
};

export const endArSession = (sessionId, finalDuration) => {
  // Simulate ending AR session
  return {
    success: true,
    sessionId,
    duration: finalDuration,
    endedAt: new Date().toISOString(),
  };
};

export const captureArPhoto = (badgeId, options = {}) => {
  const badge = getArBadgeById(badgeId);
  if (!badge) {
    return { success: false, message: 'Badge not found' };
  }
  
  const photo = {
    id: `ar_photo_${Date.now()}`,
    badgeId,
    url: `https://ar-assets.cipss.com/photos/${badgeId}_${Date.now()}.jpg`,
    timestamp: new Date().toISOString(),
    filter: options.filterId,
    background: options.backgroundId,
    shareCount: 0,
  };
  
  return { success: true, photo };
};

export const captureArVideo = (badgeId, options = {}) => {
  const badge = getArBadgeById(badgeId);
  if (!badge) {
    return { success: false, message: 'Badge not found' };
  }
  
  const video = {
    id: `ar_video_${Date.now()}`,
    badgeId,
    url: `https://ar-assets.cipss.com/videos/${badgeId}_${Date.now()}.mp4`,
    timestamp: new Date().toISOString(),
    duration: options.duration || 30,
    filter: options.filterId,
    background: options.backgroundId,
    shareCount: 0,
  };
  
  return { success: true, video };
};

export const shareArContent = (contentId, platform) => {
  // Simulate sharing AR content
  const shareData = {
    contentId,
    platform,
    timestamp: new Date().toISOString(),
    url: `https://cipss.com/ar/share/${contentId}`,
  };
  
  return { success: true, shareData };
};

export const getArGallery = (userId = 'current') => {
  // Simulate getting user's AR gallery
  return {
    photos: [
      {
        id: 'photo_1',
        badgeId: 'ar_badge_1',
        url: 'https://ar-assets.cipss.com/gallery/photo_1.jpg',
        timestamp: '2024-04-20T14:30:00',
        filter: 'filter_pride',
        background: 'bg_space',
        shareCount: 5,
      },
      {
        id: 'photo_2',
        badgeId: 'ar_badge_2',
        url: 'https://ar-assets.cipss.com/gallery/photo_2.jpg',
        timestamp: '2024-04-19T16:45:00',
        filter: 'filter_golden',
        background: 'bg_beach',
        shareCount: 3,
      },
    ],
    videos: [
      {
        id: 'video_1',
        badgeId: 'ar_badge_3',
        url: 'https://ar-assets.cipss.com/gallery/video_1.mp4',
        timestamp: '2024-04-18T10:20:00',
        duration: 30,
        filter: 'filter_nature',
        background: 'bg_forest',
        shareCount: 8,
      },
    ],
  };
};

export const getArTutorials = () => {
  return [
    {
      id: 'tutorial_basics',
      title: 'AR Basics',
      description: 'Learn the fundamentals of AR badge viewing',
      duration: 120, // seconds
      url: 'https://ar-assets.cipss.com/tutorials/basics.mp4',
      thumbnail: 'https://ar-assets.cipss.com/tutorials/basics_thumb.jpg',
    },
    {
      id: 'tutorial_advanced',
      title: 'Advanced AR Features',
      description: 'Master filters, backgrounds, and effects',
      duration: 180,
      url: 'https://ar-assets.cipss.com/tutorials/advanced.mp4',
      thumbnail: 'https://ar-assets.cipss.com/tutorials/advanced_thumb.jpg',
    },
    {
      id: 'tutorial_sharing',
      title: 'Sharing Your AR Content',
      description: 'Learn how to capture and share AR moments',
      duration: 90,
      url: 'https://ar-assets.cipss.com/tutorials/sharing.mp4',
      thumbnail: 'https://ar-assets.cipss.com/tutorials/sharing_thumb.jpg',
    },
  ];
};

export const checkArCompatibility = () => {
  // Simulate AR compatibility check
  return {
    supported: true,
    arKit: true,
    arCore: true,
    webXR: true,
    camera: true,
    gyroscope: true,
    accelerometer: true,
    recommendations: [
      'Ensure good lighting for best AR experience',
      'Move slowly for better tracking',
      'Clear space around you for full AR experience',
    ],
  };
};

export const getArAchievements = () => {
  return [
    {
      id: 'ar_first_view',
      name: 'AR Explorer',
      description: 'View your first AR badge',
      unlocked: true,
      unlockedAt: '2024-04-15T10:30:00',
      icon: '🥽',
    },
    {
      id: 'ar_photo_capture',
      name: 'AR Photographer',
      description: 'Capture your first AR photo',
      unlocked: true,
      unlockedAt: '2024-04-16T14:20:00',
      icon: '📸',
    },
    {
      id: 'ar_video_capture',
      name: 'AR Filmmaker',
      description: 'Record your first AR video',
      unlocked: false,
      icon: '🎥',
    },
    {
      id: 'ar_sharer',
      name: 'AR Influencer',
      description: 'Share 5 AR creations',
      unlocked: false,
      progress: 3,
      total: 5,
      icon: '🌟',
    },
  ];
};

export const unlockArAchievement = (achievementId) => {
  const achievement = getArAchievements().find(a => a.id === achievementId);
  if (!achievement) {
    return { success: false, message: 'Achievement not found' };
  }
  
  if (achievement.unlocked) {
    return { success: false, message: 'Achievement already unlocked' };
  }
  
  achievement.unlocked = true;
  achievement.unlockedAt = new Date().toISOString();
  
  return { success: true, achievement };
};
