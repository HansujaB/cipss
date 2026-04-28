// Virtual events and webinars service
export const VIRTUAL_EVENTS_DATA = {
  events: [
    {
      id: 'virtual_1',
      title: 'Climate Action Workshop',
      description: 'Learn about effective climate action strategies and how to implement them in your community',
      type: 'webinar',
      category: 'environment',
      platform: 'zoom',
      format: 'presentation',
      startTime: '2024-04-25T14:00:00Z',
      endTime: '2024-04-25T15:30:00Z',
      timezone: 'PST',
      duration: 90, // minutes
      organizer: 'Environmental Alliance',
      organizerId: 'org_1',
      speakers: [
        {
          id: 'speaker_1',
          name: 'Dr. Sarah Johnson',
          title: 'Climate Scientist',
          bio: 'Leading expert in climate change research with 15 years of experience',
          avatar: '👩‍🔬',
          company: 'Green Research Institute',
        },
        {
          id: 'speaker_2',
          name: 'Michael Chen',
          title: 'Environmental Activist',
          bio: 'Community organizer focused on local climate initiatives',
          avatar: '👨‍💼',
          company: 'Climate Action Now',
        },
      ],
      registration: {
        required: true,
        deadline: '2024-04-24T23:59:59Z',
        maxAttendees: 500,
        currentRegistrations: 342,
        waitlist: false,
        formFields: ['name', 'email', 'organization', 'motivation'],
      },
      meeting: {
        platform: 'zoom',
        meetingId: '123456789',
        password: 'climate2024',
        joinUrl: 'https://zoom.us/j/123456789',
        dialIn: '+1-555-123-4567',
        recording: true,
        chatEnabled: true,
        qaEnabled: true,
        pollsEnabled: true,
        breakoutRooms: false,
      },
      resources: [
        {
          id: 'resource_1',
          type: 'pdf',
          title: 'Climate Action Guide',
          url: 'https://example.com/climate-guide.pdf',
          size: '2.5 MB',
        },
        {
          id: 'resource_2',
          type: 'video',
          title: 'Introduction Video',
          url: 'https://example.com/intro-video.mp4',
          duration: '5:30',
        },
      ],
      agenda: [
        {
          id: 'agenda_1',
          time: '14:00',
          title: 'Welcome & Introduction',
          duration: 10,
          speaker: 'Dr. Sarah Johnson',
          type: 'presentation',
        },
        {
          id: 'agenda_2',
          time: '14:10',
          title: 'Climate Science Basics',
          duration: 20,
          speaker: 'Dr. Sarah Johnson',
          type: 'presentation',
        },
        {
          id: 'agenda_3',
          time: '14:30',
          title: 'Community Action Strategies',
          duration: 25,
          speaker: 'Michael Chen',
          type: 'presentation',
        },
        {
          id: 'agenda_4',
          time: '14:55',
          title: 'Q&A Session',
          duration: 25,
          speaker: 'All',
          type: 'qa',
        },
        {
          id: 'agenda_5',
          time: '15:20',
          title: 'Closing Remarks & Next Steps',
          duration: 10,
          speaker: 'Dr. Sarah Johnson',
          type: 'presentation',
        },
      ],
      engagement: {
        preEventSurvey: true,
        postEventSurvey: true,
        certificate: true,
        networking: true,
        discussionBoard: true,
        resources: true,
      },
      accessibility: {
        closedCaptions: true,
        signLanguage: false,
        transcripts: true,
        multipleLanguages: ['en', 'es'],
        screenReader: true,
      },
      status: 'upcoming',
      visibility: 'public',
      featured: true,
      tags: ['climate', 'environment', 'workshop', 'sustainability'],
      createdAt: '2024-04-10T10:00:00Z',
      updatedAt: '2024-04-20T14:30:00Z',
    },
    {
      id: 'virtual_2',
      title: 'Youth Leadership Summit',
      description: 'Empowering young leaders to create positive change in their communities',
      type: 'conference',
      category: 'leadership',
      platform: 'teams',
      format: 'multi-track',
      startTime: '2024-04-28T09:00:00Z',
      endTime: '2024-04-28T17:00:00Z',
      timezone: 'EST',
      duration: 480, // minutes
      organizer: 'Youth Empowerment Network',
      organizerId: 'org_2',
      speakers: [
        {
          id: 'speaker_3',
          name: 'Emma Rodriguez',
          title: 'Youth Advocate',
          bio: 'Award-winning youth leader and social entrepreneur',
          avatar: '👩‍🎓',
          company: 'Future Leaders Initiative',
        },
      ],
      registration: {
        required: true,
        deadline: '2024-04-26T23:59:59Z',
        maxAttendees: 1000,
        currentRegistrations: 756,
        waitlist: true,
        formFields: ['name', 'email', 'age', 'school', 'interests'],
      },
      meeting: {
        platform: 'teams',
        meetingId: 'conf_2024_youth',
        password: 'youth2024',
        joinUrl: 'https://teams.microsoft.com/l/meetup-join/conf_2024_youth',
        recording: true,
        chatEnabled: true,
        qaEnabled: true,
        pollsEnabled: true,
        breakoutRooms: true,
      },
      tracks: [
        {
          id: 'track_1',
          name: 'Leadership Skills',
          sessions: 4,
          color: '#3B82F6',
        },
        {
          id: 'track_2',
          name: 'Social Impact',
          sessions: 3,
          color: '#10B981',
        },
        {
          id: 'track_3',
          name: 'Innovation',
          sessions: 3,
          color: '#8B5CF6',
        },
      ],
      status: 'upcoming',
      visibility: 'public',
      featured: false,
      tags: ['youth', 'leadership', 'conference', 'empowerment'],
      createdAt: '2024-04-12T09:00:00Z',
      updatedAt: '2024-04-19T16:20:00Z',
    },
  ],
  platforms: [
    {
      id: 'zoom',
      name: 'Zoom',
      features: ['video', 'audio', 'chat', 'breakout_rooms', 'polling', 'recording'],
      maxParticipants: 1000,
      pricing: 'paid',
      integration: true,
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      features: ['video', 'audio', 'chat', 'breakout_rooms', 'polling', 'recording'],
      maxParticipants: 10000,
      pricing: 'paid',
      integration: true,
    },
    {
      id: 'meet',
      name: 'Google Meet',
      features: ['video', 'audio', 'chat', 'recording'],
      maxParticipants: 250,
      pricing: 'free',
      integration: true,
    },
    {
      id: 'webex',
      name: 'Cisco Webex',
      features: ['video', 'audio', 'chat', 'breakout_rooms', 'polling', 'recording'],
      maxParticipants: 3000,
      pricing: 'paid',
      integration: false,
    },
  ],
  categories: [
    { id: 'cat_1', name: 'Education', icon: '📚', color: '#3B82F6' },
    { id: 'cat_2', name: 'Environment', icon: '🌍', color: '#10B981' },
    { id: 'cat_3', name: 'Leadership', icon: '👥', color: '#8B5CF6' },
    { id: 'cat_4', name: 'Technology', icon: '💻', color: '#F59E0B' },
    { id: 'cat_5', name: 'Health', icon: '🏥', color: '#EF4444' },
    { id: 'cat_6', name: 'Arts & Culture', icon: '🎨', color: '#EC4899' },
  ],
  registrations: [
    {
      id: 'reg_1',
      eventId: 'virtual_1',
      userId: 'user_1',
      registeredAt: '2024-04-18T10:30:00Z',
      status: 'confirmed',
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        organization: 'Green Earth Foundation',
        motivation: 'Want to learn more about climate action',
      },
      attendance: null,
      feedback: null,
      certificate: null,
    },
  ],
  analytics: {
    totalEvents: 45,
    upcomingEvents: 12,
    completedEvents: 33,
    totalRegistrations: 5430,
    totalAttendees: 4120,
    attendanceRate: 0.76,
    averageDuration: 120, // minutes
    popularPlatforms: ['zoom', 'teams', 'meet'],
    popularCategories: ['education', 'leadership', 'environment'],
    satisfaction: 4.5, // average rating
  },
  settings: {
    notifications: {
      eventReminders: true,
      newEvents: true,
      eventUpdates: true,
      certificates: true,
    },
    privacy: {
      shareProfile: true,
      showAttendance: false,
      publicRegistration: true,
    },
    preferences: {
      defaultPlatform: 'zoom',
      timezone: 'PST',
      language: 'en',
      autoRecord: false,
    },
  },
};

