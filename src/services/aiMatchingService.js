// AI-powered volunteer matching service
export const AI_MATCHING_DATA = {
  algorithms: {
    skillBased: {
      name: 'Skill-Based Matching',
      weight: 0.35,
      description: 'Matches volunteers based on skills and expertise',
    },
    interestBased: {
      name: 'Interest-Based Matching',
      weight: 0.25,
      description: 'Considers personal interests and passions',
    },
    availabilityBased: {
      name: 'Availability Matching',
      weight: 0.20,
      description: 'Matches based on time availability and schedule',
    },
    locationBased: {
      name: 'Location-Based Matching',
      weight: 0.10,
      description: 'Considers geographical proximity',
    },
    personalityBased: {
      name: 'Personality Matching',
      weight: 0.10,
      description: 'Matches based on personality traits and work style',
    },
  },
  skills: [
    { id: 'skill_1', name: 'Teaching', category: 'Education', level: 'Advanced' },
    { id: 'skill_2', name: 'Web Development', category: 'Technology', level: 'Expert' },
    { id: 'skill_3', name: 'Graphic Design', category: 'Creative', level: 'Intermediate' },
    { id: 'skill_4', name: 'Project Management', category: 'Management', level: 'Advanced' },
    { id: 'skill_5', name: 'Public Speaking', category: 'Communication', level: 'Expert' },
    { id: 'skill_6', name: 'Data Analysis', category: 'Technology', level: 'Intermediate' },
    { id: 'skill_7', name: 'Social Media Marketing', category: 'Marketing', level: 'Advanced' },
    { id: 'skill_8', name: 'Event Planning', category: 'Management', level: 'Expert' },
    { id: 'skill_9', name: 'Photography', category: 'Creative', level: 'Intermediate' },
    { id: 'skill_10', name: 'Financial Planning', category: 'Finance', level: 'Advanced' },
  ],
  interests: [
    { id: 'interest_1', name: 'Environmental Conservation', category: 'Environment' },
    { id: 'interest_2', name: 'Education for All', category: 'Education' },
    { id: 'interest_3', name: 'Animal Welfare', category: 'Animals' },
    { id: 'interest_4', name: 'Healthcare Access', category: 'Health' },
    { id: 'interest_5', name: 'Community Development', category: 'Community' },
    { id: 'interest_6', name: 'Technology Access', category: 'Technology' },
    { id: 'interest_7', name: 'Arts and Culture', category: 'Arts' },
    { id: 'interest_8', name: 'Senior Care', category: 'Health' },
    { id: 'interest_9', name: 'Youth Development', category: 'Education' },
    { id: 'interest_10', name: 'Food Security', category: 'Community' },
  ],
  opportunities: [
    {
      id: 'opp_1',
      title: 'Teaching Assistant - Rural School',
      organization: 'Education First NGO',
      description: 'Help teach basic subjects to underprivileged children',
      requiredSkills: ['skill_1', 'skill_5'],
      preferredInterests: ['interest_2', 'interest_9'],
      location: 'Rural Area, 50km from city',
      timeCommitment: '10 hours/week',
      duration: '3 months',
      urgency: 'High',
      impactScore: 85,
      difficulty: 'Medium',
      teamSize: 5,
      remotePossible: false,
      skillsMatched: [],
      confidenceScore: 0,
    },
    {
      id: 'opp_2',
      title: 'Website Development for Non-Profit',
      organization: 'Tech for Good Foundation',
      description: 'Build and maintain website for a non-profit organization',
      requiredSkills: ['skill_2'],
      preferredInterests: ['interest_6'],
      location: 'Remote',
      timeCommitment: '15 hours/week',
      duration: '2 months',
      urgency: 'Medium',
      impactScore: 90,
      difficulty: 'Hard',
      teamSize: 3,
      remotePossible: true,
      skillsMatched: [],
      confidenceScore: 0,
    },
    {
      id: 'opp_3',
      title: 'Environmental Campaign Coordinator',
      organization: 'Green Earth Initiative',
      description: 'Coordinate environmental awareness campaigns',
      requiredSkills: ['skill_4', 'skill_7'],
      preferredInterests: ['interest_1'],
      location: 'City Center',
      timeCommitment: '8 hours/week',
      duration: '6 months',
      urgency: 'High',
      impactScore: 95,
      difficulty: 'Medium',
      teamSize: 8,
      remotePossible: false,
      skillsMatched: [],
      confidenceScore: 0,
    },
    {
      id: 'opp_4',
      title: 'Senior Care Companion',
      organization: 'Elder Care Society',
      description: 'Provide companionship and assistance to elderly residents',
      requiredSkills: ['skill_1'],
      preferredInterests: ['interest_8'],
      location: 'Local Nursing Home',
      timeCommitment: '5 hours/week',
      duration: 'Ongoing',
      urgency: 'High',
      impactScore: 80,
      difficulty: 'Easy',
      teamSize: 10,
      remotePossible: false,
      skillsMatched: [],
      confidenceScore: 0,
    },
    {
      id: 'opp_5',
      title: 'Data Analysis for Research Project',
      organization: 'Social Research Institute',
      description: 'Analyze survey data for social impact research',
      requiredSkills: ['skill_6'],
      preferredInterests: ['interest_5'],
      location: 'Remote',
      timeCommitment: '12 hours/week',
      duration: '4 months',
      urgency: 'Medium',
      impactScore: 88,
      difficulty: 'Hard',
      teamSize: 4,
      remotePossible: true,
      skillsMatched: [],
      confidenceScore: 0,
    },
  ],
  volunteerProfiles: [
    {
      id: 'volunteer_1',
      name: 'Priya Sharma',
      skills: ['skill_1', 'skill_5', 'skill_4'],
      interests: ['interest_2', 'interest_9', 'interest_5'],
      availability: {
        weekdays: true,
        weekends: true,
        mornings: true,
        afternoons: true,
        evenings: false,
      },
      location: 'City Center',
      preferredDistance: 20, // km
      personality: {
        type: 'ENFJ',
        traits: ['Empathetic', 'Organized', 'Leader'],
      },
      experience: {
        years: 3,
        previousRoles: ['Teacher', 'Mentor'],
        totalHours: 450,
      },
      preferences: {
        remoteWork: true,
        teamSize: 'Medium',
        difficulty: 'Medium',
        causes: ['Education', 'Community'],
      },
    },
    {
      id: 'volunteer_2',
      name: 'Rahul Kumar',
      skills: ['skill_2', 'skill_6'],
      interests: ['interest_6', 'interest_1'],
      availability: {
        weekdays: true,
        weekends: false,
        mornings: false,
        afternoons: true,
        evenings: true,
      },
      location: 'Suburbs',
      preferredDistance: 30,
      personality: {
        type: 'INTJ',
        traits: ['Analytical', 'Independent', 'Problem-solver'],
      },
      experience: {
        years: 5,
        previousRoles: ['Developer', 'Data Analyst'],
        totalHours: 380,
      },
      preferences: {
        remoteWork: true,
        teamSize: 'Small',
        difficulty: 'Hard',
        causes: ['Technology', 'Environment'],
      },
    },
  ],
  matches: [
    {
      id: 'match_1',
      volunteerId: 'volunteer_1',
      opportunityId: 'opp_1',
      score: 0.92,
      confidence: 'High',
      matchReasons: [
        'Perfect skill match with Teaching and Public Speaking',
        'Strong interest in Education and Youth Development',
        'Availability aligns with required schedule',
        'Location within preferred distance',
      ],
      potentialImpact: 85,
      timeToStart: 'Immediate',
      status: 'Recommended',
    },
    {
      id: 'match_2',
      volunteerId: 'volunteer_2',
      opportunityId: 'opp_2',
      score: 0.88,
      confidence: 'High',
      matchReasons: [
        'Expert Web Development skills required',
        'Interest in Technology Access',
        'Remote work preference matches opportunity',
        'Experience level suitable for difficulty',
      ],
      potentialImpact: 90,
      timeToStart: '1 week',
      status: 'Recommended',
    },
  ],
  settings: {
    enabled: true,
    autoMatching: true,
    minConfidenceScore: 0.7,
    maxRecommendations: 5,
    updateFrequency: 'daily', // hourly, daily, weekly
    notifyNewMatches: true,
    learningEnabled: true,
    feedbackWeight: 0.15,
  },
  analytics: {
    totalMatches: 1250,
    successfulMatches: 890,
    averageMatchScore: 0.78,
    topPerformingAlgorithm: 'skillBased',
    volunteerSatisfaction: 4.2, // out of 5
    organizationSatisfaction: 4.5, // out of 5
    averageTimeToMatch: 2.3, // days
    retentionRate: 0.85, // 85%
  },
};

