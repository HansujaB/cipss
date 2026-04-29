import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { getTrends } from '../services/insightsService';
import NavigationHeader from '../components/NavigationHeader';

const DOMAINS = [
  { key: 'waste_management', label: '♻️ Waste', color: '#F97316' },
  { key: 'environment', label: '🌱 Environment', color: '#22C55E' },
  { key: 'education', label: '📚 Education', color: '#3B82F6' },
];

const PERIODS = [
  { key: '7d', label: '7 Days' },
  { key: '30d', label: '30 Days' },
  { key: '90d', label: '90 Days' },
];

export default function InsightsScreen({ navigation }) {
  const [selectedDomain, setSelectedDomain] = useState('waste_management');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTrends = useCallback(async () => {
    try {
      const result = await getTrends({ domain: selectedDomain, period: selectedPeriod });
      setData(result);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load insights');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedDomain, selectedPeriod]);

  useEffect(() => {
    setLoading(true);
    loadTrends();
  }, [loadTrends]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTrends();
  };

  const domainColor = DOMAINS.find(d => d.key === selectedDomain)?.color || '#1D0A69';

  const trends = data?.trends || [];
  const narration = data?.narration || data?.llmNarration || null;
  const summary = data?.summary || null;

  // Build a simple bar chart from trend data
  const maxValue = trends.length > 0
    ? Math.max(...trends.map(t => t.value || t.count || t.wasteKg || 0), 1)
    : 1;

  return (
    <View style={styles.container}>
      <NavigationHeader
        title="Insights & Trends"
        showBackButton
        onBackPress={() => navigation.goBack()}
        onNotificationPress={() => Alert.alert('Notifications', 'No new notifications')}
        onProfilePress={() => navigation.navigate('Profile')}
      />

      <SafeAreaView style={styles.body}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1D0A69']} />
          }
          contentContainerStyle={styles.scrollContent}
        >
          {/* Domain selector */}
          <View style={styles.sectionLabel}>
            <Text style={styles.sectionLabelText}>Domain</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterRow}
            contentContainerStyle={styles.filterContent}
          >
            {DOMAINS.map((d) => (
              <TouchableOpacity
                key={d.key}
                style={[
                  styles.filterBtn,
                  selectedDomain === d.key && { backgroundColor: d.color, borderColor: d.color },
                ]}
                onPress={() => setSelectedDomain(d.key)}
              >
                <Text style={[styles.filterText, selectedDomain === d.key && styles.filterTextActive]}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Period selector */}
          <View style={styles.sectionLabel}>
            <Text style={styles.sectionLabelText}>Period</Text>
          </View>
          <View style={styles.periodRow}>
            {PERIODS.map((p) => (
              <TouchableOpacity
                key={p.key}
                style={[styles.periodBtn, selectedPeriod === p.key && styles.periodBtnActive]}
                onPress={() => setSelectedPeriod(p.key)}
              >
                <Text style={[styles.periodText, selectedPeriod === p.key && styles.periodTextActive]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {loading ? (
            <View style={styles.loaderWrap}>
              <ActivityIndicator size="large" color="#1D0A69" />
              <Text style={styles.loaderText}>Fetching insights...</Text>
            </View>
          ) : (
            <>
              {/* Summary stats */}
              {summary && (
                <View style={[styles.summaryCard, { borderColor: domainColor }]}>
                  <Text style={[styles.summaryTitle, { color: domainColor }]}>
                    {DOMAINS.find(d => d.key === selectedDomain)?.label} Summary
                  </Text>
                  <View style={styles.summaryStats}>
                    {summary.totalReports !== undefined && (
                      <View style={styles.summaryStat}>
                        <Text style={styles.summaryStatValue}>{summary.totalReports}</Text>
                        <Text style={styles.summaryStatLabel}>Reports</Text>
                      </View>
                    )}
                    {summary.totalWasteKg !== undefined && (
                      <View style={styles.summaryStat}>
                        <Text style={styles.summaryStatValue}>{summary.totalWasteKg}kg</Text>
                        <Text style={styles.summaryStatLabel}>Waste</Text>
                      </View>
                    )}
                    {summary.avgNeedScore !== undefined && (
                      <View style={styles.summaryStat}>
                        <Text style={styles.summaryStatValue}>{Math.round(summary.avgNeedScore)}</Text>
                        <Text style={styles.summaryStatLabel}>Avg Need</Text>
                      </View>
                    )}
                    {summary.activeCampaigns !== undefined && (
                      <View style={styles.summaryStat}>
                        <Text style={styles.summaryStatValue}>{summary.activeCampaigns}</Text>
                        <Text style={styles.summaryStatLabel}>Campaigns</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* LLM Narration */}
              {narration && (
                <View style={styles.narrationCard}>
                  <View style={styles.narrationHeader}>
                    <Text style={styles.narrationIcon}>🤖</Text>
                    <Text style={styles.narrationTitle}>AI Analysis</Text>
                    <View style={styles.aiBadge}>
                      <Text style={styles.aiBadgeText}>Gemini</Text>
                    </View>
                  </View>
                  <Text style={styles.narrationText}>{narration}</Text>
                </View>
              )}

              {/* Trend chart */}
              {trends.length > 0 ? (
                <View style={styles.chartCard}>
                  <Text style={styles.chartTitle}>📈 Trend Data</Text>
                  <View style={styles.chart}>
                    {trends.map((item, index) => {
                      const value = item.value || item.count || item.wasteKg || 0;
                      const barHeight = Math.max((value / maxValue) * 140, 4);
                      return (
                        <View key={index} style={styles.barContainer}>
                          <Text style={styles.barValue}>{value > 999 ? `${(value / 1000).toFixed(1)}k` : value}</Text>
                          <View
                            style={[
                              styles.bar,
                              { height: barHeight, backgroundColor: domainColor },
                            ]}
                          />
                          <Text style={styles.barLabel} numberOfLines={1}>
                            {item.label || item.date || item.period || `W${index + 1}`}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ) : (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyIcon}>📊</Text>
                  <Text style={styles.emptyTitle}>No Trend Data</Text>
                  <Text style={styles.emptyDesc}>
                    No trend data available for this domain and period. Upload NGO metrics to generate insights.
                  </Text>
                </View>
              )}

              {/* Trend items list */}
              {trends.length > 0 && (
                <View style={styles.trendListCard}>
                  <Text style={styles.trendListTitle}>Detailed Breakdown</Text>
                  {trends.map((item, index) => {
                    const value = item.value || item.count || item.wasteKg || 0;
                    const pct = Math.min((value / maxValue) * 100, 100);
                    return (
                      <View key={index} style={styles.trendRow}>
                        <Text style={styles.trendRowLabel} numberOfLines={1}>
                          {item.label || item.date || item.period || `Period ${index + 1}`}
                        </Text>
                        <View style={styles.trendBarBg}>
                          <View style={[styles.trendBarFill, { width: `${pct}%`, backgroundColor: domainColor }]} />
                        </View>
                        <Text style={[styles.trendRowValue, { color: domainColor }]}>{value}</Text>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Quick actions */}
              <View style={styles.actionsCard}>
                <Text style={styles.actionsTitle}>Quick Actions</Text>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: domainColor }]}
                  onPress={() => navigation.navigate('HotspotMap')}
                >
                  <Text style={styles.actionBtnText}>🗺️ View Hotspot Map</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtnOutline}
                  onPress={() => navigation.navigate('CreateCampaign')}
                >
                  <Text style={[styles.actionBtnOutlineText, { color: domainColor }]}>
                    ➕ Create Campaign
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtnOutline}
                  onPress={() => navigation.navigate('NGOUpload')}
                >
                  <Text style={[styles.actionBtnOutlineText, { color: domainColor }]}>
                    📤 Upload NGO Metrics
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  body: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },

  sectionLabel: { marginBottom: 8, marginTop: 4 },
  sectionLabelText: { fontSize: 13, fontWeight: '600', color: '#374151' },

  filterRow: { flexGrow: 0, marginBottom: 16 },
  filterContent: { gap: 8 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: 'transparent',
    marginRight: 8,
  },
  filterText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  filterTextActive: { color: '#FFFFFF', fontWeight: '700' },

  periodRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  periodBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  periodBtnActive: { backgroundColor: '#1D0A69' },
  periodText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  periodTextActive: { color: '#FFFFFF', fontWeight: '700' },

  loaderWrap: { alignItems: 'center', paddingTop: 60 },
  loaderText: { marginTop: 12, color: '#6B7280', fontSize: 14 },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    elevation: 2,
  },
  summaryTitle: { fontSize: 16, fontWeight: '800', marginBottom: 14 },
  summaryStats: { flexDirection: 'row', justifyContent: 'space-around' },
  summaryStat: { alignItems: 'center' },
  summaryStatValue: { fontSize: 20, fontWeight: '800', color: '#1A1A2E' },
  summaryStatLabel: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },

  narrationCard: {
    backgroundColor: '#1D0A69',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  narrationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  narrationIcon: { fontSize: 20, marginRight: 8 },
  narrationTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', flex: 1 },
  aiBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  aiBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  narrationText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 22,
  },

  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  chartTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A2E', marginBottom: 16 },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 180,
    paddingBottom: 24,
  },
  barContainer: { alignItems: 'center', flex: 1 },
  barValue: { fontSize: 9, color: '#6B7280', marginBottom: 4 },
  bar: { width: '60%', borderRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 9, color: '#9CA3AF', marginTop: 4, textAlign: 'center' },

  trendListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  trendListTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A2E', marginBottom: 14 },
  trendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  trendRowLabel: { fontSize: 12, color: '#374151', width: 70 },
  trendBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  trendBarFill: { height: '100%', borderRadius: 4 },
  trendRowValue: { fontSize: 12, fontWeight: '700', width: 40, textAlign: 'right' },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A2E', marginBottom: 8 },
  emptyDesc: { fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 20 },

  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  actionsTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A2E', marginBottom: 14 },
  actionBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  actionBtnOutline: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  actionBtnOutlineText: { fontWeight: '700', fontSize: 15 },
});
