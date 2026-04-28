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
  Modal,
} from 'react-native';
import { 
  TEAM_DATA, 
  joinTeam, 
  leaveTeam, 
  createTeam, 
  getTeamStats,
  getTeamMembers,
  getTeamChallenges
} from '../services/teamService';

export default function TeamLeaderboardScreen() {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');

  const tabs = [
    { key: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { key: 'myTeams', label: 'My Teams', icon: '👥' },
    { key: 'suggested', label: 'Suggested', icon: '✨' },
  ];

  const teamStats = getTeamStats();

  const handleJoinTeam = (teamId, teamName) => {
    const result = joinTeam(teamId, teamName);
    Alert.alert(result.success ? 'Success' : 'Error', result.message);
  };

  const handleLeaveTeam = (teamId, teamName) => {
    Alert.alert(
      'Leave Team',
      `Are you sure you want to leave ${teamName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Leave', 
          style: 'destructive',
          onPress: () => {
            const result = leaveTeam(teamId, teamName);
            Alert.alert(result.success ? 'Success' : 'Error', result.message);
          }
        }
      ]
    );
  };

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      Alert.alert('Error', 'Please enter a team name');
      return;
    }

    const result = createTeam(newTeamName, newTeamDescription, '🆕');
    if (result.success) {
      Alert.alert('Success', result.message);
      setNewTeamName('');
      setNewTeamDescription('');
      setShowCreateModal(false);
    }
  };

  const renderTeamLeaderboardItem = ({ item }) => {
    const isMyTeam = TEAM_DATA.myTeams.some(team => team.id === item.id);
    
    return (
      <View style={[
        styles.teamCard,
        item.rank <= 3 && styles.topRankedTeam,
        isMyTeam && styles.myTeamCard
      ]}>
        <View style={styles.teamHeader}>
          <Text style={styles.teamRank}>#{item.rank}</Text>
          <Text style={styles.teamIcon}>{item.icon}</Text>
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{item.name}</Text>
            <Text style={styles.teamDescription}>{item.description}</Text>
          </View>
          <Text style={styles.teamBadge}>{item.badge}</Text>
        </View>

        <View style={styles.teamStats}>
          <View style={styles.teamStat}>
            <Text style={styles.teamStatValue}>{item.members}</Text>
            <Text style={styles.teamStatLabel}>Members</Text>
          </View>
          <View style={styles.teamStat}>
            <Text style={styles.teamStatValue}>{item.points.toLocaleString()}</Text>
            <Text style={styles.teamStatLabel}>Points</Text>
          </View>
          <View style={styles.teamStat}>
            <Text style={styles.teamStatValue}>{item.avgContribution}</Text>
            <Text style={styles.teamStatLabel}>Avg/Member</Text>
          </View>
        </View>

        <View style={styles.teamFooter}>
          <Text style={styles.topContributor}>Top: {item.topContributor}</Text>
          <TouchableOpacity
            style={styles.viewTeamBtn}
            onPress={() => setSelectedTeam(item)}
          >
            <Text style={styles.viewTeamBtnText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderMyTeamItem = ({ item }) => {
    const teamMembers = getTeamMembers(item.id);
    const teamChallenges = getTeamChallenges(item.id);
    
    return (
      <View style={[styles.teamCard, styles.myTeamCard]}>
        <View style={styles.teamHeader}>
          <Text style={styles.teamRank}>#{item.rank}</Text>
          <Text style={styles.teamIcon}>{item.icon}</Text>
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{item.name}</Text>
            <Text style={styles.teamDescription}>{item.description}</Text>
            <Text style={styles.teamRole}>Role: {item.role}</Text>
          </View>
          <Text style={styles.teamBadge}>{item.badge}</Text>
        </View>

        <View style={styles.teamStats}>
          <View style={styles.teamStat}>
            <Text style={styles.teamStatValue}>{item.members}</Text>
            <Text style={styles.teamStatLabel}>Members</Text>
          </View>
          <View style={styles.teamStat}>
            <Text style={styles.teamStatValue}>{item.points.toLocaleString()}</Text>
            <Text style={styles.teamStatLabel}>Points</Text>
          </View>
          <View style={styles.teamStat}>
            <Text style={styles.teamStatValue}>{teamChallenges.length}</Text>
            <Text style={styles.teamStatLabel}>Challenges</Text>
          </View>
        </View>

        <View style={styles.teamActions}>
          <TouchableOpacity
            style={styles.viewTeamBtn}
            onPress={() => setSelectedTeam(item)}
          >
            <Text style={styles.viewTeamBtnText}>View Team</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.leaveTeamBtn}
            onPress={() => handleLeaveTeam(item.id, item.name)}
          >
            <Text style={styles.leaveTeamBtnText}>Leave</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSuggestedTeamItem = ({ item }) => (
    <View style={styles.teamCard}>
      <View style={styles.teamHeader}>
        <Text style={styles.teamRank}>#{item.rank}</Text>
        <Text style={styles.teamIcon}>{item.icon}</Text>
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{item.name}</Text>
          <Text style={styles.teamDescription}>{item.description}</Text>
          <Text style={styles.joinReason}>{item.joinReason}</Text>
          {item.mutualMembers > 0 && (
            <Text style={styles.mutualMembers}>{item.mutualMembers} mutual members</Text>
          )}
        </View>
        <Text style={styles.teamBadge}>{item.badge}</Text>
      </View>

      <View style={styles.teamStats}>
        <View style={styles.teamStat}>
          <Text style={styles.teamStatValue}>{item.members}</Text>
          <Text style={styles.teamStatLabel}>Members</Text>
        </View>
        <View style={styles.teamStat}>
          <Text style={styles.teamStatValue}>{item.points.toLocaleString()}</Text>
          <Text style={styles.teamStatLabel}>Points</Text>
        </View>
        <View style={styles.teamStat}>
          <Text style={styles.teamStatValue}>#{item.rank}</Text>
          <Text style={styles.teamStatLabel}>Rank</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.joinTeamBtn}
        onPress={() => handleJoinTeam(item.id, item.name)}
      >
        <Text style={styles.joinTeamBtnText}>Join Team</Text>
      </TouchableOpacity>
    </View>
  );

  const getDataByTab = () => {
    switch (activeTab) {
      case 'leaderboard':
        return TEAM_DATA.teamLeaderboard;
      case 'myTeams':
        return TEAM_DATA.myTeams;
      case 'suggested':
        return TEAM_DATA.suggestedTeams;
      default:
        return [];
    }
  };

  const getRenderItem = () => {
    switch (activeTab) {
      case 'leaderboard':
        return renderTeamLeaderboardItem;
      case 'myTeams':
        return renderMyTeamItem;
      case 'suggested':
        return renderSuggestedTeamItem;
      default:
        return renderTeamLeaderboardItem;
    }
  };

  const filteredData = getDataByTab().filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTeamDetail = () => {
    if (!selectedTeam) return null;

    const teamMembers = getTeamMembers(selectedTeam.id);
    const teamChallenges = getTeamChallenges(selectedTeam.id);
    const isMyTeam = TEAM_DATA.myTeams.some(team => team.id === selectedTeam.id);

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalIcon}>{selectedTeam.icon}</Text>
          <Text style={styles.modalTitle}>{selectedTeam.name}</Text>
          <Text style={styles.modalDescription}>{selectedTeam.description}</Text>
          
          <View style={styles.modalStats}>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatValue}>#{selectedTeam.rank}</Text>
              <Text style={styles.modalStatLabel}>Rank</Text>
            </View>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatValue}>{selectedTeam.members}</Text>
              <Text style={styles.modalStatLabel}>Members</Text>
            </View>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatValue}>{selectedTeam.points.toLocaleString()}</Text>
              <Text style={styles.modalStatLabel}>Points</Text>
            </View>
          </View>

          {/* Team Members */}
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Team Members</Text>
            {teamMembers.map((member, index) => (
              <View key={index} style={styles.memberItem}>
                <Text style={styles.memberName}>{member.userName}</Text>
                <Text style={styles.memberPoints}>{member.points} pts</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
              </View>
            ))}
          </View>

          {/* Team Challenges */}
          {teamChallenges.length > 0 && (
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Active Challenges</Text>
              {teamChallenges.map((challenge, index) => (
                <View key={index} style={styles.challengeItem}>
                  <Text style={styles.challengeTitle}>{challenge.title}</Text>
                  <Text style={styles.challengeProgress}>
                    {challenge.progress}/{challenge.total}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={() => setSelectedTeam(null)}
          >
            <Text style={styles.modalCloseBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🏆 Team Leaderboard</Text>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{teamStats.teamsCount}</Text>
            <Text style={styles.statLabel}>My Teams</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{teamStats.totalPoints.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>#{teamStats.bestRank}</Text>
            <Text style={styles.statLabel}>Best Rank</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search teams..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Tabs */}
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

        {/* List */}
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => `${activeTab}_${item.id || index}`}
          renderItem={getRenderItem()}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />

        {/* Create Team Button */}
        {activeTab === 'myTeams' && (
          <TouchableOpacity
            style={styles.createTeamBtn}
            onPress={() => setShowCreateModal(true)}
          >
            <Text style={styles.createTeamBtnText}>+ Create New Team</Text>
          </TouchableOpacity>
        )}

        {/* Create Team Modal */}
        {showCreateModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Create New Team</Text>
              
              <TextInput
                style={styles.modalInput}
                placeholder="Team Name"
                value={newTeamName}
                onChangeText={setNewTeamName}
              />
              
              <TextInput
                style={[styles.modalInput, styles.modalTextArea]}
                placeholder="Team Description"
                value={newTeamDescription}
                onChangeText={setNewTeamDescription}
                multiline
                numberOfLines={3}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => {
                    setShowCreateModal(false);
                    setNewTeamName('');
                    setNewTeamDescription('');
                  }}
                >
                  <Text style={styles.modalCancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalCreateBtn}
                  onPress={handleCreateTeam}
                >
                  <Text style={styles.modalCreateBtnText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Team Detail Modal */}
        {renderTeamDetail()}
      </ScrollView>
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

  statsCard: {
    backgroundColor: '#1D0A69',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  statItem: {
    alignItems: 'center',
  },

  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: '#E5E7EB',
  },

  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },

  tab: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    paddingVertical: 12,
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
    fontSize: 16,
    marginBottom: 4,
  },

  tabLabel: {
    fontSize: 10,
    color: '#6B7280',
  },

  tabLabelActive: {
    color: '#FFFFFF',
  },

  teamCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },

  topRankedTeam: {
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },

  myTeamCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#22C55E',
  },

  teamHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  teamRank: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D0A69',
    marginRight: 12,
    minWidth: 40,
  },

  teamIcon: {
    fontSize: 32,
    marginRight: 12,
  },

  teamInfo: {
    flex: 1,
  },

  teamName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  teamDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },

  teamRole: {
    fontSize: 11,
    color: '#22C55E',
    fontWeight: '600',
  },

  joinReason: {
    fontSize: 11,
    color: '#F59E0B',
    fontStyle: 'italic',
    marginBottom: 2,
  },

  mutualMembers: {
    fontSize: 11,
    color: '#3B82F6',
  },

  teamBadge: {
    fontSize: 20,
  },

  teamStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },

  teamStat: {
    alignItems: 'center',
  },

  teamStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  teamStatLabel: {
    fontSize: 10,
    color: '#6B7280',
  },

  teamFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  topContributor: {
    fontSize: 12,
    color: '#6B7280',
  },

  viewTeamBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },

  viewTeamBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  teamActions: {
    flexDirection: 'row',
    gap: 8,
  },

  leaveTeamBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },

  leaveTeamBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },

  joinTeamBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },

  joinTeamBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  createTeamBtn: {
    backgroundColor: '#22C55E',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  createTeamBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },

  modalIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
    textAlign: 'center',
  },

  modalDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },

  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },

  modalStat: {
    alignItems: 'center',
  },

  modalStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 4,
  },

  modalStatLabel: {
    fontSize: 12,
    color: '#6B7280',
  },

  modalSection: {
    marginBottom: 20,
  },

  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  memberName: {
    fontSize: 14,
    color: '#1A1A2E',
    flex: 1,
  },

  memberPoints: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D0A69',
    marginRight: 12,
  },

  memberRole: {
    fontSize: 11,
    color: '#6B7280',
  },

  challengeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  challengeTitle: {
    fontSize: 13,
    color: '#1A1A2E',
    flex: 1,
  },

  challengeProgress: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },

  modalInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },

  modalTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },

  modalActions: {
    flexDirection: 'row',
    gap: 8,
  },

  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },

  modalCancelBtnText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },

  modalCreateBtn: {
    flex: 1,
    backgroundColor: '#1D0A69',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },

  modalCreateBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  modalCloseBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },

  modalCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
