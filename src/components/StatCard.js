import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatCard({ icon, label, value, color = '#3B82F6' }) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flex: 1,
    marginHorizontal: 5,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: 22,
    marginBottom: 6,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});