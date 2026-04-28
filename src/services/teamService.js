// Team leaderboards system
export const TEAM_DATA = {
  myTeams: [
    {
      id: 'team_1',
      name: 'Eco Warriors',
      description: 'Environmental conservation champions',
      icon: '🌱',
      members: 12,
      points: 8500,
      rank: 3,
      badge: '🌟',
      joinDate: '2024-03-15',
      role: 'member',
    },
    {
      id: 'team_2',
      name: 'Education First',
      description: 'Teaching and mentoring initiatives',
      icon: '📚',
      members: 8,
      points: 3200,
      rank: 15,
      badge: '🎓',
      joinDate: '2024-04-01',
      role: 'admin',
    },
  ],
  teamLeaderboard: [
    {
      id: 'team_1',
      name: 'Green Earth Initiative',
      description: 'Leading environmental action team',
      icon: '🌍',
      members: 25,
      points: 15420,
      rank: 1,
      badge: '👑',
      topContributor: 'Rahul Sharma',
      avgContribution: 617,
    },
    {
      id: 'team_2',
      name: 'Tech for Good',
      description: 'Technology-driven social impact',
      icon: '💻',
      members: 18,
      points: 12300,
      rank: 2,
      badge: '🏆',
      topContributor: 'Priya Patel',
      avgContribution: 683,
    },
    {
      id: 'team_3',
      name: 'Eco Warriors',
      description: 'Environmental conservation champions',
      icon: '🌱',
      members: 12,
      points: 8500,
      rank: 3,
      badge: '🌟',
      topContributor: 'You',
      avgContribution: 708,
    },
    {
      id: 'team_4',
      name: 'Health Heroes',
      description: 'Medical and health initiatives',
      icon: '💊',
      members: 15,
      points: 7200,
      rank: 4,
      badge: '💚',
      topContributor: 'Amit Kumar',
      avgContribution: 480,
    },
    {
      id: 'team_5',
      name: 'Community Builders',
      description: 'Local community development',
      icon: '🏘️',
      members: 20,
      points: 6800,
      rank: 5,
      badge: '🤝',
      topContributor: 'Sneha Reddy',
      avgContribution: 340,
    },
    {
      id: 'team_6',
      name: 'Youth United',
      description: 'Young leaders making change',
      icon: '🎯',
      members: 30,
      points: 5500,
      rank: 6,
      badge: '⭐',
      topContributor: 'Vikram Singh',
      avgContribution: 183,
    },
    {
      id: 'team_7',
      name: 'Education First',
      description: 'Teaching and mentoring initiatives',
      icon: '📚',
      members: 8,
      points: 3200,
      rank: 15,
      badge: '🎓',
      topContributor: 'You',
      avgContribution: 400,
    },
  ],
  suggestedTeams: [
    {
      id: 'team_8',
      name: 'Ocean Protectors',
      description: 'Marine conservation and cleanup',
      icon: '🌊',
      members: 16,
      points: 4500,
      rank: 8,
      badge: '🐠',
      joinReason: 'Matches your environmental interests',
      mutualMembers: 2,
    },
    {
      id: 'team_9',
      name: 'Digital Divide Bridge',
      description: 'Bringing technology to underserved communities',
      icon: '📱',
      members: 12,
      points: 3800,
      rank: 10,
      badge: '📡',
      joinReason: '3 team members follow you',
      mutualMembers: 3,
    },
    {
      id: 'team_10',
      name: 'Climate Action Now',
      description: 'Climate change advocacy and action',
      icon: '🌡️',
      members: 22,
      points: 5900,
      rank: 7,
      badge: '🌡️',
      joinReason: 'Top team in climate initiatives',
      mutualMembers: 1,
    },
  ],
  teamMembers: {
    team_1: [
      { userId: 'user_1', userName: 'Rahul Sharma', points: 1200, contribution: 'Environmental campaigns', role: 'leader' },
      { userId: 'user_current', userName: 'You', points: 850, contribution: 'Waste management', role: 'member' },
      { userId: 'user_2', userName: 'Priya Patel', points: 920, contribution: 'Tree plantation', role: 'member' },
      { userId: 'user_3', userName: 'Amit Kumar', points: 780, contribution: 'Recycling drives', role: 'member' },
    ],
    team_2: [
      { userId: 'user_current', userName: 'You', points: 650, contribution: 'Teaching sessions', role: 'admin' },
      { userId: 'user_4', userName: 'Sneha Reddy', points: 890, contribution: 'Mentoring', role: 'leader' },
      { userId: 'user_5', userName: 'Vikram Singh', points: 720, contribution: 'Study materials', role: 'member' },
    ],
  },
  teamChallenges: [
    {
      id: 'challenge_1',
      title: 'Team Earth Day Challenge',
      description: 'Complete 50 environmental activities as a team',
      icon: '🌍',
      teamId: 'team_1',
      progress: 32,
      total: 50,
      reward: '🏆 +2000 team points',
      deadline: '2024-04-30',
      participants: 8,
    },
    {
      id: 'challenge_2',
      title: 'Education Marathon',
      description: 'Teach 100 students collectively',
      icon: '📚',
      teamId: 'team_2',
      progress: 45,
      total: 100,
      reward: '🎓 +1500 team points',
      deadline: '2024-05-15',
      participants: 6,
    },
  ],
};

export const joinTeam = (teamId, teamName) => {
  const team = TEAM_DATA.suggestedTeams.find(t => t.id === teamId);
  if (!team) return { success: false, message: 'Team not found' };

  // Add to my teams
  TEAM_DATA.myTeams.push({
    id: teamId,
    name: teamName,
    description: team.description,
    icon: team.icon,
    members: team.members,
    points: team.points,
    rank: team.rank,
    badge: team.badge,
    joinDate: new Date().toISOString().split('T')[0],
    role: 'member',
  });

  // Remove from suggested
  TEAM_DATA.suggestedTeams = TEAM_DATA.suggestedTeams.filter(t => t.id !== teamId);

  return { success: true, message: `You joined ${teamName}!` };
};

export const leaveTeam = (teamId, teamName) => {
  const index = TEAM_DATA.myTeams.findIndex(t => t.id === teamId);
  if (index === -1) return { success: false, message: 'Team not found' };

  TEAM_DATA.myTeams.splice(index, 1);
  return { success: true, message: `You left ${teamName}` };
};

export const createTeam = (teamName, description, icon) => {
  const newTeam = {
    id: `team_${Date.now()}`,
    name: teamName,
    description,
    icon,
    members: 1,
    points: 0,
    rank: TEAM_DATA.teamLeaderboard.length + 1,
    badge: '🆕',
    joinDate: new Date().toISOString().split('T')[0],
    role: 'leader',
  };

  TEAM_DATA.myTeams.push(newTeam);
  return { success: true, message: `Team "${teamName}" created!`, team: newTeam };
};

export const getTeamStats = () => {
  const totalPoints = TEAM_DATA.myTeams.reduce((sum, team) => sum + team.points, 0);
  const bestRank = Math.min(...TEAM_DATA.myTeams.map(team => team.rank));
  
  return {
    teamsCount: TEAM_DATA.myTeams.length,
    totalPoints,
    bestRank,
    totalMembers: TEAM_DATA.myTeams.reduce((sum, team) => sum + team.members, 0),
  };
};

export const getTeamMembers = (teamId) => {
  return TEAM_DATA.teamMembers[teamId] || [];
};

export const getTeamChallenges = (teamId) => {
  return TEAM_DATA.teamChallenges.filter(challenge => challenge.teamId === teamId);
};
