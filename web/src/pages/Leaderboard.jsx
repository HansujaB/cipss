import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import styles from './Leaderboard.module.css';

const FALLBACK = {
  volunteers: [
    { rank: 1, name: 'Priya Sharma', points: 2850, campaigns: 12, badges: ['🥇', '⭐', '🔥'] },
    { rank: 2, name: 'Rahul Verma', points: 2640, campaigns: 10, badges: ['🥈', '⭐'] },
    { rank: 3, name: 'Anjali Patel', points: 2420, campaigns: 9, badges: ['🥉', '⭐'] },
    { rank: 4, name: 'Demo User', points: 2850, campaigns: 7, badges: ['⭐'], isMe: true },
    { rank: 5, name: 'Vikram Singh', points: 2180, campaigns: 8, badges: ['⭐'] },
    { rank: 6, name: 'Neha Gupta', points: 1950, campaigns: 7, badges: ['⭐'] },
    { rank: 7, name: 'Arjun Reddy', points: 1820, campaigns: 6, badges: [] },
    { rank: 8, name: 'Kavya Iyer', points: 1690, campaigns: 6, badges: [] },
  ],
  ngos: [
    { rank: 1, name: 'Green Earth Foundation', points: 8500, campaigns: 25, badges: ['🥇', '🌟'] },
    { rank: 2, name: 'Hope for Children', points: 7200, campaigns: 20, badges: ['🥈', '🌟'] },
    { rank: 3, name: 'Clean Water Trust', points: 6800, campaigns: 18, badges: ['🥉'] },
    { rank: 4, name: 'Education First', points: 5900, campaigns: 15, badges: [] },
    { rank: 5, name: 'Health for All', points: 5200, campaigns: 12, badges: [] },
  ],
  donors: [
    { rank: 1, name: 'Amit Agarwal', points: 15000, campaigns: 30, badges: ['🥇', '💎', '👑'] },
    { rank: 2, name: 'Sunita Kapoor', points: 12500, campaigns: 25, badges: ['🥈', '💎'] },
    { rank: 3, name: 'Rajesh Kumar', points: 10200, campaigns: 20, badges: ['🥉'] },
    { rank: 4, name: 'Meera Joshi', points: 8900, campaigns: 18, badges: [] },
    { rank: 5, name: 'Sanjay Mehta', points: 7500, campaigns: 15, badges: [] },
  ],
};

const TABS = [
  { key: 'volunteers', label: '👥 Volunteers' },
  { key: 'ngos', label: '🏢 NGOs' },
  { key: 'donors', label: '💰 Donors' },
];

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('volunteers');
  const [data, setData] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        // Build leaderboard from real campaign participations
        const [campaignsData] = await Promise.all([
          api.get('/campaigns'),
        ]);
        const campaigns = campaignsData.campaigns || [];

        // Build NGO leaderboard from campaigns
        const ngoMap = {};
        campaigns.forEach(c => {
          if (c.ngo) {
            if (!ngoMap[c.ngo.id]) {
              ngoMap[c.ngo.id] = { name: c.ngo.name, campaigns: 0, points: 0, badges: c.ngo.verified ? ['✅'] : [] };
            }
            ngoMap[c.ngo.id].campaigns += 1;
            ngoMap[c.ngo.id].points += (c.impactScore || 5) * 100 + (c.fundingRaised || 0) / 100;
          }
        });

        const ngoLeaderboard = Object.values(ngoMap)
          .sort((a, b) => b.points - a.points)
          .slice(0, 8)
          .map((n, i) => ({ ...n, rank: i + 1, points: Math.round(n.points) }));

        if (ngoLeaderboard.length > 0) {
          setData(prev => ({ ...prev, ngos: ngoLeaderboard }));
        }
      } catch (e) {
        console.log('Using fallback leaderboard data');
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, []);

  const currentData = data[activeTab] || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🏆 Leaderboard</h1>
        <p className={styles.subtitle}>Top performers making real impact</p>
      </div>

      {/* Podium - Top 3 */}
      <div className={styles.podium}>
        {currentData[1] && (
          <div className={`${styles.podiumItem} ${styles.second}`}>
            <div className={styles.podiumAvatar}>🥈</div>
            <div className={styles.podiumName}>{currentData[1].name}</div>
            <div className={styles.podiumPoints}>{currentData[1].points.toLocaleString()} pts</div>
            <div className={styles.podiumBase} style={{ height: 80 }}>2nd</div>
          </div>
        )}
        {currentData[0] && (
          <div className={`${styles.podiumItem} ${styles.first}`}>
            <div className={styles.podiumCrown}>👑</div>
            <div className={styles.podiumAvatar}>🥇</div>
            <div className={styles.podiumName}>{currentData[0].name}</div>
            <div className={styles.podiumPoints}>{currentData[0].points.toLocaleString()} pts</div>
            <div className={styles.podiumBase} style={{ height: 110 }}>1st</div>
          </div>
        )}
        {currentData[2] && (
          <div className={`${styles.podiumItem} ${styles.third}`}>
            <div className={styles.podiumAvatar}>🥉</div>
            <div className={styles.podiumName}>{currentData[2].name}</div>
            <div className={styles.podiumPoints}>{currentData[2].points.toLocaleString()} pts</div>
            <div className={styles.podiumBase} style={{ height: 60 }}>3rd</div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map(t => (
          <button key={t.key} className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ''}`} onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className={styles.list}>
        {currentData.map(u => (
          <div key={u.rank} className={`${styles.row} ${u.rank <= 3 ? styles.topRow : ''} ${u.isMe ? styles.myRow : ''}`}>
            <div className={styles.rankCell}>
              {u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : u.rank === 3 ? '🥉' : `#${u.rank}`}
            </div>
            <div className={styles.nameCell}>
              <div className={styles.name}>{u.name} {u.isMe && <span className={styles.meTag}>You</span>}</div>
              <div className={styles.meta}>{u.campaigns} campaigns • {(u.badges || []).join(' ')}</div>
            </div>
            <div className={styles.pointsCell}>{u.points.toLocaleString()} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
}
