// Real-time chat and messaging service
export const CHAT_DATA = {
  conversations: [
    {
      id: 'conv_1',
      participants: [
        { id: 'user_1', name: 'Priya Sharma', avatar: '👩‍💼', role: 'volunteer' },
        { id: 'user_2', name: 'Rahul Kumar', avatar: '👨‍💻', role: 'volunteer' },
      ],
      type: 'direct', // direct, group, team
      title: 'Priya Sharma',
      lastMessage: {
        id: 'msg_1',
        senderId: 'user_2',
        content: 'Great work on the campaign today!',
        timestamp: '2024-04-20T16:30:00',
        type: 'text',
        read: true,
      },
      unreadCount: 0,
      isOnline: true,
      isTyping: false,
      lastActivity: '2024-04-20T16:30:00',
      muted: false,
      pinned: false,
      archived: false,
    },
    {
      id: 'conv_2',
      participants: [
        { id: 'user_1', name: 'Priya Sharma', avatar: '👩‍💼', role: 'volunteer' },
        { id: 'team_1', name: 'Environmental Warriors', avatar: '🌱', role: 'team' },
      ],
      type: 'group',
      title: 'Environmental Warriors',
      lastMessage: {
        id: 'msg_2',
        senderId: 'team_1',
        content: 'Meeting tomorrow at 10 AM',
        timestamp: '2024-04-20T15:45:00',
        type: 'text',
        read: false,
      },
      unreadCount: 3,
      isOnline: true,
      isTyping: false,
      lastActivity: '2024-04-20T15:45:00',
      muted: false,
      pinned: true,
      archived: false,
    },
    {
      id: 'conv_3',
      participants: [
        { id: 'user_1', name: 'Priya Sharma', avatar: '👩‍💼', role: 'volunteer' },
        { id: 'org_1', name: 'Education First NGO', avatar: '🏫', role: 'organization' },
      ],
      type: 'direct',
      title: 'Education First NGO',
      lastMessage: {
        id: 'msg_3',
        senderId: 'org_1',
        content: 'Thank you for volunteering with us!',
        timestamp: '2024-04-20T14:20:00',
        type: 'text',
        read: true,
      },
      unreadCount: 0,
      isOnline: false,
      isTyping: false,
      lastActivity: '2024-04-20T14:20:00',
      muted: false,
      pinned: false,
      archived: false,
    },
  ],
  messages: {
    conv_1: [
      {
        id: 'msg_1',
        senderId: 'user_2',
        content: 'Great work on the campaign today!',
        timestamp: '2024-04-20T16:30:00',
        type: 'text',
        read: true,
        reactions: [{ emoji: '👍', userId: 'user_1', timestamp: '2024-04-20T16:32:00' }],
        replyTo: null,
        edited: false,
        deleted: false,
      },
      {
        id: 'msg_2',
        senderId: 'user_1',
        content: 'Thank you! It was a team effort',
        timestamp: '2024-04-20T16:25:00',
        type: 'text',
        read: true,
        reactions: [],
        replyTo: null,
        edited: false,
        deleted: false,
      },
      {
        id: 'msg_3',
        senderId: 'user_2',
        content: 'Looking forward to the next event',
        timestamp: '2024-04-20T16:20:00',
        type: 'text',
        read: true,
        reactions: [{ emoji: '🎉', userId: 'user_1', timestamp: '2024-04-20T16:22:00' }],
        replyTo: null,
        edited: false,
        deleted: false,
      },
    ],
    conv_2: [
      {
        id: 'msg_4',
        senderId: 'team_1',
        content: 'Meeting tomorrow at 10 AM',
        timestamp: '2024-04-20T15:45:00',
        type: 'text',
        read: false,
        reactions: [],
        replyTo: null,
        edited: false,
        deleted: false,
      },
      {
        id: 'msg_5',
        senderId: 'user_3',
        content: 'I\'ll be there!',
        timestamp: '2024-04-20T15:40:00',
        type: 'text',
        read: true,
        reactions: [{ emoji: '✅', userId: 'team_1', timestamp: '2024-04-20T15:42:00' }],
        replyTo: null,
        edited: false,
        deleted: false,
      },
      {
        id: 'msg_6',
        senderId: 'user_4',
        content: 'Can\'t make it, have another commitment',
        timestamp: '2024-04-20T15:35:00',
        type: 'text',
        read: true,
        reactions: [],
        replyTo: null,
        edited: false,
        deleted: false,
      },
    ],
    conv_3: [
      {
        id: 'msg_7',
        senderId: 'org_1',
        content: 'Thank you for volunteering with us!',
        timestamp: '2024-04-20T14:20:00',
        type: 'text',
        read: true,
        reactions: [{ emoji: '❤️', userId: 'user_1', timestamp: '2024-04-20T14:25:00' }],
        replyTo: null,
        edited: false,
        deleted: false,
      },
      {
        id: 'msg_8',
        senderId: 'user_1',
        content: 'It was my pleasure! Happy to help anytime',
        timestamp: '2024-04-20T14:15:00',
        type: 'text',
        read: true,
        reactions: [],
        replyTo: null,
        edited: false,
        deleted: false,
      },
    ],
  },
  onlineUsers: [
    { id: 'user_1', name: 'Priya Sharma', avatar: '👩‍💼', status: 'online', lastSeen: null },
    { id: 'user_2', name: 'Rahul Kumar', avatar: '👨‍💻', status: 'online', lastSeen: null },
    { id: 'user_3', name: 'Anita Patel', avatar: '👩‍🎓', status: 'online', lastSeen: null },
    { id: 'team_1', name: 'Environmental Warriors', avatar: '🌱', status: 'online', lastSeen: null },
  ],
  typingUsers: {
    conv_1: [],
    conv_2: [],
    conv_3: [],
  },
  settings: {
    notifications: {
      enabled: true,
      sound: true,
      vibration: true,
      showPreview: true,
      groupNotifications: true,
    },
    privacy: {
      readReceipts: true,
      onlineStatus: true,
      typingIndicators: true,
      lastSeen: true,
    },
    appearance: {
      theme: 'light', // light, dark, auto
      fontSize: 'medium', // small, medium, large
      bubbleColor: 'blue', // blue, green, purple, orange
    },
    storage: {
      autoDownloadMedia: false,
      maxStorageSize: 100, // MB
      deleteOldMessages: false,
      retentionDays: 365,
    },
  },
  stats: {
    totalMessages: 1250,
    totalConversations: 45,
    averageResponseTime: 2.3, // minutes
    mostActiveHour: 19, // 7 PM
    dailyActiveUsers: 89,
    weeklyActiveUsers: 234,
    monthlyActiveUsers: 567,
  },
};

