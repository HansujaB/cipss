import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import {
  POWER_UPS,
  USER_POWER_UPS,
  USER_COINS,
  usePowerUp as activatePowerUp,
  buyPowerUp,
  getActivePowerUps,
} from '../services/powerUpService';

export default function PowerUpScreen() {
  const [userCoins, setUserCoins] = useState(USER_COINS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [animatingPowerUp, setAnimatingPowerUp] = useState(null);

  const categories = [
    { key: 'all', label: 'All', icon: '🎯' },
    { key: 'points', label: 'Points', icon: '⭐' },
    { key: 'time', label: 'Time', icon: '⏰' },
    { key: 'streak', label: 'Streak', icon: '🔥' },
    { key: 'leaderboard', label: 'Rank', icon: '🏆' },
    { key: 'achievement', label: 'Achievement', icon: '🎖️' },
  ];

  const activePowerUps = getActivePowerUps();

  const filteredPowerUps = Object.values(POWER_UPS).filter(powerUp => 
    selectedCategory === 'all' || powerUp.category === selectedCategory
  );

  const handleBuyPowerUp = (powerUp) => {
    const result = buyPowerUp(powerUp.id, userCoins);
    
    if (result.success) {
      setUserCoins(result.newBalance);
      Alert.alert('Success!', result.message);
      animatePowerUp(powerUp.id);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleUsePowerUp = (powerUp) => {
    const result = activatePowerUp(powerUp.id, userCoins);
    
    if (result.success) {
      Alert.alert('Activated!', result.message);
      animatePowerUp(powerUp.id);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const animatePowerUp = (powerUpId) => {
    setAnimatingPowerUp(powerUpId);
    setTimeout(() => setAnimatingPowerUp(null), 1000);
  };

  const renderPowerUpCard = ({ item }) => {
    const userPowerUp = USER_POWER_UPS[item.id];
    const isAnimating = animatingPowerUp === item.id;
    
    return (
      <Animated.View 
        style={[
          styles.powerUpCard,
          isAnimating && styles.animatingCard,
          userPowerUp?.active && styles.activeCard
        ]}
      >
        <View style={styles.powerUpHeader}>
          <Text style={styles.powerUpIcon}>{item.icon}</Text>
          <View style={styles.powerUpInfo}>
            <Text style={styles.powerUpName}>{item.name}</Text>
            <Text style={styles.powerUpDescription}>{item.description}</Text>
          </View>
          {userPowerUp?.active && (
            <Text style={styles.activeBadge}>ACTIVE</Text>
          )}
        </View>

        <View style={styles.powerUpStats}>
          <View style={styles.powerUpStat}>
            <Text style={styles.powerUpCost}>{item.cost} 🪙</Text>
            <Text style={styles.powerUpDuration}>
              {item.duration === 1 ? 'Instant' : `${item.duration} days`}
            </Text>
          </View>
          
          <View style={styles.powerUpActions}>
            <View style={styles.ownedCount}>
              <Text style={styles.ownedText}>Owned: {userPowerUp?.owned || 0}</Text>
            </View>
            
            {userPowerUp?.owned > 0 ? (
              <TouchableOpacity
                style={styles.useBtn}
                onPress={() => handleUsePowerUp(item)}
              >
                <Text style={styles.useBtnText}>USE</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.buyBtn, userCoins < item.cost && styles.disabledBtn]}
                onPress={() => handleBuyPowerUp(item)}
                disabled={userCoins < item.cost}
              >
                <Text style={styles.buyBtnText}>BUY</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderActivePowerUp = ({ item }) => {
    const expiresAt = new Date(item.expiresAt);
    const now = new Date();
    const hoursLeft = Math.max(0, Math.floor((expiresAt - now) / (1000 * 60 * 60)));
    
    return (
      <View style={styles.activePowerUpCard}>
        <Text style={styles.activePowerUpIcon}>{item.icon}</Text>
        <View style={styles.activePowerUpInfo}>
          <Text style={styles.activePowerUpName}>{item.name}</Text>
          <Text style={styles.activePowerUpTime}>
            {hoursLeft > 0 ? `${hoursLeft}h left` : 'Expires soon'}
          </Text>
        </View>
        <Text style={styles.activeEffect}>{item.effect}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>⚡ Power-Ups</Text>

        {/* Coins Balance */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Your Balance</Text>
          <Text style={styles.balanceAmount}>{userCoins} 🪙</Text>
        </View>

        {/* Active Power-Ups */}
        {activePowerUps.length > 0 && (
          <View style={styles.activeSection}>
            <Text style={styles.sectionTitle}>Active Power-Ups</Text>
            <FlatList
              data={activePowerUps}
              keyExtractor={(item) => item.id}
              renderItem={renderActivePowerUp}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Category Tabs */}
        <View style={styles.categoryTabs}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryTab,
                selectedCategory === category.key && styles.categoryTabActive
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryLabel,
                selectedCategory === category.key && styles.categoryLabelActive
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Power-Ups List */}
        <FlatList
          data={filteredPowerUps}
          keyExtractor={(item) => item.id}
          renderItem={renderPowerUpCard}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How Power-Ups Work:</Text>
          <Text style={styles.infoItem}>• Buy power-ups with coins</Text>
          <Text style={styles.infoItem}>• Use them strategically for maximum impact</Text>
          <Text style={styles.infoItem}>• Some power-ups last multiple days</Text>
          <Text style={styles.infoItem}>• Earn coins by completing campaigns</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1A2E',
    padding: 16,
    paddingBottom: 8,
  },

  balanceCard: {
    backgroundColor: '#1D0A69',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  balanceLabel: {
    fontSize: 16,
    color: '#E5E7EB',
  },

  balanceAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  activeSection: {
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  activePowerUpCard: {
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 3,
    borderLeftColor: '#22C55E',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  activePowerUpIcon: {
    fontSize: 24,
    marginRight: 12,
  },

  activePowerUpInfo: {
    flex: 1,
  },

  activePowerUpName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  activePowerUpTime: {
    fontSize: 12,
    color: '#22C55E',
  },

  activeEffect: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  categoryTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },

  categoryTab: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  categoryTabActive: {
    backgroundColor: '#1D0A69',
    borderColor: '#1D0A69',
  },

  categoryIcon: {
    fontSize: 16,
    marginBottom: 2,
  },

  categoryLabel: {
    fontSize: 10,
    color: '#6B7280',
  },

  categoryLabelActive: {
    color: '#FFFFFF',
  },

  powerUpCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },

  animatingCard: {
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },

  activeCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#22C55E',
  },

  powerUpHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  powerUpIcon: {
    fontSize: 32,
    marginRight: 12,
  },

  powerUpInfo: {
    flex: 1,
  },

  powerUpName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  powerUpDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },

  activeBadge: {
    fontSize: 10,
    color: '#FFFFFF',
    backgroundColor: '#22C55E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '600',
  },

  powerUpStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  powerUpStat: {
    alignItems: 'flex-start',
  },

  powerUpCost: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 2,
  },

  powerUpDuration: {
    fontSize: 12,
    color: '#6B7280',
  },

  powerUpActions: {
    alignItems: 'flex-end',
    gap: 8,
  },

  ownedCount: {
    marginBottom: 4,
  },

  ownedText: {
    fontSize: 12,
    color: '#6B7280',
  },

  useBtn: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },

  useBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  buyBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },

  disabledBtn: {
    backgroundColor: '#D1D5DB',
  },

  buyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  infoSection: {
    backgroundColor: '#F3F4F6',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  infoItem: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
});
