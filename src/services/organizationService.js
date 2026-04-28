// Custom badges for organizations service
export const ORGANIZATION_DATA = {
  organizations: [
    {
      id: 'org_1',
      name: 'Green Earth Foundation',
      type: 'nonprofit',
      industry: 'Environmental',
      logo: '🌍',
      description: 'Dedicated to environmental conservation and sustainability initiatives',
      founded: '2015',
      size: '50-200',
      location: 'San Francisco, CA',
      website: 'https://greenearth.org',
      verified: true,
      rating: 4.8,
      totalVolunteers: 1250,
      activeCampaigns: 12,
      customBadges: [
        {
          id: 'badge_1',
          name: 'Eco Champion',
          description: 'Awarded for exceptional environmental impact',
          icon: '🌱',
          rarity: 'legendary',
          requirements: { minHours: 100, minCampaigns: 10, domain: 'environment' },
          awardedCount: 45,
          created: '2024-01-15',
        },
        {
          id: 'badge_2',
          name: 'Tree Planter',
          description: 'For contributing to reforestation efforts',
          icon: '🌳',
          rarity: 'epic',
          requirements: { minHours: 50, minCampaigns: 5, specificActivity: 'tree_planting' },
          awardedCount: 120,
          created: '2024-02-01',
        },
      ],
    },
    {
      id: 'org_2',
      name: 'Tech for Good Initiative',
      type: 'nonprofit',
      industry: 'Technology',
      logo: '💻',
      description: 'Leveraging technology to solve social challenges',
      founded: '2018',
      size: '20-50',
      location: 'Austin, TX',
      website: 'https://techforgood.org',
      verified: true,
      rating: 4.6,
      totalVolunteers: 450,
      activeCampaigns: 6,
      customBadges: [
        {
          id: 'badge_3',
          name: 'Digital Innovator',
          description: 'For creating tech solutions for social good',
          icon: '💡',
          rarity: 'epic',
          requirements: { minHours: 80, minCampaigns: 8, domain: 'technology' },
          awardedCount: 25,
          created: '2024-03-10',
        },
        {
          id: 'badge_4',
          name: 'Code Hero',
          description: 'For exceptional coding contributions',
          icon: '👨‍💻',
          rarity: 'rare',
          requirements: { minHours: 40, minCampaigns: 4, specificSkill: 'coding' },
          awardedCount: 60,
          created: '2024-01-20',
        },
      ],
    },
    {
      id: 'org_3',
      name: 'Education First Alliance',
      type: 'nonprofit',
      industry: 'Education',
      logo: '📚',
      description: 'Providing quality education to underserved communities',
      founded: '2010',
      size: '200-500',
      location: 'New York, NY',
      website: 'https://educationfirst.org',
      verified: true,
      rating: 4.9,
      totalVolunteers: 2100,
      activeCampaigns: 18,
      customBadges: [
        {
          id: 'badge_5',
          name: 'Master Teacher',
          description: 'For excellence in teaching and mentoring',
          icon: '👨‍🏫',
          rarity: 'legendary',
          requirements: { minHours: 150, minCampaigns: 15, domain: 'education' },
          awardedCount: 30,
          created: '2024-01-05',
        },
        {
          id: 'badge_6',
          name: 'Literacy Champion',
          description: 'For promoting literacy and education',
          icon: '📖',
          rarity: 'epic',
          requirements: { minHours: 75, minCampaigns: 8, specificActivity: 'literacy' },
          awardedCount: 85,
          created: '2024-02-15',
        },
      ],
    },
    {
      id: 'org_4',
      name: 'Community Care Network',
      type: 'nonprofit',
      industry: 'Healthcare',
      logo: '🏥',
      description: 'Providing healthcare services to communities in need',
      founded: '2012',
      size: '100-200',
      location: 'Chicago, IL',
      website: 'https://communitycare.org',
      verified: true,
      rating: 4.7,
      totalVolunteers: 890,
      activeCampaigns: 9,
      customBadges: [
        {
          id: 'badge_7',
          name: 'Healthcare Hero',
          description: 'For outstanding healthcare contributions',
          icon: '💊',
          rarity: 'legendary',
          requirements: { minHours: 120, minCampaigns: 10, domain: 'health' },
          awardedCount: 20,
          created: '2024-01-10',
        },
      ],
    },
  ],
  userBadges: [
    {
      id: 'user_badge_1',
      userId: 'user_current',
      organizationId: 'org_1',
      badgeId: 'badge_1',
      awarded: '2024-04-15',
      verified: true,
    },
    {
      id: 'user_badge_2',
      userId: 'user_current',
      organizationId: 'org_2',
      badgeId: 'badge_3',
      awarded: '2024-04-10',
      verified: true,
    },
  ],
  badgeTemplates: [
    {
      name: 'Impact Maker',
      description: 'For creating significant social impact',
      icon: '⭐',
      rarity: 'legendary',
      suggestedRequirements: { minHours: 100, minCampaigns: 10 },
    },
    {
      name: 'Team Leader',
      description: 'For exceptional team leadership',
      icon: '👑',
      rarity: 'epic',
      suggestedRequirements: { minHours: 75, minCampaigns: 8, leadershipRole: true },
    },
    {
      name: 'Rising Star',
      description: 'For emerging volunteers with great potential',
      icon: '🌟',
      rarity: 'rare',
      suggestedRequirements: { minHours: 25, minCampaigns: 3 },
    },
    {
      name: 'Dedicated Volunteer',
      description: 'For consistent commitment and dedication',
      icon: '💪',
      rarity: 'uncommon',
      suggestedRequirements: { minHours: 50, minCampaigns: 5 },
    },
  ],
  applications: [
    {
      id: 'app_1',
      organizationId: 'org_1',
      badgeName: 'Ocean Guardian',
      description: 'For protecting marine life and ocean ecosystems',
      icon: '🌊',
      rarity: 'epic',
      requirements: { minHours: 80, minCampaigns: 6, domain: 'environment' },
      status: 'pending',
      submitted: '2024-04-18',
      reviewer: 'pending',
    },
    {
      id: 'app_2',
      organizationId: 'org_2',
      badgeName: 'AI for Good',
      description: 'For using AI to solve social problems',
      icon: '🤖',
      rarity: 'legendary',
      requirements: { minHours: 100, minCampaigns: 8, domain: 'technology', skill: 'ai' },
      status: 'approved',
      submitted: '2024-04-15',
      approved: '2024-04-19',
      reviewer: 'admin_1',
    },
  ],
};

