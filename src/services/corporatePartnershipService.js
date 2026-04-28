// Corporate partnership portal service
export const CORPORATE_PARTNERSHIP_DATA = {
  partners: [
    {
      id: 'partner_1',
      companyName: 'TechCorp Solutions',
      industry: 'Technology',
      logo: '💻',
      description: 'Leading technology company committed to social impact through digital literacy programs',
      website: 'https://techcorp.com',
      founded: 2010,
      employees: 5000,
      revenue: '$2.5B',
      headquarters: 'San Francisco, CA',
      contact: {
        email: 'partnerships@techcorp.com',
        phone: '+1-555-0123',
        address: '123 Tech Street, San Francisco, CA 94105',
      },
      partnershipLevel: 'platinum',
      joinedDate: '2023-01-15T00:00:00Z',
      status: 'active',
      impactMetrics: {
        totalDonations: 500000,
        volunteerHours: 2500,
        campaignsSupported: 15,
        employeesEngaged: 450,
        communitiesReached: 25,
      },
      programs: [
        {
          id: 'prog_1',
          name: 'Digital Literacy Initiative',
          description: 'Teaching digital skills to underserved communities',
          budget: 100000,
          participants: 500,
          startDate: '2023-03-01T00:00:00Z',
          endDate: '2024-03-01T00:00:00Z',
          status: 'active',
        },
        {
          id: 'prog_2',
          name: 'STEM Education Support',
          description: 'Supporting STEM education in high schools',
          budget: 75000,
          participants: 300,
          startDate: '2023-06-01T00:00:00Z',
          endDate: '2024-06-01T00:00:00Z',
          status: 'active',
        },
      ],
      benefits: [
        'Brand visibility across all platforms',
        'Employee engagement opportunities',
        'Annual impact report',
        'Dedicated account manager',
        'Co-branded campaigns',
        'Tax-deductible contributions',
      ],
      requirements: [
        'Annual minimum contribution: $100,000',
        'Employee volunteer participation: 20%',
        'Quarterly impact reporting',
        'Brand alignment verification',
      ],
      documents: [
        {
          id: 'doc_1',
          name: 'Partnership Agreement',
          type: 'pdf',
          url: 'https://docs.cipss.com/partners/techcorp-agreement.pdf',
          uploadedAt: '2023-01-15T10:00:00Z',
        },
        {
          id: 'doc_2',
          name: 'Impact Report Q1 2024',
          type: 'pdf',
          url: 'https://docs.cipss.com/partners/techcorp-q1-2024.pdf',
          uploadedAt: '2024-04-01T14:30:00Z',
        },
      ],
      team: [
        {
          id: 'contact_1',
          name: 'Sarah Johnson',
          title: 'Partnership Director',
          email: 'sarah.johnson@techcorp.com',
          phone: '+1-555-0124',
          avatar: '👩‍💼',
        },
        {
          id: 'contact_2',
          name: 'Michael Chen',
          title: 'CSR Manager',
          email: 'michael.chen@techcorp.com',
          phone: '+1-555-0125',
          avatar: '👨‍💼',
        },
      ],
      testimonials: [
        {
          id: 'test_1',
          author: 'Sarah Johnson',
          title: 'Partnership Director',
          company: 'TechCorp Solutions',
          quote: 'Our partnership with CIPSS has transformed our CSR program and created meaningful impact in communities we care about.',
          rating: 5,
          date: '2024-03-15T00:00:00Z',
        },
      ],
    },
    {
      id: 'partner_2',
      companyName: 'Green Finance Bank',
      industry: 'Finance',
      logo: '🏦',
      description: 'Sustainable banking institution focused on environmental and social impact',
      website: 'https://greenfinance.com',
      founded: 2015,
      employees: 1200,
      revenue: '$800M',
      headquarters: 'New York, NY',
      partnershipLevel: 'gold',
      joinedDate: '2023-06-20T00:00:00Z',
      status: 'active',
      impactMetrics: {
        totalDonations: 250000,
        volunteerHours: 1200,
        campaignsSupported: 8,
        employeesEngaged: 180,
        communitiesReached: 12,
      },
    },
  ],
  partnershipLevels: [
    {
      id: 'platinum',
      name: 'Platinum Partner',
      minContribution: 100000,
      benefits: [
        'Premium brand placement',
        'Custom programs',
        'Executive board seat',
        'Dedicated support team',
        'Annual gala sponsorship',
        'Global recognition',
      ],
      color: '#8B5CF6',
      icon: '👑',
    },
    {
      id: 'gold',
      name: 'Gold Partner',
      minContribution: 50000,
      benefits: [
        'Featured partner status',
        'Co-branded campaigns',
        'Quarterly consultations',
        'Event sponsorships',
        'Impact reports',
      ],
      color: '#F59E0B',
      icon: '🏆',
    },
    {
      id: 'silver',
      name: 'Silver Partner',
      minContribution: 25000,
      benefits: [
        'Partner directory listing',
        'Newsletter features',
        'Volunteer opportunities',
        'Annual recognition',
      ],
      color: '#6B7280',
      icon: '🥈',
    },
    {
      id: 'bronze',
      name: 'Bronze Partner',
      minContribution: 10000,
      benefits: [
        'Basic partnership',
        'Logo placement',
        'Volunteer matching',
        'Impact updates',
      ],
      color: '#92400E',
      icon: '🥉',
    },
  ],
  opportunities: [
    {
      id: 'opp_1',
      title: 'Digital Education Initiative 2024',
      description: 'Support digital literacy programs for underserved communities',
      category: 'education',
      targetAmount: 200000,
      raisedAmount: 125000,
      deadline: '2024-12-31T23:59:59Z',
      partnerLevel: 'gold',
      impact: 'Reach 10,000 students with digital skills training',
      requirements: [
        'Annual contribution of $50,000+',
        'Employee volunteer participation',
        'Brand alignment with education',
      ],
      status: 'active',
      partners: ['partner_1'],
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'opp_2',
      title: 'Environmental Conservation Fund',
      description: 'Support environmental conservation and sustainability projects',
      category: 'environment',
      targetAmount: 150000,
      raisedAmount: 75000,
      deadline: '2024-09-30T23:59:59Z',
      partnerLevel: 'silver',
      impact: 'Fund 20 conservation projects globally',
      requirements: [
        'Contribution of $25,000+',
        'Environmental commitment',
        'Sustainability practices',
      ],
      status: 'active',
      partners: ['partner_2'],
      createdAt: '2024-02-15T00:00:00Z',
    },
  ],
  applications: [
    {
      id: 'app_1',
      companyName: 'Startup Innovations Inc',
      industry: 'Technology',
      contactPerson: 'Alex Rivera',
      email: 'alex@startupinnovations.com',
      phone: '+1-555-0147',
      website: 'https://startupinnovations.com',
      employees: 150,
      revenue: '$25M',
      partnershipLevel: 'silver',
      motivation: 'We want to give back to the community that supported our growth',
      proposedContribution: 30000,
      interests: ['education', 'technology', 'innovation'],
      status: 'pending',
      submittedAt: '2024-04-18T10:30:00Z',
      reviewedAt: null,
      reviewedBy: null,
      notes: 'Promising startup in EdTech space',
    },
  ],
  resources: [
    {
      id: 'res_1',
      title: 'Partnership Prospectus 2024',
      type: 'pdf',
      description: 'Comprehensive guide to partnership opportunities and benefits',
      url: 'https://resources.cipss.com/partnership-prospectus-2024.pdf',
      size: '5.2 MB',
      category: 'information',
      restricted: false,
    },
    {
      id: 'res_2',
      title: 'Impact Measurement Framework',
      type: 'pdf',
      description: 'How we measure and report partnership impact',
      url: 'https://resources.cipss.com/impact-framework.pdf',
      size: '2.8 MB',
      category: 'guidelines',
      restricted: true,
    },
    {
      id: 'res_3',
      title: 'Partner Onboarding Guide',
      type: 'doc',
      description: 'Step-by-step guide for new partners',
      url: 'https://resources.cipss.com/onboarding-guide.doc',
      size: '1.5 MB',
      category: 'guidelines',
      restricted: true,
    },
  ],
  analytics: {
    totalPartners: 24,
    activePartners: 18,
    totalRevenue: 1250000,
    averagePartnershipValue: 52083,
    partnerRetention: 0.85,
    newPartnersThisYear: 6,
    partnershipLevels: {
      platinum: 3,
      gold: 8,
      silver: 9,
      bronze: 4,
    },
    industries: {
      technology: 8,
      finance: 6,
      healthcare: 4,
      retail: 3,
      manufacturing: 3,
    },
    growth: {
      revenue: 0.23,
      partners: 0.15,
      engagement: 0.31,
    },
  },
  settings: {
    applications: {
      autoReview: false,
      notifyTeam: true,
      responseTime: 48, // hours
    },
    partnerships: {
      minContractLength: 12, // months
      autoRenew: false,
      reportingFrequency: 'quarterly',
    },
    communications: {
      newsletterFrequency: 'monthly',
      impactReports: true,
      partnerSpotlights: true,
    },
  },
};

