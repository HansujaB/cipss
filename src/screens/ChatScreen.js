import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  getConversations,
  getConversationById,
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  markAsRead,
  addReaction,
  removeReaction,
  createConversation,
  pinConversation,
  unpinConversation,
  muteConversation,
  unmuteConversation,
  archiveConversation,
  unarchiveConversation,
  deleteConversation,
  getOnlineUsers,
  setTypingStatus,
  getTypingUsers,
  getChatSettings,
  updateChatSettings,
  searchMessages,
  getUnreadCount,
  markAllAsRead,
  clearChatHistory,
  exportChatHistory,
} from '../services/chatService';

export default function ChatScreen() {
  const [activeTab, setActiveTab] = useState('chats');
  const [conversations, setConversations] = useState(getConversations());
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(getOnlineUsers());
  const [settings, setSettings] = useState(getChatSettings());
  const [unreadCount, setUnreadCount] = useState(getUnreadCount());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const flatListRef = useRef(null);

  const tabs = [
    { key: 'chats', label: 'Chats', icon: '💬', badge: unreadCount },
    { key: 'online', label: 'Online', icon: '🟢' },
    { key: 'search', label: 'Search', icon: '🔍' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setConversations(getConversations());
      setOnlineUsers(getOnlineUsers());
      setUnreadCount(getUnreadCount());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      setMessages(getMessages(selectedConversation.id));
      markAsRead(selectedConversation.id);
      
      // Update typing status
      const typingInterval = setInterval(() => {
        setTypingUsers(getTypingUsers(selectedConversation.id));
      }, 1000);

      return () => clearInterval(typingInterval);
    }
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedConversation) {
      if (editingMessage) {
        // Edit existing message
        editMessage(selectedConversation.id, editingMessage.id, messageInput);
        setEditingMessage(null);
      } else {
        // Send new message
        sendMessage(selectedConversation.id, messageInput);
      }
      setMessageInput('');
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleTyping = (text) => {
    setMessageInput(text);
    
    if (selectedConversation && !isTyping && text.length > 0) {
      setIsTyping(true);
      setTypingStatus(selectedConversation.id, 'user_1', true);
      
      // Stop typing after 2 seconds of inactivity
      setTimeout(() => {
        setIsTyping(false);
        setTypingStatus(selectedConversation.id, 'user_1', false);
      }, 2000);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setActiveTab('chats');
    markAsRead(conversation.id);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
    setEditingMessage(null);
  };

  const handleReaction = (messageId, emoji) => {
    addReaction(selectedConversation.id, messageId, emoji);
    setMessages(getMessages(selectedConversation.id));
  };

  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setMessageInput(message.content);
  };

  const handleDeleteMessage = (messageId) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteMessage(selectedConversation.id, messageId);
            setMessages(getMessages(selectedConversation.id));
          }
        }
      ]
    );
  };

  const handlePinConversation = () => {
    if (selectedConversation) {
      if (selectedConversation.pinned) {
        unpinConversation(selectedConversation.id);
      } else {
        pinConversation(selectedConversation.id);
      }
      setConversations(getConversations());
      setSelectedConversation(getConversationById(selectedConversation.id));
    }
  };

  const handleMuteConversation = () => {
    if (selectedConversation) {
      if (selectedConversation.muted) {
        unmuteConversation(selectedConversation.id);
      } else {
        muteConversation(selectedConversation.id);
      }
      setConversations(getConversations());
      setSelectedConversation(getConversationById(selectedConversation.id));
    }
  };

  const handleArchiveConversation = () => {
    if (selectedConversation) {
      archiveConversation(selectedConversation.id);
      setConversations(getConversations());
      handleBackToList();
    }
  };

  const handleDeleteConversation = () => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteConversation(selectedConversation.id);
            setConversations(getConversations());
            handleBackToList();
          }
        }
      ]
    );
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchMessages(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleCreateNewChat = (userId) => {
    const user = onlineUsers.find(u => u.id === userId);
    if (user) {
      const result = createConversation([
        { id: 'user_1', name: 'You', avatar: '👤', role: 'volunteer' },
        user,
      ]);
      
      if (result.success) {
        setConversations(getConversations());
        setSelectedConversation(result.conversation);
        setShowNewChatModal(false);
      }
    }
  };

  const handleUpdateSetting = (category, key, value) => {
    updateChatSettings(category, { [key]: value });
    setSettings(getChatSettings());
  };

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.conversationItem,
        item.pinned && styles.pinnedConversation,
        item.unreadCount > 0 && styles.unreadConversation
      ]}
      onPress={() => handleSelectConversation(item)}
    >
      <View style={styles.conversationAvatar}>
        <Text style={styles.avatarText}>{item.participants[1]?.avatar || '👤'}</Text>
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationTitle}>{item.title}</Text>
          <Text style={styles.conversationTime}>
            {new Date(item.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        
        <View style={styles.conversationFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage?.content || 'No messages yet'}
          </Text>
          <View style={styles.conversationBadges}>
            {item.pinned && <Text style={styles.pinBadge}>📌</Text>}
            {item.muted && <Text style={styles.muteBadge}>🔕</Text>}
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }) => {
    const isOwn = item.senderId === 'user_1';
    const isEditing = editingMessage?.id === item.id;
    
    return (
      <View style={[
        styles.messageContainer,
        isOwn ? styles.ownMessage : styles.otherMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isOwn ? styles.ownBubble : styles.otherBubble
        ]}>
          {item.replyTo && (
            <View style={styles.replyContainer}>
              <Text style={styles.replyText}>Replying to message</Text>
            </View>
          )}
          
          <Text style={[
            styles.messageText,
            isOwn ? styles.ownMessageText : styles.otherMessageText
          ]}>
            {item.content}
          </Text>
          
          {item.edited && (
            <Text style={styles.editedText}>edited</Text>
          )}
          
          <View style={styles.messageFooter}>
            <Text style={styles.messageTime}>
              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            
            {item.reactions.length > 0 && (
              <View style={styles.reactionsContainer}>
                {item.reactions.map((reaction, index) => (
                  <Text key={index} style={styles.reactionEmoji}>
                    {reaction.emoji}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
        
        {isOwn && (
          <TouchableOpacity
            style={styles.messageOptions}
            onPress={() => {
              setSelectedMessage(item);
              setShowOptionsModal(true);
            }}
          >
            <Text style={styles.optionsText}>⋯</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderOnlineUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.onlineUserItem}
      onPress={() => handleCreateNewChat(item.id)}
    >
      <View style={styles.onlineUserAvatar}>
        <Text style={styles.avatarText}>{item.avatar}</Text>
        <View style={styles.onlineIndicator} />
      </View>
      <View style={styles.onlineUserInfo}>
        <Text style={styles.onlineUserName}>{item.name}</Text>
        <Text style={styles.onlineUserStatus}>Online</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => {
        handleSelectConversation(item.conversation);
        setActiveTab('chats');
        setSearchQuery('');
        setSearchResults([]);
      }}
    >
      <Text style={styles.searchResultConversation}>{item.conversation.title}</Text>
      <Text style={styles.searchResultContext} numberOfLines={2}>
        {item.matchContext}
      </Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (selectedConversation) {
      return (
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={handleBackToList}>
              <Text style={styles.backButton}>←</Text>
            </TouchableOpacity>
            <View style={styles.chatHeaderInfo}>
              <Text style={styles.chatTitle}>{selectedConversation.title}</Text>
              {typingUsers.length > 0 && (
                <Text style={styles.typingIndicator}>Someone is typing...</Text>
              )}
            </View>
            <TouchableOpacity onPress={handlePinConversation}>
              <Text style={styles.headerAction}>
                {selectedConversation.pinned ? '📌' : '📌'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessageItem}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
          />
          
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.messageInputContainer}>
              {editingMessage && (
                <View style={styles.editingIndicator}>
                  <Text style={styles.editingText}>Editing message</Text>
                  <TouchableOpacity onPress={() => setEditingMessage(null)}>
                    <Text style={styles.cancelEdit}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.messageInput}
                  value={messageInput}
                  onChangeText={handleTyping}
                  placeholder="Type a message..."
                  multiline
                  maxLength={1000}
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    messageInput.trim() ? styles.sendButtonActive : styles.sendButtonInactive
                  ]}
                  onPress={handleSendMessage}
                  disabled={!messageInput.trim()}
                >
                  <Text style={styles.sendButtonText}>
                    {editingMessage ? '✓' : '→'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      );
    }

    switch (activeTab) {
      case 'chats':
        return (
          <View style={styles.chatsContainer}>
            <FlatList
              data={conversations}
              keyExtractor={(item) => item.id}
              renderItem={renderConversationItem}
              contentContainerStyle={styles.conversationsList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No conversations yet</Text>
                  <TouchableOpacity
                    style={styles.startChatBtn}
                    onPress={() => setShowNewChatModal(true)}
                  >
                    <Text style={styles.startChatBtnText}>Start a conversation</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
        );

      case 'online':
        return (
          <View style={styles.onlineContainer}>
            <Text style={styles.sectionTitle}>🟢 Online Users</Text>
            <FlatList
              data={onlineUsers}
              keyExtractor={(item) => item.id}
              renderItem={renderOnlineUserItem}
              contentContainerStyle={styles.onlineList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );

      case 'search':
        return (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={handleSearch}
                placeholder="Search messages..."
                autoFocus
              />
            </View>
            
            {searchResults.length > 0 && (
              <FlatList
                data={searchResults}
                keyExtractor={(item, index) => `search_${index}`}
                renderItem={renderSearchResult}
                contentContainerStyle={styles.searchResultsList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        );

      case 'settings':
        return (
          <ScrollView style={styles.settingsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>⚙️ Chat Settings</Text>
              
              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Notifications</Text>
                
                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>Enable Notifications</Text>
                  <TouchableOpacity
                    style={[
                      styles.toggle,
                      settings.notifications.enabled && styles.toggleOn
                    ]}
                    onPress={() => handleUpdateSetting('notifications', 'enabled', !settings.notifications.enabled)}
                  >
                    <Text style={styles.toggleText}>
                      {settings.notifications.enabled ? 'ON' : 'OFF'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>Sound</Text>
                  <TouchableOpacity
                    style={[
                      styles.toggle,
                      settings.notifications.sound && styles.toggleOn
                    ]}
                    onPress={() => handleUpdateSetting('notifications', 'sound', !settings.notifications.sound)}
                  >
                    <Text style={styles.toggleText}>
                      {settings.notifications.sound ? 'ON' : 'OFF'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Privacy</Text>
                
                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>Read Receipts</Text>
                  <TouchableOpacity
                    style={[
                      styles.toggle,
                      settings.privacy.readReceipts && styles.toggleOn
                    ]}
                    onPress={() => handleUpdateSetting('privacy', 'readReceipts', !settings.privacy.readReceipts)}
                  >
                    <Text style={styles.toggleText}>
                      {settings.privacy.readReceipts ? 'ON' : 'OFF'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>Online Status</Text>
                  <TouchableOpacity
                    style={[
                      styles.toggle,
                      settings.privacy.onlineStatus && styles.toggleOn
                    ]}
                    onPress={() => handleUpdateSetting('privacy', 'onlineStatus', !settings.privacy.onlineStatus)}
                  >
                    <Text style={styles.toggleText}>
                      {settings.privacy.onlineStatus ? 'ON' : 'OFF'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  Alert.alert(
                    'Clear Chat History',
                    'Are you sure you want to clear all chat history?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Clear',
                        style: 'destructive',
                        onPress: () => {
                          clearChatHistory();
                          setConversations(getConversations());
                          Alert.alert('Success', 'Chat history cleared');
                        }
                      }
                    ]
                  );
                }}
              >
                <Text style={styles.actionButtonText}>Clear Chat History</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {!selectedConversation && (
        <>
          <Text style={styles.title}>💬 Messages</Text>
          
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
                {tab.badge && tab.badge > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{tab.badge}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
      
      {renderContent()}
      
      {/* Message Options Modal */}
      <Modal
        visible={showOptionsModal}
        transparent={true}
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.optionsModal}>
            <Text style={styles.optionsTitle}>Message Options</Text>
            
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                handleEditMessage(selectedMessage);
                setShowOptionsModal(false);
              }}
            >
              <Text style={styles.optionText}>Edit Message</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                handleDeleteMessage(selectedMessage.id);
                setShowOptionsModal(false);
              }}
            >
              <Text style={[styles.optionText, styles.deleteOption]}>Delete Message</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => setShowOptionsModal(false)}
            >
              <Text style={styles.optionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* New Chat Modal */}
      <Modal
        visible={showNewChatModal}
        animationType="slide"
        onRequestClose={() => setShowNewChatModal(false)}
      >
        <SafeAreaView style={styles.safe}>
          <View style={styles.newChatHeader}>
            <TouchableOpacity onPress={() => setShowNewChatModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.newChatTitle}>New Chat</Text>
            <View style={styles.placeholder} />
          </View>
          
          <FlatList
            data={onlineUsers.filter(u => u.id !== 'user_1')}
            keyExtractor={(item) => item.id}
            renderItem={renderOnlineUserItem}
            contentContainerStyle={styles.onlineList}
            showsVerticalScrollIndicator={false}
          />
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

  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 4,
  },

  tab: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
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
    fontSize: 8,
    color: '#6B7280',
  },

  tabLabelActive: {
    color: '#FFFFFF',
  },

  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '600',
  },

  chatsContainer: {
    flex: 1,
  },

  conversationsList: {
    padding: 16,
  },

  conversationItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
  },

  pinnedConversation: {
    borderLeftWidth: 3,
    borderLeftColor: '#1D0A69',
  },

  unreadConversation: {
    backgroundColor: '#EFF6FF',
  },

  conversationAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },

  avatarText: {
    fontSize: 20,
  },

  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  conversationContent: {
    flex: 1,
  },

  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  conversationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  conversationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
  },

  conversationBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  pinBadge: {
    fontSize: 12,
  },

  muteBadge: {
    fontSize: 12,
  },

  unreadBadge: {
    backgroundColor: '#1D0A69',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },

  chatContainer: {
    flex: 1,
  },

  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  backButton: {
    fontSize: 20,
    color: '#1D0A69',
    marginRight: 12,
  },

  chatHeaderInfo: {
    flex: 1,
  },

  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  typingIndicator: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },

  headerAction: {
    fontSize: 16,
  },

  messagesList: {
    padding: 16,
  },

  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },

  ownMessage: {
    justifyContent: 'flex-end',
  },

  otherMessage: {
    justifyContent: 'flex-start',
  },

  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 16,
  },

  ownBubble: {
    backgroundColor: '#1D0A69',
    borderBottomRightRadius: 4,
  },

  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    elevation: 1,
  },

  replyContainer: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
  },

  replyText: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },

  ownMessageText: {
    color: '#FFFFFF',
  },

  otherMessageText: {
    color: '#1A1A2E',
  },

  editedText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginTop: 2,
  },

  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },

  messageTime: {
    fontSize: 10,
    color: '#9CA3AF',
  },

  reactionsContainer: {
    flexDirection: 'row',
    gap: 2,
  },

  reactionEmoji: {
    fontSize: 12,
  },

  messageOptions: {
    marginLeft: 8,
    padding: 4,
  },

  optionsText: {
    fontSize: 16,
    color: '#9CA3AF',
  },

  messageInputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },

  editingIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 8,
    paddingHorizontal: 16,
  },

  editingText: {
    fontSize: 12,
    color: '#92400E',
  },

  cancelEdit: {
    fontSize: 16,
    color: '#92400E',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },

  messageInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
  },

  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sendButtonActive: {
    backgroundColor: '#1D0A69',
  },

  sendButtonInactive: {
    backgroundColor: '#E5E7EB',
  },

  sendButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },

  onlineContainer: {
    flex: 1,
  },

  onlineList: {
    padding: 16,
  },

  onlineUserItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
  },

  onlineUserAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },

  onlineUserInfo: {
    flex: 1,
  },

  onlineUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  onlineUserStatus: {
    fontSize: 12,
    color: '#22C55E',
  },

  searchContainer: {
    flex: 1,
    padding: 16,
  },

  searchInputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },

  searchInput: {
    fontSize: 16,
    color: '#1A1A2E',
  },

  searchResultsList: {
    gap: 8,
  },

  searchResultItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },

  searchResultConversation: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D0A69',
    marginBottom: 4,
  },

  searchResultContext: {
    fontSize: 13,
    color: '#6B7280',
  },

  settingsContainer: {
    flex: 1,
    padding: 16,
  },

  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    elevation: 2,
  },

  settingsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 20,
  },

  settingsSection: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },

  settingLabel: {
    fontSize: 14,
    color: '#374151',
  },

  toggle: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },

  toggleOn: {
    backgroundColor: '#22C55E',
  },

  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },

  toggleOn && {
    color: '#FFFFFF',
  },

  actionButton: {
    backgroundColor: '#EF4444',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },

  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  optionsModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    minWidth: 200,
  },

  optionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 16,
    textAlign: 'center',
  },

  optionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  optionText: {
    fontSize: 14,
    color: '#1A1A2E',
    textAlign: 'center',
  },

  deleteOption: {
    color: '#EF4444',
  },

  newChatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  cancelButton: {
    fontSize: 16,
    color: '#1D0A69',
  },

  newChatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  placeholder: {
    width: 60,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },

  startChatBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  startChatBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
