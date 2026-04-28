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
import { STREAK_DATA, LEVEL_SYSTEM } from '../constants/dummyData';
import { shareRank } from '../services/shareService';

export default function StreakScreen() {
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const getCurrentLevel = () => {
    return LEVEL_SYSTEM.levels.find(level => 
      LEVEL_SYSTEM.currentPoints >= level.minPoints && 
      LEVEL_SYSTEM.currentPoints < level.maxPoints
    ) || LEVEL_SYSTEM.levels[LEVEL_SYSTEM.levels.length - 1];
  };

  const getNextLevel = () => {
    const currentLevelIndex = LEVEL_SYSTEM.levels.findIndex(level => level.name === getCurrentLevel().name);
    return LEVEL_SYSTEM.levels[currentLevelIndex + 1];
  };

  const getProgressToNextLevel = () => {
    const currentLevel = getCurrentLevel();
    const nextLevel = getNextLevel();
    if (!nextLevel) return 100;
    
    const currentProgress = LEVEL_SYSTEM.currentPoints - currentLevel.minPoints;
    const totalNeeded = nextLevel.minPoints - currentLevel.minPoints;
    return (currentProgress / totalNeeded) * 100;
  };

  const getPointsToNextLevel = () => {
    const currentLevel = getCurrentLevel();
    const nextLevel = getNextLevel();
    if (!nextLevel) return 0;
    return nextLevel.minPoints - LEVEL_SYSTEM.currentPoints;
  };

  const shareStreak = () => {
    const message = `🔥 I'm on a ${STREAK_DATA.currentStreak} day streak on CIPSS!

My longest streak: ${STREAK_DATA.longestStreak} days
Current level: ${getCurrentLevel().name} ${getCurrentLevel().icon}
Points: ${LEVEL_SYSTEM.currentPoints}

Join me in making a difference every day! 💚
#CIPSS #Streak #SocialImpact #Consistency`;

    shareRank(STREAK_DATA.currentStreak, 'Daily Streak', STREAK_DATA.currentStreak * 10).then(success => {
      if (success) {
        Alert.alert('Success', 'Your streak has been shared!');
      }
    });
  };

  const renderStreakDay = ({ item, index }) => {
    const isToday = index === STREAK_DATA.streakHistory.length - 1;
    const isActive = item.active;
    
    return (
      <View style={[styles.dayCard, isActive && styles.activeDay, isToday && styles.todayCard]}>
        <Text style={styles.dayDate}>{item.date.split('-').slice(1).join('/')}</Text>
        <Text style={styles.dayStatus}>
          {isActive ? '✅ Active' : '❌ Missed'}
        </Text>
        <Text style={styles.dayPoints}>
          {isActive ? `+${item.points} pts` : '0 pts'}
        </Text>
      </View>
    );
  };

  const renderMilestone = ({ item }) => {
    const achieved = STREAK_DATA.currentStreak >= item.days;
    const isNext = !achieved && STREAK_DATA.currentStreak < item.days;
    
    return (
      <TouchableOpacity
        style={[
          styles.milestoneCard,
          achieved && styles.achievedMilestone,
          isNext && styles.nextMilestone
        ]}
        onPress={() => setSelectedMilestone(item)}
      >
        <View style={styles.milestoneHeader}>
          <Text style={styles.milestoneReward}>{item.reward}</Text>
          <View style={styles.milestoneInfo}>
            <Text style={styles.milestoneName}>{item.name}</Text>
            <Text style={styles.milestoneDays}>{item.days} days</Text>
          </View>
          {achieved && <Text style={styles.achievedBadge}>✓</Text>}
          {isNext && <Text style={styles.nextBadge}>NEXT</Text>}
        </View>
        <Text style={styles.milestonePoints}>+{item.points} points</Text>
      </TouchableOpacity>
    );
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const progressPercentage = getProgressToNextLevel();
  const pointsToNext = getPointsToNextLevel();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🔥 Streak & Level</Text>

        {/* Current Streak Card */}
        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <Text style={styles.streakNumber}>{STREAK_DATA.currentStreak}</Text>
            <Text style={styles.streakLabel}>Day Streak</Text>
          </View>
          <View style={styles.streakStats}>
            <View style={styles.streakStat}>
              <Text style={styles.streakStatValue}>{STREAK_DATA.longestStreak}</Text>
              <Text style={styles.streakStatLabel}>Longest</Text>
            </View>
            <TouchableOpacity style={styles.shareStreakBtn} onPress={shareStreak}>
              <Text style={styles.shareStreakBtnText}>📤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Level Progress Card */}
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelIcon}>{currentLevel.icon}</Text>
            <View style={styles.levelInfo}>
              <Text style={styles.levelName}>{currentLevel.name} Level</Text>
              <Text style={styles.levelPoints}>{LEVEL_SYSTEM.currentPoints} points</Text>
            </View>
          </View>
          
          {nextLevel && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>
                {pointsToNext} points to {nextLevel.name}
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[styles.progressFill, { width: `${progressPercentage}%` }]} 
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(progressPercentage)}%
              </Text>
            </View>
          )}
        </View>

        {/* Level Perks */}
        <View style={styles.perksCard}>
          <Text style={styles.perksTitle}>Current Level Perks:</Text>
          {LEVEL_SYSTEM.levelPerks[currentLevel.name].map((perk, index) => (
            <Text key={index} style={styles.perkItem}>• {perk}</Text>
          ))}
        </View>

        {/* Streak History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <FlatList
            data={STREAK_DATA.streakHistory.slice(-7)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderStreakDay}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>

        {/* Milestones */}
        <View style={styles.milestonesSection}>
          <Text style={styles.sectionTitle}>Streak Milestones</Text>
          <FlatList
            data={STREAK_DATA.streakMilestones}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderMilestone}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>

        {/* Milestone Detail Modal */}
        {selectedMilestone && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalReward}>{selectedMilestone.reward}</Text>
              <Text style={styles.modalTitle}>{selectedMilestone.name}</Text>
              <Text style={styles.modalDescription}>
                Complete a {selectedMilestone.days} day streak to unlock this reward!
              </Text>
              <Text style={styles.modalPoints}>+{selectedMilestone.points} bonus points</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setSelectedMilestone(null)}
              >
                <Text style={styles.modalCloseBtnText}>Close</Text>
              </TouchableOpacity>
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

  streakCard: {
    backgroundColor: '#1D0A69',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 14,
  },

  streakHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },

  streakNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  streakLabel: {
    fontSize: 16,
    color: '#E5E7EB',
  },

  streakStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  streakStat: {
    alignItems: 'center',
  },

  streakStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  streakStatLabel: {
    fontSize: 12,
    color: '#E5E7EB',
  },

  shareStreakBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  shareStreakBtnText: {
    fontSize: 14,
  },

  levelCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 14,
    elevation: 2,
  },

  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  levelIcon: {
    fontSize: 32,
    marginRight: 12,
  },

  levelInfo: {
    flex: 1,
  },

  levelName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  levelPoints: {
    fontSize: 14,
    color: '#6B7280',
  },

  progressContainer: {
    marginTop: 8,
  },

  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#1D0A69',
    borderRadius: 4,
  },

  progressText: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'right',
  },

  perksCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 14,
    elevation: 2,
  },

  perksTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  perkItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },

  historySection: {
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  dayCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },

  activeDay: {
    borderLeftWidth: 3,
    borderLeftColor: '#22C55E',
  },

  todayCard: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },

  dayDate: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },

  dayStatus: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },

  dayPoints: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D0A69',
    flex: 1,
    textAlign: 'right',
  },

  milestonesSection: {
    marginBottom: 16,
  },

  milestoneCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  achievedMilestone: {
    borderLeftWidth: 3,
    borderLeftColor: '#22C55E',
  },

  nextMilestone: {
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },

  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  milestoneReward: {
    fontSize: 24,
    marginRight: 12,
  },

  milestoneInfo: {
    flex: 1,
  },

  milestoneName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  milestoneDays: {
    fontSize: 12,
    color: '#6B7280',
  },

  achievedBadge: {
    fontSize: 16,
    color: '#22C55E',
    fontWeight: '700',
  },

  nextBadge: {
    fontSize: 10,
    color: '#F59E0B',
    fontWeight: '700',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  milestonePoints: {
    fontSize: 12,
    color: '#6B7280',
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
    alignItems: 'center',
  },

  modalReward: {
    fontSize: 48,
    marginBottom: 12,
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
    marginBottom: 16,
    lineHeight: 20,
  },

  modalPoints: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D0A69',
    marginBottom: 20,
  },

  modalCloseBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },

  modalCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
