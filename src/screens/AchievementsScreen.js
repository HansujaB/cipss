import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { ACHIEVEMENTS, USER_ACHIEVEMENTS } from '../constants/dummyData';
import { shareAchievement } from '../services/shareService';
import NavigationHeader from '../components/NavigationHeader';
import BottomTabBar from '../components/BottomTabBar';
import SideDrawer from '../components/SideDrawer';

export default function AchievementsScreen({ navigation }) {
  const achievements = Object.values(ACHIEVEMENTS);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenuPress = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleDrawerNavigate = (screenName) => {
    setDrawerOpen(false);
    navigation.navigate(screenName);
  };

  // Menu items - only additional screens NOT in bottom nav
  const drawerMenuItems = [
    { key: 'CreateCampaign', label: 'Create Campaign', icon: '➕' },
    { key: 'CSRMarketplace', label: 'CSR Marketplace', icon: '🏪' },
    { key: 'ImpactDashboard', label: 'Impact Dashboard', icon: '📊' },
    { key: 'Network', label: 'Network', icon: '👥' },
    { key: 'Mentorship', label: 'Mentorship', icon: '👨‍🏫' },
    { key: 'Streak', label: 'Streak', icon: '🔥' },
    { key: 'PowerUp', label: 'Power-ups', icon: '⚡' },
    { key: 'Challenges', label: 'Challenges', icon: '🎯' },
    { key: 'Profile', label: 'Profile', icon: '👤' },
  ];

  const handleNotificationPress = () => {
    Alert.alert('Notifications', 'You have no new notifications');
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleTabPress = (tabKey) => {
    // Handle tab navigation
    switch(tabKey) {
      case 'home':
        navigation.navigate('Dashboard');
        break;
      case 'campaigns':
        navigation.navigate('Campaigns');
        break;
      case 'leaderboard':
        navigation.navigate('Leaderboard');
        break;
      case 'achievements':
        // Already on achievements
        break;
    }
  };

  const tabs = [
    { key: 'home', label: 'Home', icon: '🏠' },
    { key: 'campaigns', label: 'Campaigns', icon: '📋' },
    { key: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { key: 'achievements', label: 'Achievements', icon: '🎖️' },
  ];
  
  const renderAchievement = ({ item }) => {
    const userProgress = USER_ACHIEVEMENTS[item.id];
    const progress = userProgress?.progress || 0;
    const total = userProgress?.total || 1;
    const isUnlocked = userProgress?.unlocked || false;
    const progressPercentage = Math.min((progress / total) * 100, 100);

    return (
      <View style={[styles.achievementCard, isUnlocked && styles.unlockedCard]}>
        <View style={styles.achievementHeader}>
          <Text style={styles.achievementIcon}>{item.icon}</Text>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementName}>{item.name}</Text>
            <Text style={styles.achievementDescription}>{item.description}</Text>
            <Text style={styles.achievementPoints}>+{item.points} points</Text>
          </View>
          <View style={styles.achievementActions}>
            {isUnlocked && <Text style={styles.unlockedBadge}>✓</Text>}
            {isUnlocked && (
              <TouchableOpacity
                style={styles.shareBtn}
                onPress={() => {
                  shareAchievement(item, userProgress).then(success => {
                    if (success) {
                      Alert.alert('Success', 'Achievement shared successfully!');
                    }
                  });
                }}
              >
                <Text style={styles.shareBtnText}>📤</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {!isUnlocked && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${progressPercentage}%` }]} 
              />
            </View>
            <Text style={styles.progressText}>
              {progress}/{total}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const unlockedCount = Object.values(USER_ACHIEVEMENTS).filter(a => a.unlocked).length;
  const totalCount = Object.keys(USER_ACHIEVEMENTS).length;
  const totalPoints = Object.values(USER_ACHIEVEMENTS)
    .filter(a => a.unlocked)
    .reduce((sum, achievement) => {
      const achievementData = ACHIEVEMENTS[Object.keys(USER_ACHIEVEMENTS).find(key => USER_ACHIEVEMENTS[key] === achievement)];
      return sum + (achievementData?.points || 0);
    }, 0);

  return (
    <View style={styles.mainContainer}>
      <NavigationHeader
        title="Achievements"
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
      />
      
      <ScrollView 
  showsVerticalScrollIndicator={false}
  contentContainerStyle={styles.scrollViewContent}
>
        
        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{unlockedCount}/{totalCount}</Text>
            <Text style={styles.statLabel}>Unlocked</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalPoints}</Text>
            <Text style={styles.statLabel}>Points Earned</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{Math.round((unlockedCount/totalCount)*100)}%</Text>
            <Text style={styles.statLabel}>Complete</Text>
          </View>
        </View>

        {/* Achievements List */}
        <FlatList
          data={achievements}
          keyExtractor={(item) => item.id}
          renderItem={renderAchievement}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </ScrollView>
      
      <BottomTabBar
        activeTab="achievements"
        tabs={tabs}
        onTabPress={handleTabPress}
      />

      <SideDrawer
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        onNavigate={handleDrawerNavigate}
        navigation={navigation}
        menuItems={drawerMenuItems}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  scrollViewContent: {
    padding: 16,
    paddingBottom: 80, // Account for bottom tab bar
  },

  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#1D0A69',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 14,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: '#E5E7EB',
  },

  achievementCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
    opacity: 0.7,
  },

  unlockedCard: {
    opacity: 1,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },

  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  achievementIcon: {
    fontSize: 32,
    marginRight: 12,
  },

  achievementInfo: {
    flex: 1,
  },

  achievementName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  achievementDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },

  achievementPoints: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D0A69',
  },

  achievementActions: {
    alignItems: 'center',
  },

  unlockedBadge: {
    fontSize: 20,
    color: '#22C55E',
    fontWeight: '700',
    marginBottom: 4,
  },

  shareBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  shareBtnText: {
    fontSize: 14,
  },

  progressContainer: {
    marginTop: 8,
  },

  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#1D0A69',
    borderRadius: 3,
  },

  progressText: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'right',
  },
});
