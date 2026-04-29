import React, { useState } from 'react';
import styles from './Generic.module.css';

const NOTIFS = [
  { id: 1, type: 'campaign', icon: '📋', title: 'New Campaign Available', msg: 'Solar Energy for Villages campaign is now accepting volunteers.', time: '2 min ago', read: false },
  { id: 2, type: 'achievement', icon: '🎖️', title: 'Achievement Unlocked!', msg: 'You earned the "Week Warrior" badge for a 7-day streak!', time: '1 hour ago', read: false },
  { id: 3, type: 'join', icon: '👥', title: 'Campaign Update', msg: 'Beach Cleanup Drive has reached 80% of its volunteer goal.', time: '3 hours ago', read: true },
  { id: 4, type: 'payment', icon: '💰', title: 'Funding Confirmed', msg: 'Your ₹500 donation to Tree Plantation Campaign was successful.', time: '1 day ago', read: true },
  { id: 5, type: 'leaderboard', icon: '🏆', title: 'Leaderboard Update', msg: 'You moved up to rank #4 on the Volunteers leaderboard!', time: '2 days ago', read: true },
  { id: 6, type: 'streak', icon: '🔥', title: 'Streak Reminder', msg: "Don't forget to check in today to maintain your 12-day streak!", time: '3 days ago', read: true },
  { id: 7, type: 'mentorship', icon: '👨‍🏫', title: 'Mentorship Request', msg: 'Dr. Priya Sharma accepted your mentorship request.', time: '4 days ago', read: true },
  { id: 8, type: 'challenge', icon: '🎯', title: 'Challenge Completed!', msg: 'You completed the "Green Warrior" weekly challenge. +300 pts!', time: '5 days ago', read: true },
];

const TYPE_COLORS = {
  campaign: '#3B82F6',
  achievement: '#F59E0B',
  join: '#22C55E',
  payment: '#10B981',
  leaderboard: '#8B5CF6',
  streak: '#EF4444',
  mentorship: '#6366F1',
  challenge: '#F97316',
};

export default function Notifications() {
  const [notifs, setNotifs] = useState(NOTIFS);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const filtered = filter === 'unread' ? notifs.filter(n => !n.read) : notifs;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className={styles.title}>🔔 Notifications</h1>
            <p className={styles.subtitle}>{unreadCount} unread notifications</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#fff', color: '#374151', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
              Mark all read
            </button>
          )}
        </div>
      </div>

      <div className={styles.tabs}>
        {['all', 'unread'].map(f => (
          <button key={f} className={`${styles.tab} ${filter === f ? styles.tabActive : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)} {f === 'unread' && unreadCount > 0 ? `(${unreadCount})` : ''}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔔</div>
            <div className={styles.emptyText}>All caught up!</div>
            <div className={styles.emptySub}>No unread notifications</div>
          </div>
        ) : filtered.map(n => (
          <div
            key={n.id}
            className={styles.listItem}
            style={{ background: n.read ? '#fff' : '#F0F4FF', cursor: 'pointer', borderLeft: `4px solid ${TYPE_COLORS[n.type]}` }}
            onClick={() => markRead(n.id)}
          >
            <div style={{ fontSize: 28, flexShrink: 0 }}>{n.icon}</div>
            <div className={styles.listInfo}>
              <div className={styles.listTitle} style={{ color: n.read ? '#1A1A2E' : '#1D0A69' }}>{n.title}</div>
              <div className={styles.listSub}>{n.msg}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>{n.time}</div>
            </div>
            {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1D0A69', flexShrink: 0 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}
