import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, getUser } from '../services/api';
import styles from './Profile.module.css';

const QUICK_LINKS = [
  { label: 'My Achievements', icon: '🎖️', path: '/achievements' },
  { label: 'Active Challenges', icon: '🎯', path: '/challenges' },
  { label: 'Streak Tracker', icon: '🔥', path: '/streak' },
  { label: 'Leaderboard', icon: '🏆', path: '/leaderboard' },
  { label: 'My Campaigns', icon: '📋', path: '/campaigns' },
  { label: 'Impact Dashboard', icon: '📊', path: '/impact' },
];

export default function Profile() {
  const navigate = useNavigate();
  const user = getUser();
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/campaigns/mine/joined')
      .then(d => {
        const campaigns = d.campaigns || [];
        setMyCampaigns(campaigns);
        setPoints(campaigns.length * 100);
      })
      .catch(() => {});
  }, []);

  const STATS = [
    { label: 'Campaigns Joined', value: myCampaigns.length, icon: '📋' },
    { label: 'Points Earned', value: points.toLocaleString(), icon: '⚡' },
    { label: 'Current Streak', value: '12 days', icon: '🔥' },
    { label: 'Global Rank', value: '#4', icon: '🏆' },
  ];

  return (
    <div className={styles.container}>
      {/* Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.avatar}>👤</div>
        <div className={styles.info}>
          <h1 className={styles.name}>{user?.name || 'User'}</h1>
          <div className={styles.email}>{user?.email}</div>
          <div className={styles.meta}>
            <span className={styles.level}>🏅 Champion</span>
            <span className={styles.points}>⚡ {points.toLocaleString()} pts</span>
            <span className={styles.joinDate}>🎭 {user?.role || 'volunteer'}</span>
          </div>
          <div className={styles.badges}>
            {['🔥', '⭐', '🌟', '👥', '💚'].map((b, i) => <span key={i} className={styles.badge}>{b}</span>)}
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

      {/* My Campaigns */}
      {myCampaigns.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>My Campaigns ({myCampaigns.length})</h2>
          {myCampaigns.map(c => (
            <Link key={c.id} to={`/campaign/${c.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ padding: '12px 0', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#1A1A2E', fontSize: 14 }}>{c.title}</div>
                  <div style={{ color: '#6B7280', fontSize: 12 }}>📍 {c.location || c.area}</div>
                </div>
                <span style={{ background: '#DCFCE7', color: '#166534', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, alignSelf: 'center' }}>✅ Joined</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Level Progress */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Level Progress</h2>
        <div className={styles.levelCard}>
          <div className={styles.levelInfo}>
            <span className={styles.currentLevel}>🏅 Champion</span>
            <span className={styles.nextLevel}>🦸 Hero</span>
          </div>
          <div className={styles.levelBar}>
            <div className={styles.levelFill} style={{ width: `${Math.min((points / 5500) * 100, 100)}%` }} />
          </div>
          <div className={styles.levelMeta}>
            <span>{points.toLocaleString()} / 5,500 XP</span>
            <span>{Math.max(0, 5500 - points).toLocaleString()} XP to next level</span>
          </div>
        </div>
      </div>
    </div>
  );
}
