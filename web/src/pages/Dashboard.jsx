import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import { getScoreColor, getScoreLabel } from '../utils/impactScore';
import { domainColors, domainLabels } from '../data/dummyData';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({ total: 0, funding: 0, volunteers: 0, avgImpact: 0 });
  const [hotspots, setHotspots] = useState([]);
  const [mapsEnabled, setMapsEnabled] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Try dashboard summary first
        const res = await fetch(`${API_BASE_URL}/campaigns/dashboard/summary`);
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data.topCampaigns || []);
          setStats({
            total: data.stats?.totalCampaigns || 0,
            funding: data.stats?.totalFunding || 0,
            volunteers: data.stats?.totalVolunteers || 0,
            avgImpact: data.stats?.avgImpact || 0,
          });
          return;
        }
      } catch (e) {}

      // Fallback: fetch campaigns directly
      try {
        const res = await fetch(`${API_BASE_URL}/campaigns`);
        const data = await res.json();
        const list = data.campaigns || [];
        const top = [...list].sort((a, b) => (b.impactScore || 0) - (a.impactScore || 0)).slice(0, 3);
        setCampaigns(top);
        setStats({
          total: list.length,
          funding: list.reduce((s, c) => s + (c.fundingGoal || 0), 0),
          volunteers: list.reduce((s, c) => s + (c.plannedVolunteers || 0), 0),
          avgImpact: list.length ? (list.reduce((s, c) => s + (c.impactScore || 0), 0) / list.length).toFixed(1) : 0,
        });
      } catch (e) {
        console.error('Failed to load campaigns:', e);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <p className={styles.greeting}>Good work, Team! 👋</p>
        <h1 className={styles.title}>CSR Dashboard</h1>
        <p className={styles.subtitle}>Data-driven social impact at scale</p>
        {mapsEnabled && <p className={styles.subtitle}>Google Maps enrichment enabled</p>}
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatCard icon="📋" label="Campaigns" value={stats.total} color="#3B82F6" />
        <StatCard icon="👥" label="Volunteers" value={stats.volunteers} color="#8B5CF6" />
        <StatCard icon="💰" label="Total Funded" value={`₹${(stats.funding / 1000).toFixed(0)}K`} color="#22C55E" />
        <StatCard icon="⚡" label="Avg Impact" value={stats.avgImpact} color="#F59E0B" />
      </div>

      {hotspots.length > 0 && (
        <div className={styles.card} style={{ marginBottom: 24 }}>
          <h3 className={styles.cardTitle}>📍 Priority Hotspots</h3>
          {hotspots.slice(0, 3).map((spot, index) => (
            <p key={`${spot.area || 'spot'}-${index}`} className={styles.cardLocation}>
              {spot.area || `${spot.lat}, ${spot.lng}`} • Need {spot.needScore}
            </p>
          ))}
        </div>
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
