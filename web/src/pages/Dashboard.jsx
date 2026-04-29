import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getUser } from '../services/api';
import { getScoreColor, getScoreLabel } from '../utils/impactScore';
import { domainColors, domainLabels } from '../data/dummyData';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({ total: 0, funding: 0, volunteers: 0, avgImpact: 0 });
  const [myCampaigns, setMyCampaigns] = useState([]);
  const user = getUser();

  useEffect(() => {
    const load = async () => {
      try {
        // Try dashboard summary first
        const data = await api.get('/campaigns/dashboard/summary');
        setCampaigns(data.topCampaigns || []);
        setStats({
          total: data.stats?.totalCampaigns || 0,
          funding: data.stats?.totalFunding || 0,
          volunteers: data.stats?.totalVolunteers || 0,
          avgImpact: data.stats?.avgImpact || 0,
        });
      } catch {
        // Fallback to campaigns list
        try {
          const data = await api.get('/campaigns');
          const list = data.campaigns || [];
          const top = [...list].sort((a, b) => (b.impactScore || 0) - (a.impactScore || 0)).slice(0, 3);
          setCampaigns(top);
          setStats({
            total: list.length,
            funding: list.reduce((s, c) => s + (c.fundingRaised || 0), 0),
            volunteers: list.reduce((s, c) => s + (c.volunteers || c.plannedVolunteers || 0), 0),
            avgImpact: list.length ? (list.reduce((s, c) => s + (c.impactScore || 0), 0) / list.length).toFixed(1) : 0,
          });
        } catch (e) { console.error(e); }
      }

      // Load joined campaigns if logged in
      if (user) {
        try {
          const data = await api.get('/campaigns/mine/joined');
          setMyCampaigns(data.campaigns || []);
        } catch {}
      }
    };
    load();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <p className={styles.greeting}>Good work, {user?.name || 'Team'}! 👋</p>
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

      {/* My Campaigns */}
      {myCampaigns.length > 0 && (
        <>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>🙋 My Campaigns</h2>
          </div>
          <div className={styles.campaignGrid}>
            {myCampaigns.slice(0, 3).map(c => <CampaignCard key={c.id} campaign={c} />)}
          </div>
        </>
      )}

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
  const fundingRaised = campaign.fundingRaised || 0;
  const fundingGoal = campaign.fundingGoal || 1;
  const pct = Math.min(Math.round((fundingRaised / fundingGoal) * 100), 100);

  return (
    <Link to={`/campaign/${campaign.id}`} className={styles.card}>
      <div className={styles.domainBadge} style={{ background: domainColor + '22', borderColor: domainColor, color: domainColor }}>
        {domainLabels[campaign.domain] || campaign.domain}
      </div>
      <h3 className={styles.cardTitle}>{campaign.title}</h3>
      <p className={styles.cardLocation}>📍 {campaign.location || campaign.area || 'TBD'}</p>
      <div className={styles.scoreBadge} style={{ background: scoreColor + '22', borderColor: scoreColor, color: scoreColor }}>
        ⚡ {campaign.impactScore || 'N/A'} — {getScoreLabel(campaign.impactScore)}
      </div>
      <div className={styles.fundingBar}>
        <div className={styles.fundingFill} style={{ width: `${pct}%`, background: scoreColor }} />
      </div>
      <div className={styles.fundingMeta}>
        <span>₹{fundingRaised.toLocaleString()} raised</span>
        <span>{pct}%</span>
      </div>
    </Link>
  );
}
