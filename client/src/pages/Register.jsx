import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import bgImage from '../assets/auth_bg.png';

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isReadonly, setIsReadonly] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      onRegister(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Choose a different username.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      
      {/* Left Sidebar */}
      <div 
        className="auth-sidebar"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="auth-sidebar-content animate-slide-up delay-100">
          <h1 style={{ color: 'white', background: 'none', WebkitTextFillColor: 'white', fontSize: 'clamp(2.7rem, 6vw, 5rem)', lineHeight: 1.02, marginBottom: '20px' }}>
            Join Trivia X
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: 1.6 }}>
            Create your profile, choose a topic, and start collecting scores, badges, and leaderboard placements.
          </p>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="auth-form-container">
        <div className="auth-form-wrapper animate-slide-up delay-200">
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Sign up</h2>
          </div>

          {error && (
            <div style={{ 
              color: 'var(--error)', 
              marginBottom: '1.5rem', 
              textAlign: 'center', 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="label">
                Username
              </label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required 
                disabled={loading}
                readOnly={isReadonly}
                onFocus={() => setIsReadonly(false)}
              />
            </div>

            <div>
              <label className="label">
                Password
              </label>
              <input 
                type="password" 
                className="input-field" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
                disabled={loading}
                readOnly={isReadonly}
                onFocus={() => setIsReadonly(false)}
              />
            </div>

            <button 
              type="submit" 
              className="btn-auth-submit"
              disabled={loading}
              style={{ marginTop: '8px' }}
            >
              {loading ? 'Registering...' : 'Create Account'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="auth-link"
              >
                Sign in
              </Link>
            </div>
          </form>

          <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            By creating an account you agree to our<br/>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} onClick={(e) => e.preventDefault()}>Terms of Service</a> and <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Register;
