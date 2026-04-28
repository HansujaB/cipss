// Gamified learning paths and courses service
export const LEARNING_DATA = {
  learningPaths: [
    {
      id: 'path_1',
      title: 'Environmental Champion',
      description: 'Master environmental conservation and sustainability practices',
      category: 'Environment',
      difficulty: 'Intermediate',
      duration: '6 weeks',
      totalCourses: 4,
      enrolledUsers: 1250,
      completionRate: 0.78,
      rating: 4.6,
      prerequisites: ['basic_volunteer_training'],
      skills: ['Environmental Science', 'Conservation', 'Sustainability', 'Community Engagement'],
      careerPaths: ['Environmental Coordinator', 'Sustainability Manager', 'Conservation Officer'],
      certificate: {
        name: 'Environmental Champion Certificate',
        issuer: 'CIPSS Academy',
        verified: true,
        shareable: true,
      },
      progress: {
        currentCourse: 2,
        completedCourses: 1,
        totalPoints: 450,
        maxPoints: 1200,
        streakDays: 14,
        estimatedCompletion: '2024-06-15',
      },
      rewards: {
        points: 1200,
        badges: ['environmental_champion', 'sustainability_expert'],
        certificates: 1,
        unlocks: ['advanced_environmental_path', 'leadership_program'],
      },
      isEnrolled: true,
      isCompleted: false,
      enrollmentDate: '2024-04-01',
      lastAccessDate: '2024-04-20',
    },
    {
      id: 'path_2',
      title: 'Community Leadership',
      description: 'Develop leadership skills for community development projects',
      category: 'Leadership',
      difficulty: 'Advanced',
      duration: '8 weeks',
      totalCourses: 5,
      enrolledUsers: 890,
      completionRate: 0.65,
      rating: 4.8,
      prerequisites: ['team_management', 'communication_skills'],
      skills: ['Leadership', 'Project Management', 'Team Building', 'Strategic Planning'],
      careerPaths: ['Community Manager', 'Project Lead', 'Program Director'],
      certificate: {
        name: 'Community Leadership Certificate',
        issuer: 'CIPSS Academy',
        verified: true,
        shareable: true,
      },
      progress: null,
      rewards: {
        points: 1500,
        badges: ['community_leader', 'project_manager'],
        certificates: 1,
        unlocks: ['executive_leadership', 'international_programs'],
      },
      isEnrolled: false,
      isCompleted: false,
    },
    {
      id: 'path_3',
      title: 'Digital Literacy for Social Impact',
      description: 'Learn digital tools and technologies for social good',
      category: 'Technology',
      difficulty: 'Beginner',
      duration: '4 weeks',
      totalCourses: 3,
      enrolledUsers: 2100,
      completionRate: 0.85,
      rating: 4.4,
      prerequisites: [],
      skills: ['Digital Tools', 'Social Media', 'Data Analysis', 'Online Collaboration'],
      careerPaths: ['Digital Coordinator', 'Social Media Manager', 'Data Analyst'],
      certificate: {
        name: 'Digital Literacy Certificate',
        issuer: 'CIPSS Academy',
        verified: true,
        shareable: true,
      },
      progress: null,
      rewards: {
        points: 800,
        badges: ['digital_expert', 'tech_champion'],
        certificates: 1,
        unlocks: ['advanced_digital_skills', 'tech_leadership'],
      },
      isEnrolled: false,
      isCompleted: false,
    },
  ],
  courses: [
    {
      id: 'course_1',
      title: 'Introduction to Environmental Conservation',
      description: 'Learn the fundamentals of environmental conservation and sustainability',
      learningPathId: 'path_1',
      order: 1,
      duration: '1 week',
      difficulty: 'Beginner',
      lessons: [
        {
          id: 'lesson_1',
          title: 'What is Environmental Conservation?',
          type: 'video',
          duration: '15 min',
          completed: true,
          score: 95,
        },
        {
          id: 'lesson_2',
          title: 'Types of Environmental Issues',
          type: 'reading',
          duration: '20 min',
          completed: true,
          score: 88,
        },
        {
          id: 'lesson_3',
          title: 'Conservation Strategies',
          type: 'interactive',
          duration: '30 min',
          completed: true,
          score: 92,
        },
        {
          id: 'lesson_4',
          title: 'Quiz: Environmental Basics',
          type: 'quiz',
          duration: '10 min',
          completed: true,
          score: 85,
        },
      ],
      assessments: [
        {
          id: 'assessment_1',
          title: 'Environmental Knowledge Test',
          type: 'quiz',
          questions: 20,
          passingScore: 70,
          maxAttempts: 3,
          completed: true,
          bestScore: 85,
          attempts: 1,
        },
      ],
      resources: [
        { type: 'pdf', title: 'Conservation Handbook', url: '#' },
        { type: 'video', title: 'Documentary: Planet Earth', url: '#' },
        { type: 'link', title: 'UN Environment Programme', url: '#' },
      ],
      progress: {
        completedLessons: 4,
        totalLessons: 4,
        completedAssessments: 1,
        totalAssessments: 1,
        overallScore: 90,
        timeSpent: 75, // minutes
        lastAccessDate: '2024-04-15',
      },
      isCompleted: true,
      completionDate: '2024-04-15',
      certificate: {
        earned: true,
        url: 'https://certificates.cipss.com/course_1.pdf',
        shareable: true,
      },
    },
    {
      id: 'course_2',
      title: 'Sustainable Practices in Daily Life',
      description: 'Learn how to implement sustainable practices in everyday activities',
      learningPathId: 'path_1',
      order: 2,
      duration: '1 week',
      difficulty: 'Intermediate',
      lessons: [
        {
          id: 'lesson_5',
          title: 'Reducing Carbon Footprint',
          type: 'video',
          duration: '18 min',
          completed: true,
          score: 90,
        },
        {
          id: 'lesson_6',
          title: 'Waste Management Strategies',
          type: 'interactive',
          duration: '25 min',
          completed: false,
          score: 0,
        },
        {
          id: 'lesson_7',
          title: 'Sustainable Consumption',
          type: 'reading',
          duration: '20 min',
          completed: false,
          score: 0,
        },
        {
          id: 'lesson_8',
          title: 'Green Transportation',
          type: 'video',
          duration: '15 min',
          completed: false,
          score: 0,
        },
      ],
      assessments: [
        {
          id: 'assessment_2',
          title: 'Sustainability Practices Quiz',
          type: 'quiz',
          questions: 15,
          passingScore: 75,
          maxAttempts: 3,
          completed: false,
          bestScore: 0,
          attempts: 0,
        },
      ],
      resources: [
        { type: 'pdf', title: 'Sustainability Guide', url: '#' },
        { type: 'calculator', title: 'Carbon Footprint Calculator', url: '#' },
      ],
      progress: {
        completedLessons: 1,
        totalLessons: 4,
        completedAssessments: 0,
        totalAssessments: 1,
        overallScore: 90,
        timeSpent: 18,
        lastAccessDate: '2024-04-20',
      },
      isCompleted: false,
      certificate: null,
    },
  ],
  achievements: [
    {
      id: 'achievement_1',
      title: 'Quick Learner',
      description: 'Complete a course in less than the estimated time',
      type: 'speed',
      icon: '⚡',
      points: 100,
      unlocked: true,
      unlockedDate: '2024-04-15',
      rarity: 'common',
    },
    {
      id: 'achievement_2',
      title: 'Perfect Score',
      description: 'Score 100% on any assessment',
      type: 'excellence',
      icon: '💯',
      points: 150,
      unlocked: false,
      rarity: 'rare',
    },
    {
      id: 'achievement_3',
      title: 'Knowledge Seeker',
      description: 'Complete 5 lessons in a day',
      type: 'engagement',
      icon: '📚',
      points: 200,
      unlocked: true,
      unlockedDate: '2024-04-14',
      rarity: 'uncommon',
    },
    {
      id: 'achievement_4',
      title: 'Path Master',
      description: 'Complete an entire learning path',
      type: 'completion',
      icon: '🎓',
      points: 500,
      unlocked: false,
      rarity: 'epic',
    },
    {
      id: 'achievement_5',
      title: 'Streak Champion',
      description: 'Maintain a 30-day learning streak',
      type: 'consistency',
      icon: '🔥',
      points: 300,
      unlocked: false,
      rarity: 'rare',
    },
  ],
  userProgress: {
    userId: 'user_1',
    totalPoints: 450,
    currentLevel: 4,
    experienceToNext: 550,
    totalExperience: 1000,
    learningStreak: 14,
    totalCoursesCompleted: 1,
    totalPathsCompleted: 0,
    totalCertificatesEarned: 1,
    totalTimeSpent: 93, // hours
    averageScore: 90,
    favoriteCategory: 'Environment',
    learningStyle: 'visual',
    preferredDifficulty: 'intermediate',
    achievements: ['achievement_1', 'achievement_3'],
    badges: ['environmental_champion', 'quick_learner'],
    certificates: ['course_1'],
    weeklyGoals: {
      targetLessons: 5,
      completedLessons: 3,
      targetPoints: 200,
      earnedPoints: 150,
    },
    monthlyGoals: {
      targetCourses: 2,
      completedCourses: 1,
      targetPaths: 1,
      completedPaths: 0,
    },
  },
  leaderboards: {
    weekly: [
      { userId: 'user_1', name: 'Priya Sharma', points: 450, rank: 1, change: '+2' },
      { userId: 'user_2', name: 'Rahul Kumar', points: 380, rank: 2, change: '-1' },
      { userId: 'user_3', name: 'Anita Patel', points: 320, rank: 3, change: '+1' },
    ],
    monthly: [
      { userId: 'user_2', name: 'Rahul Kumar', points: 1250, rank: 1, change: '0' },
      { userId: 'user_1', name: 'Priya Sharma', points: 1100, rank: 2, change: '+3' },
      { userId: 'user_4', name: 'Vikram Singh', points: 980, rank: 3, change: '-1' },
    ],
    allTime: [
      { userId: 'user_5', name: 'Neha Gupta', points: 5800, rank: 1, change: '0' },
      { userId: 'user_6', name: 'Amit Kumar', points: 5200, rank: 2, change: '0' },
      { userId: 'user_7', name: 'Sneha Reddy', points: 4900, rank: 3, change: '+1' },
    ],
  },
  settings: {
    notifications: {
      lessonReminders: true,
      achievementUnlocked: true,
      streakReminders: true,
      newContentAvailable: true,
      leaderboardUpdates: false,
    },
    learning: {
      dailyGoalMinutes: 30,
      weeklyGoalLessons: 5,
      difficultyPreference: 'intermediate',
      autoplayVideos: true,
      downloadForOffline: false,
    },
    privacy: {
      shareProgress: true,
      showInLeaderboards: true,
      publicProfile: false,
    },
  },
};

