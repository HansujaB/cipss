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
  OFFLINE_DATA,
  isOnline,
  setOnlineStatus,
  cacheData,
  getCachedData,
  clearCache,
  addToSyncQueue,
  getSyncQueue,
  processSyncQueue,
  prefetchData,
  getStorageInfo,
  cleanupExpiredCache,
  getOfflineSettings,
  updateOfflineSettings,
  getSyncStatus,
  forceSync,
  exportOfflineData,
  importOfflineData,
  clearAllOfflineData,
  getOfflineStats,
  startAutoSync,
  stopAutoSync,
  initializeOfflineMode,
} from '../services/offlineService';

export default function OfflineScreen() {
  const [activeTab, setActiveTab] = useState('status');
  const [syncStatus, setSyncStatus] = useState(getSyncStatus());
  const [offlineStats, setOfflineStats] = useState(getOfflineStats());
  const [settings, setSettings] = useState(getOfflineSettings());

  const tabs = [
    { key: 'status', label: 'Status', icon: '📊' },
    { key: 'cache', label: 'Cache', icon: '💾' },
    { key: 'sync', label: 'Sync', icon: '🔄' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  useEffect(() => {
    initializeOfflineMode();
    const interval = setInterval(() => {
      setSyncStatus(getSyncStatus());
      setOfflineStats(getOfflineStats());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleOnline = () => {
    const newStatus = !syncStatus.isOnline;
    setOnlineStatus(newStatus);
    setSyncStatus(getSyncStatus());
    
    if (newStatus) {
      startAutoSync();
    } else {
      stopAutoSync();
    }
  };

  const handleForceSync = async () => {
    if (!syncStatus.isOnline) {
      Alert.alert('Offline', 'Please connect to the internet to sync');
      return;
    }

    Alert.alert(
      'Force Sync',
      'Sync all pending data and refresh cache?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sync',
          onPress: async () => {
            const result = await forceSync();
            if (result.success) {
              setSyncStatus(getSyncStatus());
              Alert.alert('Success', 'Sync completed successfully!');
            }
          }
        }
      ]
    );
  };

  const handleClearCache = (key = null) => {
    Alert.alert(
      'Clear Cache',
      key ? `Clear ${key} cache?` : 'Clear all cached data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearCache(key);
            setOfflineStats(getOfflineStats());
            Alert.alert('Success', 'Cache cleared successfully!');
          }
        }
      ]
    );
  };

  const handlePrefetchData = async () => {
    if (!syncStatus.isOnline) {
      Alert.alert('Offline', 'Please connect to the internet to prefetch data');
      return;
    }

    const result = await prefetchData();
    if (result.success) {
      setOfflineStats(getOfflineStats());
      Alert.alert('Success', 'Data prefetched successfully!');
    }
  };

  const handleUpdateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    updateOfflineSettings(newSettings);
    setSettings(newSettings);
    
    if (key === 'autoSync') {
      if (value && syncStatus.isOnline) {
        startAutoSync();
      } else {
        stopAutoSync();
      }
    }
  };

  const handleExportData = () => {
    const result = exportOfflineData();
    if (result.success) {
      Alert.alert(
        'Export Data',
        `Offline data exported (${(result.size / 1024).toFixed(1)} KB)`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'This will replace all current offline data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Info', 'Import functionality would open file picker');
          }
        }
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all offline data and sync queue. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearAllOfflineData();
            setOfflineStats(getOfflineStats());
            setSyncStatus(getSyncStatus());
            Alert.alert('Success', 'All offline data cleared!');
          }
        }
      ]
    );
  };

  const renderStatusCard = () => (
    <View style={styles.statusCard}>
      <View style={styles.statusHeader}>
        <Text style={styles.statusTitle}>Connection Status</Text>
        <TouchableOpacity
          style={[styles.statusToggle, syncStatus.isOnline && styles.onlineToggle]}
          onPress={handleToggleOnline}
        >
          <Text style={styles.statusToggleText}>
            {syncStatus.isOnline ? '🟢 Online' : '🔴 Offline'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statusGrid}>
        <View style={styles.statusItem}>
          <Text style={styles.statusValue}>{syncStatus.pendingSyncs}</Text>
          <Text style={styles.statusLabel}>Pending Syncs</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusValue}>{offlineStats.cacheSize}</Text>
          <Text style={styles.statusLabel}>Cached Items</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusValue}>{(offlineStats.storageUsage.used / 1024 / 1024).toFixed(1)}MB</Text>
          <Text style={styles.statusLabel}>Storage Used</Text>
        </View>
      </View>
      
      <View style={styles.syncActions}>
        <TouchableOpacity
          style={[styles.syncBtn, !syncStatus.isOnline && styles.disabledBtn]}
          onPress={handleForceSync}
          disabled={!syncStatus.isOnline}
        >
          <Text style={styles.syncBtnText}>🔄 Force Sync</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.syncBtn, !syncStatus.isOnline && styles.disabledBtn]}
          onPress={handlePrefetchData}
          disabled={!syncStatus.isOnline}
        >
          <Text style={styles.syncBtnText}>📥 Prefetch Data</Text>
        </TouchableOpacity>
      </View>
      
      {syncStatus.lastSync && (
        <Text style={styles.lastSyncText}>
          Last sync: {new Date(syncStatus.lastSync).toLocaleString()}
        </Text>
      )}
    </View>
  );

  const renderCacheItem = ({ item }) => (
    <View style={styles.cacheItem}>
      <View style={styles.cacheHeader}>
        <Text style={styles.cacheKey}>{item.key}</Text>
        <Text style={styles.cacheSize}>{(item.size / 1024).toFixed(1)} KB</Text>
      </View>
      <Text style={styles.cacheDate}>
        Cached: {new Date(item.timestamp).toLocaleString()}
      </Text>
      <Text style={styles.cacheExpiry}>
        Expires: {new Date(item.expiry).toLocaleString()}
      </Text>
      <TouchableOpacity
        style={styles.clearCacheBtn}
        onPress={() => handleClearCache(item.key)}
      >
        <Text style={styles.clearCacheBtnText}>Clear</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSyncItem = ({ item }) => (
    <View style={styles.syncItem}>
      <View style={styles.syncHeader}>
        <Text style={styles.syncAction}>{item.action}</Text>
        <View style={[
          styles.priorityBadge,
          item.priority === 'high' && styles.highPriority,
          item.priority === 'normal' && styles.normalPriority,
          item.priority === 'low' && styles.lowPriority
        ]}>
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
      </View>
      <Text style={styles.syncDate}>
        Queued: {new Date(item.timestamp).toLocaleString()}
      </Text>
      <Text style={styles.syncRetries}>
        Retries: {item.retries}/{item.maxRetries}
      </Text>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'status':
        return (
          <ScrollView style={styles.statusContainer} showsVerticalScrollIndicator={false}>
            {renderStatusCard()}
            
            <View style={styles.storageCard}>
              <Text style={styles.storageTitle}>💾 Storage Usage</Text>
              <View style={styles.storageBar}>
                <View 
                  style={[
                    styles.storageFill,
                    { 
                      width: `${offlineStats.storageUsage.percentage}%`,
                      backgroundColor: offlineStats.storageUsage.status === 'critical' ? '#EF4444' :
                                     offlineStats.storageUsage.status === 'warning' ? '#F59E0B' : '#22C55E'
                    }
                  ]}
                />
              </View>
              <Text style={styles.storageText}>
                {offlineStats.storageUsage.used} / {offlineStats.storageUsage.limit} bytes
                ({offlineStats.storageUsage.percentage}%)
              </Text>
            </View>
          </ScrollView>
        );
        
      case 'cache':
        return (
          <View style={styles.cacheContainer}>
            <View style={styles.cacheHeader}>
              <Text style={styles.sectionTitle}>Cached Data</Text>
              <TouchableOpacity
                style={styles.clearAllBtn}
                onPress={() => handleClearCache()}
              >
                <Text style={styles.clearAllBtnText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={Object.entries(OFFLINE_DATA.cache).map(([key, value]) => ({ key, ...value }))}
              keyExtractor={(item) => item.key}
              renderItem={renderCacheItem}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No cached data</Text>
                </View>
              }
            />
          </View>
        );
        
      case 'sync':
        return (
          <View style={styles.syncContainer}>
            <View style={styles.syncHeader}>
              <Text style={styles.sectionTitle}>Sync Queue</Text>
              <Text style={styles.syncCount}>{syncStatus.pendingSyncs} items</Text>
            </View>
            
            <FlatList
              data={getSyncQueue()}
              keyExtractor={(item) => item.id}
              renderItem={renderSyncItem}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No pending syncs</Text>
                </View>
              }
            />
          </View>
        );
        
      case 'settings':
        return (
          <ScrollView style={styles.settingsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>⚙️ Offline Settings</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Auto Sync</Text>
                  <Text style={styles.settingDescription}>Automatically sync when online</Text>
                </View>
                <Switch
                  value={settings.autoSync}
                  onValueChange={(value) => handleUpdateSetting('autoSync', value)}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Sync Interval</Text>
                  <Text style={styles.settingDescription}>
                    Every {settings.syncInterval / 60000} minutes
                  </Text>
                </View>
                <Switch
                  value={settings.syncInterval === 300000}
                  onValueChange={(value) => handleUpdateSetting('syncInterval', value ? 300000 : 600000)}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Compress Data</Text>
                  <Text style={styles.settingDescription}>Reduce storage usage</Text>
                </View>
                <Switch
                  value={settings.compressData}
                  onValueChange={(value) => handleUpdateSetting('compressData', value)}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Prefetch Data</Text>
                  <Text style={styles.settingDescription}>Download data for offline use</Text>
                </View>
                <Switch
                  value={settings.prefetchData}
                  onValueChange={(value) => handleUpdateSetting('prefetchData', value)}
                />
              </View>
            </View>
            
            <View style={styles.dataManagementCard}>
              <Text style={styles.dataManagementTitle}>📁 Data Management</Text>
              
              <TouchableOpacity style={styles.dataActionBtn} onPress={handleExportData}>
                <Text style={styles.dataActionBtnText}>📤 Export Offline Data</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.dataActionBtn} onPress={handleImportData}>
                <Text style={styles.dataActionBtnText}>📥 Import Offline Data</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.dataActionBtn, styles.dangerBtn]} 
                onPress={handleClearAllData}
              >
                <Text style={[styles.dataActionBtnText, styles.dangerBtnText]}>
                  🗑️ Clear All Data
                </Text>
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
      <Text style={styles.title}>📱 Offline Mode</Text>
      
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

  statusContainer: {
    flex: 1,
    padding: 16,
  },

  statusCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 14,
    marginBottom: 16,
    elevation: 2,
  },

  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  statusToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },

  onlineToggle: {
    backgroundColor: '#F0FDF4',
  },

  statusToggleText: {
    fontSize: 12,
    fontWeight: '600',
  },

  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },

  statusItem: {
    alignItems: 'center',
  },

  statusValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 4,
  },

  statusLabel: {
    fontSize: 11,
    color: '#6B7280',
  },

  syncActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },

  syncBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
  },

  disabledBtn: {
    backgroundColor: '#D1D5DB',
  },

  syncBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  lastSyncText: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },

  storageCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 14,
    elevation: 2,
  },

  storageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  storageBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 8,
  },

  storageFill: {
    height: '100%',
    borderRadius: 4,
  },

  storageText: {
    fontSize: 12,
    color: '#6B7280',
  },

  cacheContainer: {
    flex: 1,
  },

  cacheHeader: {
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

  clearAllBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  clearAllBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  cacheItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },

  cacheHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  cacheKey: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  cacheSize: {
    fontSize: 12,
    color: '#6B7280',
  },

  cacheDate: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2,
  },

  cacheExpiry: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 8,
  },

  clearCacheBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  clearCacheBtnText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '600',
  },

  syncContainer: {
    flex: 1,
  },

  syncHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  syncCount: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  syncItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },

  syncHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  syncAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    flex: 1,
  },

  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  highPriority: {
    backgroundColor: '#FEF2F2',
  },

  normalPriority: {
    backgroundColor: '#FFFBEB',
  },

  lowPriority: {
    backgroundColor: '#F0FDF4',
  },

  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },

  syncDate: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2,
  },

  syncRetries: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  settingsContainer: {
    flex: 1,
    padding: 16,
  },

  settingsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 14,
    marginBottom: 16,
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

  dataManagementCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 14,
    elevation: 2,
  },

  dataManagementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 16,
  },

  dataActionBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  dataActionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  dangerBtn: {
    backgroundColor: '#EF4444',
  },

  dangerBtnText: {
    color: '#FFFFFF',
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
