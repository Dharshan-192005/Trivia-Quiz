import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayCircle, Trophy, HelpCircle, Award, Zap } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '4rem 2rem',
      textAlign: 'center',
      position: 'relative',
      overflowY: 'auto'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '2rem auto 0 auto' }}
      >
        {/* Brand Badge */}
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          padding: '6px 14px', 
          background: 'rgba(255, 255, 255, 0.05)', 
          border: '1px solid rgba(255, 255, 255, 0.12)', 
          borderRadius: '30px', 
          marginBottom: '1.5rem' 
        }}>
          <Zap size={12} color="#ffffff" fill="#ffffff" />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ffffff' }}>
            The Gamified Trivia Arena
          </span>
        </div>

        <h1 style={{ 
          fontSize: '3.25rem', 
          fontWeight: 900, 
          lineHeight: 1.15, 
          fontFamily: 'var(--font-display)', 
          marginBottom: '1.25rem',
          letterSpacing: '-0.02em',
          color: '#ffffff'
        }}>
          Elevate Your Mind with <span className="text-gradient">Trivia X</span>
        </h1>

        <p style={{ 
          fontSize: '1.1rem', 
          color: '#888888', 
          marginBottom: '2.5rem', 
          maxWidth: '580px', 
          margin: '0 auto 2.5rem auto',
          lineHeight: 1.6,
          fontWeight: 500
        }}>
          Play general knowledge and science quests. Compete with global brains, claim trophies, and track your achievements.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
          <button onClick={() => navigate('/register')} className="btn btn-primary" style={{ padding: '1rem 2.25rem', fontSize: '1rem', borderRadius: '14px' }}>
            <PlayCircle size={20} /> Play Now Free
          </button>
          <button onClick={() => navigate('/login')} className="btn btn-secondary" style={{ padding: '1rem 2.25rem', fontSize: '1rem', borderRadius: '14px' }}>
            Sign In to Account
          </button>
        </div>
      </motion.div>

      {/* Feature grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.5rem', 
        width: '100%', 
        maxWidth: '1000px',
        position: 'relative', 
        zIndex: 1,
        marginTop: '1.5rem'
      }}>
        <FeatureCard icon={<HelpCircle size={28} color="#ffffff" />} title="Custom Quizzes" desc="Roll your favorite seeds, configure subjects, and pick difficulties directly inside settings." />
        <FeatureCard icon={<Trophy size={28} color="#ffffff" />} title="Vibrant Podium" desc="Battle for the weekly leaderboard rankings and stand tall on the three-tier hall podium." />
        <FeatureCard icon={<Award size={28} color="#ffffff" />} title="Achievement Badges" desc="Finishing runs triggers accomplishments, unlocking 6 levels of custom brain medal rewards." />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -6 }}
    className="card" 
    style={{ 
      padding: '2rem', 
      textAlign: 'left', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '0.75rem',
      borderLeft: '3px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '16px'
    }}
  >
    <div style={{ marginBottom: '0.15rem' }}>{icon}</div>
    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display)' }}>{title}</h3>
    <p style={{ color: '#888888', fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 500 }}>{desc}</p>
  </motion.div>
);

export default Home;
