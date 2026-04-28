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
  ProgressBarAndroid,
  Dimensions,
} from 'react-native';
import {
  getLearningPaths,
  getLearningPathById,
  getCourses,
  getCourseById,
  enrollInLearningPath,
  startCourse,
  completeLesson,
  submitAssessment,
  getAchievements,
  getUserProgress,
  getLeaderboards,
  getLearningSettings,
  updateLearningSettings,
  getCertificates,
  shareCertificate,
  getRecommendations,
  trackLearningActivity,
} from '../services/learningService';

const { width } = Dimensions.get('window');

export default function LearningScreen() {
  const [activeTab, setActiveTab] = useState('paths');
  const [learningPaths, setLearningPaths] = useState(getLearningPaths());
  const [courses, setCourses] = useState(getCourses());
  const [achievements, setAchievements] = useState(getAchievements());
  const [userProgress, setUserProgress] = useState(getUserProgress());
  const [leaderboards, setLeaderboards] = useState(getLeaderboards('weekly'));
  const [settings, setSettings] = useState(getLearningSettings());
  const [certificates, setCertificates] = useState(getCertificates());
  const [recommendations, setRecommendations] = useState(getRecommendations());
  
  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [pathModalVisible, setPathModalVisible] = useState(false);
  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [lessonModalVisible, setLessonModalVisible] = useState(false);
  const [certificateModalVisible, setCertificateModalVisible] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const tabs = [
    { key: 'paths', label: 'Paths', icon: '🛤️' },
    { key: 'courses', label: 'Courses', icon: '📚' },
    { key: 'progress', label: 'Progress', icon: '📊' },
    { key: 'achievements', label: 'Achievements', icon: '🏆' },
    { key: 'leaderboard', label: 'Leaderboard', icon: '🥇' },
  ];

  useEffect(() => {
    // Track learning activity
    trackLearningActivity({ action: 'screen_opened', screen: 'learning' });
  }, []);

  const handleEnrollPath = (pathId) => {
    const result = enrollInLearningPath(pathId);
    if (result.success) {
      Alert.alert('Success', 'Enrolled in learning path!');
      setLearningPaths(getLearningPaths());
      setUserProgress(getUserProgress());
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleStartCourse = (courseId) => {
    const result = startCourse(courseId);
    if (result.success) {
      setSelectedCourse(result.course);
      setCourseModalVisible(true);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleCompleteLesson = (lessonId) => {
    if (!selectedCourse) return;
    
    const result = completeLesson(selectedCourse.id, lessonId);
    if (result.success) {
      Alert.alert('Success', `Lesson completed! Earned ${result.pointsEarned} points`);
      setCourses(getCourses());
      setSelectedCourse(getCourseById(selectedCourse.id));
      setUserProgress(getUserProgress());
      setAchievements(getAchievements());
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleSubmitAssessment = (assessmentId) => {
    if (!selectedCourse) return;
    
    // Simulate assessment submission
    const answers = {}; // Would contain actual answers
    const result = submitAssessment(selectedCourse.id, assessmentId, answers);
    
    if (result.passed) {
      Alert.alert(
        'Assessment Passed!',
        `Score: ${result.score}%\nEarned ${result.pointsEarned} points`
      );
    } else {
      Alert.alert(
        'Assessment Failed',
        `Score: ${result.score}%\nPassing score: 75%\nTry again!`
      );
    }
    
    setCourses(getCourses());
    setSelectedCourse(getCourseById(selectedCourse.id));
    setUserProgress(getUserProgress());
  };

  const handleShareCertificate = (certificateId, platform) => {
    const result = shareCertificate(certificateId, platform);
    if (result.success) {
      Alert.alert('Shared!', `Certificate shared on ${platform}`);
    }
  };

  const renderLearningPathItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.pathCard,
        item.isEnrolled && styles.enrolledPath,
        item.isCompleted && styles.completedPath
      ]}
      onPress={() => {
        setSelectedPath(item);
        setPathModalVisible(true);
      }}
    >
      <View style={styles.pathHeader}>
        <View style={styles.pathInfo}>
          <Text style={styles.pathTitle}>{item.title}</Text>
          <Text style={styles.pathCategory}>{item.category}</Text>
        </View>
        <View style={styles.pathMeta}>
          <Text style={styles.pathDifficulty}>{item.difficulty}</Text>
          <Text style={styles.pathDuration}>{item.duration}</Text>
        </View>
      </View>
      
      <Text style={styles.pathDescription}>{item.description}</Text>
      
      <View style={styles.pathStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.totalCourses}</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.enrolledUsers}</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>⭐ {item.rating}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>
      
      {item.isEnrolled && item.progress && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Progress</Text>
            <Text style={styles.progressPercent}>
              {Math.round((item.progress.completedCourses / item.totalCourses) * 100)}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(item.progress.completedCourses / item.totalCourses) * 100}%` }
              ]}
            />
          </View>
          <Text style={styles.progressDetail}>
            {item.progress.completedCourses}/{item.totalCourses} courses
          </Text>
        </View>
      )}
      
      <View style={styles.pathActions}>
        {item.isEnrolled ? (
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => {
              const nextCourse = getCourses(item.id).find(c => !c.isCompleted);
              if (nextCourse) {
                handleStartCourse(nextCourse.id);
              }
            }}
          >
            <Text style={styles.continueBtnText}>
              {item.isCompleted ? 'Review' : 'Continue'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.enrollBtn}
            onPress={() => handleEnrollPath(item.id)}
          >
            <Text style={styles.enrollBtnText}>Enroll Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.courseCard,
        item.isCompleted && styles.completedCourse
      ]}
      onPress={() => handleStartCourse(item.id)}
    >
      <View style={styles.courseHeader}>
        <Text style={styles.courseTitle}>{item.title}</Text>
        <Text style={styles.courseDifficulty}>{item.difficulty}</Text>
      </View>
      
      <Text style={styles.courseDescription}>{item.description}</Text>
      
      <View style={styles.courseStats}>
        <Text style={styles.courseDuration}>⏰ {item.duration}</Text>
        <Text style={styles.courseLessons}>
          📚 {item.lessons.length} lessons
        </Text>
      </View>
      
      {item.progress && (
        <View style={styles.courseProgress}>
          <Text style={styles.courseProgressText}>
            {item.progress.completedLessons}/{item.progress.totalLessons} completed
          </Text>
          <View style={styles.courseProgressBar}>
            <View
              style={[
                styles.courseProgressFill,
                { width: `${(item.progress.completedLessons / item.progress.totalLessons) * 100}%` }
              ]}
            />
          </View>
        </View>
      )}
      
      <TouchableOpacity style={styles.startCourseBtn}>
        <Text style={styles.startCourseBtnText}>
          {item.isCompleted ? 'Review Course' : 'Start Course'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderAchievementItem = ({ item }) => (
    <View style={[
      styles.achievementCard,
      item.unlocked && styles.unlockedAchievement
    ]}>
      <View style={styles.achievementIcon}>
        <Text style={styles.achievementIconText}>{item.icon}</Text>
      </View>
      <View style={styles.achievementInfo}>
        <Text style={styles.achievementTitle}>{item.title}</Text>
        <Text style={styles.achievementDescription}>{item.description}</Text>
        <Text style={styles.achievementPoints}>+{item.points} points</Text>
      </View>
      <View style={styles.achievementStatus}>
        <Text style={[
          styles.achievementStatusText,
          item.unlocked ? styles.unlockedText : styles.lockedText
        ]}>
          {item.unlocked ? '✓' : '🔒'}
        </Text>
      </View>
    </View>
  );

  const renderLeaderboardItem = ({ item, index }) => (
    <View style={[
      styles.leaderboardItem,
      index === 0 && styles.firstPlace,
      index === 1 && styles.secondPlace,
      index === 2 && styles.thirdPlace
    ]}>
      <View style={styles.rankContainer}>
        <Text style={[
          styles.rankText,
          index === 0 && styles.firstRank,
          index === 1 && styles.secondRank,
          index === 2 && styles.thirdRank
        ]}>
          #{index + 1}
        </Text>
      </View>
      <View style={styles.leaderboardInfo}>
        <Text style={styles.leaderboardName}>{item.name}</Text>
        <Text style={styles.leaderboardPoints}>{item.points} points</Text>
      </View>
      <View style={styles.rankChange}>
        <Text style={[
          styles.changeText,
          item.change.startsWith('+') && styles.positiveChange,
          item.change.startsWith('-') && styles.negativeChange
        ]}>
          {item.change}
        </Text>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'paths':
        return (
          <View style={styles.pathsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🛤️ Learning Paths</Text>
              <Text style={styles.sectionSubtitle}>
                {learningPaths.filter(p => p.isEnrolled).length} enrolled
              </Text>
            </View>
            
            {/* Recommendations */}
            {recommendations.length > 0 && (
              <View style={styles.recommendationsSection}>
                <Text style={styles.recommendationsTitle}>Recommended for You</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 16 }}
                >
                  {recommendations.map((path) => (
                    <TouchableOpacity
                      key={path.id}
                      style={styles.recommendationCard}
                      onPress={() => {
                        setSelectedPath(path);
                        setPathModalVisible(true);
                      }}
                    >
                      <Text style={styles.recommendationTitle}>{path.title}</Text>
                      <Text style={styles.recommendationCategory}>{path.category}</Text>
                      <Text style={styles.recommendationDuration}>{path.duration}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            
            <FlatList
              data={learningPaths}
              keyExtractor={(item) => item.id}
              renderItem={renderLearningPathItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );

      case 'courses':
        return (
          <View style={styles.coursesContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📚 Courses</Text>
              <Text style={styles.sectionSubtitle}>
                {courses.filter(c => c.isCompleted).length} completed
              </Text>
            </View>
            
            <FlatList
              data={courses}
              keyExtractor={(item) => item.id}
              renderItem={renderCourseItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );

      case 'progress':
        return (
          <ScrollView style={styles.progressContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.progressCard}>
              <Text style={styles.progressCardTitle}>Your Learning Journey</Text>
              
              <View style={styles.userStats}>
                <View style={styles.userStatItem}>
                  <Text style={styles.userStatValue}>{userProgress.totalPoints}</Text>
                  <Text style={styles.userStatLabel}>Total Points</Text>
                </View>
                <View style={styles.userStatItem}>
                  <Text style={styles.userStatValue}>Level {userProgress.currentLevel}</Text>
                  <Text style={styles.userStatLabel}>Current Level</Text>
                </View>
                <View style={styles.userStatItem}>
                  <Text style={styles.userStatValue}>{userProgress.learningStreak}</Text>
                  <Text style={styles.userStatLabel}>Day Streak 🔥</Text>
                </View>
              </View>
              
              <View style={styles.experienceSection}>
                <Text style={styles.experienceTitle}>Experience Progress</Text>
                <View style={styles.experienceBar}>
                  <View
                    style={[
                      styles.experienceFill,
                      { width: `${(userProgress.totalExperience / (userProgress.totalExperience + userProgress.experienceToNext)) * 100}%` }
                    ]}
                  />
                </View>
                <Text style={styles.experienceText}>
                  {userProgress.totalExperience} / {userProgress.totalExperience + userProgress.experienceToNext} XP
                </Text>
              </View>
              
              <View style={styles.goalsSection}>
                <Text style={styles.goalsTitle}>Weekly Goals</Text>
                <View style={styles.goalItem}>
                  <Text style={styles.goalText}>Lessons: {userProgress.weeklyGoals.completedLessons}/{userProgress.weeklyGoals.targetLessons}</Text>
                  <View style={styles.goalBar}>
                    <View
                      style={[
                        styles.goalFill,
                        { width: `${(userProgress.weeklyGoals.completedLessons / userProgress.weeklyGoals.targetLessons) * 100}%` }
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.goalItem}>
                  <Text style={styles.goalText}>Points: {userProgress.weeklyGoals.earnedPoints}/{userProgress.weeklyGoals.targetPoints}</Text>
                  <View style={styles.goalBar}>
                    <View
                      style={[
                        styles.goalFill,
                        { width: `${(userProgress.weeklyGoals.earnedPoints / userProgress.weeklyGoals.targetPoints) * 100}%` }
                      ]}
                    />
                  </View>
                </View>
              </View>
              
              <View style={styles.certificatesSection}>
                <Text style={styles.certificatesTitle}>🏆 Your Certificates</Text>
                {certificates.map((cert) => (
                  <TouchableOpacity
                    key={cert.id}
                    style={styles.certificateItem}
                    onPress={() => {
                      setSelectedCertificate(cert);
                      setCertificateModalVisible(true);
                    }}
                  >
                    <Text style={styles.certificateTitle}>{cert.title}</Text>
                    <Text style={styles.certificateDate}>
                      Completed: {new Date(cert.completionDate).toLocaleDateString()}
                    </Text>
                    <Text style={styles.certificateScore}>Score: {cert.score}%</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        );

      case 'achievements':
        return (
          <View style={styles.achievementsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🏆 Achievements</Text>
              <Text style={styles.sectionSubtitle}>
                {achievements.filter(a => a.unlocked).length}/{achievements.length} unlocked
              </Text>
            </View>
            
            <FlatList
              data={achievements}
              keyExtractor={(item) => item.id}
              renderItem={renderAchievementItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );

      case 'leaderboard':
        return (
          <View style={styles.leaderboardContainer}>
            <View style={styles.leaderboardHeader}>
              <Text style={styles.sectionTitle}>🥇 Leaderboard</Text>
              <View style={styles.leaderboardTabs}>
                {['weekly', 'monthly', 'allTime'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.leaderboardTab,
                      leaderboards === getLeaderboards(type) && styles.leaderboardTabActive
                    ]}
                    onPress={() => setLeaderboards(getLeaderboards(type))}
                  >
                    <Text style={[
                      styles.leaderboardTabText,
                      leaderboards === getLeaderboards(type) && styles.leaderboardTabTextActive
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <FlatList
              data={leaderboards}
              keyExtractor={(item, index) => item.userId}
              renderItem={({ item, index }) => renderLeaderboardItem({ item, index })}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>📚 Learning Center</Text>
      
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
      
      {/* Learning Path Modal */}
      <Modal
        visible={pathModalVisible}
        animationType="slide"
        onRequestClose={() => setPathModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setPathModalVisible(false)}>
              <Text style={styles.modalCloseBtn}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Learning Path</Text>
            <View style={styles.placeholder} />
          </View>
          
          {selectedPath && (
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalPathTitle}>{selectedPath.title}</Text>
              <Text style={styles.modalPathDescription}>{selectedPath.description}</Text>
              
              <View style={styles.modalPathStats}>
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatValue}>{selectedPath.totalCourses}</Text>
                  <Text style={styles.modalStatLabel}>Courses</Text>
                </View>
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatValue}>{selectedPath.duration}</Text>
                  <Text style={styles.modalStatLabel}>Duration</Text>
                </View>
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatValue}>⭐ {selectedPath.rating}</Text>
                  <Text style={styles.modalStatLabel}>Rating</Text>
                </View>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Skills You'll Learn</Text>
                {selectedPath.skills.map((skill, index) => (
                  <Text key={index} style={styles.skillItem}>• {skill}</Text>
                ))}
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Career Opportunities</Text>
                {selectedPath.careerPaths.map((career, index) => (
                  <Text key={index} style={styles.careerItem}>• {career}</Text>
                ))}
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Rewards</Text>
                <Text style={styles.rewardItem}>🏆 {selectedPath.rewards.points} points</Text>
                <Text style={styles.rewardItem}>🎖️ {selectedPath.rewards.badges.length} badges</Text>
                <Text style={styles.rewardItem}>📜 Certificate of completion</Text>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.modalEnrollBtn,
                  selectedPath.isEnrolled && styles.modalContinueBtn
                ]}
                onPress={() => {
                  if (selectedPath.isEnrolled) {
                    const nextCourse = getCourses(selectedPath.id).find(c => !c.isCompleted);
                    if (nextCourse) {
                      handleStartCourse(nextCourse.id);
                      setPathModalVisible(false);
                    }
                  } else {
                    handleEnrollPath(selectedPath.id);
                    setPathModalVisible(false);
                  }
                }}
              >
                <Text style={styles.modalEnrollBtnText}>
                  {selectedPath.isEnrolled ? 'Continue Learning' : 'Enroll Now'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
      
      {/* Certificate Modal */}
      <Modal
        visible={certificateModalVisible}
        animationType="slide"
        onRequestClose={() => setCertificateModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setCertificateModalVisible(false)}>
              <Text style={styles.modalCloseBtn}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Certificate</Text>
            <View style={styles.placeholder} />
          </View>
          
          {selectedCertificate && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.certificatePreview}>
                <Text style={styles.certificatePreviewTitle}>Certificate of Completion</Text>
                <Text style={styles.certificatePreviewName}>{selectedCertificate.title}</Text>
                <Text style={styles.certificatePreviewDescription}>{selectedCertificate.description}</Text>
                <Text style={styles.certificatePreviewScore}>Score: {selectedCertificate.score}%</Text>
                <Text style={styles.certificatePreviewDate}>
                  Completed on {new Date(selectedCertificate.completionDate).toLocaleDateString()}
                </Text>
              </View>
              
              <View style={styles.certificateActions}>
                <TouchableOpacity
                  style={styles.shareCertificateBtn}
                  onPress={() => handleShareCertificate(selectedCertificate.id, 'linkedin')}
                >
                  <Text style={styles.shareCertificateBtnText}>Share on LinkedIn</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.shareCertificateBtn}
                  onPress={() => handleShareCertificate(selectedCertificate.id, 'twitter')}
                >
                  <Text style={styles.shareCertificateBtnText}>Share on Twitter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.downloadCertificateBtn}
                  onPress={() => Alert.alert('Download', 'Certificate downloaded!')}
                >
                  <Text style={styles.downloadCertificateBtnText}>Download PDF</Text>
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

  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },

  listContainer: {
    padding: 16,
  },

  pathsContainer: {
    flex: 1,
  },

  pathCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#E5E7EB',
  },

  enrolledPath: {
    borderLeftColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },

  completedPath: {
    borderLeftColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },

  pathHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  pathInfo: {
    flex: 1,
  },

  pathTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  pathCategory: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },

  pathMeta: {
    alignItems: 'flex-end',
  },

  pathDifficulty: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },

  pathDuration: {
    fontSize: 12,
    color: '#6B7280',
  },

  pathDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },

  pathStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },

  statItem: {
    alignItems: 'center',
  },

  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },

  progressSection: {
    marginBottom: 16,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D0A69',
  },

  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 4,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#1D0A69',
    borderRadius: 4,
  },

  progressDetail: {
    fontSize: 12,
    color: '#6B7280',
  },

  pathActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  continueBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  enrollBtn: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  enrollBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  recommendationsSection: {
    marginBottom: 16,
  },

  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  recommendationCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    elevation: 1,
    width: 160,
  },

  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  recommendationCategory: {
    fontSize: 12,
    color: '#3B82F6',
    marginBottom: 2,
  },

  recommendationDuration: {
    fontSize: 11,
    color: '#6B7280',
  },

  coursesContainer: {
    flex: 1,
  },

  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },

  completedCourse: {
    borderLeftWidth: 3,
    borderLeftColor: '#22C55E',
  },

  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    flex: 1,
  },

  courseDifficulty: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  courseDescription: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 12,
  },

  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  courseDuration: {
    fontSize: 12,
    color: '#6B7280',
  },

  courseLessons: {
    fontSize: 12,
    color: '#6B7280',
  },

  courseProgress: {
    marginBottom: 12,
  },

  courseProgressText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  courseProgressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },

  courseProgressFill: {
    height: '100%',
    backgroundColor: '#1D0A69',
    borderRadius: 3,
  },

  startCourseBtn: {
    backgroundColor: '#1D0A69',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  startCourseBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  progressContainer: {
    flex: 1,
    padding: 16,
  },

  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },

  progressCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 20,
    textAlign: 'center',
  },

  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },

  userStatItem: {
    alignItems: 'center',
  },

  userStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 4,
  },

  userStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },

  experienceSection: {
    marginBottom: 24,
  },

  experienceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },

  experienceBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    marginBottom: 4,
  },

  experienceFill: {
    height: '100%',
    backgroundColor: '#1D0A69',
    borderRadius: 6,
  },

  experienceText: {
    fontSize: 12,
    color: '#6B7280',
  },

  goalsSection: {
    marginBottom: 24,
  },

  goalsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  goalItem: {
    marginBottom: 12,
  },

  goalText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },

  goalBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },

  goalFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 4,
  },

  certificatesSection: {
    marginBottom: 20,
  },

  certificatesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  certificateItem: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },

  certificateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  certificateDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },

  certificateScore: {
    fontSize: 12,
    color: '#22C55E',
  },

  achievementsContainer: {
    flex: 1,
  },

  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },

  unlockedAchievement: {
    borderLeftWidth: 3,
    borderLeftColor: '#1D0A69',
  },

  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  achievementIconText: {
    fontSize: 24,
  },

  achievementInfo: {
    flex: 1,
  },

  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  achievementDescription: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 4,
  },

  achievementPoints: {
    fontSize: 12,
    color: '#1D0A69',
    fontWeight: '500',
  },

  achievementStatus: {
    alignItems: 'center',
  },

  achievementStatusText: {
    fontSize: 20,
    fontWeight: '700',
  },

  unlockedText: {
    color: '#22C55E',
  },

  lockedText: {
    color: '#9CA3AF',
  },

  leaderboardContainer: {
    flex: 1,
  },

  leaderboardHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  leaderboardTabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },

  leaderboardTab: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },

  leaderboardTabActive: {
    backgroundColor: '#FFFFFF',
  },

  leaderboardTabText: {
    fontSize: 12,
    color: '#6B7280',
  },

  leaderboardTabTextActive: {
    color: '#1A1A2E',
    fontWeight: '600',
  },

  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 1,
  },

  firstPlace: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },

  secondPlace: {
    borderLeftWidth: 4,
    borderLeftColor: '#C0C0C0',
  },

  thirdPlace: {
    borderLeftWidth: 4,
    borderLeftColor: '#CD7F32',
  },

  rankContainer: {
    width: 40,
    alignItems: 'center',
  },

  rankText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },

  firstRank: {
    color: '#FFD700',
  },

  secondRank: {
    color: '#C0C0C0',
  },

  thirdRank: {
    color: '#CD7F32',
  },

  leaderboardInfo: {
    flex: 1,
    marginLeft: 12,
  },

  leaderboardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  leaderboardPoints: {
    fontSize: 14,
    color: '#6B7280',
  },

  rankChange: {
    alignItems: 'flex-end',
  },

  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },

  positiveChange: {
    color: '#22C55E',
  },

  negativeChange: {
    color: '#EF4444',
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

  modalPathTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  modalPathDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
  },

  modalPathStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },

  modalStatItem: {
    alignItems: 'center',
  },

  modalStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 4,
  },

  modalStatLabel: {
    fontSize: 12,
    color: '#6B7280',
  },

  modalSection: {
    marginBottom: 24,
  },

  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  skillItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },

  careerItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },

  rewardItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },

  modalEnrollBtn: {
    backgroundColor: '#22C55E',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  modalContinueBtn: {
    backgroundColor: '#1D0A69',
  },

  modalEnrollBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  certificatePreview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    elevation: 2,
    alignItems: 'center',
  },

  certificatePreviewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 16,
  },

  certificatePreviewName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
    textAlign: 'center',
  },

  certificatePreviewDescription: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 16,
  },

  certificatePreviewScore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22C55E',
    marginBottom: 8,
  },

  certificatePreviewDate: {
    fontSize: 14,
    color: '#6B7280',
  },

  certificateActions: {
    gap: 12,
  },

  shareCertificateBtn: {
    backgroundColor: '#1D0A69',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  shareCertificateBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  downloadCertificateBtn: {
    backgroundColor: '#22C55E',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  downloadCertificateBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
