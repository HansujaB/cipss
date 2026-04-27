import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { MOCK_LEADERBOARD } from '../constants/dummyData';

export default function LeaderboardScreen() {

  const renderItem = ({ item }) => {
    const isTop3 = item.rank <= 3;

    return (
      <View style={[styles.card, isTop3 && styles.topCard]}>
        <Text style={styles.rank}>
          {item.rank === 1 ? '🥇' :
           item.rank === 2 ? '🥈' :
           item.rank === 3 ? '🥉' :
           `#${item.rank}`}
        </Text>

        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.meta}>
            {item.campaigns} campaigns • {item.badges.join(' ')}
          </Text>
        </View>

        <Text style={styles.points}>{item.points} pts</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>🏆 Leaderboard</Text>

      <FlatList
        data={MOCK_LEADERBOARD}
        keyExtractor={(item) => item.rank.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1A1A2E',
    padding: 16,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    elevation: 2,
  },

  topCard: {
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },

  rank: {
    fontSize: 18,
    width: 40,
    textAlign: 'center',
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  meta: {
    fontSize: 12,
    color: '#6B7280',
  },

  points: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1D0A69',
  },
});