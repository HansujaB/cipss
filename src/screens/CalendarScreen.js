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
  Switch,
} from 'react-native';
import {
  getConnectedCalendars,
  connectCalendar,
  disconnectCalendar,
  syncCalendar,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpEvent,
  getAvailability,
  setAvailability,
  getCalendarSettings,
  updateCalendarSettings,
  getUpcomingEvents,
  getEventsByDate,
  getEventsByMonth,
  checkConflicts,
  suggestTimeSlots,
  exportCalendar,
  importCalendar,
  getCalendarAnalytics,
  getIntegrationStatus,
} from '../services/calendarService';

export default function CalendarScreen() {
  const [activeTab, setActiveTab] = useState('events');
  const [connectedCalendars, setConnectedCalendars] = useState(getConnectedCalendars());
  const [events, setEvents] = useState(getEvents());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [createEventModalVisible, setCreateEventModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [availabilityModalVisible, setAvailabilityModalVisible] = useState(false);
  const [calendarSettings, setCalendarSettings] = useState(getCalendarSettings());

  const tabs = [
    { key: 'events', label: 'Events', icon: '📅' },
    { key: 'calendar', label: 'Calendar', icon: '📆' },
    { key: 'availability', label: 'Availability', icon: '⏰' },
    { key: 'integrations', label: 'Integrations', icon: '🔗' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  useEffect(() => {
    // Auto-sync calendars
    const interval = setInterval(() => {
      connectedCalendars.forEach(calendar => {
        if (calendar.connected) {
          syncCalendar(calendar.type);
        }
      });
    }, calendarSettings.sync.syncInterval * 60 * 1000);

    return () => clearInterval(interval);
  }, [connectedCalendars, calendarSettings]);

  const handleConnectCalendar = (type) => {
    const result = connectCalendar(type, { token: 'mock_token' });
    if (result.success) {
      setConnectedCalendars(getConnectedCalendars());
      Alert.alert('Success', `${result.calendar.name} connected successfully!`);
    }
  };

  const handleDisconnectCalendar = (type) => {
    Alert.alert(
      'Disconnect Calendar',
      'Are you sure you want to disconnect this calendar?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            const result = disconnectCalendar(type);
            if (result.success) {
              setConnectedCalendars(getConnectedCalendars());
              Alert.alert('Success', 'Calendar disconnected');
            }
          },
        },
      ]
    );
  };

  const handleRSVP = (eventId, status) => {
    const result = rsvpEvent(eventId, 'user_1', status);
    if (result.success) {
      setEvents(getEvents());
      Alert.alert('Success', `RSVP ${status} successfully!`);
    }
  };

  const renderEventCard = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => {
        setSelectedEvent(item);
        setEventModalVisible(true);
      }}
    >
      <View style={styles.eventHeader}>
        <View style={styles.eventTime}>
          <Text style={styles.eventDate}>
            {new Date(item.startTime).toLocaleDateString()}
          </Text>
          <Text style={styles.eventTimeText}>
            {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <View style={[
          styles.eventStatus,
          item.status === 'confirmed' ? styles.confirmedStatus :
          item.status === 'pending' ? styles.pendingStatus :
          styles.cancelledStatus
        ]}>
          <Text
            style={[
              styles.statusText,
              item.status === 'confirmed'
                ? styles.confirmedStatusText
                : item.status === 'pending'
                  ? styles.pendingStatusText
                  : styles.cancelledStatusText,
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>
      
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDescription} numberOfLines={2}>{item.description}</Text>
      
      <View style={styles.eventMeta}>
        <View style={styles.eventLocation}>
          <Text style={styles.locationText}>📍 {item.location}</Text>
        </View>
        <View style={styles.eventAttendees}>
          <Text style={styles.attendeesText}>
            👥 {item.currentAttendees}/{item.maxAttendees || '∞'}
          </Text>
        </View>
      </View>
      
      <View style={styles.eventActions}>
        <TouchableOpacity
          style={[
            styles.rsvpBtn,
            item.attendees.some(a => a.id === 'user_1') && styles.rsvpBtnConfirmed
          ]}
          onPress={() => {
            const isAttending = item.attendees.some(a => a.id === 'user_1');
            handleRSVP(item.id, isAttending ? 'declined' : 'confirmed');
          }}
        >
          <Text style={styles.rsvpBtnText}>
            {item.attendees.some(a => a.id === 'user_1') ? 'Attending ✓' : 'RSVP'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderCalendarItem = ({ item }) => (
    <View style={styles.calendarCard}>
      <View style={styles.calendarHeader}>
        <View style={styles.calendarInfo}>
          <Text style={styles.calendarName}>{item.name}</Text>
          <Text style={styles.calendarEmail}>{item.email}</Text>
        </View>
        <View style={[
          styles.connectionStatus,
          item.connected ? styles.connectedStatus : styles.disconnectedStatus
        ]}>
          <Text
            style={[
              styles.connectionText,
              item.connected ? styles.connectedStatusText : styles.disconnectedStatusText,
            ]}
          >
            {item.connected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
      </View>
      
      {item.connected && item.lastSync && (
        <Text style={styles.lastSync}>
          Last sync: {new Date(item.lastSync).toLocaleString()}
        </Text>
      )}
      
      <View style={styles.calendarActions}>
        {item.connected ? (
          <TouchableOpacity
            style={styles.disconnectBtn}
            onPress={() => handleDisconnectCalendar(item.type)}
          >
            <Text style={styles.disconnectBtnText}>Disconnect</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.connectBtn}
            onPress={() => handleConnectCalendar(item.type)}
          >
            <Text style={styles.connectBtnText}>Connect</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'events':
        return (
          <View style={styles.eventsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Events</Text>
              <TouchableOpacity
                style={styles.createBtn}
                onPress={() => setCreateEventModalVisible(true)}
              >
                <Text style={styles.createBtnText}>Create Event</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={getUpcomingEvents()}
              keyExtractor={(item) => item.id}
              renderItem={renderEventCard}
              contentContainerStyle={styles.eventsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );

      case 'calendar':
        return (
          <ScrollView style={styles.calendarViewContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.monthHeader}>
              <Text style={styles.monthTitle}>April 2024</Text>
              <View style={styles.monthActions}>
                <TouchableOpacity style={styles.monthBtn}>
                  <Text style={styles.monthBtnText}>←</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.monthBtn}>
                  <Text style={styles.monthBtnText}>→</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.calendarGrid}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <View key={day} style={styles.dayHeader}>
                  <Text style={styles.dayHeaderText}>{day}</Text>
                </View>
              ))}
              
              {Array.from({ length: 35 }, (_, index) => {
                const day = index - 5 + 1;
                const isCurrentMonth = day >= 1 && day <= 30;
                const hasEvents = isCurrentMonth && getEventsByDate(`2024-04-${day.toString().padStart(2, '0')}`).length > 0;
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayCell,
                      isCurrentMonth && styles.currentMonthDay,
                      hasEvents && styles.dayWithEvents
                    ]}
                  >
                    <Text style={[
                      styles.dayText,
                      isCurrentMonth && styles.currentMonthDayText
                    ]}>
                      {isCurrentMonth ? day : ''}
                    </Text>
                    {hasEvents && <View style={styles.eventDot} />}
                  </TouchableOpacity>
                );
              })}
            </View>
            
            <View style={styles.dayEvents}>
              <Text style={styles.dayEventsTitle}>Today's Events</Text>
              {getEventsByDate('2024-04-20').map(event => (
                <View key={event.id} style={styles.dayEventCard}>
                  <Text style={styles.dayEventTime}>
                    {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <Text style={styles.dayEventTitle}>{event.title}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        );

      case 'availability':
        return (
          <ScrollView style={styles.availabilityContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Availability</Text>
              <TouchableOpacity
                style={styles.createBtn}
                onPress={() => setAvailabilityModalVisible(true)}
              >
                <Text style={styles.createBtnText}>Add Time</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.availabilityList}>
              {getAvailability('user_1').map(avail => (
                <View key={avail.id} style={styles.availabilityCard}>
                  <View style={styles.availabilityHeader}>
                    <Text style={styles.availabilityDay}>
                      {avail.dayOfWeek.charAt(0).toUpperCase() + avail.dayOfWeek.slice(1)}
                    </Text>
                    <Text style={styles.availabilityTime}>
                      {avail.startTime} - {avail.endTime}
                    </Text>
                  </View>
                  <Text style={styles.availabilityTimezone}>Timezone: {avail.timezone}</Text>
                  {avail.recurring && (
                    <Text style={styles.recurringText}>Recurring weekly</Text>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        );

      case 'integrations':
        return (
          <ScrollView style={styles.integrationsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Calendar Integrations</Text>
            </View>
            
            <FlatList
              data={connectedCalendars}
              keyExtractor={(item) => item.id}
              renderItem={renderCalendarItem}
              contentContainerStyle={styles.calendarsList}
              scrollEnabled={false}
            />
            
            <View style={styles.syncSection}>
              <Text style={styles.syncTitle}>Sync Settings</Text>
              <View style={styles.syncOption}>
                <Text style={styles.syncLabel}>Auto-sync</Text>
                <Switch
                  value={calendarSettings.sync.autoSync}
                  onValueChange={(value) => {
                    updateCalendarSettings({ sync: { ...calendarSettings.sync, autoSync: value } });
                    setCalendarSettings(getCalendarSettings());
                  }}
                />
              </View>
              <View style={styles.syncOption}>
                <Text style={styles.syncLabel}>>Sync new events</Text>
                <Switch
                  value={calendarSettings.sync.syncNewEvents}
                  onValueChange={(value) => {
                    updateCalendarSettings({ sync: { ...calendarSettings.sync, syncNewEvents: value } });
                    setCalendarSettings(getCalendarSettings());
                  }}
                />
              </View>
            </View>
          </ScrollView>
        );

      case 'settings':
        return (
          <ScrollView style={styles.settingsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>Calendar Settings</Text>
              
              <View style={styles.settingSection}>
                <Text style={styles.settingSectionTitle}>Notifications</Text>
                <View style={styles.settingOption}>
                  <Text style={styles.settingLabel}>>Email reminders</Text>
                  <Switch
                    value={calendarSettings.notifications.emailReminders}
                    onValueChange={(value) => {
                      updateCalendarSettings({ notifications: { ...calendarSettings.notifications, emailReminders: value } });
                      setCalendarSettings(getCalendarSettings());
                    }}
                  />
                </View>
                <View style={styles.settingOption}>
                  <Text style={styles.settingLabel}>>Push notifications</Text>
                  <Switch
                    value={calendarSettings.notifications.pushNotifications}
                    onValueChange={(value) => {
                      updateCalendarSettings({ notifications: { ...calendarSettings.notifications, pushNotifications: value } });
                      setCalendarSettings(getCalendarSettings());
                    }}
                  />
                </View>
              </View>
              
              <View style={styles.settingSection}>
                <Text style={styles.settingSectionTitle}>Privacy</Text>
                <View style={styles.settingOption}>
                  <Text style={styles.settingLabel}>>Share availability</Text>
                  <Switch
                    value={calendarSettings.privacy.shareAvailability}
                    onValueChange={(value) => {
                      updateCalendarSettings({ privacy: { ...calendarSettings.privacy, shareAvailability: value } });
                      setCalendarSettings(getCalendarSettings());
                    }}
                  />
                </View>
                <View style={styles.settingOption}>
                  <Text style={styles.settingLabel}>>Show busy status</Text>
                  <Switch
                    value={calendarSettings.privacy.showBusyStatus}
                    onValueChange={(value) => {
                      updateCalendarSettings({ privacy: { ...calendarSettings.privacy, showBusyStatus: value } });
                      setCalendarSettings(getCalendarSettings());
                    }}
                  />
                </View>
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
      <Text style={styles.title}>📅 Calendar</Text>
      
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
              <Text style={styles.eventDetailTitle}>{selectedEvent.title}</Text>
              <Text style={styles.eventDetailDescription}>{selectedEvent.description}</Text>
              
              <View style={styles.eventDetailSection}>
                <Text style={styles.detailSectionTitle}>Date & Time</Text>
                <Text style={styles.detailText}>
                  {new Date(selectedEvent.startTime).toLocaleDateString()} at {new Date(selectedEvent.startTime).toLocaleTimeString()}
                </Text>
                <Text style={styles.detailText}>>
                  Duration: {Math.round((new Date(selectedEvent.endTime) - new Date(selectedEvent.startTime)) / (1000 * 60 * 60))} hours
                </Text>
              </View>
              
              <View style={styles.eventDetailSection}>
                <Text style={styles.detailSectionTitle}>Location</Text>
                <Text style={styles.detailText}>{selectedEvent.location}</Text>
              </View>
              
              <View style={styles.eventDetailSection}>
                <Text style={styles.detailSectionTitle}>Organizer</Text>
                <Text style={styles.detailText}>{selectedEvent.organizer}</Text>
              </View>
              
              <View style={styles.eventDetailSection}>
                <Text style={styles.detailSectionTitle}>Attendees</Text>
                <Text style={styles.detailText}>
                  {selectedEvent.currentAttendees} / {selectedEvent.maxAttendees || 'Unlimited'} attending
                </Text>
              </View>
              
              <View style={styles.eventDetailActions}>
                <TouchableOpacity
                  style={[
                    styles.rsvpDetailBtn,
                    selectedEvent.attendees.some(a => a.id === 'user_1') && styles.rsvpDetailBtnConfirmed
                  ]}
                  onPress={() => {
                    const isAttending = selectedEvent.attendees.some(a => a.id === 'user_1');
                    handleRSVP(selectedEvent.id, isAttending ? 'declined' : 'confirmed');
                    setEventModalVisible(false);
                  }}
                >
                  <Text style={styles.rsvpDetailBtnText}>
                    {selectedEvent.attendees.some(a => a.id === 'user_1') ? 'Cancel RSVP' : 'RSVP to Event'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
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

  eventsContainer: {
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

  eventTime: {
    flex: 1,
  },

  eventDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  eventTimeText: {
    fontSize: 12,
    color: '#6B7280',
  },

  eventStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  confirmedStatus: {
    backgroundColor: '#D1FAE5',
  },

  pendingStatus: {
    backgroundColor: '#FEF3C7',
  },

  cancelledStatus: {
    backgroundColor: '#FEE2E2',
  },

  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },

  confirmedStatusText: {
    color: '#065F46',
  },

  pendingStatusText: {
    color: '#92400E',
  },

  cancelledStatusText: {
    color: '#991B1B',
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

  locationText: {
    fontSize: 12,
    color: '#374151',
  },

  attendeesText: {
    fontSize: 12,
    color: '#374151',
  },

  eventActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  rsvpBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  rsvpBtnConfirmed: {
    backgroundColor: '#22C55E',
  },

  rsvpBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  calendarViewContainer: {
    flex: 1,
  },

  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  monthActions: {
    flexDirection: 'row',
    gap: 8,
  },

  monthBtn: {
    width: 32,
    height: 32,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  monthBtnText: {
    fontSize: 16,
    color: '#374151',
  },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  dayHeader: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 8,
  },

  dayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },

  dayCell: {
    width: '14.28%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  currentMonthDay: {
    backgroundColor: '#FFFFFF',
  },

  dayWithEvents: {
    backgroundColor: '#EFF6FF',
  },

  dayText: {
    fontSize: 14,
    color: '#9CA3AF',
  },

  currentMonthDayText: {
    color: '#1A1A2E',
  },

  eventDot: {
    width: 4,
    height: 4,
    backgroundColor: '#1D0A69',
    borderRadius: 2,
    marginTop: 2,
  },

  dayEvents: {
    padding: 16,
  },

  dayEventsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  dayEventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },

  dayEventTime: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 12,
    width: 50,
  },

  dayEventTitle: {
    fontSize: 14,
    color: '#1A1A2E',
    flex: 1,
  },

  availabilityContainer: {
    flex: 1,
  },

  availabilityList: {
    padding: 16,
  },

  availabilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },

  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  availabilityDay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  availabilityTime: {
    fontSize: 14,
    color: '#1D0A69',
  },

  availabilityTimezone: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  recurringText: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '500',
  },

  integrationsContainer: {
    flex: 1,
  },

  calendarsList: {
    padding: 16,
  },

  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },

  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  calendarInfo: {
    flex: 1,
  },

  calendarName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  calendarEmail: {
    fontSize: 12,
    color: '#6B7280',
  },

  connectionStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  connectedStatus: {
    backgroundColor: '#D1FAE5',
  },

  disconnectedStatus: {
    backgroundColor: '#FEE2E2',
  },

  connectionText: {
    fontSize: 10,
    fontWeight: '600',
  },

  connectedStatusText: {
    color: '#065F46',
  },

  disconnectedStatusText: {
    color: '#991B1B',
  },

  lastSync: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },

  calendarActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  connectBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  connectBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  disconnectBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  disconnectBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  syncSection: {
    padding: 16,
    marginTop: 20,
  },

  syncTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  syncOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },

  syncLabel: {
    fontSize: 14,
    color: '#374151',
  },

  settingsContainer: {
    flex: 1,
  },

  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    elevation: 2,
  },

  settingsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 20,
  },

  settingSection: {
    marginBottom: 24,
  },

  settingSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  settingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },

  settingLabel: {
    fontSize: 14,
    color: '#374151',
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

  eventDetailTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  detailText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },

  eventDetailActions: {
    marginTop: 20,
  },

  rsvpDetailBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },

  rsvpDetailBtnConfirmed: {
    backgroundColor: '#EF4444',
  },

  rsvpDetailBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
