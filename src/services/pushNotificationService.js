// Push notifications service
export const NOTIFICATION_DATA = {
  settings: {
    enabled: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
    types: {
      rankChanges: true,
      achievements: true,
      streaks: true,
      campaigns: true,
      teamUpdates: true,
      mentions: true,
      reminders: false,
      news: false,
    },
    sound: true,
    vibration: true,
    badge: true,
  },
  notifications: [
    {
      id: 'notif_1',
      type: 'rank_change',
      title: 'Rank Up! 🎉',
      message: 'Congratulations! You moved up to rank #5 in the leaderboard',
      data: { oldRank: 6, newRank: 5 },
      timestamp: '2024-04-20T14:30:00',
      read: false,
      priority: 'high',
    },
    {
      id: 'notif_2',
      type: 'achievement',
      title: 'New Badge Earned! 🏆',
      message: 'You earned the "Week Warrior" badge for your 7-day streak',
      data: { badgeId: 'badge_1', badgeName: 'Week Warrior' },
      timestamp: '2024-04-20T10:15:00',
      read: false,
      priority: 'medium',
    },
    {
      id: 'notif_3',
      type: 'campaign',
      title: 'New Campaign Available 📢',
      message: 'Beach Cleanup Drive this Saturday - Join us!',
      data: { campaignId: 'campaign_1', campaignName: 'Beach Cleanup Drive' },
      timestamp: '2024-04-19T16:45:00',
      read: true,
      priority: 'low',
    },
    {
      id: 'notif_4',
      type: 'team',
      title: 'Team Update 👥',
      message: 'Your team "Green Warriors" reached the top 10!',
      data: { teamId: 'team_1', teamName: 'Green Warriors', rank: 8 },
      timestamp: '2024-04-19T09:20:00',
      read: true,
      priority: 'medium',
    },
    {
      id: 'notif_5',
      type: 'streak',
      title: 'Streak Milestone 🔥',
      message: 'Amazing! You have a 7-day volunteer streak!',
      data: { streakDays: 7, milestone: true },
      timestamp: '2024-04-18T20:00:00',
      read: true,
      priority: 'high',
    },
  ],
  templates: [
    {
      type: 'rank_change',
      title: 'Rank Up! 🎉',
      message: 'Congratulations! You moved up to rank #{newRank} in the leaderboard',
      priority: 'high',
    },
    {
      type: 'achievement',
      title: 'New Badge Earned! 🏆',
      message: 'You earned the "{badgeName}" badge',
      priority: 'medium',
    },
    {
      type: 'streak',
      title: 'Streak Milestone 🔥',
      message: 'Amazing! You have a {streakDays}-day volunteer streak!',
      priority: 'high',
    },
    {
      type: 'campaign',
      title: 'New Campaign Available 📢',
      message: '{campaignName} - Join us!',
      priority: 'low',
    },
    {
      type: 'team',
      title: 'Team Update 👥',
      message: 'Your team "{teamName}" reached rank #{rank}!',
      priority: 'medium',
    },
    {
      type: 'mention',
      title: 'You were mentioned! 💬',
      message: '{mentionerName} mentioned you in a comment',
      priority: 'medium',
    },
    {
      type: 'reminder',
      title: 'Reminder ⏰',
      message: 'Don\'t forget about {reminderTitle}',
      priority: 'low',
    },
    {
      type: 'news',
      title: 'Platform Update 📰',
      message: '{newsTitle}',
      priority: 'low',
    },
  ],
  scheduled: [
    {
      id: 'schedule_1',
      type: 'reminder',
      title: 'Weekly Volunteer Reminder',
      message: 'Time to log your volunteer hours for this week!',
      schedule: 'weekly',
      nextRun: '2024-04-27T09:00:00',
      enabled: true,
    },
    {
      id: 'schedule_2',
      type: 'campaign',
      title: 'Campaign Starting Soon',
      message: 'Beach Cleanup Drive starts in 1 hour',
      schedule: 'event',
      nextRun: '2024-04-25T13:00:00',
      enabled: true,
    },
  ],
};

export const getNotificationSettings = () => {
  return NOTIFICATION_DATA.settings;
};

export const updateNotificationSettings = (settings) => {
  NOTIFICATION_DATA.settings = { ...NOTIFICATION_DATA.settings, ...settings };
  return { success: true, settings: NOTIFICATION_DATA.settings };
};

export const getNotifications = (filters = {}) => {
  let notifications = NOTIFICATION_DATA.notifications;
  
  if (filters.type) {
    notifications = notifications.filter(n => n.type === filters.type);
  }
  
  if (filters.read !== undefined) {
    notifications = notifications.filter(n => n.read === filters.read);
  }
  
  if (filters.priority) {
    notifications = notifications.filter(n => n.priority === filters.priority);
  }
  
  return notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const getUnreadCount = () => {
  return NOTIFICATION_DATA.notifications.filter(n => !n.read).length;
};

export const markAsRead = (notificationId) => {
  const notification = NOTIFICATION_DATA.notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    return { success: true, notification };
  }
  return { success: false, message: 'Notification not found' };
};

export const markAllAsRead = () => {
  NOTIFICATION_DATA.notifications.forEach(n => n.read = true);
  return { success: true, marked: NOTIFICATION_DATA.notifications.length };
};

export const deleteNotification = (notificationId) => {
  const index = NOTIFICATION_DATA.notifications.findIndex(n => n.id === notificationId);
  if (index !== -1) {
    const deleted = NOTIFICATION_DATA.notifications.splice(index, 1)[0];
    return { success: true, deleted };
  }
  return { success: false, message: 'Notification not found' };
};

