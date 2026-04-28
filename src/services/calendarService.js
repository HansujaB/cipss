// Calendar integration service for volunteer events and scheduling
export const CALENDAR_DATA = {
  connectedCalendars: [
    {
      id: 'google_1',
      type: 'google',
      name: 'Google Calendar',
      email: 'user@gmail.com',
      connected: true,
      lastSync: '2024-04-20T10:30:00Z',
      color: '#4285F4',
      permissions: ['read', 'write'],
    },
    {
      id: 'outlook_1',
      type: 'outlook',
      name: 'Outlook Calendar',
      email: 'user@outlook.com',
      connected: false,
      lastSync: null,
      color: '#0078D4',
      permissions: [],
    },
    {
      id: 'apple_1',
      type: 'apple',
      name: 'Apple Calendar',
      email: 'user@icloud.com',
      connected: false,
      lastSync: null,
      color: '#FF3B30',
      permissions: [],
    },
  ],
  events: [
    {
      id: 'event_1',
      title: 'Beach Cleanup Drive',
      description: 'Join us for a community beach cleanup event',
      type: 'volunteer',
      category: 'environment',
      startTime: '2024-04-25T09:00:00Z',
      endTime: '2024-04-25T12:00:00Z',
      location: 'Santa Monica Beach, CA',
      organizer: 'Green Earth Foundation',
      organizerId: 'org_1',
      attendees: [
        { id: 'user_1', name: 'John Doe', status: 'confirmed', email: 'john@example.com' },
        { id: 'user_2', name: 'Jane Smith', status: 'pending', email: 'jane@example.com' },
      ],
      maxAttendees: 50,
      currentAttendees: 23,
      skills: ['Physical Activity', 'Environmental Awareness'],
      requirements: ['Bring water bottle', 'Wear comfortable clothes'],
      impact: {
        type: 'environmental',
        description: 'Clean 2 miles of coastline',
        estimatedHours: 3,
      },
      recurrence: null,
      reminders: [
        { type: 'email', minutes: 1440 }, // 24 hours before
        { type: 'push', minutes: 60 }, // 1 hour before
      ],
      status: 'confirmed',
      visibility: 'public',
      calendarSync: {
        google: true,
        outlook: false,
        apple: false,
      },
      createdAt: '2024-04-15T10:00:00Z',
      updatedAt: '2024-04-20T14:30:00Z',
    },
    {
      id: 'event_2',
      title: 'Youth Mentorship Session',
      description: 'Mentor high school students on career development',
      type: 'volunteer',
      category: 'education',
      startTime: '2024-04-22T16:00:00Z',
      endTime: '2024-04-22T17:30:00Z',
      location: 'Lincoln High School, Room 201',
      organizer: 'Education First',
      organizerId: 'org_2',
      attendees: [
        { id: 'user_1', name: 'John Doe', status: 'confirmed', email: 'john@example.com' },
      ],
      maxAttendees: 10,
      currentAttendees: 7,
      skills: ['Mentoring', 'Communication', 'Career Guidance'],
      requirements: ['Background check required', 'Professional attire'],
      impact: {
        type: 'educational',
        description: 'Mentor 5-10 students',
        estimatedHours: 1.5,
      },
      recurrence: {
        type: 'weekly',
        days: ['monday'],
        interval: 1,
        endDate: '2024-06-30T00:00:00Z',
      },
      reminders: [
        { type: 'email', minutes: 720 }, // 12 hours before
        { type: 'push', minutes: 30 }, // 30 minutes before
      ],
      status: 'confirmed',
      visibility: 'private',
      calendarSync: {
        google: true,
        outlook: false,
        apple: false,
      },
      createdAt: '2024-04-10T09:00:00Z',
      updatedAt: '2024-04-18T11:20:00Z',
    },
  ],
  availability: [
    {
      id: 'avail_1',
      userId: 'user_1',
      dayOfWeek: 'saturday',
      startTime: '09:00',
      endTime: '17:00',
      timezone: 'PST',
      recurring: true,
      exceptions: [
        { date: '2024-04-27', reason: 'Out of town' },
      ],
    },
    {
      id: 'avail_2',
      userId: 'user_1',
      dayOfWeek: 'sunday',
      startTime: '10:00',
      endTime: '15:00',
      timezone: 'PST',
      recurring: true,
      exceptions: [],
    },
  ],
  settings: {
    sync: {
      autoSync: true,
      syncInterval: 30, // minutes
      syncNewEvents: true,
      syncUpdatedEvents: true,
      syncDeletedEvents: true,
    },
    notifications: {
      emailReminders: true,
      pushNotifications: true,
      defaultReminderTime: 60, // minutes before
      eventReminders: true,
      cancellationAlerts: true,
    },
    privacy: {
      shareAvailability: false,
      showBusyStatus: true,
      publicEvents: true,
      privateEvents: false,
    },
    calendar: {
      defaultCalendar: 'google_1',
      eventColor: '#1D0A69',
      defaultDuration: 60, // minutes
      bufferTime: 15, // minutes between events
    },
  },
  integrations: {
    google: {
      clientId: 'google_client_id',
      scopes: ['https://www.googleapis.com/auth/calendar'],
      redirectUri: 'https://cipss.app/auth/google/callback',
      connected: true,
      lastSync: '2024-04-20T10:30:00Z',
      syncToken: 'google_sync_token',
    },
    outlook: {
      clientId: 'outlook_client_id',
      scopes: ['https://graph.microsoft.com/Calendars.ReadWrite'],
      redirectUri: 'https://cipss.app/auth/outlook/callback',
      connected: false,
      lastSync: null,
      syncToken: null,
    },
    apple: {
      clientId: 'apple_client_id',
      scopes: ['calendars'],
      redirectUri: 'https://cipss.app/auth/apple/callback',
      connected: false,
      lastSync: null,
      syncToken: null,
    },
  },
  analytics: {
    totalEvents: 45,
    upcomingEvents: 12,
    completedEvents: 33,
    totalHours: 234,
    attendanceRate: 0.87,
    popularCategories: ['environment', 'education', 'healthcare'],
    peakTimes: ['saturday', 'sunday'],
    averageDuration: 2.5, // hours
  },
};

