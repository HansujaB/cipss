// Voice commands service
export const VOICE_DATA = {
  commands: [
    {
      id: 'cmd_show_leaderboard',
      phrase: 'show leaderboard',
      action: 'navigate',
      target: 'LeaderboardScreen',
      description: 'Navigate to the leaderboard',
      category: 'navigation',
      enabled: true,
    },
    {
      id: 'cmd_show_profile',
      phrase: 'show my profile',
      action: 'navigate',
      target: 'ProfileScreen',
      description: 'Navigate to your profile',
      category: 'navigation',
      enabled: true,
    },
    {
      id: 'cmd_show_campaigns',
      phrase: 'show campaigns',
      action: 'navigate',
      target: 'CampaignsScreen',
      description: 'Navigate to campaigns',
      category: 'navigation',
      enabled: true,
    },
    {
      id: 'cmd_show_achievements',
      phrase: 'show achievements',
      action: 'navigate',
      target: 'AchievementsScreen',
      description: 'Navigate to achievements',
      category: 'navigation',
      enabled: true,
    },
    {
      id: 'cmd_show_team',
      phrase: 'show my team',
      action: 'navigate',
      target: 'TeamScreen',
      description: 'Navigate to your team',
      category: 'navigation',
      enabled: true,
    },
    {
      id: 'cmd_search_volunteers',
      phrase: 'search volunteers',
      action: 'search',
      target: 'volunteers',
      description: 'Search for volunteers',
      category: 'search',
      enabled: true,
    },
    {
      id: 'cmd_search_campaigns',
      phrase: 'search campaigns',
      action: 'search',
      target: 'campaigns',
      description: 'Search for campaigns',
      category: 'search',
      enabled: true,
    },
    {
      id: 'cmd_filter_leaderboard',
      phrase: 'filter leaderboard',
      action: 'filter',
      target: 'leaderboard',
      description: 'Filter the leaderboard',
      category: 'filter',
      enabled: true,
    },
    {
      id: 'cmd_share_achievement',
      phrase: 'share achievement',
      action: 'share',
      target: 'achievement',
      description: 'Share your latest achievement',
      category: 'social',
      enabled: true,
    },
    {
      id: 'cmd_join_campaign',
      phrase: 'join campaign',
      action: 'join',
      target: 'campaign',
      description: 'Join the current campaign',
      category: 'action',
      enabled: true,
    },
    {
      id: 'cmd_log_hours',
      phrase: 'log hours',
      action: 'log',
      target: 'hours',
      description: 'Log volunteer hours',
      category: 'action',
      enabled: true,
    },
    {
      id: 'cmd_check_rank',
      phrase: 'check my rank',
      action: 'check',
      target: 'rank',
      description: 'Check your current rank',
      category: 'info',
      enabled: true,
    },
    {
      id: 'cmd_check_points',
      phrase: 'check my points',
      action: 'check',
      target: 'points',
      description: 'Check your current points',
      category: 'info',
      enabled: true,
    },
    {
      id: 'cmd_check_streak',
      phrase: 'check my streak',
      action: 'check',
      target: 'streak',
      description: 'Check your current streak',
      category: 'info',
      enabled: true,
    },
    {
      id: 'cmd_start_ar',
      phrase: 'start AR',
      action: 'ar',
      target: 'start',
      description: 'Start AR experience',
      category: 'ar',
      enabled: true,
    },
    {
      id: 'cmd_take_photo',
      phrase: 'take photo',
      action: 'ar',
      target: 'photo',
      description: 'Take AR photo',
      category: 'ar',
      enabled: true,
    },
  ],
  settings: {
    enabled: true,
    wakeWord: 'Hey CIPSS',
    continuousListening: false,
    confidence: 0.7,
    language: 'en-US',
    voiceFeedback: true,
    hapticFeedback: true,
    visualFeedback: true,
    autoExecute: false,
    confirmationRequired: true,
  },
  history: [
    {
      id: 'voice_1',
      command: 'show leaderboard',
      recognized: 'show leaderboard',
      confidence: 0.95,
      executed: true,
      timestamp: '2024-04-20T14:30:00',
      response: 'Navigating to leaderboard',
    },
    {
      id: 'voice_2',
      command: 'check my rank',
      recognized: 'check my rank',
      confidence: 0.88,
      executed: true,
      timestamp: '2024-04-20T15:45:00',
      response: 'Your current rank is #5',
    },
    {
      id: 'voice_3',
      command: 'show my profile',
      recognized: 'show my profile',
      confidence: 0.92,
      executed: true,
      timestamp: '2024-04-20T16:20:00',
      response: 'Opening your profile',
    },
  ],
  stats: {
    totalCommands: 25,
    successfulExecutions: 22,
    averageConfidence: 0.87,
    mostUsedCommand: 'cmd_show_leaderboard',
    voiceSessions: 8,
    totalVoiceTime: 45, // minutes
  },
};

