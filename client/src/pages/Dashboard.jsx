import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { PlayCircle, Star, Trophy, Award, ArrowRight, Activity, Zap } from 'lucide-react';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({ gamesPlayed: 0, totalScore: 0, highScore: 0, avgScore: 0 });
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
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <Zap className="animate-float" size={54} color="#ffffff" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff' }}>Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', minHeight: '100vh', background: '#000000' }}>
      <div className="page-container">
        {/* Welcome Banner */}
        <div className="glass-panel" style={{ padding: '3rem 2.5rem', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <span style={{ color: '#888888', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {getGreeting()}, Challenger!
            </span>
            <h1 style={{ fontSize: '3rem', marginTop: '0.5rem', marginBottom: '0.75rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#ffffff' }}>
              Welcome back, <span className="text-gradient">{user?.username}</span>
            </h1>
            <p style={{ color: '#888888', maxWidth: '640px', fontSize: '1.05rem', lineHeight: 1.6, fontWeight: 500 }}>
              Test your brain limits, conquer the weekly leaderboards, and lock in expert badges. Ready for your next epic quest?
            </p>
            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '2rem', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/quiz')} className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                <PlayCircle size={20} /> Play Quick Quiz
              </button>
              <button onClick={() => navigate('/leaderboard')} className="btn btn-secondary" style={{ padding: '1rem 2rem' }}>
                View Hall of Fame
              </button>
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff' }}>PERFORMANCE METRICS</h2>
        
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <StatCard icon={<PlayCircle size={26} color="#ffffff" />} label="Games Played" value={stats.gamesPlayed} desc="Completed sessions" />
          <StatCard icon={<Star size={26} color="#ffffff" />} label="Total Score" value={stats.totalScore} desc="Points earned" />
          <StatCard icon={<Trophy size={26} color="#ffffff" />} label="High Score" value={stats.highScore} desc="Single session peak" />
          <StatCard icon={<Award size={26} color="#ffffff" />} label="Average Score" value={stats.avgScore} desc="Mean session points" />
        </div>

        {/* Bottom Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Recent Sessions */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#ffffff' }}>
                <Activity size={20} color="#ffffff" /> Recent Sessions
              </h3>
              {recentScores.length > 0 && (
                <button onClick={() => navigate('/history')} style={{ background: 'none', border: 'none', color: '#888888', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}>
                  All History <ArrowRight size={14} />
                </button>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {recentScores.length > 0 ? (
                recentScores.map((score) => (
                  <div key={score._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.25rem', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>{score.category}</div>
                      <div style={{ fontSize: '0.75rem', color: '#666666', fontWeight: 600 }}>
                        {new Date(score.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div style={{ fontWeight: 900, color: '#ffffff', fontSize: '1.15rem', fontFamily: 'var(--font-display)' }}>
                      +{score.score}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '2rem', textAlign: 'center', color: '#888888' }}>
                  <Zap size={36} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                  <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>No quizzes played yet.</p>
                  <button onClick={() => navigate('/quiz')} className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                    Play your first quiz
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Brain Booster */}
          <div className="card" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff' }}>
              🧠 Brain Booster
            </h3>
            <p style={{ color: '#888888', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: 500 }}>
              General Knowledge training expands crystallized brain memory, sharpening vocabulary retention and analytical connections across wide academic categories!
            </p>
            <div style={{ padding: '1.25rem', background: '#1a1a1a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Trivia Quest</span>
              <div style={{ fontWeight: 800, marginTop: '0.25rem', marginBottom: '0.75rem', fontSize: '1.05rem', color: '#ffffff' }}>Finish 3 trivia quiz rounds</div>
              <div style={{ height: '8px', background: '#222222', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min((stats.gamesPlayed / 3) * 100, 100)}%`, height: '100%', background: '#ffffff', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.5rem', color: '#666666', fontWeight: 600 }}>
                <span>{Math.min(stats.gamesPlayed, 3)} of 3 rounds done</span>
                <span>{stats.gamesPlayed >= 3 ? '100%' : `${Math.round((stats.gamesPlayed / 3) * 100)}%`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, desc }) => (
  <motion.div whileHover={{ y: -4 }} className="card stat-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
      <span className="stat-label">{label}</span>
      {icon}
    </div>
    <span className="stat-value">{value}</span>
    <span style={{ fontSize: '0.75rem', color: '#666666', fontWeight: 600 }}>{desc}</span>
  </motion.div>
);

export default Dashboard;
