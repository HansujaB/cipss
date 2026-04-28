import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import NavigationHeader from '../components/NavigationHeader';
import BottomTabBar from '../components/BottomTabBar';
import SideDrawer from '../components/SideDrawer';

export default function ProfileScreen({ navigation }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '👤',
    level: 'Gold',
    points: 1250,
    campaigns: 12,
    volunteers: 45,
    joinedDate: '2024-01-15',
  };

  const handleMenuPress = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleDrawerNavigate = (screenName) => {
    setDrawerOpen(false);
    const screenMapping = {
      'Dashboard': 'Dashboard',
      'Campaigns': 'Campaigns',
      'Leaderboard': 'Leaderboard',
      'Achievements': 'Achievements',
      'Settings': 'Profile',
      'Help': 'Profile',
    };
    const targetScreen = screenMapping[screenName] || 'Dashboard';
    if (targetScreen !== 'Profile') {
      navigation.navigate(targetScreen);
    }
  };

  const handleTabPress = (tabKey) => {
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

  const handleNotificationPress = () => {
    Alert.alert('Notifications', 'You have 3 new notifications');
  };

  const handleProfilePress = () => {
    // Already on profile
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Edit profile functionality coming soon!');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings page coming soon!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => navigation.navigate('Dashboard') }
      ]
    );
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
    { key: 'Settings', label: 'Settings', icon: '⚙️' },
    { key: 'Help', label: 'Help & Support', icon: '❓' },
  ];

  return (
    <View style={styles.mainContainer}>
      <NavigationHeader
        title="Profile"
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Text style={styles.avatar}>{user.avatar}</Text>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{user.level} Member</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.points}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.campaigns}</Text>
            <Text style={styles.statLabel}>Campaigns</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.volunteers}</Text>
            <Text style={styles.statLabel}>Volunteers</Text>
          </View>
        </View>

        {/* Menu Options */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
            <Text style={styles.menuIcon}>✏️</Text>
            <Text style={styles.menuText}>Edit Profile</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Achievements')}>
            <Text style={styles.menuIcon}>🏆</Text>
            <Text style={styles.menuText}>My Achievements</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Leaderboard')}>
            <Text style={styles.menuIcon}>📊</Text>
            <Text style={styles.menuText}>My Rankings</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
            <Text style={styles.menuIcon}>⚙️</Text>
            <Text style={styles.menuText}>Settings</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomTabBar
        activeTab="profile"
        tabs={tabs}
        onTabPress={handleTabPress}
      />

      <SideDrawer
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        onNavigate={handleDrawerNavigate}
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
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    marginBottom: 16,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 30,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A2E',
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  logoutButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
});
