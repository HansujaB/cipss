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
  Switch,
} from 'react-native';
import {
  getSupportedLanguages,
  getCurrentLanguage,
  setCurrentLanguage,
  getTranslation,
  translate,
  getLanguageInfo,
  isRTLLanguage,
  getLocalizationSettings,
  updateLocalizationSettings,
  detectDeviceLanguage,
  setLanguageByDetection,
  formatDate,
  formatTime,
  formatNumber,
  formatCurrency,
  getMissingTranslations,
  addTranslation,
  updateTranslation,
  removeTranslation,
  exportTranslations,
  importTranslations,
  getLocalizationAnalytics,
  getLanguageProgress,
  validateTranslations,
  useTranslation,
} from '../services/localizationService';

export default function LocalizationScreen() {
  const [activeTab, setActiveTab] = useState('languages');
  const [supportedLanguages, setSupportedLanguages] = useState(getSupportedLanguages());
  const [currentLanguage, setCurrentLanguageState] = useState(getCurrentLanguage());
  const [settings, setSettings] = useState(getLocalizationSettings());
  const [analytics, setAnalytics] = useState(getLocalizationAnalytics());
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [translationModalVisible, setTranslationModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [missingTranslations, setMissingTranslations] = useState([]);
  
  const { t, language, isRTL, changeLanguage } = useTranslation();

  const tabs = [
    { key: 'languages', label: 'Languages', icon: '🌍' },
    { key: 'translations', label: 'Translations', icon: '📝' },
    { key: 'preview', label: 'Preview', icon: '👁️' },
    { key: 'analytics', label: 'Analytics', icon: '📊' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  useEffect(() => {
    // Refresh data periodically
    const interval = setInterval(() => {
      setSupportedLanguages(getSupportedLanguages());
      setCurrentLanguageState(getCurrentLanguage());
      setSettings(getLocalizationSettings());
      setAnalytics(getLocalizationAnalytics());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLanguageChange = (languageCode) => {
    const result = setCurrentLanguage(languageCode);
    if (result.success) {
      setCurrentLanguageState(languageCode);
      Alert.alert('Success', `Language changed to ${result.language.name}`);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleAutoDetectLanguage = () => {
    const result = setLanguageByDetection();
    if (result.success) {
      setCurrentLanguageState(getCurrentLanguage());
      Alert.alert('Success', 'Language automatically detected and set');
    } else {
      Alert.alert('Info', result.message);
    }
  };

  const handleViewLanguageDetails = (language) => {
    setSelectedLanguage(language);
    setLanguageModalVisible(true);
  };

  const handleUpdateSetting = (key, value) => {
    const result = updateLocalizationSettings({ [key]: value });
    if (result.success) {
      setSettings(getLocalizationSettings());
    }
  };

  const handleValidateTranslations = (languageCode) => {
    const result = validateTranslations(languageCode);
    
    if (result.valid) {
      Alert.alert('Validation Result', 'All translations are valid!');
    } else {
      Alert.alert(
        'Validation Issues Found',
        `Found ${result.issues.length} issues:\n\n${result.issues.slice(0, 5).join('\n')}${result.issues.length > 5 ? '\n...' : ''}`
      );
    }
  };

  const handleExportTranslations = (languageCode) => {
    const result = exportTranslations(languageCode);
    if (result.success) {
      Alert.alert('Export Successful', `Exported ${Object.keys(result.data.translations).length} translations`);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const renderLanguageItem = ({ item }) => {
    const isCurrent = item.code === currentLanguage;
    const progress = getLanguageProgress(item.code);
    
    return (
      <TouchableOpacity
        style={[
          styles.languageCard,
          isCurrent && styles.currentLanguageCard,
          isRTL && styles.rtlCard
        ]}
        onPress={() => handleLanguageChange(item.code)}
      >
        <View style={styles.languageHeader}>
          <View style={styles.languageInfo}>
            <Text style={styles.languageFlag}>{item.flag}</Text>
            <View style={styles.languageDetails}>
              <Text style={[
                styles.languageName,
                isCurrent && styles.currentLanguageName
              ]}>
                {item.nativeName}
              </Text>
              <Text style={styles.languageEnglishName}>{item.name}</Text>
            </View>
          </View>
          <View style={styles.languageStatus}>
            {isCurrent && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Current</Text>
              </View>
            )}
            <Text style={[
              styles.progressText,
              isRTL && styles.rtlText
            ]}>
              {progress}%
            </Text>
          </View>
        </View>
        
        <View style={styles.languageMeta}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress}%` }
                ]}
              />
            </View>
          </View>
          
          <View style={styles.languageActions}>
            <TouchableOpacity
              style={styles.detailsBtn}
              onPress={() => handleViewLanguageDetails(item)}
            >
              <Text style={styles.detailsBtnText}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.validateBtn}
              onPress={() => handleValidateTranslations(item.code)}
            >
              <Text style={styles.validateBtnText}>Validate</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {item.rtl && (
          <View style={styles.rtlIndicator}>
            <Text style={styles.rtlIndicatorText}>RTL</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderTranslationItem = ({ item }) => (
    <View style={[styles.translationItem, isRTL && styles.rtlItem]}>
      <View style={styles.translationKey}>
        <Text style={styles.keyText}>{item}</Text>
      </View>
      <View style={styles.translationValue}>
        <Text style={styles.valueText}>{getTranslation(item)}</Text>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'languages':
        return (
          <View style={styles.languagesContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('languages', {}, 'en')}</Text>
              <TouchableOpacity
                style={styles.autoDetectBtn}
                onPress={handleAutoDetectLanguage}
              >
                <Text style={styles.autoDetectBtnText}>Auto Detect</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={supportedLanguages}
              keyExtractor={(item) => item.code}
              renderItem={renderLanguageItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );

      case 'translations':
        return (
          <View style={styles.translationsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('translations', {}, 'en')}</Text>
              <Text style={styles.currentLanguageText}>
                {getLanguageInfo(currentLanguage)?.name}
              </Text>
            </View>
            
            <View style={styles.translationStats}>
              <Text style={styles.statsText}>
                Total: {Object.keys(getTranslation('', currentLanguage) || {}).length} keys
              </Text>
              <Text style={styles.statsText}>
                Missing: {getMissingTranslations(currentLanguage).length} keys
              </Text>
            </View>
            
            <FlatList
              data={getMissingTranslations(currentLanguage).slice(0, 20)}
              keyExtractor={(item) => item}
              renderItem={renderTranslationItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>All translations complete!</Text>
                </View>
              }
            />
          </View>
        );

      case 'preview':
        return (
          <ScrollView style={styles.previewContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.previewCard}>
              <Text style={styles.previewTitle}>Localization Preview</Text>
              <Text style={styles.previewSubtitle}>Current Language: {getLanguageInfo(currentLanguage)?.name}</Text>
              
              <View style={styles.previewSection}>
                <Text style={styles.previewSectionTitle}>Common Phrases</Text>
                <View style={styles.previewItem}>
                  <Text style={styles.previewLabel}>Welcome:</Text>
                  <Text style={styles.previewValue}>{t('welcome')}</Text>
                </View>
                <View style={styles.previewItem}>
                  <Text style={styles.previewLabel}>Dashboard:</Text>
                  <Text style={styles.previewValue}>{t('dashboard')}</Text>
                </View>
                <View style={styles.previewItem}>
                  <Text style={styles.previewLabel}>Campaigns:</Text>
                  <Text style={styles.previewValue}>{t('campaigns')}</Text>
                </View>
                <View style={styles.previewItem}>
                  <Text style={styles.previewLabel}>Leaderboard:</Text>
                  <Text style={styles.previewValue}>{t('leaderboard')}</Text>
                </View>
                <View style={styles.previewItem}>
                  <Text style={styles.previewLabel}>Achievements:</Text>
                  <Text style={styles.previewValue}>{t('achievements')}</Text>
                </View>
              </View>
              
              <View style={styles.previewSection}>
                <Text style={styles.previewSectionTitle}>Date & Time Formatting</Text>
                <View style={styles.previewItem}>
                  <Text style={styles.previewLabel}>Date:</Text>
                  <Text style={styles.previewValue}>{formatDate(new Date())}</Text>
                </View>
                <View style={styles.previewItem}>
                  <Text style={styles.previewLabel}>Time:</Text>
                  <Text style={styles.previewValue}>{formatTime(new Date())}</Text>
                </View>
              </View>
              
              <View style={styles.previewSection}>
                <Text style={styles.previewSectionTitle}>Number Formatting</Text>
                <View style={styles.previewItem}>
                  <Text style={styles.previewLabel}>Number:</Text>
                  <Text style={styles.previewValue}>{formatNumber(1234567.89)}</Text>
                </View>
                <View style={styles.previewItem}>
                  <Text style={styles.previewLabel}>Currency:</Text>
                  <Text style={styles.previewValue}>{formatCurrency(1234.56)}</Text>
                </View>
              </View>
              
              <View style={styles.previewSection}>
                <Text style={styles.previewSectionTitle}>Text Direction</Text>
                <Text style={styles.directionText}>
                  This text should appear {isRTL ? 'right-to-left' : 'left-to-right'}
                </Text>
              </View>
            </View>
          </ScrollView>
        );

      case 'analytics':
        return (
          <ScrollView style={styles.analyticsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>📊 Localization Analytics</Text>
              
              <View style={styles.analyticsGrid}>
                <View style={styles.analyticsItem}>
                  <Text style={styles.analyticsValue}>{analytics.languageChanges}</Text>
                  <Text style={styles.analyticsLabel}>Language Changes</Text>
                </View>
                <View style={styles.analyticsItem}>
                  <Text style={styles.analyticsValue}>{analytics.translationRequests}</Text>
                  <Text style={styles.analyticsLabel}>Translation Requests</Text>
                </View>
                <View style={styles.analyticsItem}>
                  <Text style={styles.analyticsValue}>{analytics.missingTranslations}</Text>
                  <Text style={styles.analyticsLabel}>Missing Translations</Text>
                </View>
                <View style={styles.analyticsItem}>
                  <Text style={styles.analyticsValue}>{supportedLanguages.length}</Text>
                  <Text style={styles.analyticsLabel}>Supported Languages</Text>
                </View>
              </View>
              
              <View style={styles.languageDistributionSection}>
                <Text style={styles.distributionTitle}>Language Distribution</Text>
                {Object.entries(analytics.languageDistribution).map(([code, percentage]) => {
                  const lang = getLanguageInfo(code);
                  return (
                    <View key={code} style={styles.distributionItem}>
                      <Text style={styles.distributionFlag}>{lang?.flag || '🌍'}</Text>
                      <Text style={styles.distributionName}>{lang?.name || code}</Text>
                      <View style={styles.distributionBar}>
                        <View
                          style={[
                            styles.distributionFill,
                            { width: `${percentage}%` }
                          ]}
                        />
                      </View>
                      <Text style={styles.distributionPercentage}>{percentage}%</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        );

      case 'settings':
        return (
          <ScrollView style={styles.settingsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>⚙️ Localization Settings</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Save Language Preference</Text>
                  <Text style={styles.settingDescription">Remember user's language choice</Text>
                </View>
                <Switch
                  value={settings.saveLanguagePreference}
                  onValueChange={(value) => handleUpdateSetting('saveLanguagePreference', value)}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Use Device Language</Text>
                  <Text style={styles.settingDescription">Auto-detect device language</Text>
                </View>
                <Switch
                  value={settings.useDeviceLanguage}
                  onValueChange={(value) => handleUpdateSetting('useDeviceLanguage', value)}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Show Language Switcher</Text>
                  <Text style={styles.settingDescription">Display language selection UI</Text>
                </View>
                <Switch
                  value={settings.showLanguageSwitcher}
                  onValueChange={(value) => handleUpdateSetting('showLanguageSwitcher', value)}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Enable RTL Support</Text>
                  <Text style={styles.settingDescription">Right-to-left text direction</Text>
                </View>
                <Switch
                  value={settings.enableRTL}
                  onValueChange={(value) => handleUpdateSetting('enableRTL', value)}
                />
              </View>
              
              <View style={styles.settingSection}>
                <Text style={styles.settingSectionTitle}>Date Format</Text>
                <View style={styles.formatOptions}>
                  {['auto', 'us', 'eu', 'iso'].map((format) => (
                    <TouchableOpacity
                      key={format}
                      style={[
                        styles.formatBtn,
                        settings.dateFormat === format && styles.formatBtnActive
                      ]}
                      onPress={() => handleUpdateSetting('dateFormat', format)}
                    >
                      <Text style={[
                        styles.formatBtnText,
                        settings.dateFormat === format && styles.formatBtnTextActive
                      ]}>
                        {format.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.settingSection}>
                <Text style={styles.settingSectionTitle}>Time Format</Text>
                <View style={styles.formatOptions}>
                  {['auto', '12h', '24h'].map((format) => (
                    <TouchableOpacity
                      key={format}
                      style={[
                        styles.formatBtn,
                        settings.timeFormat === format && styles.formatBtnActive
                      ]}
                      onPress={() => handleUpdateSetting('timeFormat', format)}
                    >
                      <Text style={[
                        styles.formatBtnText,
                        settings.timeFormat === format && styles.formatBtnTextActive
                      ]}>
                        {format.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.settingSection}>
                <Text style={styles.settingSectionTitle}>Currency</Text>
                <View style={styles.currencyOptions}>
                  {['USD', 'EUR', 'GBP', 'JPY', 'INR'].map((currency) => (
                    <TouchableOpacity
                      key={currency}
                      style={[
                        styles.currencyBtn,
                        settings.currency === currency && styles.currencyBtnActive
                      ]}
                      onPress={() => handleUpdateSetting('currency', currency)}
                    >
                      <Text style={[
                        styles.currencyBtnText,
                        settings.currency === currency && styles.currencyBtnTextActive
                      ]}>
                        {currency}
                      </Text>
                    </TouchableOpacity>
                  ))}
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
      <Text style={styles.title}>🌍 Localization</Text>
      
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
      
      {/* Language Details Modal */}
      <Modal
        visible={languageModalVisible}
        animationType="slide"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
              <Text style={styles.modalCloseBtn}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Language Details</Text>
            <View style={styles.placeholder} />
          </View>
          
          {selectedLanguage && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.languageDetailHeader}>
                <Text style={styles.languageDetailFlag}>{selectedLanguage.flag}</Text>
                <View style={styles.languageDetailInfo}>
                  <Text style={styles.languageDetailName}>{selectedLanguage.nativeName}</Text>
                  <Text style={styles.languageDetailEnglishName}>{selectedLanguage.name}</Text>
                  <Text style={styles.languageDetailCode}>Code: {selectedLanguage.code}</Text>
                </View>
              </View>
              
              <View style={styles.languageDetailStats}>
                <View style={styles.detailStatItem}>
                  <Text style={styles.detailStatValue}>{selectedLanguage.completion}%</Text>
                  <Text style={styles.detailStatLabel">Completion</Text>
                </View>
                <View style={styles.detailStatItem}>
                  <Text style={styles.detailStatValue">{selectedLanguage.rtl ? 'Yes' : 'No'}</Text>
                  <Text style={styles.detailStatLabel">RTL Support</Text>
                </View>
              </View>
              
              <View style={styles.languageDetailActions}>
                <TouchableOpacity
                  style={[
                    styles.modalActionBtn,
                    selectedLanguage.code === currentLanguage && styles.modalActionBtnDisabled
                  ]}
                  onPress={() => {
                    handleLanguageChange(selectedLanguage.code);
                    setLanguageModalVisible(false);
                  }}
                  disabled={selectedLanguage.code === currentLanguage}
                >
                  <Text style={styles.modalActionBtnText}>
                    {selectedLanguage.code === currentLanguage ? 'Current Language' : 'Set as Current'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.modalActionBtn}
                  onPress={() => {
                    handleExportTranslations(selectedLanguage.code);
                    setLanguageModalVisible(false);
                  }}
                >
                  <Text style={styles.modalActionBtnText}>Export Translations</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.modalActionBtn}
                  onPress={() => {
                    handleValidateTranslations(selectedLanguage.code);
                    setLanguageModalVisible(false);
                  }}
                >
                  <Text style={styles.modalActionBtnText}>Validate Translations</Text>
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

  currentLanguageText: {
    fontSize: 14,
    color: '#6B7280',
  },

  autoDetectBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  autoDetectBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  listContainer: {
    padding: 16,
  },

  languagesContainer: {
    flex: 1,
  },

  languageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#E5E7EB',
  },

  currentLanguageCard: {
    borderLeftColor: '#1D0A69',
    backgroundColor: '#EFF6FF',
  },

  rtlCard: {
    borderLeftWidth: 0,
    borderRightWidth: 4,
    borderRightColor: '#E5E7EB',
  },

  languageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  languageFlag: {
    fontSize: 32,
    marginRight: 12,
  },

  languageDetails: {
    flex: 1,
  },

  languageName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  currentLanguageName: {
    color: '#1D0A69',
  },

  languageEnglishName: {
    fontSize: 14,
    color: '#6B7280',
  },

  languageStatus: {
    alignItems: 'flex-end',
  },

  currentBadge: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },

  currentBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },

  progressText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  rtlText: {
    textAlign: 'right',
  },

  languageMeta: {
    gap: 12,
  },

  progressContainer: {
    marginBottom: 8,
  },

  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#1D0A69',
    borderRadius: 4,
  },

  languageActions: {
    flexDirection: 'row',
    gap: 8,
  },

  detailsBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },

  detailsBtnText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
  },

  validateBtn: {
    flex: 1,
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },

  validateBtnText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '600',
  },

  rtlIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  rtlIndicatorText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },

  translationsContainer: {
    flex: 1,
  },

  translationStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  statsText: {
    fontSize: 14,
    color: '#374151',
  },

  translationItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
  },

  rtlItem: {
    flexDirection: 'row-reverse',
  },

  translationKey: {
    flex: 1,
    marginRight: 12,
  },

  keyText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'monospace',
  },

  translationValue: {
    flex: 2,
  },

  valueText: {
    fontSize: 14,
    color: '#1A1A2E',
  },

  previewContainer: {
    flex: 1,
    padding: 16,
  },

  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },

  previewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  previewSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },

  previewSection: {
    marginBottom: 24,
  },

  previewSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  previewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  previewLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  previewValue: {
    fontSize: 14,
    color: '#1A1A2E',
  },

  directionText: {
    fontSize: 16,
    color: '#1A1A2E',
    textAlign: isRTL ? 'right' : 'left',
  },

  analyticsContainer: {
    flex: 1,
    padding: 16,
  },

  analyticsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },

  analyticsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 20,
  },

  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  analyticsItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  analyticsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 4,
  },

  analyticsLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },

  languageDistributionSection: {
    marginTop: 20,
  },

  distributionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  distributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  distributionFlag: {
    fontSize: 16,
    marginRight: 8,
  },

  distributionName: {
    fontSize: 14,
    color: '#374151',
    width: 80,
  },

  distributionBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginHorizontal: 8,
  },

  distributionFill: {
    height: '100%',
    backgroundColor: '#1D0A69',
    borderRadius: 4,
  },

  distributionPercentage: {
    fontSize: 12,
    color: '#6B7280',
    width: 40,
    textAlign: 'right',
  },

  settingsContainer: {
    flex: 1,
    padding: 16,
  },

  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },

  settingsTitle: {
    fontSize: 20,
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

  settingSection: {
    marginTop: 20,
  },

  settingSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  formatOptions: {
    flexDirection: 'row',
    gap: 8,
  },

  formatBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  formatBtnActive: {
    backgroundColor: '#1D0A69',
  },

  formatBtnText: {
    fontSize: 12,
    color: '#6B7280',
  },

  formatBtnTextActive: {
    color: '#FFFFFF',
  },

  currencyOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  currencyBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  currencyBtnActive: {
    backgroundColor: '#1D0A69',
  },

  currencyBtnText: {
    fontSize: 12,
    color: '#6B7280',
  },

  currencyBtnTextActive: {
    color: '#FFFFFF',
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

  languageDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  languageDetailFlag: {
    fontSize: 48,
    marginRight: 16,
  },

  languageDetailInfo: {
    flex: 1,
  },

  languageDetailName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  languageDetailEnglishName: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 2,
  },

  languageDetailCode: {
    fontSize: 14,
    color: '#9CA3AF',
  },

  languageDetailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },

  detailStatItem: {
    alignItems: 'center',
  },

  detailStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 4,
  },

  detailStatLabel: {
    fontSize: 12,
    color: '#6B7280',
  },

  languageDetailActions: {
    gap: 12,
  },

  modalActionBtn: {
    backgroundColor: '#1D0A69',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  modalActionBtnDisabled: {
    backgroundColor: '#D1D5DB',
  },

  modalActionBtnText: {
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
});
