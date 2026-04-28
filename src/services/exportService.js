// Export reports and certificates service
export const EXPORT_DATA = {
  reportTemplates: [
    {
      id: 'template_1',
      name: 'Volunteer Impact Report',
      description: 'Comprehensive report of volunteer activities and impact',
      type: 'individual',
      sections: ['overview', 'campaigns', 'skills', 'achievements', 'testimonials'],
      format: 'pdf',
      customizable: true,
      branding: true,
    },
    {
      id: 'template_2',
      name: 'Team Performance Report',
      description: 'Detailed team performance and collaboration metrics',
      type: 'team',
      sections: ['overview', 'members', 'campaigns', 'impact', 'growth'],
      format: 'pdf',
      customizable: true,
      branding: true,
    },
    {
      id: 'template_3',
      name: 'Organization Summary',
      description: 'Executive summary for organizational stakeholders',
      type: 'organization',
      sections: ['overview', 'metrics', 'highlights', 'financial', 'future'],
      format: 'pdf',
      customizable: false,
      branding: true,
    },
    {
      id: 'template_4',
      name: 'Campaign Impact Analysis',
      description: 'In-depth analysis of campaign effectiveness',
      type: 'campaign',
      sections: ['overview', 'participation', 'outcomes', 'lessons', 'recommendations'],
      format: 'pdf',
      customizable: true,
      branding: false,
    },
  ],
  certificateTemplates: [
    {
      id: 'cert_1',
      name: 'Volunteer Excellence',
      description: 'Certificate for outstanding volunteer service',
      type: 'achievement',
      design: 'formal',
      customizable: ['name', 'date', 'achievement', 'signature'],
      preview: '🏆',
    },
    {
      id: 'cert_2',
      name: 'Team Leadership',
      description: 'Certificate recognizing team leadership excellence',
      type: 'leadership',
      design: 'modern',
      customizable: ['name', 'team', 'period', 'signature'],
      preview: '👑',
    },
    {
      id: 'cert_3',
      name: 'Campaign Completion',
      description: 'Certificate for successful campaign completion',
      type: 'campaign',
      design: 'creative',
      customizable: ['name', 'campaign', 'date', 'signature'],
      preview: '🎯',
    },
    {
      id: 'cert_4',
      name: 'Milestone Achievement',
      description: 'Certificate for reaching significant milestones',
      type: 'milestone',
      design: 'elegant',
      customizable: ['name', 'milestone', 'date', 'signature'],
      preview: '⭐',
    },
  ],
  exports: [
    {
      id: 'export_1',
      type: 'report',
      templateId: 'template_1',
      userId: 'user_current',
      title: 'Q1 2024 Volunteer Impact Report',
      generated: '2024-04-20',
      format: 'pdf',
      size: '2.4 MB',
      downloadUrl: 'https://exports.cipss.com/report_1.pdf',
      status: 'completed',
    },
    {
      id: 'export_2',
      type: 'certificate',
      templateId: 'cert_1',
      userId: 'user_current',
      title: 'Volunteer Excellence Certificate',
      generated: '2024-04-15',
      format: 'pdf',
      size: '1.2 MB',
      downloadUrl: 'https://exports.cipss.com/cert_1.pdf',
      status: 'completed',
    },
  ],
  scheduledExports: [
    {
      id: 'schedule_1',
      type: 'report',
      templateId: 'template_1',
      userId: 'user_current',
      frequency: 'monthly',
      nextRun: '2024-05-01',
      recipients: ['user@example.com', 'manager@example.com'],
      status: 'active',
    },
  ],
};

export const getReportTemplates = (type = null) => {
  let templates = EXPORT_DATA.reportTemplates;
  if (type) {
    templates = templates.filter(t => t.type === type);
  }
  return templates;
};

export const getCertificateTemplates = (type = null) => {
  let templates = EXPORT_DATA.certificateTemplates;
  if (type) {
    templates = templates.filter(t => t.type === type);
  }
  return templates;
};

export const getExports = (userId = 'user_current', type = null) => {
  let exports = EXPORT_DATA.exports.filter(e => e.userId === userId);
  if (type) {
    exports = exports.filter(e => e.type === type);
  }
  return exports.sort((a, b) => new Date(b.generated) - new Date(a.generated));
};

export const getScheduledExports = (userId = 'user_current') => {
  return EXPORT_DATA.scheduledExports.filter(e => e.userId === userId);
};

export const generateReport = (templateId, data, options = {}) => {
  const template = getReportTemplates().find(t => t.id === templateId);
  if (!template) {
    return { success: false, message: 'Template not found' };
  }

  const exportData = {
    id: `export_${Date.now()}`,
    type: 'report',
    templateId,
    userId: data.userId || 'user_current',
    title: data.title || `${template.name} - ${new Date().toLocaleDateString()}`,
    generated: new Date().toISOString().split('T')[0],
    format: options.format || template.format,
    size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
    downloadUrl: `https://exports.cipss.com/report_${Date.now()}.${options.format || template.format}`,
    status: 'processing',
  };

  EXPORT_DATA.exports.unshift(exportData);

  // Simulate processing
  setTimeout(() => {
    exportData.status = 'completed';
  }, 2000);

  return { success: true, export: exportData };
};

