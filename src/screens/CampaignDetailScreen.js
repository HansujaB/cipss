import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';
import { getScoreColor, getScoreLabel } from '../utils/impactScore';
import { domainColors, domainLabels } from '../constants/dummyData';
import { joinCampaign, leaveCampaign } from '../services/campaignService';
import NavigationHeader from '../components/NavigationHeader';
import BottomTabBar from '../components/BottomTabBar';
import SideDrawer from '../components/SideDrawer';

export default function CampaignDetailScreen({ route, navigation }) {
  const { campaign } = route.params;

  const [joined, setJoined] = useState(campaign.joined || false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const scoreColor = getScoreColor(campaign.impactScore);
  const domainColor = domainColors[campaign.domain] || '#888';

  const fundingPercent = Math.min(
    Math.round((campaign.fundingRaised / campaign.fundingGoal) * 100),
    100
  );

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
    Alert.alert('Notifications', 'You have no new notifications');
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleTabPress = (tabKey) => {
    // Handle tab navigation
    switch(tabKey) {
      case 'home':
        navigation.navigate('Dashboard');
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

  const handleJoin = () => {
    joinCampaign(campaign.id)
      .then(() => {
        setJoined(true);
        Alert.alert('🎉 Joined!', `You have successfully joined "${campaign.title}"!`);
      })
      .catch((error) => Alert.alert('Error', error.message || 'Failed to join campaign'));
  };

  const handleLeave = () => {
    leaveCampaign(campaign.id)
      .then(() => {
        setJoined(false);
        Alert.alert('Left Campaign', `You have left "${campaign.title}".`);
      })
      .catch((error) => Alert.alert('Error', error.message || 'Failed to leave campaign'));
  };

  const ScoreRow = ({ label, value }) => (
    <View style={styles.scoreRow}>
      <Text style={styles.scoreRowLabel}>{label}</Text>
      <View style={styles.scoreBarWrap}>
        <View
          style={[
            styles.scoreBar,
            { width: `${value * 10}%`, backgroundColor: getScoreColor(value) },
          ]}
        />
      </View>
      <Text style={[styles.scoreRowValue, { color: getScoreColor(value) }]}>
        {value}/10
      </Text>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <NavigationHeader
        title="Campaign Details"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
      />
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Domain + Title */}
        <View style={[styles.domainBadge, { backgroundColor: domainColor + '22', borderColor: domainColor }]}>
          <Text style={[styles.domainText, { color: domainColor }]}>
            {domainLabels[campaign.domain] || campaign.domain}
          </Text>
        </View>

        <Text style={styles.title}>{campaign.title}</Text>
        <Text style={styles.location}>📍 {campaign.location}</Text>
        {campaign.mapUrl ? (
          <TouchableOpacity style={styles.mapBtn} onPress={() => Linking.openURL(campaign.mapUrl)}>
            <Text style={styles.mapBtnText}>Open in Google Maps</Text>
          </TouchableOpacity>
        ) : null}

        {/* Description */}
        <Text style={styles.sectionTitle}>About this Campaign</Text>
        <Text style={styles.description}>{campaign.description}</Text>

        {/* Impact Score */}
        <View style={[styles.impactBox, { borderColor: scoreColor }]}>
          <Text style={styles.impactBoxLabel}>Overall Impact Score</Text>
          <Text style={[styles.impactScore, { color: scoreColor }]}>
            ⚡ {campaign.impactScore}
          </Text>
          <Text style={[styles.impactLabel, { color: scoreColor }]}>
            {getScoreLabel(campaign.impactScore)}
          </Text>
        </View>

        {/* Sub-scores */}
        <Text style={styles.sectionTitle}>Score Breakdown</Text>
        <ScoreRow label="Need Score" value={campaign.needScore} />
        <ScoreRow label="Trust Score" value={campaign.trustScore} />
        <ScoreRow label="Expected Impact" value={campaign.expectedImpact} />

        {/* Funding Progress */}
        <Text style={styles.sectionTitle}>Funding Progress</Text>
        <View style={styles.fundingCard}>
          <View style={styles.fundingBar}>
            <View
              style={[
                styles.fundingFill,
                { width: `${fundingPercent}%`, backgroundColor: scoreColor },
              ]}
            />
          </View>
          <View style={styles.fundingMeta}>
            <Text style={styles.fundingRaised}>
              ₹{campaign.fundingRaised.toLocaleString()} raised
            </Text>
            <Text style={styles.fundingGoal}>
              Goal: ₹{campaign.fundingGoal.toLocaleString()}
            </Text>
          </View>
          <Text style={styles.fundingPercent}>{fundingPercent}% funded</Text>
        </View>

        <Text style={styles.volunteers}>
          👥 {campaign.volunteers} volunteers enrolled
        </Text>

        {/* Joined Badge */}
        {joined && (
          <View style={styles.joinedBadge}>
            <Text style={styles.joinedBadgeText}>✅ You have joined this campaign!</Text>
            <Text style={styles.joinedBadgeSub}>Thank you for making a difference 💚</Text>
          </View>
        )}

        {/* 🔥 JOIN / LEAVE BUTTON */}
        {joined ? (
          <TouchableOpacity style={styles.leaveBtn} onPress={handleLeave}>
            <Text style={styles.leaveText}>Leave Campaign</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.joinBtn} onPress={handleJoin}>
            <Text style={styles.joinText}>Join Campaign</Text>
          </TouchableOpacity>
        )}

        {/* Fund CTA */}
        <TouchableOpacity
          style={[styles.fundBtn, { backgroundColor: scoreColor }]}
          onPress={() => navigation.navigate('Funding', {
            campaign: {
              id: campaign.id,
              title: campaign.title,
              location: campaign.location,
              domain: campaign.domain,
              impactScore: campaign.impactScore,
              fundingGoal: campaign.fundingGoal,
              fundingRaised: campaign.fundingRaised,
              description: campaign.description,
            }
          })}
        >
          <Text style={styles.fundBtnText}>💳 Fund this Campaign</Text>
        </TouchableOpacity>

      </ScrollView>
      
      <BottomTabBar
        activeTab="campaigns"
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
    padding: 20, 
    paddingBottom: 80, // Account for bottom tab bar
    flexGrow: 1,
  },

  domainBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },

  domainText: { fontSize: 12, fontWeight: '600' },

  title: { fontSize: 24, fontWeight: '800', color: '#1A1A2E', marginBottom: 6 },
  location: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
  mapBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 18,
  },
  mapBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#075985',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
    marginTop: 16,
  },

  description: { fontSize: 14, color: '#6B7280', lineHeight: 22 },

  impactBox: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#fff',
  },

  impactBoxLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 4,
  },

  impactScore: { fontSize: 42, fontWeight: '900' },
  impactLabel: { fontSize: 14, fontWeight: '700', marginTop: 4 },

  scoreRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  scoreRowLabel: { fontSize: 13, color: '#374151', width: 110 },

  scoreBarWrap: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 10,
  },

  scoreBar: { height: '100%', borderRadius: 4 },

  scoreRowValue: {
    fontSize: 12,
    fontWeight: '700',
    width: 36,
    textAlign: 'right',
  },

  fundingCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    elevation: 2,
  },

  fundingBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },

  fundingFill: { height: '100%', borderRadius: 4 },

  fundingMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  fundingRaised: { fontSize: 13, fontWeight: '600', color: '#374151' },
  fundingGoal: { fontSize: 13, color: '#9CA3AF' },

  fundingPercent: { fontSize: 12, color: '#6B7280', marginTop: 4 },

  volunteers: { fontSize: 13, color: '#9CA3AF', marginTop: 14 },

  fundBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },

  fundBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  // 🔥 NEW
  joinBtn: {
    marginTop: 20,
    backgroundColor: '#1D0A69',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  joinText: { color: '#fff', fontWeight: '700' },

  leaveBtn: {
    marginTop: 20,
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  leaveText: { color: '#DC2626', fontWeight: '700' },

  joinedBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#22C55E',
    alignItems: 'center',
  },
  joinedBadgeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#166534',
  },
  joinedBadgeSub: {
    fontSize: 12,
    color: '#22C55E',
    marginTop: 4,
  },
});
