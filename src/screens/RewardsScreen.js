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
  REWARDS_DATA,
  getUserCoins,
  getUserPoints,
  getRewards,
  getRewardById,
  getCategories,
  claimReward,
  getRedemptionHistory,
  getDailyBonus,
  claimDailyBonus,
  getRewardsByRarity,
  getAffordableRewards,
  searchRewards,
  getRewardStats,
  getAchievements,
  getRarityColor,
} from '../services/rewardsService';

export default function RewardsScreen() {
  const [activeTab, setActiveTab] = useState('rewards');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userCoins, setUserCoins] = useState(getUserCoins());
  const [userPoints, setUserPoints] = useState(getUserPoints());

  const tabs = [
    { key: 'rewards', label: 'Rewards', icon: '🎁' },
    { key: 'history', label: 'History', icon: '📜' },
    { key: 'achievements', label: 'Achievements', icon: '🏆' },
    { key: 'daily', label: 'Daily', icon: '🎯' },
  ];

  const categories = [
    { key: 'all', name: 'All', icon: '🌟' },
    ...getCategories(),
  ];

  const dailyBonusInfo = getDailyBonus();
  const rewardStats = getRewardStats();
  const achievements = getAchievements();

  const handleClaimReward = (rewardId) => {
    const reward = getRewardById(rewardId);
    if (!reward) return;

    Alert.alert(
      'Claim Reward',
      `Are you sure you want to claim "${reward.name}" for ${reward.cost} coins?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Claim',
          onPress: () => {
            const result = claimReward(rewardId);
            if (result.success) {
              setUserCoins(getUserCoins());
              Alert.alert('Success!', result.message);
            } else {
              Alert.alert('Error', result.message);
            }
          }
        }
      ]
    );
  };

  const handleClaimDailyBonus = () => {
    const result = claimDailyBonus();
    if (result.success) {
      setUserCoins(getUserCoins());
      Alert.alert('Success!', result.message);
    } else {
      Alert.alert('Info', result.message);
    }
  };

  const getRewardsForDisplay = () => {
    let rewards = getRewards();
    
    if (selectedCategory !== 'all') {
      rewards = rewards.filter(r => r.category === selectedCategory);
    }
    
    if (searchQuery) {
      rewards = searchRewards(searchQuery);
    }
    
    return rewards;
  };

  const renderRewardCard = ({ item }) => {
    const canAfford = userCoins >= item.cost;
    const rarityColor = getRarityColor(item.rarity);
    
    return (
      <View style={[
        styles.rewardCard,
        !item.available && styles.unavailableReward,
        item.claimed && styles.claimedReward
      ]}>
        <View style={styles.rewardHeader}>
          <Text style={styles.rewardIcon}>{item.icon}</Text>
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardName}>{item.name}</Text>
            <Text style={styles.rewardDescription}>{item.description}</Text>
            <View style={styles.rewardMeta}>
              <Text style={[styles.rewardCategory, { color: rarityColor }]}>
                {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
              </Text>
              <Text style={styles.rewardType}>{item.type}</Text>
            </View>
          </View>
          <View style={styles.rewardCost}>
            <Text style={styles.costAmount}>{item.cost}</Text>
            <Text style={styles.costLabel}>coins</Text>
          </View>
        </View>
        
        <View style={styles.rewardFooter}>
          {item.claimed ? (
            <View style={styles.claimedBadge}>
              <Text style={styles.claimedBadgeText}>Claimed</Text>
            </View>
          ) : !item.available ? (
            <View style={styles.unavailableBadge}>
              <Text style={styles.unavailableBadgeText}>Unavailable</Text>
            </View>
          ) : !canAfford ? (
            <View style={styles.insufficientBadge}>
              <Text style={styles.insufficientBadgeText}>Insufficient Coins</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.claimBtn}
              onPress={() => handleClaimReward(item.id)}
            >
              <Text style={styles.claimBtnText}>Claim</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyIcon}>
        {getRewardById(item.rewardId)?.icon || '🎁'}
      </Text>
      <View style={styles.historyInfo}>
        <Text style={styles.historyName}>{item.rewardName}</Text>
        <Text style={styles.historyDate}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.historyDetails}>
        <Text style={styles.historyCost}>-{item.cost} coins</Text>
        <Text style={[
          styles.historyStatus,
          item.status === 'completed' && styles.statusCompleted,
          item.status === 'active' && styles.statusActive,
          item.status === 'pending' && styles.statusPending
        ]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  const renderAchievementItem = ({ item }) => (
    <View style={[
      styles.achievementItem,
      item.unlocked && styles.unlockedAchievement
    ]}>
      <Text style={styles.achievementIcon}>
        {item.unlocked ? '✅' : '🔒'}
      </Text>
      <View style={styles.achievementInfo}>
        <Text style={styles.achievementName}>{item.name}</Text>
        <Text style={styles.achievementDescription}>{item.description}</Text>
      </View>
      <View style={styles.achievementReward}>
        <Text style={styles.achievementCoins}>+{item.coins}</Text>
        <Text style={styles.achievementCoinsLabel}>coins</Text>
      </View>
    </View>
  );

  const renderCategoryTab = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        selectedCategory === item.key && styles.selectedCategoryTab
      ]}
      onPress={() => setSelectedCategory(item.key)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={[
        styles.categoryLabel,
        selectedCategory === item.key && styles.selectedCategoryLabel
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'rewards':
        return (
          <View style={styles.rewardsContainer}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search rewards..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            {/* Categories */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesContainer}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {categories.map((category, index) => (
                <View key={index}>
                  {renderCategoryTab({ item: category })}
                </View>
              ))}
            </ScrollView>
            
            {/* Rewards List */}
            <FlatList
              data={getRewardsForDisplay()}
              keyExtractor={(item) => item.id}
              renderItem={renderRewardCard}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No rewards found</Text>
                </View>
              }
            />
          </View>
        );
        
      case 'history':
        return (
          <View style={styles.historyContainer}>
            <FlatList
              data={getRedemptionHistory()}
              keyExtractor={(item) => item.id}
              renderItem={renderHistoryItem}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No redemption history</Text>
                </View>
              }
            />
          </View>
        );
        
      case 'achievements':
        return (
          <View style={styles.achievementsContainer}>
            <FlatList
              data={achievements}
              keyExtractor={(item) => item.id}
              renderItem={renderAchievementItem}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
        
      case 'daily':
        return (
          <ScrollView style={styles.dailyContainer} showsVerticalScrollIndicator={false}>
            {/* Daily Bonus */}
            <View style={styles.dailyBonusCard}>
              <Text style={styles.dailyBonusTitle}>🎯 Daily Bonus</Text>
              <Text style={styles.dailyBonusDescription}>
                Claim your daily bonus to keep your streak going!
              </Text>
              
              <View style={styles.streakInfo}>
                <Text style={styles.streakCount}>
                  🔥 {dailyBonusInfo.streak || 0} day streak
                </Text>
                {dailyBonusInfo.available && (
                  <Text style={styles.nextBonus}>
                    Next: +{dailyBonusInfo.bonusAmount} coins
                  </Text>
                )}
              </View>
              
              <TouchableOpacity
                style={[
                  styles.claimBonusBtn,
                  !dailyBonusInfo.available && styles.disabledBonusBtn
                ]}
                onPress={handleClaimDailyBonus}
                disabled={!dailyBonusInfo.available}
              >
                <Text style={[
                  styles.claimBonusBtnText,
                  !dailyBonusInfo.available && styles.disabledBonusBtnText
                ]}>
                  {dailyBonusInfo.available ? 'Claim Bonus' : 'Already Claimed'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Stats */}
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>📊 Your Stats</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{userCoins}</Text>
                  <Text style={styles.statLabel}>Coins</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{userPoints}</Text>
                  <Text style={styles.statLabel}>Points</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{rewardStats.claimedRewards}</Text>
                  <Text style={styles.statLabel}>Claimed</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{rewardStats.totalSpent}</Text>
                  <Text style={styles.statLabel}>Spent</Text>
                </View>
              </View>
            </View>
            
            {/* Affordable Rewards */}
            <View style={styles.affordableSection}>
              <Text style={styles.sectionTitle}>💰 Affordable Rewards</Text>
              {getAffordableRewards().slice(0, 3).map((reward, index) => (
                <TouchableOpacity
                  key={reward.id}
                  style={styles.affordableRewardCard}
                  onPress={() => handleClaimReward(reward.id)}
                >
                  <Text style={styles.affordableRewardIcon}>{reward.icon}</Text>
                  <Text style={styles.affordableRewardName}>{reward.name}</Text>
                  <Text style={styles.affordableRewardCost}>{reward.cost} coins</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        );
        
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>🎁 Rewards</Text>
      
      {/* Balance Display */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceItem}>
          <Text style={styles.balanceAmount}>{userCoins}</Text>
          <Text style={styles.balanceLabel}>Coins</Text>
        </View>
        <View style={styles.balanceItem}>
          <Text style={styles.balanceAmount}>{userPoints}</Text>
          <Text style={styles.balanceLabel}>Points</Text>
        </View>
      </View>
      
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

  balanceCard: {
    backgroundColor: '#1D0A69',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  balanceItem: {
    alignItems: 'center',
  },

  balanceAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },

  balanceLabel: {
    fontSize: 12,
    color: '#E5E7EB',
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

  rewardsContainer: {
    flex: 1,
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

  categoriesContainer: {
    marginBottom: 16,
  },

  categoryTab: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  selectedCategoryTab: {
    backgroundColor: '#1D0A69',
    borderColor: '#1D0A69',
  },

  categoryIcon: {
    fontSize: 14,
    marginRight: 6,
  },

  categoryLabel: {
    fontSize: 12,
    color: '#6B7280',
  },

  selectedCategoryLabel: {
    color: '#FFFFFF',
  },

  rewardCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  unavailableReward: {
    opacity: 0.6,
  },

  claimedReward: {
    borderLeftWidth: 3,
    borderLeftColor: '#22C55E',
  },

  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  rewardIcon: {
    fontSize: 32,
    marginRight: 12,
  },

  rewardInfo: {
    flex: 1,
  },

  rewardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  rewardDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },

  rewardMeta: {
    flexDirection: 'row',
    gap: 8,
  },

  rewardCategory: {
    fontSize: 11,
    fontWeight: '600',
  },

  rewardType: {
    fontSize: 11,
    color: '#6B7280',
  },

  rewardCost: {
    alignItems: 'flex-end',
  },

  costAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 2,
  },

  costLabel: {
    fontSize: 10,
    color: '#6B7280',
  },

  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  claimedBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  claimedBadgeText: {
    color: '#22C55E',
    fontSize: 12,
    fontWeight: '600',
  },

  unavailableBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  unavailableBadgeText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
  },

  insufficientBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  insufficientBadgeText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },

  claimBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  claimBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  historyContainer: {
    flex: 1,
  },

  historyItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  historyIcon: {
    fontSize: 24,
    marginRight: 12,
  },

  historyInfo: {
    flex: 1,
  },

  historyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  historyDate: {
    fontSize: 12,
    color: '#6B7280',
  },

  historyDetails: {
    alignItems: 'flex-end',
  },

  historyCost: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 2,
  },

  historyStatus: {
    fontSize: 11,
    fontWeight: '600',
  },

  statusCompleted: {
    color: '#22C55E',
  },

  statusActive: {
    color: '#3B82F6',
  },

  statusPending: {
    color: '#F59E0B',
  },

  achievementsContainer: {
    flex: 1,
  },

  achievementItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  unlockedAchievement: {
    borderLeftWidth: 3,
    borderLeftColor: '#22C55E',
  },

  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
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
    color: '#6B7280',
  },

  achievementReward: {
    alignItems: 'flex-end',
  },

  achievementCoins: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D0A69',
    marginBottom: 2,
  },

  achievementCoinsLabel: {
    fontSize: 10,
    color: '#6B7280',
  },

  dailyContainer: {
    flex: 1,
    padding: 16,
  },

  dailyBonusCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 14,
    marginBottom: 16,
    elevation: 2,
    alignItems: 'center',
  },

  dailyBonusTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  dailyBonusDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },

  streakInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },

  streakCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
    marginBottom: 4,
  },

  nextBonus: {
    fontSize: 12,
    color: '#6B7280',
  },

  claimBonusBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },

  disabledBonusBtn: {
    backgroundColor: '#D1D5DB',
  },

  claimBonusBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  disabledBonusBtnText: {
    color: '#9CA3AF',
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
    fontSize: 20,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },

  affordableSection: {
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  affordableRewardCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
  },

  affordableRewardIcon: {
    fontSize: 20,
    marginRight: 12,
  },

  affordableRewardName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    flex: 1,
  },

  affordableRewardCost: {
    fontSize: 12,
    color: '#1D0A69',
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
