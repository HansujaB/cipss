import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import LeaderboardScreen from '../screens/LeaderboardScreen';

import DashboardScreen from '../screens/DashboardScreen';
import CampaignListScreen from '../screens/CampaignListScreen';
import CampaignDetailScreen from '../screens/CampaignDetailScreen';
import FundingScreen from '../screens/FundingScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


// 🔥 Campaign Flow
function CampaignStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CampaignList" component={CampaignListScreen} />
      <Stack.Screen name="CampaignDetail" component={CampaignDetailScreen} />
      <Stack.Screen name="Funding" component={FundingScreen} />
    </Stack.Navigator>
  );
}


// 🔥 Dashboard Flow
function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
      
      {/* 🔥 Keep SAME names for consistency */}
      <Stack.Screen name="CampaignDetail" component={CampaignDetailScreen} />
      <Stack.Screen name="Funding" component={FundingScreen} />
      <Stack.Screen name="CampaignList" component={CampaignListScreen} />
    </Stack.Navigator>
  );
}


export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0,
            elevation: 10,
            shadowOpacity: 0.1,
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#1D0A69', // 🔥 aligned with your theme
          tabBarInactiveTintColor: '#9CA3AF',

          tabBarIcon: ({ focused }) => {
            const icons = {
              Dashboard: focused ? '🏠' : '🏡',
              Campaigns: focused ? '📋' : '📄',
              Leaderboard: focused ? '🏆' : '🎖️',
            };
            return <Text style={{ fontSize: 20 }}>{icons[route.name]}</Text>;
          },

          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardStack} />
        <Tab.Screen name="Campaigns" component={CampaignStack} />
        <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}