export const getVoiceCommands = (filters = {}) => {
  let commands = VOICE_DATA.commands;
  
  if (filters.category) {
    commands = commands.filter(c => c.category === filters.category);
  }
  
  if (filters.enabled !== undefined) {
    commands = commands.filter(c => c.enabled === filters.enabled);
  }
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    commands = commands.filter(c => 
      c.phrase.toLowerCase().includes(search) ||
      c.description.toLowerCase().includes(search)
    );
  }
  
  return commands;
};

export const getVoiceSettings = () => {
  return VOICE_DATA.settings;
};

export const updateVoiceSettings = (settings) => {
  VOICE_DATA.settings = { ...VOICE_DATA.settings, ...settings };
  return { success: true, settings: VOICE_DATA.settings };
};

export const getVoiceHistory = () => {
  return VOICE_DATA.history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const executeVoiceCommand = (commandText, confidence = 0.8) => {
  // Find matching command
  const command = VOICE_DATA.commands.find(cmd => 
    cmd.enabled && cmd.phrase.toLowerCase().includes(commandText.toLowerCase())
  );
  
  if (!command) {
    const historyItem = {
      id: `voice_${Date.now()}`,
      command: commandText,
      recognized: 'Not recognized',
      confidence: 0,
      executed: false,
      timestamp: new Date().toISOString(),
      response: 'Command not recognized',
    };
    
    VOICE_DATA.history.unshift(historyItem);
    return { success: false, message: 'Command not recognized', historyItem };
  }
  
  // Check confidence threshold
  if (confidence < VOICE_DATA.settings.confidence) {
    const historyItem = {
      id: `voice_${Date.now()}`,
      command: commandText,
      recognized: command.phrase,
      confidence,
      executed: false,
      timestamp: new Date().toISOString(),
      response: 'Confidence too low',
    };
    
    VOICE_DATA.history.unshift(historyItem);
    return { success: false, message: 'Confidence too low', historyItem };
  }
  
  // Execute command
  const result = executeCommandAction(command);
  
  const historyItem = {
    id: `voice_${Date.now()}`,
    command: commandText,
    recognized: command.phrase,
    confidence,
    executed: result.success,
    timestamp: new Date().toISOString(),
    response: result.message,
  };
  
  VOICE_DATA.history.unshift(historyItem);
  
  // Update stats
  VOICE_DATA.stats.totalCommands += 1;
  if (result.success) {
    VOICE_DATA.stats.successfulExecutions += 1;
  }
  
  return { success: result.success, command, result, historyItem };
};

const executeCommandAction = (command) => {
  switch (command.action) {
    case 'navigate':
      return {
        success: true,
        message: `Navigating to ${command.target}`,
        action: 'NAVIGATE',
        target: command.target,
      };
      
    case 'search':
      return {
        success: true,
        message: `Searching for ${command.target}`,
        action: 'SEARCH',
        target: command.target,
      };
      
    case 'filter':
      return {
        success: true,
        message: `Filtering ${command.target}`,
        action: 'FILTER',
        target: command.target,
      };
      
    case 'share':
      return {
        success: true,
        message: `Sharing your ${command.target}`,
        action: 'SHARE',
        target: command.target,
      };
      
    case 'join':
      return {
        success: true,
        message: `Joining ${command.target}`,
        action: 'JOIN',
        target: command.target,
      };
      
    case 'log':
      return {
        success: true,
        message: `Opening ${command.target} logger`,
        action: 'LOG',
        target: command.target,
      };
      
    case 'check':
      return {
        success: true,
        message: `Checking your ${command.target}`,
        action: 'CHECK',
        target: command.target,
        data: getTargetData(command.target),
      };
      
    case 'ar':
      return {
        success: true,
        message: `Starting AR ${command.target}`,
        action: 'AR',
        target: command.target,
      };
      
    default:
      return {
        success: false,
        message: 'Unknown action',
      };
  }
};

const getTargetData = (target) => {
  switch (target) {
    case 'rank':
      return { current: 5, change: '+1', total: 100 };
    case 'points':
      return { current: 1250, earned: 50, total: 2000 };
    case 'streak':
      return { current: 7, best: 14, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] };
    default:
      return {};
  }
};

