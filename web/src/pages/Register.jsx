import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import styles from './Auth.module.css';
const ROLES = [
  { key: 'volunteer', label: 'Volunteer', icon: '🙋', desc: 'Join campaigns and make impact' },
  { key: 'ngo_admin', label: 'NGO', icon: '🏢', desc: 'Create and manage campaigns' },
  { key: 'company', label: 'CSR Company', icon: '💰', desc: 'Fund campaigns you care about' },
  { key: 'influencer', label: 'Influencer', icon: '📱', desc: 'Promote verified campaigns' },
];

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('volunteer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      localStorage.setItem('cipss_token', data.token);
      localStorage.setItem('cipss_user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>⚡</div>
        <h1 className={styles.title}>Join CIPSS</h1>
        <p className={styles.subtitle}>Create your account</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Full Name</label>
            <input className={styles.input} placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input className={styles.input} type="password" placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>I am a...</label>
            <div className={styles.roles}>
              {ROLES.map(r => (
                <button key={r.key} type="button"
                  className={`${styles.roleCard} ${role === r.key ? styles.roleActive : ''}`}
                  onClick={() => setRole(r.key)}
                >
                  <div className={styles.roleIcon}>{r.icon}</div>
                  <div className={styles.roleName}>{r.label}</div>
                  <div className={styles.roleDesc}>{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? '⏳ Creating account...' : '🚀 Create Account'}
          </button>
        </form>

        <p className={styles.switchText}>
          Already have an account? <Link to="/login" className={styles.link}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
