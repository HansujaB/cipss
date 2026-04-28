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
  Modal,
} from 'react-native';

export const MENTORSHIP_DATA = {
  myMentors: [
    {
      id: 'mentor_1',
      name: 'Dr. Sarah Johnson',
      role: 'Environmental Scientist',
      avatar: '👩‍🔬',
      expertise: 'Climate Change, Sustainability',
      experience: '15 years',
      rating: 4.9,
      sessions: 12,
      nextSession: '2024-04-29T14:00:00',
      status: 'active',
      bio: 'Passionate about environmental conservation and sustainable development.',
    },
    {
      id: 'mentor_2',
      name: 'Prof. Rajesh Kumar',
      role: 'Education Specialist',
      avatar: '👨‍🏫',
      expertise: 'Educational Policy, Teaching Methods',
      experience: '20 years',
      rating: 4.8,
      sessions: 8,
      nextSession: '2024-05-02T16:00:00',
      status: 'active',
      bio: 'Dedicated to improving education access and quality for underserved communities.',
    },
  ],
  myMentees: [
    {
      id: 'mentee_1',
      name: 'Anjali Gupta',
      role: 'Student Volunteer',
      avatar: '👩‍🎓',
      goals: 'Environmental activism, Leadership skills',
      progress: 65,
      sessions: 6,
      nextSession: '2024-04-28T10:00:00',
      joinDate: '2024-03-15',
      bio: 'Eager to learn and make a positive impact in environmental conservation.',
    },
    {
      id: 'mentee_2',
      name: 'Mohammed Ali',
      role: 'Community Organizer',
      avatar: '👨‍💼',
      goals: 'Project management, Fundraising',
      progress: 40,
      sessions: 4,
      nextSession: '2024-04-30T11:00:00',
      joinDate: '2024-04-01',
      bio: 'Working to empower local communities through sustainable initiatives.',
    },
  ],
  availableMentors: [
    {
      id: 'mentor_3',
      name: 'Dr. Emily Chen',
      role: 'Public Health Expert',
      avatar: '👩‍⚕️',
      expertise: 'Healthcare Policy, Community Health',
      experience: '12 years',
      rating: 4.7,
      availability: 'Weekdays',
      price: 'Free',
      languages: ['English', 'Hindi', 'Mandarin'],
      bio: 'Specialized in public health initiatives and community wellness programs.',
    },
    {
      id: 'mentor_4',
      name: 'James Wilson',
      role: 'Tech for Good Advocate',
      avatar: '👨‍💻',
      expertise: 'Digital Solutions, Social Impact',
      experience: '8 years',
      rating: 4.6,
      availability: 'Evenings',
      price: 'Free',
      languages: ['English', 'Spanish'],
      bio: 'Passionate about leveraging technology for social good and community development.',
    },
    {
      id: 'mentor_5',
      name: 'Maria Rodriguez',
      role: 'NGO Management Expert',
      avatar: '👩‍💼',
      expertise: 'Nonprofit Management, Fundraising',
      experience: '18 years',
      rating: 4.9,
      availability: 'Flexible',
      price: 'Free',
      languages: ['English', 'Spanish', 'Portuguese'],
      bio: 'Experienced in building and scaling nonprofit organizations globally.',
    },
  ],
  mentorshipRequests: [
    {
      id: 'request_1',
      mentorId: 'mentor_3',
      mentorName: 'Dr. Emily Chen',
      menteeId: 'user_current',
      menteeName: 'You',
      message: 'I would love to learn about community health initiatives from your expertise.',
      status: 'pending',
      requestDate: '2024-04-20',
    },
  ],
  upcomingSessions: [
    {
      id: 'session_1',
      mentorId: 'mentor_1',
      mentorName: 'Dr. Sarah Johnson',
      topic: 'Climate Action Strategies',
      date: '2024-04-29T14:00:00',
      duration: '60 minutes',
      type: 'video',
      materials: ['Climate Guide PDF', 'Case Studies'],
    },
    {
      id: 'session_2',
      menteeId: 'mentee_1',
      menteeName: 'Anjali Gupta',
      topic: 'Leadership Development',
      date: '2024-04-28T10:00:00',
      duration: '45 minutes',
      type: 'video',
      materials: ['Leadership Workbook'],
    },
  ],
};

