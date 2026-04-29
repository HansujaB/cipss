import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import { getScoreColor } from '../utils/impactScore';
import styles from './Funding.module.css';

const QUICK_AMOUNTS = [500, 1000, 2500, 5000];
const RAZORPAY_KEY = 'rzp_test_SKouY1M9KggwpT';

export default function Funding() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [txn, setTxn] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const loadCampaign = async () => {
      const res = await fetch(`${API_BASE_URL}/campaigns/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load campaign');
      setCampaign(data);
    };

    loadCampaign().catch((error) => {
      console.error(error);
      setCampaign(undefined);
    });
  }, [id]);

  if (campaign === null) return <div className={styles.notFound}>Loading campaign...</div>;
  if (campaign === undefined) return <div className={styles.notFound}>Campaign not found. <Link to="/campaigns">Go back</Link></div>;

  const scoreColor = getScoreColor(campaign.impactScore);

  const handleRazorpay = () => {
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) { alert('Please enter a valid amount.'); return; }

    setLoading(true);

    const options = {
      key: RAZORPAY_KEY,
      amount: parsed * 100, // in paise
      currency: 'INR',
      name: 'CIPSS',
      description: `Funding: ${campaign.title}`,
      image: 'https://cipss-platform-b289f.web.app/favicon.ico',
      handler: function (response) {
        const transaction = {
          id: response.razorpay_payment_id || `TXN_${Date.now()}`,
          campaignId: campaign.id,
          amount: parsed,
          donorName: donorName || 'Anonymous',
          timestamp: new Date().toISOString(),
          method: 'Razorpay',
        };
        setTxn(transaction);
        setSubmitted(true);
        setLoading(false);
      },
      prefill: {
        name: donorName || 'Anonymous',
        email: donorEmail || '',
      },
      theme: { color: '#1D0A69' },
      modal: {
        ondismiss: () => setLoading(false),
      },
    };

    // Load Razorpay script dynamically
    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      script.onerror = () => {
        setLoading(false);
        alert('Failed to load Razorpay. Using demo mode.');
        handleDemo(parsed);
      };
      document.body.appendChild(script);
    }
  };

  const handleDemo = (parsed) => {
    const token = localStorage.getItem('cipss_token');
    fetch(`${API_BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        campaign_id: campaign.id,
        amount: parsed || parseFloat(amount),
        donor_name: donorName || 'Anonymous',
        donor_email: donorEmail || undefined,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create transaction');
        return fetch(`${API_BASE_URL}/payments/mock-verify/${data.transaction.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
      })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to verify transaction');
        setTxn({
          id: data.transaction.id,
          campaignId: campaign.id,
          amount: parsed || parseFloat(amount),
          donorName: donorName || 'Anonymous',
          timestamp: new Date().toISOString(),
          method: 'Demo',
        });
        setSubmitted(true);
      })
      .catch((error) => {
        alert(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFund = () => {
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) { alert('Please enter a valid amount.'); return; }
    if (paymentMethod === 'razorpay') {
      handleRazorpay();
    } else {
      handleDemo(parsed);
    }
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
          <p className={styles.txnRow}>Method: <strong>{txn.method}</strong></p>
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
          >₹{q.toLocaleString()}</button>
        ))}
      </div>

      <label className={styles.label}>Or Enter Custom Amount</label>
      <input className={styles.input} placeholder="e.g. 3000" type="number" value={amount} onChange={e => setAmount(e.target.value)} />

      <label className={styles.label}>Your Name (optional)</label>
      <input className={styles.input} placeholder="Anonymous" value={donorName} onChange={e => setDonorName(e.target.value)} />

      <label className={styles.label}>Your Email (optional)</label>
      <input className={styles.input} placeholder="email@example.com" type="email" value={donorEmail} onChange={e => setDonorEmail(e.target.value)} />

      {/* Payment Method */}
      <label className={styles.label}>Payment Method</label>
      <div className={styles.paymentMethods}>
        <button
          className={`${styles.payMethod} ${paymentMethod === 'razorpay' ? styles.payMethodActive : ''}`}
          onClick={() => setPaymentMethod('razorpay')}
        >
          <span>💳</span> Razorpay
        </button>
        <button
          className={`${styles.payMethod} ${paymentMethod === 'demo' ? styles.payMethodActive : ''}`}
          onClick={() => setPaymentMethod('demo')}
        >
          <span>🧪</span> Demo Mode
        </button>
      </div>

      {amount && (
        <div className={styles.summary} style={{ borderColor: scoreColor }}>
          You are funding <strong>₹{parseFloat(amount).toLocaleString()}</strong> to <strong>{campaign.title}</strong>
        </div>
      )}

      <button
        className={styles.submitBtn}
        style={{ background: loading ? '#9CA3AF' : scoreColor }}
        onClick={handleFund}
        disabled={loading}
      >
        {loading ? '⏳ Processing...' : paymentMethod === 'razorpay' ? '💳 Pay with Razorpay' : '🧪 Demo Payment'}
      </button>
    </div>
  );
}
