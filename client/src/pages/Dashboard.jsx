import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { PlayCircle, Star, Trophy, Award, ArrowRight, Activity, Zap } from 'lucide-react';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    totalScore: 0,
    highScore: 0,
    avgScore: 0,
  });
  const [recentScores, setRecentScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/scores/my');
        const scores = res.data;
        
        if (scores.length > 0) {
          const gamesPlayed = scores.length;
          const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
          const highScore = Math.max(...scores.map(s => s.score));
          const avgScore = Math.round(totalScore / gamesPlayed);
          
          setStats({ gamesPlayed, totalScore, highScore, avgScore });
          setRecentScores(scores.slice(0, 5));
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning ☀️';
    if (hour < 18) return 'Good afternoon ⚡';
    return 'Good evening 🌙';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'var(--text-secondary)' }}>
        <div style={{ textAlign: 'center' }}>
          <Zap className="animate-float" size={54} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in" style={{ padding: '1rem' }}>
      {/* Welcome Banner Card (Sleek Gamified Header) */}
      <div className="glass-panel" style={{ padding: '3rem 2.5rem', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span style={{ 
            color: 'var(--accent-secondary)', 
            fontWeight: 800, 
            fontSize: '0.85rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em' 
          }}>
            {getGreeting()}, Challenger!
          </span>
          <h1 style={{ fontSize: '3rem', marginTop: '0.5rem', marginBottom: '0.75rem', fontWeight: 900, fontFamily: 'var(--font-display)' }}>
            Welcome back, <span className="text-gradient">{user?.username}</span> 🎯
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', fontSize: '1.05rem', lineHeight: 1.6, fontWeight: 500 }}>
            Test your brain limits, conquer the weekly leaderboards, and lock in expert badges. Ready for your next epic quest?
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '2rem' }}>
            <button onClick={() => navigate('/quiz')} className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
              <PlayCircle size={20} /> Play Quick Quiz
            </button>
            <button onClick={() => navigate('/leaderboard')} className="btn btn-secondary" style={{ padding: '1rem 2rem' }}>
              View Hall of Fame
            </button>
          </div>
        </div>
        
        {/* Glow Spheres */}
        <div style={{ 
          position: 'absolute', 
          top: '-30%', 
          right: '-10%', 
          width: '350px', 
          height: '350px', 
          background: 'radial-gradient(circle, rgba(136, 84, 192, 0.25) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          zIndex: 1
        }} />
      </div>

      {/* Performance Metrics Heading */}
      <h2 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>PERFORMANCE METRICS</h2>
      
      {/* Stats Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard 
          icon={<PlayCircle size={26} color="var(--accent-primary)" />} 
          label="Games Played" 
          value={stats.gamesPlayed} 
          desc="Completed sessions"
        />
        <StatCard 
          icon={<Star size={26} color="var(--warning)" />} 
          label="Total Score" 
          value={stats.totalScore} 
          desc="Points earned"
        />
        <StatCard 
          icon={<Trophy size={26} color="var(--accent-secondary)" />} 
          label="High Score" 
          value={stats.highScore} 
          desc="Single session peak"
        />
        <StatCard 
          icon={<Award size={26} color="var(--success)" />} 
          label="Average Score" 
          value={stats.avgScore} 
          desc="Mean session points"
        />
      </div>

      {/* Bottom Layout Rows */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Recent Sessions */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              <Activity size={20} color="var(--accent-primary)" /> Recent Sessions
            </h3>
            {recentScores.length > 0 && (
              <button 
                onClick={() => navigate('/history')} 
                style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}
              >
                All History <ArrowRight size={14} />
              </button>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            {recentScores.length > 0 ? (
              recentScores.map((score, index) => (
                <div 
                  key={score._id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '0.85rem 1.25rem', 
                    background: 'rgba(0, 0, 0, 0.15)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '14px' 
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{score.category}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {new Date(score.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div style={{ fontWeight: 900, color: 'var(--warning)', fontSize: '1.15rem', fontFamily: 'var(--font-display)' }}>
                    +{score.score}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Zap size={36} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>No quizzes played yet.</p>
                <button 
                  onClick={() => navigate('/quiz')} 
                  className="btn btn-primary" 
                  style={{ marginTop: '1rem', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                >
                  Play your first quiz
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Daily Progress Goal Booster Card */}
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(136, 84, 192, 0.15), rgba(0, 229, 255, 0.05))', borderColor: 'rgba(136, 84, 192, 0.2)' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
            🧠 Brain Booster
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: 500 }}>
            General Knowledge training expands crystallized brain memory, sharpening vocabulary retention and analytical connections across wide academic categories! Keep training daily to level up your global ranks!
          </p>
          <div style={{ padding: '1.25rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Trivia Quest</span>
            <div style={{ fontWeight: 800, marginTop: '0.25rem', marginBottom: '0.75rem', fontSize: '1.05rem' }}>Finish 3 trivia quiz rounds</div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{ width: `${Math.min((stats.gamesPlayed / 3) * 100, 100)}%`, height: '100%', background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              <span>{Math.min(stats.gamesPlayed, 3)} of 3 rounds done</span>
              <span>{stats.gamesPlayed >= 3 ? '100%' : `${Math.round((stats.gamesPlayed / 3) * 100)}%`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, desc }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="card stat-card"
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
      <span className="stat-label">{label}</span>
      {icon}
    </div>
    <span className="stat-value">{value}</span>
    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{desc}</span>
  </motion.div>
);

export default Dashboard;
