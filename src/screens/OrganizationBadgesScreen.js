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
  TextInput,
} from 'react-native';
import {
  ORGANIZATION_DATA,
  getOrganizations,
  getOrganizationById,
  getOrganizationBadges,
  getAllCustomBadges,
  getUserCustomBadges,
  createBadgeApplication,
  getBadgeApplications,
  reviewBadgeApplication,
  awardCustomBadge,
  getBadgeStats,
  searchBadges,
  getBadgeRecommendations,
  getRarityColor,
  verifyBadgeAuthenticity,
} from '../services/organizationService';

export default function OrganizationBadgesScreen() {
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedOrganization, setSelectedOrganization] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('all');

  const tabs = [
    { key: 'discover', label: 'Discover', icon: '🔍' },
    { key: 'myBadges', label: 'My Badges', icon: '🏆' },
    { key: 'organizations', label: 'Organizations', icon: '🏢' },
    { key: 'applications', label: 'Applications', icon: '📝' },
    { key: 'create', label: 'Create', icon: '✨' },
  ];

  const rarities = [
    { key: 'all', label: 'All', color: '#6B7280' },
    { key: 'legendary', label: 'Legendary', color: '#F59E0B' },
    { key: 'epic', label: 'Epic', color: '#8B5CF6' },
    { key: 'rare', label: 'Rare', color: '#3B82F6' },
    { key: 'uncommon', label: 'Uncommon', color: '#22C55E' },
    { key: 'common', label: 'Common', color: '#6B7280' },
  ];

  const organizations = [
    { key: 'all', name: 'All Organizations', logo: '🌍' },
    ...getOrganizations(),
  ];

  const userBadges = getUserCustomBadges();
  const allBadges = getAllCustomBadges();
  const applications = getBadgeApplications();
  const badgeStats = getBadgeStats();
  const recommendations = getBadgeRecommendations();

  const handleApplyForBadge = (badge) => {
    Alert.alert(
      'Apply for Badge',
      `Would you like to apply for the "${badge.name}" badge from ${badge.organizationName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply',
          onPress: () => {
            Alert.alert('Success', 'Application submitted successfully!');
          }
        }
      ]
    );
  };

  const handleVerifyBadge = (userBadgeId) => {
    const verification = verifyBadgeAuthenticity(userBadgeId);
    if (verification.valid) {
      Alert.alert(
        'Badge Verified',
        `This badge is authentic!\n\nOrganization: ${verification.organization.name}\nBadge: ${verification.badge.name}\nVerification Code: ${verification.verificationCode}`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Verification Failed', verification.reason);
    }
  };

  const getFilteredBadges = () => {
    let filtered = allBadges;
    
    if (selectedOrganization !== 'all') {
      filtered = filtered.filter(badge => badge.organizationId === selectedOrganization);
    }
    
    if (selectedRarity !== 'all') {
      filtered = filtered.filter(badge => badge.rarity === selectedRarity);
    }
    
    if (searchQuery) {
      filtered = searchBadges(searchQuery, {
        organizationId: selectedOrganization === 'all' ? null : selectedOrganization,
        rarity: selectedRarity === 'all' ? null : selectedRarity,
      });
    }
    
    return filtered;
  };

  const renderBadgeCard = ({ item }) => (
    <View style={styles.badgeCard}>
      <View style={styles.badgeHeader}>
        <View style={styles.badgeIconContainer}>
          <Text style={styles.badgeIcon}>{item.icon}</Text>
          <View style={[styles.rarityIndicator, { backgroundColor: getRarityColor(item.rarity) }]} />
        </View>
        <View style={styles.badgeInfo}>
          <Text style={styles.badgeName}>{item.name}</Text>
          <Text style={styles.badgeDescription}>{item.description}</Text>
          <View style={styles.badgeMeta}>
            <Text style={[styles.badgeRarity, { color: getRarityColor(item.rarity) }]}>
              {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
            </Text>
            <Text style={styles.badgeOrganization}>{item.organizationName}</Text>
          </View>
        </View>
        <View style={styles.badgeStats}>
          <Text style={styles.awardedCount}>{item.awardedCount}</Text>
          <Text style={styles.awardedLabel}>awarded</Text>
        </View>
      </View>
      
      <View style={styles.badgeRequirements}>
        <Text style={styles.requirementsTitle}>Requirements:</Text>
        {Object.entries(item.requirements).map(([key, value]) => (
          <Text key={key} style={styles.requirementItem}>
            • {key}: {value}
          </Text>
        ))}
      </View>
      
      <TouchableOpacity
        style={styles.applyBtn}
        onPress={() => handleApplyForBadge(item)}
      >
        <Text style={styles.applyBtnText}>Apply for Badge</Text>
      </TouchableOpacity>
    </View>
  );

  const renderUserBadgeCard = ({ item }) => (
    <View style={styles.userBadgeCard}>
      <View style={styles.userBadgeHeader}>
        <View style={styles.userBadgeIconContainer}>
          <Text style={styles.userBadgeIcon}>{item.badge.icon}</Text>
          <View style={[styles.rarityIndicator, { backgroundColor: getRarityColor(item.badge.rarity) }]} />
        </View>
        <View style={styles.userBadgeInfo}>
          <Text style={styles.userBadgeName}>{item.badge.name}</Text>
          <Text style={styles.userBadgeOrganization}>{item.organization.name}</Text>
          <Text style={styles.userBadgeDate}>Awarded: {item.awarded}</Text>
        </View>
        <TouchableOpacity
          style={styles.verifyBtn}
          onPress={() => handleVerifyBadge(item.id)}
        >
          <Text style={styles.verifyBtnText}>Verify</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.verificationBadge}>
        <Text style={styles.verificationText}>✓ Verified Authentic</Text>
      </View>
    </View>
  );

  const renderOrganizationCard = ({ item }) => {
    const orgBadges = getOrganizationBadges(item.id);
    const userOrgBadges = userBadges.filter(ub => ub.organizationId === item.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.organizationCard,
          selectedOrganization === item.id && styles.selectedOrganizationCard
        ]}
        onPress={() => setSelectedOrganization(item.id)}
      >
        <View style={styles.organizationHeader}>
          <Text style={styles.organizationLogo}>{item.logo}</Text>
          <View style={styles.organizationInfo}>
            <Text style={styles.organizationName}>{item.name}</Text>
            <Text style={styles.organizationDescription}>{item.description}</Text>
            <View style={styles.organizationMeta}>
              <Text style={styles.organizationIndustry}>{item.industry}</Text>
              <Text style={styles.organizationRating}>⭐ {item.rating}</Text>
            </View>
          </View>
          {item.verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          )}
        </View>
        
        <View style={styles.organizationStats}>
          <View style={styles.organizationStat}>
            <Text style={styles.statValue}>{orgBadges.length}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
          <View style={styles.organizationStat}>
            <Text style={styles.statValue}>{item.totalVolunteers}</Text>
            <Text style={styles.statLabel}>Volunteers</Text>
          </View>
          <View style={styles.organizationStat}>
            <Text style={styles.statValue}>{userOrgBadges.length}</Text>
            <Text style={styles.statLabel}>Your Badges</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderApplicationCard = ({ item }) => (
    <View style={styles.applicationCard}>
      <View style={styles.applicationHeader}>
        <Text style={styles.applicationName}>{item.badgeName}</Text>
        <View style={[
          styles.statusBadge,
          item.status === 'approved' && styles.approvedBadge,
          item.status === 'pending' && styles.pendingBadge,
          item.status === 'rejected' && styles.rejectedBadge
        ]}>
          <Text style={[
            styles.statusText,
            item.status === 'approved' && styles.approvedText,
            item.status === 'pending' && styles.pendingText,
            item.status === 'rejected' && styles.rejectedText
          ]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <Text style={styles.applicationDescription}>{item.description}</Text>
      <Text style={styles.applicationDate}>Submitted: {item.submitted}</Text>
      
      {item.status === 'approved' && (
        <Text style={styles.approvedDate}>Approved: {item.approved}</Text>
      )}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'discover':
        return (
          <View style={styles.discoverContainer}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search badges..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            {/* Filters */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filtersContainer}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Organizations:</Text>
                {organizations.map((org, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.filterChip,
                      selectedOrganization === org.key && styles.selectedFilterChip
                    ]}
                    onPress={() => setSelectedOrganization(org.key)}
                  >
                    <Text style={styles.filterChipText}>{org.logo} {org.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Rarity:</Text>
                {rarities.map((rarity, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.filterChip,
                      selectedRarity === rarity.key && styles.selectedFilterChip
                    ]}
                    onPress={() => setSelectedRarity(rarity.key)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      { color: selectedRarity === rarity.key ? '#FFFFFF' : rarity.color }
                    ]}>
                      {rarity.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            {/* Recommendations */}
            <View style={styles.recommendationsSection}>
              <Text style={styles.sectionTitle}>🎯 Recommended for You</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              >
                {recommendations.map((badge, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.recommendationCard}
                    onPress={() => handleApplyForBadge(badge)}
                  >
                    <Text style={styles.recommendationIcon}>{badge.icon}</Text>
                    <Text style={styles.recommendationName}>{badge.name}</Text>
                    <Text style={styles.recommendationOrg}>{badge.organizationName}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            {/* Badges List */}
            <FlatList
              data={getFilteredBadges()}
              keyExtractor={(item) => item.id}
              renderItem={renderBadgeCard}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No badges found</Text>
                </View>
              }
            />
          </View>
        );
        
      case 'myBadges':
        return (
          <View style={styles.myBadgesContainer}>
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>📊 Your Badge Stats</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{userBadges.length}</Text>
                  <Text style={styles.statLabel}>Total Badges</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{userBadges.filter(ub => ub.badge.rarity === 'legendary').length}</Text>
                  <Text style={styles.statLabel}>Legendary</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{userBadges.filter(ub => ub.badge.rarity === 'epic').length}</Text>
                  <Text style={styles.statLabel}>Epic</Text>
                </View>
              </View>
            </View>
            
            <FlatList
              data={userBadges}
              keyExtractor={(item) => item.id}
              renderItem={renderUserBadgeCard}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No badges earned yet</Text>
                </View>
              }
            />
          </View>
        );
        
      case 'organizations':
        return (
          <View style={styles.organizationsContainer}>
            <View style={styles.globalStatsCard}>
              <Text style={styles.globalStatsTitle}>🌍 Global Stats</Text>
              <View style={styles.globalStatsGrid}>
                <View style={styles.globalStatItem}>
                  <Text style={styles.globalStatValue}>{badgeStats.totalOrganizations}</Text>
                  <Text style={styles.globalStatLabel}>Organizations</Text>
                </View>
                <View style={styles.globalStatItem}>
                  <Text style={styles.globalStatValue}>{badgeStats.totalBadges}</Text>
                  <Text style={styles.globalStatLabel}>Total Badges</Text>
                </View>
                <View style={styles.globalStatItem}>
                  <Text style={styles.globalStatValue}>{badgeStats.totalAwarded}</Text>
                  <Text style={styles.globalStatLabel}>Total Awarded</Text>
                </View>
              </View>
            </View>
            
            <FlatList
              data={organizations}
              keyExtractor={(item) => item.key}
              renderItem={renderOrganizationCard}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
        
      case 'applications':
        return (
          <View style={styles.applicationsContainer}>
            <FlatList
              data={applications}
              keyExtractor={(item) => item.id}
              renderItem={renderApplicationCard}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No applications</Text>
                </View>
              }
            />
          </View>
        );
        
      case 'create':
        return (
          <ScrollView style={styles.createContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.createCard}>
              <Text style={styles.createTitle}>✨ Create Custom Badge</Text>
              <Text style={styles.createDescription}>
                Design a custom badge for your organization
              </Text>
              
              <View style={styles.createForm}>
                <Text style={styles.formLabel}>Badge Name</Text>
                <TextInput style={styles.formInput} placeholder="Enter badge name" />
                
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  placeholder="Describe what this badge represents"
                  multiline
                />
                
                <Text style={styles.formLabel}>Choose Icon</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {['🏆', '⭐', '🌟', '💎', '🎯', '🔥', '💪', '🎖️'].map((icon, index) => (
                    <TouchableOpacity key={index} style={styles.iconOption}>
                      <Text style={styles.iconOptionText}>{icon}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                
                <Text style={styles.formLabel}>Rarity</Text>
                <View style={styles.rarityOptions}>
                  {rarities.slice(1).map((rarity, index) => (
                    <TouchableOpacity key={index} style={styles.rarityOption}>
                      <View style={[styles.rarityDot, { backgroundColor: rarity.color }]} />
                      <Text style={styles.rarityOptionText}>{rarity.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <TouchableOpacity style={styles.submitBtn}>
                  <Text style={styles.submitBtnText}>Submit for Review</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        );
        
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>🏢 Organization Badges</Text>
      
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.tabActive
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[
              styles.tabLabel,
              activeTab === tab.key && styles.tabLabelActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {renderContent()}
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

  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 4,
  },

  tab: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  tabActive: {
    backgroundColor: '#1D0A69',
    borderColor: '#1D0A69',
  },

  tabIcon: {
    fontSize: 12,
    marginBottom: 2,
  },

  tabLabel: {
    fontSize: 8,
    color: '#6B7280',
  },

  tabLabelActive: {
    color: '#FFFFFF',
  },

  discoverContainer: {
    flex: 1,
  },

  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  filtersContainer: {
    marginBottom: 16,
  },

  filterSection: {
    marginRight: 16,
  },

  filterTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  filterChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  selectedFilterChip: {
    backgroundColor: '#1D0A69',
    borderColor: '#1D0A69',
  },

  filterChipText: {
    fontSize: 11,
    color: '#6B7280',
  },

  recommendationsSection: {
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  recommendationCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    elevation: 2,
    minWidth: 100,
  },

  recommendationIcon: {
    fontSize: 24,
    marginBottom: 4,
  },

  recommendationName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 2,
  },

  recommendationOrg: {
    fontSize: 8,
    color: '#6B7280',
    textAlign: 'center',
  },

  badgeCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  badgeIconContainer: {
    position: 'relative',
    marginRight: 12,
  },

  badgeIcon: {
    fontSize: 32,
  },

  rarityIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  badgeInfo: {
    flex: 1,
  },

  badgeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  badgeDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },

  badgeMeta: {
    flexDirection: 'row',
    gap: 12,
  },

  badgeRarity: {
    fontSize: 11,
    fontWeight: '600',
  },

  badgeOrganization: {
    fontSize: 11,
    color: '#6B7280',
  },

  badgeStats: {
    alignItems: 'flex-end',
  },

  awardedCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 2,
  },

  awardedLabel: {
    fontSize: 10,
    color: '#6B7280',
  },

  badgeRequirements: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  requirementsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 6,
  },

  requirementItem: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },

  applyBtn: {
    backgroundColor: '#1D0A69',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  myBadgesContainer: {
    flex: 1,
  },

  statsCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  statItem: {
    alignItems: 'center',
  },

  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 11,
    color: '#6B7280',
  },

  userBadgeCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  userBadgeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  userBadgeIconContainer: {
    position: 'relative',
    marginRight: 12,
  },

  userBadgeIcon: {
    fontSize: 32,
  },

  userBadgeInfo: {
    flex: 1,
  },

  userBadgeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  userBadgeOrganization: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },

  userBadgeDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  verifyBtn: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  verifyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  verificationBadge: {
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },

  verificationText: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '600',
  },

  organizationsContainer: {
    flex: 1,
  },

  globalStatsCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  globalStatsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  globalStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  globalStatItem: {
    alignItems: 'center',
  },

  globalStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 4,
  },

  globalStatLabel: {
    fontSize: 11,
    color: '#6B7280',
  },

  organizationCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  selectedOrganizationCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#1D0A69',
  },

  organizationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  organizationLogo: {
    fontSize: 32,
    marginRight: 12,
  },

  organizationInfo: {
    flex: 1,
  },

  organizationName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  organizationDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },

  organizationMeta: {
    flexDirection: 'row',
    gap: 12,
  },

  organizationIndustry: {
    fontSize: 11,
    color: '#6B7280',
  },

  organizationRating: {
    fontSize: 11,
    color: '#F59E0B',
  },

  verifiedBadge: {
    backgroundColor: '#F0FDF4',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  verifiedText: {
    color: '#22C55E',
    fontSize: 12,
    fontWeight: '700',
  },

  organizationStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  organizationStat: {
    alignItems: 'center',
  },

  applicationsContainer: {
    flex: 1,
  },

  applicationCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  applicationName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  approvedBadge: {
    backgroundColor: '#F0FDF4',
  },

  pendingBadge: {
    backgroundColor: '#FFFBEB',
  },

  rejectedBadge: {
    backgroundColor: '#FEF2F2',
  },

  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },

  approvedText: {
    color: '#22C55E',
  },

  pendingText: {
    color: '#F59E0B',
  },

  rejectedText: {
    color: '#EF4444',
  },

  applicationDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },

  applicationDate: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2,
  },

  approvedDate: {
    fontSize: 11,
    color: '#22C55E',
  },

  createContainer: {
    flex: 1,
    padding: 16,
  },

  createCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 14,
    elevation: 2,
  },

  createTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  createDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },

  createForm: {
    gap: 16,
  },

  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  formInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },

  iconOption: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  iconOptionText: {
    fontSize: 20,
  },

  rarityOptions: {
    flexDirection: 'row',
    gap: 12,
  },

  rarityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  rarityOptionText: {
    fontSize: 12,
    color: '#1A1A2E',
  },

  submitBtn: {
    backgroundColor: '#1D0A69',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
