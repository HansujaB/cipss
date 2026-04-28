import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Profile.module.css';

const USER = {
  name: 'Demo User', email: 'demo@cipss.com', avatar: '👤',
  level: 'Champion', points: 2850, rank: 4,
  campaigns: 7, donated: 8500, streak: 12,
  badges: ['🔥', '⭐', '🌟', '👥', '💚'],
  joinDate: 'January 2024',
};

const STATS = [
  { label: 'Campaigns Joined', value: USER.campaigns, icon: '📋' },
  { label: 'Total Donated', value: `₹${USER.donated.toLocaleString()}`, icon: '💰' },
  { label: 'Current Streak', value: `${USER.streak} days`, icon: '🔥' },
  { label: 'Global Rank', value: `#${USER.rank}`, icon: '🏆' },
];

const QUICK_LINKS = [
  { label: 'My Achievements', icon: '🎖️', path: '/achievements' },
  { label: 'Active Challenges', icon: '🎯', path: '/challenges' },
  { label: 'Streak Tracker', icon: '🔥', path: '/streak' },
  { label: 'Leaderboard', icon: '🏆', path: '/leaderboard' },
];

export default function Profile() {
  return (
    <div className={styles.container}>
      {/* Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.avatar}>{USER.avatar}</div>
        <div className={styles.info}>
          <h1 className={styles.name}>{USER.name}</h1>
          <div className={styles.email}>{USER.email}</div>
          <div className={styles.meta}>
            <span className={styles.level}>🏅 {USER.level}</span>
            <span className={styles.points}>⚡ {USER.points.toLocaleString()} pts</span>
            <span className={styles.joinDate}>📅 Joined {USER.joinDate}</span>
          </div>
          <div className={styles.badges}>
            {USER.badges.map((b, i) => <span key={i} className={styles.badge}>{b}</span>)}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {STATS.map(s => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statIcon}>{s.icon}</div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Links</h2>
        <div className={styles.quickLinks}>
          {QUICK_LINKS.map(l => (
            <Link key={l.path} to={l.path} className={styles.quickLink}>
              <span className={styles.quickIcon}>{l.icon}</span>
              <span>{l.label}</span>
              <span className={styles.arrow}>→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Level Progress */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Level Progress</h2>
        <div className={styles.levelCard}>
          <div className={styles.levelInfo}>
            <span className={styles.currentLevel}>🏅 Champion</span>
            <span className={styles.nextLevel}>🦸 Hero</span>
          </div>
          <div className={styles.levelBar}>
            <div className={styles.levelFill} style={{ width: '52%' }} />
          </div>
          <div className={styles.levelMeta}>
            <span>2,850 / 5,500 XP</span>
            <span>2,650 XP to next level</span>
          </div>
        </div>
      </div>
    </div>
  );
}
