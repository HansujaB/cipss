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
} from 'react-native';
import {
  EXPORT_DATA,
  getReportTemplates,
  getCertificateTemplates,
  getExports,
  getScheduledExports,
  generateReport,
  generateCertificate,
  scheduleExport,
  cancelScheduledExport,
  deleteExport,
  downloadExport,
  getExportStats,
  getPreviewData,
  shareExport,
  getCustomizationOptions,
} from '../services/exportService';

export default function ExportScreen() {
  const [activeTab, setActiveTab] = useState('reports');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const tabs = [
    { key: 'reports', label: 'Reports', icon: '📊' },
    { key: 'certificates', label: 'Certificates', icon: '🏆' },
    { key: 'scheduled', label: 'Scheduled', icon: '📅' },
    { key: 'history', label: 'History', icon: '📚' },
  ];

  const reportTemplates = getReportTemplates();
  const certificateTemplates = getCertificateTemplates();
  const userExports = getExports();
  const scheduledExports = getScheduledExports();
  const exportStats = getExportStats();

  const handleGenerateReport = (templateId) => {
    Alert.alert(
      'Generate Report',
      'Configure your report settings:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: () => {
            const result = generateReport(templateId, {
              title: 'My Volunteer Impact Report',
              userId: 'user_current',
            });
            if (result.success) {
              Alert.alert('Success', 'Report generation started! You will be notified when ready.');
            }
          }
        }
      ]
    );
  };

  const handleGenerateCertificate = (templateId) => {
    Alert.alert(
      'Generate Certificate',
      'Enter recipient details:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: () => {
            const result = generateCertificate(templateId, {
              recipientName: 'John Doe',
              achievement: 'Outstanding Volunteer Service',
              date: new Date().toLocaleDateString(),
              signature: 'Organization Director',
            });
            if (result.success) {
              Alert.alert('Success', 'Certificate generation started!');
            }
          }
        }
      ]
    );
  };

  const handleDownload = (exportId) => {
    const result = downloadExport(exportId);
    if (result.success) {
      Alert.alert('Download Started', `Downloading ${result.filename}...`);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleShare = (exportId) => {
    Alert.alert(
      'Share Export',
      'Enter recipient email:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Share',
          onPress: () => {
            const result = shareExport(exportId, ['recipient@example.com'], 'Check out this report!');
            if (result.success) {
              Alert.alert('Success', result.message);
            }
          }
        }
      ]
    );
  };

  const handleDeleteExport = (exportId) => {
    Alert.alert(
      'Delete Export',
      'Are you sure you want to delete this export?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const result = deleteExport(exportId);
            if (result.success) {
              Alert.alert('Success', 'Export deleted successfully!');
            }
          }
        }
      ]
    );
  };

  const handleScheduleExport = (templateId) => {
    Alert.alert(
      'Schedule Export',
      'Configure schedule:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Schedule',
          onPress: () => {
            const result = scheduleExport(templateId, {
              frequency: 'monthly',
              nextRun: '2024-05-01',
              recipients: ['user@example.com'],
            });
            if (result.success) {
              Alert.alert('Success', 'Export scheduled successfully!');
            }
          }
        }
      ]
    );
  };

  const handleCancelSchedule = (scheduleId) => {
    Alert.alert(
      'Cancel Schedule',
      'Are you sure you want to cancel this scheduled export?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Cancel Schedule',
          style: 'destructive',
          onPress: () => {
            const result = cancelScheduledExport(scheduleId);
            if (result.success) {
              Alert.alert('Success', 'Scheduled export cancelled!');
            }
          }
        }
      ]
    );
  };

  const renderReportTemplate = ({ item }) => (
    <View style={styles.templateCard}>
      <View style={styles.templateHeader}>
        <Text style={styles.templateName}>{item.name}</Text>
        <Text style={styles.templateType}>{item.type}</Text>
      </View>
      
      <Text style={styles.templateDescription}>{item.description}</Text>
      
      <View style={styles.templateFeatures}>
        <Text style={styles.featureItem}>📄 {item.format.toUpperCase()}</Text>
        {item.customizable && <Text style={styles.featureItem}>🎨 Customizable</Text>}
        {item.branding && <Text style={styles.featureItem}>🏷️ Branding</Text>}
      </View>
      
      <View style={styles.templateSections}>
        <Text style={styles.sectionsTitle}>Sections:</Text>
        <Text style={styles.sectionsText}>{item.sections.join(', ')}</Text>
      </View>
      
      <View style={styles.templateActions}>
        <TouchableOpacity
          style={styles.previewBtn}
          onPress={() => {
            setSelectedTemplate(item);
            setShowPreview(true);
          }}
        >
          <Text style={styles.previewBtnText}>Preview</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.generateBtn}
          onPress={() => handleGenerateReport(item.id)}
        >
          <Text style={styles.generateBtnText}>Generate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.scheduleBtn}
          onPress={() => handleScheduleExport(item.id)}
        >
          <Text style={styles.scheduleBtnText}>Schedule</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCertificateTemplate = ({ item }) => (
    <View style={styles.templateCard}>
      <View style={styles.templateHeader}>
        <Text style={styles.templateIcon}>{item.preview}</Text>
        <Text style={styles.templateName}>{item.name}</Text>
        <Text style={styles.templateType}>{item.type}</Text>
      </View>
      
      <Text style={styles.templateDescription}>{item.description}</Text>
      
      <View style={styles.templateFeatures}>
        <Text style={styles.featureItem}>🎨 {item.design} design</Text>
        <Text style={styles.featureItem}>📝 Customizable fields</Text>
      </View>
      
      <View style={styles.templateActions}>
        <TouchableOpacity
          style={styles.previewBtn}
          onPress={() => {
            setSelectedTemplate(item);
            setShowPreview(true);
          }}
        >
          <Text style={styles.previewBtnText}>Preview</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.generateBtn}
          onPress={() => handleGenerateCertificate(item.id)}
        >
          <Text style={styles.generateBtnText}>Generate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderExportItem = ({ item }) => (
    <View style={styles.exportItem}>
      <View style={styles.exportHeader}>
        <Text style={styles.exportTitle}>{item.title}</Text>
        <View style={[
          styles.statusBadge,
          item.status === 'completed' && styles.completedBadge,
          item.status === 'processing' && styles.processingBadge
        ]}>
          <Text style={[
            styles.statusText,
            item.status === 'completed' && styles.completedText,
            item.status === 'processing' && styles.processingText
          ]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.exportMeta}>
        <Text style={styles.exportDate}>Generated: {item.generated}</Text>
        <Text style={styles.exportSize}>{item.size}</Text>
        <Text style={styles.exportFormat}>{item.format.toUpperCase()}</Text>
      </View>
      
      <View style={styles.exportActions}>
        {item.status === 'completed' && (
          <>
            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={() => handleDownload(item.id)}
            >
              <Text style={styles.downloadBtnText}>📥 Download</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareBtn}
              onPress={() => handleShare(item.id)}
            >
              <Text style={styles.shareBtnText}>🔄 Share</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDeleteExport(item.id)}
        >
          <Text style={styles.deleteBtnText}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderScheduledItem = ({ item }) => (
    <View style={styles.scheduledItem}>
      <View style={styles.scheduledHeader}>
        <Text style={styles.scheduledTitle}>
          {item.type === 'report' ? '📊' : '🏆'} Scheduled {item.type}
        </Text>
        <View style={styles.activeBadge}>
          <Text style={styles.activeText}>Active</Text>
        </View>
      </View>
      
      <Text style={styles.scheduledFrequency}>Frequency: {item.frequency}</Text>
      <Text style={styles.scheduledNext}>Next run: {item.nextRun}</Text>
      <Text style={styles.scheduledRecipients}>
        Recipients: {item.recipients.join(', ')}
      </Text>
      
      <TouchableOpacity
        style={styles.cancelBtn}
        onPress={() => handleCancelSchedule(item.id)}
      >
        <Text style={styles.cancelBtnText}>Cancel Schedule</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'reports':
        return (
          <View style={styles.reportsContainer}>
            {/* Stats Card */}
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>📊 Export Statistics</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{exportStats.reports}</Text>
                  <Text style={styles.statLabel}>Reports</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{exportStats.completed}</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{exportStats.scheduled}</Text>
                  <Text style={styles.statLabel}>Scheduled</Text>
                </View>
              </View>
            </View>
            
            <FlatList
              data={reportTemplates}
              keyExtractor={(item) => item.id}
              renderItem={renderReportTemplate}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
        
      case 'certificates':
        return (
          <View style={styles.certificatesContainer}>
            <FlatList
              data={certificateTemplates}
              keyExtractor={(item) => item.id}
              renderItem={renderCertificateTemplate}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
        
      case 'scheduled':
        return (
          <View style={styles.scheduledContainer}>
            <FlatList
              data={scheduledExports}
              keyExtractor={(item) => item.id}
              renderItem={renderScheduledItem}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No scheduled exports</Text>
                </View>
              }
            />
          </View>
        );
        
      case 'history':
        return (
          <View style={styles.historyContainer}>
            <FlatList
              data={userExports}
              keyExtractor={(item) => item.id}
              renderItem={renderExportItem}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No export history</Text>
                </View>
              }
            />
          </View>
        );
        
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>📄 Export Reports & Certificates</Text>
      
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
      
      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <View style={styles.previewModal}>
          <View style={styles.previewContent}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>Preview: {selectedTemplate.name}</Text>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setShowPreview(false)}
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.previewBody}>
              <Text style={styles.previewDescription}>
                {selectedTemplate.description}
              </Text>
              
              {selectedTemplate.sections && (
                <View style={styles.previewSections}>
                  <Text style={styles.previewSectionTitle}>Sections:</Text>
                  {selectedTemplate.sections.map((section, index) => (
                    <Text key={index} style={styles.previewSectionItem}>• {section}</Text>
                  ))}
                </View>
              )}
              
              <View style={styles.previewSample}>
                <Text style={styles.previewSampleTitle}>Sample Content:</Text>
                <View style={styles.previewSampleContent}>
                  <Text style={styles.sampleText}>This is how your export will look...</Text>
                  <Text style={styles.sampleText}>Professional formatting and design</Text>
                  <Text style={styles.sampleText}>Comprehensive data visualization</Text>
                </View>
              </View>
            </ScrollView>
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

  reportsContainer: {
    flex: 1,
  },

  statsCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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

  templateCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  templateIcon: {
    fontSize: 24,
    marginRight: 12,
  },

  templateName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    flex: 1,
  },

  templateType: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  templateDescription: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 12,
  },

  templateFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },

  featureItem: {
    fontSize: 11,
    color: '#1D0A69',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  templateSections: {
    marginBottom: 16,
  },

  sectionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  sectionsText: {
    fontSize: 11,
    color: '#6B7280',
  },

  templateActions: {
    flexDirection: 'row',
    gap: 8,
  },

  previewBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },

  previewBtnText: {
    color: '#1A1A2E',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  generateBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },

  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  scheduleBtn: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },

  scheduleBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  certificatesContainer: {
    flex: 1,
  },

  scheduledContainer: {
    flex: 1,
  },

  scheduledItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  scheduledHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  scheduledTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  activeBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  activeText: {
    color: '#22C55E',
    fontSize: 11,
    fontWeight: '600',
  },

  scheduledFrequency: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  scheduledNext: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  scheduledRecipients: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },

  cancelBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  cancelBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  historyContainer: {
    flex: 1,
  },

  exportItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  exportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  exportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    flex: 1,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  completedBadge: {
    backgroundColor: '#F0FDF4',
  },

  processingBadge: {
    backgroundColor: '#FFFBEB',
  },

  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },

  completedText: {
    color: '#22C55E',
  },

  processingText: {
    color: '#F59E0B',
  },

  exportMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  exportDate: {
    fontSize: 11,
    color: '#6B7280',
  },

  exportSize: {
    fontSize: 11,
    color: '#6B7280',
  },

  exportFormat: {
    fontSize: 11,
    color: '#6B7280',
  },

  exportActions: {
    flexDirection: 'row',
    gap: 8,
  },

  downloadBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },

  downloadBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  shareBtn: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },

  shareBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  deleteBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },

  deleteBtnText: {
    color: '#EF4444',
    fontSize: 12,
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

  previewModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  previewContent: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 14,
    maxHeight: '80%',
    width: '90%',
  },

  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  closeBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeBtnText: {
    fontSize: 12,
    color: '#6B7280',
  },

  previewBody: {
    padding: 16,
  },

  previewDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 16,
  },

  previewSections: {
    marginBottom: 16,
  },

  previewSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  previewSectionItem: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  previewSample: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },

  previewSampleTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  previewSampleContent: {
    gap: 4,
  },

  sampleText: {
    fontSize: 11,
    color: '#6B7280',
  },
});
