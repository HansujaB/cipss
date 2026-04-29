import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, getUser } from '../services/api';
import { domainColors, domainLabels } from '../data/dummyData';
import { getScoreColor, getScoreLabel } from '../utils/impactScore';
import styles from './Campaigns.module.css';

const DOMAINS = ['All', 'waste_management', 'environment', 'education'];

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [joinedIds, setJoinedIds] = useState(new Set());
  const user = getUser();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get('/campaigns');
        setCampaigns(data.campaigns || []);
        setFiltered(data.campaigns || []);
      } catch (e) {
        console.error(e);
      }
      // Load joined campaigns
      if (user) {
        try {
          const data = await api.get('/campaigns/mine/joined');
          setJoinedIds(new Set((data.campaigns || []).map(c => c.id)));
        } catch {}
      }
    };
    load();
  }, []);

  useEffect(() => {
    let result = campaigns;
    if (activeFilter !== 'All') result = result.filter(c => c.domain === activeFilter);
    if (search.trim()) result = result.filter(c =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.location || '').toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, activeFilter, campaigns]);

  const handleJoin = async (campaignId) => {
    if (!user) { alert('Please login to join campaigns'); return; }
    try {
      await api.post(`/campaigns/${campaignId}/join`, {});
      setJoinedIds(prev => new Set([...prev, campaignId]));
      alert('🎉 Joined campaign successfully!');
    } catch (e) {
      alert(e.message || 'Failed to join');
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>CSR Campaigns</h1>
        <p className={styles.sub}>{filtered.length} active campaigns</p>
      </div>

      <input
        className={styles.search}
        placeholder="Search campaigns or locations..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className={styles.filters}>
        {DOMAINS.map(d => (
          <button
            key={d}
            className={`${styles.filterBtn} ${activeFilter === d ? styles.active : ''}`}
            onClick={() => setActiveFilter(d)}
          >
            {d === 'All' ? '🌐 All' : domainLabels[d] || d}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map(c => <CampaignCard key={c.id} campaign={c} joined={joinedIds.has(c.id)} onJoin={handleJoin} />)}
        {filtered.length === 0 && <p className={styles.empty}>No campaigns found.</p>}
      </div>
    </div>
  );
}

function CampaignCard({ campaign, joined, onJoin }) {
  const scoreColor = getScoreColor(campaign.impactScore);
  const domainColor = domainColors[campaign.domain] || '#888';
  const fundingRaised = campaign.fundingRaised || 0;
  const fundingGoal = campaign.fundingGoal || 1;
  const pct = Math.min(Math.round((fundingRaised / fundingGoal) * 100), 100);

  return (
    <div className={styles.card}>
      <div className={styles.domainBadge} style={{ background: domainColor + '22', borderColor: domainColor, color: domainColor }}>
        {domainLabels[campaign.domain] || campaign.domain}
      </div>
      <h3 className={styles.cardTitle}>{campaign.title}</h3>
      <p className={styles.cardLocation}>📍 {campaign.location || campaign.area || 'TBD'}</p>
      <p className={styles.cardDesc}>{campaign.description}</p>

      <div className={styles.scoreBadge} style={{ background: scoreColor + '22', borderColor: scoreColor, color: scoreColor }}>
        ⚡ {campaign.impactScore || 'N/A'} — {getScoreLabel(campaign.impactScore)}
      </div>

      <div className={styles.fundingBar}>
        <div className={styles.fundingFill} style={{ width: `${pct}%`, background: scoreColor }} />
      </div>
      <div className={styles.fundingMeta}>
        <span>₹{fundingRaised.toLocaleString()} raised</span>
        <span>Goal: ₹{fundingGoal.toLocaleString()}</span>
      </div>

      <p className={styles.volunteers}>👥 {campaign.volunteers || campaign.plannedVolunteers || 0} volunteers</p>

      <div className={styles.actions}>
        <Link to={`/campaign/${campaign.id}`} className={styles.detailBtn}>View Details</Link>
        {joined ? (
          <span className={styles.joinedTag}>✅ Joined</span>
        ) : (
          <button className={styles.joinBtn} onClick={() => onJoin(campaign.id)}>Join</button>
        )}
        <Link to={`/fund/${campaign.id}`} className={styles.fundBtn} style={{ background: scoreColor }}>💳 Fund</Link>
      </div>
    </div>
  );
}
