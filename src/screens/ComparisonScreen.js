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

export const COMPARISON_DATA = {
  currentUser: {
    id: 'user_current',
    name: 'You',
    rank: 7,
    campaigns: 12,
    points: 680,
    hours: 78,
    badges: ['🌟', '💚', '🔥', '🏆'],
    streak: 7,
    level: 'Bronze',
    skills: {
      leadership: 75,
      communication: 85,
      projectManagement: 60,
      fundraising: 45,
      teaching: 90,
      environmental: 70,
    },
    achievements: 15,
    teamCount: 2,
    followers: 4,
  },
  topUsers: [
    {
      id: 'user_1',
      name: 'Rahul Sharma',
      rank: 1,
      campaigns: 18,
      points: 2450,
      hours: 156,
      badges: ['🏆', '🌟', '💚', '👑', '🔥', '🎖️'],
      streak: 45,
      level: 'Gold',
      skills: {
        leadership: 95,
        communication: 88,
        projectManagement: 92,
        fundraising: 85,
        teaching: 75,
        environmental: 90,
      },
      achievements: 28,
      teamCount: 3,
      followers: 12,
    },
    {
      id: 'user_2',
      name: 'Priya Patel',
      rank: 2,
      campaigns: 15,
      points: 2100,
      hours: 134,
      badges: ['🏆', '🌟', '💚', '👑', '🔥'],
      streak: 30,
      level: 'Gold',
      skills: {
        leadership: 88,
        communication: 92,
        projectManagement: 78,
        fundraising: 90,
        teaching: 85,
        environmental: 85,
      },
      achievements: 24,
      teamCount: 2,
      followers: 10,
    },
    {
      id: 'user_3',
      name: 'Amit Kumar',
      rank: 3,
      campaigns: 14,
      points: 1850,
      hours: 128,
      badges: ['🏆', '🌟', '💚', '👑', '🎖️'],
      streak: 25,
      level: 'Silver',
      skills: {
        leadership: 82,
        communication: 85,
        projectManagement: 88,
        fundraising: 75,
        teaching: 80,
        environmental: 88,
      },
      achievements: 22,
      teamCount: 4,
      followers: 8,
    },
  ],
  similarUsers: [
    {
      id: 'user_4',
      name: 'Sneha Reddy',
      rank: 5,
      campaigns: 13,
      points: 1200,
      hours: 98,
      badges: ['🌟', '💚', '🔥', '🏆'],
      streak: 15,
      level: 'Silver',
      skills: {
        leadership: 78,
        communication: 87,
        projectManagement: 72,
        fundraising: 65,
        teaching: 88,
        environmental: 75,
      },
      achievements: 18,
      teamCount: 2,
      followers: 6,
      similarity: 85,
    },
    {
      id: 'user_5',
      name: 'Vikram Singh',
      rank: 8,
      campaigns: 11,
      points: 650,
      hours: 72,
      badges: ['🌟', '💚', '🔥'],
      streak: 10,
      level: 'Bronze',
      skills: {
        leadership: 70,
        communication: 82,
        projectManagement: 68,
        fundraising: 55,
        teaching: 85,
        environmental: 68,
      },
      achievements: 14,
      teamCount: 1,
      followers: 3,
      similarity: 78,
    },
  ],
  comparisonMetrics: [
    { key: 'rank', label: 'Rank', icon: '🏆', lowerIsBetter: true },
    { key: 'campaigns', label: 'Campaigns', icon: '📋', lowerIsBetter: false },
    { key: 'points', label: 'Points', icon: '⭐', lowerIsBetter: false },
    { key: 'hours', label: 'Hours', icon: '⏰', lowerIsBetter: false },
    { key: 'streak', label: 'Streak', icon: '🔥', lowerIsBetter: false },
    { key: 'achievements', label: 'Achievements', icon: '🎖️', lowerIsBetter: false },
    { key: 'followers', label: 'Followers', icon: '👥', lowerIsBetter: false },
  ],
};

