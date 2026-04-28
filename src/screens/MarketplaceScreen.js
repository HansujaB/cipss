import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  getCategories,
  getSkills,
  getExchanges,
  createExchange,
  getReviews,
  createReview,
  likeService,
  viewService,
  inquireService,
  getUserMarketplaceProfile,
  getRecommendedServices,
  getTrendingServices,
  verifyService,
  featureService,
  reportService,
  getServiceStatistics,
  getProviderEarnings,
} from '../services/marketplaceService';

const { width } = Dimensions.get('window');

export default function MarketplaceScreen() {
  const [activeTab, setActiveTab] = useState('browse');
  const [services, setServices] = useState(getServices());
  const [categories, setCategories] = useState(getCategories());
  const [skills, setSkills] = useState(getSkills());
  const [exchanges, setExchanges] = useState(getExchanges());
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [createServiceModalVisible, setCreateServiceModalVisible] = useState(false);
  const [exchangeModalVisible, setExchangeModalVisible] = useState(false);
  const [inquiryModalVisible, setInquiryModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    featured: false,
    verified: false,
    remote: false,
    priceRange: null,
  });

  const tabs = [
    { key: 'browse', label: 'Browse', icon: '🔍' },
    { key: 'my_services', label: 'My Services', icon: '📋' },
    { key: 'exchanges', label: 'Exchanges', icon: '🔄' },
    { key: 'skills', label: 'Skills', icon: '🛠️' },
    { key: 'create', label: 'Create', icon: '➕' },
  ];

  useEffect(() => {
    // Refresh data periodically
    const interval = setInterval(() => {
      setServices(getServices());
      setExchanges(getExchanges());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleServicePress = (service) => {
    viewService(service.id);
    setSelectedService(service);
    setServiceModalVisible(true);
  };

  const handleLikeService = (serviceId) => {
    likeService(serviceId, 'current_user');
    setServices(getServices());
  };

  const handleInquireService = (serviceId) => {
    setSelectedService(getServiceById(serviceId));
    setInquiryModalVisible(true);
  };

  const handleCreateExchange = (serviceId) => {
    setSelectedService(getServiceById(serviceId));
    setExchangeModalVisible(true);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredServices = getServices({ search: query, ...filters, sortBy });
    setServices(filteredServices);
  };

  const handleFilter = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    const filteredServices = getServices({ search: searchQuery, ...newFilters, sortBy });
    setServices(filteredServices);
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    const sortedServices = getServices({ search: searchQuery, ...filters, sortBy: sortType });
    setServices(sortedServices);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const filteredServices = getServices({ category: category.name, search: searchQuery, ...filters, sortBy });
    setServices(filteredServices);
  };

  const renderServiceCard = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => handleServicePress(item)}
    >
      <View style={styles.serviceHeader}>
        <View style={styles.providerInfo}>
          <Text style={styles.providerAvatar}>{item.providerAvatar}</Text>
          <View style={styles.providerDetails}>
            <Text style={styles.providerName}>{item.providerName}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {item.providerRating}</Text>
              <Text style={styles.reviewCount}>({item.providerReviews})</Text>
            </View>
          </View>
        </View>
        <View style={styles.serviceMeta}>
          {item.featured && <View style={styles.featuredBadge}><Text style={styles.badgeText}>Featured</Text></View>}
          {item.verified && <View style={styles.verifiedBadge}><Text style={styles.badgeText}>✓</Text></View>}
        </View>
      </View>
      
      <Text style={styles.serviceTitle}>{item.title}</Text>
      <Text style={styles.serviceDescription} numberOfLines={2}>{item.description}</Text>
      
      <View style={styles.skillsContainer}>
        {item.skills.slice(0, 3).map((skill, index) => (
          <View key={index} style={styles.skillTag}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
        {item.skills.length > 3 && (
          <Text style={styles.moreSkillsText}>+{item.skills.length - 3} more</Text>
        )}
      </View>
      
      <View style={styles.serviceFooter}>
        <View style={styles.pricingInfo}>
          <Text style={styles.price}>
            ${item.pricing.rate}/{item.pricing.type === 'hourly' ? 'hr' : item.pricing.type === 'monthly' ? 'mo' : 'project'}
          </Text>
          <Text style={styles.experience}>{item.experience}</Text>
        </View>
        <View style={styles.serviceActions}>
          <TouchableOpacity
            style={styles.likeBtn}
            onPress={() => handleLikeService(item.id)}
          >
            <Text style={styles.likeBtnText}>❤️ {item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.inquireBtn}
            onPress={() => handleInquireService(item.id)}
          >
            <Text style={styles.inquireBtnText}>Inquire</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryCard = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        selectedCategory?.name === item.name && styles.categoryCardSelected
      ]}
      onPress={() => handleCategorySelect(item)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryCount}>{item.services} services</Text>
    </TouchableOpacity>
  );

  const renderExchangeItem = ({ item }) => (
    <View style={styles.exchangeCard}>
      <View style={styles.exchangeHeader}>
        <Text style={styles.exchangeType}>
          {item.type === 'skill_barter' ? '🔄 Skill Exchange' : '💳 Service Purchase'}
        </Text>
        <Text style={styles.exchangeStatus}>{item.status}</Text>
      </View>
      
      <View style={styles.exchangeParticipants}>
        <View style={styles.participant}>
          <Text style={styles.participantName}>{item.initiatorName}</Text>
          <Text style={styles.participantService}>{item.initiatorService}</Text>
        </View>
        <Text style={styles.exchangeArrow}>→</Text>
        <View style={styles.participant}>
          <Text style={styles.participantName}>{item.recipientName}</Text>
          <Text style={styles.participantService}>{item.recipientService}</Text>
        </View>
      </View>
      
      <View style={styles.exchangeFooter}>
        <Text style={styles.exchangeDuration}>{item.duration}</Text>
        <Text style={styles.exchangeDate}>
          {new Date(item.initiatedAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  const renderSkillItem = ({ item }) => (
    <View style={styles.skillCard}>
      <View style={styles.skillHeader}>
        <Text style={styles.skillName}>{item.name}</Text>
        <View style={[
          styles.demandBadge,
          item.demand === 'high' ? styles.highDemand :
          item.demand === 'medium' ? styles.mediumDemand :
          styles.lowDemand
        ]}>
          <Text style={styles.demandText}>{item.demand}</Text>
        </View>
      </View>
      <Text style={styles.skillCategory}>{item.category}</Text>
      <Text style={styles.providerCount}>{item.providers} providers</Text>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'browse':
        return (
          <View style={styles.browseContainer}>
            <View style={styles.searchSection}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search services..."
                value={searchQuery}
                onChangeText={handleSearch}
              />
              
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesScroll}
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryChip,
                      selectedCategory?.name === category.name && styles.categoryChipSelected
                    ]}
                    onPress={() => handleCategorySelect(category)}
                  >
                    <Text style={styles.categoryChipText}>{category.icon} {category.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <View style={styles.filtersSection}>
                <View style={styles.filterRow}>
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      filters.featured && styles.filterChipActive
                    ]}
                    onPress={() => handleFilter('featured', !filters.featured)}
                  >
                    <Text style={styles.filterChipText}>Featured</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      filters.verified && styles.filterChipActive
                    ]}
                    onPress={() => handleFilter('verified', !filters.verified)}
                  >
                    <Text style={styles.filterChipText}>Verified</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      filters.remote && styles.filterChipActive
                    ]}
                    onPress={() => handleFilter('remote', !filters.remote)}
                  >
                    <Text style={styles.filterChipText}>Remote</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.sortRow}>
                  <Text style={styles.sortLabel}>Sort by:</Text>
                  {['relevance', 'price_low', 'price_high', 'rating', 'newest'].map((sort) => (
                    <TouchableOpacity
                      key={sort}
                      style={[
                        styles.sortChip,
                        sortBy === sort && styles.sortChipActive
                      ]}
                      onPress={() => handleSort(sort)}
                    >
                      <Text style={styles.sortChipText}>
                        {sort.replace('_', ' ').charAt(0).toUpperCase() + sort.slice(1).replace('_', ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            
            <FlatList
              data={services}
              keyExtractor={(item) => item.id}
              renderItem={renderServiceCard}
              contentContainerStyle={styles.servicesList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No services found</Text>
                </View>
              }
            />
          </View>
        );

      case 'my_services':
        return (
          <ScrollView style={styles.myServicesContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Services</Text>
              <TouchableOpacity
                style={styles.createBtn}
                onPress={() => setCreateServiceModalVisible(true)}
              >
                <Text style={styles.createBtnText}>Create Service</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.statsSection}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>2</Text>
                <Text style={styles.statLabel">Active Services</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>$850</Text>
                <Text style={styles.statLabel">Total Earnings</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>4.8</Text>
                <Text style={styles.statLabel">Average Rating</Text>
              </View>
            </View>
            
            <FlatList
              data={services.filter(s => s.providerId === 'user_1')}
              keyExtractor={(item) => item.id}
              renderItem={renderServiceCard}
              contentContainerStyle={styles.servicesList}
              scrollEnabled={false}
            />
          </ScrollView>
        );

      case 'exchanges':
        return (
          <View style={styles.exchangesContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Skill Exchanges</Text>
              <TouchableOpacity
                style={styles.createBtn}
                onPress={() => setExchangeModalVisible(true)}
              >
                <Text style={styles.createBtnText}>New Exchange</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={exchanges}
              keyExtractor={(item) => item.id}
              renderItem={renderExchangeItem}
              contentContainerStyle={styles.exchangesList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );

      case 'skills':
        return (
          <View style={styles.skillsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Skills</Text>
            </View>
            
            <FlatList
              data={skills}
              keyExtractor={(item) => item.id}
              renderItem={renderSkillItem}
              contentContainerStyle={styles.skillsList}
              showsVerticalScrollIndicator={false}
              numColumns={2}
            />
          </View>
        );

      case 'create':
        return (
          <ScrollView style={styles.createContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.createSection}>
              <Text style={styles.createTitle}>Create New Service</Text>
              <Text style={styles.createDescription">Offer your skills to help others</Text>
              
              <View style={styles.formSection}>
                <Text style={styles.formLabel">Service Title</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter service title"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.formLabel">Description</Text>
                <TextInput
                  style={[styles.formInput, styles.formInputMultiline]}
                  placeholder="Describe your service"
                  multiline
                  numberOfLines={4}
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.formLabel">Category</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryOptions}
                >
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={styles.categoryOption}
                    >
                      <Text style={styles.categoryOptionText}>{category.icon} {category.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.formLabel">Pricing</Text>
                <View style={styles.pricingInputs}>
                  <TextInput
                    style={[styles.formInput, styles.priceInput]}
                    placeholder="Rate"
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.formInput, styles.pricingTypeInput]}
                    placeholder="Type (hourly/project)"
                  />
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={() => {
                  Alert.alert('Success', 'Service created successfully!');
                  setActiveTab('my_services');
                }}
              >
                <Text style={styles.submitBtnText}>Create Service</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>🛍️ Skills Marketplace</Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
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
      </ScrollView>
      
      {renderContent()}
      
      {/* Service Details Modal */}
      <Modal
        visible={serviceModalVisible}
        animationType="slide"
        onRequestClose={() => setServiceModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setServiceModalVisible(false)}>
              <Text style={styles.modalCloseBtn}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Service Details</Text>
            <TouchableOpacity onPress={() => handleLikeService(selectedService?.id)}>
              <Text style={styles.modalLikeBtn}>❤️</Text>
            </TouchableOpacity>
          </View>
          
          {selectedService && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.serviceDetailHeader}>
                <View style={styles.providerDetailInfo}>
                  <Text style={styles.providerDetailAvatar}>{selectedService.providerAvatar}</Text>
                  <View style={styles.providerDetailDetails}>
                    <Text style={styles.providerDetailName}>{selectedService.providerName}</Text>
                    <View style={styles.ratingDetailContainer}>
                      <Text style={styles.ratingDetail}>⭐ {selectedService.providerRating}</Text>
                      <Text style={styles.reviewDetailCount}>({selectedService.providerReviews} reviews)</Text>
                    </View>
                    <Text style={styles.experienceDetail}>{selectedService.experience} experience</Text>
                  </View>
                </View>
              </View>
              
              <Text style={styles.serviceDetailTitle}>{selectedService.title}</Text>
              <Text style={styles.serviceDetailDescription}>{selectedService.description}</Text>
              
              <View style={styles.skillsDetailContainer}>
                <Text style={styles.skillsDetailTitle}>Skills</Text>
                <View style={styles.skillsDetailList}>
                  {selectedService.skills.map((skill, index) => (
                    <View key={index} style={styles.skillDetailTag}>
                      <Text style={styles.skillDetailText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <View style={styles.pricingDetailSection}>
                <Text style={styles.pricingDetailTitle}>Pricing</Text>
                <Text style={styles.pricingDetail}>
                  ${selectedService.pricing.rate}/{selectedService.pricing.type === 'hourly' ? 'hour' : selectedService.pricing.type}
                </Text>
                {selectedService.pricing.minimumHours && (
                  <Text style={styles.minimumHours">Minimum {selectedService.pricing.minimumHours} hours</Text>
                )}
              </View>
              
              <View style={styles.availabilitySection}>
                <Text style={styles.availabilityTitle}>Availability</Text>
                <Text style={styles.availabilityDetail}>
                  {selectedService.availability.hoursPerWeek} hours/week
                </Text>
                <Text style={styles.timezoneDetail">Timezone: {selectedService.availability.timezone}</Text>
                <Text style={styles.responseTimeDetail">Response time: {selectedService.availability.responseTime}</Text>
              </View>
              
              <View style={styles.serviceDetailActions}>
                <TouchableOpacity
                  style={styles.inquireDetailBtn}
                  onPress={() => {
                    setServiceModalVisible(false);
                    setInquiryModalVisible(true);
                  }}
                >
                  <Text style={styles.inquireDetailBtnText}>Send Inquiry</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.exchangeDetailBtn}
                  onPress={() => {
                    setServiceModalVisible(false);
                    setExchangeModalVisible(true);
                  }}
                >
                  <Text style={styles.exchangeDetailBtnText}>Propose Exchange</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.reviewsSection}>
                <Text style={styles.reviewsTitle}>Reviews</Text>
                {getReviews(selectedService.id).map((review) => (
                  <View key={review.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewerName}>{review.reviewerName}</Text>
                      <Text style={styles.reviewRating}>⭐ {review.rating}</Text>
                    </View>
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                    <Text style={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
      
      {/* Inquiry Modal */}
      <Modal
        visible={inquiryModalVisible}
        animationType="slide"
        onRequestClose={() => setInquiryModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setInquiryModalVisible(false)}>
              <Text style={styles.modalCloseBtn}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Send Inquiry</Text>
            <View style={styles.placeholder} />
          </View>
          
          <View style={styles.inquiryContent}>
            <Text style={styles.inquiryServiceTitle}>{selectedService?.title}</Text>
            <Text style={styles.inquiryProvider">by {selectedService?.providerName}</Text>
            
            <View style={styles.inquiryForm}>
              <Text style={styles.formLabel">Your Message</Text>
              <TextInput
                style={[styles.formInput, styles.inquiryInput]}
                placeholder="Tell them about your project..."
                multiline
                numberOfLines={6}
              />
              
              <TouchableOpacity
                style={styles.sendInquiryBtn}
                onPress={() => {
                  Alert.alert('Success', 'Inquiry sent successfully!');
                  setInquiryModalVisible(false);
                }}
              >
                <Text style={styles.sendInquiryBtnText}>Send Inquiry</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      
      {/* Exchange Modal */}
      <Modal
        visible={exchangeModalVisible}
        animationType="slide"
        onRequestClose={() => setExchangeModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setExchangeModalVisible(false)}>
              <Text style={styles.modalCloseBtn}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Propose Exchange</Text>
            <View style={styles.placeholder} />
          </View>
          
          <View style={styles.exchangeContent}>
            <Text style={styles.exchangeServiceTitle}>{selectedService?.title}</Text>
            <Text style={styles.exchangeProvider">by {selectedService?.providerName}</Text>
            
            <View style={styles.exchangeForm}>
              <Text style={styles.formLabel">Your Service to Exchange</Text>
              <TextInput
                style={styles.formInput}
                placeholder="What service can you offer?"
              />
              
              <Text style={styles.formLabel">Exchange Details</Text>
              <TextInput
                style={[styles.formInput, styles.exchangeInput]}
                placeholder="Describe the exchange terms..."
                multiline
                numberOfLines={4}
              />
              
              <Text style={styles.formLabel">Duration</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., 1 month, 2 weeks"
              />
              
              <TouchableOpacity
                style={styles.proposeExchangeBtn}
                onPress={() => {
                  Alert.alert('Success', 'Exchange proposal sent!');
                  setExchangeModalVisible(false);
                }}
              >
                <Text style={styles.proposeExchangeBtnText}>Propose Exchange</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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

  tabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },

  tab: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 80,
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
    fontSize: 10,
    color: '#6B7280',
  },

  tabLabelActive: {
    color: '#FFFFFF',
  },

  browseContainer: {
    flex: 1,
  },

  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },

  categoriesScroll: {
    gap: 8,
    marginBottom: 12,
  },

  categoryChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  categoryChipSelected: {
    backgroundColor: '#1D0A69',
    borderColor: '#1D0A69',
  },

  categoryChipText: {
    fontSize: 14,
    color: '#374151',
  },

  categoryChipSelected: {
    color: '#FFFFFF',
  },

  filtersSection: {
    gap: 8,
  },

  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },

  filterChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  filterChipActive: {
    backgroundColor: '#1D0A69',
    borderColor: '#1D0A69',
  },

  filterChipText: {
    fontSize: 12,
    color: '#374151',
  },

  filterChipActive: {
    color: '#FFFFFF',
  },

  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  sortLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
  },

  sortChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  sortChipActive: {
    backgroundColor: '#1D0A69',
  },

  sortChipText: {
    fontSize: 11,
    color: '#374151',
  },

  sortChipActive: {
    color: '#FFFFFF',
  },

  servicesList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },

  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  providerAvatar: {
    fontSize: 32,
    marginRight: 12,
  },

  providerDetails: {
    flex: 1,
  },

  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rating: {
    fontSize: 14,
    color: '#F59E0B',
    marginRight: 4,
  },

  reviewCount: {
    fontSize: 12,
    color: '#6B7280',
  },

  serviceMeta: {
    flexDirection: 'row',
    gap: 4,
  },

  featuredBadge: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  verifiedBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  badgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  serviceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  serviceDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },

  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 16,
    gap: 6,
  },

  skillTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  skillText: {
    fontSize: 12,
    color: '#374151',
  },

  moreSkillsText: {
    fontSize: 12,
    color: '#6B7280',
  },

  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  pricingInfo: {
    flex: 1,
  },

  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 2,
  },

  experience: {
    fontSize: 12,
    color: '#6B7280',
  },

  serviceActions: {
    flexDirection: 'row',
    gap: 8,
  },

  likeBtn: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },

  likeBtnText: {
    fontSize: 12,
    color: '#DC2626',
  },

  inquireBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  inquireBtnText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },

  myServicesContainer: {
    flex: 1,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  createBtn: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  createBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
  },

  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },

  exchangesContainer: {
    flex: 1,
  },

  exchangesList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  exchangeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },

  exchangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  exchangeType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  exchangeStatus: {
    fontSize: 12,
    color: '#22C55E',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  exchangeParticipants: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  participant: {
    flex: 1,
    alignItems: 'center',
  },

  participantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  participantService: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },

  exchangeArrow: {
    fontSize: 16,
    color: '#6B7280',
  },

  exchangeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  exchangeDuration: {
    fontSize: 12,
    color: '#6B7280',
  },

  exchangeDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  skillsContainer: {
    flex: 1,
  },

  skillsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  skillCard: {
    width: (width - 48) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },

  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  skillName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  demandBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  highDemand: {
    backgroundColor: '#FEE2E2',
  },

  mediumDemand: {
    backgroundColor: '#FEF3C7',
  },

  lowDemand: {
    backgroundColor: '#E0E7FF',
  },

  demandText: {
    fontSize: 10,
    fontWeight: '600',
  },

  highDemand: {
    color: '#DC2626',
  },

  mediumDemand: {
    color: '#D97706',
  },

  lowDemand: {
    color: '#4F46E5',
  },

  skillCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  providerCount: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  createContainer: {
    flex: 1,
  },

  createSection: {
    padding: 16,
  },

  createTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  createDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },

  formSection: {
    marginBottom: 20,
  },

  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  formInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  formInputMultiline: {
    height: 100,
    textAlignVertical: 'top',
  },

  categoryOptions: {
    gap: 8,
  },

  categoryOption: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  categoryOptionText: {
    fontSize: 14,
    color: '#374151',
  },

  pricingInputs: {
    flexDirection: 'row',
    gap: 12,
  },

  priceInput: {
    flex: 1,
  },

  pricingTypeInput: {
    flex: 1,
  },

  submitBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },

  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  modalSafe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  modalCloseBtn: {
    fontSize: 16,
    color: '#1D0A69',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  modalLikeBtn: {
    fontSize: 16,
  },

  placeholder: {
    width: 60,
  },

  modalContent: {
    flex: 1,
    padding: 16,
  },

  serviceDetailHeader: {
    marginBottom: 20,
  },

  providerDetailInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  providerDetailAvatar: {
    fontSize: 48,
    marginRight: 16,
  },

  providerDetailDetails: {
    flex: 1,
  },

  providerDetailName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  ratingDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  ratingDetail: {
    fontSize: 16,
    color: '#F59E0B',
    marginRight: 4,
  },

  reviewDetailCount: {
    fontSize: 14,
    color: '#6B7280',
  },

  experienceDetail: {
    fontSize: 14,
    color: '#6B7280',
  },

  serviceDetailTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  serviceDetailDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
  },

  skillsDetailContainer: {
    marginBottom: 20,
  },

  skillsDetailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  skillsDetailList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  skillDetailTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  skillDetailText: {
    fontSize: 14,
    color: '#374151',
  },

  pricingDetailSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 1,
  },

  pricingDetailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  pricingDetail: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 4,
  },

  minimumHours: {
    fontSize: 14,
    color: '#6B7280',
  },

  availabilitySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 1,
  },

  availabilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  availabilityDetail: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },

  timezoneDetail: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },

  responseTimeDetail: {
    fontSize: 14,
    color: '#374151',
  },

  serviceDetailActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },

  inquireDetailBtn: {
    flex: 1,
    backgroundColor: '#1D0A69',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },

  inquireDetailBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  exchangeDetailBtn: {
    flex: 1,
    backgroundColor: '#22C55E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },

  exchangeDetailBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  reviewsSection: {
    marginBottom: 20,
  },

  reviewsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 1,
  },

  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  reviewRating: {
    fontSize: 14,
    color: '#F59E0B',
  },

  reviewComment: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },

  reviewDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  inquiryContent: {
    flex: 1,
    padding: 16,
  },

  inquiryServiceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  inquiryProvider: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },

  inquiryForm: {
    flex: 1,
  },

  inquiryInput: {
    height: 120,
    textAlignVertical: 'top',
  },

  sendInquiryBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },

  sendInquiryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  exchangeContent: {
    flex: 1,
    padding: 16,
  },

  exchangeServiceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  exchangeProvider: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },

  exchangeForm: {
    flex: 1,
  },

  exchangeInput: {
    height: 100,
    textAlignVertical: 'top',
  },

  proposeExchangeBtn: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },

  proposeExchangeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
