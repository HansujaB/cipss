import React, { useState } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import Funding from './pages/Funding';
import Leaderboard from './pages/Leaderboard';
import Achievements from './pages/Achievements';
import Challenges from './pages/Challenges';
import Profile from './pages/Profile';
import Streak from './pages/Streak';
import Login from './pages/Login';
import Register from './pages/Register';
import styles from './App.module.css';

const NAV_ITEMS = [
  { section: 'Main', items: [
    { path: '/', label: 'Dashboard', icon: '🏠', exact: true },
    { path: '/campaigns', label: 'Campaigns', icon: '📋' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  ]},
  { section: 'Achievements', items: [
    { path: '/achievements', label: 'Achievements', icon: '🎖️' },
    { path: '/challenges', label: 'Challenges', icon: '🎯' },
    { path: '/streak', label: 'Streak', icon: '🔥' },
  ]},
  { section: 'Account', items: [
    { path: '/profile', label: 'Profile', icon: '👤' },
  ]},
];

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const hideNav = location.pathname.includes('/campaign/') || location.pathname.includes('/fund/');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const user = JSON.parse(localStorage.getItem('cipss_user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('cipss_token');
    localStorage.removeItem('cipss_user');
    navigate('/login');
  };

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }
  return (
    <div className={styles.app}>
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarLogo}>⚡</span>
          <div>
            <div className={styles.sidebarTitle}>CIPSS</div>
            <div className={styles.sidebarSub}>Social Impact Platform</div>
          </div>
          <button className={styles.closeBtn} onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <nav className={styles.sidebarNav}>
          {NAV_ITEMS.map(section => (
            <div key={section.section} className={styles.navSection}>
              <div className={styles.navSectionTitle}>{section.section}</div>
              {section.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>👤</div>
            <div>
              <div className={styles.userName}>{user?.name || 'Guest User'}</div>
              <div className={styles.userPoints}>{user ? user.role : 'Sign in to participate'}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Top Bar */}
      <header className={styles.topBar}>
        <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>☰</button>
        <div className={styles.brand}>
          <span className={styles.brandLogo}>⚡</span>
          <span className={styles.brandName}>CIPSS</span>
        </div>
        {!hideNav && (
          <nav className={styles.topNav}>
            <NavLink to="/" end className={({ isActive }) => isActive ? `${styles.topNavLink} ${styles.active}` : styles.topNavLink}>🏠 Dashboard</NavLink>
            <NavLink to="/campaigns" className={({ isActive }) => isActive ? `${styles.topNavLink} ${styles.active}` : styles.topNavLink}>📋 Campaigns</NavLink>
            <NavLink to="/leaderboard" className={({ isActive }) => isActive ? `${styles.topNavLink} ${styles.active}` : styles.topNavLink}>🏆 Leaderboard</NavLink>
            <NavLink to="/achievements" className={({ isActive }) => isActive ? `${styles.topNavLink} ${styles.active}` : styles.topNavLink}>🎖️ Achievements</NavLink>
            <NavLink to="/challenges" className={({ isActive }) => isActive ? `${styles.topNavLink} ${styles.active}` : styles.topNavLink}>🎯 Challenges</NavLink>
          </nav>
        )}
        <NavLink to="/profile" className={styles.profileBtn}>
          {user ? `👤 ${user.name?.split(' ')[0]}` : '👤'}
        </NavLink>
        {user ? (
          <button className={styles.logoutBtn} onClick={handleLogout}>Sign Out</button>
        ) : (
          <NavLink to="/login" className={styles.loginBtn}>Sign In</NavLink>
        )}
      </header>

      {/* Page Content */}
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaign/:id" element={<CampaignDetail />} />
          <Route path="/fund/:id" element={<Funding />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/streak" element={<Streak />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
