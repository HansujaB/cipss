import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export const IMPACT_DATA = {
  overview: {
    totalCampaigns: 12,
    totalHours: 156,
    totalImpact: 'High',
    contributionValue: 45000,
  },
  categories: [
    {
      name: 'Environment',
      icon: '🌱',
      value: 35,
      color: '#22C55E',
      campaigns: 5,
      hours: 65,
      description: 'Tree planting, waste management',
    },
    {
      name: 'Education',
      icon: '📚',
      value: 25,
      color: '#3B82F6',
      campaigns: 3,
      hours: 45,
      description: 'Teaching, mentoring students',
    },
    {
      name: 'Health',
      icon: '💊',
      value: 20,
      color: '#EF4444',
      campaigns: 2,
      hours: 28,
      description: 'Health camps, awareness drives',
    },
    {
      name: 'Community',
      icon: '🤝',
      value: 20,
      color: '#F59E0B',
      campaigns: 2,
      hours: 18,
      description: 'Community service, events',
    },
  ],
  monthlyProgress: [
    { month: 'Jan', impact: 65 },
    { month: 'Feb', impact: 78 },
    { month: 'Mar', impact: 92 },
    { month: 'Apr', impact: 85 },
  ],
  achievements: [
    { title: 'Eco Warrior', icon: '🌍', date: '2024-04-15' },
    { title: 'Top Contributor', icon: '🏆', date: '2024-04-10' },
    { title: '30 Day Streak', icon: '🔥', date: '2024-04-01' },
  ],
  recentActivities: [
    { activity: 'Beach Cleanup', date: '2024-04-20', impact: '+15 points' },
    { activity: 'Teaching Session', date: '2024-04-18', impact: '+20 points' },
    { activity: 'Health Camp', date: '2024-04-15', impact: '+25 points' },
    { activity: 'Tree Plantation', date: '2024-04-12', impact: '+18 points' },
  ],
};

