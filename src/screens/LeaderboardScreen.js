import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
} from 'react-native';
import { MOCK_LEADERBOARD } from '../constants/dummyData';
import { shareRank, shareProfile } from '../services/shareService';
import NavigationHeader from '../components/NavigationHeader';
import BottomTabBar from '../components/BottomTabBar';
import SideDrawer from '../components/SideDrawer';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TABS = [
  { key: 'volunteers', label: 'Volunteers', icon: '👥' },
  { key: 'ngos', label: 'NGOs', icon: '🏢' },
  { key: 'donors', label: 'Donors', icon: '💰' },
  { key: 'influencers', label: 'Influencers', icon: '🎥' },
];

const TIME_PERIODS = ['This Week', 'This Month', 'All Time'];

export default function LeaderboardScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('volunteers');
  const [timePeriod, setTimePeriod] = useState('All Time');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterBadges, setFilterBadges] = useState('');
  const [filterMinCampaigns, setFilterMinCampaigns] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

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
        // Already on leaderboard
        break;
      case 'achievements':
        navigation.navigate('Achievements');
        break;
    }
  };

  const tabs = [
    { key: 'home', label: 'Home', icon: '🏠' },
    { key: 'campaigns', label: 'Campaigns', icon: '📋' },
    { key: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { key: 'achievements', label: 'Achievements', icon: '🎖️' },
  ];

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const podiumAnim = useRef(new Animated.Value(0)).current;

  const data = useMemo(() => {
    let filteredData = MOCK_LEADERBOARD[activeTab] || [];

    // Search filter
    if (searchQuery) {
      filteredData = filteredData.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Badge filter
    if (filterBadges) {
      filteredData = filteredData.filter(user =>
        user.badges && user.badges.includes(filterBadges)
      );
    }

    // Minimum campaigns filter
    if (filterMinCampaigns) {
      const minCampaigns = parseInt(filterMinCampaigns) || 0;
      filteredData = filteredData.filter(user =>
        user.campaigns >= minCampaigns
      );
    }

    return filteredData;
  }, [activeTab, searchQuery, filterBadges, filterMinCampaigns]);

  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  // Mock current user data
  const currentUser = {
    rank: 7,
    name: 'You',
    role: 'volunteer',
    campaigns: 3,
    points: 450,
    badges: ['🌟', '💚'],
    impact: 'Waste: 100kg',
  };

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Slide up animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Podium bounce animation
    Animated.sequence([
      Animated.timing(podiumAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(podiumAnim, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(podiumAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleTabChange = (tab) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(tab);
  };

  const handleTimePeriodChange = (period) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTimePeriod(period);
  };

  const renderPodium = () => {
    if (top3.length < 3) return null;

    return (
      <Animated.View 
        style={[
          styles.podium,
          {
            transform: [{ scale: podiumAnim }],
            opacity: fadeAnim,
          }
        ]}
      >
        {/* 2nd Place */}
        <Animated.View 
          style={[
            styles.podiumItem, 
            styles.podiumSecond,
            {
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.podiumRank}>🥈</Text>
          <View style={styles.podiumAvatar}>
            <Text style={styles.podiumInitial}>{top3[1].name.charAt(0)}</Text>
          </View>
          <Text style={styles.podiumName}>{top3[1].name}</Text>
          <Text style={styles.podiumPoints}>{top3[1].points} pts</Text>
        </Animated.View>

        {/* 1st Place */}
        <Animated.View 
          style={[
            styles.podiumItem, 
            styles.podiumFirst,
            {
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.podiumRank}>🥇</Text>
          <View style={styles.podiumAvatar}>
            <Text style={styles.podiumInitial}>{top3[0].name.charAt(0)}</Text>
          </View>
          <Text style={styles.podiumName}>{top3[0].name}</Text>
          <Text style={styles.podiumPoints}>{top3[0].points} pts</Text>
        </Animated.View>

        {/* 3rd Place */}
        <Animated.View 
          style={[
            styles.podiumItem, 
            styles.podiumThird,
            {
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.podiumRank}>🥉</Text>
          <View style={styles.podiumAvatar}>
            <Text style={styles.podiumInitial}>{top3[2].name.charAt(0)}</Text>
          </View>
          <Text style={styles.podiumName}>{top3[2].name}</Text>
          <Text style={styles.podiumPoints}>{top3[2].points} pts</Text>
        </Animated.View>
      </Animated.View>
    );
  };

  const renderItem = ({ item }) => {
    const isTop3 = item.rank <= 3;

    return (
      <TouchableOpacity
        style={[styles.card, isTop3 && styles.topCard]}
        onPress={() => {
          setSelectedUser(item);
          setShowProfile(true);
        }}
      >
        <Text style={styles.rank}>
          {item.rank === 1 ? '🥇' :
           item.rank === 2 ? '🥈' :
           item.rank === 3 ? '🥉' :
           `#${item.rank}`}
        </Text>

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
            {item.verified && <Text style={styles.verifiedBadge}>✓</Text>}
          </View>
          <Text style={styles.meta}>
            {item.campaigns} campaigns • {item.badges.join(' ')}
          </Text>
          {item.impact && <Text style={styles.impact}>{item.impact}</Text>}
          {item.donated && <Text style={styles.impact}>{item.donated}</Text>}
          {item.followers && <Text style={styles.impact}>{item.followers} followers</Text>}
        </View>

        <Text style={styles.points}>{item.points} pts</Text>
      </TouchableOpacity>
    );
  };

  const renderProfile = () => {
    if (!selectedUser) return null;

    return (
      <Modal
        visible={showProfile}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowProfile(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileInitial}>{selectedUser.name.charAt(0)}</Text>
              </View>
              <Text style={styles.profileName}>{selectedUser.name}</Text>
              <Text style={styles.profileRank}>Rank #{selectedUser.rank}</Text>
            </View>

            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{selectedUser.points}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{selectedUser.campaigns}</Text>
                <Text style={styles.statLabel}>Campaigns</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{selectedUser.badges.length}</Text>
                <Text style={styles.statLabel}>Badges</Text>
              </View>
            </View>

            <View style={styles.profileDetails}>
              {selectedUser.impact && (
                <Text style={styles.detailItem}>Impact: {selectedUser.impact}</Text>
              )}
              {selectedUser.donated && (
                <Text style={styles.detailItem}>Donated: {selectedUser.donated}</Text>
              )}
              {selectedUser.followers && (
                <Text style={styles.detailItem}>Followers: {selectedUser.followers}</Text>
              )}
              {selectedUser.reach && (
                <Text style={styles.detailItem}>Reach: {selectedUser.reach}</Text>
              )}
              {selectedUser.verified && (
                <Text style={styles.detailItem}>✓ Verified {selectedUser.role}</Text>
              )}
            </View>

            <View style={styles.profileBadges}>
              <Text style={styles.badgesTitle}>Badges:</Text>
              <View style={styles.badgesList}>
                {selectedUser.badges.map((badge, idx) => (
                  <Text key={idx} style={styles.profileBadge}>{badge}</Text>
                ))}
              </View>
            </View>

            <View style={styles.profileActions}>
              <TouchableOpacity
                style={styles.profileShareBtn}
                onPress={() => {
                  shareProfile(selectedUser).then(success => {
                    if (success) {
                      Alert.alert('Success', 'Profile shared successfully!');
                    }
                  });
                }}
              >
                <Text style={styles.profileShareBtnText}>📤 Share Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setShowProfile(false)}
              >
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderFilterModal = () => {
    return (
      <Modal
        visible={showFilters}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterCard}>
            <Text style={styles.filterTitle}>Filters</Text>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Badge Type:</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="e.g., 🏆, 🌟, 💚"
                value={filterBadges}
                onChangeText={setFilterBadges}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Minimum Campaigns:</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="e.g., 5"
                value={filterMinCampaigns}
                onChangeText={setFilterMinCampaigns}
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.filterActions}>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setFilterBadges('');
                  setFilterMinCampaigns('');
                }}
              >
                <Text style={styles.resetBtnText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <NavigationHeader
        title="Leaderboard"
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
      />
      
      <ScrollView 
  showsVerticalScrollIndicator={false}
  contentContainerStyle={styles.scrollViewContent}
>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setShowFilters(true)}
          >
            <Text style={styles.filterBtnText}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* User's Rank Card */}
        <View style={styles.userCard}>
          <Text style={styles.userRank}>#{currentUser.rank}</Text>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{currentUser.name}</Text>
            <Text style={styles.userMeta}>
              {currentUser.campaigns} campaigns • {currentUser.points} pts
            </Text>
          </View>
          <View style={styles.userActions}>
            <View style={styles.userBadges}>
              {currentUser.badges.map((badge, idx) => (
                <Text key={idx} style={styles.badge}>{badge}</Text>
              ))}
            </View>
            <TouchableOpacity
              style={styles.shareRankBtn}
              onPress={() => {
                shareRank(currentUser.rank, currentUser.name, currentUser.points).then(success => {
                  if (success) {
                    Alert.alert('Success', 'Your rank has been shared!');
                  }
                });
              }}
            >
              <Text style={styles.shareRankBtnText}>📤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Time Period Selector */}
        <View style={styles.timePeriodContainer}>
          {TIME_PERIODS.map((period) => (
            <TouchableOpacity
              key={period}
              style={[styles.timePeriodBtn, timePeriod === period && styles.timePeriodActive]}
              onPress={() => handleTimePeriodChange(period)}
            >
              <Text style={[styles.timePeriodText, timePeriod === period && styles.timePeriodTextActive]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Results Count */}
        {searchQuery && (
          <Text style={styles.resultsCount}>{data.length} results found</Text>
        )}

        {/* Tabs */}
        <View style={styles.tabs}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => handleTabChange(tab.key)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Podium for top 3 */}
        {renderPodium()}

        {/* Rest of the list */}
        <FlatList
          data={rest}
          keyExtractor={(item) => item.rank.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </ScrollView>
      
      <BottomTabBar
        activeTab="leaderboard"
        tabs={tabs}
        onTabPress={handleTabPress}
      />
      
      {/* Profile Modal */}
      {renderProfile()}

      {/* Filter Modal */}
      {renderFilterModal()}

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

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A2E',
    padding: 16,
    paddingBottom: 8,
  },

  scrollViewContent: {
    paddingBottom: 80, // Account for bottom tab bar
  },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D0A69',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 14,
  },

  userRank: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    width: 45,
    textAlign: 'center',
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  userMeta: {
    fontSize: 12,
    color: '#E5E7EB',
    marginTop: 2,
  },

  userActions: {
    alignItems: 'flex-end',
  },

  userBadges: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  shareRankBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  shareRankBtnText: {
    fontSize: 14,
  },

  badge: {
    fontSize: 16,
    marginLeft: 4,
  },

  timePeriodContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  timePeriodBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },

  timePeriodActive: {
    backgroundColor: '#1D0A69',
  },

  timePeriodText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },

  timePeriodTextActive: {
    color: '#fff',
  },

  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },

  tabActive: {
    backgroundColor: '#1D0A69',
  },

  tabIcon: {
    fontSize: 16,
    marginRight: 4,
  },

  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },

  tabLabelActive: {
    color: '#fff',
  },

  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 20,
    height: 160,
  },

  podiumItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },

  podiumFirst: {
    marginBottom: 0,
  },

  podiumSecond: {
    marginBottom: 30,
  },

  podiumThird: {
    marginBottom: 50,
  },

  podiumRank: {
    fontSize: 32,
    marginBottom: 4,
  },

  podiumAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },

  podiumAvatarFirst: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F59E0B',
  },

  podiumInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },

  podiumName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1A1A2E',
    width: 70,
    textAlign: 'center',
    marginBottom: 2,
  },

  podiumPoints: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D0A69',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    elevation: 2,
  },

  topCard: {
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },

  rank: {
    fontSize: 18,
    width: 40,
    textAlign: 'center',
  },

  info: {
    flex: 1,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  verifiedBadge: {
    fontSize: 12,
    color: '#22C55E',
    marginLeft: 4,
    fontWeight: '700',
  },

  meta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  impact: {
    fontSize: 11,
    color: '#1D0A69',
    marginTop: 2,
    fontWeight: '500',
  },

  points: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1D0A69',
  },

  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },

  filterBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  filterBtnText: {
    fontSize: 16,
  },

  resultsCount: {
    fontSize: 12,
    color: '#6B7280',
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },

  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },

  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1D0A69',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  profileInitial: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  profileRank: {
    fontSize: 14,
    color: '#6B7280',
  },

  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
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
    fontSize: 12,
    color: '#6B7280',
  },

  profileDetails: {
    marginBottom: 20,
  },

  detailItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
  },

  profileBadges: {
    marginBottom: 20,
  },

  badgesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  badgesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  profileBadge: {
    fontSize: 20,
    marginRight: 8,
    marginBottom: 4,
  },

  profileActions: {
    flexDirection: 'column',
    gap: 8,
  },

  profileShareBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },

  profileShareBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  closeBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },

  closeBtnText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },

  filterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },

  filterTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 20,
    textAlign: 'center',
  },

  filterSection: {
    marginBottom: 16,
  },

  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  filterInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },

  resetBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },

  resetBtnText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },

  applyBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },

  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});