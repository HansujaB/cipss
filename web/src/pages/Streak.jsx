import React from 'react';
import styles from './Streak.module.css';

const HISTORY = [
  { date: 'Apr 28', active: true }, { date: 'Apr 27', active: true },
  { date: 'Apr 26', active: true }, { date: 'Apr 25', active: true },
  { date: 'Apr 24', active: true }, { date: 'Apr 23', active: true },
  { date: 'Apr 22', active: true }, { date: 'Apr 21', active: false },
  { date: 'Apr 20', active: true }, { date: 'Apr 19', active: true },
  { date: 'Apr 18', active: true }, { date: 'Apr 17', active: true },
  { date: 'Apr 16', active: false }, { date: 'Apr 15', active: true },
];

const MILESTONES = [
  { days: 7, name: 'Week Warrior', icon: '🔥', reward: 100, reached: true },
  { days: 14, name: 'Two Week Champ', icon: '⚡', reward: 250, reached: false },
  { days: 30, name: 'Monthly Legend', icon: '👑', reward: 500, reached: false },
  { days: 60, name: 'Diamond Streak', icon: '💎', reward: 1000, reached: false },
  { days: 100, name: 'Century Master', icon: '🏆', reward: 2000, reached: false },
];

export default function Streak() {
  const currentStreak = 12;
  const longestStreak = 28;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🔥 Streak Tracker</h1>
        <p className={styles.subtitle}>Stay consistent, earn more rewards</p>
      </div>

      {/* Main Streak Card */}
      <div className={styles.streakCard}>
        <div className={styles.streakMain}>
          <div className={styles.streakFire}>🔥</div>
          <div className={styles.streakNum}>{currentStreak}</div>
          <div className={styles.streakLabel}>Day Streak</div>
        </div>
        <div className={styles.streakStats}>
          <div className={styles.streakStat}>
            <div className={styles.streakStatVal}>{longestStreak}</div>
            <div className={styles.streakStatLabel}>Longest Streak</div>
          </div>
          <div className={styles.streakStat}>
            <div className={styles.streakStatVal}>45</div>
            <div className={styles.streakStatLabel}>Total Active Days</div>
          </div>
          <div className={styles.streakStat}>
            <div className={styles.streakStatVal}>600</div>
            <div className={styles.streakStatLabel}>Streak Points</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Activity</h2>
        <div className={styles.historyGrid}>
          {HISTORY.map((d, i) => (
            <div key={i} className={`${styles.dayCard} ${d.active ? styles.activeDay : styles.missedDay}`}>
              <div className={styles.dayStatus}>{d.active ? '✅' : '❌'}</div>
              <div className={styles.dayDate}>{d.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Milestones</h2>
        <div className={styles.milestones}>
          {MILESTONES.map(m => (
            <div key={m.days} className={`${styles.milestone} ${m.reached ? styles.milestoneReached : ''}`}>
              <div className={styles.milestoneIcon}>{m.icon}</div>
              <div className={styles.milestoneInfo}>
                <div className={styles.milestoneName}>{m.name}</div>
                <div className={styles.milestoneDays}>{m.days} days</div>
              </div>
              <div className={styles.milestoneReward}>+{m.reward} pts</div>
              {m.reached && <div className={styles.milestoneCheck}>✅</div>}
              {!m.reached && (
                <div className={styles.milestoneProgress}>
                  <div className={styles.milestoneBar}>
                    <div className={styles.milestoneBarFill} style={{ width: `${Math.min((currentStreak/m.days)*100, 100)}%` }} />
                  </div>
                  <div className={styles.milestonePct}>{currentStreak}/{m.days}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
