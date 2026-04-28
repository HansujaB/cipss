import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { 
  COMMENTS_DATA, 
  addComment, 
  addReply, 
  toggleLike, 
  addReaction,
  getComments,
  getCommentStats
} from '../services/commentService';

export default function CommentsScreen({ route }) {
  const { entityType, entityId, entityTitle } = route.params || { entityType: 'campaignComments', entityId: 'campaign_1', entityTitle: 'Beach Cleanup Drive' };
  
  const [comments, setComments] = useState(getComments(entityType, entityId));
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const commentStats = getCommentStats(entityType, entityId);

  const handlePostComment = () => {
    if (!newComment.trim()) return;

    const result = addComment(entityType, entityId, newComment);
    if (result.success) {
      setComments([result.comment, ...comments]);
      setNewComment('');
    }
  };

  const handlePostReply = (commentId) => {
    if (!replyText.trim()) return;

    const result = addReply(entityType, entityId, commentId, replyText);
    if (result.success) {
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, replies: [...comment.replies, result.reply] };
        }
        return comment;
      });
      setComments(updatedComments);
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const handleLike = (commentId, replyId = null) => {
    const result = toggleLike(entityType, entityId, commentId, replyId);
    if (result.success) {
      const updatedComments = comments.map(comment => {
        if (replyId) {
          const updatedReplies = comment.replies.map(reply => {
            if (reply.id === replyId) {
              return { ...reply, likes: result.likes, userLiked: result.liked };
            }
            return reply;
          });
          return { ...comment, replies: updatedReplies };
        } else {
          return { ...comment, likes: result.likes, userLiked: result.liked };
        }
      });
      setComments(updatedComments);
    }
  };

  const handleReaction = (reactionType) => {
    const result = addReaction(entityType, entityId, reactionType);
    if (result.success) {
      Alert.alert('Reaction Added', `You reacted with ${result.reaction.name}!`);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const renderReply = (reply, commentId) => (
    <View key={reply.id} style={styles.replyContainer}>
      <View style={styles.replyHeader}>
        <Text style={styles.replyAvatar}>{reply.userAvatar}</Text>
        <View style={styles.replyInfo}>
          <Text style={styles.replyUserName}>{reply.userName}</Text>
          <Text style={styles.replyTimestamp}>{formatTimestamp(reply.timestamp)}</Text>
        </View>
      </View>
      <Text style={styles.replyContent}>{reply.content}</Text>
      <View style={styles.replyActions}>
        <TouchableOpacity
          style={[styles.likeBtn, reply.userLiked && styles.likedBtn]}
          onPress={() => handleLike(commentId, reply.id)}
        >
          <Text style={[styles.likeBtnText, reply.userLiked && styles.likedBtnText]}>
            👍 {reply.likes}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentAvatar}>{item.userAvatar}</Text>
        <View style={styles.commentInfo}>
          <Text style={styles.commentUserName}>{item.userName}</Text>
          <Text style={styles.commentTimestamp}>{formatTimestamp(item.timestamp)}</Text>
        </View>
      </View>
      <Text style={styles.commentContent}>{item.content}</Text>
      
      <View style={styles.commentActions}>
        <TouchableOpacity
          style={[styles.likeBtn, item.userLiked && styles.likedBtn]}
          onPress={() => handleLike(item.id)}
        >
          <Text style={[styles.likeBtnText, item.userLiked && styles.likedBtnText]}>
            👍 {item.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.replyBtn}
          onPress={() => setReplyingTo(replyingTo === item.id ? null : item.id)}
        >
          <Text style={styles.replyBtnText}>💬 Reply</Text>
        </TouchableOpacity>
      </View>

      {item.replies.map(reply => renderReply(reply, item.id))}

      {replyingTo === item.id && (
        <View style={styles.replyInputContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Write a reply..."
            value={replyText}
            onChangeText={setReplyText}
            multiline
          />
          <TouchableOpacity
            style={styles.postReplyBtn}
            onPress={() => handlePostReply(item.id)}
          >
            <Text style={styles.postReplyBtnText}>Post</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderReactionBar = () => (
    <View style={styles.reactionBar}>
      {Object.entries(COMMENTS_DATA.reactions).map(([key, reaction]) => (
        <TouchableOpacity
          key={key}
          style={styles.reactionBtn}
          onPress={() => handleReaction(key)}
        >
          <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
          <Text style={styles.reactionCount}>{reaction.count}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>💬 Comments</Text>
          <Text style={styles.entityTitle}>{entityTitle}</Text>
          <View style={styles.stats}>
            <Text style={styles.statText}>
              {commentStats.totalComments} comments • {commentStats.totalLikes} likes
            </Text>
          </View>
        </View>

        {renderReactionBar()}

        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={renderComment}
          contentContainerStyle={styles.commentsList}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            style={[styles.postBtn, !newComment.trim() && styles.disabledBtn]}
            onPress={handlePostComment}
            disabled={!newComment.trim()}
          >
            <Text style={styles.postBtnText}>Post</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  container: {
    flex: 1,
  },

  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  entityTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },

  stats: {
    marginTop: 4,
  },

  statText: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  reactionBar: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  reactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },

  reactionEmoji: {
    fontSize: 20,
    marginRight: 4,
  },

  reactionCount: {
    fontSize: 12,
    color: '#6B7280',
  },

  commentsList: {
    padding: 16,
  },

  commentContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  commentAvatar: {
    fontSize: 24,
    marginRight: 12,
  },

  commentInfo: {
    flex: 1,
  },

  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  commentTimestamp: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  commentContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },

  commentActions: {
    flexDirection: 'row',
    gap: 16,
  },

  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  likedBtn: {
    opacity: 1,
  },

  likeBtnText: {
    fontSize: 12,
    color: '#6B7280',
  },

  likedBtnText: {
    color: '#1D0A69',
    fontWeight: '600',
  },

  replyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  replyBtnText: {
    fontSize: 12,
    color: '#6B7280',
  },

  replyContainer: {
    marginTop: 12,
    paddingLeft: 36,
    borderLeftWidth: 2,
    borderLeftColor: '#F3F4F6',
  },

  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  replyAvatar: {
    fontSize: 20,
    marginRight: 8,
  },

  replyInfo: {
    flex: 1,
  },

  replyUserName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  replyTimestamp: {
    fontSize: 10,
    color: '#9CA3AF',
  },

  replyContent: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 8,
  },

  replyActions: {
    flexDirection: 'row',
    gap: 12,
  },

  replyInputContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },

  replyInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 13,
    maxHeight: 80,
  },

  postReplyBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  postReplyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  inputContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },

  commentInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    maxHeight: 100,
  },

  postBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  disabledBtn: {
    backgroundColor: '#D1D5DB',
  },

  postBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