export const getVirtualEvents = (filters = {}) => {
  let events = VIRTUAL_EVENTS_DATA.events;
  
  if (filters.type) {
    events = events.filter(event => event.type === filters.type);
  }
  
  if (filters.category) {
    events = events.filter(event => event.category === filters.category);
  }
  
  if (filters.platform) {
    events = events.filter(event => event.platform === filters.platform);
  }
  
  if (filters.status) {
    events = events.filter(event => event.status === filters.status);
  }
  
  if (filters.featured) {
    events = events.filter(event => event.featured);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    events = events.filter(event => 
      event.title.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
  
  // Sort by start time
  events.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  
  return events;
};

export const getVirtualEventById = (id) => {
  return VIRTUAL_EVENTS_DATA.events.find(event => event.id === id);
};

export const createVirtualEvent = (eventData) => {
  const newEvent = {
    id: `virtual_${Date.now()}`,
    ...eventData,
    registration: {
      required: true,
      deadline: null,
      maxAttendees: 100,
      currentRegistrations: 0,
      waitlist: false,
      formFields: ['name', 'email'],
      ...eventData.registration,
    },
    meeting: {
      platform: 'zoom',
      recording: true,
      chatEnabled: true,
      qaEnabled: true,
      pollsEnabled: false,
      breakoutRooms: false,
      ...eventData.meeting,
    },
    engagement: {
      preEventSurvey: false,
      postEventSurvey: true,
      certificate: false,
      networking: false,
      discussionBoard: false,
      resources: false,
      ...eventData.engagement,
    },
    accessibility: {
      closedCaptions: false,
      signLanguage: false,
      transcripts: false,
      multipleLanguages: ['en'],
      screenReader: false,
      ...eventData.accessibility,
    },
    status: 'upcoming',
    visibility: 'public',
    featured: false,
    tags: eventData.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  VIRTUAL_EVENTS_DATA.events.push(newEvent);
  
  return { success: true, event: newEvent };
};

export const updateVirtualEvent = (id, updates) => {
  const eventIndex = VIRTUAL_EVENTS_DATA.events.findIndex(event => event.id === id);
  
  if (eventIndex === -1) {
    return { success: false, message: 'Event not found' };
  }
  
  VIRTUAL_EVENTS_DATA.events[eventIndex] = {
    ...VIRTUAL_EVENTS_DATA.events[eventIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  return { success: true, event: VIRTUAL_EVENTS_DATA.events[eventIndex] };
};

export const deleteVirtualEvent = (id) => {
  const eventIndex = VIRTUAL_EVENTS_DATA.events.findIndex(event => event.id === id);
  
  if (eventIndex === -1) {
    return { success: false, message: 'Event not found' };
  }
  
  VIRTUAL_EVENTS_DATA.events.splice(eventIndex, 1);
  
  return { success: true };
};

export const registerForEvent = (eventId, userId, registrationData) => {
  const event = getVirtualEventById(eventId);
  
  if (!event) {
    return { success: false, message: 'Event not found' };
  }
  
  if (!event.registration.required) {
    return { success: false, message: 'Registration not required for this event' };
  }
  
  if (event.registration.currentRegistrations >= event.registration.maxAttendees) {
    return { success: false, message: 'Event is full' };
  }
  
  if (new Date() > new Date(event.registration.deadline)) {
    return { success: false, message: 'Registration deadline has passed' };
  }
  
  const existingRegistration = VIRTUAL_EVENTS_DATA.registrations.find(
    reg => reg.eventId === eventId && reg.userId === userId
  );
  
  if (existingRegistration) {
    return { success: false, message: 'Already registered for this event' };
  }
  
  const registration = {
    id: `reg_${Date.now()}`,
    eventId,
    userId,
    registeredAt: new Date().toISOString(),
    status: 'confirmed',
    data: registrationData,
    attendance: null,
    feedback: null,
    certificate: null,
  };
  
  VIRTUAL_EVENTS_DATA.registrations.push(registration);
  event.registration.currentRegistrations += 1;
  
  return { success: true, registration };
};

export const unregisterFromEvent = (eventId, userId) => {
  const registrationIndex = VIRTUAL_EVENTS_DATA.registrations.findIndex(
    reg => reg.eventId === eventId && reg.userId === userId
  );
  
  if (registrationIndex === -1) {
    return { success: false, message: 'Registration not found' };
  }
  
  VIRTUAL_EVENTS_DATA.registrations.splice(registrationIndex, 1);
  
  const event = getVirtualEventById(eventId);
  if (event) {
    event.registration.currentRegistrations -= 1;
  }
  
  return { success: true };
};

export const getEventRegistrations = (eventId) => {
  return VIRTUAL_EVENTS_DATA.registrations.filter(reg => reg.eventId === eventId);
};

export const getUserRegistrations = (userId) => {
  return VIRTUAL_EVENTS_DATA.registrations.filter(reg => reg.userId === userId);
};

export const markAttendance = (eventId, userId, attended = true) => {
  const registration = VIRTUAL_EVENTS_DATA.registrations.find(
    reg => reg.eventId === eventId && reg.userId === userId
  );
  
  if (!registration) {
    return { success: false, message: 'Registration not found' };
  }
  
  registration.attendance = {
    attended,
    timestamp: new Date().toISOString(),
    duration: 75, // minutes attended
  };
  
  return { success: true, registration };
};

export const submitFeedback = (eventId, userId, feedback) => {
  const registration = VIRTUAL_EVENTS_DATA.registrations.find(
    reg => reg.eventId === eventId && reg.userId === userId
  );
  
  if (!registration) {
    return { success: false, message: 'Registration not found' };
  }
  
  registration.feedback = {
    ...feedback,
    submittedAt: new Date().toISOString(),
  };
  
  return { success: true, registration };
};

export const generateCertificate = (eventId, userId) => {
  const registration = VIRTUAL_EVENTS_DATA.registrations.find(
    reg => reg.eventId === eventId && reg.userId === userId
  );
  
  if (!registration) {
    return { success: false, message: 'Registration not found' };
  }
  
  if (!registration.attendance?.attended) {
    return { success: false, message: 'Must attend event to receive certificate' };
  }
  
  registration.certificate = {
    id: `cert_${Date.now()}`,
    issuedAt: new Date().toISOString(),
    url: `https://certificates.cipss.io/${registration.id}`,
    verified: true,
  };
  
  return { success: true, certificate: registration.certificate };
};

export const getPlatforms = () => {
  return VIRTUAL_EVENTS_DATA.platforms;
};

export const getPlatformById = (id) => {
  return VIRTUAL_EVENTS_DATA.platforms.find(platform => platform.id === id);
};

export const getCategories = () => {
  return VIRTUAL_EVENTS_DATA.categories;
};

export const getVirtualEventAnalytics = () => {
  return VIRTUAL_EVENTS_DATA.analytics;
};

export const updateVirtualEventAnalytics = () => {
  const events = VIRTUAL_EVENTS_DATA.events;
  const registrations = VIRTUAL_EVENTS_DATA.registrations;
  
  VIRTUAL_EVENTS_DATA.analytics = {
    totalEvents: events.length,
    upcomingEvents: events.filter(e => e.status === 'upcoming').length,
    completedEvents: events.filter(e => e.status === 'completed').length,
    totalRegistrations: registrations.length,
    totalAttendees: registrations.filter(r => r.attendance?.attended).length,
    attendanceRate: registrations.length > 0 ? 
      registrations.filter(r => r.attendance?.attended).length / registrations.length : 0,
    averageDuration: 120,
    popularPlatforms: ['zoom', 'teams', 'meet'],
    popularCategories: ['education', 'leadership', 'environment'],
    satisfaction: 4.5,
  };
  
  return VIRTUAL_EVENTS_DATA.analytics;
};

export const getUpcomingVirtualEvents = (limit = 10) => {
  const now = new Date();
  return getVirtualEvents({ status: 'upcoming' })
    .filter(event => new Date(event.startTime) > now)
    .slice(0, limit);
};

export const getVirtualEventsByDate = (date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return getVirtualEvents().filter(event => {
    const eventStart = new Date(event.startTime);
    return eventStart >= startOfDay && eventStart <= endOfDay;
  });
};

export const getVirtualEventsByCategory = (category) => {
  return getVirtualEvents({ category });
};

export const searchVirtualEvents = (query, filters = {}) => {
  return getVirtualEvents({ ...filters, search: query });
};

export const getFeaturedVirtualEvents = () => {
  return getVirtualEvents({ featured: true });
};

export const getVirtualEventSettings = () => {
  return VIRTUAL_EVENTS_DATA.settings;
};

export const updateVirtualEventSettings = (updates) => {
  VIRTUAL_EVENTS_DATA.settings = { ...VIRTUAL_EVENTS_DATA.settings, ...updates };
  return { success: true, settings: VIRTUAL_EVENTS_DATA.settings };
};

export const joinVirtualEvent = (eventId, userId) => {
  const event = getVirtualEventById(eventId);
  const registration = VIRTUAL_EVENTS_DATA.registrations.find(
    reg => reg.eventId === eventId && reg.userId === userId
  );
  
  if (!event) {
    return { success: false, message: 'Event not found' };
  }
  
  if (!registration) {
    return { success: false, message: 'Not registered for this event' };
  }
  
  const now = new Date();
  const eventStart = new Date(event.startTime);
  const eventEnd = new Date(event.endTime);
  
  if (now < eventStart) {
    return { success: false, message: 'Event has not started yet' };
  }
  
  if (now > eventEnd) {
    return { success: false, message: 'Event has ended' };
  }
  
  return {
    success: true,
    joinUrl: event.meeting.joinUrl,
    meetingId: event.meeting.meetingId,
    password: event.meeting.password,
    platform: event.meeting.platform,
  };
};

export const leaveVirtualEvent = (eventId, userId) => {
  const registration = VIRTUAL_EVENTS_DATA.registrations.find(
    reg => reg.eventId === eventId && reg.userId === userId
  );
  
  if (!registration) {
    return { success: false, message: 'Registration not found' };
  }
  
  if (!registration.attendance) {
    registration.attendance = {
      attended: true,
      timestamp: new Date().toISOString(),
      duration: 0,
    };
  }
  
  return { success: true };
};

export const getEventRecording = (eventId, userId) => {
  const event = getVirtualEventById(eventId);
  const registration = VIRTUAL_EVENTS_DATA.registrations.find(
    reg => reg.eventId === eventId && reg.userId === userId
  );
  
  if (!event || !registration) {
    return { success: false, message: 'Event or registration not found' };
  }
  
  if (!event.meeting.recording) {
    return { success: false, message: 'Recording not available for this event' };
  }
  
  if (!registration.attendance?.attended) {
    return { success: false, message: 'Must attend event to access recording' };
  }
  
  return {
    success: true,
    recordingUrl: `https://recordings.cipss.io/events/${eventId}`,
    availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
  };
};

export const getEventResources = (eventId, userId) => {
  const event = getVirtualEventById(eventId);
  const registration = VIRTUAL_EVENTS_DATA.registrations.find(
    reg => reg.eventId === eventId && reg.userId === userId
  );
  
  if (!event || !registration) {
    return { success: false, message: 'Event or registration not found' };
  }
  
  if (!event.engagement.resources) {
    return { success: false, message: 'Resources not available for this event' };
  }
  
  return {
    success: true,
    resources: event.resources,
  };
};
