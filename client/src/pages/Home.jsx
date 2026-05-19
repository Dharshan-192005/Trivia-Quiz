import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayCircle, Trophy, HelpCircle, Award, Zap } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'radial-gradient(circle at center, #1f1246 0%, #0a061b 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background radial highlight */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(136, 84, 192, 0.15) 0%, transparent 75%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: 0
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative', zIndex: 1, maxWidth: '850px', margin: '0 auto' }}
      >
        {/* Brand Header Badge */}
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          padding: '8px 18px', 
          background: 'rgba(136, 84, 192, 0.15)', 
          border: '2px solid rgba(136, 84, 192, 0.25)', 
          borderRadius: '30px', 
          marginBottom: '2rem' 
        }}>
          <Zap size={14} color="var(--accent-secondary)" fill="var(--accent-secondary)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'white' }}>
            The Gamified Trivia Arena
          </span>
        </div>

        {/* Hero Heading */}
        <h1 style={{ 
          fontSize: '4.75rem', 
          fontWeight: 900, 
          lineHeight: 1.1, 
          fontFamily: 'var(--font-display)', 
          marginBottom: '1.5rem',
          letterSpacing: '-0.03em'
        }}>
          Elevate Your Mind with <span className="text-gradient">Trivia X</span>
        </h1>

        {/* Hero Subtext */}
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'var(--text-secondary)', 
          marginBottom: '3.5rem', 
          maxWidth: '640px', 
          margin: '0 auto 3.5rem auto',
          lineHeight: 1.6,
          fontWeight: 500
        }}>
          Play general knowledge and science quests. Compete with global brains, claim trophies, and track your achievements in a gorgeous retro-futuristic arcade interface.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/register')} 
            className="btn btn-primary" 
            style={{ padding: '1.25rem 3rem', fontSize: '1.1rem', borderRadius: '20px' }}
          >
            <PlayCircle size={22} /> Play Now Free
          </button>
          
          <button 
            onClick={() => navigate('/login')} 
            className="btn btn-secondary" 
            style={{ padding: '1.25rem 3rem', fontSize: '1.1rem', borderRadius: '20px' }}
          >
            Sign In to Account
          </button>
        </div>
      </motion.div>

      {/* Feature grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '2rem', 
        marginTop: '7rem', 
        width: '100%', 
        maxWidth: '1100px',
        position: 'relative', 
        zIndex: 1 
      }}>
        <FeatureCard 
          icon={<HelpCircle size={32} color="var(--choice-a)" />} 
          title="Custom Quizzes" 
          desc="Roll your favorite seeds, configure subjects, and pick difficulties directly inside settings." 
          borderAccent="var(--choice-a)"
        />
        <FeatureCard 
          icon={<Trophy size={32} color="var(--choice-c)" />} 
          title="Vibrant Podium" 
          desc="Battle for the weekly leaderboard rankings and stand tall on the three-tier 3D hall podium." 
          borderAccent="var(--choice-c)"
        />
        <FeatureCard 
          icon={<Award size={32} color="var(--choice-b)" />} 
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
    whileHover={{ y: -8 }}
    className="card" 
    style={{ 
      padding: '2.5rem', 
      textAlign: 'left', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1rem', 
      background: 'var(--bg-surface)', 
      borderLeft: `4px solid ${borderAccent}`,
      borderRadius: '20px'
    }}
  >
    <div style={{ marginBottom: '0.25rem' }}>{icon}</div>
    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)' }}>{title}</h3>
    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>{desc}</p>
  </motion.div>
);

export default Home;
