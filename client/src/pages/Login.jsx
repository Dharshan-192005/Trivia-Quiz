import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { motion } from 'framer-motion';
import bgImage from '../assets/bg-mountain.png';

const Login = ({ onLogin }) => {
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
      const res = await api.post('/auth/login', formData);
      onLogin(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
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
          <h1 style={{ color: 'white', background: 'none', WebkitTextFillColor: 'white', fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '20px' }}>
            Welcome<br />Back
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: 1.6 }}>
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using
          </p>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="auth-form-container">
        <div className="auth-form-wrapper animate-slide-up delay-200">
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Sign in</h2>
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" id="remember" style={{ cursor: 'pointer', width: '16px', height: '16px' }} />
              <label htmlFor="remember" style={{ fontSize: '0.85rem', color: '#4b5563', cursor: 'pointer', userSelect: 'none' }}>
                Remember Me
              </label>
            </div>

            <button 
              type="submit" 
              className="btn-auth-submit"
              disabled={loading}
              style={{ marginTop: '8px' }}
            >
              {loading ? 'Sign in now...' : 'Sign in now'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <a href="#" style={{ color: '#4b5563', fontSize: '0.85rem', textDecoration: 'none' }} onClick={(e) => e.preventDefault()}>
                Lost your password?
              </a>
            </div>

            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: '#6b7280' }}>
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="auth-link"
              >
                Sign up
              </Link>
            </div>
          </form>

          <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '0.75rem', color: '#9ca3af' }}>
            By clicking on "Sign in now" you agree to<br/>
            <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }} onClick={(e) => e.preventDefault()}>Terms of Service</a> | <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }} onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;