export const getConnectedCalendars = () => {
  return CALENDAR_DATA.connectedCalendars;
};

export const connectCalendar = (type, credentials) => {
  const calendar = CALENDAR_DATA.connectedCalendars.find(cal => cal.type === type);
  
  if (!calendar) {
    return { success: false, message: 'Calendar type not supported' };
  }
  
  calendar.connected = true;
  calendar.lastSync = new Date().toISOString();
  calendar.permissions = ['read', 'write'];
  
  // Update integration status
  CALENDAR_DATA.integrations[type].connected = true;
  CALENDAR_DATA.integrations[type].lastSync = new Date().toISOString();
  
  return { success: true, calendar };
};

export const disconnectCalendar = (type) => {
  const calendar = CALENDAR_DATA.connectedCalendars.find(cal => cal.type === type);
  
  if (!calendar) {
    return { success: false, message: 'Calendar not found' };
  }
  
  calendar.connected = false;
  calendar.lastSync = null;
  calendar.permissions = [];
  
  // Update integration status
  CALENDAR_DATA.integrations[type].connected = false;
  CALENDAR_DATA.integrations[type].lastSync = null;
  CALENDAR_DATA.integrations[type].syncToken = null;
  
  return { success: true };
};

export const syncCalendar = (type) => {
  const integration = CALENDAR_DATA.integrations[type];
  
  if (!integration.connected) {
    return { success: false, message: 'Calendar not connected' };
  }
  
  // Simulate sync process
  integration.lastSync = new Date().toISOString();
  
  return { 
    success: true, 
    syncedEvents: 12, 
    lastSync: integration.lastSync 
  };
};

export const getEvents = (filters = {}) => {
  let events = CALENDAR_DATA.events;
  
  if (filters.type) {
    events = events.filter(event => event.type === filters.type);
  }
  
  if (filters.category) {
    events = events.filter(event => event.category === filters.category);
  }
  
  if (filters.status) {
    events = events.filter(event => event.status === filters.status);
  }
  
  if (filters.startDate) {
    events = events.filter(event => new Date(event.startTime) >= new Date(filters.startDate));
  }
  
  if (filters.endDate) {
    events = events.filter(event => new Date(event.endTime) <= new Date(filters.endDate));
  }
  
  if (filters.organizerId) {
    events = events.filter(event => event.organizerId === filters.organizerId);
  }
  
  // Sort by start time
  events.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  
  return events;
};

export const getEventById = (id) => {
  return CALENDAR_DATA.events.find(event => event.id === id);
};

