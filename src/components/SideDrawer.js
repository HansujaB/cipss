import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';

const { width } = Dimensions.get('window');

const DRAWER_WIDTH = width * 0.75;

const MENU_ITEMS = [
  {
    category: 'Main',
    items: [
      { key: 'Dashboard', label: 'Home', icon: '🏠' },
      { key: 'Campaigns', label: 'Campaigns', icon: '📋' },
      { key: 'CampaignDetail', label: 'Campaign Details', icon: '📄' },
      { key: 'CreateCampaign', label: 'Create Campaign', icon: '➕' },
    ]
  },
  {
    category: 'Leaderboard & Rankings',
    items: [
      { key: 'Leaderboard', label: 'Leaderboard', icon: '🏆' },
      { key: 'TeamLeaderboard', label: 'Team Leaderboards', icon: '👥' },
      { key: 'DomainLeaderboard', label: 'Domain Leaderboards', icon: '📊' },
      { key: 'GrowthChart', label: 'Growth Chart', icon: '📈' },
      { key: 'Comparison', label: 'Compare Users', icon: '⚖️' },
    ]
  },
  {
    category: 'Achievements & Rewards',
    items: [
      { key: 'Achievements', label: 'Achievements', icon: '🎖️' },
      { key: 'Badges', label: 'Achievement Badges', icon: '🏅' },
      { key: 'Streak', label: 'Streak Tracking', icon: '🔥' },
      { key: 'PowerUp', label: 'Power-ups & Boosts', icon: '⚡' },
      { key: 'Challenges', label: 'Weekly/Monthly Challenges', icon: '🎯' },
      { key: 'Rewards', label: 'Rewards & Redemption', icon: '🎁' },
    ]
  },
  {
    category: 'Social & Community',
    items: [
      { key: 'Network', label: 'Follow System', icon: '🔗' },
      { key: 'Comments', label: 'Comments & Reactions', icon: '💬' },
      { key: 'Mentorship', label: 'Mentorship Program', icon: '👨‍🏫' },
      { key: 'TeamLeaderboard', label: 'Team Features', icon: '🤝' },
      { key: 'ImpactDashboard', label: 'Impact Dashboard', icon: '🌍' },
    ]
  },
  {
    category: 'Smart Features',
    items: [
      { key: 'AIVolunteerMatching', label: 'AI Volunteer Matching', icon: '🤖' },
      { key: 'Chat', label: 'Real-time Chat', icon: '💬' },
      { key: 'Learning', label: 'Learning Paths', icon: '📚' },
      { key: 'VoiceCommands', label: 'Voice Commands', icon: '🎤' },
      { key: 'ARBadges', label: 'AR Badges View', icon: '👓' },
    ]
  },
  {
    category: 'Advanced Features',
    items: [
      { key: 'Blockchain', label: 'Blockchain Verification', icon: '⛓️' },
      { key: 'Multilingual', label: 'Multilingual Support', icon: '🌐' },
      { key: 'OfflineMode', label: 'Offline Mode', icon: '📴' },
      { key: 'PushNotifications', label: 'Push Notifications', icon: '🔔' },
      { key: 'Analytics', label: 'Analytics Dashboard', icon: '📊' },
    ]
  },
  {
    category: 'Marketplace & Events',
    items: [
      { key: 'CSRMarketplace', label: 'CSR Marketplace', icon: '🏪' },
      { key: 'Marketplace', label: 'Volunteer Marketplace', icon: '🛒' },
      { key: 'Calendar', label: 'Calendar Integration', icon: '📅' },
      { key: 'VirtualEvents', label: 'Virtual Events', icon: '🎥' },
    ]
  },
  {
    category: 'Corporate & Impact',
    items: [
      { key: 'CorporatePartnership', label: 'Corporate Portal', icon: '🏢' },
      { key: 'EnvironmentalImpact', label: 'Environmental Calculator', icon: '🌱' },
      { key: 'ExportReports', label: 'Export Reports', icon: '📑' },
      { key: 'Spotlight', label: 'Featured Spotlights', icon: '✨' },
    ]
  },
  {
    category: 'History & Settings',
    items: [
      { key: 'History', label: 'Leaderboard History', icon: '📜' },
      { key: 'HistoryTrends', label: 'History & Trends', icon: '📈' },
      { key: 'Settings', label: 'Settings', icon: '⚙️' },
      { key: 'Help', label: 'Help & Support', icon: '❓' },
    ]
  }
];

const SideDrawer = ({ isOpen, onClose, onNavigate, navigation, menuItems = null, title = "CIPSS" }) => {
  const translateX = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -DRAWER_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const handleNavigate = (screenName) => {
    onNavigate(screenName);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={onClose}
          activeOpacity={0.5}
          accessibilityLabel="Close menu"
          accessibilityRole="button"
          accessibilityHint="Tap to close the navigation menu"
        />
      )}

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          { transform: [{ translateX }] }
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>CIPSS</Text>
          <Text style={styles.headerSubtitle}>CSR Impact Platform</Text>
        </View>

        {/* Menu Items */}
        <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
          {menuItems ? (
            // Render custom menu items (simple list)
            <View style={styles.section} accessibilityRole="menu">
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => handleNavigate(item.key)}
                  accessibilityLabel={item.label}
                  accessibilityRole="menuitem"
                  accessibilityHint={`Navigate to ${item.label}`}
                >
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            // Render default categorized menu
            MENU_ITEMS.map((section, sectionIndex) => (
              <View key={sectionIndex} style={styles.section}>
                <Text style={styles.sectionTitle} accessibilityRole="header">{section.category}</Text>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    style={styles.menuItem}
                    onPress={() => handleNavigate(item.key)}
                    accessibilityLabel={item.label}
                    accessibilityRole="menuitem"
                    accessibilityHint={`Navigate to ${item.label}`}
                  >
                    <Text style={styles.menuIcon}>{item.icon}</Text>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerItem}>
            <Text style={styles.footerIcon}>⚙️</Text>
            <Text style={styles.footerLabel}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem}>
            <Text style={styles.footerIcon}>❓</Text>
            <Text style={styles.footerLabel}>Help</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: '#FFFFFF',
    zIndex: 999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    backgroundColor: '#1D0A69',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  section: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    paddingHorizontal: 20,
    paddingVertical: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 30,
    textAlign: 'center',
  },
  menuLabel: {
    fontSize: 15,
    color: '#1A1A2E',
    fontWeight: '500',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  footerLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
});

export default SideDrawer;
