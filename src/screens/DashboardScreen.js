import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import StatCard from '../components/StatCard';
import CampaignCard from '../components/CampaignCard';
import { getCampaigns, getTopCampaigns } from '../services/campaignService';

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalFunding: 0,
    totalVolunteers: 0,
    avgImpact: 0,
  });
  const [topCampaigns, setTopCampaigns] = useState([]);

  useEffect(() => {
    const all = getCampaigns();
    const top = getTopCampaigns(3);

    const totalFunding = all.reduce((s, c) => s + c.fundingRaised, 0);
    const totalVolunteers = all.reduce((s, c) => s + c.volunteers, 0);
    const avgImpact = (
      all.reduce((s, c) => s + parseFloat(c.impactScore), 0) / all.length
    ).toFixed(1);

    setStats({
      totalCampaigns: all.length,
      totalFunding,
      totalVolunteers,
      avgImpact,
    });
    setTopCampaigns(top);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good work, Team! 👋</Text>
          <Text style={styles.title}>CSR Dashboard</Text>
        </View>

        {/* Stat Cards */}
        <View style={styles.statsRow}>
          <StatCard icon="📋" label="Campaigns" value={stats.totalCampaigns} color="#3B82F6" />
          <StatCard icon="👥" label="Volunteers" value={stats.totalVolunteers} color="#8B5CF6" />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            icon="💰"
            label="Total Funded"
            value={`₹${(stats.totalFunding / 1000).toFixed(0)}K`}
            color="#22C55E"
          />
          <StatCard icon="⚡" label="Avg Impact" value={stats.avgImpact} color="#F59E0B" />
        </View>

        {/* Top Campaigns */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🏆 Top Impact Campaigns</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CampaignList')}>
            <Text style={styles.seeAll}>See all →</Text>
          </TouchableOpacity>
        </View>

        {topCampaigns.map((c) => (
          <CampaignCard
            key={c.id}
            campaign={c}
            onPress={(camp) => navigation.navigate('CampaignDetail', { campaign: camp })}
          />
        ))}

        {/* CTA */}
        <TouchableOpacity
          style={styles.cta}
          onPress={() => navigation.navigate('CampaignList')}
        >
          <Text style={styles.ctaText}>Browse All Campaigns →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 20, paddingTop: 10 },
  greeting: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },
  title: { fontSize: 26, fontWeight: '900', color: '#1A1A2E', marginTop: 2 },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A2E' },
  seeAll: { fontSize: 13, color: '#3B82F6', fontWeight: '600' },
  cta: {
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  ctaText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});