export const getConversations = (filters = {}) => {
  let conversations = CHAT_DATA.conversations;
  
  if (filters.type) {
    conversations = conversations.filter(conv => conv.type === filters.type);
  }
  
  if (filters.unreadOnly) {
    conversations = conversations.filter(conv => conv.unreadCount > 0);
  }
  
  if (filters.pinned) {
    conversations = conversations.filter(conv => conv.pinned);
  }
  
  if (filters.archived) {
    conversations = conversations.filter(conv => conv.archived);
  }
  
  // Sort by last activity
  conversations.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
  
  return conversations;
};

export const getConversationById = (id) => {
  return CHAT_DATA.conversations.find(conv => conv.id === id);
};

export const getMessages = (conversationId) => {
  return CHAT_DATA.messages[conversationId] || [];
};

export const sendMessage = (conversationId, content, type = 'text', replyTo = null) => {
  const conversation = getConversationById(conversationId);
  if (!conversation) {
    return { success: false, message: 'Conversation not found' };
  }
  
  const newMessage = {
    id: `msg_${Date.now()}`,
    senderId: 'user_1', // Current user
    content,
    timestamp: new Date().toISOString(),
    type,
    read: false,
    reactions: [],
    replyTo,
    edited: false,
    deleted: false,
  };
  
  // Add message to conversation
  if (!CHAT_DATA.messages[conversationId]) {
    CHAT_DATA.messages[conversationId] = [];
  }
  CHAT_DATA.messages[conversationId].push(newMessage);
  
  // Update conversation last message
  conversation.lastMessage = newMessage;
  conversation.lastActivity = newMessage.timestamp;
  
  // Update stats
  CHAT_DATA.stats.totalMessages += 1;
  
  return { success: true, message: newMessage };
};

export const editMessage = (conversationId, messageId, newContent) => {
  const messages = getMessages(conversationId);
  const message = messages.find(msg => msg.id === messageId);
  
  if (!message) {
    return { success: false, message: 'Message not found' };
  }
  
  if (message.senderId !== 'user_1') {
    return { success: false, message: 'Cannot edit other user\'s message' };
  }
  
  message.content = newContent;
  message.edited = true;
  message.editedAt = new Date().toISOString();
  
  return { success: true, message };
};

