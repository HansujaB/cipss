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

export const GROWTH_DATA = {
  monthlyProgress: [
    { month: 'Jan', points: 120, campaigns: 2, rank: 25, hours: 8 },
    { month: 'Feb', points: 280, campaigns: 5, rank: 18, hours: 22 },
    { month: 'Mar', points: 450, campaigns: 8, rank: 12, hours: 45 },
    { month: 'Apr', points: 680, campaigns: 12, rank: 7, hours: 78 },
  ],
  skills: [
    { name: 'Leadership', level: 75, progress: 15, icon: '👑' },
    { name: 'Communication', level: 85, progress: 8, icon: '💬' },
    { name: 'Project Management', level: 60, progress: 12, icon: '📋' },
    { name: 'Fundraising', level: 45, progress: 20, icon: '💰' },
    { name: 'Teaching', level: 90, progress: 5, icon: '📚' },
    { name: 'Environmental', level: 70, progress: 18, icon: '🌱' },
  ],
  achievements: [
    { date: '2024-04-15', title: 'Eco Warrior Badge', impact: '+50 points' },
    { date: '2024-04-10', title: 'Top 10 Volunteer', impact: 'Rank #7' },
    { date: '2024-04-01', title: '30 Day Streak', impact: '+200 points' },
    { date: '2024-03-25', title: 'Team Leader', impact: 'New role' },
    { date: '2024-03-15', title: 'First Campaign', impact: '+25 points' },
  ],
  goals: [
    { id: 'goal_1', title: 'Reach Top 5', target: 'Rank #5', current: 'Rank #7', progress: 60, deadline: '2024-05-31' },
    { id: 'goal_2', title: 'Master Leadership', target: 'Level 90', current: 'Level 75', progress: 75, deadline: '2024-06-30' },
    { id: 'goal_3', title: '100 Hours', target: '100 hours', current: '78 hours', progress: 78, deadline: '2024-04-30' },
    { id: 'goal_4', title: '20 Campaigns', target: '20 campaigns', current: '12 campaigns', progress: 60, deadline: '2024-06-30' },
  ],
  insights: [
    { type: 'strength', title: 'Teaching Excellence', description: 'You\'re in the top 10% in teaching skills' },
    { type: 'opportunity', title: 'Leadership Growth', description: 'Focus on leadership to reach top 5' },
    { type: 'achievement', title: 'Consistent Performer', description: 'You\'ve maintained top 20 for 3 months' },
    { type: 'trend', title: 'Rising Fast', description: 'Your rank improved by 18 positions this quarter' },
  ],
};