export const getPartners = (filters = {}) => {
  let partners = CORPORATE_PARTNERSHIP_DATA.partners;
  
  if (filters.industry) {
    partners = partners.filter(partner => partner.industry === filters.industry);
  }
  
  if (filters.level) {
    partners = partners.filter(partner => partner.partnershipLevel === filters.level);
  }
  
  if (filters.status) {
    partners = partners.filter(partner => partner.status === filters.status);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    partners = partners.filter(partner => 
      partner.companyName.toLowerCase().includes(searchLower) ||
      partner.description.toLowerCase().includes(searchLower)
    );
  }
  
  return partners.sort((a, b) => {
    const levelOrder = { platinum: 4, gold: 3, silver: 2, bronze: 1 };
    return levelOrder[b.partnershipLevel] - levelOrder[a.partnershipLevel];
  });
};

export const getPartnerById = (id) => {
  return CORPORATE_PARTNERSHIP_DATA.partners.find(partner => partner.id === id);
};

export const createPartner = (partnerData) => {
  const newPartner = {
    id: `partner_${Date.now()}`,
    ...partnerData,
    joinedDate: new Date().toISOString(),
    status: 'pending',
    impactMetrics: {
      totalDonations: 0,
      volunteerHours: 0,
      campaignsSupported: 0,
      employeesEngaged: 0,
      communitiesReached: 0,
    },
    programs: [],
    documents: [],
    team: [],
    testimonials: [],
  };
  
  CORPORATE_PARTNERSHIP_DATA.partners.push(newPartner);
  
  return { success: true, partner: newPartner };
};

