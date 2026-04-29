import React, { useState } from 'react';
import styles from './Generic.module.css';

const USERS = [
  { id: 1, name: 'Priya Sharma', role: 'Volunteer', campaigns: 12, points: 2850, avatar: '👩', following: false },
  { id: 2, name: 'Rahul Verma', role: 'NGO Admin', campaigns: 10, points: 2640, avatar: '👨', following: true },
  { id: 3, name: 'Anjali Patel', role: 'Donor', campaigns: 9, points: 2420, avatar: '👩‍💼', following: false },
  { id: 4, name: 'Vikram Singh', role: 'Volunteer', campaigns: 8, points: 2180, avatar: '👨‍💻', following: true },
  { id: 5, name: 'Neha Gupta', role: 'Influencer', campaigns: 7, points: 1950, avatar: '👩‍🎤', following: false },
];

export default function Network() {
  const [users, setUsers] = useState(USERS);
  const [activeTab, setActiveTab] = useState('discover');
  const [search, setSearch] = useState('');

  const toggleFollow = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, following: !u.following } : u));
  };

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));
  const following = users.filter(u => u.following);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🔗 Network</h1>
        <p className={styles.subtitle}>Connect with volunteers, NGOs and donors</p>
      </div>

      <div className={styles.statGrid}>
        <div className={styles.statCard}><div className={styles.statValue}>{following.length}</div><div className={styles.statLabel}>Following</div></div>
        <div className={styles.statCard}><div className={styles.statValue}>3</div><div className={styles.statLabel}>Followers</div></div>
        <div className={styles.statCard}><div className={styles.statValue}>{users.length}</div><div className={styles.statLabel}>Connections</div></div>
      </div>

      <div className={styles.tabs}>
        {['discover', 'following'].map(t => (
          <button key={t} className={`${styles.tab} ${activeTab === t ? styles.tabActive : ''}`} onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <input className={styles.input} placeholder="Search people..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 16 }} />

      <div className={styles.list}>
        {(activeTab === 'discover' ? filtered : following).map(u => (
          <div key={u.id} className={styles.listItem}>
            <span className={styles.listIcon}>{u.avatar}</span>
            <div className={styles.listInfo}>
              <div className={styles.listTitle}>{u.name}</div>
              <div className={styles.listSub}>{u.role} • {u.campaigns} campaigns • ⚡{u.points} pts</div>
            </div>
            <button
              onClick={() => toggleFollow(u.id)}
              style={{ padding: '8px 16px', borderRadius: 10, border: u.following ? '1px solid #E5E7EB' : 'none', background: u.following ? '#fff' : '#1A1A2E', color: u.following ? '#374151' : '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}
            >
              {u.following ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
