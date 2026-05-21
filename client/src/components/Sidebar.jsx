import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { History, LayoutDashboard, LogOut, PlayCircle, Settings, Trophy, UserCircle, Zap } from 'lucide-react';

const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={19} /> },
    { path: '/quiz', name: 'Play Quiz', icon: <PlayCircle size={19} /> },
    { path: '/leaderboard', name: 'Leaderboard', icon: <Trophy size={19} /> },
    { path: '/history', name: 'History', icon: <History size={19} /> },
    { path: '/profile', name: 'Profile', icon: <UserCircle size={19} /> },
    { path: '/settings', name: 'Settings', icon: <Settings size={19} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">
          <Zap size={21} fill="currentColor" />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900 }}>Trivia X</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem', fontWeight: 700 }}>Knowledge arena</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} className="sidebar-link">
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="sidebar-user">
          <div style={{ display: 'flex', minWidth: 0, alignItems: 'center', gap: '0.75rem' }}>
            <img
              src={user.avatar}
              alt="avatar"
              style={{
                width: 42,
                height: 42,
                flex: '0 0 auto',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.06)',
              }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 800 }}>
                {user.username}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem', fontWeight: 700 }}>Challenger</div>
            </div>
          </div>

          <button className="icon-button" onClick={handleLogoutClick} aria-label="Log out" title="Log out">
            <LogOut size={18} />
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
