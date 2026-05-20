import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayCircle, Trophy, HelpCircle, Award, Zap } from 'lucide-react';
import landingBg from '../assets/landing_bg.png';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundImage: `url(${landingBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '4rem 2rem',
      textAlign: 'center',
      position: 'relative',
      overflowY: 'auto'
    }}>
      {/* Background radial highlight for soft glow */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(234, 88, 12, 0.06) 0%, transparent 75%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '2rem auto 0 auto' }}
      >
        {/* Brand Header Badge */}
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          padding: '6px 14px', 
          background: 'rgba(234, 88, 12, 0.06)', 
          border: '1.5px solid rgba(234, 88, 12, 0.15)', 
          borderRadius: '30px', 
          marginBottom: '1.5rem' 
        }}>
          <Zap size={12} color="var(--accent-primary)" fill="var(--accent-primary)" />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)' }}>
            The Gamified Trivia Arena
          </span>
        </div>

        {/* Hero Heading */}
        <h1 style={{ 
          fontSize: '3.25rem', 
          fontWeight: 900, 
          lineHeight: 1.15, 
          fontFamily: 'var(--font-display)', 
          marginBottom: '1.25rem',
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)'
        }}>
          Elevate Your Mind with <span className="text-gradient">Trivia X</span>
        </h1>

        {/* Hero Subtext */}
        <p style={{ 
          fontSize: '1.1rem', 
          color: 'var(--text-secondary)', 
          marginBottom: '2.5rem', 
          maxWidth: '580px', 
          margin: '0 auto 2.5rem auto',
          lineHeight: 1.6,
          fontWeight: 500
        }}>
          Play general knowledge and science quests. Compete with global brains, claim trophies, and track your achievements in a gorgeous retro-futuristic arcade interface.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
          <button 
            onClick={() => navigate('/register')} 
            className="btn btn-primary" 
            style={{ padding: '1rem 2.25rem', fontSize: '1rem', borderRadius: '14px' }}
          >
            <PlayCircle size={20} /> Play Now Free
          </button>
          
          <button 
            onClick={() => navigate('/login')} 
            className="btn btn-secondary" 
            style={{ padding: '1rem 2.25rem', fontSize: '1rem', borderRadius: '14px' }}
          >
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
        <FeatureCard 
          icon={<HelpCircle size={28} color="var(--choice-a)" />} 
          title="Custom Quizzes" 
          desc="Roll your favorite seeds, configure subjects, and pick difficulties directly inside settings." 
          borderAccent="var(--choice-a)"
        />
        <FeatureCard 
          icon={<Trophy size={28} color="var(--choice-c)" />} 
          title="Vibrant Podium" 
          desc="Battle for the weekly leaderboard rankings and stand tall on the three-tier 3D hall podium." 
          borderAccent="var(--choice-c)"
        />
        <FeatureCard 
          icon={<Award size={28} color="var(--choice-b)" />} 
          title="Achievement Badges" 
          desc="Finishing runs triggers accomplishments, unlocking 6 levels of custom brain medal rewards." 
          borderAccent="var(--choice-b)"
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, borderAccent }) => (
  <motion.div 
    whileHover={{ y: -6 }}
    className="card" 
    style={{ 
      padding: '2rem', 
      textAlign: 'left', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '0.75rem', 
      background: 'var(--bg-surface)', 
      borderLeft: `4px solid ${borderAccent}`,
      borderRadius: '16px'
    }}
  >
    <div style={{ marginBottom: '0.15rem' }}>{icon}</div>
    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{title}</h3>
    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 500 }}>{desc}</p>
  </motion.div>
);

export default Home;
