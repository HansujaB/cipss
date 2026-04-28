import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';

const BACKEND_URL = 'https://cipss-backend-416772230892.us-central1.run.app/api/v1';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('cipss_token', data.token);
      localStorage.setItem('cipss_user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    localStorage.setItem('cipss_token', 'demo_token');
    localStorage.setItem('cipss_user', JSON.stringify({ name: 'Demo User', email: 'demo@cipss.com', role: 'volunteer' }));
    navigate('/');
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>⚡</div>
        <h1 className={styles.title}>Welcome to CIPSS</h1>
        <p className={styles.subtitle}>Sign in to your account</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input className={styles.input} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? '⏳ Signing in...' : '🔐 Sign In'}
          </button>
        </form>

        <div className={styles.divider}><span>or</span></div>

        <button className={styles.demoBtn} onClick={handleDemo}>
          🧪 Continue as Demo User
        </button>

        <p className={styles.switchText}>
          Don't have an account? <Link to="/register" className={styles.link}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
