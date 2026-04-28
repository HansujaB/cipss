import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import all screens
import DashboardScreen from '../screens/DashboardScreen';
import CampaignListScreen from '../screens/CampaignListScreen';
import CampaignDetailScreen from '../screens/CampaignDetailScreen';
import FundingScreen from '../screens/FundingScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import CreateCampaignScreen from '../screens/CreateCampaignScreen';
import TeamLeaderboardScreen from '../screens/TeamLeaderboardScreen';
import DomainLeaderboardScreen from '../screens/DomainLeaderboardScreen';
import GrowthChartScreen from '../screens/GrowthChartScreen';
import ComparisonScreen from '../screens/ComparisonScreen';
import ARBadgesScreen from '../screens/ARBadgesScreen';
import StreakScreen from '../screens/StreakScreen';
import PowerUpScreen from '../screens/PowerUpScreen';
import RewardsScreen from '../screens/RewardsScreen';
import NetworkScreen from '../screens/NetworkScreen';
import CommentsScreen from '../screens/CommentsScreen';
import MentorshipScreen from '../screens/MentorshipScreen';
import ImpactDashboardScreen from '../screens/ImpactDashboardScreen';
import AIMatchingScreen from '../screens/AIMatchingScreen';
import ChatScreen from '../screens/ChatScreen';
import LearningScreen from '../screens/LearningScreen';
import VoiceCommandsScreen from '../screens/VoiceCommandsScreen';
import BlockchainScreen from '../screens/BlockchainScreen';
// import LocalizationScreen from '../screens/LocalizationScreen'; // Temporarily disabled
import OfflineScreen from '../screens/OfflineScreen';
import PushNotificationScreen from '../screens/PushNotificationScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import CSRMarketplaceScreen from '../screens/CSRMarketplaceScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import CalendarScreen from '../screens/CalendarScreen';
import VirtualEventsScreen from '../screens/VirtualEventsScreen';
import ExportScreen from '../screens/ExportScreen';
import SpotlightScreen from '../screens/SpotlightScreen';
import HistoryScreen from '../screens/HistoryScreen';
import APIDashboardScreen from '../screens/APIDashboardScreen';
import OrganizationBadgesScreen from '../screens/OrganizationBadgesScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import NotificationScreen from '../screens/NotificationScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Dashboard"
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        {/* Main Screens */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Campaigns" component={CampaignListScreen} />
        <Stack.Screen name="CampaignDetail" component={CampaignDetailScreen} />
        <Stack.Screen name="Funding" component={FundingScreen} />
        <Stack.Screen name="CreateCampaign" component={CreateCampaignScreen} />
        
        {/* Leaderboard & Rankings */}
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Stack.Screen name="TeamLeaderboard" component={TeamLeaderboardScreen} />
        <Stack.Screen name="DomainLeaderboard" component={DomainLeaderboardScreen} />
        <Stack.Screen name="GrowthChart" component={GrowthChartScreen} />
        <Stack.Screen name="Comparison" component={ComparisonScreen} />
        
        {/* Achievements & Rewards */}
        <Stack.Screen name="Achievements" component={AchievementsScreen} />
        <Stack.Screen name="Badges" component={ARBadgesScreen} />
        <Stack.Screen name="Streak" component={StreakScreen} />
        <Stack.Screen name="PowerUp" component={PowerUpScreen} />
        <Stack.Screen name="Challenges" component={ChallengesScreen} />
        <Stack.Screen name="Rewards" component={RewardsScreen} />
        
        {/* Social & Community */}
        <Stack.Screen name="Network" component={NetworkScreen} />
        <Stack.Screen name="Comments" component={CommentsScreen} />
        <Stack.Screen name="Mentorship" component={MentorshipScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        
        {/* Impact & Analytics */}
        <Stack.Screen name="ImpactDashboard" component={ImpactDashboardScreen} />
        <Stack.Screen name="Analytics" component={AnalyticsScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        
        {/* Advanced Features */}
        <Stack.Screen name="AIMatching" component={AIMatchingScreen} />
        <Stack.Screen name="Learning" component={LearningScreen} />
        <Stack.Screen name="VoiceCommands" component={VoiceCommandsScreen} />
        <Stack.Screen name="ARBadges" component={ARBadgesScreen} />
        <Stack.Screen name="Blockchain" component={BlockchainScreen} />
        {/* <Stack.Screen name="Localization" component={LocalizationScreen} /> */}
        <Stack.Screen name="Offline" component={OfflineScreen} />
        <Stack.Screen name="PushNotifications" component={PushNotificationScreen} />
        
        {/* Marketplace & Events */}
        <Stack.Screen name="CSRMarketplace" component={CSRMarketplaceScreen} />
        <Stack.Screen name="Marketplace" component={MarketplaceScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="VirtualEvents" component={VirtualEventsScreen} />
        
        {/* Utilities */}
        <Stack.Screen name="Export" component={ExportScreen} />
        <Stack.Screen name="Spotlight" component={SpotlightScreen} />
        <Stack.Screen name="APIDashboard" component={APIDashboardScreen} />
        <Stack.Screen name="OrganizationBadges" component={OrganizationBadgesScreen} />
        <Stack.Screen name="Notifications" component={NotificationScreen} />
        
        {/* Auth */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        
        {/* Profile */}
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
