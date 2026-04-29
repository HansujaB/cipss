import React, { useState } from 'react';
import styles from './Generic.module.css';

const IMPACT_DATA = {
  totalCampaigns: 7,
  totalVolunteers: 450,
  totalFunding: 125000,
  co2Saved: 2400,
  treesPlanted: 1200,
  livesImpacted: 3500,
  domains: [
    { name: 'Environment', campaigns: 3, impact: 8.5, color: '#22C55E' },
    { name: 'Education', campaigns: 2, impact: 7.8, color: '#3B82F6' },
    { name: 'Health', campaigns: 1, impact: 9.2, color: '#EC4899' },
    { name: 'Waste', campaigns: 1, impact: 7.1, color: '#F97316' },
  ],
  monthly: [
    { month: 'Jan', campaigns: 1, funding: 15000 },
    { month: 'Feb', campaigns: 2, funding: 28000 },
    { month: 'Mar', campaigns: 1, funding: 22000 },
    { month: 'Apr', campaigns: 3, funding: 60000 },
  ],
};

export default function ImpactDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>📊 Impact Dashboard</h1>
        <p className={styles.subtitle}>Your real-world impact at a glance</p>
      </div>

      <div className={styles.statGrid} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className={styles.statCard}><div className={styles.statValue} style={{ color: '#22C55E' }}>{IMPACT_DATA.treesPlanted.toLocaleString()}</div><div className={styles.statLabel}>🌳 Trees Planted</div></div>
        <div className={styles.statCard}><div className={styles.statValue} style={{ color: '#3B82F6' }}>{IMPACT_DATA.livesImpacted.toLocaleString()}</div><div className={styles.statLabel}>❤️ Lives Impacted</div></div>
        <div className={styles.statCard}><div className={styles.statValue} style={{ color: '#F59E0B' }}>{IMPACT_DATA.co2Saved.toLocaleString()}kg</div><div className={styles.statLabel}>🌍 CO₂ Saved</div></div>
      </div>

      <div className={styles.tabs}>
        {['overview', 'by domain', 'timeline'].map(t => (
          <button key={t} className={`${styles.tab} ${activeTab === t ? styles.tabActive : ''}`} onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className={styles.grid}>
          {[
            { label: 'Total Campaigns', value: IMPACT_DATA.totalCampaigns, icon: '📋', color: '#3B82F6' },
            { label: 'Volunteers Engaged', value: IMPACT_DATA.totalVolunteers, icon: '👥', color: '#8B5CF6' },
            { label: 'Total Funding', value: `₹${(IMPACT_DATA.totalFunding/1000).toFixed(0)}K`, icon: '💰', color: '#22C55E' },
            { label: 'Avg Impact Score', value: '8.2', icon: '⚡', color: '#F59E0B' },
          ].map(s => (
            <div key={s.label} className={styles.card} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'by domain' && (
        <div className={styles.list}>
          {IMPACT_DATA.domains.map(d => (
            <div key={d.name} className={styles.listItem}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
              <div className={styles.listInfo}>
                <div className={styles.listTitle}>{d.name}</div>
                <div className={styles.listSub}>{d.campaigns} campaigns</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, color: d.color, fontSize: 18 }}>⚡{d.impact}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>avg impact</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className={styles.list}>
          {IMPACT_DATA.monthly.map(m => (
            <div key={m.month} className={styles.listItem}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#1A1A2E' }}>{m.month}</div>
              <div className={styles.listInfo}>
                <div className={styles.listTitle}>{m.campaigns} campaign{m.campaigns > 1 ? 's' : ''}</div>
                <div className={styles.listSub}>₹{m.funding.toLocaleString()} raised</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
