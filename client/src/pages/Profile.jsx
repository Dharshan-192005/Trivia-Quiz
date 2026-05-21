import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { UserCircle, Trophy, Star, PlayCircle, Award, Calendar, ShieldCheck, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = ({ user }) => {
  const [stats, setStats] = useState({ gamesPlayed: 0, totalScore: 0, highScore: 0, avgScore: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileStats = async () => {
      try {
        const res = await api.get('/scores/my');
        const scores = res.data;
        if (scores.length > 0) {
          const gamesPlayed = scores.length;
          const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
          const highScore = Math.max(...scores.map(s => s.score));
          const avgScore = Math.round(totalScore / gamesPlayed);
          setStats({ gamesPlayed, totalScore, highScore, avgScore });
        }
      } catch (err) {
        console.error('Error fetching profile stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileStats();
  }, []);

  const achievements = [
    { id: 'first_steps', title: 'First Steps', description: 'Finished your first quiz session', unlocked: stats.gamesPlayed >= 1, icon: <Flame size={24} color={stats.gamesPlayed >= 1 ? '#ffffff' : '#444444'} /> },
    { id: 'century_club', title: 'Century Club', description: 'Accumulate 100+ total score', unlocked: stats.totalScore >= 100, icon: <Star size={24} color={stats.totalScore >= 100 ? '#ffffff' : '#444444'} /> },
    { id: 'elite_tier', title: 'Elite Scholar', description: 'Accumulate 500+ total score', unlocked: stats.totalScore >= 500, icon: <ShieldCheck size={24} color={stats.totalScore >= 500 ? '#ffffff' : '#444444'} /> },
    { id: 'quiz_master', title: 'Trivia Master', description: 'Score 100+ points in a single session', unlocked: stats.highScore >= 100, icon: <Trophy size={24} color={stats.highScore >= 100 ? '#ffffff' : '#444444'} /> },
    { id: 'ten_pack', title: 'Decathlon', description: 'Finish 10 total quizzes', unlocked: stats.gamesPlayed >= 10, icon: <PlayCircle size={24} color={stats.gamesPlayed >= 10 ? '#ffffff' : '#444444'} /> },
    { id: 'super_brain', title: 'Supercomputer', description: 'Score 150+ points in a single session', unlocked: stats.highScore >= 150, icon: <Award size={24} color={stats.highScore >= 150 ? '#ffffff' : '#444444'} /> },
  ];

  const getRank = () => {
    if (stats.totalScore >= 500) return 'Grandmaster Brain';
    if (stats.totalScore >= 250) return 'Expert Scholar';
    if (stats.totalScore >= 100) return 'Honors Student';
    if (stats.totalScore >= 30) return 'Active Contender';
    return 'Novice Thinker';
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <UserCircle className="animate-float" size={40} color="#ffffff" style={{ marginBottom: '0.75rem' }} />
          <p style={{ fontWeight: 600, color: '#888888' }}>Loading Profile Details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', minHeight: '100vh', background: '#000000' }}>
      <div className="page-container">
        {/* Profile Header */}
        <div className="glass-panel" style={{ padding: '3rem 2.5rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <img src={user?.avatar} alt="avatar" style={{ width: '120px', height: '120px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.2)', background: '#1a1a1a' }} />
          <div style={{ flex: 1, minWidth: '250px' }}>
            <span style={{ color: '#000000', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#ffffff', padding: '6px 16px', borderRadius: '20px', borderBottom: '3px solid #999999' }}>
              {getRank()}
            </span>
            <h1 style={{ fontSize: '2.75rem', marginTop: '1rem', marginBottom: '0.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#ffffff' }}>
              {user?.username}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888888', fontWeight: 600 }}>
              <Calendar size={16} />
              <span>Challenger since May 2026</span>
            </div>
          </div>
        </div>

        {/* Stats + Achievements Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Stats */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff' }}>
              <UserCircle size={22} color="#ffffff" /> ACADEMIC STATS
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Total Score', value: stats.totalScore },
                { label: 'Quizzes Finished', value: stats.gamesPlayed },
                { label: 'Highest Score', value: stats.highScore },
                { label: 'Average Score', value: stats.avgScore },
              ].map((s) => (
                <div key={s.label} style={{ padding: '1.25rem', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#666666', textTransform: 'uppercase', fontWeight: 800 }}>{s.label}</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-display)' }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff' }}>
                <Award size={22} color="#ffffff" /> ACHIEVEMENTS
              </h2>
              <span style={{ fontSize: '0.85rem', color: '#666666', fontWeight: 800 }}>{unlockedCount} / {achievements.length} UNLOCKED</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {achievements.map((a) => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1.25rem', borderRadius: '16px', background: a.unlocked ? 'rgba(255,255,255,0.04)' : '#111111', border: '1px solid', borderColor: a.unlocked ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)', opacity: a.unlocked ? 1 : 0.4 }}>
                  <div style={{ padding: '0.6rem', background: '#1a1a1a', borderRadius: '12px' }}>{a.icon}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>{a.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#666666', fontWeight: 600 }}>{a.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
