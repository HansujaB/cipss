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
  Modal,
} from 'react-native';
import {
  AR_DATA,
  getArBadges,
  getArBadgeById,
  getArSettings,
  updateArSettings,
  getArStats,
  recordArView,
  recordArShare,
  getArFilters,
  getArBackgrounds,
  createArSession,
  endArSession,
  captureArPhoto,
  captureArVideo,
  shareArContent,
  getArGallery,
  getArTutorials,
  checkArCompatibility,
  getArAchievements,
  unlockArAchievement,
} from '../services/arService';

export default function ARBadgesScreen() {
  const [activeTab, setActiveTab] = useState('badges');
  const [badges, setBadges] = useState(getArBadges());
  const [settings, setSettings] = useState(getArSettings());
  const [stats, setStats] = useState(getArStats());
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [arModalVisible, setArModalVisible] = useState(false);
  const [galleryModalVisible, setGalleryModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  const tabs = [
    { key: 'badges', label: 'AR Badges', icon: '🥽' },
    { key: 'gallery', label: 'Gallery', icon: '📸' },
    { key: 'achievements', label: 'Achievements', icon: '🏆' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const rarityColors = {
    legendary: '#F59E0B',
    epic: '#8B5CF6',
    rare: '#3B82F6',
    common: '#6B7280',
  };

  useEffect(() => {
    // Check AR compatibility on mount
    const compatibility = checkArCompatibility();
    if (!compatibility.supported) {
      Alert.alert(
        'AR Not Supported',
        'Your device doesn\'t support AR features. Some features may be limited.',
        [{ text: 'OK' }]
      );
    }
  }, []);

  const handleViewBadge = (badge) => {
    setSelectedBadge(badge);
    setArModalVisible(true);
    
    // Create AR session
    const session = createArSession(badge.id);
    if (session.success) {
      // Simulate AR view
      setTimeout(() => {
        recordArView(badge.id, 45); // 45 seconds view
      }, 45000);
    }
  };

  const handleCloseAr = () => {
    if (selectedBadge) {
      endArSession(`ar_session_${Date.now()}`, 45);
    }
    setArModalVisible(false);
    setSelectedBadge(null);
  };

  const handleCapturePhoto = () => {
    if (!selectedBadge) return;
    
    const result = captureArPhoto(selectedBadge.id);
    if (result.success) {
      Alert.alert('Success', 'AR photo captured!');
      unlockArAchievement('ar_photo_capture');
    }
  };

  const handleCaptureVideo = () => {
    if (!selectedBadge) return;
    
    const result = captureArVideo(selectedBadge.id, { duration: 30 });
    if (result.success) {
      Alert.alert('Success', 'AR video recording started!');
    }
  };

  const handleShareBadge = (badge) => {
    const result = recordArShare(badge.id);
    if (result.success) {
      Alert.alert(
        'Share AR Badge',
        'Share your AR badge on social media?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Share',
            onPress: () => {
              shareArContent(`badge_${badge.id}`, 'social');
              Alert.alert('Success', 'Badge shared successfully!');
            }
          }
        ]
      );
    }
  };

  const handleUpdateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    updateArSettings(newSettings);
    setSettings(newSettings);
  };

  const renderBadgeCard = ({ item }) => (
    <TouchableOpacity
      style={styles.badgeCard}
      onPress={() => handleViewBadge(item)}
    >
      <View style={styles.badgeHeader}>
        <View style={styles.badgeIcon}>
          <Text style={styles.badgeIconText}>{item.icon}</Text>
        </View>
        <View style={styles.badgeInfo}>
          <Text style={styles.badgeName}>{item.name}</Text>
          <Text style={styles.badgeDescription}>{item.description}</Text>
        </View>
        <View style={[
          styles.rarityBadge,
          { backgroundColor: rarityColors[item.rarity] }
        ]}>
          <Text style={styles.rarityText}>{item.rarity}</Text>
        </View>
      </View>
      
      <View style={styles.badgeStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.viewCount}</Text>
          <Text style={styles.statLabel}>Views</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.shareCount}</Text>
          <Text style={styles.statLabel}>Shares</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {item.earned ? '✓' : '🔒'}
          </Text>
          <Text style={styles.statLabel}>Status</Text>
        </View>
      </View>
      
      {item.earned && (
        <TouchableOpacity
          style={styles.viewArBtn}
          onPress={() => handleViewBadge(item)}
        >
          <Text style={styles.viewArBtnText}>View in AR</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderGalleryItem = ({ item, type }) => (
    <TouchableOpacity style={styles.galleryItem}>
      <View style={styles.galleryPreview}>
        <Text style={styles.galleryIcon}>
          {type === 'photo' ? '📸' : '🎥'}
        </Text>
      </View>
      <Text style={styles.galleryDate}>
        {new Date(item.timestamp).toLocaleDateString()}
      </Text>
      <Text style={styles.galleryShares}>{item.shareCount} shares</Text>
    </TouchableOpacity>
  );

  const renderAchievementItem = ({ item }) => (
    <View style={[
      styles.achievementItem,
      !item.unlocked && styles.lockedAchievement
    ]}>
      <View style={styles.achievementIcon}>
        <Text style={styles.achievementIconText}>{item.icon}</Text>
      </View>
      <View style={styles.achievementInfo}>
        <Text style={styles.achievementName}>{item.name}</Text>
        <Text style={styles.achievementDescription}>{item.description}</Text>
        {item.unlocked && (
          <Text style={styles.achievementDate}>
            Unlocked: {new Date(item.unlockedAt).toLocaleDateString()}
          </Text>
        )}
        {!item.unlocked && item.progress !== undefined && (
          <Text style={styles.achievementProgress}>
            Progress: {item.progress}/{item.total}
          </Text>
        )}
      </View>
      <View style={styles.achievementStatus}>
        <Text style={styles.achievementStatusText}>
          {item.unlocked ? '✓' : `${item.progress || 0}/${item.total || 1}`}
        </Text>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'badges':
        return (
          <View style={styles.badgesContainer}>
            {/* Stats Header */}
            <View style={styles.statsHeader}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.totalViews}</Text>
                <Text style={styles.statLabel}>Total Views</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.totalShares}</Text>
                <Text style={styles.statLabel}>Total Shares</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.arSessions}</Text>
                <Text style={styles.statLabel}>AR Sessions</Text>
              </View>
            </View>
            
            <FlatList
              data={badges}
              keyExtractor={(item) => item.id}
              renderItem={renderBadgeCard}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
        
      case 'gallery':
        const gallery = getArGallery();
        return (
          <ScrollView style={styles.galleryContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.gallerySection}>
              <Text style={styles.sectionTitle}>📸 Photos</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              >
                {gallery.photos.map((photo) => (
                  <View key={photo.id} style={styles.galleryItemContainer}>
                    {renderGalleryItem({ item: photo, type: 'photo' })}
                  </View>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.gallerySection}>
              <Text style={styles.sectionTitle}>🎥 Videos</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              >
                {gallery.videos.map((video) => (
                  <View key={video.id} style={styles.galleryItemContainer}>
                    {renderGalleryItem({ item: video, type: 'video' })}
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        );
        
      case 'achievements':
        return (
          <View style={styles.achievementsContainer}>
            <FlatList
              data={getArAchievements()}
              keyExtractor={(item) => item.id}
              renderItem={renderAchievementItem}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
        
      case 'settings':
        return (
          <ScrollView style={styles.settingsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>🥽 AR Settings</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Enable AR</Text>
                  <Text style={styles.settingDescription}>Turn AR features on or off</Text>
                </View>
                <TouchableOpacity
                  style={[styles.toggleBtn, settings.enabled && styles.toggleBtnOn]}
                  onPress={() => handleUpdateSetting('enabled', !settings.enabled)}
                >
                  <Text style={styles.toggleBtnText}>
                    {settings.enabled ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Auto-start Camera</Text>
                  <Text style={styles.settingDescription}>Start camera when viewing AR</Text>
                </View>
                <TouchableOpacity
                  style={[styles.toggleBtn, settings.autoStartCamera && styles.toggleBtnOn]}
                  onPress={() => handleUpdateSetting('autoStartCamera', !settings.autoStartCamera)}
                >
                  <Text style={styles.toggleBtnText}>
                    {settings.autoStartCamera ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Sound Effects</Text>
                  <Text style={styles.settingDescription}>Play AR sound effects</Text>
                </View>
                <TouchableOpacity
                  style={[styles.toggleBtn, settings.soundEnabled && styles.toggleBtnOn]}
                  onPress={() => handleUpdateSetting('soundEnabled', !settings.soundEnabled)}
                >
                  <Text style={styles.toggleBtnText}>
                    {settings.soundEnabled ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Haptic Feedback</Text>
                  <Text style={styles.settingDescription}>Vibrate for AR interactions</Text>
                </View>
                <TouchableOpacity
                  style={[styles.toggleBtn, settings.hapticFeedback && styles.toggleBtnOn]}
                  onPress={() => handleUpdateSetting('hapticFeedback', !settings.hapticFeedback)}
                >
                  <Text style={styles.toggleBtnText}>
                    {settings.hapticFeedback ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.qualitySection}>
                <Text style={styles.qualityTitle}>Quality Settings</Text>
                <View style={styles.qualityOptions}>
                  {['low', 'medium', 'high'].map((quality) => (
                    <TouchableOpacity
                      key={quality}
                      style={[
                        styles.qualityBtn,
                        settings.quality === quality && styles.qualityBtnActive
                      ]}
                      onPress={() => handleUpdateSetting('quality', quality)}
                    >
                      <Text style={[
                        styles.qualityBtnText,
                        settings.quality === quality && styles.qualityBtnTextActive
                      ]}>
                        {quality.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        );
        
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>🥽 AR Badges</Text>
      
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
      
      {/* AR View Modal */}
      <Modal
        visible={arModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleCloseAr}
      >
        <View style={styles.arModal}>
          <View style={styles.arHeader}>
            <TouchableOpacity onPress={handleCloseAr}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.arTitle}>AR View</Text>
            <TouchableOpacity onPress={() => handleShareBadge(selectedBadge)}>
              <Text style={styles.shareBtn}>🔄</Text>
            </TouchableOpacity>
          </View>
          
          {selectedBadge && (
            <View style={styles.arContent}>
              <View style={styles.arBadgeDisplay}>
                <Text style={styles.arBadgeIcon}>{selectedBadge.icon}</Text>
                <Text style={styles.arBadgeName}>{selectedBadge.name}</Text>
              </View>
              
              <View style={styles.arControls}>
                <TouchableOpacity
                  style={styles.arControlBtn}
                  onPress={handleCapturePhoto}
                >
                  <Text style={styles.arControlBtnText}>📸 Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.arControlBtn}
                  onPress={handleCaptureVideo}
                >
                  <Text style={styles.arControlBtnText}>🎥 Video</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.arInstructions}>
                Point your camera at a flat surface to place the badge
              </Text>
            </View>
          )}
        </View>
      </Modal>
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

  badgesContainer: {
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

  badgeCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  badgeIconText: {
    fontSize: 24,
  },

  badgeInfo: {
    flex: 1,
  },

  badgeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  badgeDescription: {
    fontSize: 13,
    color: '#374151',
  },

  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  rarityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },

  badgeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },

  viewArBtn: {
    backgroundColor: '#1D0A69',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  viewArBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  galleryContainer: {
    flex: 1,
  },

  gallerySection: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  galleryItemContainer: {
    marginRight: 12,
  },

  galleryItem: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    elevation: 1,
    alignItems: 'center',
    minWidth: 100,
  },

  galleryPreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  galleryIcon: {
    fontSize: 24,
  },

  galleryDate: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },

  galleryShares: {
    fontSize: 10,
    color: '#9CA3AF',
  },

  achievementsContainer: {
    flex: 1,
  },

  achievementItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },

  lockedAchievement: {
    opacity: 0.6,
  },

  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  achievementIconText: {
    fontSize: 20,
  },

  achievementInfo: {
    flex: 1,
  },

  achievementName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  achievementDescription: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4,
  },

  achievementDate: {
    fontSize: 10,
    color: '#22C55E',
  },

  achievementProgress: {
    fontSize: 10,
    color: '#F59E0B',
  },

  achievementStatus: {
    alignItems: 'center',
  },

  achievementStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D0A69',
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

  toggleBtn: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },

  toggleBtnOn: {
    backgroundColor: '#22C55E',
  },

  toggleBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },

  toggleBtnOn && {
    color: '#FFFFFF',
  },

  qualitySection: {
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },

  qualityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  qualityOptions: {
    flexDirection: 'row',
    gap: 8,
  },

  qualityBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },

  qualityBtnActive: {
    backgroundColor: '#1D0A69',
  },

  qualityBtnText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },

  qualityBtnTextActive: {
    color: '#FFFFFF',
  },

  arModal: {
    flex: 1,
    backgroundColor: '#000000',
  },

  arHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1A1A2E',
  },

  closeBtn: {
    fontSize: 20,
    color: '#FFFFFF',
  },

  arTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  shareBtn: {
    fontSize: 20,
    color: '#FFFFFF',
  },

  arContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  arBadgeDisplay: {
    alignItems: 'center',
    marginBottom: 40,
  },

  arBadgeIcon: {
    fontSize: 64,
    marginBottom: 16,
  },

  arBadgeName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  arControls: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },

  arControlBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },

  arControlBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  arInstructions: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
