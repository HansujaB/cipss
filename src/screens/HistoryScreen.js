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
import {
  LineChart,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  HISTORY_DATA,
  getRankHistory,
  getTrendAnalysis,
  getCompetitorComparison,
  getMilestones,
  getPredictions,
  calculateGrowthRate,
  getBestStreak,
  getPerformanceInsights,
} from '../services/historyService';

const { width } = Dimensions.get('window');

export default function HistoryScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedMetric, setSelectedMetric] = useState('rank');

  const periods = [
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
  ];

  const metrics = [
    { key: 'rank', label: 'Rank', color: '#1D0A69' },
    { key: 'points', label: 'Points', color: '#22C55E' },
    { key: 'campaigns', label: 'Campaigns', color: '#F59E0B' },
  ];

  const historyData = getRankHistory(selectedPeriod);
  const trendAnalysis = getTrendAnalysis();
  const competitorComparison = getCompetitorComparison();
  const milestones = getMilestones();
  const nextMonthPrediction = getPredictions('nextMonth');
  const nextQuarterPrediction = getPredictions('nextQuarter');
  const growthRate = calculateGrowthRate('rank');
  const bestStreak = getBestStreak();
  const insights = getPerformanceInsights();

  const renderRankChart = () => {
    const chartData = historyData.map(item => ({
      date: selectedPeriod === 'monthly' 
        ? new Date(item.date).toLocaleDateString('en', { month: 'short' })
        : item.week,
      rank: item.rank,
      points: item.points,
      campaigns: item.campaigns,
    }));

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Rank Progress Over Time</Text>
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
        
        <View style={styles.chart}>
          {/* Simplified chart representation */}
          <View style={styles.chartArea}>
            {chartData.map((item, index) => {
              const maxValue = Math.max(...chartData.map(d => d[selectedMetric]));
              const value = item[selectedMetric];
              const height = (value / maxValue) * 150;
              const isRank = selectedMetric === 'rank';
              
              return (
                <View key={index} style={styles.chartBarContainer}>
                  <Text style={styles.chartValue}>{value}</Text>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: height,
                        backgroundColor: metrics.find(m => m.key === selectedMetric)?.color || '#1D0A69',
                        width: (width - 80) / chartData.length - 10,
                      }
                    ]}
                  />
                  <Text style={styles.chartLabel}>{item.date}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const renderTrendAnalysis = () => (
    <View style={styles.analysisCard}>
      <Text style={styles.cardTitle}>📊 Trend Analysis</Text>
      <View style={styles.trendStats}>
        <View style={styles.trendStat}>
          <Text style={styles.trendLabel}>Current Trend</Text>
          <Text style={[
            styles.trendValue,
            { color: trendAnalysis.trend === 'improving' ? '#22C55E' : 
                    trendAnalysis.trend === 'declining' ? '#EF4444' : '#F59E0B' }
          ]}>
            {trendAnalysis.trend === 'improving' ? '📈 Improving' :
             trendAnalysis.trend === 'declining' ? '📉 Declining' : '➡️ Stable'}
          </Text>
        </View>
        <View style={styles.trendStat}>
          <Text style={styles.trendLabel}>Rank Change</Text>
          <Text style={styles.trendValue}>{trendAnalysis.change > 0 ? '+' : ''}{trendAnalysis.change}</Text>
        </View>
        <View style={styles.trendStat}>
          <Text style={styles.trendLabel}>Growth Rate</Text>
          <Text style={styles.trendValue}>{Math.round(growthRate)}%</Text>
        </View>
        <View style={styles.trendStat}>
          <Text style={styles.trendLabel}>Best Streak</Text>
          <Text style={styles.trendValue}>{bestStreak} weeks</Text>
        </View>
      </View>
    </View>
  );

  const renderMonthlyComparison = () => (
    <View style={styles.comparisonCard}>
      <Text style={styles.cardTitle}>📅 Monthly Comparison</Text>
      <View style={styles.comparisonHeader}>
        <View style={styles.comparisonPeriod}>
          <Text style={styles.comparisonMonth}>{HISTORY_DATA.monthlyComparison.current.month}</Text>
          <Text style={styles.comparisonRank}>Rank #{HISTORY_DATA.monthlyComparison.current.rank}</Text>
        </View>
        <View style={styles.comparisonArrow}>
          <Text style={styles.comparisonArrowText}>vs</Text>
        </View>
        <View style={styles.comparisonPeriod}>
          <Text style={styles.comparisonMonth}>{HISTORY_DATA.monthlyComparison.previous.month}</Text>
          <Text style={styles.comparisonRank}>Rank #{HISTORY_DATA.monthlyComparison.previous.rank}</Text>
        </View>
      </View>
      
      <View style={styles.comparisonMetrics}>
        <View style={styles.comparisonMetric}>
          <Text style={styles.comparisonMetricLabel}>Rank</Text>
          <Text style={[
            styles.comparisonMetricValue,
            { color: HISTORY_DATA.monthlyComparison.growth.rankChange < 0 ? '#22C55E' : '#EF4444' }
          ]}>
            {HISTORY_DATA.monthlyComparison.growth.rankChange > 0 ? '+' : ''}{HISTORY_DATA.monthlyComparison.growth.rankChange}
          </Text>
        </View>
        <View style={styles.comparisonMetric}>
          <Text style={styles.comparisonMetricLabel}>Points</Text>
          <Text style={styles.comparisonMetricValue}>
            +{HISTORY_DATA.monthlyComparison.growth.pointsChange}
          </Text>
        </View>
        <View style={styles.comparisonMetric}>
          <Text style={styles.comparisonMetricLabel}>Campaigns</Text>
          <Text style={styles.comparisonMetricValue}>
            +{HISTORY_DATA.monthlyComparison.growth.campaignsChange}
          </Text>
        </View>
        <View style={styles.comparisonMetric}>
          <Text style={styles.comparisonMetricLabel}>Hours</Text>
          <Text style={styles.comparisonMetricValue}>
            +{HISTORY_DATA.monthlyComparison.growth.hoursChange}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderCompetitorAnalysis = () => (
    <View style={styles.competitorCard}>
      <Text style={styles.cardTitle}>🏆 Competitor Analysis</Text>
      {competitorComparison.map((competitor, index) => (
        <View key={competitor.userId} style={styles.competitorItem}>
          <View style={styles.competitorInfo}>
            <Text style={styles.competitorName}>User {competitor.userId.split('_')[1]}</Text>
            <Text style={styles.competitorGap}>
              {competitor.gap < 0 ? `${Math.abs(competitor.gap)} ahead` : `${competitor.gap} behind`}
            </Text>
          </View>
          <View style={styles.competitorBar}>
            <View
              style={[
                styles.competitorBarFill,
                {
                  width: `${Math.max(10, 100 - competitor.gap * 10)}%`,
                  backgroundColor: competitor.gap < 0 ? '#22C55E' : '#EF4444',
                }
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );

  const renderMilestones = () => (
    <View style={styles.milestoneCard}>
      <Text style={styles.cardTitle}>🎯 Milestones Achieved</Text>
      {milestones.map((milestone, index) => (
        <View key={index} style={styles.milestoneItem}>
          <View style={styles.milestoneDot} />
          <View style={styles.milestoneContent}>
            <Text style={styles.milestoneTitle}>{milestone.title}</Text>
            <Text style={styles.milestoneDescription}>{milestone.description}</Text>
            <Text style={styles.milestoneDate}>
              {new Date(milestone.date).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.milestoneRank}>#{milestone.rank}</Text>
        </View>
      ))}
    </View>
  );

  const renderPredictions = () => (
    <View style={styles.predictionCard}>
      <Text style={styles.cardTitle}>🔮 Performance Predictions</Text>
      
      <View style={styles.predictionSection}>
        <Text style={styles.predictionTitle}>Next Month</Text>
        <View style={styles.predictionStats}>
          <View style={styles.predictionStat}>
            <Text style={styles.predictionLabel}>Projected Rank</Text>
            <Text style={styles.predictionValue}>#{nextMonthPrediction.projectedRank}</Text>
          </View>
          <View style={styles.predictionStat}>
            <Text style={styles.predictionLabel}>Confidence</Text>
            <Text style={styles.predictionValue}>{nextMonthPrediction.confidence}%</Text>
          </View>
        </View>
        <View style={styles.predictionFactors}>
          <Text style={styles.predictionFactorsTitle}>Key Factors:</Text>
          {nextMonthPrediction.factors.map((factor, index) => (
            <Text key={index} style={styles.predictionFactor}>• {factor}</Text>
          ))}
        </View>
      </View>
      
      <View style={styles.predictionSection}>
        <Text style={styles.predictionTitle}>Next Quarter</Text>
        <View style={styles.predictionStats}>
          <View style={styles.predictionStat}>
            <Text style={styles.predictionLabel}>Projected Rank</Text>
            <Text style={styles.predictionValue}>#{nextQuarterPrediction.projectedRank}</Text>
          </View>
          <View style={styles.predictionStat}>
            <Text style={styles.predictionLabel}>Confidence</Text>
            <Text style={styles.predictionValue}>{nextQuarterPrediction.confidence}%</Text>
          </View>
        </View>
        <View style={styles.predictionFactors}>
          <Text style={styles.predictionFactorsTitle}>Key Factors:</Text>
          {nextQuarterPrediction.factors.map((factor, index) => (
            <Text key={index} style={styles.predictionFactor}>• {factor}</Text>
          ))}
        </View>
      </View>
    </View>
  );

  const renderInsights = () => (
    <View style={styles.insightCard}>
      <Text style={styles.cardTitle}>💡 Performance Insights</Text>
      {insights.map((insight, index) => (
        <View key={index} style={[
          styles.insightItem,
          insight.type === 'positive' && styles.insightPositive,
          insight.type === 'warning' && styles.insightWarning,
        ]}>
          <Text style={styles.insightTitle}>{insight.title}</Text>
          <Text style={styles.insightDescription}>{insight.description}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>📈 History & Trends</Text>

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

        {/* Rank Progress Chart */}
        {renderRankChart()}

        {/* Trend Analysis */}
        {renderTrendAnalysis()}

        {/* Monthly Comparison */}
        {renderMonthlyComparison()}

        {/* Competitor Analysis */}
        {renderCompetitorAnalysis()}

        {/* Milestones */}
        {renderMilestones()}

        {/* Predictions */}
        {renderPredictions()}

        {/* Insights */}
        {renderInsights()}
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
    paddingVertical: 12,
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
    fontSize: 14,
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

  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  chartLegend: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
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
    height: 200,
  },

  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 180,
    paddingHorizontal: 10,
  },

  chartBarContainer: {
    alignItems: 'center',
    flex: 1,
  },

  chartValue: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  chartBar: {
    borderRadius: 4,
    marginBottom: 4,
  },

  chartLabel: {
    fontSize: 9,
    color: '#6B7280',
  },

  analysisCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 14,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 16,
  },

  trendStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  trendStat: {
    alignItems: 'center',
  },

  trendLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  trendValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  comparisonCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 14,
    elevation: 2,
  },

  comparisonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 16,
  },

  comparisonPeriod: {
    alignItems: 'center',
  },

  comparisonMonth: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  comparisonRank: {
    fontSize: 12,
    color: '#1D0A69',
  },

  comparisonArrow: {
    alignItems: 'center',
  },

  comparisonArrowText: {
    fontSize: 12,
    color: '#6B7280',
  },

  comparisonMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  comparisonMetric: {
    alignItems: 'center',
  },

  comparisonMetricLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
  },

  comparisonMetricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  competitorCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 14,
    elevation: 2,
  },

  competitorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  competitorInfo: {
    flex: 1,
    marginRight: 12,
  },

  competitorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  competitorGap: {
    fontSize: 12,
    color: '#6B7280',
  },

  competitorBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },

  competitorBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  milestoneCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 14,
    elevation: 2,
  },

  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  milestoneDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F59E0B',
    marginRight: 12,
  },

  milestoneContent: {
    flex: 1,
  },

  milestoneTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  milestoneDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },

  milestoneDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  milestoneRank: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D0A69',
  },

  predictionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 14,
    elevation: 2,
  },

  predictionSection: {
    marginBottom: 20,
  },

  predictionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  predictionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },

  predictionStat: {
    alignItems: 'center',
  },

  predictionLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  predictionValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  predictionFactors: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },

  predictionFactorsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 6,
  },

  predictionFactor: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },

  insightCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 14,
    elevation: 2,
  },

  insightItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },

  insightPositive: {
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 3,
    borderLeftColor: '#22C55E',
  },

  insightWarning: {
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
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
