import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Award, BrainCircuit, PlayCircle, ShieldCheck, Trophy, Zap } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="home-hero">
      <div className="page-container hero-grid">
        <Motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="eyebrow">
            <Zap size={16} />
            Live trivia, clean competition
          </div>
          <h1 className="hero-title" style={{ marginTop: '1rem' }}>
            Trivia X
          </h1>
          <p className="hero-copy">
            A polished quiz arena for fast rounds, custom topics, smart scoring, and progress that actually feels good to come back to.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
            <button className="btn btn-primary" onClick={() => navigate('/register')}>
              <PlayCircle size={19} />
              Start Playing
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        </Motion.section>

        <Motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="panel"
          style={{ display: 'grid', gap: '1rem' }}
        >
          <Feature icon={<BrainCircuit size={22} />} title="Custom Rounds" copy="Choose categories, difficulty, pace, and AI-generated topics." />
          <Feature icon={<Trophy size={22} />} title="Leaderboard Ready" copy="Track recent sessions and climb the rankings with clean score feedback." />
          <Feature icon={<Award size={22} />} title="Achievement Flow" copy="Unlock profile badges as your total score and high scores improve." />
          <div className="list-row" style={{ background: 'linear-gradient(135deg, rgba(125,211,252,0.16), rgba(184,247,212,0.1))' }}>
            <div>
              <div style={{ fontWeight: 900 }}>Next round is one click away</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Built for quick sessions and repeat play.</div>
            </div>
            <ShieldCheck size={24} color="var(--accent-tertiary)" />
          </div>
        </Motion.aside>
      </div>
    </main>
  );
};

const Feature = ({ icon, title, copy }) => (
  <div className="list-row" style={{ alignItems: 'flex-start' }}>
    <div style={{ color: 'var(--accent-primary)', marginTop: 2 }}>{icon}</div>
    <div>
      <div style={{ fontWeight: 900 }}>{title}</div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>{copy}</p>
    </div>
  </div>
);

export default Home;
