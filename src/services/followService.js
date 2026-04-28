// Follow system for users
export const FOLLOW_DATA = {
  following: [
    { userId: 'user_2', userName: 'Priya Patel', followDate: '2024-04-15' },
    { userId: 'user_5', userName: 'Amit Kumar', followDate: '2024-04-12' },
    { userId: 'user_8', userName: 'Sneha Reddy', followDate: '2024-04-10' },
  ],
  followers: [
    { userId: 'user_1', userName: 'Rahul Sharma', followDate: '2024-04-18' },
    { userId: 'user_3', userName: 'Anjali Gupta', followDate: '2024-04-16' },
    { userId: 'user_4', userName: 'Vikram Singh', followDate: '2024-04-14' },
    { userId: 'user_7', userName: 'Neha Joshi', followDate: '2024-04-11' },
  ],
  followRequests: [
    { userId: 'user_9', userName: 'Rohit Verma', requestDate: '2024-04-20', status: 'pending' },
  ],
  suggestedUsers: [
    { 
      userId: 'user_10', 
      userName: 'Kavita Nair', 
      rank: 5, 
      campaigns: 15, 
      points: 1800,
      mutualFollowers: 3,
      reason: 'Top performer with similar interests'
    },
    { 
      userId: 'user_11', 
      userName: 'Arjun Mehta', 
      rank: 8, 
      campaigns: 12, 
      points: 1200,
      mutualFollowers: 2,
      reason: 'Follows 3 people you follow'
    },
    { 
      userId: 'user_12', 
      userName: 'Divya Sharma', 
      rank: 12, 
      campaigns: 10, 
      points: 950,
      mutualFollowers: 1,
      reason: 'Environmental campaigns expert'
    },
    { 
      userId: 'user_13', 
      userName: 'Mohammed Ali', 
      rank: 15, 
      campaigns: 8, 
      points: 800,
      mutualFollowers: 0,
      reason: 'Rising star in education'
    },
  ],
};

export const followUser = (userId, userName) => {
  // Check if already following
  const isAlreadyFollowing = FOLLOW_DATA.following.some(f => f.userId === userId);
  if (isAlreadyFollowing) {
    return { success: false, message: 'You are already following this user' };
  }

  // Add to following list
  FOLLOW_DATA.following.push({
    userId,
    userName,
    followDate: new Date().toISOString().split('T')[0],
  });

  // Remove from suggested if present
  FOLLOW_DATA.suggestedUsers = FOLLOW_DATA.suggestedUsers.filter(u => u.userId !== userId);

  return { success: true, message: `You are now following ${userName}` };
};

export const unfollowUser = (userId, userName) => {
  const index = FOLLOW_DATA.following.findIndex(f => f.userId === userId);
  if (index === -1) {
    return { success: false, message: 'You are not following this user' };
  }

  FOLLOW_DATA.following.splice(index, 1);
  return { success: true, message: `You unfollowed ${userName}` };
};

export const acceptFollowRequest = (userId, userName) => {
  const requestIndex = FOLLOW_DATA.followRequests.findIndex(r => r.userId === userId);
  if (requestIndex === -1) {
    return { success: false, message: 'Follow request not found' };
  }

  // Remove from requests and add to followers
  FOLLOW_DATA.followRequests.splice(requestIndex, 1);
  FOLLOW_DATA.followers.push({
    userId,
    userName,
    followDate: new Date().toISOString().split('T')[0],
  });

  return { success: true, message: `${userName} is now following you` };
};

export const rejectFollowRequest = (userId, userName) => {
  const requestIndex = FOLLOW_DATA.followRequests.findIndex(r => r.userId === userId);
  if (requestIndex === -1) {
    return { success: false, message: 'Follow request not found' };
  }

  FOLLOW_DATA.followRequests.splice(requestIndex, 1);
  return { success: true, message: `Follow request from ${userName} rejected` };
};

export const sendFollowRequest = (userId, userName) => {
  // Check if request already exists
  const existingRequest = FOLLOW_DATA.followRequests.find(r => r.userId === userId);
  if (existingRequest) {
    return { success: false, message: 'Follow request already sent' };
  }

  // Check if already following
  const isAlreadyFollowing = FOLLOW_DATA.following.some(f => f.userId === userId);
  if (isAlreadyFollowing) {
    return { success: false, message: 'You are already following this user' };
  }

  FOLLOW_DATA.followRequests.push({
    userId,
    userName,
    requestDate: new Date().toISOString().split('T')[0],
    status: 'pending',
  });

  return { success: true, message: `Follow request sent to ${userName}` };
};

export const getFollowStats = () => {
  return {
    followingCount: FOLLOW_DATA.following.length,
    followersCount: FOLLOW_DATA.followers.length,
    pendingRequestsCount: FOLLOW_DATA.followRequests.length,
  };
};

export const getMutualFollowers = (userId) => {
  // This would normally check against a database
  // For demo, return random mutual followers count
  const mutualCount = Math.floor(Math.random() * 5) + 1;
  return mutualCount;
};

export const isFollowing = (userId) => {
  return FOLLOW_DATA.following.some(f => f.userId === userId);
};

export const isFollowedBy = (userId) => {
  return FOLLOW_DATA.followers.some(f => f.userId === userId);
};
