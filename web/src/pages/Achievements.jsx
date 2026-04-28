import React, { useState } from 'react';
import styles from './Achievements.module.css';

const ACHIEVEMENTS = [
  { id: 1, title: 'First Steps', desc: 'Join your first campaign', icon: '🎯', category: 'milestone', points: 100, unlocked: true, date: 'Jan 15, 2024', rarity: 'common' },
  { id: 2, title: 'Getting Started', desc: 'Complete 5 campaigns', icon: '⭐', category: 'milestone', points: 250, unlocked: true, date: 'Feb 20, 2024', rarity: 'common' },
  { id: 3, title: 'Dedicated Volunteer', desc: 'Complete 10 campaigns', icon: '🌟', category: 'milestone', points: 500, unlocked: false, progress: 7, total: 10, rarity: 'rare' },
  { id: 4, title: 'Generous Heart', desc: 'Donate ₹10,000 or more', icon: '💎', category: 'donation', points: 1000, unlocked: false, progress: 5000, total: 10000, rarity: 'epic' },
  { id: 5, title: 'Week Warrior', desc: 'Maintain a 7-day streak', icon: '🔥', category: 'streak', points: 300, unlocked: true, date: 'Mar 10, 2024', rarity: 'rare' },
  { id: 6, title: 'Monthly Champion', desc: 'Maintain a 30-day streak', icon: '👑', category: 'streak', points: 1500, unlocked: false, progress: 12, total: 30, rarity: 'legendary' },
  { id: 7, title: 'Team Player', desc: 'Join 3 team campaigns', icon: '👥', category: 'social', points: 200, unlocked: true, date: 'Feb 5, 2024', rarity: 'common' },
  { id: 8, title: 'Social Influencer', desc: 'Refer 10 friends', icon: '📱', category: 'social', points: 800, unlocked: false, progress: 4, total: 10, rarity: 'epic' },
  { id: 9, title: 'Impact Maker', desc: 'Fund 5 campaigns', icon: '💚', category: 'donation', points: 600, unlocked: true, date: 'Apr 1, 2024', rarity: 'rare' },
  { id: 10, title: 'Community Leader', desc: 'Lead a team of 10+', icon: '🦸', category: 'social', points: 1200, unlocked: false, progress: 3, total: 10, rarity: 'epic' },
];

const RARITY_COLORS = { common: '#6B7280', rare: '#3B82F6', epic: '#8B5CF6', legendary: '#F59E0B' };
const CATEGORIES = ['all', 'milestone', 'donation', 'streak', 'social'];

export default function Achievements() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showUnlocked, setShowUnlocked] = useState('all');

  const filtered = ACHIEVEMENTS.filter(a => {
    if (activeCategory !== 'all' && a.category !== activeCategory) return false;
    if (showUnlocked === 'unlocked' && !a.unlocked) return false;
    if (showUnlocked === 'locked' && a.unlocked) return false;
    return true;
  });

  const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length;
  const totalPoints = ACHIEVEMENTS.filter(a => a.unlocked).reduce((s, a) => s + a.points, 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🎖️ Achievements</h1>
        <p className={styles.subtitle}>Track your milestones and earn rewards</p>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{unlockedCount}/{ACHIEVEMENTS.length}</div>
          <div className={styles.statLabel}>Unlocked</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalPoints.toLocaleString()}</div>
          <div className={styles.statLabel}>Points Earned</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{Math.round((unlockedCount/ACHIEVEMENTS.length)*100)}%</div>
          <div className={styles.statLabel}>Completion</div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          {CATEGORIES.map(cat => (
            <button key={cat} className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`} onClick={() => setActiveCategory(cat)}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <div className={styles.filterGroup}>
          {['all', 'unlocked', 'locked'].map(f => (
            <button key={f} className={`${styles.filterBtn} ${showUnlocked === f ? styles.filterActive : ''}`} onClick={() => setShowUnlocked(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className={styles.grid}>
        {filtered.map(a => (
          <div key={a.id} className={`${styles.card} ${!a.unlocked ? styles.locked : ''}`}>
            <div className={styles.cardTop}>
              <div className={styles.icon}>{a.icon}</div>
              <div className={styles.rarityBadge} style={{ color: RARITY_COLORS[a.rarity], borderColor: RARITY_COLORS[a.rarity] }}>
                {a.rarity}
              </div>
            </div>
            <div className={styles.cardTitle}>{a.title}</div>
            <div className={styles.cardDesc}>{a.desc}</div>
            {a.unlocked ? (
              <div className={styles.unlockedInfo}>
                <span className={styles.checkmark}>✅</span>
                <span className={styles.unlockedDate}>{a.date}</span>
              </div>
            ) : a.progress !== undefined ? (
              <div className={styles.progressWrap}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${(a.progress/a.total)*100}%`, background: RARITY_COLORS[a.rarity] }} />
                </div>
                <div className={styles.progressText}>{a.progress}/{a.total}</div>
              </div>
            ) : null}
            <div className={styles.points}>+{a.points} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
}
