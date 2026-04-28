import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { campaigns } from '../data/dummyData';
import { getScoreColor } from '../utils/impactScore';
import styles from './Funding.module.css';

const QUICK_AMOUNTS = [500, 1000, 2500, 5000];

export default function Funding() {
  const { id } = useParams();
  const navigate = useNavigate();
  const campaign = campaigns.find(c => c.id === id);
  const [amount, setAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [txn, setTxn] = useState(null);

  if (!campaign) return <div className={styles.notFound}>Campaign not found. <Link to="/campaigns">Go back</Link></div>;

  const scoreColor = getScoreColor(campaign.impactScore);

  const handleFund = () => {
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) { alert('Please enter a valid amount.'); return; }
    const transaction = {
      id: Date.now().toString(),
      campaignId: campaign.id,
      amount: parsed,
      donorName: donorName || 'Anonymous',
      timestamp: new Date().toISOString(),
    };
    setTxn(transaction);
    setSubmitted(true);
  };

  if (submitted && txn) {
    return (
      <div className={styles.success}>
        <span className={styles.successIcon}>🎉</span>
        <h2 className={styles.successTitle}>Thank You!</h2>
        <p className={styles.successMsg}>₹{txn.amount.toLocaleString()} funded to</p>
        <p className={styles.successCampaign}>{campaign.title}</p>
        <div className={styles.txnCard}>
          <p className={styles.txnRow}>Transaction ID: <strong>{txn.id}</strong></p>
          <p className={styles.txnRow}>Donor: <strong>{txn.donorName}</strong></p>
          <p className={styles.txnRow}>Time: <strong>{new Date(txn.timestamp).toLocaleTimeString()}</strong></p>
        </div>
        <Link to="/campaigns" className={styles.backBtn} style={{ background: scoreColor }}>Back to Campaigns</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.back} onClick={() => navigate(-1)}>← Back</button>
      <h1 className={styles.title}>Fund a Campaign</h1>
      <p className={styles.campaignName}>{campaign.title}</p>
      <p className={styles.location}>📍 {campaign.location}</p>

      <label className={styles.label}>Quick Select Amount (₹)</label>
      <div className={styles.quickRow}>
        {QUICK_AMOUNTS.map(q => (
          <button
            key={q}
            className={`${styles.quickBtn} ${parseFloat(amount) === q ? styles.quickActive : ''}`}
            style={parseFloat(amount) === q ? { background: scoreColor, borderColor: scoreColor, color: '#fff' } : {}}
            onClick={() => setAmount(q.toString())}
          >
            ₹{q.toLocaleString()}
          </button>
        ))}
      </div>

      <label className={styles.label}>Or Enter Custom Amount</label>
      <input className={styles.input} placeholder="e.g. 3000" type="number" value={amount} onChange={e => setAmount(e.target.value)} />

      <label className={styles.label}>Your Name (optional)</label>
      <input className={styles.input} placeholder="Anonymous" value={donorName} onChange={e => setDonorName(e.target.value)} />

      {amount && (
        <div className={styles.summary} style={{ borderColor: scoreColor }}>
          You are funding <strong>₹{parseFloat(amount).toLocaleString()}</strong> to <strong>{campaign.title}</strong>
        </div>
      )}

      <button className={styles.submitBtn} style={{ background: scoreColor }} onClick={handleFund}>
        💳 Confirm Funding
      </button>
    </div>
  );
}
