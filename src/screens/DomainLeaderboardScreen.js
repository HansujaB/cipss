import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  DOMAIN_DATA,
  getDomainLeaderboard,
  getDomainInfo,
  getUserDomainStats,
  getDomainsByPopularity,
  getTrendingDomains,
  getUserBestDomain,
  calculateDomainImpact,
  getRecommendedDomains,
  joinDomain,
} from '../services/domainService';

const { width } = Dimensions.get('window');

export default function DomainLeaderboardScreen() {
  const [selectedDomain, setSelectedDomain] = useState('environment');
  const [activeTab, setActiveTab] = useState('leaderboard');

  const tabs = [
    { key: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { key: 'domains', label: 'Domains', icon: '🌐' },
    { key: 'trending', label: 'Trending', icon: '📈' },
    { key: 'profile', label: 'Your Profile', icon: '👤' },
  ];

  const domainInfo = getDomainInfo(selectedDomain);
  const domainLeaderboard = getDomainLeaderboard(selectedDomain);
  const userStats = getUserDomainStats();
  const userBestDomain = getUserBestDomain();
  const trendingDomains = getTrendingDomains();
  const recommendedDomains = getRecommendedDomains();

  const handleJoinDomain = (domainId, domainName) => {
    const result = joinDomain(domainId);
    if (result.success) {
      // Force re-render by updating state
      setSelectedDomain(domainId);
    }
  };

  const renderDomainCard = ({ item }) => {
    const userRank = domainLeaderboard.findIndex(user => user.id === 'user_current') + 1;
    const isUserInDomain = domainLeaderboard.some(user => user.id === 'user_current');
    
    return (
      <View style={[
        styles.leaderboardCard,
        item.id === 'user_current' && styles.userCard
      ]}>
        <View style={styles.rankSection}>
          <Text style={styles.rank}>#{domainLeaderboard.indexOf(item) + 1}</Text>
          <Text style={styles.badge}>{item.badge}</Text>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={[
            styles.userName,
            item.id === 'user_current' && styles.currentUserName
          ]}>
            {item.name}
          </Text>
          <Text style={styles.userStats}>
            {item.campaigns} campaigns • {item.hours}h
          </Text>
        </View>
        
        <View style={styles.pointsSection}>
          <Text style={styles.points}>{item.points.toLocaleString()}</Text>
          <Text style={styles.pointsLabel}>points</Text>
        </View>
      </View>
    );
  };

  const renderDomainOverview = ({ item }) => {
    const impact = calculateDomainImpact(item.id);
    const userDomainStats = userStats[item.id];
    const isJoined = !!userDomainStats;
    
    return (
      <TouchableOpacity
        style={[
          styles.domainCard,
          selectedDomain === item.id && styles.selectedDomainCard,
          isJoined && styles.joinedDomainCard
        ]}
        onPress={() => setSelectedDomain(item.id)}
      >
        <View style={styles.domainHeader}>
          <Text style={styles.domainIcon}>{item.icon}</Text>
          <View style={styles.domainInfo}>
            <Text style={styles.domainName}>{item.name}</Text>
            <Text style={styles.domainDescription}>{item.description}</Text>
          </View>
          <View style={styles.domainStats}>
            <Text style={styles.volunteerCount}>{item.stats.totalVolunteers}</Text>
            <Text style={styles.volunteerLabel}>volunteers</Text>
          </View>
        </View>
        
        <View style={styles.domainMetrics}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{item.stats.activeCampaigns}</Text>
            <Text style={styles.metricLabel}>Campaigns</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{item.stats.totalHours}</Text>
            <Text style={styles.metricLabel}>Hours</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{impact}</Text>
            <Text style={styles.metricLabel}>Impact</Text>
          </View>
        </View>
        
        {isJoined && (
          <View style={styles.userDomainStats}>
            <Text style={styles.userDomainRank}>Rank #{userDomainStats.rank}</Text>
            <Text style={styles.userDomainLevel}>{userDomainStats.level}</Text>
            <Text style={styles.userDomainPoints}>{userDomainStats.points} pts</Text>
          </View>
        )}
        
        <View style={styles.domainCategories}>
          {item.categories.slice(0, 3).map((category, index) => (
            <Text key={index} style={styles.categoryTag}>{category}</Text>
          ))}
          {item.categories.length > 3 && (
            <Text style={styles.categoryTag}>+{item.categories.length - 3}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderTrendingDomain = ({ item }) => (
    <View style={[
      styles.trendingCard,
      item.trend === 'up' && styles.trendingUp,
      item.trend === 'down' && styles.trendingDown
    ]}>
      <View style={styles.trendingHeader}>
        <Text style={styles.trendingIcon}>{item.domain.icon}</Text>
        <View style={styles.trendingInfo}>
          <Text style={styles.trendingName}>{item.domain.name}</Text>
          <Text style={styles.trendingReason}>{item.reason}</Text>
        </View>
        <View style={styles.trendingGrowth}>
          <Text style={[
            styles.growthText,
            item.trend === 'up' && styles.growthUp,
            item.trend === 'down' && styles.growthDown
          ]}>
            {item.trend === 'up' ? '📈' : item.trend === 'down' ? '📉' : '➡️'} {item.growth}
          </Text>
        </View>
      </View>
      
      <View style={styles.trendingStats}>
        <Text style={styles.trendingStat}>
          {item.domain.stats.totalVolunteers} volunteers
        </Text>
        <Text style={styles.trendingStat}>
          {item.domain.stats.activeCampaigns} campaigns
        </Text>
      </View>
    </View>
  );

  const renderUserProfile = () => {
    const domains = Object.entries(userStats);
    
    return (
      <View style={styles.profileContainer}>
        <View style={styles.profileHeader}>
          <Text style={styles.profileTitle}>Your Domain Performance</Text>
          {userBestDomain && (
            <View style={styles.bestDomainBadge}>
              <Text style={styles.bestDomainIcon}>{userBestDomain.domain.icon}</Text>
              <Text style={styles.bestDomainText}>Best: {userBestDomain.domain.name}</Text>
            </View>
          )}
        </View>
        
        {domains.map(([domainId, stats]) => {
          const domain = getDomainInfo(domainId);
          if (!domain) return null;
          
          return (
            <View key={domainId} style={styles.domainStatCard}>
              <View style={styles.domainStatHeader}>
                <Text style={styles.domainStatIcon}>{domain.icon}</Text>
                <Text style={styles.domainStatName}>{domain.name}</Text>
                <Text style={styles.domainStatLevel}>{stats.level}</Text>
              </View>
              
              <View style={styles.domainStatMetrics}>
                <View style={styles.domainStatMetric}>
                  <Text style={styles.domainStatValue}>#{stats.rank}</Text>
                  <Text style={styles.domainStatLabel}>Rank</Text>
                </View>
                <View style={styles.domainStatMetric}>
                  <Text style={styles.domainStatValue}>{stats.points}</Text>
                  <Text style={styles.domainStatLabel}>Points</Text>
                </View>
                <View style={styles.domainStatMetric}>
                  <Text style={styles.domainStatValue}>{stats.contribution}</Text>
                  <Text style={styles.domainStatLabel}>Contribution</Text>
                </View>
              </View>
            </View>
          );
        })}
        
        {recommendedDomains.length > 0 && (
          <View style={styles.recommendations}>
            <Text style={styles.recommendationsTitle}>Recommended Domains</Text>
            {recommendedDomains.map((domain) => (
              <TouchableOpacity
                key={domain.id}
                style={styles.recommendationCard}
                onPress={() => handleJoinDomain(domain.id, domain.name)}
              >
                <Text style={styles.recommendationIcon}>{domain.icon}</Text>
                <Text style={styles.recommendationName}>{domain.name}</Text>
                <Text style={styles.recommendationAction}>Join</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'leaderboard':
        return (
          <View>
            {domainInfo && (
              <View style={styles.domainHeaderCard}>
                <Text style={styles.domainHeaderIcon}>{domainInfo.icon}</Text>
                <View style={styles.domainHeaderInfo}>
                  <Text style={styles.domainHeaderTitle}>{domainInfo.name}</Text>
                  <Text style={styles.domainHeaderDescription}>{domainInfo.description}</Text>
                </View>
                <View style={styles.domainHeaderStats}>
                  <Text style={styles.domainHeaderVolunteers}>
                    {domainInfo.stats.totalVolunteers} volunteers
                  </Text>
                </View>
              </View>
            )}
            <FlatList
              data={domainLeaderboard}
              keyExtractor={(item) => item.id}
              renderItem={renderDomainCard}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
        
      case 'domains':
        return (
          <FlatList
            data={getDomainsByPopularity()}
            keyExtractor={(item) => item.id}
            renderItem={renderDomainOverview}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
          />
        );
        
      case 'trending':
        return (
          <FlatList
            data={trendingDomains}
            keyExtractor={(item) => item.domainId}
            renderItem={renderTrendingDomain}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
          />
        );
        
      case 'profile':
        return (
          <ScrollView style={styles.profileScroll} showsVerticalScrollIndicator={false}>
            {renderUserProfile()}
          </ScrollView>
        );
        
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>🌐 Domain Leaderboards</Text>
      
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

  domainHeaderCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  domainHeaderIcon: {
    fontSize: 32,
    marginRight: 12,
  },

  domainHeaderInfo: {
    flex: 1,
  },

  domainHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  domainHeaderDescription: {
    fontSize: 13,
    color: '#6B7280',
  },

  domainHeaderStats: {
    alignItems: 'flex-end',
  },

  domainHeaderVolunteers: {
    fontSize: 12,
    color: '#1D0A69',
    fontWeight: '600',
  },

  leaderboardCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  userCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#1D0A69',
    backgroundColor: '#F0F9FF',
  },

  rankSection: {
    alignItems: 'center',
    marginRight: 16,
  },

  rank: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  badge: {
    fontSize: 20,
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  currentUserName: {
    color: '#1D0A69',
  },

  userStats: {
    fontSize: 12,
    color: '#6B7280',
  },

  pointsSection: {
    alignItems: 'flex-end',
  },

  points: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 2,
  },

  pointsLabel: {
    fontSize: 10,
    color: '#6B7280',
  },

  domainCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  selectedDomainCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#1D0A69',
  },

  joinedDomainCard: {
    backgroundColor: '#F0FDF4',
  },

  domainHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  domainIcon: {
    fontSize: 28,
    marginRight: 12,
  },

  domainInfo: {
    flex: 1,
  },

  domainName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  domainDescription: {
    fontSize: 13,
    color: '#6B7280',
  },

  domainStats: {
    alignItems: 'flex-end',
  },

  volunteerCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 2,
  },

  volunteerLabel: {
    fontSize: 10,
    color: '#6B7280',
  },

  domainMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },

  metric: {
    alignItems: 'center',
  },

  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  metricLabel: {
    fontSize: 10,
    color: '#6B7280',
  },

  userDomainStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },

  userDomainRank: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  userDomainLevel: {
    fontSize: 12,
    color: '#1D0A69',
  },

  userDomainPoints: {
    fontSize: 12,
    color: '#6B7280',
  },

  domainCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  categoryTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
    color: '#6B7280',
  },

  trendingCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  trendingUp: {
    borderLeftWidth: 3,
    borderLeftColor: '#22C55E',
  },

  trendingDown: {
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },

  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  trendingIcon: {
    fontSize: 24,
    marginRight: 12,
  },

  trendingInfo: {
    flex: 1,
  },

  trendingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  trendingReason: {
    fontSize: 12,
    color: '#6B7280',
  },

  trendingGrowth: {
    alignItems: 'flex-end',
  },

  growthText: {
    fontSize: 14,
    fontWeight: '600',
  },

  growthUp: {
    color: '#22C55E',
  },

  growthDown: {
    color: '#EF4444',
  },

  trendingStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  trendingStat: {
    fontSize: 12,
    color: '#6B7280',
  },

  profileScroll: {
    flex: 1,
  },

  profileContainer: {
    padding: 16,
  },

  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  profileTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  bestDomainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  bestDomainIcon: {
    fontSize: 16,
    marginRight: 6,
  },

  bestDomainText: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '600',
  },

  domainStatCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },

  domainStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  domainStatIcon: {
    fontSize: 20,
    marginRight: 8,
  },

  domainStatName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    flex: 1,
  },

  domainStatLevel: {
    fontSize: 12,
    color: '#1D0A69',
    fontWeight: '600',
  },

  domainStatMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  domainStatMetric: {
    alignItems: 'center',
  },

  domainStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  domainStatLabel: {
    fontSize: 10,
    color: '#6B7280',
  },

  recommendations: {
    marginTop: 20,
  },

  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  recommendationCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
  },

  recommendationIcon: {
    fontSize: 20,
    marginRight: 12,
  },

  recommendationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    flex: 1,
  },

  recommendationAction: {
    fontSize: 12,
    color: '#1D0A69',
    fontWeight: '600',
  },
});
