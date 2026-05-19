import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlayCircle, Trophy, History, UserCircle, Settings, LogOut, Zap } from 'lucide-react';

const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/quiz', name: 'Play Quiz', icon: <PlayCircle size={20} /> },
    { path: '/leaderboard', name: 'Leaderboard', icon: <Trophy size={20} /> },
    { path: '/history', name: 'History', icon: <History size={20} /> },
    { path: '/profile', name: 'Profile', icon: <UserCircle size={20} /> },
    { path: '/settings', name: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside style={{
      width: '270px',
      height: '100vh',
      background: 'var(--bg-surface)',
      borderRight: '2px solid rgba(255, 255, 255, 0.05)',
      boxShadow: '4px 0 20px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1.5rem 1.5rem 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', padding: '0 0.5rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
          padding: '0.4rem',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(136, 84, 192, 0.4)'
        }}>
          <Zap color="white" fill="white" size={22} />
        </div>
        <span style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: '1.6rem', 
          fontWeight: 900,
          letterSpacing: '-0.02em',
          background: 'linear-gradient(to right, #ffffff, var(--text-secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          TRIVIA X
        </span>
      </div>

      {/* Nav List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.875rem 1.15rem',
              borderRadius: '16px',
              fontFamily: 'var(--font-body)',
              color: isActive ? 'white' : 'var(--text-secondary)',
              background: isActive ? 'var(--accent-primary)' : 'transparent',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              transition: 'all 0.1s ease',
              borderBottom: isActive ? '4px solid #5a3089' : '4px solid transparent',
              transform: isActive ? 'translateY(1px)' : 'none'
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Session Footer card */}
      {user && (
        <div style={{
          marginTop: 'auto',
          padding: '1.25rem',
          background: 'rgba(0, 0, 0, 0.15)',
          borderRadius: '18px',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src={user.avatar} 
              alt="avatar" 
              style={{ 
                width: 42, 
                height: 42, 
                borderRadius: '50%', 
                border: '2px solid var(--accent-primary)',
                background: 'var(--bg-base)'
              }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {user.username}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Challenger
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleLogoutClick}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              transition: 'all 0.1s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'var(--error)'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <LogOut size={18} />
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
