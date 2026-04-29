import React, { useState, useRef, useEffect } from 'react';
import styles from './Chat.module.css';

const CONVERSATIONS = [
  { id: 1, name: 'Green Earth Foundation', avatar: '🌱', lastMsg: 'Thank you for joining our campaign!', time: '2m ago', unread: 2, online: true },
  { id: 2, name: 'Priya Sharma', avatar: '👩', lastMsg: 'Can you help with the cleanup drive?', time: '1h ago', unread: 0, online: true },
  { id: 3, name: 'Campaign Team', avatar: '👥', lastMsg: 'Meeting tomorrow at 10 AM', time: '3h ago', unread: 1, online: false },
  { id: 4, name: 'Rahul Verma', avatar: '👨', lastMsg: 'Great work on the tree plantation!', time: '1d ago', unread: 0, online: false },
];

const MESSAGES = {
  1: [
    { id: 1, from: 'them', text: 'Welcome to Green Earth Foundation! 🌱', time: '10:00 AM' },
    { id: 2, from: 'them', text: 'We are so glad you joined our Beach Cleanup campaign.', time: '10:01 AM' },
    { id: 3, from: 'me', text: 'Thank you! I am excited to contribute.', time: '10:05 AM' },
    { id: 4, from: 'them', text: 'The event is on Saturday at 7 AM at Juhu Beach.', time: '10:06 AM' },
    { id: 5, from: 'them', text: 'Thank you for joining our campaign!', time: '10:07 AM' },
  ],
  2: [
    { id: 1, from: 'them', text: 'Hi! I saw you joined the cleanup drive 👋', time: '9:00 AM' },
    { id: 2, from: 'me', text: 'Yes! Looking forward to it.', time: '9:05 AM' },
    { id: 3, from: 'them', text: 'Can you help with the cleanup drive?', time: '9:10 AM' },
  ],
  3: [
    { id: 1, from: 'them', text: 'Team meeting scheduled for tomorrow', time: 'Yesterday' },
    { id: 2, from: 'them', text: 'Meeting tomorrow at 10 AM', time: 'Yesterday' },
  ],
  4: [
    { id: 1, from: 'them', text: 'Great work on the tree plantation! 🌳', time: '2 days ago' },
    { id: 2, from: 'me', text: 'Thanks! It was a great experience.', time: '2 days ago' },
  ],
};

export default function Chat() {
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState(MESSAGES);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv, messages]);

  const sendMessage = () => {
    if (!input.trim() || !activeConv) return;
    const newMsg = { id: Date.now(), from: 'me', text: input, time: 'Just now' };
    setMessages(prev => ({ ...prev, [activeConv]: [...(prev[activeConv] || []), newMsg] }));
    setInput('');
  };

  const conv = CONVERSATIONS.find(c => c.id === activeConv);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>💬 Messages</h2>
        </div>
        {CONVERSATIONS.map(c => (
          <div key={c.id} className={`${styles.convItem} ${activeConv === c.id ? styles.convActive : ''}`} onClick={() => setActiveConv(c.id)}>
            <div className={styles.convAvatar}>
              {c.avatar}
              {c.online && <span className={styles.onlineDot} />}
            </div>
            <div className={styles.convInfo}>
              <div className={styles.convName}>{c.name}</div>
              <div className={styles.convLast}>{c.lastMsg}</div>
            </div>
            <div className={styles.convMeta}>
              <div className={styles.convTime}>{c.time}</div>
              {c.unread > 0 && <div className={styles.unreadBadge}>{c.unread}</div>}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chatArea}>
        {activeConv ? (
          <>
            <div className={styles.chatHeader}>
              <span className={styles.chatAvatar}>{conv?.avatar}</span>
              <div>
                <div className={styles.chatName}>{conv?.name}</div>
                <div className={styles.chatStatus}>{conv?.online ? '🟢 Online' : '⚫ Offline'}</div>
              </div>
            </div>
            <div className={styles.messages}>
              {(messages[activeConv] || []).map(m => (
                <div key={m.id} className={`${styles.message} ${m.from === 'me' ? styles.messageMe : styles.messageThem}`}>
                  <div className={styles.messageBubble}>{m.text}</div>
                  <div className={styles.messageTime}>{m.time}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className={styles.inputArea}>
              <input
                className={styles.input}
                placeholder="Type a message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
              />
              <button className={styles.sendBtn} onClick={sendMessage}>➤</button>
            </div>
          </>
        ) : (
          <div className={styles.emptyChat}>
            <div style={{ fontSize: 60 }}>💬</div>
            <h3>Select a conversation</h3>
            <p>Choose from your existing conversations</p>
          </div>
        )}
      </div>
    </div>
  );
}
