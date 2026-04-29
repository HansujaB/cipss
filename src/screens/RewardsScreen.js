import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { claimDailyBonus, getMyProfile, redeemReward } from '../services/userService';

const REWARD_OPTIONS = [
  { id: 'reward_1', title: 'Eco Warrior Badge', cost: 25 },
  { id: 'reward_2', title: 'Volunteer Voucher', cost: 50 },
  { id: 'reward_3', title: 'Priority Event Access', cost: 75 },
];

export default function RewardsScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getMyProfile();
      setProfile(data);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load rewards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleDailyBonus = async () => {
    try {
      await claimDailyBonus();
      await loadProfile();
      Alert.alert('Success', 'Daily bonus claimed');
    } catch (error) {
      Alert.alert('Info', error.message || 'Unable to claim daily bonus');
    }
  };

  const handleRedeem = async (reward) => {
    try {
      await redeemReward({ title: reward.title, cost: reward.cost });
      await loadProfile();
      Alert.alert('Success', `${reward.title} redeemed`);
    } catch (error) {
      Alert.alert('Error', error.message || 'Unable to redeem reward');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color="#1D0A69" />
      </View>
    );
  }

  const rewards = profile?.rewards;

  return (
    <FlatList
      data={REWARD_OPTIONS}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.container}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Volunteer Rewards</Text>
            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryValue}>{rewards?.credits || 0}</Text>
                <Text style={styles.summaryLabel}>Credits</Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryValue}>{rewards?.totalPoints || 0}</Text>
                <Text style={styles.summaryLabel}>Points</Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryValue}>{rewards?.certificatesCount || 0}</Text>
                <Text style={styles.summaryLabel}>Certificates</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.dailyBtn} onPress={handleDailyBonus}>
              <Text style={styles.dailyBtnText}>Claim Daily Bonus</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Redeem Rewards</Text>
        </View>
      }
      renderItem={({ item }) => {
        const affordable = (rewards?.credits || 0) >= item.cost;

        return (
          <View style={styles.rewardCard}>
            <View>
              <Text style={styles.rewardTitle}>{item.title}</Text>
              <Text style={styles.rewardCost}>{item.cost} credits</Text>
            </View>
            <TouchableOpacity
              style={[styles.redeemBtn, !affordable && styles.redeemBtnDisabled]}
              onPress={() => handleRedeem(item)}
              disabled={!affordable}
            >
              <Text style={styles.redeemBtnText}>{affordable ? 'Redeem' : 'Locked'}</Text>
            </TouchableOpacity>
          </View>
        );
      }}
      ListFooterComponent={
        <View style={styles.footer}>
          <Text style={styles.sectionTitle}>Recent Reward Events</Text>
          {(rewards?.events || []).slice(0, 6).map((event) => (
            <View key={event.id} style={styles.eventItem}>
              <Text style={styles.eventTitle}>{event.description || event.type}</Text>
              <Text style={styles.eventMeta}>
                {event.pointsDelta >= 0 ? '+' : ''}{event.pointsDelta} pts • {event.creditsDelta >= 0 ? '+' : ''}{event.creditsDelta} credits
              </Text>
            </View>
          ))}
        </View>
      }
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 32,
    backgroundColor: '#F9FAFB',
  },
  container: {
    padding: 16,
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  summaryCard: {
    backgroundColor: '#1D0A69',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  dailyBtn: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dailyBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  rewardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  rewardCost: {
    marginTop: 4,
    color: '#6B7280',
  },
  redeemBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  redeemBtnDisabled: {
    backgroundColor: '#9CA3AF',
  },
  redeemBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  eventItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  eventMeta: {
    marginTop: 4,
    color: '#6B7280',
    fontSize: 12,
  },
});