export const updatePartner = (id, updates) => {
  const partnerIndex = CORPORATE_PARTNERSHIP_DATA.partners.findIndex(partner => partner.id === id);
  
  if (partnerIndex === -1) {
    return { success: false, message: 'Partner not found' };
  }
  
  CORPORATE_PARTNERSHIP_DATA.partners[partnerIndex] = {
    ...CORPORATE_PARTNERSHIP_DATA.partners[partnerIndex],
    ...updates,
  };
  
  return { success: true, partner: CORPORATE_PARTNERSHIP_DATA.partners[partnerIndex] };
};

export const deletePartner = (id) => {
  const partnerIndex = CORPORATE_PARTNERSHIP_DATA.partners.findIndex(partner => partner.id === id);
  
  if (partnerIndex === -1) {
    return { success: false, message: 'Partner not found' };
  }
  
  CORPORATE_PARTNERSHIP_DATA.partners.splice(partnerIndex, 1);
  
  return { success: true };
};

export const getPartnershipLevels = () => {
  return CORPORATE_PARTNERSHIP_DATA.partnershipLevels;
};

export const getPartnershipLevelById = (id) => {
  return CORPORATE_PARTNERSHIP_DATA.partnershipLevels.find(level => level.id === id);
};

export const getOpportunities = (filters = {}) => {
  let opportunities = CORPORATE_PARTNERSHIP_DATA.opportunities;
  
  if (filters.category) {
    opportunities = opportunities.filter(opp => opp.category === filters.category);
  }
  
  if (filters.level) {
    opportunities = opportunities.filter(opp => opp.partnerLevel === filters.level);
  }
  
  if (filters.status) {
    opportunities = opportunities.filter(opp => opp.status === filters.status);
  }
  
  return opportunities.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
};

