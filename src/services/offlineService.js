// Offline mode support service
export const OFFLINE_DATA = {
  cache: {
    leaderboard: [],
    userProfiles: [],
    campaigns: [],
    notifications: [],
    achievements: [],
    teams: [],
    rewards: [],
  },
  syncQueue: [],
  lastSync: null,
  isOnline: true,
  storageQuota: {
    used: 0,
    limit: 50 * 1024 * 1024, // 50MB
  },
  settings: {
    autoSync: true,
    syncInterval: 300000, // 5 minutes
    cacheExpiry: 86400000, // 24 hours
    compressData: true,
    prefetchData: true,
  },
};

export const isOnline = () => {
  return OFFLINE_DATA.isOnline;
};

export const setOnlineStatus = (status) => {
  OFFLINE_DATA.isOnline = status;
  return status;
};

export const cacheData = (key, data, expiry = null) => {
  const cacheItem = {
    data,
    timestamp: Date.now(),
    expiry: expiry || Date.now() + OFFLINE_DATA.settings.cacheExpiry,
    size: JSON.stringify(data).length,
  };
  
  OFFLINE_DATA.cache[key] = cacheItem;
  updateStorageUsage();
  
  return { success: true, cached: true };
};

export const getCachedData = (key) => {
  const cached = OFFLINE_DATA.cache[key];
  
  if (!cached) {
    return { success: false, message: 'No cached data found' };
  }
  
  if (Date.now() > cached.expiry) {
    delete OFFLINE_DATA.cache[key];
    return { success: false, message: 'Cached data expired' };
  }
  
  return { success: true, data: cached.data };
};

export const clearCache = (key = null) => {
  if (key) {
    delete OFFLINE_DATA.cache[key];
  } else {
    OFFLINE_DATA.cache = {
      leaderboard: [],
      userProfiles: [],
      campaigns: [],
      notifications: [],
      achievements: [],
      teams: [],
      rewards: [],
    };
  }
  updateStorageUsage();
  return { success: true };
};

export const addToSyncQueue = (action, data, priority = 'normal') => {
  const syncItem = {
    id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    action,
    data,
    timestamp: Date.now(),
    priority,
    retries: 0,
    maxRetries: 3,
  };
  
  OFFLINE_DATA.syncQueue.push(syncItem);
  return { success: true, syncItem };
};

export const getSyncQueue = (priority = null) => {
  let queue = OFFLINE_DATA.syncQueue;
  
  if (priority) {
    queue = queue.filter(item => item.priority === priority);
  }
  
  // Sort by priority and timestamp
  const priorityOrder = { high: 0, normal: 1, low: 2 };
  return queue.sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.timestamp - b.timestamp;
  });
};

export const processSyncQueue = async () => {
  if (!isOnline()) {
    return { success: false, message: 'Device is offline' };
  }
  
  const queue = getSyncQueue();
  const results = [];
  
  for (const item of queue) {
    try {
      const result = await syncAction(item.action, item.data);
      if (result.success) {
        // Remove from queue on success
        const index = OFFLINE_DATA.syncQueue.findIndex(i => i.id === item.id);
        if (index !== -1) {
          OFFLINE_DATA.syncQueue.splice(index, 1);
        }
        results.push({ id: item.id, status: 'success', result });
      } else {
        // Increment retries
        item.retries++;
        if (item.retries >= item.maxRetries) {
          // Remove from queue after max retries
          const index = OFFLINE_DATA.syncQueue.findIndex(i => i.id === item.id);
          if (index !== -1) {
            OFFLINE_DATA.syncQueue.splice(index, 1);
          }
          results.push({ id: item.id, status: 'failed', error: 'Max retries exceeded' });
        }
      }
    } catch (error) {
      item.retries++;
      results.push({ id: item.id, status: 'error', error: error.message });
    }
  }
  
  return { success: true, processed: results };
};

