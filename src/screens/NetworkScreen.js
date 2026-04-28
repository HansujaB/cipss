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
  TextInput,
} from 'react-native';
import { 
  FOLLOW_DATA, 
  followUser, 
  unfollowUser, 
  acceptFollowRequest, 
  rejectFollowRequest,
  sendFollowRequest,
  getFollowStats,
  isFollowing
} from '../services/followService';

export default function NetworkScreen() {
  const [activeTab, setActiveTab] = useState('following');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { key: 'following', label: 'Following', icon: '👥' },
    { key: 'followers', label: 'Followers', icon: '🔄' },
    { key: 'requests', label: 'Requests', icon: '📬' },
    { key: 'suggested', label: 'Suggested', icon: '✨' },
  ];

  const followStats = getFollowStats();

  const handleFollow = (userId, userName) => {
    const result = followUser(userId, userName);
    Alert.alert(result.success ? 'Success' : 'Error', result.message);
  };

  const handleUnfollow = (userId, userName) => {
    Alert.alert(
      'Unfollow',
      `Are you sure you want to unfollow ${userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Unfollow', 
          style: 'destructive',
          onPress: () => {
            const result = unfollowUser(userId, userName);
            Alert.alert(result.success ? 'Success' : 'Error', result.message);
          }
        }
      ]
    );
  };

  const handleAcceptRequest = (userId, userName) => {
    const result = acceptFollowRequest(userId, userName);
    Alert.alert(result.success ? 'Success' : 'Error', result.message);
  };

  const handleRejectRequest = (userId, userName) => {
    const result = rejectFollowRequest(userId, userName);
    Alert.alert(result.success ? 'Success' : 'Error', result.message);
  };

  const handleSendRequest = (userId, userName) => {
    const result = sendFollowRequest(userId, userName);
    Alert.alert(result.success ? 'Success' : 'Error', result.message);
  };

  const renderFollowingItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={styles.userAvatar}>
          <Text style={styles.userInitial}>{item.userName.charAt(0)}</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.followDate}>Following since {new Date(item.followDate).toLocaleDateString()}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.unfollowBtn}
        onPress={() => handleUnfollow(item.userId, item.userName)}
      >
        <Text style={styles.unfollowBtnText}>Unfollow</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFollowerItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={styles.userAvatar}>
          <Text style={styles.userInitial}>{item.userName.charAt(0)}</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.followDate}>Started following {new Date(item.followDate).toLocaleDateString()}</Text>
        </View>
      </View>
      <View style={styles.followBackContainer}>
        <TouchableOpacity
          style={[styles.followBackBtn, isFollowing(item.userId) && styles.followingBtn]}
          onPress={() => isFollowing(item.userId) 
            ? handleUnfollow(item.userId, item.userName)
            : handleFollow(item.userId, item.userName)
          }
        >
          <Text style={[
            styles.followBackBtnText,
            isFollowing(item.userId) && styles.followingBtnText
          ]}>
            {isFollowing(item.userId) ? 'Following' : 'Follow Back'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRequestItem = ({ item }) => (
    <View style={[styles.userCard, styles.requestCard]}>
      <View style={styles.userInfo}>
        <View style={styles.userAvatar}>
          <Text style={styles.userInitial}>{item.userName.charAt(0)}</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.requestDate}>Requested {new Date(item.requestDate).toLocaleDateString()}</Text>
        </View>
      </View>
      <View style={styles.requestActions}>
        <TouchableOpacity
          style={styles.acceptBtn}
          onPress={() => handleAcceptRequest(item.userId, item.userName)}
        >
          <Text style={styles.acceptBtnText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectBtn}
          onPress={() => handleRejectRequest(item.userId, item.userName)}
        >
          <Text style={styles.rejectBtnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSuggestedItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={styles.userAvatar}>
          <Text style={styles.userInitial}>{item.userName.charAt(0)}</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.userRank}>Rank #{item.rank} • {item.campaigns} campaigns</Text>
          <Text style={styles.userPoints}>{item.points} points</Text>
          {item.mutualFollowers > 0 && (
            <Text style={styles.mutualText}>{item.mutualFollowers} mutual followers</Text>
          )}
          <Text style={styles.reasonText}>{item.reason}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.followBtn}
        onPress={() => handleSendRequest(item.userId, item.userName)}
      >
        <Text style={styles.followBtnText}>Follow</Text>
      </TouchableOpacity>
    </View>
  );

  const getDataByTab = () => {
    switch (activeTab) {
      case 'following':
        return FOLLOW_DATA.following;
      case 'followers':
        return FOLLOW_DATA.followers;
      case 'requests':
        return FOLLOW_DATA.followRequests;
      case 'suggested':
        return FOLLOW_DATA.suggestedUsers;
      default:
        return [];
    }
  };

  const getRenderItem = () => {
    switch (activeTab) {
      case 'following':
        return renderFollowingItem;
      case 'followers':
        return renderFollowerItem;
      case 'requests':
        return renderRequestItem;
      case 'suggested':
        return renderSuggestedItem;
      default:
        return renderFollowingItem;
    }
  };

  const filteredData = getDataByTab().filter(item =>
    item.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>👥 Network</Text>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{followStats.followingCount}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{followStats.followersCount}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{followStats.pendingRequestsCount}</Text>
            <Text style={styles.statLabel}>Requests</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && styles.tabActive,
                tab.key === 'requests' && followStats.pendingRequestsCount > 0 && styles.tabWithBadge
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
              {tab.key === 'requests' && followStats.pendingRequestsCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{followStats.pendingRequestsCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* List */}
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => `${activeTab}_${item.userId || index}`}
          renderItem={getRenderItem()}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'No users found' : `No ${activeTab} yet`}
              </Text>
            </View>
          }
        />
      </ScrollView>
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

  statsCard: {
    backgroundColor: '#1D0A69',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  statItem: {
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

  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },

  tab: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    paddingVertical: 12,
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

  tabWithBadge: {
    paddingRight: 20,
  },

  tabIcon: {
    fontSize: 16,
    marginBottom: 4,
  },

  tabLabel: {
    fontSize: 10,
    color: '#6B7280',
  },

  tabLabelActive: {
    color: '#FFFFFF',
  },

  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },

  userCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  requestCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1D0A69',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  userInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  userDetails: {
    flex: 1,
  },

  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  followDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },

  requestDate: {
    fontSize: 12,
    color: '#F59E0B',
    marginBottom: 2,
  },

  userRank: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },

  userPoints: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D0A69',
    marginBottom: 2,
  },

  mutualText: {
    fontSize: 11,
    color: '#22C55E',
    marginBottom: 2,
  },

  reasonText: {
    fontSize: 11,
    color: '#6B7280',
    fontStyle: 'italic',
  },

  unfollowBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  unfollowBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },

  followBackContainer: {
    alignItems: 'flex-end',
  },

  followBackBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  followingBtn: {
    backgroundColor: '#F3F4F6',
  },

  followBackBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  followingBtnText: {
    color: '#6B7280',
  },

  requestActions: {
    flexDirection: 'column',
    gap: 8,
  },

  acceptBtn: {
    backgroundColor: '#22C55E',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },

  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  rejectBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },

  rejectBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },

  followBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  followBtnText: {
    color: '#FFFFFF',
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
});
