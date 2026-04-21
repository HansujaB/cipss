import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import DashboardScreen from '../screens/DashboardScreen';
import CampaignListScreen from '../screens/CampaignListScreen';
import CampaignDetailScreen from '../screens/CampaignDetailScreen';
import FundingScreen from '../screens/FundingScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack navigator for campaign flow
function CampaignStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CampaignList" component={CampaignListScreen} />
      <Stack.Screen name="CampaignDetail" component={CampaignDetailScreen} />
      <Stack.Screen name="Funding" component={FundingScreen} />
    </Stack.Navigator>
  );
}

// Stack navigator for dashboard (so it can also navigate to detail/funding)
function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
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
          tabBarActiveTintColor: '#1A1A2E',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarIcon: ({ focused }) => {
            const icons = {
              Dashboard: focused ? '🏠' : '🏡',
              Campaigns: focused ? '📋' : '📄',
            };
            return <Text style={{ fontSize: 20 }}>{icons[route.name]}</Text>;
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardStack} />
        <Tab.Screen name="Campaigns" component={CampaignStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}