export const deleteMessage = (conversationId, messageId) => {
  const messages = getMessages(conversationId);
  const messageIndex = messages.findIndex(msg => msg.id === messageId);
  
  if (messageIndex === -1) {
    return { success: false, message: 'Message not found' };
  }
  
  const message = messages[messageIndex];
  if (message.senderId !== 'user_1') {
    return { success: false, message: 'Cannot delete other user\'s message' };
  }
  
  message.deleted = true;
  message.deletedAt = new Date().toISOString();
  
  return { success: true, message };
};

export const markAsRead = (conversationId, messageId = null) => {
  const conversation = getConversationById(conversationId);
  if (!conversation) {
    return { success: false, message: 'Conversation not found' };
  }
  
  const messages = getMessages(conversationId);
  let markedCount = 0;
  
  messages.forEach(msg => {
    if (!msg.read && msg.senderId !== 'user_1') {
      if (!messageId || msg.id === messageId || new Date(msg.timestamp) <= new Date(messageId)) {
        msg.read = true;
        msg.readAt = new Date().toISOString();
        markedCount++;
      }
    }
  });
  
  conversation.unreadCount = Math.max(0, conversation.unreadCount - markedCount);
  
  return { success: true, markedCount };
};

export const addReaction = (conversationId, messageId, emoji) => {
  const messages = getMessages(conversationId);
  const message = messages.find(msg => msg.id === messageId);
  
  if (!message) {
    return { success: false, message: 'Message not found' };
  }
  
  // Remove existing reaction from same user
  message.reactions = message.reactions.filter(r => r.userId !== 'user_1');
  
  // Add new reaction
  message.reactions.push({
    emoji,
    userId: 'user_1',
    timestamp: new Date().toISOString(),
  });
  
  return { success: true, reactions: message.reactions };
};

export const removeReaction = (conversationId, messageId, emoji) => {
  const messages = getMessages(conversationId);
  const message = messages.find(msg => msg.id === messageId);
  
  if (!message) {
    return { success: false, message: 'Message not found' };
  }
  
  message.reactions = message.reactions.filter(r => !(r.emoji === emoji && r.userId === 'user_1'));
  
  return { success: true, reactions: message.reactions };
};

export const createConversation = (participants, type = 'direct', title = '') => {
  const existingConv = CHAT_DATA.conversations.find(conv => {
    if (type === 'direct' && conv.type === 'direct') {
      const participantIds = participants.map(p => p.id).sort();
      const convParticipantIds = conv.participants.map(p => p.id).sort();
      return JSON.stringify(participantIds) === JSON.stringify(convParticipantIds);
    }
    return false;
  });
  
  if (existingConv) {
    return { success: false, message: 'Conversation already exists', conversation: existingConv };
  }
  
  const newConversation = {
    id: `conv_${Date.now()}`,
    participants,
    type,
    title: title || participants.find(p => p.id !== 'user_1')?.name || 'New Conversation',
    lastMessage: null,
    unreadCount: 0,
    isOnline: false,
    isTyping: false,
    lastActivity: new Date().toISOString(),
    muted: false,
    pinned: false,
    archived: false,
  };
  
  CHAT_DATA.conversations.push(newConversation);
  CHAT_DATA.messages[newConversation.id] = [];
  
  CHAT_DATA.stats.totalConversations += 1;
  
  return { success: true, conversation: newConversation };
};

export const pinConversation = (conversationId) => {
  const conversation = getConversationById(conversationId);
  if (conversation) {
    conversation.pinned = true;
    return { success: true, conversation };
  }
  return { success: false, message: 'Conversation not found' };
};

export const unpinConversation = (conversationId) => {
  const conversation = getConversationById(conversationId);
  if (conversation) {
    conversation.pinned = false;
    return { success: true, conversation };
  }
  return { success: false, message: 'Conversation not found' };
};

export const muteConversation = (conversationId) => {
  const conversation = getConversationById(conversationId);
  if (conversation) {
    conversation.muted = true;
    return { success: true, conversation };
  }
  return { success: false, message: 'Conversation not found' };
};

export const unmuteConversation = (conversationId) => {
  const conversation = getConversationById(conversationId);
  if (conversation) {
    conversation.muted = false;
    return { success: true, conversation };
  }
  return { success: false, message: 'Conversation not found' };
};

export const archiveConversation = (conversationId) => {
  const conversation = getConversationById(conversationId);
  if (conversation) {
    conversation.archived = true;
    return { success: true, conversation };
  }
  return { success: false, message: 'Conversation not found' };
};

export const unarchiveConversation = (conversationId) => {
  const conversation = getConversationById(conversationId);
  if (conversation) {
    conversation.archived = false;
    return { success: true, conversation };
  }
  return { success: false, message: 'Conversation not found' };
};

