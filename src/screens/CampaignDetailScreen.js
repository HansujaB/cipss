import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { getScoreColor, getScoreLabel } from '../utils/impactScore';
import { domainColors, domainLabels } from '../constants/dummyData';

export default function CampaignDetailScreen({ route, navigation }) {
  const { campaign } = route.params;
  const scoreColor = getScoreColor(campaign.impactScore);
  const domainColor = domainColors[campaign.domain] || '#888';
  const fundingPercent = Math.min(
    Math.round((campaign.fundingRaised / campaign.fundingGoal) * 100),
    100
  );

  const ScoreRow = ({ label, value }) => (
    <View style={styles.scoreRow}>
      <Text style={styles.scoreRowLabel}>{label}</Text>
      <View style={styles.scoreBarWrap}>
        <View style={[styles.scoreBar, { width: `${value * 10}%`, backgroundColor: getScoreColor(value) }]} />
      </View>
      <Text style={[styles.scoreRowValue, { color: getScoreColor(value) }]}>{value}/10</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Domain + Title */}
        <View style={[styles.domainBadge, { backgroundColor: domainColor + '22', borderColor: domainColor }]}>
          <Text style={[styles.domainText, { color: domainColor }]}>
            {domainLabels[campaign.domain] || campaign.domain}
          </Text>
        </View>
        <Text style={styles.title}>{campaign.title}</Text>
        <Text style={styles.location}>📍 {campaign.location}</Text>

        {/* Description */}
        <Text style={styles.sectionTitle}>About this Campaign</Text>
        <Text style={styles.description}>{campaign.description}</Text>

        {/* Impact Score */}
        <View style={[styles.impactBox, { borderColor: scoreColor }]}>
          <Text style={styles.impactBoxLabel}>Overall Impact Score</Text>
          <Text style={[styles.impactScore, { color: scoreColor }]}>⚡ {campaign.impactScore}</Text>
          <Text style={[styles.impactLabel, { color: scoreColor }]}>{getScoreLabel(campaign.impactScore)}</Text>
        </View>

        {/* Sub-scores */}
        <Text style={styles.sectionTitle}>Score Breakdown</Text>
        <ScoreRow label="Need Score" value={campaign.needScore} />
        <ScoreRow label="Trust Score" value={campaign.trustScore} />
        <ScoreRow label="Expected Impact" value={campaign.expectedImpact} />

        {/* Funding Progress */}
        <Text style={styles.sectionTitle}>Funding Progress</Text>
        <View style={styles.fundingCard}>
          <View style={styles.fundingBar}>
            <View style={[styles.fundingFill, { width: `${fundingPercent}%`, backgroundColor: scoreColor }]} />
          </View>
          <View style={styles.fundingMeta}>
            <Text style={styles.fundingRaised}>₹{campaign.fundingRaised.toLocaleString()} raised</Text>
            <Text style={styles.fundingGoal}>Goal: ₹{campaign.fundingGoal.toLocaleString()}</Text>
          </View>
          <Text style={styles.fundingPercent}>{fundingPercent}% funded</Text>
        </View>

        <Text style={styles.volunteers}>👥 {campaign.volunteers} volunteers enrolled</Text>

        {/* Fund CTA */}
        <TouchableOpacity
          style={[styles.fundBtn, { backgroundColor: scoreColor }]}
          onPress={() => navigation.navigate('Funding', { campaign })}
        >
          <Text style={styles.fundBtnText}>💳 Fund this Campaign</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { padding: 20, paddingBottom: 40 },
  backBtn: { marginBottom: 16 },
  backText: { fontSize: 15, color: '#3B82F6', fontWeight: '600' },
  domainBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  domainText: { fontSize: 12, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '800', color: '#1A1A2E', marginBottom: 6 },
  location: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#374151', marginBottom: 10, marginTop: 16 },
  description: { fontSize: 14, color: '#6B7280', lineHeight: 22 },
  impactBox: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#fff',
  },
  impactBoxLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '500', marginBottom: 4 },
  impactScore: { fontSize: 42, fontWeight: '900' },
  impactLabel: { fontSize: 14, fontWeight: '700', marginTop: 4 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  scoreRowLabel: { fontSize: 13, color: '#374151', width: 110 },
  scoreBarWrap: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  scoreBar: { height: '100%', borderRadius: 4 },
  scoreRowValue: { fontSize: 12, fontWeight: '700', width: 36, textAlign: 'right' },
  fundingCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  fundingBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  fundingFill: { height: '100%', borderRadius: 4 },
  fundingMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  fundingRaised: { fontSize: 13, fontWeight: '600', color: '#374151' },
  fundingGoal: { fontSize: 13, color: '#9CA3AF' },
  fundingPercent: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  volunteers: { fontSize: 13, color: '#9CA3AF', marginTop: 14 },
  fundBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  fundBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});