export const generateCertificate = (templateId, data, options = {}) => {
  const template = getCertificateTemplates().find(t => t.id === templateId);
  if (!template) {
    return { success: false, message: 'Template not found' };
  }

  const exportData = {
    id: `export_${Date.now()}`,
    type: 'certificate',
    templateId,
    userId: data.userId || 'user_current',
    title: data.title || template.name,
    generated: new Date().toISOString().split('T')[0],
    format: options.format || 'pdf',
    size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
    downloadUrl: `https://exports.cipss.com/cert_${Date.now()}.pdf`,
    status: 'processing',
    certificateData: {
      recipientName: data.recipientName || 'Volunteer',
      achievement: data.achievement || 'Outstanding Service',
      date: data.date || new Date().toLocaleDateString(),
      signature: data.signature || 'Organization Director',
      ...data.customFields,
    },
  };

  EXPORT_DATA.exports.unshift(exportData);

  // Simulate processing
  setTimeout(() => {
    exportData.status = 'completed';
  }, 1500);

  return { success: true, export: exportData };
};

export const scheduleExport = (templateId, schedule, options = {}) => {
  const template = getReportTemplates().find(t => t.id === templateId) || 
                   getCertificateTemplates().find(t => t.id === templateId);
  
  if (!template) {
    return { success: false, message: 'Template not found' };
  }

  const scheduledExport = {
    id: `schedule_${Date.now()}`,
    type: template.type === 'achievement' ? 'certificate' : 'report',
    templateId,
    userId: options.userId || 'user_current',
    frequency: schedule.frequency,
    nextRun: schedule.nextRun,
    recipients: schedule.recipients || [],
    status: 'active',
    options,
  };

  EXPORT_DATA.scheduledExports.push(scheduledExport);
  return { success: true, scheduledExport };
};

export const cancelScheduledExport = (scheduleId) => {
  const index = EXPORT_DATA.scheduledExports.findIndex(s => s.id === scheduleId);
  if (index === -1) {
    return { success: false, message: 'Scheduled export not found' };
  }

  EXPORT_DATA.scheduledExports.splice(index, 1);
  return { success: true };
};

export const deleteExport = (exportId) => {
  const index = EXPORT_DATA.exports.findIndex(e => e.id === exportId);
  if (index === -1) {
    return { success: false, message: 'Export not found' };
  }

  EXPORT_DATA.exports.splice(index, 1);
  return { success: true };
};

export const downloadExport = (exportId) => {
  const exportData = EXPORT_DATA.exports.find(e => e.id === exportId);
  if (!exportData) {
    return { success: false, message: 'Export not found' };
  }

  if (exportData.status !== 'completed') {
    return { success: false, message: 'Export not ready for download' };
  }

  return { 
    success: true, 
    downloadUrl: exportData.downloadUrl,
    filename: `${exportData.title}.${exportData.format}`
  };
};

export const getExportStats = (userId = 'user_current') => {
  const userExports = getExports(userId);
  const userScheduled = getScheduledExports(userId);
  
  const reports = userExports.filter(e => e.type === 'report');
  const certificates = userExports.filter(e => e.type === 'certificate');
  const completed = userExports.filter(e => e.status === 'completed');
  const processing = userExports.filter(e => e.status === 'processing');

  return {
    total: userExports.length,
    reports: reports.length,
    certificates: certificates.length,
    completed: completed.length,
    processing: processing.length,
    scheduled: userScheduled.length,
    totalSize: userExports.reduce((sum, e) => sum + parseFloat(e.size), 0).toFixed(1) + ' MB',
  };
};

export const getPreviewData = (templateId, type) => {
  const templates = type === 'report' ? getReportTemplates() : getCertificateTemplates();
  const template = templates.find(t => t.id === templateId);
  
  if (!template) {
    return null;
  }

  if (type === 'report') {
    return {
      title: template.name,
      sections: template.sections,
      sampleData: {
        overview: {
          totalHours: 150,
          campaigns: 8,
          impact: 'High',
          rank: 5,
        },
        campaigns: [
          { name: 'Beach Cleanup', hours: 20, date: '2024-03-15' },
          { name: 'Food Drive', hours: 15, date: '2024-03-10' },
        ],
        skills: ['Leadership', 'Communication', 'Teamwork'],
        achievements: ['Volunteer of the Month', '100 Hour Milestone'],
        testimonials: [
          'Outstanding dedication and commitment to our cause.',
          'Always goes above and beyond in every task.',
        ],
      },
    };
  } else {
    return {
      title: template.name,
      design: template.design,
      sampleData: {
        recipientName: 'John Doe',
        achievement: 'Excellence in Volunteer Service',
        date: 'April 20, 2024',
        signature: 'Sarah Johnson, Executive Director',
      },
    };
  }
};

export const shareExport = (exportId, recipients, message) => {
  const exportData = EXPORT_DATA.exports.find(e => e.id === exportId);
  if (!exportData) {
    return { success: false, message: 'Export not found' };
  }

  // Simulate sharing
  return {
    success: true,
    sharedWith: recipients,
    message: `Export "${exportData.title}" shared successfully`,
  };
};

export const getExportHistory = (userId = 'user_current', limit = 10) => {
  return getExports(userId).slice(0, limit);
};

export const bulkGenerateCertificates = (templateId, recipients, data) => {
  const results = [];
  
  recipients.forEach((recipient, index) => {
    const certificateData = {
      ...data,
      recipientName: recipient.name,
      userId: recipient.userId,
    };
    
    const result = generateCertificate(templateId, certificateData);
    results.push({
      recipient: recipient.name,
      ...result,
    });
  });
  
  return { success: true, results };
};

export const getCustomizationOptions = (templateId) => {
  const template = getReportTemplates().find(t => t.id === templateId) || 
                   getCertificateTemplates().find(t => t.id === templateId);
  
  if (!template) {
    return null;
  }

  return {
    branding: template.branding,
    customizable: template.customizable,
    formats: template.format === 'pdf' ? ['pdf', 'docx'] : ['pdf'],
    sections: template.sections || [],
    customFields: template.customizable || [],
  };
};