const syncAction = async (action, data) => {
  // Simulate API sync
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Sync successful' });
    }, 1000);
  });
};

export const prefetchData = async () => {
  if (!isOnline()) {
    return { success: false, message: 'Device is offline' };
  }
  
  const prefetchTasks = [
    { key: 'leaderboard', priority: 'high' },
    { key: 'userProfiles', priority: 'medium' },
    { key: 'campaigns', priority: 'medium' },
    { key: 'notifications', priority: 'low' },
  ];
  
  const results = [];
  
  for (const task of prefetchTasks) {
    try {
      // Simulate data fetch
      const mockData = generateMockData(task.key);
      const result = cacheData(task.key, mockData);
      results.push({ key: task.key, ...result });
    } catch (error) {
      results.push({ key: task.key, success: false, error: error.message });
    }
  }
  
  return { success: true, results };
};

const generateMockData = (key) => {
  switch (key) {
    case 'leaderboard':
      return Array.from({ length: 50 }, (_, i) => ({
        id: `user_${i + 1}`,
        rank: i + 1,
        name: `User ${i + 1}`,
        points: Math.floor(Math.random() * 2000) + 100,
        campaigns: Math.floor(Math.random() * 20) + 1,
        badges: ['🌟', '💚', '🔥'].slice(0, Math.floor(Math.random() * 3) + 1),
      }));
    case 'userProfiles':
      return Array.from({ length: 20 }, (_, i) => ({
        id: `user_${i + 1}`,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        level: ['Bronze', 'Silver', 'Gold', 'Platinum'][Math.floor(Math.random() * 4)],
        joinDate: '2024-01-15',
        totalHours: Math.floor(Math.random() * 500) + 50,
      }));
    case 'campaigns':
      return Array.from({ length: 15 }, (_, i) => ({
        id: `campaign_${i + 1}`,
        name: `Campaign ${i + 1}`,
        description: `Description for campaign ${i + 1}`,
        startDate: '2024-04-01',
        endDate: '2024-04-30',
        participants: Math.floor(Math.random() * 100) + 10,
        status: 'active',
      }));
    case 'notifications':
      return Array.from({ length: 25 }, (_, i) => ({
        id: `notification_${i + 1}`,
        title: `Notification ${i + 1}`,
        message: `Message for notification ${i + 1}`,
        type: ['info', 'success', 'warning'][Math.floor(Math.random() * 3)],
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        read: Math.random() > 0.5,
      }));
    default:
      return [];
  }
};

export const updateStorageUsage = () => {
  let totalSize = 0;
  
  Object.values(OFFLINE_DATA.cache).forEach(item => {
    totalSize += item.size || 0;
  });
  
  OFFLINE_DATA.storageQuota.used = totalSize;
  return totalSize;
};

export const getStorageInfo = () => {
  const used = updateStorageUsage();
  const limit = OFFLINE_DATA.storageQuota.limit;
  const percentage = (used / limit) * 100;
  
  return {
    used,
    limit,
    percentage: Math.round(percentage),
    available: limit - used,
    status: percentage > 90 ? 'critical' : percentage > 75 ? 'warning' : 'normal',
  };
};

export const cleanupExpiredCache = () => {
  const now = Date.now();
  let cleaned = 0;
  
  Object.keys(OFFLINE_DATA.cache).forEach(key => {
    const cached = OFFLINE_DATA.cache[key];
    if (cached && now > cached.expiry) {
      delete OFFLINE_DATA.cache[key];
      cleaned++;
    }
  });
  
  updateStorageUsage();
  return { success: true, cleaned };
};

export const getOfflineSettings = () => {
  return OFFLINE_DATA.settings;
};

export const updateOfflineSettings = (settings) => {
  OFFLINE_DATA.settings = { ...OFFLINE_DATA.settings, ...settings };
  return { success: true, settings: OFFLINE_DATA.settings };
};

