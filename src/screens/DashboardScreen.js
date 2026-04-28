import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import StatCard from '../components/StatCard';
import CampaignCard from '../components/CampaignCard';
import NavigationHeader from '../components/NavigationHeader';
import BottomTabBar from '../components/BottomTabBar';
import SideDrawer from '../components/SideDrawer';
import { getUserPoints } from '../services/campaignService';
import {
  getCampaigns,
  getTopCampaigns,
  getJoinedCampaigns,
  joinCampaign,
} from '../services/campaignService';

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalFunding: 0,
    totalVolunteers: 0,
    avgImpact: 0,
  });
  const [points, setPoints] = useState(0);
  const [topCampaigns, setTopCampaigns] = useState([]);
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenuPress = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleDrawerNavigate = (screenName) => {
    setDrawerOpen(false);
    navigation.navigate(screenName);
  };

  // Menu items - only additional screens NOT in bottom nav
  const drawerMenuItems = [
    { key: 'CreateCampaign', label: 'Create Campaign', icon: '➕' },
    { key: 'CSRMarketplace', label: 'CSR Marketplace', icon: '🏪' },
    { key: 'ImpactDashboard', label: 'Impact Dashboard', icon: '📊' },
    { key: 'Network', label: 'Network', icon: '👥' },
    { key: 'Mentorship', label: 'Mentorship', icon: '👨‍🏫' },
    { key: 'Streak', label: 'Streak', icon: '🔥' },
    { key: 'PowerUp', label: 'Power-ups', icon: '⚡' },
    { key: 'Challenges', label: 'Challenges', icon: '🎯' },
    { key: 'Profile', label: 'Profile', icon: '👤' },
  ];

  const handleNotificationPress = () => {
    // TODO: Navigate to notifications screen
    Alert.alert('Notifications', 'You have no new notifications');
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleTabPress = (tabKey) => {
    // Handle tab navigation
    switch(tabKey) {
      case 'home':
        // Already on dashboard
        break;
      case 'campaigns':
        navigation.navigate('Campaigns');
        break;
      case 'leaderboard':
        navigation.navigate('Leaderboard');
        break;
      case 'achievements':
        navigation.navigate('Achievements');
        break;
    }
  };

  const tabs = [
    { key: 'home', label: 'Home', icon: '🏠' },
    { key: 'campaigns', label: 'Campaigns', icon: '📋' },
    { key: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { key: 'achievements', label: 'Achievements', icon: '🎖️' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const all = getCampaigns();
    const top = getTopCampaigns(3);
    const joined = getJoinedCampaigns();
    setPoints(getUserPoints());
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
    setMyCampaigns(joined);
  };

  const handleJoin = (id) => {
    joinCampaign(id);
    loadData(); // 🔥 refresh
  };

  return (
    <View style={styles.mainContainer}>
      <NavigationHeader
        title="CIPSS Dashboard"
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
      />
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good work, Team! 👋</Text>
          <Text style={styles.title}>CSR Dashboard</Text>
          <Text style={styles.points}>
            Your Points: {points}
          </Text>
        </View>

        {/* Stats */}
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

        {/* 🔥 MY CAMPAIGNS */}
        {myCampaigns.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>🙋 My Campaigns</Text>
            {myCampaigns.map((c) => (
              <CampaignCard
                key={c.id}
                campaign={c}
                onPress={(camp) =>
                  navigation.navigate('CampaignDetail', { campaign: camp })
                }
                onJoin={handleJoin}
              />
            ))}
          </>
        )}

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
            onPress={(camp) =>
              navigation.navigate('CampaignDetail', { campaign: camp })
            }
            onJoin={handleJoin}
          />
        ))}

        {/* CSR Marketplace CTA */}
        <TouchableOpacity
          style={styles.csrCard}
          onPress={() => navigation.navigate('CSRMarketplace')}
        >
          <Text style={styles.csrCardTitle}>💼 CSR Marketplace</Text>
          <Text style={styles.csrCardDesc}>
            Discover verified campaigns for your Corporate Social Responsibility initiatives
          </Text>
          <View style={styles.csrCardStats}>
            <Text style={styles.csrStat}>✓ Verified NGOs</Text>
            <Text style={styles.csrStat}>📊 Impact Tracking</Text>
            <Text style={styles.csrStat}>📝 Tax Benefits</Text>
          </View>
          <Text style={styles.csrCardCta}>Explore CSR Opportunities →</Text>
        </TouchableOpacity>

        {/* CTA */}
        <TouchableOpacity
          style={styles.cta}
          onPress={() => navigation.navigate('CampaignList')}
        >
          <Text style={styles.ctaText}>Browse All Campaigns →</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <BottomTabBar
        activeTab="home"
        tabs={tabs}
        onTabPress={handleTabPress}
      />

      <SideDrawer
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        onNavigate={handleDrawerNavigate}
        navigation={navigation}
        menuItems={drawerMenuItems}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { 
    padding: 16, 
    paddingBottom: 80, // Account for bottom tab bar
    flexGrow: 1,
  },

  header: { marginBottom: 20, paddingTop: 10 },
  greeting: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },
  title: { fontSize: 26, fontWeight: '900', color: '#1A1A2E', marginTop: 2 },
  points: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D0A69',
    marginTop: 6,
  },

  statsRow: { flexDirection: 'row', marginBottom: 10 },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A2E',
    marginTop: 20,
  },

  seeAll: { fontSize: 13, color: '#3B82F6', fontWeight: '600' },

  cta: {
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },

  ctaText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  csrCard: {
    backgroundColor: '#1D0A69',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  csrCardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  csrCardDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  csrCardStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  csrStat: {
    color: '#4ADE80',
    fontSize: 11,
    marginRight: 12,
    marginBottom: 4,
  },
  csrCardCta: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
  },
});