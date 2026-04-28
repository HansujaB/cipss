import React, { useState } from 'react';
import styles from './Challenges.module.css';

const CHALLENGES = {
  weekly: [
    { id: 1, title: 'Volunteer Sprint', desc: 'Join 3 campaigns this week', icon: '🏃', reward: 500, progress: 2, total: 3, deadline: 'Apr 30, 2024', difficulty: 'medium' },
    { id: 2, title: 'Green Warrior', desc: 'Fund 2 environment campaigns', icon: '🌱', reward: 300, progress: 1, total: 2, deadline: 'Apr 30, 2024', difficulty: 'easy' },
    { id: 3, title: 'Social Butterfly', desc: 'Refer 5 friends to CIPSS', icon: '🦋', reward: 800, progress: 2, total: 5, deadline: 'Apr 30, 2024', difficulty: 'hard' },
  ],
  monthly: [
    { id: 4, title: 'Impact Champion', desc: 'Complete 10 campaigns this month', icon: '🏆', reward: 2000, progress: 7, total: 10, deadline: 'Apr 30, 2024', difficulty: 'hard' },
    { id: 5, title: 'Mega Donor', desc: 'Donate ₹5,000 total this month', icon: '💰', reward: 1500, progress: 3200, total: 5000, deadline: 'Apr 30, 2024', difficulty: 'medium', isCurrency: true },
    { id: 6, title: 'Community Builder', desc: 'Join 2 team campaigns', icon: '👥', reward: 600, progress: 1, total: 2, deadline: 'Apr 30, 2024', difficulty: 'easy' },
  ],
  special: [
    { id: 7, title: 'Earth Day Hero', desc: 'Join 5 environment campaigns', icon: '🌍', reward: 3000, progress: 3, total: 5, deadline: 'May 5, 2024', difficulty: 'hard', special: true },
    { id: 8, title: 'Water Warrior', desc: 'Fund 3 clean water initiatives', icon: '💧', reward: 2500, progress: 1, total: 3, deadline: 'May 10, 2024', difficulty: 'medium', special: true },
  ],
};

const DIFFICULTY_COLORS = { easy: '#22C55E', medium: '#F59E0B', hard: '#EF4444' };

export default function Challenges() {
  const [activeTab, setActiveTab] = useState('weekly');

  const challenges = CHALLENGES[activeTab];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🎯 Challenges</h1>
        <p className={styles.subtitle}>Complete challenges to earn bonus points and rewards</p>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {['weekly', 'monthly', 'special'].map(tab => (
          <button key={tab} className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'weekly' ? '📅 Weekly' : tab === 'monthly' ? '📆 Monthly' : '⭐ Special'}
          </button>
        ))}
      </div>

      {/* Challenges */}
      <div className={styles.list}>
        {challenges.map(c => {
          const pct = Math.min(Math.round((c.progress / c.total) * 100), 100);
          return (
            <div key={c.id} className={`${styles.card} ${c.special ? styles.specialCard : ''}`}>
              <div className={styles.cardLeft}>
                <div className={styles.icon}>{c.icon}</div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <div>
                    <div className={styles.cardTitle}>{c.title}</div>
                    <div className={styles.cardDesc}>{c.desc}</div>
                  </div>
                  <div className={styles.cardRight}>
                    <div className={styles.reward}>+{c.reward} pts</div>
                    <div className={styles.difficulty} style={{ color: DIFFICULTY_COLORS[c.difficulty] }}>
                      {c.difficulty}
                    </div>
                  </div>
                </div>
                <div className={styles.progressSection}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                  </div>
                  <div className={styles.progressMeta}>
                    <span className={styles.progressText}>
                      {c.isCurrency ? `₹${c.progress.toLocaleString()} / ₹${c.total.toLocaleString()}` : `${c.progress} / ${c.total}`}
                    </span>
                    <span className={styles.deadline}>⏰ {c.deadline}</span>
                  </div>
                </div>
                {pct === 100 && <div className={styles.completed}>✅ Completed!</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
