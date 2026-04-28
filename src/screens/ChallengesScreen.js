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
  Animated,
} from 'react-native';

export const CHALLENGES = {
  weekly: [
    {
      id: 'weekly_1',
      title: 'Eco Warrior Week',
      description: 'Complete 3 environmental campaigns',
      icon: '🌱',
      type: 'weekly',
      progress: 1,
      total: 3,
      reward: '🌟 +100 points',
      deadline: '2024-04-30',
      difficulty: 'Medium',
    },
    {
      id: 'weekly_2',
      title: 'Social Butterfly',
      description: 'Share 5 achievements on social media',
      icon: '🦋',
      type: 'weekly',
      progress: 2,
      total: 5,
      reward: '📱 +75 points',
      deadline: '2024-04-30',
      difficulty: 'Easy',
    },
    {
      id: 'weekly_3',
      title: 'Fundraising Hero',
      description: 'Raise ₹5,000 for any campaign',
      icon: '💰',
      type: 'weekly',
      progress: 2000,
      total: 5000,
      reward: '💎 +200 points',
      deadline: '2024-04-30',
      difficulty: 'Hard',
    },
  ],
  monthly: [
    {
      id: 'monthly_1',
      title: 'Consistency King',
      description: 'Maintain a 15-day streak',
      icon: '👑',
      type: 'monthly',
      progress: 7,
      total: 15,
      reward: '🔥 +500 points',
      deadline: '2024-05-31',
      difficulty: 'Hard',
    },
    {
      id: 'monthly_2',
      title: 'Campaign Collector',
      description: 'Complete 10 different campaigns',
      icon: '📋',
      type: 'monthly',
      progress: 3,
      total: 10,
      reward: '🏆 +300 points',
      deadline: '2024-05-31',
      difficulty: 'Medium',
    },
    {
      id: 'monthly_3',
      title: 'Team Player',
      description: 'Join 5 team campaigns',
      icon: '🤝',
      type: 'monthly',
      progress: 1,
      total: 5,
      reward: '👥 +150 points',
      deadline: '2024-05-31',
      difficulty: 'Easy',
    },
  ],
  special: [
    {
      id: 'special_1',
      title: 'Earth Day Champion',
      description: 'Plant 50 trees or recycle 200kg waste',
      icon: '🌍',
      type: 'special',
      progress: 25,
      total: 50,
      reward: '🌟 +1000 points',
      deadline: '2024-04-22',
      difficulty: 'Legendary',
      isExpired: true,
    },
    {
      id: 'special_2',
      title: 'Summer Impact Drive',
      description: 'Complete any 20 campaigns in summer',
      icon: '☀️',
      type: 'special',
      progress: 0,
      total: 20,
      reward: '🏅 +750 points',
      deadline: '2024-06-21',
      difficulty: 'Hard',
    },
  ],
};