export const getOrganizations = (verified = true) => {
  return ORGANIZATION_DATA.organizations.filter(org => 
    verified ? org.verified : true
  );
};

export const getOrganizationById = (orgId) => {
  return ORGANIZATION_DATA.organizations.find(org => org.id === orgId);
};

export const getOrganizationBadges = (orgId) => {
  const organization = getOrganizationById(orgId);
  return organization ? organization.customBadges : [];
};

export const getAllCustomBadges = () => {
  return ORGANIZATION_DATA.organizations.flatMap(org => 
    org.customBadges.map(badge => ({
      ...badge,
      organizationId: org.id,
      organizationName: org.name,
      organizationLogo: org.logo,
    }))
  );
};

export const getUserCustomBadges = (userId = 'user_current') => {
  return ORGANIZATION_DATA.userBadges
    .filter(userBadge => userBadge.userId === userId)
    .map(userBadge => {
      const organization = getOrganizationById(userBadge.organizationId);
      const badge = organization?.customBadges.find(b => b.id === userBadge.badgeId);
      
      return {
        ...userBadge,
        badge,
        organization,
      };
    });
};

export const createBadgeApplication = (organizationId, badgeData) => {
  const application = {
    id: `app_${Date.now()}`,
    organizationId,
    ...badgeData,
    status: 'pending',
    submitted: new Date().toISOString().split('T')[0],
    reviewer: 'pending',
  };
  
  ORGANIZATION_DATA.applications.unshift(application);
  return { success: true, application };
};

export const getBadgeApplications = (status = null) => {
  let applications = ORGANIZATION_DATA.applications;
  if (status) {
    applications = applications.filter(app => app.status === status);
  }
  return applications;
};

export const reviewBadgeApplication = (applicationId, decision, reviewerId) => {
  const application = ORGANIZATION_DATA.applications.find(app => app.id === applicationId);
  if (!application) {
    return { success: false, message: 'Application not found' };
  }
  
  application.status = decision;
  application.reviewer = reviewerId;
  
  if (decision === 'approved') {
    application.approved = new Date().toISOString().split('T')[0];
    
    // Create the badge in the organization
    const organization = getOrganizationById(application.organizationId);
    if (organization) {
      const newBadge = {
        id: `badge_${Date.now()}`,
        name: application.badgeName,
        description: application.description,
        icon: application.icon,
        rarity: application.rarity,
        requirements: application.requirements,
        awardedCount: 0,
        created: application.approved,
      };
      
      organization.customBadges.push(newBadge);
    }
  }
  
  return { success: true, application };
};

