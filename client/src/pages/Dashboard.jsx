import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import api from '../utils/api';
import { Activity, ArrowRight, Award, PlayCircle, Star, Trophy, Zap } from 'lucide-react';

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

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="page-shell scene-page dashboard-scene" style={{ display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Zap className="animate-float" size={52} color="var(--accent-primary)" />
          <h2 style={{ marginTop: '1rem' }}>Loading dashboard</h2>
        </div>
      </div>
    );
  }

  return (
    <main className="page-shell animate-fade-in scene-page dashboard-scene">
      <div className="page-container">
        <section className="glass-panel dashboard-hero">
          <div>
            <div className="eyebrow">{greeting()}, Challenger</div>
            <h1 className="dashboard-title">
              Welcome back, <span className="text-gradient">{user?.username}</span>
            </h1>
            <p style={{ maxWidth: 650, marginTop: '0.75rem', color: 'var(--text-secondary)' }}>
              Pick up a quick quiz, review your recent sessions, and keep nudging that high score upward.
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={() => navigate('/quiz')}>
              <PlayCircle size={19} />
              Play Quiz
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/leaderboard')}>
              View Rankings
            </button>
          </div>
        </section>

        <div className="section-title">Performance</div>
        <section className="stats-grid" style={{ marginBottom: '1.2rem' }}>
          <StatCard icon={<PlayCircle size={22} />} label="Games Played" value={stats.gamesPlayed} desc="Completed sessions" />
          <StatCard icon={<Star size={22} />} label="Total Score" value={stats.totalScore} desc="Points earned" />
          <StatCard icon={<Trophy size={22} />} label="High Score" value={stats.highScore} desc="Best single run" />
          <StatCard icon={<Award size={22} />} label="Average Score" value={stats.avgScore} desc="Mean session score" />
        </section>

        <section className="two-column">
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '1.25rem' }}>
                <Activity size={20} /> Recent Sessions
              </h2>
              {recentScores.length > 0 && (
                <button className="icon-button" onClick={() => navigate('/history')} aria-label="Open history" title="Open history">
                  <ArrowRight size={18} />
                </button>
              )}
            </div>

            <div className="list-stack">
              {recentScores.length > 0 ? (
                recentScores.map((score) => (
                  <div className="list-row" key={score._id}>
                    <div>
                      <div style={{ fontWeight: 850 }}>{score.category}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 650 }}>
                        {new Date(score.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900 }}>
                      {score.score}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState onPlay={() => navigate('/quiz')} />
              )}
            </div>
          </div>

          <div className="card">
            <div className="eyebrow">Daily focus</div>
            <h2 style={{ marginTop: '0.5rem', fontSize: '1.55rem' }}>Finish 3 quiz rounds</h2>
            <p style={{ margin: '0.8rem 0 1.4rem', color: 'var(--text-secondary)' }}>
              A small streak target keeps the app useful without turning practice into homework.
            </p>
            <div style={{ height: 10, overflow: 'hidden', borderRadius: 999, background: 'rgba(255,255,255,0.08)' }}>
              <div
                style={{
                  width: `${Math.min((stats.gamesPlayed / 3) * 100, 100)}%`,
                  height: '100%',
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-tertiary))',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.7rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700 }}>
              <span>{Math.min(stats.gamesPlayed, 3)} of 3 complete</span>
              <span>{stats.gamesPlayed >= 3 ? '100%' : `${Math.round((stats.gamesPlayed / 3) * 100)}%`}</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

const StatCard = ({ icon, label, value, desc }) => (
  <Motion.div whileHover={{ y: -3 }} className="card stat-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-primary)' }}>
      <span className="stat-label">{label}</span>
      {icon}
    </div>
    <span className="stat-value">{value}</span>
    <span style={{ color: 'var(--text-muted)', fontSize: '0.84rem', fontWeight: 650 }}>{desc}</span>
  </Motion.div>
);

const EmptyState = ({ onPlay }) => (
  <div style={{ display: 'grid', placeItems: 'center', minHeight: 220, textAlign: 'center' }}>
    <div>
      <Zap size={38} color="var(--accent-primary)" style={{ opacity: 0.8 }} />
      <p style={{ margin: '0.75rem 0 1rem', color: 'var(--text-secondary)', fontWeight: 700 }}>No quiz sessions yet.</p>
      <button className="btn btn-primary" onClick={onPlay}>Play your first quiz</button>
    </div>
  </div>
);

export default Dashboard;
