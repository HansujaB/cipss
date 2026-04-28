import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import CampaignCard from '../components/CampaignCard';
import StatCard from '../components/StatCard';
import { getScoreColor } from '../utils/impactScore';

const DOMAINS = ['All', 'waste_management', 'education', 'environment'];
const SORT_OPTIONS = [
  { key: 'impactScore', label: 'Impact Score' },
  { key: 'needScore', label: 'Need Score' },
  { key: 'trustScore', label: 'Trust Score' },
  { key: 'fundingGap', label: 'Funding Gap' },
];

// Mock CSR-focused campaign data
const MOCK_CSR_CAMPAIGNS = [
  {
    id: '1',
    title: 'Mumbai Beach Cleanup Initiative',
    location: 'Mumbai, Maharashtra',
    domain: 'waste_management',
    description: 'Large-scale beach cleanup to remove plastic waste and restore marine ecosystems. Partner with local communities for sustained impact.',
    needScore: 9.2,
    trustScore: 8.8,
    impactScore: 9.0,
    fundingGoal: 500000,
    fundingRaised: 320000,
    ngoName: 'Clean Shores Foundation',
    ngoVerified: true,
    volunteers: 120,
    beneficiaries: 5000,
    sdgAlignment: ['SDG 14', 'SDG 15'],
    taxBenefits: '80G eligible',
  },
  {
    id: '2',
    title: 'Delhi Digital Literacy Program',
    location: 'Delhi NCR',
    domain: 'education',
    description: 'Providing digital skills training to 1000 underprivileged youth. Includes computer basics, coding fundamentals, and job readiness.',
    needScore: 8.5,
    trustScore: 9.0,
    impactScore: 8.8,
    fundingGoal: 800000,
    fundingRaised: 450000,
    ngoName: 'Digital Empowerment Trust',
    ngoVerified: true,
    volunteers: 200,
    beneficiaries: 1000,
    sdgAlignment: ['SDG 4', 'SDG 8'],
    taxBenefits: '80G eligible',
  },
  {
    id: '3',
    title: 'Bengaluru Urban Forest Project',
    location: 'Bengaluru, Karnataka',
    domain: 'environment',
    description: 'Creating urban green spaces through native tree plantation. Combat air pollution and urban heat island effect.',
    needScore: 8.0,
    trustScore: 8.5,
    impactScore: 8.2,
    fundingGoal: 600000,
    fundingRaised: 580000,
    ngoName: 'Green City Initiative',
    ngoVerified: true,
    volunteers: 350,
    beneficiaries: 20000,
    sdgAlignment: ['SDG 11', 'SDG 13'],
    taxBenefits: '80G eligible',
  },
  {
    id: '4',
    title: 'Rural Water Access Program',
    location: 'Rajasthan',
    domain: 'environment',
    description: 'Installing solar-powered water purification systems in 50 villages. Provide clean drinking water to 10,000+ residents.',
    needScore: 9.5,
    trustScore: 8.2,
    impactScore: 9.1,
    fundingGoal: 1200000,
    fundingRaised: 720000,
    ngoName: 'Water for All Foundation',
    ngoVerified: true,
    volunteers: 85,
    beneficiaries: 10000,
    sdgAlignment: ['SDG 6', 'SDG 7'],
    taxBenefits: '80G + CSR-1 compliant',
  },
  {
    id: '5',
    title: 'Women Waste Warrior Program',
    location: 'Pune, Maharashtra',
    domain: 'waste_management',
    description: 'Training women from slum communities in waste management and upcycling. Creating green jobs and sustainable livelihoods.',
    needScore: 8.8,
    trustScore: 8.0,
    impactScore: 8.5,
    fundingGoal: 400000,
    fundingRaised: 180000,
    ngoName: 'EmpowerHer Collective',
    ngoVerified: true,
    volunteers: 60,
    beneficiaries: 300,
    sdgAlignment: ['SDG 5', 'SDG 8', 'SDG 12'],
    taxBenefits: '80G eligible',
  },
];

