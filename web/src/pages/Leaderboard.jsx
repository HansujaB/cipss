import React from 'react';
import { MOCK_LEADERBOARD } from '../data/dummyData';
import styles from './Leaderboard.module.css';

export default function Leaderboard() {
  return (
    <div>
      <h1 className={styles.title}>🏆 Leaderboard</h1>
      <div className={styles.list}>
        {MOCK_LEADERBOARD.map(item => (
          <div key={item.rank} className={`${styles.card} ${item.rank <= 3 ? styles.topCard : ''}`}>
            <span className={styles.rank}>
              {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
            </span>
            <div className={styles.info}>
              <p className={styles.name}>{item.name}</p>
              <p className={styles.meta}>{item.campaigns} campaigns • {item.badges.join(' ')}</p>
            </div>
            <span className={styles.points}>{item.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}
