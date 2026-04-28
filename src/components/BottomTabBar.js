import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const BottomTabBar = ({ activeTab, tabs, onTabPress }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container} accessibilityRole="toolbar">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab
            ]}
            onPress={() => onTabPress(tab.key)}
            accessibilityLabel={tab.label}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab.key }}
            accessibilityHint={`Navigate to ${tab.label}`}
          >
            <Text style={[
              styles.tabIcon,
              activeTab === tab.key && styles.activeTabIcon
            ]}>
              {tab.icon}
            </Text>
            <Text style={[
              styles.tabLabel,
              activeTab === tab.key && styles.activeTabLabel
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    minHeight: 60,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    minHeight: 65,
  },
  activeTab: {
    backgroundColor: '#F0F4FF',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
    color: '#6B7280',
  },
  activeTabIcon: {
    color: '#1D0A69',
  },
  tabLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeTabLabel: {
    color: '#1D0A69',
    fontWeight: '600',
  },
});

export default BottomTabBar;