export const awardCustomBadge = (userId, organizationId, badgeId) => {
  const existingAward = ORGANIZATION_DATA.userBadges.find(
    ub => ub.userId === userId && ub.organizationId === organizationId && ub.badgeId === badgeId
  );
  
  if (existingAward) {
    return { success: false, message: 'Badge already awarded to user' };
  }
  
  const userBadge = {
    id: `user_badge_${Date.now()}`,
    userId,
    organizationId,
    badgeId,
    awarded: new Date().toISOString().split('T')[0],
    verified: true,
  };
  
  ORGANIZATION_DATA.userBadges.push(userBadge);
  
  // Update awarded count
  const organization = getOrganizationById(organizationId);
  const badge = organization?.customBadges.find(b => b.id === badgeId);
  if (badge) {
    badge.awardedCount += 1;
  }
  
  return { success: true, userBadge };
};

export const getBadgeStats = (organizationId = null) => {
  let badges = getAllCustomBadges();
  let organizations = getOrganizations();
  
  if (organizationId) {
    badges = badges.filter(badge => badge.organizationId === organizationId);
    organizations = organizations.filter(org => org.id === organizationId);
  }
  
  const totalBadges = badges.length;
  const totalAwarded = badges.reduce((sum, badge) => sum + badge.awardedCount, 0);
  const rarityStats = {};
  
  badges.forEach(badge => {
    rarityStats[badge.rarity] = (rarityStats[badge.rarity] || 0) + 1;
  });
  
  return {
    totalBadges,
    totalAwarded,
    totalOrganizations: organizations.length,
    rarityStats,
    averagePerOrganization: totalBadges / organizations.length,
  };
};

export const searchBadges = (query, filters = {}) => {
  let badges = getAllCustomBadges();
  
  // Text search
  if (query) {
    const lowerQuery = query.toLowerCase();
    badges = badges.filter(badge =>
      badge.name.toLowerCase().includes(lowerQuery) ||
      badge.description.toLowerCase().includes(lowerQuery)
    );
  }
  
  // Apply filters
  if (filters.rarity) {
    badges = badges.filter(badge => badge.rarity === filters.rarity);
  }
  
  if (filters.organizationId) {
    badges = badges.filter(badge => badge.organizationId === filters.organizationId);
  }
  
  if (filters.domain) {
    badges = badges.filter(badge => 
      badge.requirements.domain === filters.domain
    );
  }
  
  return badges;
};

export const getBadgeRecommendations = (userId = 'user_current') => {
  const userBadges = getUserCustomBadges(userId).map(ub => ub.badgeId);
  const allBadges = getAllCustomBadges();
  
  // Recommend badges user doesn't have yet
  const availableBadges = allBadges.filter(badge => 
    !userBadges.includes(badge.id)
  );
  
  // Sort by rarity (legendary first) and awarded count (popular first)
  return availableBadges.sort((a, b) => {
    const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
    if (rarityOrder[a.rarity] !== rarityOrder[b.rarity]) {
      return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    }
    return b.awardedCount - a.awardedCount;
  }).slice(0, 6);
};

export const getRarityColor = (rarity) => {
  switch (rarity) {
    case 'legendary': return '#F59E0B';
    case 'epic': return '#8B5CF6';
    case 'rare': return '#3B82F6';
    case 'uncommon': return '#22C55E';
    case 'common': return '#6B7280';
    default: return '#6B7280';
  }
};

export const verifyBadgeAuthenticity = (userBadgeId) => {
  const userBadge = ORGANIZATION_DATA.userBadges.find(ub => ub.id === userBadgeId);
  if (!userBadge) {
    return { valid: false, reason: 'Badge not found' };
  }
  
  const organization = getOrganizationById(userBadge.organizationId);
  if (!organization || !organization.verified) {
    return { valid: false, reason: 'Organization not verified' };
  }
  
  const badge = organization.customBadges.find(b => b.id === userBadge.badgeId);
  if (!badge) {
    return { valid: false, reason: 'Badge not found in organization' };
  }
  
  return { 
    valid: true, 
    userBadge, 
    badge, 
    organization,
    verificationCode: `VER-${userBadge.id}-${Date.now()}`
  };
};
