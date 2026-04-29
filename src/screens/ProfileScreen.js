import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import NavigationHeader from '../components/NavigationHeader';
import BottomTabBar from '../components/BottomTabBar';
import SideDrawer from '../components/SideDrawer';
import { useAuth } from '../context/AuthContext';
import { getMyProfile } from '../services/userService';

export default function ProfileScreen({ navigation }) {
  const { logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getMyProfile();
        setProfile(data);
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const tabs = [
    { key: 'home', label: 'Home', icon: '🏠' },
    { key: 'campaigns', label: 'Campaigns', icon: '📋' },
    { key: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { key: 'achievements', label: 'Achievements', icon: '🎖️' },
  ];

  const menuItems = [
    { key: 'Dashboard', label: 'Home', icon: '🏠' },
    { key: 'Campaigns', label: 'Campaigns', icon: '📋' },
    { key: 'Leaderboard', label: 'Leaderboard', icon: '🏆' },
    { key: 'Achievements', label: 'Achievements', icon: '🎖️' },
    { key: 'ImpactDashboard', label: 'Impact', icon: '📊' },
  ];

  const handleTabPress = (tabKey) => {
    const mapping = {
      home: 'Dashboard',
      campaigns: 'Campaigns',
      leaderboard: 'Leaderboard',
      achievements: 'Achievements',
    };
    navigation.navigate(mapping[tabKey]);
  };

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color="#1D0A69" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <NavigationHeader
        title="Profile"
        onMenuPress={() => setDrawerOpen(true)}
        onNotificationPress={() => Alert.alert('Notifications', 'No new notifications')}
        onProfilePress={() => {}}
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Text style={styles.avatar}>👤</Text>
          <Text style={styles.userName}>{profile?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{profile?.email}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{profile?.role || 'member'}</Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile?.rewards?.totalPoints || 0}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile?.campaignsJoined || 0}</Text>
            <Text style={styles.statLabel}>Campaigns</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile?.rewards?.credits || 0}</Text>
            <Text style={styles.statLabel}>Credits</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Certificates</Text>
          <Text style={styles.sectionMeta}>
            Earned: {profile?.rewards?.certificatesCount || 0}
          </Text>
          {(profile?.rewards?.certificates || []).slice(0, 3).map((certificate) => (
            <View key={certificate.id} style={styles.listItem}>
              <Text style={styles.listTitle}>{certificate.title}</Text>
              <Text style={styles.listMeta}>
                {certificate.campaign?.title || 'Campaign'} • {new Date(certificate.issuedAt).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent Reward Activity</Text>
          {(profile?.rewards?.events || []).slice(0, 4).map((event) => (
            <View key={event.id} style={styles.listItem}>
              <Text style={styles.listTitle}>{event.description || event.type}</Text>
              <Text style={styles.listMeta}>
                +{event.pointsDelta} pts • +{event.creditsDelta} credits
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomTabBar activeTab="profile" tabs={tabs} onTabPress={handleTabPress} />

      <SideDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={(screenName) => {
          setDrawerOpen(false);
          navigation.navigate(screenName);
        }}
        navigation={navigation}
        menuItems={menuItems}
        title="Menu"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  container: {
    padding: 16,
    paddingBottom: 80,
  },
  profileHeader: {
    backgroundColor: '#1D0A69',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    fontSize: 64,
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  levelBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D0A69',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  sectionMeta: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  listItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  listMeta: {
    marginTop: 2,
    fontSize: 12,
    color: '#6B7280',
  },
  logoutButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#B91C1C',
    fontWeight: '700',
  },
});
