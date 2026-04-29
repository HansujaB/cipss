import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { getHotspots } from '../services/insightsService';
import NavigationHeader from '../components/NavigationHeader';

const DOMAINS = [
  { key: 'all', label: '🌐 All' },
  { key: 'waste_management', label: '♻️ Waste' },
  { key: 'environment', label: '🌱 Environment' },
  { key: 'education', label: '📚 Education' },
];

const getNeedColor = (score) => {
  if (score >= 75) return '#EF4444'; // red — critical
  if (score >= 50) return '#F59E0B'; // amber — high
  if (score >= 25) return '#3B82F6'; // blue — moderate
  return '#22C55E';                  // green — low
};

const getNeedLabel = (score) => {
  if (score >= 75) return 'Critical';
  if (score >= 50) return 'High';
  if (score >= 25) return 'Moderate';
  return 'Low';
};

export default function HotspotMapScreen({ navigation }) {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  const loadHotspots = useCallback(async (domain) => {
    try {
      const params = domain && domain !== 'all' ? { domain, limit: 20 } : { limit: 20 };
      const data = await getHotspots(params);
      setHotspots(data);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load hotspots');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadHotspots(selectedDomain);
  }, [selectedDomain, loadHotspots]);

  const onRefresh = () => {
    setRefreshing(true);
    loadHotspots(selectedDomain);
  };

  const renderHotspotCard = ({ item, index }) => {
    const color = getNeedColor(item.need_score);
    const label = getNeedLabel(item.need_score);
    const isSelected = selectedHotspot?.lat === item.lat && selectedHotspot?.lng === item.lng;

    return (
      <TouchableOpacity
        style={[styles.hotspotCard, isSelected && styles.hotspotCardSelected, { borderLeftColor: color }]}
        onPress={() => setSelectedHotspot(isSelected ? null : item)}
        activeOpacity={0.8}
      >
        {/* Rank + Area */}
        <View style={styles.cardHeader}>
          <View style={[styles.rankBadge, { backgroundColor: color }]}>
            <Text style={styles.rankText}>#{index + 1}</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.areaText} numberOfLines={1}>
              {item.area || `${item.lat.toFixed(3)}°N, ${item.lng.toFixed(3)}°E`}
            </Text>
            <Text style={styles.domainText}>
              {item.domain?.replace('_', ' ') || 'General'}
            </Text>
          </View>
          <View style={[styles.needBadge, { backgroundColor: color + '22', borderColor: color }]}>
            <Text style={[styles.needScore, { color }]}>{Math.round(item.need_score)}</Text>
            <Text style={[styles.needLabel, { color }]}>{label}</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{item.report_count || 0}</Text>
            <Text style={styles.statLabel}>Reports</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{item.total_waste_kg ? `${item.total_waste_kg}kg` : '—'}</Text>
            <Text style={styles.statLabel}>Waste</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {item.last_reported
                ? new Date(item.last_reported).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                : '—'}
            </Text>
            <Text style={styles.statLabel}>Last Report</Text>
          </View>
        </View>

        {/* Expanded detail */}
        {isSelected && (
          <View style={styles.expandedDetail}>
            <View style={styles.divider} />
            <Text style={styles.coordText}>
              📍 {item.lat.toFixed(4)}°N, {item.lng.toFixed(4)}°E
            </Text>
            <View style={styles.needBarWrap}>
              <Text style={styles.needBarLabel}>Need Score</Text>
              <View style={styles.needBarBg}>
                <View style={[styles.needBarFill, { width: `${Math.min(item.need_score, 100)}%`, backgroundColor: color }]} />
              </View>
              <Text style={[styles.needBarValue, { color }]}>{Math.round(item.need_score)}/100</Text>
            </View>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: color }]}
              onPress={() => navigation.navigate('CreateCampaign')}
            >
              <Text style={styles.actionBtnText}>➕ Create Campaign Here</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const criticalCount = hotspots.filter(h => h.need_score >= 75).length;
  const highCount = hotspots.filter(h => h.need_score >= 50 && h.need_score < 75).length;

  return (
    <View style={styles.container}>
      <NavigationHeader
        title="Hotspot Map"
        showBackButton
        onBackPress={() => navigation.goBack()}
        onNotificationPress={() => Alert.alert('Notifications', 'No new notifications')}
        onProfilePress={() => navigation.navigate('Profile')}
      />

      <SafeAreaView style={styles.body}>
        {/* Summary banner */}
        <View style={styles.summaryBanner}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{hotspots.length}</Text>
            <Text style={styles.summaryLabel}>Hotspots</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: '#EF4444' }]}>{criticalCount}</Text>
            <Text style={styles.summaryLabel}>Critical</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: '#F59E0B' }]}>{highCount}</Text>
            <Text style={styles.summaryLabel}>High Need</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>5km</Text>
            <Text style={styles.summaryLabel}>Grid Size</Text>
          </View>
        </View>

        {/* Domain filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          contentContainerStyle={styles.filterContent}
        >
          {DOMAINS.map((d) => (
            <TouchableOpacity
              key={d.key}
              style={[styles.filterBtn, selectedDomain === d.key && styles.filterBtnActive]}
              onPress={() => setSelectedDomain(d.key)}
            >
              <Text style={[styles.filterText, selectedDomain === d.key && styles.filterTextActive]}>
                {d.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Legend */}
        <View style={styles.legend}>
          {[
            { color: '#EF4444', label: 'Critical (75+)' },
            { color: '#F59E0B', label: 'High (50-74)' },
            { color: '#3B82F6', label: 'Moderate (25-49)' },
            { color: '#22C55E', label: 'Low (<25)' },
          ].map((item) => (
            <View key={item.label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Hotspot list */}
        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color="#1D0A69" />
            <Text style={styles.loaderText}>Loading hotspots...</Text>
          </View>
        ) : (
          <FlatList
            data={hotspots}
            keyExtractor={(item, index) => `${item.lat}-${item.lng}-${index}`}
            renderItem={renderHotspotCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1D0A69']} />
            }
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyIcon}>🗺️</Text>
                <Text style={styles.emptyTitle}>No Hotspots Found</Text>
                <Text style={styles.emptyDesc}>
                  No high-need areas detected for this domain yet. Upload NGO metrics to generate hotspot data.
                </Text>
                <TouchableOpacity
                  style={styles.uploadBtn}
                  onPress={() => navigation.navigate('NGOUpload')}
                >
                  <Text style={styles.uploadBtnText}>Upload NGO Metrics</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  body: { flex: 1 },

  summaryBanner: {
    flexDirection: 'row',
    backgroundColor: '#1D0A69',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: { alignItems: 'center' },
  summaryValue: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  summaryLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  summaryDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.2)' },

  filterRow: { flexGrow: 0, marginTop: 12 },
  filterContent: { paddingHorizontal: 16, gap: 8 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterBtnActive: { backgroundColor: '#1D0A69' },
  filterText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  filterTextActive: { color: '#FFFFFF', fontWeight: '700' },

  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
  legendText: { fontSize: 11, color: '#6B7280' },

  listContent: { padding: 16, paddingBottom: 40 },

  hotspotCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  hotspotCardSelected: {
    elevation: 4,
    shadowOpacity: 0.12,
  },

  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rankText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  cardInfo: { flex: 1 },
  areaText: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', marginBottom: 2 },
  domainText: { fontSize: 12, color: '#6B7280', textTransform: 'capitalize' },
  needBadge: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
  },
  needScore: { fontSize: 16, fontWeight: '800' },
  needLabel: { fontSize: 10, fontWeight: '600' },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingVertical: 8,
  },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  statLabel: { fontSize: 10, color: '#9CA3AF', marginTop: 2 },

  expandedDetail: { marginTop: 12 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 12 },
  coordText: { fontSize: 12, color: '#6B7280', marginBottom: 10 },
  needBarWrap: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  needBarLabel: { fontSize: 12, color: '#374151', width: 80 },
  needBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  needBarFill: { height: '100%', borderRadius: 4 },
  needBarValue: { fontSize: 12, fontWeight: '700', width: 50, textAlign: 'right' },
  actionBtn: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },

  loaderWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  loaderText: { marginTop: 12, color: '#6B7280', fontSize: 14 },

  emptyWrap: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A2E', marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  uploadBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  uploadBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