export const deleteConversation = (conversationId) => {
  const index = CHAT_DATA.conversations.findIndex(conv => conv.id === conversationId);
  if (index === -1) {
    return { success: false, message: 'Conversation not found' };
  }
  
  CHAT_DATA.conversations.splice(index, 1);
  delete CHAT_DATA.messages[conversationId];
  
  CHAT_DATA.stats.totalConversations -= 1;
  
  return { success: true };
};

export const getOnlineUsers = () => {
  return CHAT_DATA.onlineUsers;
};

export const setUserOnlineStatus = (userId, status) => {
  const user = CHAT_DATA.onlineUsers.find(u => u.id === userId);
  if (user) {
    user.status = status;
    user.lastSeen = status === 'online' ? null : new Date().toISOString();
    return { success: true, user };
  }
  return { success: false, message: 'User not found' };
};

export const setTypingStatus = (conversationId, userId, isTyping) => {
  if (!CHAT_DATA.typingUsers[conversationId]) {
    CHAT_DATA.typingUsers[conversationId] = [];
  }
  
  const typingUsers = CHAT_DATA.typingUsers[conversationId];
  const index = typingUsers.indexOf(userId);
  
  if (isTyping && index === -1) {
    typingUsers.push(userId);
  } else if (!isTyping && index !== -1) {
    typingUsers.splice(index, 1);
  }
  
  return { success: true, typingUsers };
};

export const getTypingUsers = (conversationId) => {
  return CHAT_DATA.typingUsers[conversationId] || [];
};

export const getChatSettings = () => {
  return CHAT_DATA.settings;
};

export const updateChatSettings = (category, updates) => {
  CHAT_DATA.settings[category] = { ...CHAT_DATA.settings[category], ...updates };
  return { success: true, settings: CHAT_DATA.settings };
};

export const getChatStats = () => {
  return CHAT_DATA.stats;
};

export const searchMessages = (query, conversationId = null) => {
  const searchResults = [];
  const conversations = conversationId ? [getConversationById(conversationId)] : CHAT_DATA.conversations;
  
  conversations.forEach(conv => {
    if (conv) {
      const messages = getMessages(conv.id);
      messages.forEach(msg => {
        if (msg.content.toLowerCase().includes(query.toLowerCase()) && !msg.deleted) {
          searchResults.push({
            message: msg,
            conversation: conv,
            matchContext: msg.content.substring(
              Math.max(0, msg.content.toLowerCase().indexOf(query.toLowerCase()) - 50),
              msg.content.toLowerCase().indexOf(query.toLowerCase()) + query.length + 50
            ),
          });
        }
      });
    }
  });
  
  return searchResults;
};

export const getUnreadCount = () => {
  return CHAT_DATA.conversations.reduce((total, conv) => total + conv.unreadCount, 0);
};

export const markAllAsRead = () => {
  let totalMarked = 0;
  
  CHAT_DATA.conversations.forEach(conv => {
    const messages = getMessages(conv.id);
    messages.forEach(msg => {
      if (!msg.read && msg.senderId !== 'user_1') {
        msg.read = true;
        msg.readAt = new Date().toISOString();
        totalMarked++;
      }
    });
    conv.unreadCount = 0;
  });
  
  return { success: true, markedCount: totalMarked };
};

export const clearChatHistory = (conversationId) => {
  if (conversationId) {
    CHAT_DATA.messages[conversationId] = [];
    const conversation = getConversationById(conversationId);
    if (conversation) {
      conversation.lastMessage = null;
      conversation.unreadCount = 0;
    }
  } else {
    // Clear all conversations
    Object.keys(CHAT_DATA.messages).forEach(convId => {
      CHAT_DATA.messages[convId] = [];
    });
    CHAT_DATA.conversations.forEach(conv => {
      conv.lastMessage = null;
      conv.unreadCount = 0;
    });
  }
  
  return { success: true };
};

export const exportChatHistory = (conversationId, format = 'json') => {
  const conversation = getConversationById(conversationId);
  const messages = getMessages(conversationId);
  
  if (!conversation) {
    return { success: false, message: 'Conversation not found' };
  }
  
  const exportData = {
    conversation: {
      id: conversation.id,
      title: conversation.title,
      type: conversation.type,
      participants: conversation.participants,
      exportedAt: new Date().toISOString(),
    },
    messages: messages.filter(msg => !msg.deleted),
  };
  
  return { success: true, data: exportData, format };
};