export const getLearningPaths = (filters = {}) => {
  let paths = LEARNING_DATA.learningPaths;
  
  if (filters.category) {
    paths = paths.filter(path => path.category === filters.category);
  }
  
  if (filters.difficulty) {
    paths = paths.filter(path => path.difficulty === filters.difficulty);
  }
  
  if (filters.enrolled !== undefined) {
    paths = paths.filter(path => path.isEnrolled === filters.enrolled);
  }
  
  if (filters.completed !== undefined) {
    paths = paths.filter(path => path.isCompleted === filters.completed);
  }
  
  return paths;
};

export const getLearningPathById = (id) => {
  return LEARNING_DATA.learningPaths.find(path => path.id === id);
};

export const getCourses = (learningPathId = null) => {
  let courses = LEARNING_DATA.courses;
  
  if (learningPathId) {
    courses = courses.filter(course => course.learningPathId === learningPathId);
  }
  
  return courses.sort((a, b) => a.order - b.order);
};

export const getCourseById = (id) => {
  return LEARNING_DATA.courses.find(course => course.id === id);
};

export const enrollInLearningPath = (pathId) => {
  const path = getLearningPathById(pathId);
  if (!path) {
    return { success: false, message: 'Learning path not found' };
  }
  
  if (path.isEnrolled) {
    return { success: false, message: 'Already enrolled in this path' };
  }
  
  path.isEnrolled = true;
  path.enrollmentDate = new Date().toISOString();
  path.progress = {
    currentCourse: 1,
    completedCourses: 0,
    totalPoints: 0,
    maxPoints: path.rewards.points,
    streakDays: 0,
    estimatedCompletion: calculateEstimatedCompletion(path),
  };
  
  // Update user progress
  LEARNING_DATA.userProgress.totalPathsCompleted += 1;
  
  return { success: true, path };
};

