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
  SPOTLIGHT_DATA,
  getSpotlights,
  getSpotlightById,
  getFeaturedSpotlights,
  getCategories,
  createSpotlight,
  updateSpotlight,
  deleteSpotlight,
  likeSpotlight,
  shareSpotlight,
  viewSpotlight,
  createNomination,
  getNominations,
  reviewNomination,
  getSpotlightStats,
  getSpotlightHistory,
  searchSpotlights,
  getTrendingSpotlights,
  archiveExpiredSpotlights,
} from '../services/spotlightService';

export default function SpotlightScreen() {
  const [activeTab, setActiveTab] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { key: 'featured', label: 'Featured', icon: '⭐' },
    { key: 'all', label: 'All', icon: '📋' },
    { key: 'nominations', label: 'Nominations', icon: '📝' },
    { key: 'create', label: 'Create', icon: '✨' },
    { key: 'history', label: 'History', icon: '📚' },
  ];

  const categories = getCategories();
  const featuredSpotlights = getFeaturedSpotlights();
  const allSpotlights = getSpotlights();
  const nominations = getNominations();
  const spotlightStats = getSpotlightStats();
  const trendingSpotlights = getTrendingSpotlights();

  const handleLikeSpotlight = (spotlightId) => {
    const result = likeSpotlight(spotlightId);
    if (result.success) {
      // Force re-render by updating state
      setActiveTab(activeTab);
    }
  };

  const handleShareSpotlight = (spotlightId) => {
    const result = shareSpotlight(spotlightId);
    if (result.success) {
      Alert.alert('Shared', 'Spotlight shared successfully!');
    }
  };

  const handleViewSpotlight = (spotlightId) => {
    viewSpotlight(spotlightId);
  };

  const handleNominate = () => {
    Alert.alert(
      'Nominate Spotlight',
      'Who would you like to nominate for a spotlight?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Nominate',
          onPress: () => {
            Alert.alert('Success', 'Nomination submitted successfully!');
          }
        }
      ]
    );
  };

  const handleReviewNomination = (nominationId, decision) => {
    const result = reviewNomination(nominationId, decision, 'admin');
    if (result.success) {
      Alert.alert('Success', `Nomination ${decision}!`);
    }
  };

  const getFilteredSpotlights = () => {
    let spotlights = activeTab === 'featured' ? featuredSpotlights : allSpotlights;
    
    if (selectedCategory !== 'all') {
      spotlights = spotlights.filter(s => s.category === selectedCategory);
    }
    
    if (searchQuery) {
      spotlights = searchSpotlights(searchQuery);
    }
    
    return spotlights;
  };

  const renderSpotlightCard = ({ item }) => (
    <TouchableOpacity
      style={styles.spotlightCard}
      onPress={() => handleViewSpotlight(item.id)}
    >
      <View style={styles.spotlightHeader}>
        <View style={styles.spotlightImageContainer}>
          <Text style={styles.spotlightImage}>{item.image}</Text>
          {item.featured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>⭐</Text>
            </View>
          )}
        </View>
        <View style={styles.spotlightInfo}>
          <Text style={styles.spotlightTitle}>{item.title}</Text>
          <Text style={styles.spotlightSubtitle}>{item.subtitle}</Text>
          <View style={styles.spotlightMeta}>
            <Text style={styles.spotlightCategory}>{item.category}</Text>
            <Text style={styles.spotlightDate}>{item.date}</Text>
          </View>
        </View>
        <View style={styles.spotlightActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleLikeSpotlight(item.id)}
          >
            <Text style={styles.actionBtnText}>❤️ {item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleShareSpotlight(item.id)}
          >
            <Text style={styles.actionBtnText}>🔄 {item.shares}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.spotlightDescription}>{item.description}</Text>
      
      {item.stats && (
        <View style={styles.spotlightStats}>
          {Object.entries(item.stats).map(([key, value]) => (
            <View key={key} style={styles.statItem}>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{key}</Text>
            </View>
          ))}
        </View>
      )}
      
      <View style={styles.spotlightFooter}>
        <View style={styles.spotlightTags}>
          {item.tags.map((tag, index) => (
            <Text key={index} style={styles.tag}>#{tag}</Text>
          ))}
        </View>
        <Text style={styles.spotlightViews}>👁️ {item.views} views</Text>
      </View>
    </TouchableOpacity>
  );

  const renderNominationCard = ({ item }) => (
    <View style={styles.nominationCard}>
      <View style={styles.nominationHeader}>
        <Text style={styles.nominationTitle}>{item.nomineeName}</Text>
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
      
      <Text style={styles.nominationType}>Type: {item.type}</Text>
      <Text style={styles.nominationNominator}>Nominated by: {item.nominatorName}</Text>
      <Text style={styles.nominationReason}>{item.reason}</Text>
      <Text style={styles.nominationDate}>Submitted: {item.submitted}</Text>
      
      {item.status === 'pending' && (
        <View style={styles.nominationActions}>
          <TouchableOpacity
            style={styles.approveBtn}
            onPress={() => handleReviewNomination(item.id, 'approved')}
          >
            <Text style={styles.approveBtnText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => handleReviewNomination(item.id, 'rejected')}
          >
            <Text style={styles.rejectBtnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyTitle}>{item.title}</Text>
      <Text style={styles.historyType}>Type: {item.spotlightType}</Text>
      <Text style={styles.historyDates}>
        Featured: {item.featuredDate} - Archived: {item.archivedDate}
      </Text>
      <View style={styles.historyStats}>
        <Text style={styles.historyStat}>👁️ {item.totalViews}</Text>
        <Text style={styles.historyStat}>❤️ {item.totalLikes}</Text>
        <Text style={styles.historyStat}>🔄 {item.totalShares}</Text>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'featured':
        return (
          <View style={styles.featuredContainer}>
            {/* Stats Card */}
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>📊 Spotlight Stats</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{spotlightStats.totalSpotlights}</Text>
                  <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{spotlightStats.featuredSpotlights}</Text>
                  <Text style={styles.statLabel}>Featured</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{spotlightStats.totalViews}</Text>
                  <Text style={styles.statLabel}>Views</Text>
                </View>
              </View>
            </View>
            
            {/* Trending */}
            <View style={styles.trendingSection}>
              <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              >
                {trendingSpotlights.map((spotlight, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.trendingCard}
                    onPress={() => handleViewSpotlight(spotlight.id)}
                  >
                    <Text style={styles.trendingImage}>{spotlight.image}</Text>
                    <Text style={styles.trendingTitle}>{spotlight.subtitle}</Text>
                    <Text style={styles.trendingLikes}>❤️ {spotlight.likes}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            {/* Featured Spotlights */}
            <FlatList
              data={getFilteredSpotlights()}
              keyExtractor={(item) => item.id}
              renderItem={renderSpotlightCard}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
        
      case 'all':
        return (
          <View style={styles.allContainer}>
            {/* Search */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search spotlights..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            {/* Categories */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesContainer}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category.key && styles.selectedCategoryChip
                  ]}
                  onPress={() => setSelectedCategory(category.key)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={[
                    styles.categoryLabel,
                    selectedCategory === category.key && styles.selectedCategoryLabel
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <FlatList
              data={getFilteredSpotlights()}
              keyExtractor={(item) => item.id}
              renderItem={renderSpotlightCard}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
        
      case 'nominations':
        return (
          <View style={styles.nominationsContainer}>
            <View style={styles.nominationsHeader}>
              <Text style={styles.sectionTitle}>📝 Nominations</Text>
              <TouchableOpacity style={styles.nominateBtn} onPress={handleNominate}>
                <Text style={styles.nominateBtnText}>+ Nominate</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={nominations}
              keyExtractor={(item) => item.id}
              renderItem={renderNominationCard}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No nominations yet</Text>
                </View>
              }
            />
          </View>
        );
        
      case 'create':
        return (
          <ScrollView style={styles.createContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.createCard}>
              <Text style={styles.createTitle}>✨ Create Spotlight</Text>
              
              <View style={styles.createForm}>
                <Text style={styles.formLabel}>Title</Text>
                <TextInput style={styles.formInput} placeholder="Enter spotlight title" />
                
                <Text style={styles.formLabel}>Subtitle</Text>
                <TextInput style={styles.formInput} placeholder="Enter subtitle or name" />
                
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  placeholder="Describe the spotlight..."
                  multiline
                />
                
                <Text style={styles.formLabel}>Type</Text>
                <View style={styles.typeOptions}>
                  {['volunteer', 'team', 'campaign', 'organization', 'achievement'].map((type, index) => (
                    <TouchableOpacity key={index} style={styles.typeOption}>
                      <Text style={styles.typeOptionText}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <Text style={styles.formLabel}>Priority</Text>
                <View style={styles.priorityOptions}>
                  {['high', 'medium', 'low'].map((priority, index) => (
                    <TouchableOpacity key={index} style={styles.priorityOption}>
                      <Text style={styles.priorityOptionText}>{priority}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <TouchableOpacity style={styles.submitBtn}>
                  <Text style={styles.submitBtnText}>Create Spotlight</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        );
        
      case 'history':
        return (
          <View style={styles.historyContainer}>
            <FlatList
              data={getSpotlightHistory()}
              keyExtractor={(item) => item.id}
              renderItem={renderHistoryItem}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No history yet</Text>
                </View>
              }
            />
          </View>
        );
        
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>🌟 Featured Spotlights</Text>
      
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

  featuredContainer: {
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

  trendingSection: {
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  trendingCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    elevation: 2,
    minWidth: 100,
  },

  trendingImage: {
    fontSize: 24,
    marginBottom: 4,
  },

  trendingTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 2,
  },

  trendingLikes: {
    fontSize: 8,
    color: '#6B7280',
  },

  spotlightCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  spotlightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  spotlightImageContainer: {
    position: 'relative',
    marginRight: 12,
  },

  spotlightImage: {
    fontSize: 32,
  },

  featuredBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  featuredText: {
    fontSize: 10,
  },

  spotlightInfo: {
    flex: 1,
  },

  spotlightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  spotlightSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D0A69',
    marginBottom: 6,
  },

  spotlightMeta: {
    flexDirection: 'row',
    gap: 12,
  },

  spotlightCategory: {
    fontSize: 11,
    color: '#6B7280',
  },

  spotlightDate: {
    fontSize: 11,
    color: '#6B7280',
  },

  spotlightActions: {
    alignItems: 'flex-end',
  },

  actionBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },

  actionBtnText: {
    fontSize: 10,
    color: '#1A1A2E',
  },

  spotlightDescription: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 12,
  },

  spotlightStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },

  spotlightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  spotlightTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
    color: '#6B7280',
  },

  spotlightViews: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  allContainer: {
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

  categoriesContainer: {
    marginBottom: 16,
  },

  categoryChip: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  selectedCategoryChip: {
    backgroundColor: '#1D0A69',
    borderColor: '#1D0A69',
  },

  categoryIcon: {
    fontSize: 12,
    marginRight: 6,
  },

  categoryLabel: {
    fontSize: 11,
    color: '#6B7280',
  },

  selectedCategoryLabel: {
    color: '#FFFFFF',
  },

  nominationsContainer: {
    flex: 1,
  },

  nominationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  nominateBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  nominateBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  nominationCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  nominationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  nominationTitle: {
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

  nominationType: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  nominationNominator: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },

  nominationReason: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 8,
  },

  nominationDate: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 12,
  },

  nominationActions: {
    flexDirection: 'row',
    gap: 8,
  },

  approveBtn: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
  },

  approveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  rejectBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
  },

  rejectBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
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

  typeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  typeOption: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  typeOptionText: {
    fontSize: 12,
    color: '#1A1A2E',
  },

  priorityOptions: {
    flexDirection: 'row',
    gap: 8,
  },

  priorityOption: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flex: 1,
  },

  priorityOptionText: {
    fontSize: 12,
    color: '#1A1A2E',
    textAlign: 'center',
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

  historyContainer: {
    flex: 1,
  },

  historyItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  historyType: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  historyDates: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 8,
  },

  historyStats: {
    flexDirection: 'row',
    gap: 16,
  },

  historyStat: {
    fontSize: 12,
    color: '#6B7280',
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
