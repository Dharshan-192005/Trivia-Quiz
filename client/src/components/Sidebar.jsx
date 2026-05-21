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
      background: '#0a0a0a',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
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
          background: '#ffffff',
          padding: '0.4rem',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Zap color="#000000" fill="#000000" size={22} />
        </div>
        <span style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: '1.6rem', 
          fontWeight: 900,
          letterSpacing: '-0.02em',
          color: '#ffffff'
        }}>
          TRIVIA X
        </span>
      </div>

      {/* Nav List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.875rem 1.15rem',
              borderRadius: '14px',
              fontFamily: 'var(--font-body)',
              color: isActive ? '#000000' : '#888888',
              background: isActive ? '#ffffff' : 'transparent',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              transition: 'all 0.15s ease',
              borderBottom: isActive ? '3px solid #999999' : '3px solid transparent',
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.color = '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#888888';
              }
            }}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Session Footer */}
      {user && (
        <div style={{
          marginTop: 'auto',
          padding: '1.25rem',
          background: '#111111',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
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
                border: '2px solid rgba(255, 255, 255, 0.2)',
                background: '#1a1a1a'
              }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
                {user.username}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#666666', fontWeight: 600 }}>
                Challenger
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleLogoutClick}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#666666',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              transition: 'all 0.15s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = '#666666'; e.currentTarget.style.background = 'transparent'; }}
          >
            <LogOut size={18} />
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
