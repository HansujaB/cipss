import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { campaigns, domainColors, domainLabels } from '../data/dummyData';
import { getScoreColor, getScoreLabel } from '../utils/impactScore';
import styles from './CampaignDetail.module.css';

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const campaign = campaigns.find(c => c.id === id);
  const [joined, setJoined] = useState(false);

  if (!campaign) return <div className={styles.notFound}>Campaign not found. <Link to="/campaigns">Go back</Link></div>;

  const scoreColor = getScoreColor(campaign.impactScore);
  const domainColor = domainColors[campaign.domain] || '#888';
  const pct = Math.min(Math.round((campaign.fundingRaised / campaign.fundingGoal) * 100), 100);

  return (
    <div className={styles.container}>
      <button className={styles.back} onClick={() => navigate(-1)}>← Back</button>

      <div className={styles.domainBadge} style={{ background: domainColor + '22', borderColor: domainColor, color: domainColor }}>
        {domainLabels[campaign.domain] || campaign.domain}
      </div>

      <h1 className={styles.title}>{campaign.title}</h1>
      <p className={styles.location}>📍 {campaign.location}</p>

      <h2 className={styles.sectionTitle}>About this Campaign</h2>
      <p className={styles.description}>{campaign.description}</p>

      {/* Impact Score Box */}
      <div className={styles.impactBox} style={{ borderColor: scoreColor }}>
        <p className={styles.impactBoxLabel}>Overall Impact Score</p>
        <p className={styles.impactScore} style={{ color: scoreColor }}>⚡ {campaign.impactScore}</p>
        <p className={styles.impactLabel} style={{ color: scoreColor }}>{getScoreLabel(campaign.impactScore)}</p>
      </div>

      {/* Score Breakdown */}
      <h2 className={styles.sectionTitle}>Score Breakdown</h2>
      <ScoreRow label="Need Score" value={campaign.needScore} />
      <ScoreRow label="Trust Score" value={campaign.trustScore} />
      <ScoreRow label="Expected Impact" value={campaign.expectedImpact} />

      {/* Funding */}
      <h2 className={styles.sectionTitle}>Funding Progress</h2>
      <div className={styles.fundingCard}>
        <div className={styles.fundingBar}>
          <div className={styles.fundingFill} style={{ width: `${pct}%`, background: scoreColor }} />
        </div>
        <div className={styles.fundingMeta}>
          <span>₹{campaign.fundingRaised.toLocaleString()} raised</span>
          <span>Goal: ₹{campaign.fundingGoal.toLocaleString()}</span>
        </div>
        <p className={styles.fundingPct}>{pct}% funded</p>
      </div>

      <p className={styles.volunteers}>👥 {campaign.volunteers} volunteers enrolled</p>

      {/* Join/Leave */}
      {joined ? (
        <button className={styles.leaveBtn} onClick={() => setJoined(false)}>Leave Campaign</button>
      ) : (
        <button className={styles.joinBtn} onClick={() => setJoined(true)}>Join Campaign</button>
      )}

      {/* Fund CTA */}
      <Link to={`/fund/${campaign.id}`} className={styles.fundBtn} style={{ background: scoreColor }}>
        💳 Fund this Campaign
      </Link>
    </div>
  );
}

function ScoreRow({ label, value }) {
  const color = getScoreColor(value);
  return (
    <div className={styles.scoreRow}>
      <span className={styles.scoreLabel}>{label}</span>
      <div className={styles.scoreBarWrap}>
        <div className={styles.scoreBar} style={{ width: `${value * 10}%`, background: color }} />
      </div>
      <span className={styles.scoreValue} style={{ color }}>{value}/10</span>
    </div>
  );
}