export const createEvent = (eventData) => {
  const newEvent = {
    id: `event_${Date.now()}`,
    ...eventData,
    attendees: eventData.attendees || [],
    maxAttendees: eventData.maxAttendees || 0,
    currentAttendees: eventData.attendees ? eventData.attendees.length : 0,
    reminders: eventData.reminders || [
      { type: 'push', minutes: CALENDAR_DATA.settings.notifications.defaultReminderTime }
    ],
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  CALENDAR_DATA.events.push(newEvent);
  
  // Sync to connected calendars
  CALENDAR_DATA.connectedCalendars.forEach(calendar => {
    if (calendar.connected && CALENDAR_DATA.settings.sync.syncNewEvents) {
      // In real app, this would actually sync to the calendar API
      console.log(`Syncing event ${newEvent.id} to ${calendar.type}`);
    }
  });
  
  return { success: true, event: newEvent };
};

export const updateEvent = (id, updates) => {
  const eventIndex = CALENDAR_DATA.events.findIndex(event => event.id === id);
  
  if (eventIndex === -1) {
    return { success: false, message: 'Event not found' };
  }
  
  CALENDAR_DATA.events[eventIndex] = {
    ...CALENDAR_DATA.events[eventIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  // Sync to connected calendars
  if (CALENDAR_DATA.settings.sync.syncUpdatedEvents) {
    CALENDAR_DATA.connectedCalendars.forEach(calendar => {
      if (calendar.connected) {
        console.log(`Syncing updated event ${id} to ${calendar.type}`);
      }
    });
  }
  
  return { success: true, event: CALENDAR_DATA.events[eventIndex] };
};

export const deleteEvent = (id) => {
  const eventIndex = CALENDAR_DATA.events.findIndex(event => event.id === id);
  
  if (eventIndex === -1) {
    return { success: false, message: 'Event not found' };
  }
  
  CALENDAR_DATA.events.splice(eventIndex, 1);
  
  // Sync to connected calendars
  if (CALENDAR_DATA.settings.sync.syncDeletedEvents) {
    CALENDAR_DATA.connectedCalendars.forEach(calendar => {
      if (calendar.connected) {
        console.log(`Deleting event ${id} from ${calendar.type}`);
      }
    });
  }
  
  return { success: true };
};

export const rsvpEvent = (eventId, userId, status = 'confirmed') => {
  const event = getEventById(eventId);
  
  if (!event) {
    return { success: false, message: 'Event not found' };
  }
  
  if (event.maxAttendees > 0 && event.currentAttendees >= event.maxAttendees) {
    return { success: false, message: 'Event is full' };
  }
  
  const existingAttendee = event.attendees.find(attendee => attendee.id === userId);
  
  if (existingAttendee) {
    existingAttendee.status = status;
  } else {
    event.attendees.push({
      id: userId,
      name: 'User Name', // In real app, get from user profile
      status,
      email: 'user@example.com', // In real app, get from user profile
    });
    event.currentAttendees += 1;
  }
  
  // Add to user's calendar if confirmed
  if (status === 'confirmed') {
    CALENDAR_DATA.connectedCalendars.forEach(calendar => {
      if (calendar.connected) {
        console.log(`Adding event ${eventId} to ${calendar.type} for user ${userId}`);
      }
    });
  }
  
  return { success: true, event };
};

export const getAvailability = (userId) => {
  return CALENDAR_DATA.availability.filter(avail => avail.userId === userId);
};

export const setAvailability = (userId, availabilityData) => {
  const newAvailability = {
    id: `avail_${Date.now()}`,
    userId,
    ...availabilityData,
    exceptions: availabilityData.exceptions || [],
  };
  
  CALENDAR_DATA.availability.push(newAvailability);
  
  return { success: true, availability: newAvailability };
};

export const updateAvailability = (id, updates) => {
  const availIndex = CALENDAR_DATA.availability.findIndex(avail => avail.id === id);
  
  if (availIndex === -1) {
    return { success: false, message: 'Availability not found' };
  }
  
  CALENDAR_DATA.availability[availIndex] = {
    ...CALENDAR_DATA.availability[availIndex],
    ...updates,
  };
  
  return { success: true, availability: CALENDAR_DATA.availability[availIndex] };
};

export const deleteAvailability = (id) => {
  const availIndex = CALENDAR_DATA.availability.findIndex(avail => avail.id === id);
  
  if (availIndex === -1) {
    return { success: false, message: 'Availability not found' };
  }
  
  CALENDAR_DATA.availability.splice(availIndex, 1);
  
  return { success: true };
};

export const getCalendarSettings = () => {
  return CALENDAR_DATA.settings;
};

export const updateCalendarSettings = (updates) => {
  CALENDAR_DATA.settings = { ...CALENDAR_DATA.settings, ...updates };
  return { success: true, settings: CALENDAR_DATA.settings };
};

export const getUpcomingEvents = (userId = null, limit = 10) => {
  const now = new Date();
  let events = getEvents().filter(event => new Date(event.startTime) > now);
  
  if (userId) {
    events = events.filter(event => 
      event.attendees.some(attendee => attendee.id === userId)
    );
  }
  
  return events.slice(0, limit);
};

export const getEventsByDate = (date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return getEvents().filter(event => {
    const eventStart = new Date(event.startTime);
    const eventEnd = new Date(event.endTime);
    return (eventStart >= startOfDay && eventStart <= endOfDay) ||
           (eventEnd >= startOfDay && eventEnd <= endOfDay) ||
           (eventStart <= startOfDay && eventEnd >= endOfDay);
  });
};

export const getEventsByMonth = (year, month) => {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
  
  return getEvents().filter(event => {
    const eventStart = new Date(event.startTime);
    return eventStart >= startOfMonth && eventStart <= endOfMonth;
  });
};

export const checkConflicts = (startTime, endTime, excludeEventId = null) => {
  const events = getEvents();
  
  return events.filter(event => {
    if (excludeEventId && event.id === excludeEventId) {
      return false;
    }
    
    const eventStart = new Date(event.startTime);
    const eventEnd = new Date(event.endTime);
    const newStart = new Date(startTime);
    const newEnd = new Date(endTime);
    
    return (newStart < eventEnd && newEnd > eventStart);
  });
};

export const suggestTimeSlots = (duration, attendees = [], dateRange = 7) => {
  const slots = [];
  const now = new Date();
  
  // Generate time slots for the next N days
  for (let day = 0; day < dateRange; day++) {
    const currentDate = new Date(now);
    currentDate.setDate(now.getDate() + day);
    
    // Check each hour from 9 AM to 6 PM
    for (let hour = 9; hour <= 18; hour++) {
      const slotStart = new Date(currentDate);
      slotStart.setHours(hour, 0, 0, 0);
      
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotStart.getMinutes() + duration);
      
      // Check if slot conflicts with existing events
      const conflicts = checkConflicts(slotStart, slotEnd);
      
      if (conflicts.length === 0) {
        slots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
          available: true,
          conflicts: [],
        });
      } else {
        slots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
          available: false,
          conflicts: conflicts.map(c => c.title),
        });
      }
    }
  }
  
  return slots.filter(slot => slot.available).slice(0, 10);
};