export default function CSRMarketplaceScreen({ navigation }) {
  const [campaigns] = useState(MOCK_CSR_CAMPAIGNS);
  const [filtered, setFiltered] = useState(MOCK_CSR_CAMPAIGNS);
  const [search, setSearch] = useState('');
  const [activeDomain, setActiveDomain] = useState('All');
  const [activeSort, setActiveSort] = useState('impactScore');
  const [minScore, setMinScore] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading] = useState(false);

  // Stats for CSR companies
  const stats = {
    totalCampaigns: campaigns.length,
    totalFundingNeeded: campaigns.reduce((s, c) => s + (c.fundingGoal - c.fundingRaised), 0),
    avgImpactScore: (campaigns.reduce((s, c) => s + c.impactScore, 0) / campaigns.length).toFixed(1),
    verifiedNGOs: campaigns.filter(c => c.ngoVerified).length,
  };

  useEffect(() => {
    let result = campaigns;

    // Domain filter
    if (activeDomain !== 'All') {
      result = result.filter((c) => c.domain === activeDomain);
    }

    // Search filter
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.location.toLowerCase().includes(query) ||
          c.ngoName.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query)
      );
    }

    // Min score filter
    if (minScore) {
      const min = parseFloat(minScore);
      result = result.filter((c) => c[activeSort] >= min);
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (activeSort === 'fundingGap') {
        const gapA = a.fundingGoal - a.fundingRaised;
        const gapB = b.fundingGoal - b.fundingRaised;
        return gapB - gapA;
      }
      return b[activeSort] - a[activeSort];
    });

    setFiltered(result);
  }, [search, activeDomain, activeSort, minScore, campaigns]);

  const renderCampaign = ({ item }) => {
    const fundingGap = item.fundingGoal - item.fundingRaised;
    const fundingPercent = Math.round((item.fundingRaised / item.fundingGoal) * 100);
    const scoreColor = getScoreColor(item.impactScore);

    return (
      <TouchableOpacity
        style={styles.csrCard}
        onPress={() => navigation.navigate('CampaignDetail', { campaign: item })}
        activeOpacity={0.85}
      >
        {/* Header with verified badge */}
        <View style={styles.cardHeader}>
          <View style={styles.domainBadge}>
            <Text style={styles.domainText}>{item.domain.replace('_', ' ').toUpperCase()}</Text>
          </View>
          {item.ngoVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.ngoName}>by {item.ngoName}</Text>
        <Text style={styles.location}>📍 {item.location}</Text>

        {/* Scores row */}
        <View style={styles.scoresRow}>
          <View style={styles.scoreBox}>
            <Text style={[styles.scoreValue, { color: scoreColor }]}>{item.impactScore}</Text>
            <Text style={styles.scoreLabel}>Impact</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreValue}>{item.needScore}</Text>
            <Text style={styles.scoreLabel}>Need</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreValue}>{item.trustScore}</Text>
            <Text style={styles.scoreLabel}>Trust</Text>
          </View>
        </View>

        {/* Funding progress */}
        <View style={styles.fundingSection}>
          <View style={styles.fundingBar}>
            <View style={[styles.fundingFill, { width: `${fundingPercent}%`, backgroundColor: scoreColor }]} />
          </View>
          <View style={styles.fundingInfo}>
            <Text style={styles.fundingRaised}>₹{(item.fundingRaised / 100000).toFixed(1)}L raised</Text>
            <Text style={styles.fundingGap}>₹{(fundingGap / 100000).toFixed(1)}L needed</Text>
          </View>
        </View>

        {/* SDG alignment */}
        <View style={styles.sdgRow}>
          {item.sdgAlignment.map((sdg) => (
            <View key={sdg} style={styles.sdgBadge}>
              <Text style={styles.sdgText}>{sdg}</Text>
            </View>
          ))}
        </View>

        {/* Impact metrics */}
        <View style={styles.impactRow}>
          <Text style={styles.impactText}>👥 {item.volunteers} volunteers</Text>
          <Text style={styles.impactText}>🎯 {item.beneficiaries.toLocaleString()} beneficiaries</Text>
        </View>

        {/* Tax benefits */}
        <View style={styles.taxBadge}>
          <Text style={styles.taxText}>📝 {item.taxBenefits}</Text>
        </View>

        {/* Fund button */}
        <TouchableOpacity
          style={[styles.fundBtn, { backgroundColor: scoreColor }]}
          onPress={() => navigation.navigate('Funding', { campaign: item })}
        >
          <Text style={styles.fundBtnText}>Fund This Campaign</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header Stats */}
      <View style={styles.statsHeader}>
        <Text style={styles.pageTitle}>CSR Marketplace</Text>
        <View style={styles.statsRow}>
          <StatCard icon="📋" label="Campaigns" value={stats.totalCampaigns} color="#3B82F6" />
          <StatCard icon="💰" label="Funding Needed" value={`₹${(stats.totalFundingNeeded / 10000000).toFixed(1)}Cr`} color="#22C55E" />
        </View>
        <View style={styles.statsRow}>
          <StatCard icon="⚡" label="Avg Impact" value={stats.avgImpactScore} color="#F59E0B" />
          <StatCard icon="✓" label="Verified NGOs" value={stats.verifiedNGOs} color="#8B5CF6" />
        </View>
      </View>

      {/* Search & Filters */}
      <View style={styles.filterSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search campaigns, NGOs, locations..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />

        <TouchableOpacity style={styles.filterToggle} onPress={() => setShowFilters(!showFilters)}>
          <Text style={styles.filterToggleText}>
            {showFilters ? '▼ Hide Filters' : '▶ Show Filters'}
          </Text>
        </TouchableOpacity>

        {showFilters && (
          <View style={styles.filtersContainer}>
            {/* Domain filter */}
            <Text style={styles.filterLabel}>Domain</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.domainScroll}>
              {DOMAINS.map((domain) => (
                <TouchableOpacity
                  key={domain}
                  style={[styles.domainChip, activeDomain === domain && styles.domainChipActive]}
                  onPress={() => setActiveDomain(domain)}
                >
                  <Text style={[styles.domainChipText, activeDomain === domain && styles.domainChipTextActive]}>
                    {domain === 'All' ? 'All Domains' : domain.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Sort options */}
            <Text style={styles.filterLabel}>Sort By</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortScroll}>
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[styles.sortChip, activeSort === option.key && styles.sortChipActive]}
                  onPress={() => setActiveSort(option.key)}
                >
                  <Text style={[styles.sortChipText, activeSort === option.key && styles.sortChipTextActive]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Min score filter */}
            <Text style={styles.filterLabel}>Minimum {activeSort.replace(/([A-Z])/g, ' $1').trim()}</Text>
            <TextInput
              style={styles.scoreInput}
              placeholder="e.g. 8.0"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={minScore}
              onChangeText={setMinScore}
            />
          </View>
        )}
      </View>

      {/* Results count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          Showing {filtered.length} of {campaigns.length} campaigns
        </Text>
      </View>

      {/* Campaign list */}
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#1D0A69" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderCampaign}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No campaigns match your filters</Text>
              <TouchableOpacity style={styles.resetBtn} onPress={() => {
                setSearch('');
                setActiveDomain('All');
                setMinScore('');
              }}>
                <Text style={styles.resetBtnText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  
  statsHeader: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  filterSection: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1A2E',
    marginBottom: 12,
  },
  filterToggle: {
    paddingVertical: 8,
  },
  filterToggleText: {
    fontSize: 13,
    color: '#3B82F6',
    fontWeight: '600',
  },
  filtersContainer: {
    marginTop: 8,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    marginTop: 12,
  },
  domainScroll: {
    flexGrow: 0,
    marginBottom: 8,
  },
  domainChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  domainChipActive: {
    backgroundColor: '#1A1A2E',
  },
  domainChipText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  domainChipTextActive: {
    color: '#fff',
  },
  sortScroll: {
    flexGrow: 0,
    marginBottom: 8,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  sortChipActive: {
    backgroundColor: '#1D0A69',
  },
  sortChipText: {
    fontSize: 11,
    color: '#6B7280',
  },
  sortChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  scoreInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    width: 100,
  },

  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsText: {
    fontSize: 13,
    color: '#6B7280',
  },

  list: {
    padding: 16,
    paddingBottom: 40,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },

  csrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  domainBadge: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  domainText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  verifiedBadge: {
    backgroundColor: '#E6F9F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    color: '#22C55E',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  ngoName: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
  },

  scoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  scoreBox: {
    alignItems: 'center',
    flex: 1,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  scoreLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },

  fundingSection: {
    marginBottom: 12,
  },
  fundingBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  fundingFill: {
    height: '100%',
    borderRadius: 4,
  },
  fundingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fundingRaised: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  fundingGap: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '700',
  },

  sdgRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  sdgBadge: {
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  sdgText: {
    fontSize: 10,
    color: '#0055A4',
    fontWeight: '600',
  },

  impactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  impactText: {
    fontSize: 12,
    color: '#6B7280',
  },

  taxBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  taxText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '600',
  },

  fundBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  fundBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },

  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  resetBtn: {
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  resetBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
});