export const startVoiceRecognition = () => {
  // Simulate starting voice recognition
  return {
    success: true,
    message: 'Voice recognition started',
    listening: true,
    sessionId: `voice_session_${Date.now()}`,
  };
};

export const stopVoiceRecognition = () => {
  // Simulate stopping voice recognition
  return {
    success: true,
    message: 'Voice recognition stopped',
    listening: false,
  };
};

export const getVoiceStats = () => {
  return VOICE_DATA.stats;
};

export const clearVoiceHistory = () => {
  const count = VOICE_DATA.history.length;
  VOICE_DATA.history = [];
  return { success: true, cleared: count };
};

export const enableVoiceCommand = (commandId) => {
  const command = VOICE_DATA.commands.find(c => c.id === commandId);
  if (command) {
    command.enabled = true;
    return { success: true, command };
  }
  return { success: false, message: 'Command not found' };
};

export const disableVoiceCommand = (commandId) => {
  const command = VOICE_DATA.commands.find(c => c.id === commandId);
  if (command) {
    command.enabled = false;
    return { success: true, command };
  }
  return { success: false, message: 'Command not found' };
};

export const addCustomCommand = (phrase, action, target, description) => {
  const customCommand = {
    id: `cmd_custom_${Date.now()}`,
    phrase,
    action,
    target,
    description,
    category: 'custom',
    enabled: true,
  };
  
  VOICE_DATA.commands.push(customCommand);
  return { success: true, command: customCommand };
};

export const removeCustomCommand = (commandId) => {
  const index = VOICE_DATA.commands.findIndex(c => c.id === commandId);
  if (index !== -1) {
    const removed = VOICE_DATA.commands.splice(index, 1)[0];
    return { success: true, removed };
  }
  return { success: false, message: 'Command not found' };
};

export const getVoiceFeedback = (message, type = 'info') => {
  // Simulate voice feedback
  return {
    success: true,
    message,
    type,
    audioUrl: `https://voice-assets.cipss.com/feedback/${type}.mp3`,
  };
};

export const checkVoicePermissions = () => {
  // Simulate voice permission check
  return {
    microphone: true,
    speechRecognition: true,
    canStart: true,
  };
};

export const trainVoiceModel = (audioData) => {
  // Simulate voice model training
  return {
    success: true,
    message: 'Voice model trained successfully',
    accuracy: 0.92,
    samples: audioData.length,
  };
};

export const getVoiceLanguages = () => {
  return [
    { code: 'en-US', name: 'English (US)', supported: true },
    { code: 'en-GB', name: 'English (UK)', supported: true },
    { code: 'es-ES', name: 'Spanish', supported: false },
    { code: 'fr-FR', name: 'French', supported: false },
    { code: 'de-DE', name: 'German', supported: false },
  ];
};

export const getCommandCategories = () => {
  const categories = {};
  VOICE_DATA.commands.forEach(cmd => {
    if (!categories[cmd.category]) {
      categories[cmd.category] = [];
    }
    categories[cmd.category].push(cmd);
  });
  return categories;
};
