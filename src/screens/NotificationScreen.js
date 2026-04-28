import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import {
  NOTIFICATION_DATA,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getRankChangeNotifications,
  getNotificationsByType,
  updateNotificationSettings,
  getNotificationSettings,
  getRankChangeHistory,
  getNotificationStats,
  getRecentNotifications,
} from '../services/notificationService';

export default function NotificationScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState(getNotifications());
  const [settings, setSettings] = useState(getNotificationSettings());

  const tabs = [
    { key: 'all', label: 'All', icon: '📬' },
    { key: 'unread', label: 'Unread', icon: '🔴' },
    { key: 'rank', label: 'Rank', icon: '🏆' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const notificationTypes = [
    { key: 'rankChanges', label: 'Rank Changes', icon: '🏆' },
    { key: 'achievements', label: 'Achievements', icon: '🎖️' },
    { key: 'streakMilestones', label: 'Streak Milestones', icon: '🔥' },
    { key: 'teamUpdates', label: 'Team Updates', icon: '👥' },
    { key: 'challenges', label: 'Challenges', icon: '🎯' },
    { key: 'follows', label: 'Follows', icon: '👥' },
    { key: 'mentorship', label: 'Mentorship', icon: '🤝' },
    { key: 'comments', label: 'Comments', icon: '💬' },
  ];

  const handleMarkAsRead = (notificationId) => {
    const result = markAsRead(notificationId);
    if (result.success) {
      setNotifications(getNotifications());
    }
  };

  const handleMarkAllAsRead = () => {
    const result = markAllAsRead();
    if (result.success) {
      setNotifications(getNotifications());
    }
  };

  const handleDeleteNotification = (notificationId) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const result = deleteNotification(notificationId);
            if (result.success) {
              setNotifications(getNotifications());
            }
          }
        }
      ]
    );
  };

  const handleSettingToggle = (key, value) => {
    const result = updateNotificationSettings(key, value);
    if (result.success) {
      setSettings(getNotificationSettings());
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const getNotificationsForTab = () => {
    switch (activeTab) {
      case 'unread':
        return getNotifications(true);
      case 'rank':
        return getRankChangeNotifications();
      default:
        return notifications;
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.read && styles.unreadNotification,
        item.priority === 'high' && styles.highPriorityNotification
      ]}
      onPress={() => handleMarkAsRead(item.id)}
    >
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <View style={styles.notificationMeta}>
          {!item.read && <View style={styles.unreadDot} />}
          <Text style={styles.notificationTime}>{formatTimestamp(item.timestamp)}</Text>
        </View>
      </View>
      
      <Text style={styles.notificationMessage}>{item.message}</Text>
      
      {item.data && (
        <View style={styles.notificationData}>
          {item.type === 'rank_change' && (
            <Text style={styles.rankChangeText}>
              Rank #{item.data.oldRank} → #{item.data.newRank}
            </Text>
          )}
          {item.type === 'achievement' && (
            <Text style={styles.achievementText}>
              {item.data.badge} {item.data.name}
            </Text>
          )}
          {item.type === 'streak' && (
            <Text style={styles.streakText}>
              🔥 {item.data.streak} day streak
            </Text>
          )}
        </View>
      )}
      
      <View style={styles.notificationActions}>
        {!item.read && (
          <TouchableOpacity
            style={styles.markReadBtn}
            onPress={() => handleMarkAsRead(item.id)}
          >
            <Text style={styles.markReadBtnText}>Mark as read</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDeleteNotification(item.id)}
        >
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderRankHistoryItem = ({ item }) => (
    <View style={styles.rankHistoryItem}>
      <Text style={styles.rankHistoryDate}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
      <View style={styles.rankChange}>
        <Text style={styles.oldRank}>#{item.oldRank}</Text>
        <Text style={styles.rankArrow}>→</Text>
        <Text style={styles.newRank}>#{item.newRank}</Text>
        <Text style={[
          styles.rankChangeText,
          item.change < 0 ? styles.rankImprovement : styles.rankDecline
        ]}>
          ({item.change > 0 ? '+' : ''}{item.change})
        </Text>
      </View>
    </View>
  );

  const renderSettingItem = ({ item }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingIcon}>{item.icon}</Text>
        <Text style={styles.settingLabel}>{item.label}</Text>
      </View>
      <Switch
        value={settings[item.key]}
        onValueChange={(value) => handleSettingToggle(item.key, value)}
        trackColor={{ false: '#E5E7EB', true: '#1D0A69' }}
        thumbColor={settings[item.key] ? '#FFFFFF' : '#F3F4F6'}
      />
    </View>
  );

  const renderStatsCard = () => {
    const stats = getNotificationStats();
    
    return (
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>📊 Notification Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.unread}</Text>
            <Text style={styles.statLabel}>Unread</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.byPriority.high}</Text>
            <Text style={styles.statLabel}>High Priority</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'settings':
        return (
          <ScrollView style={styles.settingsContainer} showsVerticalScrollIndicator={false}>
            {renderStatsCard()}
            
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>🔔 Notification Types</Text>
              {notificationTypes.map((setting, index) => (
                <View key={index}>
                  {renderSettingItem({ item: setting })}
                </View>
              ))}
            </View>
            
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>📱 Delivery Methods</Text>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingIcon}>📱</Text>
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                </View>
                <Switch
                  value={settings.pushEnabled}
                  onValueChange={(value) => handleSettingToggle('pushEnabled', value)}
                  trackColor={{ false: '#E5E7EB', true: '#1D0A69' }}
                  thumbColor={settings.pushEnabled ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingIcon}>📧</Text>
                  <Text style={styles.settingLabel}>Email Notifications</Text>
                </View>
                <Switch
                  value={settings.emailEnabled}
                  onValueChange={(value) => handleSettingToggle('emailEnabled', value)}
                  trackColor={{ false: '#E5E7EB', true: '#1D0A69' }}
                  thumbColor={settings.emailEnabled ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
            </View>
            
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>🌙 Quiet Hours</Text>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingIcon}>🌙</Text>
                  <Text style={styles.settingLabel}>Enable Quiet Hours</Text>
                </View>
                <Switch
                  value={settings.quietHours.enabled}
                  onValueChange={(value) => handleSettingToggle('quietHours.enabled', value)}
                  trackColor={{ false: '#E5E7EB', true: '#1D0A69' }}
                  thumbColor={settings.quietHours.enabled ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
              {settings.quietHours.enabled && (
                <View style={styles.quietHoursInfo}>
                  <Text style={styles.quietHoursText}>
                    {settings.quietHours.start} - {settings.quietHours.end}
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>📈 Rank Change History</Text>
              {getRankChangeHistory().map((item, index) => (
                <View key={index}>
                  {renderRankHistoryItem({ item })}
                </View>
              ))}
            </View>
          </ScrollView>
        );
        
      default:
        const tabNotifications = getNotificationsForTab();
        const unreadCount = getUnreadCount();
        
        return (
          <View style={styles.notificationsContainer}>
            {unreadCount > 0 && (
              <View style={styles.unreadBanner}>
                <Text style={styles.unreadBannerText}>
                  {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                </Text>
                <TouchableOpacity
                  style={styles.markAllReadBtn}
                  onPress={handleMarkAllAsRead}
                >
                  <Text style={styles.markAllReadBtnText}>Mark all as read</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <FlatList
              data={tabNotifications}
              keyExtractor={(item) => item.id}
              renderItem={renderNotificationItem}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No notifications</Text>
                </View>
              }
            />
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>🔔 Notifications</Text>
      
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.tabActive
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[
              styles.tabLabel,
              activeTab === tab.key && styles.tabLabelActive
            ]}>
              {tab.label}
            </Text>
            {tab.key === 'unread' && getUnreadCount() > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{getUnreadCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1A2E',
    padding: 16,
    paddingBottom: 8,
  },

  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 4,
  },

  tab: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },

  tabActive: {
    backgroundColor: '#1D0A69',
    borderColor: '#1D0A69',
  },

  tabIcon: {
    fontSize: 14,
    marginBottom: 2,
  },

  tabLabel: {
    fontSize: 9,
    color: '#6B7280',
  },

  tabLabelActive: {
    color: '#FFFFFF',
  },

  tabBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },

  notificationsContainer: {
    flex: 1,
  },

  unreadBanner: {
    backgroundColor: '#1D0A69',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  unreadBannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  markAllReadBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  markAllReadBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  notificationCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  unreadNotification: {
    borderLeftWidth: 3,
    borderLeftColor: '#1D0A69',
    backgroundColor: '#F0F9FF',
  },

  highPriorityNotification: {
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },

  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    flex: 1,
  },

  notificationMeta: {
    alignItems: 'flex-end',
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1D0A69',
    marginBottom: 4,
  },

  notificationTime: {
    fontSize: 11,
    color: '#6B7280',
  },

  notificationMessage: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },

  notificationData: {
    marginBottom: 8,
  },

  rankChangeText: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '600',
  },

  achievementText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },

  streakText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },

  notificationActions: {
    flexDirection: 'row',
    gap: 8,
  },

  markReadBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  markReadBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  deleteBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  deleteBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },

  settingsContainer: {
    flex: 1,
    padding: 16,
  },

  statsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 14,
    marginBottom: 16,
    elevation: 2,
  },

  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 16,
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  statItem: {
    alignItems: 'center',
  },

  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },

  settingsSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 16,
  },

  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },

  settingLabel: {
    fontSize: 14,
    color: '#1A1A2E',
  },

  quietHoursInfo: {
    paddingLeft: 32,
    paddingVertical: 8,
  },

  quietHoursText: {
    fontSize: 12,
    color: '#6B7280',
  },

  rankHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  rankHistoryDate: {
    fontSize: 14,
    color: '#1A1A2E',
  },

  rankChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  oldRank: {
    fontSize: 14,
    color: '#6B7280',
  },

  rankArrow: {
    fontSize: 14,
    color: '#6B7280',
  },

  newRank: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  rankChangeText: {
    fontSize: 12,
    fontWeight: '600',
  },

  rankImprovement: {
    color: '#22C55E',
  },

  rankDecline: {
    color: '#EF4444',
  },
});
