import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import CampaignCard from '../components/CampaignCard';
import NavigationHeader from '../components/NavigationHeader';
import BottomTabBar from '../components/BottomTabBar';
import SideDrawer from '../components/SideDrawer';
import { getCampaigns, joinCampaign } from '../services/campaignService';

const DOMAINS = ['All', 'waste', 'environment', 'education', 'health'];

export default function CampaignListScreen({ navigation }) {
  const [campaigns, setCampaigns] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
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
        // Already on campaigns
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
    const data = getCampaigns();
    setCampaigns(data);
    setFiltered(data);
  }, []);

  useEffect(() => {
    let result = campaigns;

    if (activeFilter !== 'All') {
      result = result.filter((c) => c.domain === activeFilter);
    }

    if (search.trim()) {
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [search, activeFilter, campaigns]);

  // 🔥 NEW: Join handler
  const handleJoin = (campaignId) => {
    joinCampaign(campaignId);
    alert('Joined campaign successfully!');
  };

  return (
    <View style={styles.mainContainer}>
      <NavigationHeader
        title="CSR Campaigns"
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
      />
      
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerSub}>{filtered.length} active campaigns</Text>
            </View>
            <TouchableOpacity 
              style={styles.createBtn}
              onPress={() => navigation.navigate('CreateCampaign')}
            >
              <Text style={styles.createBtnText}>+ New</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <TextInput
          style={styles.search}
          placeholder="Search campaigns or locations..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />

        {/* Filters */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={DOMAINS}
          keyExtractor={(item) => item}
          style={styles.filterRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterBtn, activeFilter === item && styles.filterBtnActive]}
              onPress={() => setActiveFilter(item)}
            >
              <Text
                style={[styles.filterText, activeFilter === item && styles.filterTextActive]}
              >
                {item === 'All' ? '🌐 All' : item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Campaign List */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View>
              <CampaignCard
                campaign={item}
                onPress={(c) =>
                  navigation.navigate('CampaignDetail', { campaign: c })
                }
                onJoin={handleJoin}
              />

              {/* 🔥 NEW: Join Button */}
              <TouchableOpacity
                style={styles.joinBtn}
                onPress={() => handleJoin(item.id)}
              >
                <Text style={styles.joinText}>Join Campaign</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No campaigns found.</Text>
          }
        />
      </View>
      
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
    flex: 1, 
    paddingHorizontal: 16,
    paddingBottom: 80, // Account for bottom tab bar
  },

  header: { paddingTop: 20, paddingBottom: 12 },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  headerSub: { fontSize: 16, fontWeight: '600', color: '#1A1A2E' },
  createBtn: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  createBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  search: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#1A1A2E',
    marginBottom: 12,
    elevation: 2,
  },

  filterRow: { marginBottom: 14, flexGrow: 0 },

  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },

  filterBtnActive: { backgroundColor: '#1A1A2E' },

  filterText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  filterTextActive: { color: '#FFFFFF', fontWeight: '700' },

  list: { paddingBottom: 30 },

  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 40 },

  // 🔥 NEW STYLE
  joinBtn: {
    backgroundColor: '#1D0A69',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },

  joinText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});