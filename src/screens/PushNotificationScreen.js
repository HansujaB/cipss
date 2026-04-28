import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import {
  NOTIFICATION_DATA,
  getNotificationSettings,
  updateNotificationSettings,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  createNotification,
  getScheduledNotifications,
  createScheduledNotification,
  updateScheduledNotification,
  deleteScheduledNotification,
  getNotificationStats,
  testNotification,
  enableNotifications,
  disableNotifications,
  requestNotificationPermission,
} from '../services/pushNotificationService';

export default function PushNotificationScreen() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [notifications, setNotifications] = useState(getNotifications());
  const [settings, setSettings] = useState(getNotificationSettings());
  const [unreadCount, setUnreadCount] = useState(getUnreadCount());
  const [stats, setStats] = useState(getNotificationStats());

  const tabs = [
    { key: 'notifications', label: 'Notifications', icon: '🔔' },
    { key: 'scheduled', label: 'Scheduled', icon: '📅' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(getNotifications());
      setUnreadCount(getUnreadCount());
      setStats(getNotificationStats());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = (notificationId) => {
    const result = markAsRead(notificationId);
    if (result.success) {
      setNotifications(getNotifications());
      setUnreadCount(getUnreadCount());
    }
  };

  const handleMarkAllAsRead = () => {
    const result = markAllAsRead();
    if (result.success) {
      setNotifications(getNotifications());
      setUnreadCount(getUnreadCount());
      Alert.alert('Success', 'All notifications marked as read!');
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
              setUnreadCount(getUnreadCount());
            }
          }
        }
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to delete all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            const result = clearAllNotifications();
            if (result.success) {
              setNotifications(getNotifications());
              setUnreadCount(getUnreadCount());
              Alert.alert('Success', 'All notifications cleared!');
            }
          }
        }
      ]
    );
  };

  const handleUpdateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    updateNotificationSettings(newSettings);
    setSettings(newSettings);
  };

  const handleUpdateTypeSetting = (type, value) => {
    const newSettings = {
      ...settings,
      types: { ...settings.types, [type]: value }
    };
    updateNotificationSettings(newSettings);
    setSettings(newSettings);
  };

  const handleTestNotification = (type) => {
    const result = testNotification(type);
    if (result.success) {
      setNotifications(getNotifications());
      setUnreadCount(getUnreadCount());
      Alert.alert('Success', 'Test notification sent!');
    }
  };

  const handleRequestPermission = async () => {
    try {
      const permission = await requestNotificationPermission();
      if (permission.granted) {
        Alert.alert('Success', 'Notifications enabled!');
      } else {
        Alert.alert('Permission Denied', 'Please enable notifications in settings');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to request notification permission');
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.read && styles.unreadNotification
      ]}
      onPress={() => handleMarkAsRead(item.id)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationIcon}>
          <Text style={styles.iconText}>
            {item.type === 'rank_change' && '🎉'}
            {item.type === 'achievement' && '🏆'}
            {item.type === 'streak' && '🔥'}
            {item.type === 'campaign' && '📢'}
            {item.type === 'team' && '👥'}
            {item.type === 'mention' && '💬'}
            {item.type === 'reminder' && '⏰'}
            {item.type === 'news' && '📰'}
          </Text>
        </View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
        </View>
        <View style={styles.notificationActions}>
          {!item.read && (
            <View style={styles.unreadDot} />
          )}
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDeleteNotification(item.id)}
          >
            <Text style={styles.deleteBtnText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderScheduledItem = ({ item }) => (
    <View style={styles.scheduledItem}>
      <View style={styles.scheduledHeader}>
        <Text style={styles.scheduledTitle}>{item.title}</Text>
        <Switch
          value={item.enabled}
          onValueChange={(value) => updateScheduledNotification(item.id, { enabled: value })}
        />
      </View>
      <Text style={styles.scheduledMessage}>{item.message}</Text>
      <Text style={styles.scheduledNext}>Next: {new Date(item.nextRun).toLocaleString()}</Text>
      <Text style={styles.scheduledType}>Type: {item.schedule}</Text>
      <TouchableOpacity
        style={styles.deleteScheduledBtn}
        onPress={() => deleteScheduledNotification(item.id)}
      >
        <Text style={styles.deleteScheduledBtnText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'notifications':
        return (
          <View style={styles.notificationsContainer}>
            {/* Stats Header */}
            <View style={styles.statsHeader}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{unreadCount}</Text>
                <Text style={styles.statLabel}>Unread</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.scheduled}</Text>
                <Text style={styles.statLabel}>Scheduled</Text>
              </View>
            </View>
            
            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <Text style={styles.actionBtnText}>Mark All Read</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleClearAll}
                disabled={notifications.length === 0}
              >
                <Text style={styles.actionBtnText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            
            {/* Notifications List */}
            <FlatList
              data={notifications}
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
        
      case 'scheduled':
        return (
          <View style={styles.scheduledContainer}>
            <View style={styles.scheduledHeader}>
              <Text style={styles.sectionTitle}>📅 Scheduled Notifications</Text>
              <TouchableOpacity
                style={styles.addScheduledBtn}
                onPress={() => {
                  Alert.alert('Add Scheduled', 'Scheduled notification creation would open form');
                }}
              >
                <Text style={styles.addScheduledBtnText}>+ Add</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={getScheduledNotifications()}
              keyExtractor={(item) => item.id}
              renderItem={renderScheduledItem}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No scheduled notifications</Text>
                </View>
              }
            />
          </View>
        );
        
      case 'settings':
        return (
          <ScrollView style={styles.settingsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>🔔 Notification Settings</Text>
              
              {/* Master Toggle */}
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Enable Notifications</Text>
                  <Text style={styles.settingDescription}>Turn all notifications on or off</Text>
                </View>
                <Switch
                  value={settings.enabled}
                  onValueChange={(value) => handleUpdateSetting('enabled', value)}
                />
              </View>
              
              {/* Quiet Hours */}
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Quiet Hours</Text>
                  <Text style={styles.settingDescription}>
                    {settings.quietHours.enabled ? 
                      `${settings.quietHours.start} - ${settings.quietHours.end}` : 
                      'Disabled'
                    }
                  </Text>
                </View>
                <Switch
                  value={settings.quietHours.enabled}
                  onValueChange={(value) => handleUpdateSetting('quietHours', { 
                    ...settings.quietHours, 
                    enabled: value 
                  })}
                />
              </View>
              
              {/* Notification Types */}
              <View style={styles.typesSection}>
                <Text style={styles.typesTitle}>Notification Types</Text>
                
                <View style={styles.typeItem}>
                  <View style={styles.typeInfo}>
                    <Text style={styles.typeLabel}>🎉 Rank Changes</Text>
                  </View>
                  <Switch
                    value={settings.types.rankChanges}
                    onValueChange={(value) => handleUpdateTypeSetting('rankChanges', value)}
                  />
                </View>
                
                <View style={styles.typeItem}>
                  <View style={styles.typeInfo}>
                    <Text style={styles.typeLabel}>🏆 Achievements</Text>
                  </View>
                  <Switch
                    value={settings.types.achievements}
                    onValueChange={(value) => handleUpdateTypeSetting('achievements', value)}
                  />
                </View>
                
                <View style={styles.typeItem}>
                  <View style={styles.typeInfo}>
                    <Text style={styles.typeLabel}>🔥 Streaks</Text>
                  </View>
                  <Switch
                    value={settings.types.streaks}
                    onValueChange={(value) => handleUpdateTypeSetting('streaks', value)}
                  />
                </View>
                
                <View style={styles.typeItem}>
                  <View style={styles.typeInfo}>
                    <Text style={styles.typeLabel}>📢 Campaigns</Text>
                  </View>
                  <Switch
                    value={settings.types.campaigns}
                    onValueChange={(value) => handleUpdateTypeSetting('campaigns', value)}
                  />
                </View>
                
                <View style={styles.typeItem}>
                  <View style={styles.typeInfo}>
                    <Text style={styles.typeLabel}>👥 Team Updates</Text>
                  </View>
                  <Switch
                    value={settings.types.teamUpdates}
                    onValueChange={(value) => handleUpdateTypeSetting('teamUpdates', value)}
                  />
                </View>
                
                <View style={styles.typeItem}>
                  <View style={styles.typeInfo}>
                    <Text style={styles.typeLabel}>💬 Mentions</Text>
                  </View>
                  <Switch
                    value={settings.types.mentions}
                    onValueChange={(value) => handleUpdateTypeSetting('mentions', value)}
                  />
                </View>
                
                <View style={styles.typeItem}>
                  <View style={styles.typeInfo}>
                    <Text style={styles.typeLabel}>⏰ Reminders</Text>
                  </View>
                  <Switch
                    value={settings.types.reminders}
                    onValueChange={(value) => handleUpdateTypeSetting('reminders', value)}
                  />
                </View>
                
                <View style={styles.typeItem}>
                  <View style={styles.typeInfo}>
                    <Text style={styles.typeLabel}>📰 News</Text>
                  </View>
                  <Switch
                    value={settings.types.news}
                    onValueChange={(value) => handleUpdateTypeSetting('news', value)}
                  />
                </View>
              </View>
              
              {/* Additional Settings */}
              <View style={styles.additionalSection}>
                <Text style={styles.additionalTitle}>Additional Settings</Text>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Sound</Text>
                  </View>
                  <Switch
                    value={settings.sound}
                    onValueChange={(value) => handleUpdateSetting('sound', value)}
                  />
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Vibration</Text>
                  </View>
                  <Switch
                    value={settings.vibration}
                    onValueChange={(value) => handleUpdateSetting('vibration', value)}
                  />
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Badge Count</Text>
                  </View>
                  <Switch
                    value={settings.badge}
                    onValueChange={(value) => handleUpdateSetting('badge', value)}
                  />
                </View>
              </View>
              
              {/* Test Section */}
              <View style={styles.testSection}>
                <Text style={styles.testTitle}>Test Notifications</Text>
                <View style={styles.testButtons}>
                  {['rank_change', 'achievement', 'streak', 'campaign'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={styles.testBtn}
                      onPress={() => handleTestNotification(type)}
                    >
                      <Text style={styles.testBtnText}>
                        {type === 'rank_change' && '🎉 Rank'}
                        {type === 'achievement' && '🏆 Badge'}
                        {type === 'streak' && '🔥 Streak'}
                        {type === 'campaign' && '📢 Campaign'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Permission Button */}
              <TouchableOpacity
                style={styles.permissionBtn}
                onPress={handleRequestPermission}
              >
                <Text style={styles.permissionBtnText}>Request Permission</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );
        
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>🔔 Push Notifications</Text>
      
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
            {tab.key === 'notifications' && unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
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
    paddingVertical: 8,
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
    fontSize: 12,
    marginBottom: 2,
  },

  tabLabel: {
    fontSize: 8,
    color: '#6B7280',
  },

  tabLabelActive: {
    color: '#FFFFFF',
  },

  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '600',
  },

  notificationsContainer: {
    flex: 1,
  },

  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  statItem: {
    alignItems: 'center',
  },

  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 11,
    color: '#6B7280',
  },

  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },

  actionBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },

  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  notificationItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },

  unreadNotification: {
    borderLeftWidth: 3,
    borderLeftColor: '#1D0A69',
  },

  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  iconText: {
    fontSize: 16,
  },

  notificationContent: {
    flex: 1,
  },

  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  notificationMessage: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 4,
  },

  notificationTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  notificationActions: {
    alignItems: 'center',
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1D0A69',
    marginBottom: 8,
  },

  deleteBtn: {
    padding: 4,
  },

  deleteBtnText: {
    fontSize: 14,
  },

  scheduledContainer: {
    flex: 1,
  },

  scheduledHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  addScheduledBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  addScheduledBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  scheduledItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },

  scheduledTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  scheduledMessage: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 8,
  },

  scheduledNext: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },

  scheduledType: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 8,
  },

  deleteScheduledBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  deleteScheduledBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },

  settingsContainer: {
    flex: 1,
    padding: 16,
  },

  settingsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 14,
    elevation: 2,
  },

  settingsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 20,
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
    flex: 1,
  },

  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
  },

  typesSection: {
    paddingTop: 16,
  },

  typesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  typeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },

  typeInfo: {
    flex: 1,
  },

  typeLabel: {
    fontSize: 14,
    color: '#1A1A2E',
  },

  additionalSection: {
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },

  additionalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  testSection: {
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },

  testTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  testButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  testBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  testBtnText: {
    fontSize: 12,
    color: '#1A1A2E',
  },

  permissionBtn: {
    backgroundColor: '#22C55E',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },

  permissionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
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
});
