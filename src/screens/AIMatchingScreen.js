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
  ProgressBarAndroid,
} from 'react-native';
import {
  getAiMatchingSettings,
  updateAiMatchingSettings,
  getSkills,
  getInterests,
  getOpportunities,
  getVolunteerProfile,
  getRecommendationsForVolunteer,
  acceptMatch,
  rejectMatch,
  getMatchingAnalytics,
  trainMatchingModel,
} from '../services/aiMatchingService';

export default function AIMatchingScreen() {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [recommendations, setRecommendations] = useState([]);
  const [settings, setSettings] = useState(getAiMatchingSettings());
  const [analytics, setAnalytics] = useState(getMatchingAnalytics());
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentVolunteer] = useState('volunteer_1'); // Current user

  const tabs = [
    { key: 'recommendations', label: 'For You', icon: '🎯' },
    { key: 'opportunities', label: 'All', icon: '📋' },
    { key: 'analytics', label: 'Analytics', icon: '📊' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = () => {
    setLoading(true);
    const result = getRecommendationsForVolunteer(currentVolunteer, 5);
    if (result.success) {
      setRecommendations(result.recommendations);
    }
    setLoading(false);
  };

  const handleAcceptMatch = (opportunityId) => {
    Alert.alert(
      'Accept Opportunity',
      'Are you sure you want to accept this volunteer opportunity?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            const result = acceptMatch(currentVolunteer, opportunityId);
            if (result.success) {
              Alert.alert('Success', 'Opportunity accepted! You will be contacted soon.');
              loadRecommendations(); // Refresh recommendations
              setAnalytics(getMatchingAnalytics());
            }
          }
        }
      ]
    );
  };

  const handleRejectMatch = (opportunityId) => {
    Alert.alert(
      'Reject Opportunity',
      'Why are you rejecting this opportunity? (This helps us improve recommendations)',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Not Interested', onPress: () => rejectAndReload(opportunityId, 'Not interested') },
        { text: 'Time Conflict', onPress: () => rejectAndReload(opportunityId, 'Time conflict') },
        { text: 'Too Far', onPress: () => rejectAndReload(opportunityId, 'Location too far') },
        { text: 'Other', onPress: () => rejectAndReload(opportunityId, 'Other reason') },
      ]
    );
  };

  const rejectAndReload = (opportunityId, reason) => {
    const result = rejectMatch(currentVolunteer, opportunityId, reason);
    if (result.success) {
      loadRecommendations(); // Refresh recommendations
      setAnalytics(getMatchingAnalytics());
    }
  };

  const handleViewDetails = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setDetailModalVisible(true);
  };

  const handleUpdateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    updateAiMatchingSettings(newSettings);
    setSettings(newSettings);
  };

  const handleTrainModel = () => {
    Alert.alert(
      'Train AI Model',
      'This will improve future recommendations based on your feedback. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Train',
          onPress: () => {
            const result = trainMatchingModel([]);
            if (result.success) {
              Alert.alert(
                'Training Complete',
                `Model accuracy improved to ${Math.round(result.accuracy * 100)}%`
              );
            }
          }
        }
      ]
    );
  };

  const renderRecommendationItem = ({ item }) => (
    <View style={[
      styles.recommendationCard,
      item.score >= 0.9 && styles.excellentMatch,
      item.score >= 0.75 && item.score < 0.9 && styles.goodMatch
    ]}>
      <View style={styles.recommendationHeader}>
        <View style={styles.matchScore}>
          <Text style={styles.matchScoreText}>{Math.round(item.score * 100)}%</Text>
          <Text style={styles.matchScoreLabel}>Match</Text>
        </View>
        <View style={styles.recommendationInfo}>
          <Text style={styles.opportunityTitle}>{item.opportunity.title}</Text>
          <Text style={styles.organizationName}>{item.opportunity.organization}</Text>
        </View>
        <View style={styles.confidenceBadge}>
          <Text style={styles.confidenceText}>{item.recommendation.level}</Text>
        </View>
      </View>

      <Text style={styles.opportunityDescription}>{item.opportunity.description}</Text>

      <View style={styles.matchDetails}>
        <View style={styles.matchDetailItem}>
          <Text style={styles.matchDetailLabel}>Skills Match</Text>
          <Text style={styles.matchDetailValue}>
            {Math.round(item.matchDetails.skills.score * 100)}%
          </Text>
        </View>
        <View style={styles.matchDetailItem}>
          <Text style={styles.matchDetailLabel}>Interests</Text>
          <Text style={styles.matchDetailValue}>
            {Math.round(item.matchDetails.interests.score * 100)}%
          </Text>
        </View>
        <View style={styles.matchDetailItem}>
          <Text style={styles.matchDetailLabel}>Availability</Text>
          <Text style={styles.matchDetailValue}>
            {Math.round(item.matchDetails.availability.score * 100)}%
          </Text>
        </View>
      </View>

      <View style={styles.opportunityMeta}>
        <Text style={styles.metaText}>📍 {item.opportunity.location}</Text>
        <Text style={styles.metaText}>⏰ {item.opportunity.timeCommitment}</Text>
        <Text style={styles.metaText}>📊 Impact: {item.opportunity.impactScore}</Text>
      </View>

      <View style={styles.recommendationActions}>
        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() => handleViewDetails(item.opportunity)}
        >
          <Text style={styles.detailsBtnText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectBtn}
          onPress={() => handleRejectMatch(item.opportunity.id)}
        >
          <Text style={styles.rejectBtnText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.acceptBtn}
          onPress={() => handleAcceptMatch(item.opportunity.id)}
        >
          <Text style={styles.acceptBtnText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderOpportunityItem = ({ item }) => (
    <TouchableOpacity
      style={styles.opportunityCard}
      onPress={() => handleViewDetails(item)}
    >
      <Text style={styles.opportunityTitle}>{item.title}</Text>
      <Text style={styles.organizationName}>{item.organization}</Text>
      <Text style={styles.opportunityDescription}>{item.description}</Text>
      <View style={styles.opportunityMeta}>
        <Text style={styles.metaText}>📍 {item.location}</Text>
        <Text style={styles.metaText}>⏰ {item.timeCommitment}</Text>
        <Text style={styles.metaText}>📊 {item.impactScore}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'recommendations':
        return (
          <View style={styles.recommendationsContainer}>
            <View style={styles.recommendationsHeader}>
              <Text style={styles.recommendationsTitle}>🎯 AI Recommendations</Text>
              <TouchableOpacity
                style={styles.refreshBtn}
                onPress={loadRecommendations}
                disabled={loading}
              >
                <Text style={styles.refreshBtnText}>🔄</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Analyzing your profile...</Text>
              </View>
            ) : (
              <FlatList
                data={recommendations}
                keyExtractor={(item) => item.opportunity.id}
                renderItem={renderRecommendationItem}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No recommendations available</Text>
                    <Text style={styles.emptySubtext}>Complete your profile to get better matches</Text>
                  </View>
                }
              />
            )}
          </View>
        );

      case 'opportunities':
        return (
          <View style={styles.opportunitiesContainer}>
            <Text style={styles.sectionTitle}>📋 All Opportunities</Text>
            <FlatList
              data={getOpportunities()}
              keyExtractor={(item) => item.id}
              renderItem={renderOpportunityItem}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );

      case 'analytics':
        return (
          <ScrollView style={styles.analyticsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>📊 Matching Analytics</Text>
              
              <View style={styles.analyticsGrid}>
                <View style={styles.analyticsItem}>
                  <Text style={styles.analyticsValue}>{analytics.totalMatches}</Text>
                  <Text style={styles.analyticsLabel}>Total Matches</Text>
                </View>
                <View style={styles.analyticsItem}>
                  <Text style={styles.analyticsValue}>{analytics.successfulMatches}</Text>
                  <Text style={styles.analyticsLabel}>Successful</Text>
                </View>
                <View style={styles.analyticsItem}>
                  <Text style={styles.analyticsValue}>{Math.round(analytics.averageMatchScore * 100)}%</Text>
                  <Text style={styles.analyticsLabel}>Avg Score</Text>
                </View>
                <View style={styles.analyticsItem}>
                  <Text style={styles.analyticsValue}>{analytics.volunteerSatisfaction}/5</Text>
                  <Text style={styles.analyticsLabel}>Satisfaction</Text>
                </View>
              </View>

              <View style={styles.performanceSection}>
                <Text style={styles.performanceTitle}>Algorithm Performance</Text>
                <Text style={styles.performanceText}>
                  Top performing: Skill-Based Matching
                </Text>
                <Text style={styles.performanceText}>
                  Average time to match: {analytics.averageTimeToMatch} days
                </Text>
                <Text style={styles.performanceText}>
                  Retention rate: {Math.round(analytics.retentionRate * 100)}%
                </Text>
              </View>

              <TouchableOpacity
                style={styles.trainModelBtn}
                onPress={handleTrainModel}
              >
                <Text style={styles.trainModelBtnText}>🧠 Train AI Model</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );

      case 'settings':
        return (
          <ScrollView style={styles.settingsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>⚙️ AI Matching Settings</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Enable AI Matching</Text>
                  <Text style={styles.settingDescription}>Get personalized recommendations</Text>
                </View>
                <TouchableOpacity
                  style={[styles.toggleBtn, settings.enabled && styles.toggleBtnOn]}
                  onPress={() => handleUpdateSetting('enabled', !settings.enabled)}
                >
                  <Text style={styles.toggleBtnText}>
                    {settings.enabled ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Auto Matching</Text>
                  <Text style={styles.settingDescription">Automatically find matches</Text>
                </View>
                <TouchableOpacity
                  style={[styles.toggleBtn, settings.autoMatching && styles.toggleBtnOn]}
                  onPress={() => handleUpdateSetting('autoMatching', !settings.autoMatching)}
                >
                  <Text style={styles.toggleBtnText}>
                    {settings.autoMatching ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Min Confidence Score</Text>
                  <Text style={styles.settingDescription">{Math.round(settings.minConfidenceScore * 100)}%</Text>
                </View>
                <View style={styles.confidenceOptions}>
                  {[0.5, 0.7, 0.8, 0.9].map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.confidenceBtn,
                        settings.minConfidenceScore === level && styles.confidenceBtnActive
                      ]}
                      onPress={() => handleUpdateSetting('minConfidenceScore', level)}
                    >
                      <Text style={[
                        styles.confidenceBtnText,
                        settings.minConfidenceScore === level && styles.confidenceBtnTextActive
                      ]}>
                        {Math.round(level * 100)}%
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Max Recommendations</Text>
                  <Text style={styles.settingDescription">{settings.maxRecommendations} per day</Text>
                </View>
                <View style={styles.recommendationOptions}>
                  {[3, 5, 10, 15].map((count) => (
                    <TouchableOpacity
                      key={count}
                      style={[
                        styles.recommendationBtn,
                        settings.maxRecommendations === count && styles.recommendationBtnActive
                      ]}
                      onPress={() => handleUpdateSetting('maxRecommendations', count)}
                    >
                      <Text style={[
                        styles.recommendationBtnText,
                        settings.maxRecommendations === count && styles.recommendationBtnTextActive
                      ]}>
                        {count}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Update Frequency</Text>
                  <Text style={styles.settingDescription">{settings.updateFrequency}</Text>
                </View>
                <View style={styles.frequencyOptions}>
                  {['hourly', 'daily', 'weekly'].map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      style={[
                        styles.frequencyBtn,
                        settings.updateFrequency === freq && styles.frequencyBtnActive
                      ]}
                      onPress={() => handleUpdateSetting('updateFrequency', freq)}
                    >
                      <Text style={[
                        styles.frequencyBtnText,
                        settings.updateFrequency === freq && styles.frequencyBtnTextActive
                      ]}>
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Notify New Matches</Text>
                  <Text style={styles.settingDescription">Get notifications for new matches</Text>
                </View>
                <TouchableOpacity
                  style={[styles.toggleBtn, settings.notifyNewMatches && styles.toggleBtnOn]}
                  onPress={() => handleUpdateSetting('notifyNewMatches', !settings.notifyNewMatches)}
                >
                  <Text style={styles.toggleBtnText}>
                    {settings.notifyNewMatches ? 'ON' : 'OFF'}
                  </Text>
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
      <Text style={styles.title}>🤖 AI Volunteer Matching</Text>
      
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
      
      {/* Opportunity Details Modal */}
      <Modal
        visible={detailModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedOpportunity && (
              <>
                <Text style={styles.modalTitle}>{selectedOpportunity.title}</Text>
                <Text style={styles.modalOrganization}>{selectedOpportunity.organization}</Text>
                <Text style={styles.modalDescription}>{selectedOpportunity.description}</Text>
                
                <View style={styles.modalDetails}>
                  <Text style={styles.modalDetailTitle}>Requirements:</Text>
                  <Text style={styles.modalDetailText}>• Location: {selectedOpportunity.location}</Text>
                  <Text style={styles.modalDetailText}>• Time: {selectedOpportunity.timeCommitment}</Text>
                  <Text style={styles.modalDetailText}>• Duration: {selectedOpportunity.duration}</Text>
                  <Text style={styles.modalDetailText}>• Team Size: {selectedOpportunity.teamSize} people</Text>
                  <Text style={styles.modalDetailText}>• Difficulty: {selectedOpportunity.difficulty}</Text>
                  <Text style={styles.modalDetailText}>• Impact Score: {selectedOpportunity.impactScore}</Text>
                </View>
                
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setDetailModalVisible(false)}
                >
                  <Text style={styles.modalCloseBtnText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
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

  recommendationsContainer: {
    flex: 1,
  },

  recommendationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  refreshBtn: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 8,
  },

  refreshBtnText: {
    fontSize: 16,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },

  recommendationCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#E5E7EB',
  },

  excellentMatch: {
    borderLeftColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },

  goodMatch: {
    borderLeftColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },

  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  matchScore: {
    alignItems: 'center',
    marginRight: 12,
  },

  matchScoreText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D0A69',
  },

  matchScoreLabel: {
    fontSize: 10,
    color: '#6B7280',
  },

  recommendationInfo: {
    flex: 1,
  },

  opportunityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  organizationName: {
    fontSize: 13,
    color: '#374151',
  },

  confidenceBadge: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  confidenceText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },

  opportunityDescription: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 18,
  },

  matchDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },

  matchDetailItem: {
    alignItems: 'center',
  },

  matchDetailLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },

  matchDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D0A69',
  },

  opportunityMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },

  metaText: {
    fontSize: 11,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  recommendationActions: {
    flexDirection: 'row',
    gap: 8,
  },

  detailsBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  detailsBtnText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
  },

  rejectBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  rejectBtnText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },

  acceptBtn: {
    flex: 2,
    backgroundColor: '#1D0A69',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  opportunitiesContainer: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  opportunityCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },

  analyticsContainer: {
    flex: 1,
    padding: 16,
  },

  analyticsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 14,
    elevation: 2,
  },

  analyticsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 20,
  },

  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  analyticsItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },

  analyticsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 4,
  },

  analyticsLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },

  performanceSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },

  performanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  performanceText: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 4,
  },

  trainModelBtn: {
    backgroundColor: '#1D0A69',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  trainModelBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  settingsContainer: {
    flex: 1,
    padding: 16,
  },

  settingsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 14,
    elevation: 2,
  },

  settingsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 20,
  },

  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  settingInfo: {
    flex: 1,
  },

  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
  },

  toggleBtn: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },

  toggleBtnOn: {
    backgroundColor: '#22C55E',
  },

  toggleBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },

  toggleBtnOn && {
    color: '#FFFFFF',
  },

  confidenceOptions: {
    flexDirection: 'row',
    gap: 8,
  },

  confidenceBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flex: 1,
  },

  confidenceBtnActive: {
    backgroundColor: '#1D0A69',
  },

  confidenceBtnText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },

  confidenceBtnTextActive: {
    color: '#FFFFFF',
  },

  recommendationOptions: {
    flexDirection: 'row',
    gap: 8,
  },

  recommendationBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flex: 1,
  },

  recommendationBtnActive: {
    backgroundColor: '#1D0A69',
  },

  recommendationBtnText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },

  recommendationBtnTextActive: {
    color: '#FFFFFF',
  },

  frequencyOptions: {
    flexDirection: 'row',
    gap: 8,
  },

  frequencyBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flex: 1,
  },

  frequencyBtnActive: {
    backgroundColor: '#1D0A69',
  },

  frequencyBtnText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },

  frequencyBtnTextActive: {
    color: '#FFFFFF',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 14,
    margin: 20,
    maxWidth: 400,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  modalOrganization: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
  },

  modalDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },

  modalDetails: {
    marginBottom: 20,
  },

  modalDetailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  modalDetailText: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 4,
  },

  modalCloseBtn: {
    backgroundColor: '#1D0A69',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  modalCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },

  emptySubtext: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});
