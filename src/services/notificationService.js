// Notifications service for rank changes and updates
export const NOTIFICATION_DATA = {
  notifications: [
    {
      id: 'notif_1',
      type: 'rank_change',
      title: '🎉 Rank Up!',
      message: 'You moved up from rank 8 to rank 7!',
      timestamp: '2024-04-20T10:30:00',
      read: false,
      priority: 'high',
      data: { oldRank: 8, newRank: 7, change: -1 },
    },
    {
      id: 'notif_2',
      type: 'achievement',
      title: '🏆 New Achievement',
      message: 'You earned the "Eco Warrior" badge!',
      timestamp: '2024-04-19T15:45:00',
      read: false,
      priority: 'medium',
      data: { badge: '🌱', name: 'Eco Warrior' },
    },
    {
      id: 'notif_3',
      type: 'streak',
      title: '🔥 Streak Milestone',
      message: '7-day streak achieved! Keep it going!',
      timestamp: '2024-04-18T09:00:00',
      read: true,
      priority: 'medium',
      data: { streak: 7, milestone: true },
    },
    {
      id: 'notif_4',
      type: 'team_update',
      title: '👥 Team Progress',
      message: 'Your team "Eco Warriors" moved up to rank 3!',
      timestamp: '2024-04-17T14:20:00',
      read: true,
      priority: 'low',
      data: { teamId: 'team_1', teamName: 'Eco Warriors', newRank: 3 },
    },
    {
      id: 'notif_5',
      type: 'challenge',
      title: '🎯 Challenge Alert',
      message: 'New weekly challenge available: "Earth Day Champion"',
      timestamp: '2024-04-16T11:00:00',
      read: true,
      priority: 'medium',
      data: { challengeId: 'challenge_1', challengeName: 'Earth Day Champion' },
    },
    {
      id: 'notif_6',
      type: 'follow',
      title: '👥 New Follower',
      message: 'Priya Patel started following you',
      timestamp: '2024-04-15T16:30:00',
      read: true,
      priority: 'low',
      data: { followerId: 'user_2', followerName: 'Priya Patel' },
    },
    {
      id: 'notif_7',
      type: 'mentorship',
      title: '🤝 Mentorship Session',
      message: 'Session with Dr. Sarah Johnson scheduled for tomorrow',
      timestamp: '2024-04-14T13:00:00',
      read: false,
      priority: 'high',
      data: { mentorId: 'mentor_1', mentorName: 'Dr. Sarah Johnson', date: '2024-04-21T14:00:00' },
    },
    {
      id: 'notif_8',
      type: 'comment',
      title: '💬 New Comment',
      message: 'Rahul Sharma commented on your achievement',
      timestamp: '2024-04-13T10:15:00',
      read: true,
      priority: 'low',
      data: { commenterId: 'user_1', commenterName: 'Rahul Sharma', entityId: 'achievement_1' },
    },
  ],
  settings: {
    rankChanges: true,
    achievements: true,
    streakMilestones: true,
    teamUpdates: true,
    challenges: true,
    follows: true,
    mentorship: true,
    comments: false,
    pushEnabled: true,
    emailEnabled: true,
    quietHours: { enabled: false, start: '22:00', end: '08:00' },
  },
  rankChangeHistory: [
    { date: '2024-04-20', oldRank: 8, newRank: 7, change: -1 },
    { date: '2024-04-15', oldRank: 10, newRank: 8, change: -2 },
    { date: '2024-04-01', oldRank: 12, newRank: 10, change: -2 },
    { date: '2024-03-25', oldRank: 15, newRank: 12, change: -3 },
    { date: '2024-03-15', oldRank: 18, newRank: 15, change: -3 },
  ],
};

export const getNotifications = (unreadOnly = false) => {
  const notifications = NOTIFICATION_DATA.notifications;
  return unreadOnly ? notifications.filter(n => !n.read) : notifications;
};

export const getUnreadCount = () => {
  return NOTIFICATION_DATA.notifications.filter(n => !n.read).length;
};

export const markAsRead = (notificationId) => {
  const notification = NOTIFICATION_DATA.notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    return { success: true };
  }
  return { success: false, message: 'Notification not found' };
};

export const markAllAsRead = () => {
  NOTIFICATION_DATA.notifications.forEach(n => n.read = true);
  return { success: true, message: 'All notifications marked as read' };
};

export const deleteNotification = (notificationId) => {
  const index = NOTIFICATION_DATA.notifications.findIndex(n => n.id === notificationId);
  if (index !== -1) {
    NOTIFICATION_DATA.notifications.splice(index, 1);
    return { success: true };
  }
  return { success: false, message: 'Notification not found' };
};

export const createNotification = (type, title, message, data = {}, priority = 'medium') => {
  const notification = {
    id: `notif_${Date.now()}`,
    type,
    title,
    message,
    timestamp: new Date().toISOString(),
    read: false,
    priority,
    data,
  };
  
  NOTIFICATION_DATA.notifications.unshift(notification);
  return { success: true, notification };
};

export const getRankChangeNotifications = () => {
  return NOTIFICATION_DATA.notifications.filter(n => n.type === 'rank_change');
};

export const getNotificationsByType = (type) => {
  return NOTIFICATION_DATA.notifications.filter(n => n.type === type);
};

export const updateNotificationSettings = (key, value) => {
  if (NOTIFICATION_DATA.settings.hasOwnProperty(key)) {
    NOTIFICATION_DATA.settings[key] = value;
    return { success: true };
  }
  return { success: false, message: 'Setting not found' };
};

export const getNotificationSettings = () => {
  return NOTIFICATION_DATA.settings;
};

export const simulateRankChange = (oldRank, newRank) => {
  const change = newRank - oldRank;
  const isImprovement = change < 0;
  
  if (isImprovement && NOTIFICATION_DATA.settings.rankChanges) {
    const title = `🎉 Rank Up!`;
    const message = `You moved up from rank ${oldRank} to rank ${newRank}!`;
    
    createNotification('rank_change', title, message, {
      oldRank,
      newRank,
      change,
    }, 'high');
    
    // Add to history
    NOTIFICATION_DATA.rankChangeHistory.push({
      date: new Date().toISOString().split('T')[0],
      oldRank,
      newRank,
      change,
    });
    
    return { success: true, notification: 'Rank change notification created' };
  }
  
  return { success: false, message: 'No rank improvement or notifications disabled' };
};

export const getRankChangeHistory = () => {
  return NOTIFICATION_DATA.rankChangeHistory.sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
};

export const getNotificationStats = () => {
  const notifications = NOTIFICATION_DATA.notifications;
  const total = notifications.length;
  const unread = notifications.filter(n => !n.read).length;
  const byType = {};
  
  notifications.forEach(n => {
    byType[n.type] = (byType[n.type] || 0) + 1;
  });
  
  const byPriority = {
    high: notifications.filter(n => n.priority === 'high').length,
    medium: notifications.filter(n => n.priority === 'medium').length,
    low: notifications.filter(n => n.priority === 'low').length,
  };
  
  return {
    total,
    unread,
    read: total - unread,
    byType,
    byPriority,
  };
};

export const getRecentNotifications = (limit = 5) => {
  return NOTIFICATION_DATA.notifications
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
};

export const clearOldNotifications = (daysOld = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  const originalLength = NOTIFICATION_DATA.notifications.length;
  NOTIFICATION_DATA.notifications = NOTIFICATION_DATA.notifications.filter(
    n => new Date(n.timestamp) > cutoffDate
  );
  
  const cleared = originalLength - NOTIFICATION_DATA.notifications.length;
  return { success: true, cleared };
};
