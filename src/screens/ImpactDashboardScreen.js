import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { getDashboardSummary } from '../services/campaignService';

export default function ImpactDashboardScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const summary = await getDashboardSummary();
        setData(summary);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color="#1D0A69" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loaderWrap}>
        <Text style={styles.emptyText}>Unable to load impact dashboard.</Text>
      </View>
    );
  }

  const categories = data.categories || [];
  const monthlyProgress = data.monthlyProgress || [];

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>Platform Impact Overview</Text>
        <View style={styles.overviewStats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{data.stats?.totalCampaigns || 0}</Text>
            <Text style={styles.statLabel}>Campaigns</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{data.stats?.totalVolunteers || 0}</Text>
            <Text style={styles.statLabel}>Volunteers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>₹{Math.round((data.stats?.totalFunding || 0) / 1000)}K</Text>
            <Text style={styles.statLabel}>Funding</Text>
          </View>
        </View>
        <Text style={styles.impactBadge}>Average Impact Score: {data.stats?.avgImpact || 0}</Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Impact by Category</Text>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={styles.categoryItem}
            onPress={() => setSelectedCategory(category)}
          >
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryName}>{category.name.replace('_', ' ')}</Text>
              <Text style={styles.categoryValue}>{category.avgImpact}</Text>
            </View>
            <Text style={styles.categoryMeta}>
              {category.campaigns} campaigns • {category.volunteers} volunteers • ₹{Math.round(category.funding / 1000)}K
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Monthly Progress</Text>
        {monthlyProgress.map((month) => (
          <View key={month.month} style={styles.monthRow}>
            <Text style={styles.monthLabel}>{month.month}</Text>
            <View style={styles.monthBar}>
              <View style={[styles.monthFill, { width: `${Math.min(month.impact, 100)}%` }]} />
            </View>
            <Text style={styles.monthValue}>{month.impact}</Text>
          </View>
        ))}
      </View>

      {selectedCategory ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Selected Category</Text>
          <Text style={styles.detailTitle}>{selectedCategory.name.replace('_', ' ')}</Text>
          <Text style={styles.detailMeta}>{selectedCategory.campaigns} campaigns</Text>
          <Text style={styles.detailMeta}>{selectedCategory.volunteers} volunteers</Text>
          <Text style={styles.detailMeta}>₹{selectedCategory.funding.toLocaleString()} raised</Text>
          <Text style={styles.detailMeta}>Average impact {selectedCategory.avgImpact}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#F9FAFB',
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  emptyText: {
    color: '#6B7280',
  },
  overviewCard: {
    backgroundColor: '#1D0A69',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  overviewTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  impactBadge: {
    color: '#D1FAE5',
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  categoryItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  categoryValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1D0A69',
  },
  categoryMeta: {
    marginTop: 4,
    color: '#6B7280',
    fontSize: 12,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthLabel: {
    width: 36,
    fontSize: 12,
    color: '#6B7280',
  },
  monthBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  monthFill: {
    height: '100%',
    backgroundColor: '#22C55E',
  },
  monthValue: {
    width: 34,
    textAlign: 'right',
    fontWeight: '700',
    color: '#111827',
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  detailMeta: {
    color: '#4B5563',
    marginBottom: 4,
  },
});
