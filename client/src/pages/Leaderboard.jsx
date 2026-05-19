import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Trophy, Medal, Star, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/scores/leaderboard');
        setBoard(res.data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'var(--text-secondary)' }}>
        <div style={{ textAlign: 'center' }}>
          <Trophy className="animate-float" size={54} color="#fbbf24" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Loading Rankings...</h2>
        </div>
      </div>
    );
  }

  const topThree = board.slice(0, 3);
  const runnersUp = board.slice(3);

  // Rearrange top 3 for visual symmetry podium: [2nd, 1st, 3rd]
  const podiumOrder = [];
  if (topThree[1]) podiumOrder.push({ ...topThree[1], rank: 2 });
  if (topThree[0]) podiumOrder.push({ ...topThree[0], rank: 1 });
  if (topThree[2]) podiumOrder.push({ ...topThree[2], rank: 3 });

  const getRankColor = (rank) => {
    if (rank === 1) return '#fbbf24'; // Gold
    if (rank === 2) return '#cbd5e1'; // Silver
    if (rank === 3) return '#b45309'; // Bronze
    return 'var(--text-secondary)';
  };

  return (
    <div className="page-container animate-fade-in" style={{ padding: '1rem' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <Trophy size={60} color="#fbbf24" style={{ marginBottom: '0.75rem', filter: 'drop-shadow(0 0 15px rgba(251, 191, 36, 0.4))' }} />
        <h1 style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>HALL OF FAME</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontWeight: 500 }}>Honoring the absolute legends across all categories.</p>
      </div>

      {board.length > 0 ? (
        <>
          {/* Visual Podium Section (Quizizz-style 3D podium) */}
          {topThree.length > 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'flex-end', 
              gap: '1.5rem', 
              marginBottom: '4rem', 
              flexWrap: 'wrap',
              padding: '0 1rem'
            }}>
              {podiumOrder.map((entry) => {
                const isFirst = entry.rank === 1;
                return (
                  <motion.div
                    key={entry._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 100, delay: entry.rank * 0.15 }}
                    className="glass-panel"
                    style={{
                      padding: '2.5rem 1.5rem 1.5rem 1.5rem',
                      width: '210px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      borderWidth: isFirst ? '3px' : '2px',
                      borderColor: isFirst ? 'rgba(251, 191, 36, 0.5)' : 'rgba(255, 255, 255, 0.05)',
                      boxShadow: isFirst ? '0 12px 30px -5px rgba(251, 191, 36, 0.2)' : 'none',
                      transform: isFirst ? 'scale(1.08)' : 'scale(1)',
                      zIndex: isFirst ? 2 : 1,
                      order: entry.rank === 2 ? 1 : entry.rank === 1 ? 2 : 3,
                      borderBottomWidth: isFirst ? '8px' : '6px'
                    }}
                  >
                    {/* Rank Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '-18px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: getRankColor(entry.rank),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      color: '#0c081f',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                      fontSize: '1rem',
                      border: '2px solid white'
                    }}>
                      {entry.rank}
                    </div>

                    <img 
                      src={entry.user.avatar} 
                      alt="avatar" 
                      style={{ 
                        width: isFirst ? '80px' : '68px', 
                        height: isFirst ? '80px' : '68px', 
                        borderRadius: '50%', 
                        border: `3px solid ${getRankColor(entry.rank)}`,
                        background: 'var(--bg-base)',
                        marginBottom: '1rem'
                      }} 
                    />

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.25rem', textAlign: 'center', color: 'white', fontFamily: 'var(--font-display)' }}>
                      {entry.user.username}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 600 }}>
                      {entry.category}
                    </span>
                    <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--warning)', fontFamily: 'var(--font-display)' }}>
                      {entry.score}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Table rankings list (Rank 4-10) */}
          {runnersUp.length > 0 && (
            <div className="glass-panel" style={{ overflow: 'hidden' }}>
              {runnersUp.map((entry, index) => {
                const actualRank = index + 4;
                return (
                  <motion.div
                    key={entry._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '1.25rem 2rem',
                      borderBottom: index === runnersUp.length - 1 ? 'none' : '1px solid var(--border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, width: '30px', color: 'var(--text-muted)' }}>
                        #{actualRank}
                      </span>
                      <img 
                        src={entry.user.avatar} 
                        alt="avatar" 
                        style={{ width: 42, height: 42, borderRadius: '50%', border: '2px solid var(--border)', background: 'var(--bg-base)' }} 
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'white' }}>{entry.user.username}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{entry.category}</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--accent-secondary)', fontFamily: 'var(--font-display)' }}>
                        {entry.score}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Zap size={36} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
          No legends yet. Be the first to score points!
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
