import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { campaigns as dummyData } from '../data/dummyData';
import { getScoreColor, getScoreLabel } from '../utils/impactScore';
import { domainColors, domainLabels } from '../data/dummyData';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({ total: 0, funding: 0, volunteers: 0, avgImpact: 0 });

  useEffect(() => {
    // Use dummy data with fallback
    const data = dummyData;
    setCampaigns(data.slice(0, 3));
    setStats({
      total: data.length,
      funding: data.reduce((s, c) => s + c.fundingRaised, 0),
      volunteers: data.reduce((s, c) => s + c.volunteers, 0),
      avgImpact: (data.reduce((s, c) => s + c.impactScore, 0) / data.length).toFixed(1),
    });
  }, []);

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <p className={styles.greeting}>Good work, Team! 👋</p>
        <h1 className={styles.title}>CSR Dashboard</h1>
        <p className={styles.subtitle}>Data-driven social impact at scale</p>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatCard icon="📋" label="Campaigns" value={stats.total} color="#3B82F6" />
        <StatCard icon="👥" label="Volunteers" value={stats.volunteers} color="#8B5CF6" />
        <StatCard icon="💰" label="Total Funded" value={`₹${(stats.funding / 1000).toFixed(0)}K`} color="#22C55E" />
        <StatCard icon="⚡" label="Avg Impact" value={stats.avgImpact} color="#F59E0B" />
      </div>

      {/* Top Campaigns */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>🏆 Top Impact Campaigns</h2>
        <Link to="/campaigns" className={styles.seeAll}>See all →</Link>
      </div>

      <div className={styles.campaignGrid}>
        {campaigns.map(c => (
          <CampaignCard key={c.id} campaign={c} />
        ))}
      </div>

      {/* CTA */}
      <Link to="/campaigns" className={styles.cta}>
        Browse All Campaigns →
      </Link>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className={styles.statCard} style={{ borderLeftColor: color }}>
      <span className={styles.statIcon}>{icon}</span>
      <span className={styles.statValue} style={{ color }}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

function CampaignCard({ campaign }) {
  const scoreColor = getScoreColor(campaign.impactScore);
  const domainColor = domainColors[campaign.domain] || '#888';
  const pct = Math.min(Math.round((campaign.fundingRaised / campaign.fundingGoal) * 100), 100);

  return (
    <Link to={`/campaign/${campaign.id}`} className={styles.card}>
      <div className={styles.domainBadge} style={{ background: domainColor + '22', borderColor: domainColor, color: domainColor }}>
        {domainLabels[campaign.domain] || campaign.domain}
      </div>
      <h3 className={styles.cardTitle}>{campaign.title}</h3>
      <p className={styles.cardLocation}>📍 {campaign.location}</p>
      <div className={styles.scoreBadge} style={{ background: scoreColor + '22', borderColor: scoreColor, color: scoreColor }}>
        ⚡ {campaign.impactScore} — {getScoreLabel(campaign.impactScore)}
      </div>
      <div className={styles.fundingBar}>
        <div className={styles.fundingFill} style={{ width: `${pct}%`, background: scoreColor }} />
      </div>
      <div className={styles.fundingMeta}>
        <span>₹{campaign.fundingRaised.toLocaleString()} raised</span>
        <span>{pct}%</span>
      </div>
    </Link>
  );
}
