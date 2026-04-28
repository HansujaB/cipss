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
  getVirtualEvents,
  getVirtualEventById,
  createVirtualEvent,
  registerForEvent,
  unregisterFromEvent,
  getUserRegistrations,
  markAttendance,
  submitFeedback,
  generateCertificate,
  getPlatforms,
  getCategories,
  getUpcomingVirtualEvents,
  getFeaturedVirtualEvents,
  joinVirtualEvent,
  leaveVirtualEvent,
  getEventRecording,
  getEventResources,
} from '../services/virtualEventsService';

const { width } = Dimensions.get('window');

export default function VirtualEventsScreen() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState(getVirtualEvents());
  const [categories, setCategories] = useState(getCategories());
  const [platforms, setPlatforms] = useState(getPlatforms());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [registrationData, setRegistrationData] = useState({});

  const tabs = [
    { key: 'upcoming', label: 'Upcoming', icon: '📅' },
    { key: 'my_events', label: 'My Events', icon: '👤' },
    { key: 'featured', label: 'Featured', icon: '⭐' },
    { key: 'categories', label: 'Categories', icon: '🏷️' },
    { key: 'create', label: 'Create', icon: '➕' },
  ];

  useEffect(() => {
    // Refresh data periodically
    const interval = setInterval(() => {
      setEvents(getVirtualEvents());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRegisterEvent = (eventId) => {
    const event = getVirtualEventById(eventId);
    setSelectedEvent(event);
    setRegisterModalVisible(true);
  };

  const submitRegistration = () => {
    if (!selectedEvent) return;
    
    const result = registerForEvent(selectedEvent.id, 'user_1', registrationData);
    if (result.success) {
      Alert.alert('Success', 'Registration successful!');
      setRegisterModalVisible(false);
      setEvents(getVirtualEvents());
      setRegistrationData({});
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleJoinEvent = (eventId) => {
    const result = joinVirtualEvent(eventId, 'user_1');
    if (result.success) {
      Alert.alert('Joining Event', `Opening ${result.platform}...`);
      // In real app, this would open the meeting URL
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const renderEventCard = ({ item }) => {
    const isRegistered = getUserRegistrations('user_1').some(reg => reg.eventId === item.id);
    const isLive = new Date() >= new Date(item.startTime) && new Date() <= new Date(item.endTime);
    
    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => {
          setSelectedEvent(item);
          setEventModalVisible(true);
        }}
      >
        <View style={styles.eventHeader}>
          <View style={styles.eventType}>
            <Text style={styles.eventTypeText}>{item.type}</Text>
          </View>
          {isLive && <View style={styles.liveBadge}><Text style={styles.liveText}>LIVE</Text></View>}
          {item.featured && <View style={styles.featuredBadge}><Text style={styles.featuredText}>Featured</Text></View>}
        </View>
        
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDescription} numberOfLines={2}>{item.description}</Text>
        
        <View style={styles.eventMeta}>
          <View style={styles.eventDateTime}>
            <Text style={styles.eventDate}>
              {new Date(item.startTime).toLocaleDateString()}
            </Text>
            <Text style={styles.eventTime}>
              {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <View style={styles.eventPlatform}>
            <Text style={styles.platformText}>{item.platform.toUpperCase()}</Text>
          </View>
        </View>
        
        <View style={styles.eventSpeakers}>
          <Text style={styles.speakersLabel}>Speakers:</Text>
          <View style={styles.speakersList}>
            {item.speakers.slice(0, 2).map((speaker, index) => (
              <View key={index} style={styles.speakerItem}>
                <Text style={styles.speakerAvatar}>{speaker.avatar}</Text>
                <Text style={styles.speakerName}>{speaker.name}</Text>
              </View>
            ))}
            {item.speakers.length > 2 && (
              <Text style={styles.moreSpeakers}>+{item.speakers.length - 2} more</Text>
            )}
          </View>
        </View>
        
        <View style={styles.eventStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.registration.currentRegistrations}</Text>
            <Text style={styles.statLabel">Registered</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.duration}</Text>
            <Text style={styles.statLabel">Minutes</Text>
          </View>
        </View>
        
        <View style={styles.eventActions}>
          {isLive ? (
            <TouchableOpacity
              style={styles.joinBtn}
              onPress={() => handleJoinEvent(item.id)}
            >
              <Text style={styles.joinBtnText}>Join Now</Text>
            </TouchableOpacity>
          ) : isRegistered ? (
            <TouchableOpacity
              style={styles.registeredBtn}
              onPress={() => handleJoinEvent(item.id)}
            >
              <Text style={styles.registeredBtnText}>Registered ✓</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => handleRegisterEvent(item.id)}
            >
              <Text style={styles.registerBtnText}>Register</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryCard = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => {
        const categoryEvents = getVirtualEvents().filter(e => e.category === item.name.toLowerCase());
        setEvents(categoryEvents);
        setActiveTab('upcoming');
      }}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryCount}>
        {getVirtualEvents().filter(e => e.category === item.name.toLowerCase()).length} events
      </Text>
    </TouchableOpacity>
  );

  const renderMyEventCard = ({ item }) => {
    const registration = getUserRegistrations('user_1').find(reg => reg.eventId === item.id);
    const isPast = new Date(item.endTime) < new Date();
    
    return (
      <TouchableOpacity
        style={styles.myEventCard}
        onPress={() => {
          setSelectedEvent(item);
          setEventModalVisible(true);
        }}
      >
        <View style={styles.myEventHeader}>
          <Text style={styles.myEventTitle}>{item.title}</Text>
          <View style={[
            styles.registrationStatus,
            registration?.status === 'confirmed' ? styles.confirmedStatus :
            registration?.status === 'waitlist' ? styles.waitlistStatus :
            styles.pendingStatus
          ]}>
            <Text style={styles.registrationStatusText}>
              {registration?.status || 'Not Registered'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.myEventDate}>
          {new Date(item.startTime).toLocaleDateString()} at {new Date(item.startTime).toLocaleTimeString()}
        </Text>
        
        <View style={styles.myEventActions}>
          {!isPast && registration?.status === 'confirmed' && (
            <TouchableOpacity
              style={styles.myEventJoinBtn}
              onPress={() => handleJoinEvent(item.id)}
            >
              <Text style={styles.myEventJoinBtnText}>Join</Text>
            </TouchableOpacity>
          )}
          
          {isPast && registration?.attendance?.attended && !registration?.certificate && (
            <TouchableOpacity
              style={styles.certificateBtn}
              onPress={() => {
                const result = generateCertificate(item.id, 'user_1');
                if (result.success) {
                  Alert.alert('Certificate Generated', 'Your certificate is ready!');
                }
              }}
            >
              <Text style={styles.certificateBtnText}>Get Certificate</Text>
            </TouchableOpacity>
          )}
          
          {registration?.certificate && (
            <TouchableOpacity style={styles.viewCertificateBtn}>
              <Text style={styles.viewCertificateBtnText}>View Certificate</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'upcoming':
        return (
          <View style={styles.upcomingContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Virtual Events</Text>
            </View>
            
            <FlatList
              data={getUpcomingVirtualEvents()}
              keyExtractor={(item) => item.id}
              renderItem={renderEventCard}
              contentContainerStyle={styles.eventsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );

      case 'my_events':
        return (
          <View style={styles.myEventsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Virtual Events</Text>
            </View>
            
            <FlatList
              data={getUserRegistrations('user_1').map(reg => getVirtualEventById(reg.eventId)).filter(Boolean)}
              keyExtractor={(item) => item.id}
              renderItem={renderMyEventCard}
              contentContainerStyle={styles.myEventsList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No registered events</Text>
                </View>
              }
            />
          </View>
        );

      case 'featured':
        return (
          <View style={styles.featuredContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Events</Text>
            </View>
            
            <FlatList
              data={getFeaturedVirtualEvents()}
              keyExtractor={(item) => item.id}
              renderItem={renderEventCard}
              contentContainerStyle={styles.eventsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );

      case 'categories':
        return (
          <View style={styles.categoriesContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Event Categories</Text>
            </View>
            
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              renderItem={renderCategoryCard}
              contentContainerStyle={styles.categoriesList}
              showsVerticalScrollIndicator={false}
              numColumns={2}
            />
          </View>
        );

      case 'create':
        return (
          <ScrollView style={styles.createContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.createSection}>
              <Text style={styles.createTitle}>Create Virtual Event</Text>
              <Text style={styles.createDescription">Host your own virtual event or webinar</Text>
              
              <View style={styles.formSection}>
                <Text style={styles.formLabel">Event Title</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter event title"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.formLabel">Description</Text>
                <TextInput
                  style={[styles.formInput, styles.formInputMultiline]}
                  placeholder="Describe your event"
                  multiline
                  numberOfLines={4}
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.formLabel">Event Type</Text>
                <View style={styles.eventTypeOptions}>
                  {['webinar', 'workshop', 'conference', 'panel'].map((type) => (
                    <TouchableOpacity key={type} style={styles.eventTypeOption}>
                      <Text style={styles.eventTypeOptionText}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.formLabel">Platform</Text>
                <View style={styles.platformOptions}>
                  {platforms.map((platform) => (
                    <TouchableOpacity key={platform.id} style={styles.platformOption}>
                      <Text style={styles.platformOptionText}>{platform.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.formLabel">Date & Time</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Select date and time"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.formLabel">Duration (minutes)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="60"
                  keyboardType="numeric"
                />
              </View>
              
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={() => {
                  Alert.alert('Success', 'Virtual event created successfully!');
                  setActiveTab('upcoming');
                }}
              >
                <Text style={styles.submitBtnText}>Create Event</Text>
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
      <Text style={styles.title}>🎥 Virtual Events</Text>
      
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
      
      {/* Event Details Modal */}
      <Modal
        visible={eventModalVisible}
        animationType="slide"
        onRequestClose={() => setEventModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEventModalVisible(false)}>
              <Text style={styles.modalCloseBtn}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Event Details</Text>
            <View style={styles.placeholder} />
          </View>
          
          {selectedEvent && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.eventDetailHeader}>
                <Text style={styles.eventDetailTitle}>{selectedEvent.title}</Text>
                <View style={styles.eventDetailMeta}>
                  <Text style={styles.eventDetailType}>{selectedEvent.type}</Text>
                  <Text style={styles.eventDetailPlatform}>{selectedEvent.platform}</Text>
                </View>
              </View>
              
              <Text style={styles.eventDetailDescription}>{selectedEvent.description}</Text>
              
              <View style={styles.eventDetailSection}>
                <Text style={styles.detailSectionTitle}>Date & Time</Text>
                <Text style={styles.detailText}>
                  {new Date(selectedEvent.startTime).toLocaleDateString()} at {new Date(selectedEvent.startTime).toLocaleTimeString()}
                </Text>
                <Text style={styles.detailText">
                  Duration: {selectedEvent.duration} minutes
                </Text>
                <Text style={styles.detailText">Timezone: {selectedEvent.timezone}</Text>
              </View>
              
              <View style={styles.eventDetailSection}>
                <Text style={styles.detailSectionTitle}>Speakers</Text>
                {selectedEvent.speakers.map((speaker) => (
                  <View key={speaker.id} style={styles.speakerDetail}>
                    <Text style={styles.speakerDetailAvatar}>{speaker.avatar}</Text>
                    <View style={styles.speakerDetailInfo}>
                      <Text style={styles.speakerDetailName}>{speaker.name}</Text>
                      <Text style={styles.speakerDetailTitle">{speaker.title}</Text>
                      <Text style={styles.speakerDetailCompany}>{speaker.company}</Text>
                    </View>
                  </View>
                ))}
              </View>
              
              <View style={styles.eventDetailSection}>
                <Text style={styles.detailSectionTitle}>Registration</Text>
                <Text style={styles.detailText">
                  {selectedEvent.registration.currentRegistrations} / {selectedEvent.registration.maxAttendees} registered
                </Text>
                <Text style={styles.detailText">
                  Deadline: {new Date(selectedEvent.registration.deadline).toLocaleDateString()}
                </Text>
              </View>
              
              {selectedEvent.agenda && (
                <View style={styles.eventDetailSection}>
                  <Text style={styles.detailSectionTitle}>Agenda</Text>
                  {selectedEvent.agenda.map((item) => (
                    <View key={item.id} style={styles.agendaItem}>
                      <Text style={styles.agendaTime}>{item.time}</Text>
                      <View style={styles.agendaContent}>
                        <Text style={styles.agendaTitle}>{item.title}</Text>
                        <Text style={styles.agendaDuration}>{item.duration} min</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
              
              <View style={styles.eventDetailActions}>
                <TouchableOpacity
                  style={styles.registerDetailBtn}
                  onPress={() => {
                    setEventModalVisible(false);
                    handleRegisterEvent(selectedEvent.id);
                  }}
                >
                  <Text style={styles.registerDetailBtnText}>Register Now</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
      
      {/* Registration Modal */}
      <Modal
        visible={registerModalVisible}
        animationType="slide"
        onRequestClose={() => setRegisterModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setRegisterModalVisible(false)}>
              <Text style={styles.modalCloseBtn}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Register for Event</Text>
            <View style={styles.placeholder} />
          </View>
          
          <View style={styles.registrationContent}>
            <Text style={styles.registrationEventTitle}>{selectedEvent?.title}</Text>
            
            <View style={styles.registrationForm}>
              {selectedEvent?.registration.formFields.map((field) => (
                <View key={field} style={styles.formSection}>
                  <Text style={styles.formLabel">
                    {field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
                  </Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder={`Enter your ${field}`}
                    value={registrationData[field] || ''}
                    onChangeText={(text) => setRegistrationData({...registrationData, [field]: text})}
                  />
                </View>
              ))}
              
              <TouchableOpacity
                style={styles.submitRegistrationBtn}
                onPress={submitRegistration}
              >
                <Text style={styles.submitRegistrationBtnText}>Complete Registration</Text>
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

  upcomingContainer: {
    flex: 1,
  },

  eventsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },

  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  eventType: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  eventTypeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1D4ED8',
  },

  liveBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  liveText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#DC2626',
  },

  featuredBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  featuredText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#D97706',
  },

  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  eventDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },

  eventMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  eventDateTime: {
    flex: 1,
  },

  eventDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  eventTime: {
    fontSize: 12,
    color: '#6B7280',
  },

  eventPlatform: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  platformText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
  },

  eventSpeakers: {
    marginBottom: 12,
  },

  speakersLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 6,
  },

  speakersList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  speakerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
  },

  speakerAvatar: {
    fontSize: 16,
    marginRight: 4,
  },

  speakerName: {
    fontSize: 12,
    color: '#374151',
  },

  moreSpeakers: {
    fontSize: 12,
    color: '#6B7280',
  },

  eventStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },

  statItem: {
    alignItems: 'center',
  },

  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 2,
  },

  statLabel: {
    fontSize: 10,
    color: '#6B7280',
  },

  eventActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  joinBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  joinBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  registerBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  registerBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  registeredBtn: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  registeredBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  myEventsContainer: {
    flex: 1,
  },

  myEventsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  myEventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },

  myEventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  myEventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    flex: 1,
  },

  registrationStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  confirmedStatus: {
    backgroundColor: '#D1FAE5',
  },

  waitlistStatus: {
    backgroundColor: '#FEF3C7',
  },

  pendingStatus: {
    backgroundColor: '#FEE2E2',
  },

  registrationStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },

  confirmedStatus: {
    color: '#065F46',
  },

  waitlistStatus: {
    color: '#92400E',
  },

  pendingStatus: {
    color: '#991B1B',
  },

  myEventDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },

  myEventActions: {
    flexDirection: 'row',
    gap: 8,
  },

  myEventJoinBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  myEventJoinBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  certificateBtn: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  certificateBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  viewCertificateBtn: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  viewCertificateBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  featuredContainer: {
    flex: 1,
  },

  categoriesContainer: {
    flex: 1,
  },

  categoriesList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  categoryCard: {
    width: (width - 48) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
  },

  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },

  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
    textAlign: 'center',
  },

  categoryCount: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
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

  eventTypeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  eventTypeOption: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  eventTypeOptionText: {
    fontSize: 14,
    color: '#374151',
  },

  platformOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  platformOption: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  platformOptionText: {
    fontSize: 14,
    color: '#374151',
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

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 16,
    color: '#6B7280',
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

  placeholder: {
    width: 60,
  },

  modalContent: {
    flex: 1,
    padding: 16,
  },

  eventDetailHeader: {
    marginBottom: 20,
  },

  eventDetailTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  eventDetailMeta: {
    flexDirection: 'row',
    gap: 8,
  },

  eventDetailType: {
    fontSize: 12,
    color: '#1D4ED8',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  eventDetailPlatform: {
    fontSize: 12,
    color: '#374151',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  eventDetailDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
  },

  eventDetailSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },

  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  detailText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },

  speakerDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  speakerDetailAvatar: {
    fontSize: 32,
    marginRight: 12,
  },

  speakerDetailInfo: {
    flex: 1,
  },

  speakerDetailName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  speakerDetailTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },

  speakerDetailCompany: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  agendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  agendaTime: {
    fontSize: 12,
    color: '#6B7280',
    width: 50,
    marginRight: 12,
  },

  agendaContent: {
    flex: 1,
  },

  agendaTitle: {
    fontSize: 14,
    color: '#1A1A2E',
    marginBottom: 2,
  },

  agendaDuration: {
    fontSize: 12,
    color: '#6B7280',
  },

  eventDetailActions: {
    marginTop: 20,
  },

  registerDetailBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },

  registerDetailBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  registrationContent: {
    flex: 1,
    padding: 16,
  },

  registrationEventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 20,
  },

  registrationForm: {
    flex: 1,
  },

  submitRegistrationBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },

  submitRegistrationBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