export const startCourse = (courseId) => {
  const course = getCourseById(courseId);
  if (!course) {
    return { success: false, message: 'Course not found' };
  }
  
  if (!course.progress) {
    course.progress = {
      completedLessons: 0,
      totalLessons: course.lessons.length,
      completedAssessments: 0,
      totalAssessments: course.assessments.length,
      overallScore: 0,
      timeSpent: 0,
      lastAccessDate: new Date().toISOString(),
    };
  }
  
  course.progress.lastAccessDate = new Date().toISOString();
  
  return { success: true, course };
};

export const completeLesson = (courseId, lessonId, score = 100) => {
  const course = getCourseById(courseId);
  if (!course) {
    return { success: false, message: 'Course not found' };
  }
  
  const lesson = course.lessons.find(l => l.id === lessonId);
  if (!lesson) {
    return { success: false, message: 'Lesson not found' };
  }
  
  if (lesson.completed) {
    return { success: false, message: 'Lesson already completed' };
  }
  
  lesson.completed = true;
  lesson.score = score;
  lesson.completedAt = new Date().toISOString();
  
  // Update course progress
  course.progress.completedLessons += 1;
  course.progress.overallScore = calculateOverallScore(course);
  course.progress.timeSpent += parseInt(lesson.duration);
  
  // Update user progress
  const pointsEarned = Math.round(score * 0.5);
  LEARNING_DATA.userProgress.totalPoints += pointsEarned;
  LEARNING_DATA.userProgress.totalExperience += pointsEarned;
  
  // Check achievements
  checkAchievements();
  
  // Check if course is completed
  if (course.progress.completedLessons === course.progress.totalLessons) {
    course.isCompleted = true;
    course.completionDate = new Date().toISOString();
    course.certificate = {
      earned: true,
      url: `https://certificates.cipss.com/${courseId}.pdf`,
      shareable: true,
    };
  }
  
  return { success: true, lesson, pointsEarned };
};

