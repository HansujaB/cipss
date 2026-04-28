// Volunteer marketplace and skills exchange service
export const MARKETPLACE_DATA = {
  services: [
    {
      id: 'service_1',
      title: 'Graphic Design for NGOs',
      description: 'Professional graphic design services for non-profit organizations including logos, brochures, and social media graphics',
      category: 'Design',
      subcategory: 'Graphic Design',
      providerId: 'user_1',
      providerName: 'Priya Sharma',
      providerAvatar: '👩‍💼',
      providerRating: 4.8,
      providerReviews: 23,
      skills: ['Adobe Creative Suite', 'Branding', 'UI/UX Design', 'Social Media Graphics'],
      experience: '5 years',
      pricing: {
        type: 'hourly',
        rate: 25,
        currency: 'USD',
        minimumHours: 2,
      },
      availability: {
        type: 'flexible',
        hoursPerWeek: 15,
        timezone: 'IST',
        responseTime: '2 hours',
      },
      portfolio: [
        { id: 'port_1', title: 'NGG Logo Design', image: 'https://example.com/logo1.jpg', description: 'Logo design for environmental NGO' },
        { id: 'port_2', title: 'Campaign Brochure', image: 'https://example.com/brochure1.jpg', description: 'Educational campaign brochure' },
      ],
      tags: ['non-profit', 'branding', 'marketing', 'social impact'],
      location: 'Mumbai, India',
      remote: true,
      verified: true,
      featured: true,
      createdAt: '2024-04-15T10:00:00Z',
      updatedAt: '2024-04-20T14:30:00Z',
      views: 234,
      likes: 45,
      inquiries: 12,
      status: 'active',
    },
    {
      id: 'service_2',
      title: 'Grant Writing Assistance',
      description: 'Help non-profits write compelling grant proposals and funding applications',
      category: 'Writing',
      subcategory: 'Grant Writing',
      providerId: 'user_2',
      providerName: 'Rahul Kumar',
      providerAvatar: '👨‍💼',
      providerRating: 4.9,
      providerReviews: 18,
      skills: ['Grant Writing', 'Research', 'Proposal Development', 'Budget Planning'],
      experience: '7 years',
      pricing: {
        type: 'project',
        rate: 500,
        currency: 'USD',
        estimatedDuration: '2-3 weeks',
      },
      availability: {
        type: 'part-time',
        hoursPerWeek: 20,
        timezone: 'EST',
        responseTime: '4 hours',
      },
      portfolio: [
        { id: 'port_3', title: 'Education Grant', description: 'Successfully secured $50K education grant' },
        { id: 'port_4', title: 'Healthcare Funding', description: 'Healthcare project funding proposal' },
      ],
      tags: ['funding', 'grants', 'non-profit', 'research'],
      location: 'New York, USA',
      remote: true,
      verified: true,
      featured: false,
      createdAt: '2024-04-10T09:00:00Z',
      updatedAt: '2024-04-18T16:20:00Z',
      views: 156,
      likes: 28,
      inquiries: 8,
      status: 'active',
    },
    {
      id: 'service_3',
      title: 'Social Media Management',
      description: 'Complete social media management and strategy for volunteer organizations',
      category: 'Marketing',
      subcategory: 'Social Media',
      providerId: 'user_3',
      providerName: 'Anita Patel',
      providerAvatar: '👩‍💻',
      providerRating: 4.7,
      providerReviews: 31,
      skills: ['Social Media Strategy', 'Content Creation', 'Community Management', 'Analytics'],
      experience: '4 years',
      pricing: {
        type: 'monthly',
        rate: 300,
        currency: 'USD',
        deliverables: 'Daily posts, weekly reports, strategy consultation',
      },
      availability: {
        type: 'full-time',
        hoursPerWeek: 40,
        timezone: 'PST',
        responseTime: '1 hour',
      },
      portfolio: [
        { id: 'port_5', title: 'Campaign Growth', description: 'Grew social media following by 200%' },
        { id: 'port_6', title: 'Engagement Strategy', description: 'Increased engagement rates by 150%' },
      ],
      tags: ['social media', 'marketing', 'content', 'strategy'],
      location: 'San Francisco, USA',
      remote: true,
      verified: false,
      featured: true,
      createdAt: '2024-04-12T11:30:00Z',
      updatedAt: '2024-04-19T10:15:00Z',
      views: 189,
      likes: 38,
      inquiries: 15,
      status: 'active',
    },
  ],
  skills: [
    { id: 'skill_1', name: 'Graphic Design', category: 'Design', demand: 'high', providers: 45 },
    { id: 'skill_2', name: 'Grant Writing', category: 'Writing', demand: 'high', providers: 23 },
    { id: 'skill_3', name: 'Social Media', category: 'Marketing', demand: 'medium', providers: 67 },
    { id: 'skill_4', name: 'Web Development', category: 'Technology', demand: 'high', providers: 34 },
    { id: 'skill_5', name: 'Video Editing', category: 'Media', demand: 'medium', providers: 28 },
    { id: 'skill_6', name: 'Project Management', category: 'Management', demand: 'high', providers: 56 },
    { id: 'skill_7', name: 'Translation', category: 'Language', demand: 'medium', providers: 41 },
    { id: 'skill_8', name: 'Photography', category: 'Media', demand: 'low', providers: 19 },
  ],
  categories: [
    { id: 'cat_1', name: 'Design', icon: '🎨', services: 78, color: '#8B5CF6' },
    { id: 'cat_2', name: 'Writing', icon: '✍️', services: 45, color: '#3B82F6' },
    { id: 'cat_3', name: 'Marketing', icon: '📱', services: 92, color: '#10B981' },
    { id: 'cat_4', name: 'Technology', icon: '💻', services: 56, color: '#F59E0B' },
    { id: 'cat_5', name: 'Management', icon: '📊', services: 34, color: '#EF4444' },
    { id: 'cat_6', name: 'Media', icon: '🎬', services: 28, color: '#EC4899' },
    { id: 'cat_7', name: 'Language', icon: '🌍', services: 41, color: '#14B8A6' },
    { id: 'cat_8', name: 'Education', icon: '📚', services: 23, color: '#6366F1' },
  ],
  exchanges: [
    {
      id: 'exchange_1',
      type: 'skill_barter',
      initiatorId: 'user_1',
      initiatorName: 'Priya Sharma',
      initiatorService: 'Graphic Design',
      recipientId: 'user_2',
      recipientName: 'Rahul Kumar',
      recipientService: 'Grant Writing',
      status: 'active',
      initiatedAt: '2024-04-18T10:00:00Z',
      agreedAt: '2024-04-19T14:30:00Z',
      duration: '1 month',
      terms: 'Exchange 10 hours of design work for grant writing assistance',
      messages: [
        { id: 'msg_1', senderId: 'user_1', content: 'Interested in collaborating on a project', timestamp: '2024-04-18T10:00:00Z' },
        { id: 'msg_2', senderId: 'user_2', content: 'Sounds great! Let me know your availability', timestamp: '2024-04-18T11:30:00Z' },
      ],
    },
    {
      id: 'exchange_2',
      type: 'service_purchase',
      buyerId: 'user_3',
      buyerName: 'Anita Patel',
      sellerId: 'user_1',
      sellerName: 'Priya Sharma',
      serviceId: 'service_1',
      status: 'completed',
      initiatedAt: '2024-04-15T09:00:00Z',
      completedAt: '2024-04-20T16:00:00Z',
      totalAmount: 150,
      currency: 'USD',
      rating: 5,
      review: 'Excellent work! Delivered on time and exceeded expectations.',
    },
  ],
  reviews: [
    {
      id: 'review_1',
      serviceId: 'service_1',
      reviewerId: 'user_4',
      reviewerName: 'Vikram Singh',
      rating: 5,
      comment: 'Priya did an amazing job on our NGO logo design. She understood our vision perfectly and delivered professional work.',
      createdAt: '2024-04-18T15:30:00Z',
      helpful: 12,
    },
    {
      id: 'review_2',
      serviceId: 'service_2',
      reviewerId: 'user_5',
      reviewerName: 'Neha Gupta',
      rating: 4,
      comment: 'Rahul helped us secure a grant for our education program. Very professional and knowledgeable.',
      createdAt: '2024-04-17T11:20:00Z',
      helpful: 8,
    },
  ],
  userProfile: {
    userId: 'user_1',
    servicesOffered: 2,
    servicesPurchased: 3,
    skillExchanges: 1,
    totalEarnings: 850,
    totalSpent: 450,
    averageRating: 4.8,
    completedProjects: 5,
    responseRate: 0.95,
    responseTime: '2 hours',
    skills: ['Graphic Design', 'UI/UX Design', 'Branding'],
    verifiedSkills: ['Graphic Design', 'UI/UX Design'],
    portfolioItems: 5,
    testimonials: 3,
  },
  settings: {
    notifications: {
      newInquiries: true,
      exchangeRequests: true,
      serviceViews: false,
      promotional: false,
    },
    privacy: {
      showProfile: true,
      showLocation: false,
      showEarnings: false,
      allowDirectMessages: true,
    },
    marketplace: {
      autoAcceptExchanges: false,
      minimumRating: 4.0,
      preferredCurrency: 'USD',
      availableForExchanges: true,
    },
  },
  analytics: {
    totalServices: 334,
    activeProviders: 156,
    totalExchanges: 89,
    totalTransactions: 234,
    totalValue: 45600,
    averageServicePrice: 125,
    popularCategories: ['Design', 'Marketing', 'Technology'],
    growthRate: 0.23,
    successRate: 0.87,
  },
};