export default function MentorshipScreen() {
  const [activeTab, setActiveTab] = useState('mentors');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');

  const tabs = [
    { key: 'mentors', label: 'My Mentors', icon: '👨‍🏫' },
    { key: 'mentees', label: 'My Mentees', icon: '👩‍🎓' },
    { key: 'available', label: 'Available', icon: '🔍' },
    { key: 'sessions', label: 'Sessions', icon: '📅' },
  ];

  const handleRequestMentorship = (mentorId, mentorName) => {
    setSelectedMentor({ id: mentorId, name: mentorName });
    setShowRequestModal(true);
  };

  const handleSubmitRequest = () => {
    if (!requestMessage.trim()) {
      Alert.alert('Error', 'Please enter a message for your request');
      return;
    }

    const newRequest = {
      id: `request_${Date.now()}`,
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      menteeId: 'user_current',
      menteeName: 'You',
      message: requestMessage,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0],
    };

    MENTORSHIP_DATA.mentorshipRequests.push(newRequest);
    Alert.alert('Success', 'Mentorship request sent successfully!');
    setRequestMessage('');
    setShowRequestModal(false);
    setSelectedMentor(null);
  };

  const handleScheduleSession = (personId, personName) => {
    Alert.alert(
      'Schedule Session',
      `Schedule a session with ${personName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Schedule', 
          onPress: () => Alert.alert('Success', 'Session scheduling request sent!')
        }
      ]
    );
  };

  const renderMentorCard = ({ item }) => (
    <View style={styles.mentorCard}>
      <View style={styles.mentorHeader}>
        <Text style={styles.mentorAvatar}>{item.avatar}</Text>
        <View style={styles.mentorInfo}>
          <Text style={styles.mentorName}>{item.name}</Text>
          <Text style={styles.mentorRole}>{item.role}</Text>
          <Text style={styles.mentorExpertise}>{item.expertise}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
          <Text style={styles.experience}>{item.experience}</Text>
        </View>
      </View>

      <Text style={styles.mentorBio}>{item.bio}</Text>

      <View style={styles.mentorStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.sessions}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.status}</Text>
          <Text style={styles.statLabel}>Status</Text>
        </View>
      </View>

      {item.nextSession && (
        <View style={styles.nextSession}>
          <Text style={styles.nextSessionLabel}>Next Session:</Text>
          <Text style={styles.nextSessionTime}>
            {new Date(item.nextSession).toLocaleString()}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.scheduleBtn}
        onPress={() => handleScheduleSession(item.id, item.name)}
      >
        <Text style={styles.scheduleBtnText}>Schedule Session</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMenteeCard = ({ item }) => (
    <View style={styles.menteeCard}>
      <View style={styles.menteeHeader}>
        <Text style={styles.menteeAvatar}>{item.avatar}</Text>
        <View style={styles.menteeInfo}>
          <Text style={styles.menteeName}>{item.name}</Text>
          <Text style={styles.menteeRole}>{item.role}</Text>
          <Text style={styles.menteeGoals}>Goals: {item.goals}</Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressValue}>{item.progress}%</Text>
          <Text style={styles.progressLabel}>Progress</Text>
        </View>
      </View>

      <Text style={styles.menteeBio}>{item.bio}</Text>

      <View style={styles.menteeStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.sessions}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {new Date(item.joinDate).toLocaleDateString()}
          </Text>
          <Text style={styles.statLabel}>Joined</Text>
        </View>
      </View>

      {item.nextSession && (
        <View style={styles.nextSession}>
          <Text style={styles.nextSessionLabel}>Next Session:</Text>
          <Text style={styles.nextSessionTime}>
            {new Date(item.nextSession).toLocaleString()}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.scheduleBtn}
        onPress={() => handleScheduleSession(item.id, item.name)}
      >
        <Text style={styles.scheduleBtnText}>Schedule Session</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAvailableMentorCard = ({ item }) => (
    <View style={styles.availableCard}>
      <View style={styles.availableHeader}>
        <Text style={styles.mentorAvatar}>{item.avatar}</Text>
        <View style={styles.mentorInfo}>
          <Text style={styles.mentorName}>{item.name}</Text>
          <Text style={styles.mentorRole}>{item.role}</Text>
          <Text style={styles.mentorExpertise}>{item.expertise}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>
      </View>

      <Text style={styles.mentorBio}>{item.bio}</Text>

      <View style={styles.availableDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Experience:</Text>
          <Text style={styles.detailValue}>{item.experience}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Availability:</Text>
          <Text style={styles.detailValue}>{item.availability}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Languages:</Text>
          <Text style={styles.detailValue}>{item.languages.join(', ')}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.requestBtn}
        onPress={() => handleRequestMentorship(item.id, item.name)}
      >
        <Text style={styles.requestBtnText}>Request Mentorship</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSessionCard = ({ item }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <Text style={styles.sessionType}>{item.type === 'video' ? '📹' : '📞'}</Text>
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionTopic}>{item.topic}</Text>
          <Text style={styles.sessionPerson}>
            {item.mentorName || item.menteeName}
          </Text>
        </View>
        <Text style={styles.sessionDuration}>{item.duration}</Text>
      </View>

      <View style={styles.sessionDetails}>
        <Text style={styles.sessionDate}>
          📅 {new Date(item.date).toLocaleString()}
        </Text>
        {item.materials.length > 0 && (
          <Text style={styles.sessionMaterials}>
            📎 Materials: {item.materials.join(', ')}
          </Text>
        )}
      </View>

      <View style={styles.sessionActions}>
        <TouchableOpacity style={styles.joinBtn}>
          <Text style={styles.joinBtnText}>Join Session</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rescheduleBtn}>
          <Text style={styles.rescheduleBtnText}>Reschedule</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getDataByTab = () => {
    switch (activeTab) {
      case 'mentors':
        return MENTORSHIP_DATA.myMentors;
      case 'mentees':
        return MENTORSHIP_DATA.myMentees;
      case 'available':
        return MENTORSHIP_DATA.availableMentors;
      case 'sessions':
        return MENTORSHIP_DATA.upcomingSessions;
      default:
        return [];
    }
  };

  const getRenderItem = () => {
    switch (activeTab) {
      case 'mentors':
        return renderMentorCard;
      case 'mentees':
        return renderMenteeCard;
      case 'available':
        return renderAvailableMentorCard;
      case 'sessions':
        return renderSessionCard;
      default:
        return renderMentorCard;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🤝 Mentorship</Text>

        {/* Tabs */}
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

        {/* List */}
        <FlatList
          data={getDataByTab()}
          keyExtractor={(item) => item.id}
          renderItem={getRenderItem()}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </ScrollView>

      {/* Request Modal */}
      {showRequestModal && selectedMentor && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Request Mentorship</Text>
            <Text style={styles.modalMentorName}>{selectedMentor.name}</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Tell them why you'd like to be mentored..."
              value={requestMessage}
              onChangeText={setRequestMessage}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => {
                  setShowRequestModal(false);
                  setRequestMessage('');
                  setSelectedMentor(null);
                }}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleSubmitRequest}
              >
                <Text style={styles.modalSubmitBtnText}>Send Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
    paddingVertical: 10,
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
    fontSize: 14,
    marginBottom: 2,
  },

  tabLabel: {
    fontSize: 9,
    color: '#6B7280',
  },

  tabLabelActive: {
    color: '#FFFFFF',
  },

  mentorCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },

  mentorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  mentorAvatar: {
    fontSize: 32,
    marginRight: 12,
  },

  mentorInfo: {
    flex: 1,
  },

  mentorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  mentorRole: {
    fontSize: 13,
    color: '#1D0A69',
    marginBottom: 2,
  },

  mentorExpertise: {
    fontSize: 12,
    color: '#6B7280',
  },

  ratingContainer: {
    alignItems: 'flex-end',
  },

  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
    marginBottom: 2,
  },

  experience: {
    fontSize: 11,
    color: '#6B7280',
  },

  mentorBio: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 12,
  },

  mentorStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },

  statItem: {
    alignItems: 'center',
  },

  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  statLabel: {
    fontSize: 10,
    color: '#6B7280',
  },

  nextSession: {
    backgroundColor: '#F0F9FF',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },

  nextSessionLabel: {
    fontSize: 11,
    color: '#3B82F6',
    marginBottom: 2,
  },

  nextSessionTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  scheduleBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },

  scheduleBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  menteeCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },

  menteeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  menteeAvatar: {
    fontSize: 32,
    marginRight: 12,
  },

  menteeInfo: {
    flex: 1,
  },

  menteeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  menteeRole: {
    fontSize: 13,
    color: '#1D0A69',
    marginBottom: 2,
  },

  menteeGoals: {
    fontSize: 12,
    color: '#6B7280',
  },

  progressContainer: {
    alignItems: 'flex-end',
  },

  progressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22C55E',
    marginBottom: 2,
  },

  progressLabel: {
    fontSize: 10,
    color: '#6B7280',
  },

  menteeBio: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 12,
  },

  menteeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },

  availableCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: '#22C55E',
  },

  availableHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  price: {
    fontSize: 11,
    color: '#22C55E',
    fontWeight: '600',
  },

  availableDetails: {
    marginBottom: 12,
  },

  detailItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },

  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    width: 80,
  },

  detailValue: {
    fontSize: 12,
    color: '#1A1A2E',
    flex: 1,
  },

  requestBtn: {
    backgroundColor: '#22C55E',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },

  requestBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  sessionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },

  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  sessionType: {
    fontSize: 24,
    marginRight: 12,
  },

  sessionInfo: {
    flex: 1,
  },

  sessionTopic: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  sessionPerson: {
    fontSize: 13,
    color: '#6B7280',
  },

  sessionDuration: {
    fontSize: 12,
    color: '#1D0A69',
    fontWeight: '600',
  },

  sessionDetails: {
    marginBottom: 12,
  },

  sessionDate: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4,
  },

  sessionMaterials: {
    fontSize: 11,
    color: '#6B7280',
  },

  sessionActions: {
    flexDirection: 'row',
    gap: 8,
  },

  joinBtn: {
    flex: 1,
    backgroundColor: '#1D0A69',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },

  joinBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  rescheduleBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },

  rescheduleBtnText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
  },

  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
    textAlign: 'center',
  },

  modalMentorName: {
    fontSize: 16,
    color: '#1D0A69',
    textAlign: 'center',
    marginBottom: 20,
  },

  modalInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },

  modalActions: {
    flexDirection: 'row',
    gap: 8,
  },

  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },

  modalCancelBtnText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },

  modalSubmitBtn: {
    flex: 1,
    backgroundColor: '#1D0A69',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },

  modalSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
