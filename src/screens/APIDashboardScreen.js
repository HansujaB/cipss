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
  Dimensions,
} from 'react-native';
import {
  API_CONFIG,
  API_KEYS,
  WEBHOOK_EVENTS,
  INTEGRATION_DATA,
  getLeaderboard,
  getUserProfile,
  getTeamLeaderboard,
  getAnalytics,
  createWebhook,
  testWebhook,
  getApiUsage,
  getIntegrations,
  createApiKey,
  revokeApiKey,
} from '../services/apiService';

const { width } = Dimensions.get('window');

export default function APIDashboardScreen() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEndpoint, setSelectedEndpoint] = useState('leaderboard');
  const [apiKey, setApiKey] = useState(API_KEYS.development);
  const [testResults, setTestResults] = useState([]);

  const tabs = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'endpoints', label: 'Endpoints', icon: '🔗' },
    { key: 'integrations', label: 'Integrations', icon: '🔌' },
    { key: 'webhooks', label: 'Webhooks', icon: '🪝' },
    { key: 'usage', label: 'Usage', icon: '📈' },
    { key: 'keys', label: 'API Keys', icon: '🔑' },
  ];

  const endpoints = [
    { key: 'leaderboard', method: 'GET', path: '/leaderboard', description: 'Get leaderboard data' },
    { key: 'users', method: 'GET', path: '/users/{id}', description: 'Get user profile' },
    { key: 'teams', method: 'GET', path: '/teams', description: 'Get team leaderboard' },
    { key: 'analytics', method: 'GET', path: '/analytics', description: 'Get analytics data' },
    { key: 'campaigns', method: 'GET', path: '/campaigns', description: 'Get campaigns' },
    { key: 'achievements', method: 'GET', path: '/achievements', description: 'Get achievements' },
  ];

  const handleTestEndpoint = async (endpointKey) => {
    try {
      let result;
      switch (endpointKey) {
        case 'leaderboard':
          result = await getLeaderboard({ limit: 10 });
          break;
        case 'users':
          result = await getUserProfile('user_current');
          break;
        case 'teams':
          result = await getTeamLeaderboard({ limit: 10 });
          break;
        case 'analytics':
          result = await getAnalytics({ type: 'overview' });
          break;
        default:
          result = { success: false, message: 'Endpoint not implemented' };
      }
      
      const testResult = {
        id: Date.now(),
        endpoint: endpointKey,
        success: result.success,
        responseTime: Math.floor(Math.random() * 500) + 100,
        timestamp: new Date().toLocaleTimeString(),
      };
      
      setTestResults([testResult, ...testResults.slice(0, 4)]);
      
      Alert.alert(
        result.success ? 'Success' : 'Error',
        result.success ? 'Endpoint test successful!' : result.message || 'Test failed'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to test endpoint');
    }
  };

  const handleCreateWebhook = () => {
    Alert.alert(
      'Create Webhook',
      'Enter webhook URL:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create',
          onPress: () => {
            // In a real app, this would show an input dialog
            Alert.alert('Success', 'Webhook created successfully!');
          }
        }
      ]
    );
  };

  const handleCreateApiKey = () => {
    Alert.alert(
      'Create API Key',
      'Enter key name and permissions:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create',
          onPress: () => {
            Alert.alert('Success', 'API key created successfully!');
          }
        }
      ]
    );
  };

  const renderOverview = () => (
    <ScrollView style={styles.overviewContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔗</Text>
          <Text style={styles.statValue}>6</Text>
          <Text style={styles.statLabel}>Endpoints</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔌</Text>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Integrations</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📊</Text>
          <Text style={styles.statValue}>245</Text>
          <Text style={styles.statLabel}>API Calls</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⚡</Text>
          <Text style={styles.statValue}>145ms</Text>
          <Text style={styles.statLabel}>Avg Response</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('endpoints')}>
            <Text style={styles.actionIcon}>🔗</Text>
            <Text style={styles.actionLabel}>Test API</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('integrations')}>
            <Text style={styles.actionIcon}>🔌</Text>
            <Text style={styles.actionLabel}>View Integrations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('webhooks')}>
            <Text style={styles.actionIcon}>🪝</Text>
            <Text style={styles.actionLabel}>Manage Webhooks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('keys')}>
            <Text style={styles.actionIcon}>🔑</Text>
            <Text style={styles.actionLabel}>API Keys</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 API Status</Text>
        <View style={styles.statusCard}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Status</Text>
            <Text style={[styles.statusValue, { color: '#22C55E' }]}>Operational</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Uptime</Text>
            <Text style={styles.statusValue}>99.9%</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Error Rate</Text>
            <Text style={styles.statusValue}>0.2%</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧪 Recent Tests</Text>
        {testResults.length > 0 ? (
          testResults.map((result) => (
            <View key={result.id} style={styles.testResult}>
              <Text style={styles.testEndpoint}>{result.endpoint}</Text>
              <Text style={[
                styles.testStatus,
                result.success ? { color: '#22C55E' } : { color: '#EF4444' }
              ]}>
                {result.success ? '✓ Success' : '✗ Failed'}
              </Text>
              <Text style={styles.testTime}>{result.responseTime}ms</Text>
              <Text style={styles.testTimestamp}>{result.timestamp}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No recent tests</Text>
        )}
      </View>
    </ScrollView>
  );

  const renderEndpoints = () => (
    <ScrollView style={styles.endpointsContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.apiConfig}>
        <Text style={styles.configTitle}>API Configuration</Text>
        <Text style={styles.configLabel}>Base URL:</Text>
        <Text style={styles.configValue}>{API_CONFIG.baseUrl}</Text>
        <Text style={styles.configLabel}>Version:</Text>
        <Text style={styles.configValue}>{API_CONFIG.version}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔗 Available Endpoints</Text>
        {endpoints.map((endpoint) => (
          <View key={endpoint.key} style={styles.endpointCard}>
            <View style={styles.endpointHeader}>
              <Text style={styles.endpointMethod}>{endpoint.method}</Text>
              <Text style={styles.endpointPath}>{endpoint.path}</Text>
              <TouchableOpacity
                style={styles.testBtn}
                onPress={() => handleTestEndpoint(endpoint.key)}
              >
                <Text style={styles.testBtnText}>Test</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.endpointDescription}>{endpoint.description}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderIntegrations = () => (
    <ScrollView style={styles.integrationsContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔌 Active Integrations</Text>
        {INTEGRATION_DATA.activeIntegrations.map((integration) => (
          <View key={integration.id} style={styles.integrationCard}>
            <View style={styles.integrationHeader}>
              <Text style={styles.integrationName}>{integration.name}</Text>
              <View style={[
                styles.statusBadge,
                integration.status === 'active' ? styles.activeBadge : styles.inactiveBadge
              ]}>
                <Text style={[
                  styles.statusText,
                  integration.status === 'active' ? styles.activeText : styles.inactiveText
                ]}>
                  {integration.status}
                </Text>
              </View>
            </View>
            <Text style={styles.integrationType}>Type: {integration.type}</Text>
            <Text style={styles.integrationKey}>Key: {integration.apiKey}</Text>
            <Text style={styles.integrationDate}>Created: {integration.created}</Text>
            <Text style={styles.integrationActivity}>Last activity: {integration.lastActivity}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderWebhooks = () => (
    <ScrollView style={styles.webhooksContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🪝 Webhooks</Text>
          <TouchableOpacity style={styles.addBtn} onPress={handleCreateWebhook}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.webhookEvents}>
          <Text style={styles.eventsTitle}>Available Events:</Text>
          {WEBHOOK_EVENTS.map((event) => (
            <Text key={event} style={styles.eventItem}>• {event}</Text>
          ))}
        </View>

        <Text style={styles.logsTitle}>Delivery Logs:</Text>
        {INTEGRATION_DATA.webhookLogs.map((log) => (
          <View key={log.id} style={styles.webhookLog}>
            <View style={styles.logHeader}>
              <Text style={styles.logEvent}>{log.event}</Text>
              <Text style={[
                styles.logStatus,
                log.status === 'delivered' ? { color: '#22C55E' } : { color: '#EF4444' }
              ]}>
                {log.status}
              </Text>
            </View>
            <Text style={styles.logUrl}>{log.url}</Text>
            <Text style={styles.logDetails}>
              Attempts: {log.attempts} • Response: {log.responseTime}
            </Text>
            <Text style={styles.logTimestamp}>{log.timestamp}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderUsage = () => (
    <ScrollView style={styles.usageContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 API Usage</Text>
        
        <View style={styles.usageStats}>
          <View style={styles.usageStat}>
            <Text style={styles.usageLabel}>Current Requests</Text>
            <Text style={styles.usageValue}>{INTEGRATION_DATA.apiUsage.current.requests}</Text>
          </View>
          <View style={styles.usageStat}>
            <Text style={styles.usageLabel}>Bandwidth Used</Text>
            <Text style={styles.usageValue}>{INTEGRATION_DATA.apiUsage.current.bandwidth}</Text>
          </View>
          <View style={styles.usageStat}>
            <Text style={styles.usageLabel}>Errors</Text>
            <Text style={styles.usageValue}>{INTEGRATION_DATA.apiUsage.current.errors}</Text>
          </View>
        </View>

        <Text style={styles.limitsTitle}>Rate Limits:</Text>
        <View style={styles.limitsGrid}>
          <View style={styles.limitItem}>
            <Text style={styles.limitValue}>{INTEGRATION_DATA.apiUsage.limits.requestsPerMinute}</Text>
            <Text style={styles.limitLabel}>per minute</Text>
          </View>
          <View style={styles.limitItem}>
            <Text style={styles.limitValue}>{INTEGRATION_DATA.apiUsage.limits.requestsPerHour}</Text>
            <Text style={styles.limitLabel}>per hour</Text>
          </View>
          <View style={styles.limitItem}>
            <Text style={styles.limitValue}>{INTEGRATION_DATA.apiUsage.limits.requestsPerDay}</Text>
            <Text style={styles.limitLabel}>per day</Text>
          </View>
        </View>

        <Text style={styles.historyTitle}>Usage History:</Text>
        {INTEGRATION_DATA.apiUsage.history.map((day, index) => (
          <View key={index} style={styles.historyItem}>
            <Text style={styles.historyDate}>{day.date}</Text>
            <Text style={styles.historyRequests}>{day.requests} requests</Text>
            <Text style={styles.historyBandwidth}>{day.bandwidth}</Text>
            <Text style={styles.historyErrors}>{day.errors} errors</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderKeys = () => (
    <ScrollView style={styles.keysContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔑 API Keys</Text>
          <TouchableOpacity style={styles.addBtn} onPress={handleCreateApiKey}>
            <Text style={styles.addBtnText}>+ Create</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.keyCard}>
          <Text style={styles.keyTitle}>Development Key</Text>
          <Text style={styles.keyValue}>{API_KEYS.development}</Text>
          <Text style={styles.keyStatus}>Status: Active</Text>
        </View>

        <View style={styles.keyCard}>
          <Text style={styles.keyTitle}>Staging Key</Text>
          <Text style={styles.keyValue}>{API_KEYS.staging}</Text>
          <Text style={styles.keyStatus}>Status: Active</Text>
        </View>

        <View style={styles.keyCard}>
          <Text style={styles.keyTitle}>Production Key</Text>
          <Text style={styles.keyValue}>{API_KEYS.production}</Text>
          <Text style={styles.keyStatus}>Status: Active</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'endpoints':
        return renderEndpoints();
      case 'integrations':
        return renderIntegrations();
      case 'webhooks':
        return renderWebhooks();
      case 'usage':
        return renderUsage();
      case 'keys':
        return renderKeys();
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>🔌 API Dashboard</Text>
      
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

  overviewContainer: {
    flex: 1,
    padding: 16,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },

  statCard: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    minWidth: width / 2 - 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },

  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },

  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  actionCard: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    minWidth: width / 2 - 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },

  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },

  actionLabel: {
    fontSize: 12,
    color: '#1A1A2E',
    textAlign: 'center',
  },

  statusCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },

  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  statusLabel: {
    fontSize: 14,
    color: '#6B7280',
  },

  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  testResult: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },

  testEndpoint: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A2E',
    flex: 1,
  },

  testStatus: {
    fontSize: 11,
    fontWeight: '600',
    marginHorizontal: 8,
  },

  testTime: {
    fontSize: 11,
    color: '#6B7280',
    marginHorizontal: 8,
  },

  testTimestamp: {
    fontSize: 10,
    color: '#9CA3AF',
  },

  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 20,
  },

  endpointsContainer: {
    flex: 1,
    padding: 16,
  },

  apiConfig: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },

  configTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  configLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  configValue: {
    fontSize: 14,
    color: '#1A1A2E',
    fontFamily: 'monospace',
    marginBottom: 8,
  },

  endpointCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  endpointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  endpointMethod: {
    backgroundColor: '#1D0A69',
    color: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: '600',
    marginRight: 8,
  },

  endpointPath: {
    fontSize: 12,
    color: '#1A1A2E',
    fontFamily: 'monospace',
    flex: 1,
  },

  testBtn: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },

  testBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },

  endpointDescription: {
    fontSize: 12,
    color: '#6B7280',
  },

  integrationsContainer: {
    flex: 1,
    padding: 16,
  },

  integrationCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  integrationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  integrationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  activeBadge: {
    backgroundColor: '#F0FDF4',
  },

  inactiveBadge: {
    backgroundColor: '#FEF2F2',
  },

  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },

  activeText: {
    color: '#22C55E',
  },

  inactiveText: {
    color: '#EF4444',
  },

  integrationType: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  integrationKey: {
    fontSize: 11,
    color: '#1A1A2E',
    fontFamily: 'monospace',
    marginBottom: 4,
  },

  integrationDate: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },

  integrationActivity: {
    fontSize: 11,
    color: '#6B7280',
  },

  webhooksContainer: {
    flex: 1,
    padding: 16,
  },

  addBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  webhookEvents: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },

  eventsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  eventItem: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  logsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  webhookLog: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },

  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  logEvent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  logStatus: {
    fontSize: 11,
    fontWeight: '600',
  },

  logUrl: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },

  logDetails: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 2,
  },

  logTimestamp: {
    fontSize: 10,
    color: '#9CA3AF',
  },

  usageContainer: {
    flex: 1,
    padding: 16,
  },

  usageStats: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },

  usageStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  usageLabel: {
    fontSize: 14,
    color: '#6B7280',
  },

  usageValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  limitsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  limitsGrid: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    elevation: 2,
  },

  limitItem: {
    alignItems: 'center',
  },

  limitValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 4,
  },

  limitLabel: {
    fontSize: 11,
    color: '#6B7280',
  },

  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  historyItem: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },

  historyDate: {
    fontSize: 12,
    color: '#1A1A2E',
    flex: 1,
  },

  historyRequests: {
    fontSize: 12,
    color: '#1D0A69',
    fontWeight: '600',
  },

  historyBandwidth: {
    fontSize: 11,
    color: '#6B7280',
  },

  historyErrors: {
    fontSize: 11,
    color: '#EF4444',
  },

  keysContainer: {
    flex: 1,
    padding: 16,
  },

  keyCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  keyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  keyValue: {
    fontSize: 12,
    color: '#1D0A69',
    fontFamily: 'monospace',
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },

  keyStatus: {
    fontSize: 12,
    color: '#6B7280',
  },
});