export const clearAllNotifications = () => {
  const count = NOTIFICATION_DATA.notifications.length;
  NOTIFICATION_DATA.notifications = [];
  return { success: true, cleared: count };
};

export const createNotification = (type, data, customMessage = null) => {
  const template = NOTIFICATION_DATA.templates.find(t => t.type === type);
  if (!template) {
    return { success: false, message: 'Notification template not found' };
  }
  
  // Check if this notification type is enabled
  if (!NOTIFICATION_DATA.settings.types[type]) {
    return { success: false, message: 'Notification type disabled' };
  }
  
  // Check quiet hours
  if (isQuietHours() && template.priority !== 'high') {
    return { success: false, message: 'Quiet hours active' };
  }
  
  const notification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    title: template.title,
    message: customMessage || formatMessage(template.message, data),
    data,
    timestamp: new Date().toISOString(),
    read: false,
    priority: template.priority,
  };
  
  NOTIFICATION_DATA.notifications.unshift(notification);
  
  // Send push notification (simulated)
  sendPushNotification(notification);
  
  return { success: true, notification };
};

const formatMessage = (template, data) => {
  let message = template;
  Object.keys(data).forEach(key => {
    message = message.replace(`{${key}}`, data[key]);
  });
  return message;
};

const isQuietHours = () => {
  if (!NOTIFICATION_DATA.settings.quietHours.enabled) {
    return false;
  }
  
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const { start, end } = NOTIFICATION_DATA.settings.quietHours;
  
  if (start < end) {
    return currentTime >= start && currentTime <= end;
  } else {
    // Overnight quiet hours (e.g., 22:00 to 08:00)
    return currentTime >= start || currentTime <= end;
  }
};

const sendPushNotification = (notification) => {
  // Simulate push notification sending
  console.log('Push notification sent:', notification);
  
  // In a real app, this would integrate with:
  // - Firebase Cloud Messaging (FCM)
  // - Apple Push Notification Service (APNS)
  // - Windows Push Notification Services (WNS)
  
  return {
    success: true,
    notificationId: notification.id,
    delivered: true,
  };
};

export const getScheduledNotifications = () => {
  return NOTIFICATION_DATA.scheduled.filter(s => s.enabled);
};

export const createScheduledNotification = (type, title, message, schedule, data = {}) => {
  const scheduled = {
    id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    message,
    schedule,
    data,
    nextRun: calculateNextRun(schedule),
    enabled: true,
  };
  
  NOTIFICATION_DATA.scheduled.push(scheduled);
  return { success: true, scheduled };
};

export const updateScheduledNotification = (scheduleId, updates) => {
  const scheduled = NOTIFICATION_DATA.scheduled.find(s => s.id === scheduleId);
  if (!scheduled) {
    return { success: false, message: 'Scheduled notification not found' };
  }
  
  Object.assign(scheduled, updates);
  if (updates.schedule) {
    scheduled.nextRun = calculateNextRun(updates.schedule);
  }
  
  return { success: true, scheduled };
};

export const deleteScheduledNotification = (scheduleId) => {
  const index = NOTIFICATION_DATA.scheduled.findIndex(s => s.id === scheduleId);
  if (index !== -1) {
    const deleted = NOTIFICATION_DATA.scheduled.splice(index, 1)[0];
    return { success: true, deleted };
  }
  return { success: false, message: 'Scheduled notification not found' };
};

const calculateNextRun = (schedule) => {
  const now = new Date();
  
  switch (schedule) {
    case 'daily':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    case 'monthly':
      return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString();
    default:
      // For specific datetime schedules
      return schedule;
  }
};

export const processScheduledNotifications = () => {
  const now = new Date().toISOString();
  const dueNotifications = NOTIFICATION_DATA.scheduled.filter(s => 
    s.enabled && s.nextRun <= now
  );
  
  const results = [];
  
  dueNotifications.forEach(scheduled => {
    const result = createNotification(scheduled.type, scheduled.data, scheduled.message);
    results.push({
      scheduledId: scheduled.id,
      ...result,
    });
    
    // Update next run time
    if (result.success) {
      scheduled.nextRun = calculateNextRun(scheduled.schedule);
    }
  });
  
  return { success: true, processed: results };
};

export const getNotificationStats = () => {
  const total = NOTIFICATION_DATA.notifications.length;
  const unread = NOTIFICATION_DATA.notifications.filter(n => !n.read).length;
  const byType = {};
  const byPriority = {};
  
  NOTIFICATION_DATA.notifications.forEach(n => {
    byType[n.type] = (byType[n.type] || 0) + 1;
    byPriority[n.priority] = (byPriority[n.priority] || 0) + 1;
  });
  
  return {
    total,
    unread,
    read: total - unread,
    byType,
    byPriority,
    scheduled: NOTIFICATION_DATA.scheduled.filter(s => s.enabled).length,
  };
};

export const testNotification = (type) => {
  const testData = {
    rank_change: { oldRank: 5, newRank: 4 },
    achievement: { badgeName: 'Test Badge' },
    streak: { streakDays: 5 },
    campaign: { campaignName: 'Test Campaign' },
    team: { teamName: 'Test Team', rank: 1 },
    mention: { mentionerName: 'Test User' },
    reminder: { reminderTitle: 'Test Reminder' },
    news: { newsTitle: 'Test News' },
  };
  
  return createNotification(type, testData[type]);
};

export const enableNotifications = () => {
  return updateNotificationSettings({ enabled: true });
};

export const disableNotifications = () => {
  return updateNotificationSettings({ enabled: false });
};

export const requestNotificationPermission = () => {
  // Simulate permission request
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        granted: true,
        canAskAgain: false,
        settings: {
          alert: true,
          badge: true,
          sound: true,
        },
      });
    }, 1000);
  });
};
