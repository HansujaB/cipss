import { Alert } from 'react-native';

// Screen mapping for drawer navigation
export const SCREEN_MAPPING = {
  'Dashboard': 'Dashboard',
  'Campaigns': 'Campaigns',
  'CampaignDetail': 'CampaignDetail',
  'CreateCampaign': 'CreateCampaign',
  'Leaderboard': 'Leaderboard',
  'TeamLeaderboard': 'Leaderboard',
  'DomainLeaderboard': 'Leaderboard',
  'GrowthChart': 'Leaderboard',
  'Comparison': 'Leaderboard',
  'Achievements': 'Achievements',
  'Badges': 'Achievements',
  'Streak': 'Streak',
  'PowerUp': 'PowerUp',
  'Challenges': 'Challenges',
  'Rewards': 'Achievements',
  'Network': 'Network',
  'Comments': 'Comments',
  'Mentorship': 'Mentorship',
  'ImpactDashboard': 'ImpactDashboard',
  'AIVolunteerMatching': 'Dashboard',
  'Chat': 'Network',
  'Learning': 'Dashboard',
  'VoiceCommands': 'Dashboard',
  'ARBadges': 'Dashboard',
  'Blockchain': 'Dashboard',
  'Multilingual': 'Dashboard',
  'OfflineMode': 'Dashboard',
  'PushNotifications': 'Dashboard',
  'Analytics': 'Dashboard',
  'CSRMarketplace': 'CSRMarketplace',
  'Marketplace': 'CSRMarketplace',
  'Calendar': 'Dashboard',
  'VirtualEvents': 'Dashboard',
  'CorporatePartnership': 'Dashboard',
  'EnvironmentalImpact': 'Dashboard',
  'ExportReports': 'Dashboard',
  'Spotlight': 'Dashboard',
  'History': 'Leaderboard',
  'HistoryTrends': 'Leaderboard',
  'Settings': 'Dashboard',
  'Help': 'Dashboard',
};

// Navigation handler for drawer
export const handleDrawerNavigation = (screenName, navigation, setDrawerOpen) => {
  setDrawerOpen(false);
  
  const targetScreen = SCREEN_MAPPING[screenName] || 'Dashboard';
  
  if (targetScreen === 'CampaignDetail') {
    Alert.alert('Navigate', `Going to ${screenName}`);
  } else {
    navigation.navigate(targetScreen);
  }
};

// Create drawer handlers for a screen
export const createDrawerHandlers = (navigation) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleMenuPress = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleDrawerNavigate = (screenName) => {
    handleDrawerNavigation(screenName, navigation, setDrawerOpen);
  };

  return {
    drawerOpen,
    setDrawerOpen,
    handleMenuPress,
    handleCloseDrawer,
    handleDrawerNavigate,
  };
};
