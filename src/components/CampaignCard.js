import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { getScoreColor, getScoreLabel } from '../utils/impactScore';
import { domainColors, domainLabels } from '../constants/dummyData';

export default function CampaignCard({ campaign, onPress }) {
  const scoreColor = getScoreColor(campaign.impactScore);
  const domainColor = domainColors[campaign.domain] || '#888';
  const fundingPercent = Math.min(
    Math.round((campaign.fundingRaised / campaign.fundingGoal) * 100),
    100
  );

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(campaign)} activeOpacity={0.85}>
      {/* Domain Badge */}
      <View style={[styles.domainBadge, { backgroundColor: domainColor + '22', borderColor: domainColor }]}>
        <Text style={[styles.domainText, { color: domainColor }]}>
          {domainLabels[campaign.domain] || campaign.domain}
        </Text>
      </View>

      {/* Title & Location */}
      <Text style={styles.title}>{campaign.title}</Text>
      <Text style={styles.location}>📍 {campaign.location}</Text>

      {/* Impact Score */}
      <View style={styles.scoreRow}>
        <View style={[styles.scoreBadge, { backgroundColor: scoreColor + '22', borderColor: scoreColor }]}>
          <Text style={[styles.scoreValue, { color: scoreColor }]}>
            ⚡ {campaign.impactScore}
          </Text>
        </View>
        <Text style={[styles.scoreLabel, { color: scoreColor }]}>
          {getScoreLabel(campaign.impactScore)}
        </Text>
      </View>

      {/* Funding Progress */}
      <View style={styles.fundingSection}>
        <View style={styles.fundingBar}>
          <View style={[styles.fundingFill, { width: `${fundingPercent}%`, backgroundColor: scoreColor }]} />
        </View>
        <View style={styles.fundingInfo}>
          <Text style={styles.fundingText}>₹{campaign.fundingRaised.toLocaleString()} raised</Text>
          <Text style={styles.fundingPercent}>{fundingPercent}%</Text>
        </View>
      </View>

      {/* Volunteers */}
      <Text style={styles.volunteers}>👥 {campaign.volunteers} volunteers</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  domainBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 8,
  },
  domainText: {
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 10,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  scoreBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  scoreValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  fundingSection: {
    marginBottom: 8,
  },
  fundingBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  fundingFill: {
    height: '100%',
    borderRadius: 3,
  },
  fundingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fundingText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  fundingPercent: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  volunteers: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});