export const submitAssessment = (courseId, assessmentId, answers) => {
  const course = getCourseById(courseId);
  if (!course) {
    return { success: false, message: 'Course not found' };
  }
  
  const assessment = course.assessments.find(a => a.id === assessmentId);
  if (!assessment) {
    return { success: false, message: 'Assessment not found' };
  }
  
  // Calculate score (simplified)
  const score = Math.floor(Math.random() * 30) + 70; // 70-100
  
  assessment.attempts += 1;
  assessment.bestScore = Math.max(assessment.bestScore, score);
  
  if (score >= assessment.passingScore) {
    assessment.completed = true;
    course.progress.completedAssessments += 1;
  }
  
  // Update user progress
  const pointsEarned = Math.round(score * 0.8);
  LEARNING_DATA.userProgress.totalPoints += pointsEarned;
  LEARNING_DATA.userProgress.totalExperience += pointsEarned;
  
  return { success: true, score, passed: score >= assessment.passingScore, pointsEarned };
};

const calculateOverallScore = (course) => {
  const completedLessons = course.lessons.filter(l => l.completed);
  if (completedLessons.length === 0) return 0;
  
  const totalScore = completedLessons.reduce((sum, lesson) => sum + lesson.score, 0);
  return Math.round(totalScore / completedLessons.length);
};

const calculateEstimatedCompletion = (path) => {
  const weeks = parseInt(path.duration);
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + (weeks * 7));
  return futureDate.toISOString();
};

const checkAchievements = () => {
  const userProgress = LEARNING_DATA.userProgress;
  
  // Check Quick Learner achievement
  if (!userProgress.achievements.includes('achievement_1')) {
    const completedCourse = LEARNING_DATA.courses.find(c => c.isCompleted);
    if (completedCourse && completedCourse.progress.timeSpent < parseInt(completedCourse.duration) * 60) {
      userProgress.achievements.push('achievement_1');
      const achievement = LEARNING_DATA.achievements.find(a => a.id === 'achievement_1');
      achievement.unlocked = true;
      achievement.unlockedDate = new Date().toISOString();
      userProgress.totalPoints += achievement.points;
    }
  }
  
  // Check Knowledge Seeker achievement
  if (!userProgress.achievements.includes('achievement_3')) {
    const today = new Date().toDateString();
    const lessonsCompletedToday = LEARNING_DATA.courses.reduce((count, course) => {
      return count + course.lessons.filter(lesson => 
        lesson.completed && lesson.completedAt && 
        new Date(lesson.completedAt).toDateString() === today
      ).length;
    }, 0);
    
    if (lessonsCompletedToday >= 5) {
      userProgress.achievements.push('achievement_3');
      const achievement = LEARNING_DATA.achievements.find(a => a.id === 'achievement_3');
      achievement.unlocked = true;
      achievement.unlockedDate = new Date().toISOString();
      userProgress.totalPoints += achievement.points;
    }
  }
};

