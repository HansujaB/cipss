import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const NavigationHeader = ({ title, onMenuPress, onNotificationPress, onProfilePress, showBackButton = false, onBackPress }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1D0A69" />
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {showBackButton ? (
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={onBackPress}
              accessibilityLabel="Go back"
              accessibilityRole="button"
              accessibilityHint="Navigate to previous screen"
            >
              <Text style={styles.iconText}>←</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={onMenuPress}
              accessibilityLabel="Menu"
              accessibilityRole="button"
              accessibilityHint="Open navigation menu"
            >
              <Text style={styles.iconText}>☰</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.centerSection}>
          <Text style={styles.title} accessibilityRole="header">{title}</Text>
        </View>
        
        <View style={styles.rightSection}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onNotificationPress}
            accessibilityLabel="Notifications"
            accessibilityRole="button"
            accessibilityHint="View notifications"
          >
            <Text style={styles.iconText}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onProfilePress}
            accessibilityLabel="Profile"
            accessibilityRole="button"
            accessibilityHint="View your profile"
          >
            <Text style={styles.iconText}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#1D0A69',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1D0A69',
    minHeight: 56,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 80,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default NavigationHeader;
