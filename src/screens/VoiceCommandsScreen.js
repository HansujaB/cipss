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
} from 'react-native';
import {
  VOICE_DATA,
  getVoiceCommands,
  getVoiceSettings,
  updateVoiceSettings,
  getVoiceHistory,
  executeVoiceCommand,
  startVoiceRecognition,
  stopVoiceRecognition,
  getVoiceStats,
  clearVoiceHistory,
  enableVoiceCommand,
  disableVoiceCommand,
  addCustomCommand,
  removeCustomCommand,
  getVoiceFeedback,
  checkVoicePermissions,
  getCommandCategories,
} from '../services/voiceService';

export default function VoiceCommandsScreen() {
  const [activeTab, setActiveTab] = useState('commands');
  const [commands, setCommands] = useState(getVoiceCommands());
  const [settings, setSettings] = useState(getVoiceSettings());
  const [history, setHistory] = useState(getVoiceHistory());
  const [stats, setStats] = useState(getVoiceStats());
  const [isListening, setIsListening] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [testModalVisible, setTestModalVisible] = useState(false);
  const [addCommandModalVisible, setAddCommandModalVisible] = useState(false);

  const tabs = [
    { key: 'commands', label: 'Commands', icon: '🎤' },
    { key: 'history', label: 'History', icon: '📜' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
    { key: 'test', label: 'Test', icon: '🧪' },
  ];

  const categories = getCommandCategories();

  useEffect(() => {
    // Check voice permissions on mount
    const permissions = checkVoicePermissions();
    if (!permissions.canStart) {
      Alert.alert(
        'Voice Permissions Required',
        'Please enable microphone and speech recognition permissions to use voice commands.',
        [{ text: 'OK' }]
      );
    }
  }, []);

  const handleStartListening = () => {
    const result = startVoiceRecognition();
    if (result.success) {
      setIsListening(true);
      
      // Simulate voice recognition after 3 seconds
      setTimeout(() => {
        const testCommands = ['show leaderboard', 'check my rank', 'show my profile'];
        const randomCommand = testCommands[Math.floor(Math.random() * testCommands.length)];
        const result = executeVoiceCommand(randomCommand, 0.9);
        
        if (result.success) {
          Alert.alert('Command Executed', result.result.message);
          setHistory(getVoiceHistory());
          setStats(getVoiceStats());
        }
        
        setIsListening(false);
      }, 3000);
    }
  };

  const handleStopListening = () => {
    const result = stopVoiceRecognition();
    if (result.success) {
      setIsListening(false);
    }
  };

  const handleToggleCommand = (commandId) => {
    const command = commands.find(c => c.id === commandId);
    if (command) {
      if (command.enabled) {
        disableVoiceCommand(commandId);
      } else {
        enableVoiceCommand(commandId);
      }
      setCommands(getVoiceCommands());
    }
  };

  const handleTestCommand = (command) => {
    setSelectedCommand(command);
    setTestModalVisible(true);
  };

  const handleExecuteTest = () => {
    if (!selectedCommand) return;
    
    const result = executeVoiceCommand(selectedCommand.phrase, 0.95);
    if (result.success) {
      Alert.alert('Success', result.result.message);
      setHistory(getVoiceHistory());
      setStats(getVoiceStats());
    } else {
      Alert.alert('Error', result.message);
    }
    setTestModalVisible(false);
  };

  const handleUpdateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    updateVoiceSettings(newSettings);
    setSettings(newSettings);
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all voice command history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            const result = clearVoiceHistory();
            if (result.success) {
              setHistory(getVoiceHistory());
              Alert.alert('Success', 'History cleared!');
            }
          }
        }
      ]
    );
  };

  const renderCommandItem = ({ item }) => (
    <View style={[
      styles.commandItem,
      !item.enabled && styles.disabledCommand
    ]}>
      <View style={styles.commandHeader}>
        <View style={styles.commandInfo}>
          <Text style={styles.commandPhrase}>"{item.phrase}"</Text>
          <Text style={styles.commandDescription}>{item.description}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.commandToggle,
            item.enabled && styles.commandToggleOn
          ]}
          onPress={() => handleToggleCommand(item.id)}
        >
          <Text style={styles.commandToggleText}>
            {item.enabled ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.commandFooter}>
        <Text style={styles.commandCategory}>{item.category}</Text>
        <TouchableOpacity
          style={styles.testBtn}
          onPress={() => handleTestCommand(item)}
        >
          <Text style={styles.testBtnText}>Test</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHistoryItem = ({ item }) => (
    <View style={[
      styles.historyItem,
      !item.executed && styles.failedHistory
    ]}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyCommand}>{item.command}</Text>
        <Text style={styles.historyConfidence}>
          {Math.round(item.confidence * 100)}%
        </Text>
      </View>
      
      <Text style={styles.historyResponse}>{item.response}</Text>
      <Text style={styles.historyTime}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'commands':
        return (
          <View style={styles.commandsContainer}>
            {/* Stats Header */}
            <View style={styles.statsHeader}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{commands.length}</Text>
                <Text style={styles.statLabel}>Commands</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{commands.filter(c => c.enabled).length}</Text>
                <Text style={styles.statLabel}>Enabled</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.successfulExecutions}</Text>
                <Text style={styles.statLabel}>Successes</Text>
              </View>
            </View>
            
            {/* Categories */}
            <View style={styles.categoriesContainer}>
              <Text style={styles.categoriesTitle}>Categories</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              >
                {Object.keys(categories).map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={styles.categoryChip}
                  >
                    <Text style={styles.categoryChipText}>
                      {category.charAt(0).toUpperCase() + category.slice(1)} ({categories[category].length})
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <FlatList
              data={commands}
              keyExtractor={(item) => item.id}
              renderItem={renderCommandItem}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
        
      case 'history':
        return (
          <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>📜 Command History</Text>
              <TouchableOpacity
                style={styles.clearHistoryBtn}
                onPress={handleClearHistory}
              >
                <Text style={styles.clearHistoryBtnText}>Clear</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={history}
              keyExtractor={(item) => item.id}
              renderItem={renderHistoryItem}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No command history</Text>
                </View>
              }
            />
          </View>
        );
        
      case 'settings':
        return (
          <ScrollView style={styles.settingsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>🎤 Voice Settings</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Enable Voice Commands</Text>
                  <Text style={styles.settingDescription}>Turn voice commands on or off</Text>
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
                  <Text style={styles.settingLabel}>Wake Word</Text>
                  <Text style={styles.settingDescription}>"{settings.wakeWord}"</Text>
                </View>
                <TouchableOpacity
                  style={[styles.toggleBtn, settings.continuousListening && styles.toggleBtnOn]}
                  onPress={() => handleUpdateSetting('continuousListening', !settings.continuousListening)}
                >
                  <Text style={styles.toggleBtnText}>
                    {settings.continuousListening ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Confidence Threshold</Text>
                  <Text style={styles.settingDescription}>{Math.round(settings.confidence * 100)}%</Text>
                </View>
                <View style={styles.confidenceOptions}>
                  {[0.5, 0.7, 0.9].map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.confidenceBtn,
                        settings.confidence === level && styles.confidenceBtnActive
                      ]}
                      onPress={() => handleUpdateSetting('confidence', level)}
                    >
                      <Text style={[
                        styles.confidenceBtnText,
                        settings.confidence === level && styles.confidenceBtnTextActive
                      ]}>
                        {Math.round(level * 100)}%
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Voice Feedback</Text>
                  <Text style={styles.settingDescription}>Spoken responses</Text>
                </View>
                <TouchableOpacity
                  style={[styles.toggleBtn, settings.voiceFeedback && styles.toggleBtnOn]}
                  onPress={() => handleUpdateSetting('voiceFeedback', !settings.voiceFeedback)}
                >
                  <Text style={styles.toggleBtnText}>
                    {settings.voiceFeedback ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Haptic Feedback</Text>
                  <Text style={styles.settingDescription}>Vibration responses</Text>
                </View>
                <TouchableOpacity
                  style={[styles.toggleBtn, settings.hapticFeedback && styles.toggleBtnOn]}
                  onPress={() => handleUpdateSetting('hapticFeedback', !settings.hapticFeedback)}
                >
                  <Text style={styles.toggleBtnText}>
                    {settings.hapticFeedback ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Auto Execute</Text>
                  <Text style={styles.settingDescription}>Execute without confirmation</Text>
                </View>
                <TouchableOpacity
                  style={[styles.toggleBtn, settings.autoExecute && styles.toggleBtnOn]}
                  onPress={() => handleUpdateSetting('autoExecute', !settings.autoExecute)}
                >
                  <Text style={styles.toggleBtnText}>
                    {settings.autoExecute ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        );
        
      case 'test':
        return (
          <View style={styles.testContainer}>
            <View style={styles.testCard}>
              <Text style={styles.testTitle}>🧪 Voice Test</Text>
              
              <View style={styles.testStatus}>
                <Text style={styles.testStatusText}>
                  {isListening ? 'Listening...' : 'Ready'}
                </Text>
                <View style={[
                  styles.testIndicator,
                  isListening && styles.testIndicatorActive
                ]} />
              </View>
              
              <TouchableOpacity
                style={[
                  styles.testMainBtn,
                  isListening ? styles.testMainBtnStop : styles.testMainBtnStart
                ]}
                onPress={isListening ? handleStopListening : handleStartListening}
              >
                <Text style={styles.testMainBtnText}>
                  {isListening ? '🛑 Stop' : '🎤 Start Listening'}
                </Text>
              </TouchableOpacity>
              
              <Text style={styles.testInstructions}>
                Say "Hey CIPSS" followed by your command, or just press Start and try:
              </Text>
              
              <View style={styles.testExamples}>
                <Text style={styles.testExample}>• "Show leaderboard"</Text>
                <Text style={styles.testExample}>• "Check my rank"</Text>
                <Text style={styles.testExample}>• "Show my profile"</Text>
                <Text style={styles.testExample}>• "Join campaign"</Text>
              </View>
            </View>
          </View>
        );
        
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>🎤 Voice Commands</Text>
      
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
      
      {/* Test Command Modal */}
      <Modal
        visible={testModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setTestModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Test Command</Text>
            {selectedCommand && (
              <View style={styles.modalCommand}>
                <Text style={styles.modalPhrase}>"{selectedCommand.phrase}"</Text>
                <Text style={styles.modalDescription}>{selectedCommand.description}</Text>
              </View>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setTestModalVisible(false)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalExecuteBtn}
                onPress={handleExecuteTest}
              >
                <Text style={styles.modalExecuteBtnText}>Execute</Text>
              </TouchableOpacity>
            </View>
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

  commandsContainer: {
    flex: 1,
  },

  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
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

  categoriesContainer: {
    marginBottom: 16,
  },

  categoriesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  categoryChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },

  categoryChipText: {
    fontSize: 12,
    color: '#374151',
  },

  commandItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },

  disabledCommand: {
    opacity: 0.6,
  },

  commandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  commandInfo: {
    flex: 1,
  },

  commandPhrase: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  commandDescription: {
    fontSize: 13,
    color: '#374151',
  },

  commandToggle: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  commandToggleOn: {
    backgroundColor: '#22C55E',
  },

  commandToggleText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },

  commandToggleTextOn: {
    color: '#FFFFFF',
  },

  commandFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  commandCategory: {
    fontSize: 11,
    color: '#9CA3AF',
    textTransform: 'capitalize',
  },

  testBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },

  testBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },

  historyContainer: {
    flex: 1,
  },

  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  clearHistoryBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  clearHistoryBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },

  historyItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },

  failedHistory: {
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },

  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  historyCommand: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  historyConfidence: {
    fontSize: 12,
    color: '#22C55E',
  },

  historyResponse: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 4,
  },

  historyTime: {
    fontSize: 11,
    color: '#9CA3AF',
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

  toggleBtnTextOn: {
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

  testContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },

  testCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 14,
    elevation: 2,
    alignItems: 'center',
  },

  testTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 20,
  },

  testStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  testStatusText: {
    fontSize: 16,
    color: '#374151',
    marginRight: 8,
  },

  testIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },

  testIndicatorActive: {
    backgroundColor: '#EF4444',
  },

  testMainBtn: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },

  testMainBtnStart: {
    backgroundColor: '#22C55E',
  },

  testMainBtnStop: {
    backgroundColor: '#EF4444',
  },

  testMainBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  testInstructions: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 16,
  },

  testExamples: {
    alignSelf: 'stretch',
  },

  testExample: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
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
    maxWidth: 300,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 16,
    textAlign: 'center',
  },

  modalCommand: {
    marginBottom: 20,
  },

  modalPhrase: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D0A69',
    textAlign: 'center',
    marginBottom: 8,
  },

  modalDescription: {
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
  },

  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },

  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
  },

  modalCancelBtnText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  modalExecuteBtn: {
    flex: 1,
    backgroundColor: '#1D0A69',
    padding: 12,
    borderRadius: 8,
  },

  modalExecuteBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
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