export const exportCalendar = (format = 'ical', startDate, endDate) => {
  const events = getEvents({ startDate, endDate });
  
  const exportData = {
    format,
    events,
    exportedAt: new Date().toISOString(),
    dateRange: { startDate, endDate },
  };
  
  return { success: true, exportData };
};

export const importCalendar = (format, data) => {
  const importedEvents = [];
  
  // Parse and import events based on format
  if (format === 'ical') {
    // Parse iCal data and create events
    // This is a simplified version
    data.events.forEach(eventData => {
      const result = createEvent(eventData);
      if (result.success) {
        importedEvents.push(result.event);
      }
    });
  }
  
  return { 
    success: true, 
    importedEvents,
    count: importedEvents.length 
  };
};

export const getCalendarAnalytics = () => {
  return CALENDAR_DATA.analytics;
};

export const updateCalendarAnalytics = () => {
  const events = CALENDAR_DATA.events;
  const now = new Date();
  
  CALENDAR_DATA.analytics = {
    totalEvents: events.length,
    upcomingEvents: events.filter(e => new Date(e.startTime) > now).length,
    completedEvents: events.filter(e => new Date(e.endTime) < now).length,
    totalHours: events.reduce((sum, e) => {
      const duration = (new Date(e.endTime) - new Date(e.startTime)) / (1000 * 60 * 60);
      return sum + duration;
    }, 0),
    attendanceRate: 0.87, // Mock calculation
    popularCategories: ['environment', 'education', 'healthcare'],
    peakTimes: ['saturday', 'sunday'],
    averageDuration: 2.5,
  };
  
  return CALENDAR_DATA.analytics;
};

export const getIntegrationStatus = (type) => {
  return CALENDAR_DATA.integrations[type];
};

export const authorizeCalendar = (type, authCode) => {
  const integration = CALENDAR_DATA.integrations[type];
  
  // Simulate OAuth flow
  integration.connected = true;
  integration.lastSync = new Date().toISOString();
  integration.syncToken = `${type}_sync_token_${Date.now()}`;
  
  // Update calendar connection status
  const calendar = CALENDAR_DATA.connectedCalendars.find(cal => cal.type === type);
  if (calendar) {
    calendar.connected = true;
    calendar.lastSync = new Date().toISOString();
    calendar.permissions = ['read', 'write'];
  }
  
  return { success: true, integration };
};

export const revokeCalendarAccess = (type) => {
  const integration = CALENDAR_DATA.integrations[type];
  
  integration.connected = false;
  integration.lastSync = null;
  integration.syncToken = null;
  
  // Update calendar connection status
  const calendar = CALENDAR_DATA.connectedCalendars.find(cal => cal.type === type);
  if (calendar) {
    calendar.connected = false;
    calendar.lastSync = null;
    calendar.permissions = [];
  }
  
  return { success: true };
};
