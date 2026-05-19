import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { UserPlus, Zap, CheckCircle2 } from 'lucide-react';

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      
      {/* Left decorative panel (hidden on small viewports) */}
      <div className="register-panel-left" style={{
        flex: 1,
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0f111a 100%)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow effects */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)', filter: 'blur(50px)', borderRadius: '50%' }} />
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '480px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <Zap color="var(--accent-primary)" fill="var(--accent-primary)" size={32} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              TRIVIA X
            </span>
          </div>

          <h2 style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>
            Join the Ultimate <span className="text-gradient">Intellectual Quest</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Create an account today and start tracking your cognitive capabilities against challengers worldwide.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={18} color="var(--accent-secondary)" />
              <span>Unlock all 6 custom achievement awards</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={18} color="var(--accent-secondary)" />
              <span>Modify difficulty filters dynamically</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={18} color="var(--accent-secondary)" />
              <span>Get automated progress milestones</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem'
      }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel" 
          style={{ padding: '3.5rem', width: '100%', maxWidth: '440px' }}
        >
          <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>Create Account</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Get started with your profile immediately.</p>
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label className="label">Username</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input 
                type="password" 
                className="input-field" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '1rem', width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Registering...' : (
                <>
                  <UserPlus size={18} /> Register
                </>
              )}
            </button>
          </form>
          
          <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
          </p>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .register-panel-left { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Register;