export default function GrowthChartScreen() {
  const [selectedMetric, setSelectedMetric] = useState('points');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const metrics = [
    { key: 'points', label: 'Points', color: '#1D0A69' },
    { key: 'campaigns', label: 'Campaigns', color: '#22C55E' },
    { key: 'rank', label: 'Rank', color: '#F59E0B' },
    { key: 'hours', label: 'Hours', color: '#3B82F6' },
  ];

  const periods = [
    { key: 'monthly', label: 'Monthly' },
    { key: 'quarterly', label: 'Quarterly' },
    { key: 'yearly', label: 'Yearly' },
  ];

  const getMetricData = () => {
    return GROWTH_DATA.monthlyProgress.map(item => ({
      month: item.month,
      value: item[selectedMetric],
    }));
  };

  const getMaxValue = () => {
    const data = getMetricData();
    return Math.max(...data.map(item => item.value));
  };

  const renderChart = () => {
    const data = getMetricData();
    const maxValue = getMaxValue();
    const chartHeight = 200;
    const barWidth = (width - 80) / data.length - 20;

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Growth Trend</Text>
          <View style={styles.chartLegend}>
            {metrics.map((metric) => (
              <TouchableOpacity
                key={metric.key}
                style={[
                  styles.legendItem,
                  selectedMetric === metric.key && styles.legendItemActive
                ]}
                onPress={() => setSelectedMetric(metric.key)}
              >
                <View style={[
                  styles.legendDot,
                  { backgroundColor: metric.color }
                ]} />
                <Text style={[
                  styles.legendText,
                  selectedMetric === metric.key && styles.legendTextActive
                ]}>
                  {metric.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.chart}>
          <View style={styles.chartBars}>
            {data.map((item, index) => {
              const barHeight = (item.value / maxValue) * chartHeight;
              const metricColor = metrics.find(m => m.key === selectedMetric)?.color || '#1D0A69';
              
              return (
                <View key={index} style={styles.chartBarContainer}>
                  <Text style={styles.chartBarValue}>{item.value}</Text>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: barHeight,
                        backgroundColor: metricColor,
                        width: barWidth,
                      }
                    ]}
                  />
                  <Text style={styles.chartBarLabel}>{item.month}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const renderSkillProgress = ({ item }) => (
    <View style={styles.skillCard}>
      <View style={styles.skillHeader}>
        <Text style={styles.skillIcon}>{item.icon}</Text>
        <View style={styles.skillInfo}>
          <Text style={styles.skillName}>{item.name}</Text>
          <Text style={styles.skillLevel}>Level {item.level}</Text>
        </View>
        <Text style={styles.skillProgress}>+{item.progress}</Text>
      </View>
      <View style={styles.skillBar}>
        <View
          style={[
            styles.skillBarFill,
            { width: `${item.level}%` }
          ]}
        />
      </View>
    </View>
  );

  const renderGoalCard = ({ item }) => (
    <View style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <Text style={styles.goalTitle}>{item.title}</Text>
        <Text style={styles.goalDeadline}>
          Due: {new Date(item.deadline).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.goalProgress}>
        <Text style={styles.goalCurrent}>{item.current}</Text>
        <Text style={styles.goalTarget}>→ {item.target}</Text>
      </View>
      <View style={styles.goalBar}>
        <View
          style={[
            styles.goalBarFill,
            { width: `${item.progress}%` }
          ]}
        />
      </View>
      <Text style={styles.goalPercentage}>{item.progress}% Complete</Text>
    </View>
  );

  const renderAchievementItem = ({ item }) => (
    <View style={styles.achievementItem}>
      <View style={styles.achievementDot} />
      <View style={styles.achievementInfo}>
        <Text style={styles.achievementTitle}>{item.title}</Text>
        <Text style={styles.achievementDate}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.achievementImpact}>{item.impact}</Text>
    </View>
  );

  const renderInsightCard = ({ item }) => {
    const getInsightStyle = (type) => {
      switch (type) {
        case 'strength': return { backgroundColor: '#F0FDF4', borderColor: '#22C55E' };
        case 'opportunity': return { backgroundColor: '#FFFBEB', borderColor: '#F59E0B' };
        case 'achievement': return { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' };
        case 'trend': return { backgroundColor: '#F3F4F6', borderColor: '#6B7280' };
        default: return { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' };
      }
    };

    return (
      <View style={[styles.insightCard, getInsightStyle(item.type)]}>
        <Text style={styles.insightTitle}>{item.title}</Text>
        <Text style={styles.insightDescription}>{item.description}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>📈 Personal Growth</Text>

        {/* Period Selector */}
        <View style={styles.periodTabs}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodTab,
                selectedPeriod === period.key && styles.periodTabActive
              ]}
              onPress={() => setSelectedPeriod(period.key)}
            >
              <Text style={[
                styles.periodTabText,
                selectedPeriod === period.key && styles.periodTabTextActive
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Growth Chart */}
        {renderChart()}

        {/* Skills Development */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Skills Development</Text>
          {GROWTH_DATA.skills.map((skill, index) => (
            <View key={index}>
              {renderSkillProgress({ item: skill })}
            </View>
          ))}
        </View>

        {/* Goals Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Goals Progress</Text>
          {GROWTH_DATA.goals.map((goal, index) => (
            <View key={index}>
              {renderGoalCard({ item: goal })}
            </View>
          ))}
        </View>

        {/* Recent Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Recent Achievements</Text>
          {GROWTH_DATA.achievements.map((achievement, index) => (
            <View key={index}>
              {renderAchievementItem({ item: achievement })}
            </View>
          ))}
        </View>

        {/* AI Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🤖 AI Insights</Text>
          {GROWTH_DATA.insights.map((insight, index) => (
            <View key={index}>
              {renderInsightCard({ item: insight })}
            </View>
          ))}
        </View>
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

  periodTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },

  periodTab: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  periodTabActive: {
    backgroundColor: '#1D0A69',
    borderColor: '#1D0A69',
  },

  periodTabText: {
    fontSize: 12,
    color: '#6B7280',
  },

  periodTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  chartContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 14,
    elevation: 2,
  },

  chartHeader: {
    marginBottom: 20,
  },

  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  chartLegend: {
    flexDirection: 'row',
    gap: 16,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  legendItemActive: {
    backgroundColor: '#F3F4F6',
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },

  legendTextActive: {
    color: '#1A1A2E',
    fontWeight: '600',
  },

  chart: {
    height: 250,
  },

  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 220,
    paddingHorizontal: 10,
  },

  chartBarContainer: {
    alignItems: 'center',
    flex: 1,
  },

  chartBarValue: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  chartBar: {
    borderRadius: 4,
    marginBottom: 4,
  },

  chartBarLabel: {
    fontSize: 10,
    color: '#6B7280',
  },

  section: {
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  skillCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },

  skillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  skillIcon: {
    fontSize: 24,
    marginRight: 12,
  },

  skillInfo: {
    flex: 1,
  },

  skillName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  skillLevel: {
    fontSize: 12,
    color: '#6B7280',
  },

  skillProgress: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22C55E',
  },

  skillBar: {
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

  goalCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },

  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    flex: 1,
  },

  goalDeadline: {
    fontSize: 11,
    color: '#6B7280',
  },

  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  goalCurrent: {
    fontSize: 12,
    color: '#1A1A2E',
    fontWeight: '500',
  },

  goalTarget: {
    fontSize: 12,
    color: '#1D0A69',
    fontWeight: '600',
    marginLeft: 4,
  },

  goalBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },

  goalBarFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 3,
  },

  goalPercentage: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'right',
  },

  achievementItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },

  achievementDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
    marginRight: 12,
  },

  achievementInfo: {
    flex: 1,
  },

  achievementTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  achievementDate: {
    fontSize: 11,
    color: '#6B7280',
  },

  achievementImpact: {
    fontSize: 11,
    fontWeight: '600',
    color: '#22C55E',
  },

  insightCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    elevation: 2,
  },

  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  insightDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
});
