import React from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import Funding from './pages/Funding';
import Leaderboard from './pages/Leaderboard';
import styles from './App.module.css';

export default function App() {
  const location = useLocation();
  const hideNav = location.pathname.includes('/campaign/') || location.pathname.includes('/fund/');

  return (
    <div className={styles.app}>
      {/* Top Nav */}
      <nav className={styles.nav}>
        <div className={styles.navBrand}>
          <span className={styles.navLogo}>⚡</span>
          <span className={styles.navTitle}>CIPSS</span>
          <span className={styles.navSub}>Social Impact Platform</span>
        </div>
        {!hideNav && (
          <div className={styles.navLinks}>
            <NavLink to="/" end className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
              🏠 Dashboard
            </NavLink>
            <NavLink to="/campaigns" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
              📋 Campaigns
            </NavLink>
            <NavLink to="/leaderboard" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
              🏆 Leaderboard
            </NavLink>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaign/:id" element={<CampaignDetail />} />
          <Route path="/fund/:id" element={<Funding />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </main>
    </div>
  );
}
