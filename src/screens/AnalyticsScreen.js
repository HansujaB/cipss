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
  Dimensions,
} from 'react-native';
import {
  getOverviewStats,
  getUserAnalytics,
  getCampaignAnalytics,
  getFinancialAnalytics,
  getPredictiveAnalytics,
  getRealTimeAnalytics,
  getReports,
  getAnalyticsSettings,
  updateAnalyticsSettings,
  generateCustomReport,
  scheduleReport,
  exportAnalytics,
  getPredictiveInsights,
  getPerformanceMetrics,
  getSystemAlerts,
  acknowledgeAlert,
  getGrowthMetrics,
  getComparativeAnalytics,
  getFunnelAnalytics,
  getCohortAnalysis,
  getSegmentAnalytics,
} from '../services/analyticsService';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const [activeTab, setActiveTab] = useState('overview');
  const [overview, setOverview] = useState(getOverviewStats());
  const [userAnalytics, setUserAnalytics] = useState(getUserAnalytics());
  const [campaignAnalytics, setCampaignAnalytics] = useState(getCampaignAnalytics());
  const [financialAnalytics, setFinancialAnalytics] = useState(getFinancialAnalytics());
  const [predictiveAnalytics, setPredictiveAnalytics] = useState(getPredictiveAnalytics());
  const [realTimeAnalytics, setRealTimeAnalytics] = useState(getRealTimeAnalytics());
  const [reports, setReports] = useState(getReports());
  const [settings, setSettings] = useState(getAnalyticsSettings());
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [insightsModalVisible, setInsightsModalVisible] = useState(false);

  const tabs = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'users', label: 'Users', icon: '👥' },
    { key: 'campaigns', label: 'Campaigns', icon: '🎯' },
    { key: 'financial', label: 'Financial', icon: '💰' },
    { key: 'predictive', label: 'Predictive', icon: '🔮' },
    { key: 'reports', label: 'Reports', icon: '📋' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  useEffect(() => {
    // Refresh real-time data
    const interval = setInterval(() => {
      setRealTimeAnalytics(getRealTimeAnalytics());
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleExportData = (format, dateRange) => {
    const result = exportAnalytics(format, dateRange);
    if (result.success) {
      Alert.alert('Export Successful', `Data exported in ${format.toUpperCase()} format`);
      setExportModalVisible(false);
    }
  };

  const handleScheduleReport = (reportConfig) => {
    const result = scheduleReport(reportConfig);
    if (result.success) {
      Alert.alert('Report Scheduled', `${reportConfig.name} scheduled successfully`);
      setReports(getReports());
    }
  };

  const handleAcknowledgeAlert = (alertId) => {
    acknowledgeAlert(alertId);
    setRealTimeAnalytics(getRealTimeAnalytics());
  };

  const handleUpdateSetting = (category, key, value) => {
    updateAnalyticsSettings(category, { [key]: value });
    setSettings(getAnalyticsSettings());
  };

  const renderOverviewCard = ({ item }) => (
    <View style={styles.overviewCard}>
      <Text style={styles.overviewLabel}>{item.label}</Text>
      <Text style={styles.overviewValue}>{item.value}</Text>
      <Text style={[
        styles.overviewChange,
        item.change > 0 ? styles.positiveChange : styles.negativeChange
      ]}>
        {item.change > 0 ? '+' : ''}{item.change}%
      </Text>
    </View>
  );

  const renderUserDemographicItem = ({ item }) => (
    <View style={styles.demographicItem}>
      <Text style={styles.demographicLabel}>{item.label}</Text>
      <View style={styles.demographicBar}>
        <View
          style={[
            styles.demographicFill,
            { width: `${item.percentage}%` }
          ]}
        />
      </View>
      <Text style={styles.demographicValue}>{item.value}</Text>
    </View>
  );

  const renderAlertItem = ({ item }) => (
    <View style={[
      styles.alertItem,
      item.severity === 'high' && styles.highAlert,
      item.severity === 'medium' && styles.mediumAlert,
      item.severity === 'low' && styles.lowAlert
    ]}>
      <View style={styles.alertContent}>
        <Text style={styles.alertType}>{item.type}</Text>
        <Text style={styles.alertMessage}>{item.message}</Text>
        <Text style={styles.alertTime}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.acknowledgeBtn}
        onPress={() => handleAcknowledgeAlert(item.id)}
      >
        <Text style={styles.acknowledgeBtnText}>Acknowledge</Text>
      </TouchableOpacity>
    </View>
  );

  const renderReportItem = ({ item }) => (
    <TouchableOpacity
      style={styles.reportItem}
      onPress={() => {
        setSelectedReport(item);
        setReportModalVisible(true);
      }}
    >
      <View style={styles.reportHeader}>
        <Text style={styles.reportName}>{item.name}</Text>
        <Text style={styles.reportFrequency}>{item.frequency}</Text>
      </View>
      <Text style={styles.reportDescription}>{item.description || 'Scheduled report'}</Text>
      <View style={styles.reportFooter}>
        <Text style={styles.reportNextRun}>
          Next: {new Date(item.nextRun).toLocaleDateString()}
        </Text>
        <View style={[
          styles.reportStatus,
          item.enabled ? styles.enabledStatus : styles.disabledStatus
        ]}>
          <Text style={[
            styles.statusText,
            item.enabled ? styles.enabledText : styles.disabledText
          ]}>
            {item.enabled ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <ScrollView style={styles.overviewContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📊 Platform Overview</Text>
              <Text style={styles.lastUpdated}>Last updated: {new Date().toLocaleTimeString()}</Text>
            </View>
            
            <View style={styles.overviewGrid}>
              {[
                { label: 'Total Users', value: overview.totalUsers.toLocaleString(), change: 8.4 },
                { label: 'Active Users', value: overview.activeUsers.toLocaleString(), change: 12.3 },
                { label: 'Campaigns', value: overview.totalCampaigns.toLocaleString(), change: 15.6 },
                { label: 'Hours Volunteered', value: (overview.totalHours / 1000).toFixed(1) + 'K', change: 9.2 },
                { label: 'Impact Score', value: (overview.totalImpact / 1000000).toFixed(1) + 'M', change: 18.7 },
                { label: 'Retention Rate', value: (overview.retentionRate * 100).toFixed(1) + '%', change: 5.1 },
              ].map((item, index) => (
                <View key={index} style={styles.overviewCard}>
                  <Text style={styles.overviewLabel}>{item.label}</Text>
                  <Text style={styles.overviewValue}>{item.value}</Text>
                  <Text style={[
                    styles.overviewChange,
                    item.change > 0 ? styles.positiveChange : styles.negativeChange
                  ]}>
                    {item.change > 0 ? '+' : ''}{item.change}%
                  </Text>
                </View>
              ))}
            </View>
            
            <View style={styles.realTimeSection}>
              <Text style={styles.sectionTitle}>🔴 Real-Time Metrics</Text>
              <View style={styles.realTimeGrid}>
                <View style={styles.realTimeCard}>
                  <Text style={styles.realTimeLabel}>Online Users</Text>
                  <Text style={styles.realTimeValue}>{realTimeAnalytics.currentStats.onlineUsers.toLocaleString()}</Text>
                </View>
                <View style={styles.realTimeCard}>
                  <Text style={styles.realTimeLabel}>Active Campaigns</Text>
                  <Text style={styles.realTimeValue}>{realTimeAnalytics.currentStats.activeCampaigns}</Text>
                </View>
                <View style={styles.realTimeCard}>
                  <Text style={styles.realTimeLabel}>Server Load</Text>
                  <Text style={styles.realTimeValue}>{(realTimeAnalytics.currentStats.serverLoad * 100).toFixed(1)}%</Text>
                </View>
                <View style={styles.realTimeCard}>
                  <Text style={styles.realTimeLabel}>Response Time</Text>
                  <Text style={styles.realTimeValue}>{realTimeAnalytics.currentStats.responseTime}ms</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.alertsSection}>
              <Text style={styles.sectionTitle}>⚠️ System Alerts</Text>
              <FlatList
                data={realTimeAnalytics.alerts}
                keyExtractor={(item, index) => `alert_${index}`}
                renderItem={renderAlertItem}
                scrollEnabled={false}
              />
            </View>
          </ScrollView>
        );

      case 'users':
        return (
          <ScrollView style={styles.usersContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>👥 User Analytics</Text>
              <TouchableOpacity
                style={styles.exportBtn}
                onPress={() => setExportModalVisible(true)}
              >
                <Text style={styles.exportBtnText}>Export</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.demographicsSection}>
              <Text style={styles.subsectionTitle}>Age Distribution</Text>
              {Object.entries(userAnalytics.demographics.ageGroups).map(([key, value], index) => (
                <View key={key} style={styles.demographicItem}>
                  <Text style={styles.demographicLabel}>{key}</Text>
                  <View style={styles.demographicBar}>
                    <View
                      style={[
                        styles.demographicFill,
                        { width: `${(value / overview.totalUsers) * 100}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.demographicValue}>{value.toLocaleString()}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.engagementSection}>
              <Text style={styles.subsectionTitle}>Feature Usage</Text>
              {Object.entries(userAnalytics.engagement.featureUsage).map(([key, value], index) => (
                <View key={key} style={styles.engagementItem}>
                  <Text style={styles.engagementLabel}>{key}</Text>
                  <Text style={styles.engagementValue}>{value.toLocaleString()}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.retentionSection}>
              <Text style={styles.subsectionTitle}>Weekly Retention</Text>
              {userAnalytics.behavior.weeklyRetention.map((item, index) => (
                <View key={index} style={styles.retentionItem}>
                  <Text style={styles.retentionLabel}>{item.week}</Text>
                  <View style={styles.retentionBar}>
                    <View
                      style={[
                        styles.retentionFill,
                        { width: `${item.rate * 100}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.retentionValue}>{(item.rate * 100).toFixed(1)}%</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        );

      case 'campaigns':
        return (
          <ScrollView style={styles.campaignsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🎯 Campaign Analytics</Text>
              <TouchableOpacity
                style={styles.insightsBtn}
                onPress={() => setInsightsModalVisible(true)}
              >
                <Text style={styles.insightsBtnText}>AI Insights</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.campaignStatsSection}>
              <View style={styles.campaignStatCard}>
                <Text style={styles.campaignStatLabel}>Total Campaigns</Text>
                <Text style={styles.campaignStatValue}>{campaignAnalytics.performance.totalCampaigns}</Text>
              </View>
              <View style={styles.campaignStatCard}>
                <Text style={styles.campaignStatLabel}>Active Campaigns</Text>
                <Text style={styles.campaignStatValue}>{campaignAnalytics.performance.activeCampaigns}</Text>
              </View>
              <View style={styles.campaignStatCard}>
                <Text style={styles.campaignStatLabel}>Success Rate</Text>
                <Text style={styles.campaignStatValue}>{(campaignAnalytics.performance.successRate * 100).toFixed(1)}%</Text>
              </View>
              <View style={styles.campaignStatCard}>
                <Text style={styles.campaignStatLabel}>>Avg Participants</Text>
                <Text style={styles.campaignStatValue}>{campaignAnalytics.performance.averageParticipants}</Text>
              </View>
            </View>
            
            <View style={styles.categoriesSection}>
              <Text style={styles.subsectionTitle}>Campaign Categories</Text>
              {Object.entries(campaignAnalytics.categories).map(([key, value], index) => (
                <View key={key} style={styles.categoryItem}>
                  <Text style={styles.categoryLabel}>{key}</Text>
                  <View style={styles.categoryBar}>
                    <View
                      style={[
                        styles.categoryFill,
                        { width: `${(value / campaignAnalytics.performance.totalCampaigns) * 100}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.categoryValue}>{value}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.impactSection}>
              <Text style={styles.subsectionTitle}>Impact Metrics</Text>
              <View style={styles.impactCard}>
                <Text style={styles.impactLabel}>Total Hours</Text>
                <Text style={styles.impactValue}>{campaignAnalytics.impactMetrics.totalHours.toLocaleString()}</Text>
              </View>
              <View style={styles.impactCard}>
                <Text style={styles.impactLabel}>>Total Beneficiaries</Text>
                <Text style={styles.impactValue}>{campaignAnalytics.impactMetrics.totalBeneficiaries.toLocaleString()}</Text>
              </View>
            </View>
          </ScrollView>
        );

      case 'financial':
        return (
          <ScrollView style={styles.financialContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>💰 Financial Analytics</Text>
              <TouchableOpacity
                style={styles.exportBtn}
                onPress={() => setExportModalVisible(true)}
              >
                <Text style={styles.exportBtnText}>Export</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.revenueSection}>
              <Text style={styles.subsectionTitle}>Revenue Overview</Text>
              <View style={styles.revenueCard}>
                <Text style={styles.revenueLabel}>Total Revenue</Text>
                <Text style={styles.revenueValue}>${(financialAnalytics.revenue.totalRevenue / 1000000).toFixed(1)}M</Text>
              </View>
              
              <Text style={styles.subsectionTitle}>Revenue Streams</Text>
              {Object.entries(financialAnalytics.revenue.revenueStreams).map(([key, value], index) => (
                <View key={key} style={styles.revenueStreamItem}>
                  <Text style={styles.revenueStreamLabel}>{key}</Text>
                  <Text style={styles.revenueStreamValue}>${(value / 1000000).toFixed(1)}M</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.profitabilitySection}>
              <Text style={styles.subsectionTitle}>Profitability Metrics</Text>
              <View style={styles.profitabilityCard}>
                <Text style={styles.profitabilityLabel}>Gross Margin</Text>
                <Text style={styles.profitabilityValue}>{(financialAnalytics.profitability.grossMargin * 100).toFixed(1)}%</Text>
              </View>
              <View style={styles.profitabilityCard}>
                <Text style={styles.profitabilityLabel}>>Net Margin</Text>
                <Text style={styles.profitabilityValue}>{(financialAnalytics.profitability.netMargin * 100).toFixed(1)}%</Text>
              </View>
              <View style={styles.profitabilityCard}>
                <Text style={styles.profitabilityLabel}>>ROI</Text>
                <Text style={styles.profitabilityValue}>{(financialAnalytics.profitability.roi * 100).toFixed(1)}%</Text>
              </View>
            </View>
          </ScrollView>
        );

      case 'predictive':
        return (
          <ScrollView style={styles.predictiveContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔮 Predictive Analytics</Text>
              <TouchableOpacity
                style={styles.insightsBtn}
                onPress={() => setInsightsModalVisible(true)}
              >
                <Text style={styles.insightsBtnText}>AI Insights</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.churnSection}>
              <Text style={styles.subsectionTitle}>User Churn Prediction</Text>
              <View style={styles.churnCard}>
                <Text style={styles.churnLabel}>Current Risk</Text>
                <Text style={styles.churnValue}>{(predictiveAnalytics.userChurn.currentRisk * 100).toFixed(1)}%</Text>
                <Text style={styles.churnPrediction}>>{predictiveAnalytics.userChurn.predictedChurn} users at risk</Text>
              </View>
              
              <Text style={styles.subsectionTitle}>Risk Factors</Text>
              {predictiveAnalytics.userChurn.riskFactors.map((factor, index) => (
                <View key={index} style={styles.riskFactorItem}>
                  <Text style={styles.riskFactorLabel}>{factor.factor}</Text>
                  <View style={styles.riskFactorBar}>
                    <View
                      style={[
                        styles.riskFactorFill,
                        { width: `${factor.weight * 100}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.riskFactorValue}>{(factor.weight * 100).toFixed(0)}%</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.growthSection}>
              <Text style={styles.subsectionTitle}>Growth Forecast</Text>
              <View style={styles.forecastCard}>
                <Text style={styles.forecastLabel}>Next Month Users</Text>
                <Text style={styles.forecastValue}>{predictiveAnalytics.growthForecast.nextMonthUsers.toLocaleString()}</Text>
              </View>
              <View style={styles.forecastCard}>
                <Text style={styles.forecastLabel}>>Next Quarter Revenue</Text>
                <Text style={styles.forecastValue}>${(predictiveAnalytics.growthForecast.nextQuarterRevenue / 1000000).toFixed(1)}M</Text>
              </View>
              <View style={styles.forecastCard}>
                <Text style={styles.forecastLabel}>>Yearly Growth Rate</Text>
                <Text style={styles.forecastValue}>{(predictiveAnalytics.growthForecast.yearlyGrowthRate * 100).toFixed(1)}%</Text>
              </View>
            </View>
          </ScrollView>
        );

      case 'reports':
        return (
          <View style={styles.reportsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📋 Reports</Text>
              <TouchableOpacity
                style={styles.createReportBtn}
                onPress={() => {
                  const reportConfig = {
                    name: 'Custom Analytics Report',
                    description: 'Custom generated report',
                    recipients: ['admin@cipss.com'],
                    frequency: 'weekly',
                  };
                  handleScheduleReport(reportConfig);
                }}
              >
                <Text style={styles.createReportBtnText}>Create Report</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.reportsSection}>
              <Text style={styles.subsectionTitle}>Scheduled Reports</Text>
              <FlatList
                data={reports.scheduledReports}
                keyExtractor={(item) => item.id}
                renderItem={renderReportItem}
                contentContainerStyle={styles.reportsList}
                showsVerticalScrollIndicator={false}
              />
            </View>
            
            <View style={styles.reportsSection}>
              <Text style={styles.subsectionTitle}>Custom Reports</Text>
              <FlatList
                data={reports.customReports}
                keyExtractor={(item) => item.id}
                renderItem={renderReportItem}
                contentContainerStyle={styles.reportsList}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        );

      case 'settings':
        return (
          <ScrollView style={styles.settingsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>⚙️ Analytics Settings</Text>
              
              <View style={styles.settingSection}>
                <Text style={styles.settingSectionTitle}>Dashboard Settings</Text>
                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>>Refresh Interval</Text>
                  <Text style={styles.settingValue}>>{settings.dashboard.refreshInterval}s</Text>
                </View>
                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>>Default Time Range</Text>
                  <Text style={styles.settingValue}>>{settings.dashboard.defaultTimeRange}</Text>
                </View>
                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>>Real-time Data</Text>
                  <Text style={styles.settingValue}>>{settings.dashboard.showRealTimeData ? 'Enabled' : 'Disabled'}</Text>
                </View>
              </View>
              
              <View style={styles.settingSection}>
                <Text style={styles.settingSectionTitle}>Alert Settings</Text>
                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>>Email Alerts</Text>
                  <Text style={styles.settingValue}>>{settings.alerts.enableEmailAlerts ? 'Enabled' : 'Disabled'}</Text>
                </View>
                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>>Server Load Threshold</Text>
                  <Text style={styles.settingValue}>>{(settings.alerts.alertThresholds.serverLoad * 100).toFixed(0)}%</Text>
                </View>
              </View>
              
              <View style={styles.settingSection}>
                <Text style={styles.settingSectionTitle}>Export Settings</Text>
                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>>CSV Export</Text>
                  <Text style={styles.settingValue}>>{settings.exports.enableCsvExport ? 'Enabled' : 'Disabled'}</Text>
                </View>
                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>>PDF Export</Text>
                  <Text style={styles.settingValue}>>{settings.exports.enablePdfExport ? 'Enabled' : 'Disabled'}</Text>
                </View>
                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>>Default Format</Text>
                  <Text style={styles.settingValue}>>{settings.exports.defaultFormat.toUpperCase()}</Text>
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
      <Text style={styles.title}>📊 Analytics Dashboard</Text>
      
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
      
      {/* Export Modal */}
      <Modal
        visible={exportModalVisible}
        animationType="slide"
        onRequestClose={() => setExportModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setExportModalVisible(false)}>
              <Text style={styles.modalCloseBtn}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Export Analytics</Text>
            <View style={styles.placeholder} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.exportOptions}>
              <Text style={styles.exportSectionTitle}>Select Format</Text>
              {['csv', 'pdf', 'json'].map((format) => (
                <TouchableOpacity
                  key={format}
                  style={styles.exportOption}
                  onPress={() => handleExportData(format, '30d')}
                >
                  <Text style={styles.exportOptionText}>{format.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.exportOptions}>
              <Text style={styles.exportSectionTitle}>Select Date Range</Text>
              {['7d', '30d', '90d', '1y'].map((range) => (
                <TouchableOpacity
                  key={range}
                  style={styles.exportOption}
                  onPress={() => handleExportData('csv', range)}
                >
                  <Text style={styles.exportOptionText}>
                    {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : range === '90d' ? 'Last 90 Days' : 'Last Year'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
      
      {/* AI Insights Modal */}
      <Modal
        visible={insightsModalVisible}
        animationType="slide"
        onRequestClose={() => setInsightsModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setInsightsModalVisible(false)}>
              <Text style={styles.modalCloseBtn}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>🤖 AI Insights</Text>
            <View style={styles.placeholder} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            {getPredictiveInsights().map((insight, index) => (
              <View key={index} style={styles.insightCard}>
                <View style={styles.insightHeader}>
                  <Text style={styles.insightType}>{insight.type}</Text>
                  <Text style={styles.insightConfidence}>
                    {(insight.confidence * 100).toFixed(0)}% confidence
                  </Text>
                </View>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightDescription}>{insight.description}</Text>
                <Text style={styles.insightImpact}>Potential Impact: {insight.potentialImpact}</Text>
                <Text style={styles.insightAction}>Recommended: {insight.recommendedAction}</Text>
              </View>
            ))}
          </ScrollView>
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

  lastUpdated: {
    fontSize: 12,
    color: '#6B7280',
  },

  exportBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  exportBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  insightsBtn: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  insightsBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  overviewContainer: {
    flex: 1,
  },

  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  overviewCard: {
    width: (width - 48) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },

  overviewLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  overviewValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  overviewChange: {
    fontSize: 12,
    fontWeight: '600',
  },

  positiveChange: {
    color: '#22C55E',
  },

  negativeChange: {
    color: '#EF4444',
  },

  realTimeSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  realTimeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  realTimeCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },

  realTimeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  realTimeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  alertsSection: {
    paddingHorizontal: 16,
  },

  alertItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },

  highAlert: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },

  mediumAlert: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },

  lowAlert: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },

  alertContent: {
    flex: 1,
  },

  alertType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 2,
  },

  alertMessage: {
    fontSize: 14,
    color: '#1A1A2E',
    marginBottom: 2,
  },

  alertTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  acknowledgeBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  acknowledgeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  usersContainer: {
    flex: 1,
  },

  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 12,
    paddingHorizontal: 16,
  },

  demographicsSection: {
    marginBottom: 24,
  },

  demographicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  demographicLabel: {
    width: 80,
    fontSize: 14,
    color: '#374151',
  },

  demographicBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginHorizontal: 12,
  },

  demographicFill: {
    height: '100%',
    backgroundColor: '#1D0A69',
    borderRadius: 4,
  },

  demographicValue: {
    width: 50,
    fontSize: 14,
    color: '#1A1A2E',
    textAlign: 'right',
  },

  engagementSection: {
    marginBottom: 24,
  },

  engagementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 4,
  },

  engagementLabel: {
    fontSize: 14,
    color: '#374151',
  },

  engagementValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  retentionSection: {
    marginBottom: 24,
  },

  retentionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  retentionLabel: {
    width: 50,
    fontSize: 14,
    color: '#374151',
  },

  retentionBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginHorizontal: 12,
  },

  retentionFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 4,
  },

  retentionValue: {
    width: 50,
    fontSize: 14,
    color: '#1A1A2E',
    textAlign: 'right',
  },

  campaignsContainer: {
    flex: 1,
  },

  campaignStatsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },

  campaignStatCard: {
    width: (width - 64) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },

  campaignStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  campaignStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  categoriesSection: {
    marginBottom: 24,
  },

  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  categoryLabel: {
    width: 100,
    fontSize: 14,
    color: '#374151',
  },

  categoryBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginHorizontal: 12,
  },

  categoryFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },

  categoryValue: {
    width: 40,
    fontSize: 14,
    color: '#1A1A2E',
    textAlign: 'right',
  },

  impactSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  impactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },

  impactLabel: {
    fontSize: 14,
    color: '#6B7280',
  },

  impactValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  financialContainer: {
    flex: 1,
  },

  revenueSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },

  revenueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
  },

  revenueLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },

  revenueValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#22C55E',
  },

  revenueStreamItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    elevation: 1,
  },

  revenueStreamLabel: {
    fontSize: 14,
    color: '#374151',
  },

  revenueStreamValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  profitabilitySection: {
    paddingHorizontal: 16,
  },

  profitabilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },

  profitabilityLabel: {
    fontSize: 14,
    color: '#6B7280',
  },

  profitabilityValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  predictiveContainer: {
    flex: 1,
  },

  churnSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },

  churnCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
  },

  churnLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },

  churnValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 4,
  },

  churnPrediction: {
    fontSize: 14,
    color: '#374151',
  },

  riskFactorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  riskFactorLabel: {
    width: 120,
    fontSize: 14,
    color: '#374151',
  },

  riskFactorBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginHorizontal: 12,
  },

  riskFactorFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },

  riskFactorValue: {
    width: 40,
    fontSize: 14,
    color: '#1A1A2E',
    textAlign: 'right',
  },

  growthSection: {
    paddingHorizontal: 16,
  },

  forecastCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },

  forecastLabel: {
    fontSize: 14,
    color: '#6B7280',
  },

  forecastValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22C55E',
  },

  reportsContainer: {
    flex: 1,
  },

  createReportBtn: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  createReportBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  reportsSection: {
    marginBottom: 20,
  },

  reportsList: {
    paddingHorizontal: 16,
  },

  reportItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },

  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  reportName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  reportFrequency: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  reportDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },

  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  reportNextRun: {
    fontSize: 12,
    color: '#6B7280',
  },

  reportStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  enabledStatus: {
    backgroundColor: '#D1FAE5',
  },

  disabledStatus: {
    backgroundColor: '#FEE2E2',
  },

  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },

  enabledText: {
    color: '#065F46',
  },

  disabledText: {
    color: '#991B1B',
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

  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  settingLabel: {
    fontSize: 14,
    color: '#374151',
  },

  settingValue: {
    fontSize: 14,
    color: '#1A1A2E',
    fontWeight: '500',
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

  exportOptions: {
    marginBottom: 24,
  },

  exportSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  exportOption: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
  },

  exportOptionText: {
    fontSize: 16,
    color: '#1A1A2E',
    fontWeight: '500',
  },

  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },

  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  insightType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  insightConfidence: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
  },

  insightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  insightDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },

  insightImpact: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '500',
    marginBottom: 4,
  },

  insightAction: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
});