export default function ChallengesScreen() {
  const [activeTab, setActiveTab] = useState('weekly');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [animatingChallenge, setAnimatingChallenge] = useState(null);

  const tabs = [
    { key: 'weekly', label: 'Weekly', icon: '📅' },
    { key: 'monthly', label: 'Monthly', icon: '🗓️' },
    { key: 'special', label: 'Special', icon: '⭐' },
  ];

  const getChallengesByType = (type) => {
    return CHALLENGES[type] || [];
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#22C55E';
      case 'Medium': return '#F59E0B';
      case 'Hard': return '#EF4444';
      case 'Legendary': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getProgressPercentage = (progress, total) => {
    return Math.min((progress / total) * 100, 100);
  };

  const handleJoinChallenge = (challenge) => {
    Alert.alert(
      'Join Challenge',
      `Are you ready to take on "${challenge.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Join!', 
          onPress: () => {
            setAnimatingChallenge(challenge.id);
            setTimeout(() => setAnimatingChallenge(null), 1000);
            Alert.alert('Success!', 'You joined the challenge!');
          }
        }
      ]
    );
  };

  const renderChallengeCard = ({ item }) => {
    const progressPercentage = getProgressPercentage(item.progress, item.total);
    const isCompleted = item.progress >= item.total;
    const isAnimating = animatingChallenge === item.id;
    const isExpired = item.isExpired;

    return (
      <TouchableOpacity
        style={[
          styles.challengeCard,
          isAnimating && styles.animatingCard,
          isCompleted && styles.completedCard,
          isExpired && styles.expiredCard
        ]}
        onPress={() => setSelectedChallenge(item)}
        disabled={isExpired}
      >
        <View style={styles.challengeHeader}>
          <Text style={styles.challengeIcon}>{item.icon}</Text>
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeTitle}>{item.title}</Text>
            <Text style={styles.challengeDescription}>{item.description}</Text>
          </View>
          <View style={styles.challengeStatus}>
            <Text style={[
              styles.difficultyBadge,
              { color: getDifficultyColor(item.difficulty) }
            ]}>
              {item.difficulty}
            </Text>
            {isCompleted && <Text style={styles.completedBadge}>✓</Text>}
            {isExpired && <Text style={styles.expiredBadge}>EXPIRED</Text>}
          </View>
        </View>

        <View style={styles.challengeProgress}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {item.progress}/{item.total}
            </Text>
            <Text style={styles.progressPercentage}>
              {Math.round(progressPercentage)}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { 
                  width: `${progressPercentage}%`,
                  backgroundColor: isCompleted ? '#22C55E' : '#1D0A69'
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.challengeFooter}>
          <Text style={styles.challengeReward}>{item.reward}</Text>
          <Text style={styles.challengeDeadline}>
            Due: {new Date(item.deadline).toLocaleDateString()}
          </Text>
        </View>

        {!isCompleted && !isExpired && (
          <TouchableOpacity
            style={styles.joinBtn}
            onPress={() => handleJoinChallenge(item)}
          >
            <Text style={styles.joinBtnText}>JOIN</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const renderChallengeDetail = () => {
    if (!selectedChallenge) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalIcon}>{selectedChallenge.icon}</Text>
          <Text style={styles.modalTitle}>{selectedChallenge.title}</Text>
          <Text style={styles.modalDescription}>{selectedChallenge.description}</Text>
          
          <View style={styles.modalStats}>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatLabel}>Progress</Text>
              <Text style={styles.modalStatValue}>
                {selectedChallenge.progress}/{selectedChallenge.total}
              </Text>
            </View>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatLabel}>Difficulty</Text>
              <Text style={[
                styles.modalStatValue,
                { color: getDifficultyColor(selectedChallenge.difficulty) }
              ]}>
                {selectedChallenge.difficulty}
              </Text>
            </View>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatLabel}>Reward</Text>
              <Text style={styles.modalStatValue}>{selectedChallenge.reward}</Text>
            </View>
          </View>

          <Text style={styles.modalDeadline}>
            Deadline: {new Date(selectedChallenge.deadline).toLocaleDateString()}
          </Text>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setSelectedChallenge(null)}
            >
              <Text style={styles.modalCloseBtnText}>Close</Text>
            </TouchableOpacity>
            {!selectedChallenge.isExpired && selectedChallenge.progress < selectedChallenge.total && (
              <TouchableOpacity
                style={styles.modalJoinBtn}
                onPress={() => {
                  handleJoinChallenge(selectedChallenge);
                  setSelectedChallenge(null);
                }}
              >
                <Text style={styles.modalJoinBtnText}>Join Challenge</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const challenges = getChallengesByType(activeTab);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🎯 Challenges</Text>

        {/* Stats Overview */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>850</Text>
            <Text style={styles.statLabel}>Points Earned</Text>
          </View>
        </View>

        {/* Challenge Tabs */}
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

        {/* Challenges List */}
        <FlatList
          data={challenges}
          keyExtractor={(item) => item.id}
          renderItem={renderChallengeCard}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </ScrollView>

      {/* Challenge Detail Modal */}
      {renderChallengeDetail()}
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
  },

  tabActive: {
    backgroundColor: '#1D0A69',
    borderColor: '#1D0A69',
  },

  tabIcon: {
    fontSize: 16,
    marginBottom: 4,
  },

  tabLabel: {
    fontSize: 12,
    color: '#6B7280',
  },

  tabLabelActive: {
    color: '#FFFFFF',
  },

  challengeCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },

  animatingCard: {
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },

  completedCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#22C55E',
  },

  expiredCard: {
    opacity: 0.6,
    backgroundColor: '#F9FAFB',
  },

  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  challengeIcon: {
    fontSize: 32,
    marginRight: 12,
  },

  challengeInfo: {
    flex: 1,
  },

  challengeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  challengeDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },

  challengeStatus: {
    alignItems: 'flex-end',
  },

  difficultyBadge: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },

  completedBadge: {
    fontSize: 16,
    color: '#22C55E',
    fontWeight: '700',
  },

  expiredBadge: {
    fontSize: 8,
    color: '#FFFFFF',
    backgroundColor: '#EF4444',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '600',
  },

  challengeProgress: {
    marginBottom: 12,
  },

  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },

  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D0A69',
  },

  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 3,
  },

  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  challengeReward: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D0A69',
  },

  challengeDeadline: {
    fontSize: 12,
    color: '#6B7280',
  },

  joinBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },

  joinBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },

  modalIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
    textAlign: 'center',
  },

  modalDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },

  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },

  modalStat: {
    alignItems: 'center',
  },

  modalStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  modalStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  modalDeadline: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },

  modalActions: {
    flexDirection: 'row',
    gap: 8,
  },

  modalCloseBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },

  modalCloseBtnText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },

  modalJoinBtn: {
    flex: 1,
    backgroundColor: '#1D0A69',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },

  modalJoinBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