export const getAiMatchingSettings = () => {
  return AI_MATCHING_DATA.settings;
};

export const updateAiMatchingSettings = (settings) => {
  AI_MATCHING_DATA.settings = { ...AI_MATCHING_DATA.settings, ...settings };
  return { success: true, settings: AI_MATCHING_DATA.settings };
};

export const getSkills = () => {
  return AI_MATCHING_DATA.skills;
};

export const getInterests = () => {
  return AI_MATCHING_DATA.interests;
};

export const getOpportunities = (filters = {}) => {
  let opportunities = AI_MATCHING_DATA.opportunities;
  
  if (filters.location) {
    opportunities = opportunities.filter(opp => 
      opp.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }
  
  if (filters.remotePossible !== undefined) {
    opportunities = opportunities.filter(opp => opp.remotePossible === filters.remotePossible);
  }
  
  if (filters.urgency) {
    opportunities = opportunities.filter(opp => opp.urgency === filters.urgency);
  }
  
  if (filters.difficulty) {
    opportunities = opportunities.filter(opp => opp.difficulty === filters.difficulty);
  }
  
  return opportunities;
};

export const getVolunteerProfile = (volunteerId) => {
  return AI_MATCHING_DATA.volunteerProfiles.find(v => v.id === volunteerId);
};

export const calculateMatchScore = (volunteerId, opportunityId) => {
  const volunteer = getVolunteerProfile(volunteerId);
  const opportunity = getOpportunities().find(opp => opp.id === opportunityId);
  
  if (!volunteer || !opportunity) {
    return { success: false, message: 'Volunteer or opportunity not found' };
  }
  
  let totalScore = 0;
  let maxScore = 0;
  const matchDetails = {};
  
  // Skill-based matching (35% weight)
  const skillWeight = AI_MATCHING_DATA.algorithms.skillBased.weight;
  maxScore += skillWeight;
  const skillScore = calculateSkillMatch(volunteer.skills, opportunity.requiredSkills);
  totalScore += skillScore * skillWeight;
  matchDetails.skills = {
    score: skillScore,
    matchedSkills: opportunity.requiredSkills.filter(skillId => 
      volunteer.skills.includes(skillId)
    ),
    missingSkills: opportunity.requiredSkills.filter(skillId => 
      !volunteer.skills.includes(skillId)
    ),
  };
  
  // Interest-based matching (25% weight)
  const interestWeight = AI_MATCHING_DATA.algorithms.interestBased.weight;
  maxScore += interestWeight;
  const interestScore = calculateInterestMatch(volunteer.interests, opportunity.preferredInterests);
  totalScore += interestScore * interestWeight;
  matchDetails.interests = {
    score: interestScore,
    matchedInterests: opportunity.preferredInterests.filter(interestId => 
      volunteer.interests.includes(interestId)
    ),
  };
  
  // Availability matching (20% weight)
  const availabilityWeight = AI_MATCHING_DATA.algorithms.availabilityBased.weight;
  maxScore += availabilityWeight;
  const availabilityScore = calculateAvailabilityMatch(volunteer.availability, opportunity);
  totalScore += availabilityScore * availabilityWeight;
  matchDetails.availability = {
    score: availabilityScore,
    compatible: availabilityScore > 0.5,
  };
  
  // Location-based matching (10% weight)
  const locationWeight = AI_MATCHING_DATA.algorithms.locationBased.weight;
  maxScore += locationWeight;
  const locationScore = calculateLocationMatch(volunteer, opportunity);
  totalScore += locationScore * locationWeight;
  matchDetails.location = {
    score: locationScore,
    distance: opportunity.location === 'Remote' ? 0 : calculateDistance(volunteer.location, opportunity.location),
  };
  
  // Personality-based matching (10% weight)
  const personalityWeight = AI_MATCHING_DATA.algorithms.personalityBased.weight;
  maxScore += personalityWeight;
  const personalityScore = calculatePersonalityMatch(volunteer.personality, opportunity);
  totalScore += personalityScore * personalityWeight;
  matchDetails.personality = {
    score: personalityScore,
    traits: volunteer.personality.traits,
  };
  
  const finalScore = totalScore / maxScore;
  const confidence = calculateConfidence(finalScore, matchDetails);
  
  return {
    success: true,
    score: finalScore,
    confidence,
    matchDetails,
    recommendation: getRecommendation(finalScore, confidence),
  };
};

const calculateSkillMatch = (volunteerSkills, requiredSkills) => {
  if (requiredSkills.length === 0) return 1.0;
  
  const matchedSkills = requiredSkills.filter(skill => volunteerSkills.includes(skill));
  return matchedSkills.length / requiredSkills.length;
};

const calculateInterestMatch = (volunteerInterests, preferredInterests) => {
  if (preferredInterests.length === 0) return 0.5;
  
  const matchedInterests = preferredInterests.filter(interest => volunteerInterests.includes(interest));
  return matchedInterests.length / preferredInterests.length;
};

const calculateAvailabilityMatch = (availability, opportunity) => {
  // Simplified availability calculation
  if (opportunity.timeCommitment.includes('hours/week')) {
    const weeklyHours = parseInt(opportunity.timeCommitment);
    if (weeklyHours <= 5) return 0.9;
    if (weeklyHours <= 10) return 0.7;
    if (weeklyHours <= 15) return 0.5;
    return 0.3;
  }
  return 0.6;
};

const calculateLocationMatch = (volunteer, opportunity) => {
  if (opportunity.remotePossible && volunteer.preferences.remoteWork) {
    return 1.0;
  }
  
  if (opportunity.location === 'Remote') {
    return volunteer.preferences.remoteWork ? 0.8 : 0.4;
  }
  
  const distance = calculateDistance(volunteer.location, opportunity.location);
  if (distance <= volunteer.preferredDistance) {
    return 1.0 - (distance / (volunteer.preferredDistance * 2));
  }
  
  return Math.max(0, 1.0 - (distance / 100)); // Penalty for distance
};

const calculateDistance = (location1, location2) => {
  // Simplified distance calculation
  if (location1 === location2) return 0;
  if (location1 === 'City Center' && location2 === 'Suburbs') return 15;
  if (location1 === 'Suburbs' && location2 === 'City Center') return 15;
  if (location2.includes('Remote')) return 0;
  return 25; // Default distance
};

const calculatePersonalityMatch = (personality, opportunity) => {
  // Simplified personality matching based on opportunity requirements
  const personalityScores = {
    'ENFJ': { 'Teaching': 0.9, 'Management': 0.8, 'Creative': 0.7 },
    'INTJ': { 'Technology': 0.9, 'Analysis': 0.9, 'Research': 0.8 },
    'ESFP': { 'Creative': 0.9, 'Social': 0.8, 'Events': 0.8 },
  };
  
  const typeScores = personalityScores[personality.type] || {};
  const avgScore = Object.values(typeScores).reduce((a, b) => a + b, 0) / Object.values(typeScores).length || 0.5;
  
  return avgScore;
};

const calculateConfidence = (score, matchDetails) => {
  let confidence = score;
  
  // Adjust confidence based on match detail completeness
  if (matchDetails.skills.score === 1.0) confidence += 0.1;
  if (matchDetails.interests.score > 0.5) confidence += 0.05;
  if (matchDetails.availability.compatible) confidence += 0.05;
  
  return Math.min(1.0, confidence);
};

const getRecommendation = (score, confidence) => {
  if (score >= 0.9 && confidence >= 0.8) {
    return { level: 'Excellent', message: 'Perfect match! Highly recommended.' };
  } else if (score >= 0.75 && confidence >= 0.7) {
    return { level: 'Good', message: 'Strong match with good potential.' };
  } else if (score >= 0.6 && confidence >= 0.6) {
    return { level: 'Fair', message: 'Decent match, consider with some adjustments.' };
  } else {
    return { level: 'Poor', message: 'Not recommended, look for better options.' };
  }
};

export const getRecommendationsForVolunteer = (volunteerId, limit = 5) => {
  const volunteer = getVolunteerProfile(volunteerId);
  if (!volunteer) {
    return { success: false, message: 'Volunteer not found' };
  }
  
  const opportunities = getOpportunities();
  const recommendations = [];
  
  opportunities.forEach(opportunity => {
    const matchResult = calculateMatchScore(volunteerId, opportunity.id);
    if (matchResult.success && matchResult.score >= AI_MATCHING_DATA.settings.minConfidenceScore) {
      recommendations.push({
        opportunityId: opportunity.id,
        opportunity,
        score: matchResult.score,
        confidence: matchResult.confidence,
        recommendation: matchResult.recommendation,
        matchDetails: matchResult.matchDetails,
      });
    }
  });
  
  // Sort by score and confidence
  recommendations.sort((a, b) => {
    const scoreA = a.score * a.confidence;
    const scoreB = b.score * b.confidence;
    return scoreB - scoreA;
  });
  
  return {
    success: true,
    recommendations: recommendations.slice(0, limit),
    totalFound: recommendations.length,
  };
};

export const acceptMatch = (volunteerId, opportunityId) => {
  const matchResult = calculateMatchScore(volunteerId, opportunityId);
  if (!matchResult.success) {
    return { success: false, message: 'Could not calculate match' };
  }
  
  const match = {
    id: `match_${Date.now()}`,
    volunteerId,
    opportunityId,
    score: matchResult.score,
    confidence: matchResult.confidence,
    matchReasons: generateMatchReasons(matchResult.matchDetails),
    potentialImpact: getOpportunities().find(opp => opp.id === opportunityId)?.impactScore || 0,
    timeToStart: 'Immediate',
    status: 'Accepted',
    timestamp: new Date().toISOString(),
  };
  
  AI_MATCHING_DATA.matches.push(match);
  
  // Update analytics
  AI_MATCHING_DATA.analytics.totalMatches += 1;
  AI_MATCHING_DATA.analytics.successfulMatches += 1;
  
  return { success: true, match };
};

const generateMatchReasons = (matchDetails) => {
  const reasons = [];
  
  if (matchDetails.skills.score >= 0.8) {
    reasons.push('Excellent skill match');
  }
  
  if (matchDetails.interests.score >= 0.6) {
    reasons.push('Strong interest alignment');
  }
  
  if (matchDetails.availability.compatible) {
    reasons.push('Compatible availability');
  }
  
  if (matchDetails.location.score >= 0.8) {
    reasons.push('Ideal location match');
  }
  
  if (matchDetails.personality.score >= 0.7) {
    reasons.push('Good personality fit');
  }
  
  return reasons;
};

export const rejectMatch = (volunteerId, opportunityId, reason = '') => {
  // Record rejection for learning
  const rejection = {
    volunteerId,
    opportunityId,
    reason,
    timestamp: new Date().toISOString(),
  };
  
  // Update analytics
  AI_MATCHING_DATA.analytics.totalMatches += 1;
  
  return { success: true, rejection };
};

export const getMatchingAnalytics = () => {
  return AI_MATCHING_DATA.analytics;
};

export const updateMatchingAnalytics = (updates) => {
  AI_MATCHING_DATA.analytics = { ...AI_MATCHING_DATA.analytics, ...updates };
  return { success: true, analytics: AI_MATCHING_DATA.analytics };
};

export const trainMatchingModel = (feedbackData) => {
  // Simulate model training with feedback
  const trainingResult = {
    success: true,
    accuracy: 0.85 + Math.random() * 0.1, // 85-95%
    samples: feedbackData.length,
    improvements: [
      'Better skill matching accuracy',
      'Improved interest weighting',
      'Enhanced location scoring',
    ],
    nextTrainingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week
  };
  
  return trainingResult;
};
