import React, { useState } from 'react';
import styles from './Generic.module.css';

const MENTORS = [
  { id: 1, name: 'Dr. Priya Sharma', role: 'NGO Director', expertise: ['Environment', 'Fundraising'], rating: 4.9, sessions: 120, avatar: '👩‍💼', available: true },
  { id: 2, name: 'Rahul Mehta', role: 'CSR Manager', expertise: ['Corporate CSR', 'Impact Measurement'], rating: 4.8, sessions: 85, avatar: '👨‍💼', available: true },
  { id: 3, name: 'Anjali Patel', role: 'Social Entrepreneur', expertise: ['Education', 'Women Empowerment'], rating: 4.7, sessions: 64, avatar: '👩‍🏫', available: false },
  { id: 4, name: 'Vikram Singh', role: 'Impact Investor', expertise: ['Funding', 'Scaling NGOs'], rating: 4.9, sessions: 200, avatar: '👨‍💻', available: true },
];

export default function Mentorship() {
  const [activeTab, setActiveTab] = useState('find');
  const [selected, setSelected] = useState(null);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>👨‍🏫 Mentorship</h1>
        <p className={styles.subtitle}>Connect with experienced social impact leaders</p>
      </div>

      <div className={styles.tabs}>
        {['find', 'my sessions', 'become mentor'].map(t => (
          <button key={t} className={`${styles.tab} ${activeTab === t ? styles.tabActive : ''}`} onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'find' && (
        <div className={styles.grid}>
          {MENTORS.map(m => (
            <div key={m.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.avatar}>{m.avatar}</span>
                <div>
                  <div className={styles.cardTitle}>{m.name}</div>
                  <div className={styles.cardSub}>{m.role}</div>
                </div>
                <span className={`${styles.badge} ${m.available ? styles.badgeGreen : styles.badgeGray}`}>
                  {m.available ? 'Available' : 'Busy'}
                </span>
              </div>
              <div className={styles.tags}>
                {m.expertise.map(e => <span key={e} className={styles.tag}>{e}</span>)}
              </div>
              <div className={styles.cardMeta}>
                <span>⭐ {m.rating}</span>
                <span>📅 {m.sessions} sessions</span>
              </div>
              <button className={styles.actionBtn} disabled={!m.available} onClick={() => setSelected(m)}>
                {m.available ? 'Request Session' : 'Not Available'}
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'my sessions' && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📅</div>
          <div className={styles.emptyText}>No sessions yet</div>
          <div className={styles.emptySub}>Request a session from a mentor to get started</div>
        </div>
      )}

      {activeTab === 'become mentor' && (
        <div className={styles.card} style={{ maxWidth: 500 }}>
          <h2 className={styles.cardTitle}>Share Your Expertise</h2>
          <p className={styles.cardSub} style={{ marginBottom: 16 }}>Help others grow in the social impact space</p>
          <input className={styles.input} placeholder="Your name" />
          <input className={styles.input} placeholder="Your role / expertise" />
          <textarea className={styles.textarea} placeholder="Tell us about your experience..." />
          <button className={styles.actionBtn}>Apply to be a Mentor</button>
        </div>
      )}

      {selected && (
        <div className={styles.modal} onClick={() => setSelected(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2>Request Session with {selected.name}</h2>
            <p>{selected.role}</p>
            <textarea className={styles.textarea} placeholder="What would you like to discuss?" />
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button className={styles.actionBtn} onClick={() => { alert('Session requested!'); setSelected(null); }}>Send Request</button>
              <button className={styles.cancelBtn} onClick={() => setSelected(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
