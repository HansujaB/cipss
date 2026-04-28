// Comments and reactions system
export const COMMENTS_DATA = {
  campaignComments: {
    campaign_1: [
      {
        id: 'comment_1',
        userId: 'user_1',
        userName: 'Rahul Sharma',
        userAvatar: '👤',
        content: 'This is such an important initiative! Count me in for the cleanup drive.',
        timestamp: '2024-04-20T10:30:00',
        likes: 12,
        replies: [
          {
            id: 'reply_1',
            userId: 'user_2',
            userName: 'Priya Patel',
            userAvatar: '👤',
            content: 'Great! Let\'s coordinate on logistics.',
            timestamp: '2024-04-20T11:15:00',
            likes: 3,
          }
        ],
        userLiked: false,
      },
      {
        id: 'comment_2',
        userId: 'user_3',
        userName: 'Amit Kumar',
        userAvatar: '👤',
        content: 'I participated last month and it was incredibly rewarding. Highly recommend!',
        timestamp: '2024-04-19T15:45:00',
        likes: 8,
        replies: [],
        userLiked: true,
      },
    ],
    campaign_2: [
      {
        id: 'comment_3',
        userId: 'user_4',
        userName: 'Sneha Reddy',
        userAvatar: '👤',
        content: 'Teaching these kids has been life-changing. The smiles are worth everything!',
        timestamp: '2024-04-18T09:20:00',
        likes: 15,
        replies: [
          {
            id: 'reply_2',
            userId: 'user_current',
            userName: 'You',
            userAvatar: '👤',
            content: 'Absolutely! The impact we\'re making is incredible.',
            timestamp: '2024-04-18T10:00:00',
            likes: 5,
          }
        ],
        userLiked: false,
      },
    ],
  },
  achievementComments: {
    achievement_1: [
      {
        id: 'comment_4',
        userId: 'user_5',
        userName: 'Vikram Singh',
        userAvatar: '👤',
        content: 'Congratulations on the Eco Warrior badge! Well deserved! 🌟',
        timestamp: '2024-04-17T14:30:00',
        likes: 6,
        replies: [],
        userLiked: true,
      },
    ],
  },
  reactions: {
    like: { emoji: '👍', name: 'Like', count: 0 },
    love: { emoji: '❤️', name: 'Love', count: 0 },
    celebrate: { emoji: '🎉', name: 'Celebrate', count: 0 },
    inspire: { emoji: '🔥', name: 'Inspire', count: 0 },
    support: { emoji: '🤝', name: 'Support', count: 0 },
  },
};

export const addComment = (entityType, entityId, content) => {
  const newComment = {
    id: `comment_${Date.now()}`,
    userId: 'user_current',
    userName: 'You',
    userAvatar: '👤',
    content,
    timestamp: new Date().toISOString(),
    likes: 0,
    replies: [],
    userLiked: false,
  };

  if (!COMMENTS_DATA[entityType]) {
    COMMENTS_DATA[entityType] = {};
  }
  if (!COMMENTS_DATA[entityType][entityId]) {
    COMMENTS_DATA[entityType][entityId] = [];
  }

  COMMENTS_DATA[entityType][entityId].unshift(newComment);
  return { success: true, comment: newComment };
};

export const addReply = (entityType, entityId, commentId, content) => {
  const newReply = {
    id: `reply_${Date.now()}`,
    userId: 'user_current',
    userName: 'You',
    userAvatar: '👤',
    content,
    timestamp: new Date().toISOString(),
    likes: 0,
  };

  const comments = COMMENTS_DATA[entityType]?.[entityId] || [];
  const comment = comments.find(c => c.id === commentId);
  
  if (comment) {
    comment.replies.push(newReply);
    return { success: true, reply: newReply };
  }
  
  return { success: false, message: 'Comment not found' };
};

export const toggleLike = (entityType, entityId, commentId, replyId = null) => {
  const comments = COMMENTS_DATA[entityType]?.[entityId] || [];
  const target = replyId 
    ? comments.find(c => c.id === commentId)?.replies?.find(r => r.id === replyId)
    : comments.find(c => c.id === commentId);
  
  if (target) {
    target.userLiked = !target.userLiked;
    target.likes += target.userLiked ? 1 : -1;
    return { success: true, liked: target.userLiked, likes: target.likes };
  }
  
  return { success: false, message: 'Comment not found' };
};

export const addReaction = (entityType, entityId, reactionType) => {
  if (!COMMENTS_DATA.reactions[reactionType]) {
    return { success: false, message: 'Invalid reaction type' };
  }
  
  COMMENTS_DATA.reactions[reactionType].count += 1;
  return { success: true, reaction: COMMENTS_DATA.reactions[reactionType] };
};

export const getComments = (entityType, entityId) => {
  return COMMENTS_DATA[entityType]?.[entityId] || [];
};

export const getCommentStats = (entityType, entityId) => {
  const comments = getComments(entityType, entityId);
  const totalComments = comments.length;
  const totalReplies = comments.reduce((sum, comment) => sum + comment.replies.length, 0);
  const totalLikes = comments.reduce((sum, comment) => sum + comment.likes, 0);
  const totalReplyLikes = comments.reduce((sum, comment) => 
    sum + comment.replies.reduce((replySum, reply) => replySum + reply.likes, 0), 0
  );
  
  return {
    totalComments,
    totalReplies,
    totalLikes: totalLikes + totalReplyLikes,
  };
};
