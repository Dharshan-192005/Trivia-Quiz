import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { UserCircle, Trophy, Star, PlayCircle, Award, Calendar, ShieldCheck, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = ({ user }) => {
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    totalScore: 0,
    highScore: 0,
    avgScore: 0,
  });
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
    {
      id: 'first_steps',
      title: 'First Steps 🔥',
      description: 'Finished your first quiz session',
      unlocked: stats.gamesPlayed >= 1,
      icon: <Flame size={24} color={stats.gamesPlayed >= 1 ? '#ef4444' : 'var(--text-muted)'} />,
    },
    {
      id: 'century_club',
      title: 'Century Club ⚡',
      description: 'Accumulate 100+ total score',
      unlocked: stats.totalScore >= 100,
      icon: <Star size={24} color={stats.totalScore >= 100 ? '#ffb300' : 'var(--text-muted)'} />,
    },
    {
      id: 'elite_tier',
      title: 'Elite Scholar 🛡️',
      description: 'Accumulate 500+ total score',
      unlocked: stats.totalScore >= 500,
      icon: <ShieldCheck size={24} color={stats.totalScore >= 500 ? '#10b981' : 'var(--text-muted)'} />,
    },
    {
      id: 'quiz_master',
      title: 'Trivia Master 👑',
      description: 'Score 100+ points in a single session',
      unlocked: stats.highScore >= 100,
      icon: <Trophy size={24} color={stats.highScore >= 100 ? '#a855f7' : 'var(--text-muted)'} />,
    },
    {
      id: 'ten_pack',
      title: 'Decathlon 🎮',
      description: 'Finish 10 total quizzes',
      unlocked: stats.gamesPlayed >= 10,
      icon: <PlayCircle size={24} color={stats.gamesPlayed >= 10 ? '#00e5ff' : 'var(--text-muted)'} />,
    },
    {
      id: 'super_brain',
      title: 'Supercomputer 🧠',
      description: 'Score 150+ points in a single session',
      unlocked: stats.highScore >= 150,
      icon: <Award size={24} color={stats.highScore >= 150 ? '#ec4899' : 'var(--text-muted)'} />,
    },
  ];

  const getRank = () => {
    if (stats.totalScore >= 500) return 'Grandmaster Brain 🧠';
    if (stats.totalScore >= 250) return 'Expert Scholar 🎓';
    if (stats.totalScore >= 100) return 'Honors Student 🎖️';
    if (stats.totalScore >= 30) return 'Active Contender ⚡';
    return 'Novice Thinker 🐣';
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
        <div>Loading Profile Details...</div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in" style={{ padding: '1rem' }}>
      
      {/* Profile Header Block */}
      <div className="glass-panel" style={{ padding: '3rem 2.5rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        <img 
          src={user?.avatar} 
          alt="avatar" 
          style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            border: '4px solid var(--accent-primary)', 
            boxShadow: '0 0 25px rgba(136, 84, 192, 0.4)',
            background: 'var(--bg-base)'
          }}
        />
        <div style={{ flex: 1, minWidth: '250px' }}>
          <span style={{ 
            color: 'white', 
            fontWeight: 800, 
            fontSize: '0.85rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em',
            background: '#8854c0',
            borderBottom: '3px solid #5a3089',
            padding: '6px 16px',
            borderRadius: '20px'
          }}>
            {getRank()}
          </span>
          <h1 style={{ fontSize: '2.75rem', marginTop: '1rem', marginBottom: '0.5rem', fontWeight: 900, fontFamily: 'var(--font-display)' }}>
            {user?.username}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            <Calendar size={16} />
            <span>Challenger since May 2026</span>
          </div>
        </div>
      </div>

      {/* Grid for Stats and Achievements */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Academic Stats */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
            <UserCircle size={22} color="var(--accent-primary)" /> ACADEMIC STATS
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border)', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Total Score</div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--warning)', fontFamily: 'var(--font-display)' }}>{stats.totalScore}</div>
            </div>
            <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border)', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Quizzes Finished</div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-display)' }}>{stats.gamesPlayed}</div>
            </div>
            <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border)', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Highest Score</div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--accent-secondary)', fontFamily: 'var(--font-display)' }}>{stats.highScore}</div>
            </div>
            <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border)', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Average Score</div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-display)' }}>{stats.avgScore}</div>
            </div>
          </div>
        </div>

        {/* Achievements list */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
              <Award size={22} color="var(--warning)" /> ACHIEVEMENTS
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 800 }}>
              {unlockedCount} / {achievements.length} UNLOCKED
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '0.85rem 1.25rem', 
                  borderRadius: '16px', 
                  background: achievement.unlocked ? 'rgba(136, 84, 192, 0.08)' : 'rgba(0,0,0,0.15)', 
                  border: '1px solid',
                  borderColor: achievement.unlocked ? 'rgba(136, 84, 192, 0.2)' : 'var(--border)',
                  opacity: achievement.unlocked ? 1 : 0.45
                }}
              >
                <div style={{ 
                  padding: '0.6rem', 
                  background: achievement.unlocked ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,0.2)', 
                  borderRadius: '12px' 
                }}>
                  {achievement.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: achievement.unlocked ? 'white' : 'var(--text-secondary)' }}>
                    {achievement.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {achievement.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Profile;