export const getServices = (filters = {}) => {
  let services = MARKETPLACE_DATA.services;
  
  if (filters.category) {
    services = services.filter(service => service.category === filters.category);
  }
  
  if (filters.featured) {
    services = services.filter(service => service.featured);
  }
  
  if (filters.verified) {
    services = services.filter(service => service.verified);
  }
  
  if (filters.remote) {
    services = services.filter(service => service.remote);
  }
  
  if (filters.priceRange) {
    services = services.filter(service => {
      const rate = service.pricing.rate;
      return rate >= filters.priceRange.min && rate <= filters.priceRange.max;
    });
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    services = services.filter(service => 
      service.title.toLowerCase().includes(searchLower) ||
      service.description.toLowerCase().includes(searchLower) ||
      service.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
      service.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
  
  // Sort by relevance (default)
  services.sort((a, b) => {
    if (filters.sortBy === 'price_low') {
      return a.pricing.rate - b.pricing.rate;
    } else if (filters.sortBy === 'price_high') {
      return b.pricing.rate - a.pricing.rate;
    } else if (filters.sortBy === 'rating') {
      return b.providerRating - a.providerRating;
    } else if (filters.sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      // Default: relevance (featured, verified, views)
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) ||
             (b.verified ? 1 : 0) - (a.verified ? 1 : 0) ||
             b.views - a.views;
    }
  });
  
  return services;
};

export const getServiceById = (id) => {
  return MARKETPLACE_DATA.services.find(service => service.id === id);
};

export const createService = (serviceData) => {
  const newService = {
    id: `service_${Date.now()}`,
    ...serviceData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
    likes: 0,
    inquiries: 0,
    status: 'active',
  };
  
  MARKETPLACE_DATA.services.push(newService);
  
  return { success: true, service: newService };
};

export const updateService = (id, updates) => {
  const serviceIndex = MARKETPLACE_DATA.services.findIndex(service => service.id === id);
  
  if (serviceIndex === -1) {
    return { success: false, message: 'Service not found' };
  }
  
  MARKETPLACE_DATA.services[serviceIndex] = {
    ...MARKETPLACE_DATA.services[serviceIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  return { success: true, service: MARKETPLACE_DATA.services[serviceIndex] };
};

export const deleteService = (id) => {
  const serviceIndex = MARKETPLACE_DATA.services.findIndex(service => service.id === id);
  
  if (serviceIndex === -1) {
    return { success: false, message: 'Service not found' };
  }
  
  MARKETPLACE_DATA.services.splice(serviceIndex, 1);
  
  return { success: true };
};

export const getCategories = () => {
  return MARKETPLACE_DATA.categories;
};

export const getSkills = () => {
  return MARKETPLACE_DATA.skills;
};

export const getSkillById = (id) => {
  return MARKETPLACE_DATA.skills.find(skill => skill.id === id);
};

export const getExchanges = (userId = null) => {
  let exchanges = MARKETPLACE_DATA.exchanges;
  
  if (userId) {
    exchanges = exchanges.filter(exchange => 
      exchange.initiatorId === userId || exchange.recipientId === userId
    );
  }
  
  return exchanges.sort((a, b) => new Date(b.initiatedAt) - new Date(a.initiatedAt));
};

export const createExchange = (exchangeData) => {
  const newExchange = {
    id: `exchange_${Date.now()}`,
    ...exchangeData,
    initiatedAt: new Date().toISOString(),
    status: 'pending',
    messages: [],
  };
  
  MARKETPLACE_DATA.exchanges.push(newExchange);
  
  return { success: true, exchange: newExchange };
};

export const updateExchange = (id, updates) => {
  const exchangeIndex = MARKETPLACE_DATA.exchanges.findIndex(exchange => exchange.id === id);
  
  if (exchangeIndex === -1) {
    return { success: false, message: 'Exchange not found' };
  }
  
  MARKETPLACE_DATA.exchanges[exchangeIndex] = {
    ...MARKETPLACE_DATA.exchanges[exchangeIndex],
    ...updates,
  };
  
  return { success: true, exchange: MARKETPLACE_DATA.exchanges[exchangeIndex] };
};

export const addExchangeMessage = (exchangeId, senderId, content) => {
  const exchange = MARKETPLACE_DATA.exchanges.find(e => e.id === exchangeId);
  
  if (!exchange) {
    return { success: false, message: 'Exchange not found' };
  }
  
  const message = {
    id: `msg_${Date.now()}`,
    senderId,
    content,
    timestamp: new Date().toISOString(),
  };
  
  exchange.messages.push(message);
  
  return { success: true, message };
};

export const getReviews = (serviceId = null) => {
  let reviews = MARKETPLACE_DATA.reviews;
  
  if (serviceId) {
    reviews = reviews.filter(review => review.serviceId === serviceId);
  }
  
  return reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const createReview = (reviewData) => {
  const newReview = {
    id: `review_${Date.now()}`,
    ...reviewData,
    createdAt: new Date().toISOString(),
    helpful: 0,
  };
  
  MARKETPLACE_DATA.reviews.push(newReview);
  
  // Update service rating
  const service = getServiceById(reviewData.serviceId);
  if (service) {
    const serviceReviews = getReviews(reviewData.serviceId);
    const averageRating = serviceReviews.reduce((sum, review) => sum + review.rating, 0) / serviceReviews.length;
    updateService(reviewData.serviceId, { providerRating: averageRating });
  }
  
  return { success: true, review: newReview };
};

export const likeService = (serviceId, userId) => {
  const service = getServiceById(serviceId);
  
  if (!service) {
    return { success: false, message: 'Service not found' };
  }
  
  service.likes += 1;
  
  return { success: true, likes: service.likes };
};

export const viewService = (serviceId) => {
  const service = getServiceById(serviceId);
  
  if (!service) {
    return { success: false, message: 'Service not found' };
  }
  
  service.views += 1;
  
  return { success: true, views: service.views };
};

export const inquireService = (serviceId, userId, message) => {
  const service = getServiceById(serviceId);
  
  if (!service) {
    return { success: false, message: 'Service not found' };
  }
  
  service.inquiries += 1;
  
  // Create inquiry notification (in real app, this would send notification)
  const inquiry = {
    id: `inquiry_${Date.now()}`,
    serviceId,
    userId,
    message,
    timestamp: new Date().toISOString(),
    status: 'pending',
  };
  
  return { success: true, inquiry };
};

export const getUserMarketplaceProfile = (userId) => {
  // In a real app, this would fetch user-specific data
  return MARKETPLACE_DATA.userProfile;
};

export const updateUserMarketplaceProfile = (userId, updates) => {
  MARKETPLACE_DATA.userProfile = { ...MARKETPLACE_DATA.userProfile, ...updates };
  return { success: true, profile: MARKETPLACE_DATA.userProfile };
};

export const getMarketplaceSettings = () => {
  return MARKETPLACE_DATA.settings;
};

export const updateMarketplaceSettings = (updates) => {
  MARKETPLACE_DATA.settings = { ...MARKETPLACE_DATA.settings, ...updates };
  return { success: true, settings: MARKETPLACE_DATA.settings };
};

export const getMarketplaceAnalytics = () => {
  return MARKETPLACE_DATA.analytics;
};

export const searchServices = (query, filters = {}) => {
  return getServices({ ...filters, search: query });
};

export const getRecommendedServices = (userId, limit = 5) => {
  // Simple recommendation algorithm based on user's skills and past interactions
  const userProfile = getUserMarketplaceProfile(userId);
  const userSkills = userProfile.skills || [];
  
  const services = getServices().filter(service => {
    // Recommend services that match user's skills or are in high-demand categories
    const skillMatch = service.skills.some(skill => userSkills.includes(skill));
    const highDemand = MARKETPLACE_DATA.skills.find(s => s.name === service.category)?.demand === 'high';
    
    return skillMatch || highDemand;
  });
  
  return services.slice(0, limit);
};

export const getTrendingServices = (limit = 10) => {
  return getServices()
    .sort((a, b) => (b.views * 0.3 + b.likes * 0.4 + b.inquiries * 0.3) - (a.views * 0.3 + a.likes * 0.4 + a.inquiries * 0.3))
    .slice(0, limit);
};

export const verifyService = (serviceId, verifiedBy = 'admin') => {
  const result = updateService(serviceId, { verified: true, verifiedAt: new Date().toISOString(), verifiedBy });
  
  if (result.success) {
    return { success: true, message: 'Service verified successfully' };
  }
  
  return result;
};

export const featureService = (serviceId, featured = true) => {
  const result = updateService(serviceId, { featured });
  
  if (result.success) {
    return { success: true, message: `Service ${featured ? 'featured' : 'unfeatured'} successfully` };
  }
  
  return result;
};

export const reportService = (serviceId, reporterId, reason) => {
  const report = {
    id: `report_${Date.now()}`,
    serviceId,
    reporterId,
    reason,
    timestamp: new Date().toISOString(),
    status: 'pending',
  };
  
  // In a real app, this would be stored in a reports collection
  return { success: true, report };
};

export const calculateServiceScore = (service) => {
  const views = service.views || 0;
  const likes = service.likes || 0;
  const inquiries = service.inquiries || 0;
  const rating = service.providerRating || 0;
  const reviews = service.providerReviews || 0;
  
  // Weighted scoring algorithm
  const score = (views * 0.1) + (likes * 0.2) + (inquiries * 0.3) + (rating * reviews * 0.4);
  
  return Math.round(score);
};

export const getServiceStatistics = (serviceId) => {
  const service = getServiceById(serviceId);
  
  if (!service) {
    return { success: false, message: 'Service not found' };
  }
  
  const reviews = getReviews(serviceId);
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  
  return {
    success: true,
    statistics: {
      views: service.views,
      likes: service.likes,
      inquiries: service.inquiries,
      reviews: reviews.length,
      averageRating,
      score: calculateServiceScore(service),
      responseRate: 0.85, // Mock data
      completionRate: 0.92, // Mock data
    },
  };
};

export const getProviderEarnings = (providerId, period = 'all') => {
  // Calculate earnings from completed transactions
  const completedExchanges = MARKETPLACE_DATA.exchanges.filter(exchange => 
    exchange.sellerId === providerId && 
    exchange.status === 'completed' &&
    exchange.totalAmount
  );
  
  const totalEarnings = completedExchanges.reduce((sum, exchange) => sum + exchange.totalAmount, 0);
  
  return {
    totalEarnings,
    completedProjects: completedExchanges.length,
    averageEarning: completedExchanges.length > 0 ? totalEarnings / completedExchanges.length : 0,
  };
};