export default function ImpactDashboardScreen() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [timeRange, setTimeRange] = useState('month');

  const timeRanges = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
  ];

  const renderOverviewCard = () => {
    return (
      <View style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>Your Impact Overview</Text>
        <View style={styles.overviewStats}>
          <View style={styles.overviewStat}>
            <Text style={styles.overviewStatValue}>{IMPACT_DATA.overview.totalCampaigns}</Text>
            <Text style={styles.overviewStatLabel}>Campaigns</Text>
          </View>
          <View style={styles.overviewStat}>
            <Text style={styles.overviewStatValue}>{IMPACT_DATA.overview.totalHours}</Text>
            <Text style={styles.overviewStatLabel}>Hours</Text>
          </View>
          <View style={styles.overviewStat}>
            <Text style={styles.overviewStatValue}>₹{IMPACT_DATA.overview.contributionValue.toLocaleString()}</Text>
            <Text style={styles.overviewStatLabel}>Value</Text>
          </View>
        </View>
        <View style={styles.impactBadge}>
          <Text style={styles.impactBadgeText}>Overall Impact: {IMPACT_DATA.overview.totalImpact}</Text>
        </View>
      </View>
    );
  };

  const renderCategoryBreakdown = () => {
    return (
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Impact by Category</Text>
        {IMPACT_DATA.categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryItem}
            onPress={() => setSelectedCategory(category)}
          >
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>
              <Text style={styles.categoryValue}>{category.value}%</Text>
            </View>
            <View style={styles.categoryBar}>
              <View 
                style={[
                  styles.categoryFill,
                  { 
                    width: `${category.value}%`,
                    backgroundColor: category.color 
                  }
                ]} 
              />
            </View>
            <View style={styles.categoryStats}>
              <Text style={styles.categoryStat}>{category.campaigns} campaigns</Text>
              <Text style={styles.categoryStat}>{category.hours} hours</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderProgressChart = () => {
    const maxValue = Math.max(...IMPACT_DATA.monthlyProgress.map(p => p.impact));
    
    return (
      <View style={styles.sectionCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.sectionTitle}>Monthly Progress</Text>
          <View style={styles.timeRangeTabs}>
            {timeRanges.map((range) => (
              <TouchableOpacity
                key={range.key}
                style={[
                  styles.timeRangeTab,
                  timeRange === range.key && styles.timeRangeTabActive
                ]}
                onPress={() => setTimeRange(range.key)}
              >
                <Text style={[
                  styles.timeRangeTabText,
                  timeRange === range.key && styles.timeRangeTabTextActive
                ]}>
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.chartContainer}>
          {IMPACT_DATA.monthlyProgress.map((month, index) => (
            <View key={index} style={styles.chartBar}>
              <View style={styles.chartBarContainer}>
                <View 
                  style={[
                    styles.chartBarFill,
                    { 
                      height: `${(month.impact / maxValue) * 120}px`,
                    }
                  ]} 
                />
              </View>
              <Text style={styles.chartBarLabel}>{month.month}</Text>
              <Text style={styles.chartBarValue}>{month.impact}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderAchievements = () => {
    return (
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        <View style={styles.achievementsList}>
          {IMPACT_DATA.achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementItem}>
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDate}>
                  {new Date(achievement.date).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderRecentActivities = () => {
    return (
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        {IMPACT_DATA.recentActivities.map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={styles.activityDot} />
            <View style={styles.activityInfo}>
              <Text style={styles.activityName}>{activity.activity}</Text>
              <Text style={styles.activityDate}>
                {new Date(activity.date).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.activityImpact}>{activity.impact}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderCategoryDetail = () => {
    if (!selectedCategory) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalIcon}>{selectedCategory.icon}</Text>
          <Text style={styles.modalTitle}>{selectedCategory.name}</Text>
          <Text style={styles.modalDescription}>{selectedCategory.description}</Text>
          
          <View style={styles.modalStats}>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatValue}>{selectedCategory.campaigns}</Text>
              <Text style={styles.modalStatLabel}>Campaigns</Text>
            </View>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatValue}>{selectedCategory.hours}</Text>
              <Text style={styles.modalStatLabel}>Hours</Text>
            </View>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatValue}>{selectedCategory.value}%</Text>
              <Text style={styles.modalStatLabel}>Impact Share</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={styles.modalCloseBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>📊 Impact Dashboard</Text>

        {renderOverviewCard()}
        {renderCategoryBreakdown()}
        {renderProgressChart()}
        {renderAchievements()}
        {renderRecentActivities()}

        {renderCategoryDetail()}
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

  overviewCard: {
    backgroundColor: '#1D0A69',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 14,
  },

  overviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },

  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },

  overviewStat: {
    alignItems: 'center',
  },

  overviewStatValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },

  overviewStatLabel: {
    fontSize: 12,
    color: '#E5E7EB',
  },

  impactBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },

  impactBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 14,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 16,
  },

  categoryItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },

  categoryInfo: {
    flex: 1,
  },

  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  categoryDescription: {
    fontSize: 12,
    color: '#6B7280',
  },

  categoryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D0A69',
  },

  categoryBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },

  categoryFill: {
    height: '100%',
    borderRadius: 4,
  },

  categoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  categoryStat: {
    fontSize: 12,
    color: '#6B7280',
  },

  chartHeader: {
    marginBottom: 16,
  },

  timeRangeTabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
    marginTop: 8,
  },

  timeRangeTab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
  },

  timeRangeTabActive: {
    backgroundColor: '#FFFFFF',
  },

  timeRangeTabText: {
    fontSize: 12,
    color: '#6B7280',
  },

  timeRangeTabTextActive: {
    color: '#1D0A69',
    fontWeight: '600',
  },

  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
    paddingHorizontal: 10,
  },

  chartBar: {
    alignItems: 'center',
    flex: 1,
  },

  chartBarContainer: {
    width: 30,
    height: 120,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },

  chartBarFill: {
    width: '100%',
    backgroundColor: '#1D0A69',
    borderRadius: 4,
  },

  chartBarLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },

  chartBarValue: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1D0A69',
    marginTop: 2,
  },

  achievementsList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  achievementItem: {
    alignItems: 'center',
    flex: 1,
  },

  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },

  achievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 2,
  },

  achievementDate: {
    fontSize: 10,
    color: '#6B7280',
  },

  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1D0A69',
    marginRight: 12,
  },

  activityInfo: {
    flex: 1,
  },

  activityName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  activityDate: {
    fontSize: 12,
    color: '#6B7280',
  },

  activityImpact: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22C55E',
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

  modalIcon: {
    fontSize: 48,
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  modalDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },

  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },

  modalStat: {
    alignItems: 'center',
  },

  modalStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 4,
  },

  modalStatLabel: {
    fontSize: 12,
    color: '#6B7280',
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