export const getOpportunityById = (id) => {
  return CORPORATE_PARTNERSHIP_DATA.opportunities.find(opp => opp.id === id);
};

export const createOpportunity = (opportunityData) => {
  const newOpportunity = {
    id: `opp_${Date.now()}`,
    ...opportunityData,
    raisedAmount: 0,
    partners: [],
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  
  CORPORATE_PARTNERSHIP_DATA.opportunities.push(newOpportunity);
  
  return { success: true, opportunity: newOpportunity };
};

export const getApplications = (filters = {}) => {
  let applications = CORPORATE_PARTNERSHIP_DATA.applications;
  
  if (filters.status) {
    applications = applications.filter(app => app.status === filters.status);
  }
  
  return applications.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
};

export const getApplicationById = (id) => {
  return CORPORATE_PARTNERSHIP_DATA.applications.find(app => app.id === id);
};

export const createApplication = (applicationData) => {
  const newApplication = {
    id: `app_${Date.now()}`,
    ...applicationData,
    status: 'pending',
    submittedAt: new Date().toISOString(),
    reviewedAt: null,
    reviewedBy: null,
    notes: '',
  };
  
  CORPORATE_PARTNERSHIP_DATA.applications.push(newApplication);
  
  return { success: true, application: newApplication };
};

export const updateApplication = (id, updates) => {
  const appIndex = CORPORATE_PARTNERSHIP_DATA.applications.findIndex(app => app.id === id);
  
  if (appIndex === -1) {
    return { success: false, message: 'Application not found' };
  }
  
  CORPORATE_PARTNERSHIP_DATA.applications[appIndex] = {
    ...CORPORATE_PARTNERSHIP_DATA.applications[appIndex],
    ...updates,
  };
  
  return { success: true, application: CORPORATE_PARTNERSHIP_DATA.applications[appIndex] };
};

export const approveApplication = (id, reviewerId, notes = '') => {
  const application = getApplicationById(id);
  
  if (!application) {
    return { success: false, message: 'Application not found' };
  }
  
  // Create partner from approved application
  const partnerData = {
    companyName: application.companyName,
    industry: application.industry,
    description: `Partnership application approved: ${application.motivation}`,
    website: application.website,
    employees: application.employees,
    revenue: application.revenue,
    partnershipLevel: application.partnershipLevel,
    contact: {
      email: application.email,
      phone: application.phone,
    },
  };
  
  const partnerResult = createPartner(partnerData);
  
  if (partnerResult.success) {
    updateApplication(id, {
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewedBy: reviewerId,
      notes,
    });
    
    return { success: true, partner: partnerResult.partner };
  }
  
  return { success: false, message: 'Failed to create partner' };
};

export const rejectApplication = (id, reviewerId, reason) => {
  return updateApplication(id, {
    status: 'rejected',
    reviewedAt: new Date().toISOString(),
    reviewedBy: reviewerId,
    notes: reason,
  });
};

export const getResources = (restricted = false) => {
  let resources = CORPORATE_PARTNERSHIP_DATA.resources;
  
  if (!restricted) {
    resources = resources.filter(resource => !resource.restricted);
  }
  
  return resources;
};

export const getResourceById = (id) => {
  return CORPORATE_PARTNERSHIP_DATA.resources.find(resource => resource.id === id);
};

export const addResource = (resourceData) => {
  const newResource = {
    id: `res_${Date.now()}`,
    ...resourceData,
  };
  
  CORPORATE_PARTNERSHIP_DATA.resources.push(newResource);
  
  return { success: true, resource: newResource };
};

export const getPartnershipAnalytics = () => {
  return CORPORATE_PARTNERSHIP_DATA.analytics;
};

export const updatePartnershipAnalytics = () => {
  const partners = CORPORATE_PARTNERSHIP_DATA.partners;
  const applications = CORPORATE_PARTNERSHIP_DATA.applications;
  
  CORPORATE_PARTNERSHIP_DATA.analytics = {
    totalPartners: partners.length,
    activePartners: partners.filter(p => p.status === 'active').length,
    totalRevenue: partners.reduce((sum, p) => sum + (p.impactMetrics?.totalDonations || 0), 0),
    averagePartnershipValue: partners.length > 0 ? 
      partners.reduce((sum, p) => sum + (p.impactMetrics?.totalDonations || 0), 0) / partners.length : 0,
    partnerRetention: 0.85,
    newPartnersThisYear: partners.filter(p => 
      new Date(p.joinedDate).getFullYear() === new Date().getFullYear()
    ).length,
    partnershipLevels: {
      platinum: partners.filter(p => p.partnershipLevel === 'platinum').length,
      gold: partners.filter(p => p.partnershipLevel === 'gold').length,
      silver: partners.filter(p => p.partnershipLevel === 'silver').length,
      bronze: partners.filter(p => p.partnershipLevel === 'bronze').length,
    },
    industries: {
      technology: partners.filter(p => p.industry === 'Technology').length,
      finance: partners.filter(p => p.industry === 'Finance').length,
      healthcare: partners.filter(p => p.industry === 'Healthcare').length,
      retail: partners.filter(p => p.industry === 'Retail').length,
      manufacturing: partners.filter(p => p.industry === 'Manufacturing').length,
    },
    growth: {
      revenue: 0.23,
      partners: 0.15,
      engagement: 0.31,
    },
  };
  
  return CORPORATE_PARTNERSHIP_DATA.analytics;
};

export const getPartnershipSettings = () => {
  return CORPORATE_PARTNERSHIP_DATA.settings;
};

export const updatePartnershipSettings = (updates) => {
  CORPORATE_PARTNERSHIP_DATA.settings = { ...CORPORATE_PARTNERSHIP_DATA.settings, ...updates };
  return { success: true, settings: CORPORATE_PARTNERSHIP_DATA.settings };
};

export const generatePartnershipReport = (partnerId, period = 'year') => {
  const partner = getPartnerById(partnerId);
  
  if (!partner) {
    return { success: false, message: 'Partner not found' };
  }
  
  const report = {
    partnerId,
    partnerName: partner.companyName,
    period,
    generatedAt: new Date().toISOString(),
    metrics: partner.impactMetrics,
    programs: partner.programs,
    testimonials: partner.testimonials,
    nextSteps: [
      'Schedule quarterly review meeting',
      'Update impact measurement strategy',
      'Explore new collaboration opportunities',
    ],
  };
  
  return { success: true, report };
};

export const calculatePartnershipImpact = (partnerId) => {
  const partner = getPartnerById(partnerId);
  
  if (!partner) {
    return { success: false, message: 'Partner not found' };
  }
  
  const impact = {
    totalDonations: partner.impactMetrics.totalDonations,
    volunteerHours: partner.impactMetrics.volunteerHours,
    campaignsSupported: partner.impactMetrics.campaignsSupported,
    employeesEngaged: partner.impactMetrics.employeesEngaged,
    communitiesReached: partner.impactMetrics.communitiesReached,
    monetaryValue: partner.impactMetrics.volunteerHours * 25 + partner.impactMetrics.totalDonations, // $25/hour volunteer value
    socialImpact: {
      education: partner.programs.filter(p => p.category === 'education').length,
      environment: partner.programs.filter(p => p.category === 'environment').length,
      health: partner.programs.filter(p => p.category === 'health').length,
    },
  };
  
  return { success: true, impact };
};