export const getAchievements = () => {
  return LEARNING_DATA.achievements;
};

export const getUserProgress = () => {
  return LEARNING_DATA.userProgress;
};

export const getLeaderboards = (type = 'weekly') => {
  return LEARNING_DATA.leaderboards[type] || [];
};

export const getLearningSettings = () => {
  return LEARNING_DATA.settings;
};

export const updateLearningSettings = (category, updates) => {
  LEARNING_DATA.settings[category] = { ...LEARNING_DATA.settings[category], ...updates };
  return { success: true, settings: LEARNING_DATA.settings };
};

export const getCertificates = (userId = 'user_1') => {
  const certificates = [];
  
  LEARNING_DATA.courses.forEach(course => {
    if (course.isCompleted && course.certificate) {
      certificates.push({
        id: course.id,
        title: course.title,
        description: course.description,
        certificate: course.certificate,
        completionDate: course.completionDate,
        score: course.progress.overallScore,
      });
    }
  });
  
  LEARNING_DATA.learningPaths.forEach(path => {
    if (path.isCompleted && path.certificate) {
      certificates.push({
        id: path.id,
        title: path.title,
        description: path.description,
        certificate: path.certificate,
        completionDate: path.completionDate,
        score: path.progress ? (path.progress.totalPoints / path.progress.maxPoints) * 100 : 0,
      });
    }
  });
  
  return certificates;
};

export const shareCertificate = (certificateId, platform) => {
  const certificate = getCertificates().find(c => c.id === certificateId);
  if (!certificate) {
    return { success: false, message: 'Certificate not found' };
  }
  
  // Simulate sharing
  return {
    success: true,
    platform,
    url: `https://cipss.com/certificates/share/${certificateId}`,
    message: `Check out my ${certificate.title} certificate! 🎓`,
  };
};

export const getRecommendations = (userId = 'user_1') => {
  const userProgress = LEARNING_DATA.userProgress;
  const enrolledPaths = LEARNING_DATA.learningPaths.filter(p => p.isEnrolled);
  const completedPaths = LEARNING_DATA.learningPaths.filter(p => p.isCompleted);
  
  const recommendations = [];
  
  // Recommend based on interests
  if (userProgress.favoriteCategory === 'Environment') {
    const envPaths = LEARNING_DATA.learningPaths.filter(p => 
      p.category === 'Environment' && !p.isEnrolled
    );
    recommendations.push(...envPaths.slice(0, 2));
  }
  
  // Recommend based on difficulty progression
  const currentDifficulty = userProgress.preferredDifficulty;
  const nextDifficulty = currentDifficulty === 'Beginner' ? 'Intermediate' : 'Advanced';
  const nextPaths = LEARNING_DATA.learningPaths.filter(p => 
    p.difficulty === nextDifficulty && !p.isEnrolled
  );
  recommendations.push(...nextPaths.slice(0, 1));
  
  // Recommend popular paths
  const popularPaths = LEARNING_DATA.learningPaths
    .filter(p => !p.isEnrolled)
    .sort((a, b) => b.enrolledUsers - a.enrolledUsers)
    .slice(0, 2);
  recommendations.push(...popularPaths);
  
  // Remove duplicates and limit
  const uniqueRecommendations = recommendations.filter((path, index, self) =>
    index === self.findIndex((p) => p.id === path.id)
  ).slice(0, 4);
  
  return uniqueRecommendations;
};

export const trackLearningActivity = (activity) => {
  // Track learning analytics
  const analytics = {
    timestamp: new Date().toISOString(),
    userId: 'user_1',
    activity,
  };
  
  // Update streak
  const today = new Date().toDateString();
  const lastActivity = LEARNING_DATA.userProgress.lastActivityDate;
  
  if (lastActivity && new Date(lastActivity).toDateString() !== today) {
    // Check if it's consecutive day
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastActivity && new Date(lastActivity).toDateString() === yesterday.toDateString()) {
      LEARNING_DATA.userProgress.learningStreak += 1;
    } else {
      LEARNING_DATA.userProgress.learningStreak = 1;
    }
  }
  
  LEARNING_DATA.userProgress.lastActivityDate = analytics.timestamp;
  
  return { success: true, analytics };
};