export default function ComparisonScreen() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [comparisonMode, setComparisonMode] = useState('top');
  const [searchQuery, setSearchQuery] = useState('');

  const modes = [
    { key: 'top', label: 'Top Performers', icon: '🏆' },
    { key: 'similar', label: 'Similar Users', icon: '👥' },
    { key: 'custom', label: 'Custom', icon: '🔍' },
  ];

  const getUsersForComparison = () => {
    switch (comparisonMode) {
      case 'top':
        return COMPARISON_DATA.topUsers;
      case 'similar':
        return COMPARISON_DATA.similarUsers;
      case 'custom':
        return COMPARISON_DATA.topUsers.filter(user =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      default:
        return COMPARISON_DATA.topUsers;
    }
  };

  const getComparisonValue = (user, metric) => {
    return user[metric.key] || 0;
  };

  const getComparisonPercentage = (userValue, currentUserValue, lowerIsBetter) => {
    if (lowerIsBetter) {
      return currentUserValue <= userValue ? 100 : Math.round((userValue / currentUserValue) * 100);
    } else {
      return currentUserValue >= userValue ? 100 : Math.round((currentUserValue / userValue) * 100);
    }
  };

  const getComparisonColor = (percentage) => {
    if (percentage >= 100) return '#22C55E';
    if (percentage >= 75) return '#F59E0B';
    return '#EF4444';
  };

  const renderComparisonBar = (currentUserValue, userValue, lowerIsBetter) => {
    const percentage = getComparisonPercentage(userValue, currentUserValue, lowerIsBetter);
    const color = getComparisonColor(percentage);
    
    return (
      <View style={styles.comparisonBar}>
        <View style={styles.comparisonBarBackground}>
          <View
            style={[
              styles.comparisonBarFill,
              {
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: color,
              }
            ]}
          />
        </View>
        <Text style={[styles.comparisonPercentage, { color }]}>
          {percentage}%
        </Text>
      </View>
    );
  };

  const renderMetricComparison = (metric) => {
    const currentUserValue = getComparisonValue(COMPARISON_DATA.currentUser, metric);
    const selectedUserValue = selectedUser ? getComparisonValue(selectedUser, metric) : 0;
    
    return (
      <View key={metric.key} style={styles.metricCard}>
        <View style={styles.metricHeader}>
          <Text style={styles.metricIcon}>{metric.icon}</Text>
          <Text style={styles.metricLabel}>{metric.label}</Text>
        </View>
        
        <View style={styles.metricValues}>
          <View style={styles.metricValue}>
            <Text style={styles.metricValueText}>{currentUserValue}</Text>
            <Text style={styles.metricValueLabel}>You</Text>
          </View>
          
          {selectedUser && (
            <View style={styles.metricValue}>
              <Text style={styles.metricValueText}>{selectedUserValue}</Text>
              <Text style={styles.metricValueLabel}>{selectedUser.name}</Text>
            </View>
          )}
        </View>
        
        {selectedUser && renderComparisonBar(currentUserValue, selectedUserValue, metric.lowerIsBetter)}
      </View>
    );
  };

  const renderSkillComparison = (skillName, skillKey) => {
    const currentUserSkill = COMPARISON_DATA.currentUser.skills[skillKey];
    const selectedUserSkill = selectedUser ? selectedUser.skills[skillKey] : 0;
    
    return (
      <View key={skillKey} style={styles.skillComparison}>
        <Text style={styles.skillName}>{skillName}</Text>
        <View style={styles.skillBars}>
          <View style={styles.skillBarContainer}>
            <Text style={styles.skillValue}>{currentUserSkill}</Text>
            <View style={styles.skillBar}>
              <View
                style={[
                  styles.skillBarFill,
                  { width: `${currentUserSkill}%` }
                ]}
              />
            </View>
          </View>
          
          {selectedUser && (
            <View style={styles.skillBarContainer}>
              <Text style={styles.skillValue}>{selectedUserSkill}</Text>
              <View style={styles.skillBar}>
                <View
                  style={[
                    styles.skillBarFill,
                    { 
                      width: `${selectedUserSkill}%`,
                      backgroundColor: '#22C55E'
                    }
                  ]}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderUserCard = ({ item }) => {
    const isSelected = selectedUser?.id === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.userCard,
          isSelected && styles.selectedUserCard
        ]}
        onPress={() => setSelectedUser(isSelected ? null : item)}
      >
        <View style={styles.userHeader}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>{item.name.charAt(0)}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userRank}>Rank #{item.rank}</Text>
            <Text style={styles.userLevel}>{item.level} Level</Text>
          </View>
          <View style={styles.userBadges}>
            {item.badges.slice(0, 3).map((badge, index) => (
              <Text key={index} style={styles.userBadge}>{badge}</Text>
            ))}
          </View>
        </View>

        <View style={styles.userStats}>
          <View style={styles.userStat}>
            <Text style={styles.userStatValue}>{item.campaigns}</Text>
            <Text style={styles.userStatLabel}>Campaigns</Text>
          </View>
          <View style={styles.userStat}>
            <Text style={styles.userStatValue}>{item.points}</Text>
            <Text style={styles.userStatLabel}>Points</Text>
          </View>
          <View style={styles.userStat}>
            <Text style={styles.userStatValue}>{item.hours}</Text>
            <Text style={styles.userStatLabel}>Hours</Text>
          </View>
        </View>

        {item.similarity && (
          <View style={styles.similarityBadge}>
            <Text style={styles.similarityText}>{item.similarity}% similar</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const users = getUsersForComparison();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>⚖️ User Comparison</Text>

        {/* Mode Selector */}
        <View style={styles.modeTabs}>
          {modes.map((mode) => (
            <TouchableOpacity
              key={mode.key}
              style={[
                styles.modeTab,
                comparisonMode === mode.key && styles.modeTabActive
              ]}
              onPress={() => setComparisonMode(mode.key)}
            >
              <Text style={styles.modeTabIcon}>{mode.icon}</Text>
              <Text style={[
                styles.modeTabLabel,
                comparisonMode === mode.key && styles.modeTabLabelActive
              ]}>
                {mode.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search for Custom Mode */}
        {comparisonMode === 'custom' && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search users to compare..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        )}

        {/* Users List */}
        <View style={styles.usersSection}>
          <Text style={styles.sectionTitle}>
            {comparisonMode === 'top' && 'Top Performers'}
            {comparisonMode === 'similar' && 'Similar Users'}
            {comparisonMode === 'custom' && 'Search Results'}
          </Text>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={renderUserCard}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No users found</Text>
              </View>
            }
          />
        </View>

        {/* Comparison Results */}
        {selectedUser && (
          <View style={styles.comparisonSection}>
            <Text style={styles.sectionTitle}>
              You vs {selectedUser.name}
            </Text>

            {/* Metrics Comparison */}
            <View style={styles.metricsContainer}>
              {COMPARISON_DATA.comparisonMetrics.map(renderMetricComparison)}
            </View>

            {/* Skills Comparison */}
            <View style={styles.skillsSection}>
              <Text style={styles.skillsTitle}>Skills Comparison</Text>
              {Object.keys(COMPARISON_DATA.currentUser.skills).map(skillKey => {
                const skillName = skillKey.replace(/([A-Z])/g, ' $1').trim();
                const formattedName = skillName.charAt(0).toUpperCase() + skillName.slice(1);
                return renderSkillComparison(formattedName, skillKey);
              })}
            </View>

            {/* Insights */}
            <View style={styles.insightsSection}>
              <Text style={styles.insightsTitle}>🤖 Comparison Insights</Text>
              <View style={styles.insightCard}>
                <Text style={styles.insightText}>
                  {selectedUser.rank < COMPARISON_DATA.currentUser.rank 
                    ? `${selectedUser.name} ranks ${COMPARISON_DATA.currentUser.rank - selectedUser.rank} positions ahead of you. Focus on ${selectedUser.campaigns - COMPARISON_DATA.currentUser.campaigns > 0 ? 'completing more campaigns' : 'improving your campaign quality'} to close the gap.`
                    : `You're ahead of ${selectedUser.name} by ${selectedUser.rank - COMPARISON_DATA.currentUser.rank} positions! Keep up the great work.`
                  }
                </Text>
              </View>
            </View>
          </View>
        )}
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

  modeTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },

  modeTab: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  modeTabActive: {
    backgroundColor: '#1D0A69',
    borderColor: '#1D0A69',
  },

  modeTabIcon: {
    fontSize: 16,
    marginBottom: 4,
  },

  modeTabLabel: {
    fontSize: 10,
    color: '#6B7280',
  },

  modeTabLabelActive: {
    color: '#FFFFFF',
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

  usersSection: {
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  userCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  selectedUserCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#1D0A69',
    backgroundColor: '#F0F9FF',
  },

  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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

  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  userRank: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
    marginBottom: 2,
  },

  userLevel: {
    fontSize: 11,
    color: '#6B7280',
  },

  userBadges: {
    flexDirection: 'row',
    gap: 4,
  },

  userBadge: {
    fontSize: 16,
  },

  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },

  userStat: {
    alignItems: 'center',
  },

  userStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  userStatLabel: {
    fontSize: 10,
    color: '#6B7280',
  },

  similarityBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },

  similarityText: {
    fontSize: 11,
    color: '#22C55E',
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

  comparisonSection: {
    marginBottom: 16,
  },

  metricsContainer: {
    paddingHorizontal: 16,
  },

  metricCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  metricIcon: {
    fontSize: 20,
    marginRight: 8,
  },

  metricLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  metricValues: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },

  metricValue: {
    alignItems: 'center',
  },

  metricValueText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 2,
  },

  metricValueLabel: {
    fontSize: 11,
    color: '#6B7280',
  },

  comparisonBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  comparisonBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },

  comparisonBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  comparisonPercentage: {
    fontSize: 12,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },

  skillsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  skillsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  skillComparison: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
  },

  skillName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  skillBars: {
    flexDirection: 'row',
    gap: 12,
  },

  skillBarContainer: {
    flex: 1,
    alignItems: 'center',
  },

  skillValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  skillBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },

  skillBarFill: {
    height: '100%',
    backgroundColor: '#1D0A69',
    borderRadius: 3,
  },

  insightsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  insightsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  insightCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
    elevation: 2,
  },

  insightText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
});