export const getSyncStatus = () => {
  const queue = getSyncQueue();
  const storage = getStorageInfo();
  
  return {
    isOnline: isOnline(),
    lastSync: OFFLINE_DATA.lastSync,
    pendingSyncs: queue.length,
    storageUsage: storage,
    autoSync: OFFLINE_DATA.settings.autoSync,
    nextAutoSync: OFFLINE_DATA.settings.autoSync ? 
      new Date(Date.now() + OFFLINE_DATA.settings.syncInterval).toISOString() : null,
  };
};

export const forceSync = async () => {
  if (!isOnline()) {
    return { success: false, message: 'Device is offline' };
  }
  
  const results = await processSyncQueue();
  await prefetchData();
  
  OFFLINE_DATA.lastSync = new Date().toISOString();
  
  return {
    success: true,
    lastSync: OFFLINE_DATA.lastSync,
    syncResults: results,
  };
};

export const exportOfflineData = () => {
  const exportData = {
    cache: OFFLINE_DATA.cache,
    syncQueue: OFFLINE_DATA.syncQueue,
    settings: OFFLINE_DATA.settings,
    lastSync: OFFLINE_DATA.lastSync,
    exportedAt: new Date().toISOString(),
  };
  
  return {
    success: true,
    data: exportData,
    size: JSON.stringify(exportData).length,
  };
};

export const importOfflineData = (importData) => {
  try {
    OFFLINE_DATA.cache = importData.cache || {};
    OFFLINE_DATA.syncQueue = importData.syncQueue || [];
    OFFLINE_DATA.settings = importData.settings || OFFLINE_DATA.settings;
    OFFLINE_DATA.lastSync = importData.lastSync || null;
    
    updateStorageUsage();
    
    return { success: true, imported: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const clearAllOfflineData = () => {
  OFFLINE_DATA.cache = {};
  OFFLINE_DATA.syncQueue = [];
  OFFLINE_DATA.lastSync = null;
  
  updateStorageUsage();
  
  return { success: true, cleared: true };
};

export const getOfflineStats = () => {
  const storage = getStorageInfo();
  const queue = getSyncQueue();
  
  return {
    cacheSize: Object.keys(OFFLINE_DATA.cache).length,
    storageUsage: storage,
    syncQueueSize: queue.length,
    highPrioritySyncs: queue.filter(item => item.priority === 'high').length,
    lastSync: OFFLINE_DATA.lastSync,
    isOnline: isOnline(),
    autoSyncEnabled: OFFLINE_DATA.settings.autoSync,
  };
};

// Auto-sync functionality
let autoSyncInterval = null;

export const startAutoSync = () => {
  if (autoSyncInterval) {
    clearInterval(autoSyncInterval);
  }
  
  if (OFFLINE_DATA.settings.autoSync && isOnline()) {
    autoSyncInterval = setInterval(async () => {
      try {
        await processSyncQueue();
        OFFLINE_DATA.lastSync = new Date().toISOString();
      } catch (error) {
        console.error('Auto-sync failed:', error);
      }
    }, OFFLINE_DATA.settings.syncInterval);
    
    return { success: true, message: 'Auto-sync started' };
  }
  
  return { success: false, message: 'Auto-sync not enabled or device offline' };
};

export const stopAutoSync = () => {
  if (autoSyncInterval) {
    clearInterval(autoSyncInterval);
    autoSyncInterval = null;
    return { success: true, message: 'Auto-sync stopped' };
  }
  
  return { success: false, message: 'Auto-sync not running' };
};

export const initializeOfflineMode = async () => {
  // Clean up expired cache
  cleanupExpiredCache();
  
  // Start auto-sync if enabled and online
  if (isOnline() && OFFLINE_DATA.settings.autoSync) {
    await prefetchData();
    startAutoSync();
  }
  
  return { 
    success: true, 
    initialized: true,
    status: getSyncStatus()
  };
};
