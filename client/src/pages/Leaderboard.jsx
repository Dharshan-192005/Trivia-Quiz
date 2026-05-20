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
          <Trophy className="animate-float" size={54} color="#fbbf24" style={{ marginBottom: '1rem', filter: 'drop-shadow(0 4px 10px rgba(251,191,36,0.3))' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>Loading Rankings...</h2>
        </div>
      </div>
    );
  }

  const topThree = board.slice(0, 3);
  const runnersUp = board.slice(3);

  const podiumOrder = [];
  if (topThree[1]) podiumOrder.push({ ...topThree[1], rank: 2 });
  if (topThree[0]) podiumOrder.push({ ...topThree[0], rank: 1 });
  if (topThree[2]) podiumOrder.push({ ...topThree[2], rank: 3 });

  const getRankColor = (rank) => {
    if (rank === 1) return '#fbbf24';
    if (rank === 2) return '#94a3b8';
    if (rank === 3) return '#b45309';
    return 'var(--text-secondary)';
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        padding: '2rem',
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #f8fafc 0%, #eef2f7 50%, #f8fafc 100%)',
      }}
    >
      <div className="page-container">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <Trophy size={60} color="#fbbf24" style={{ marginBottom: '0.75rem', filter: 'drop-shadow(0 4px 15px rgba(251, 191, 36, 0.35))' }} />
          <h1 style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>HALL OF FAME</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontWeight: 500 }}>Honoring the absolute legends across all categories.</p>
        </div>

        {board.length > 0 ? (
          <>
            {/* Visual Podium Section */}
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
                  const podiumHeights = { 1: '180px', 2: '140px', 3: '110px' };
                  return (
                    <motion.div
                      key={entry._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 100, delay: entry.rank * 0.15 }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        order: entry.rank === 2 ? 1 : entry.rank === 1 ? 2 : 3,
                      }}
                    >
                      {/* Card above podium */}
                      <div
                        style={{
                          background: '#ffffff',
                          border: `2px solid ${isFirst ? 'rgba(251,191,36,0.4)' : 'rgba(0,0,0,0.05)'}`,
                          borderBottom: `5px solid ${isFirst ? 'rgba(251,191,36,0.5)' : 'rgba(0,0,0,0.1)'}`,
                          borderRadius: '24px',
                          padding: '2rem 1.5rem 1.5rem',
                          width: isFirst ? '200px' : '170px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          position: 'relative',
                          boxShadow: isFirst
                            ? '0 12px 40px -5px rgba(251,191,36,0.2), 0 4px 10px rgba(0,0,0,0.04)'
                            : '0 4px 12px rgba(0,0,0,0.04)',
                          transform: isFirst ? 'scale(1.06)' : 'scale(1)',
                          zIndex: isFirst ? 2 : 1,
                        }}
                      >
                        {/* Rank Badge */}
                        <div style={{
                          position: 'absolute',
                          top: '-16px',
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: getRankColor(entry.rank),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          color: '#0f172a',
                          fontSize: '1rem',
                          border: '2px solid white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        }}>
                          {entry.rank}
                        </div>

                        <img
                          src={entry.user.avatar}
                          alt="avatar"
                          style={{
                            width: isFirst ? '78px' : '64px',
                            height: isFirst ? '78px' : '64px',
                            borderRadius: '50%',
                            border: `3px solid ${getRankColor(entry.rank)}`,
                            background: '#f8fafc',
                            marginBottom: '0.75rem'
                          }}
                        />

                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.25rem', textAlign: 'center', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                          {entry.user.username}
                        </h3>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>
                          {entry.category}
                        </span>
                        <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--accent-primary)', fontFamily: 'var(--font-display)' }}>
                          {entry.score}
                        </span>
                      </div>

                      {/* Podium pillar */}
                      <div style={{
                        width: isFirst ? '160px' : '130px',
                        height: podiumHeights[entry.rank],
                        background: isFirst
                          ? 'linear-gradient(to bottom, #fde68a, #fbbf24)'
                          : entry.rank === 2
                          ? 'linear-gradient(to bottom, #e2e8f0, #94a3b8)'
                          : 'linear-gradient(to bottom, #fde2b8, #b45309)',
                        borderRadius: '12px 12px 0 0',
                        marginTop: '12px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        paddingTop: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      }}>
                        <span style={{ fontSize: '2rem', fontWeight: 900, color: 'white', opacity: 0.6, fontFamily: 'var(--font-display)' }}>#{entry.rank}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Runners up table */}
            {runnersUp.length > 0 && (
              <div style={{
                background: '#ffffff',
                border: '2px solid rgba(0,0,0,0.04)',
                borderBottom: '5px solid rgba(0,0,0,0.08)',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              }}>
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
                        borderBottom: index === runnersUp.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.05)',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, width: '30px', color: 'var(--text-muted)' }}>
                          #{actualRank}
                        </span>
                        <img
                          src={entry.user.avatar}
                          alt="avatar"
                          style={{ width: 42, height: 42, borderRadius: '50%', border: '2px solid rgba(0,0,0,0.06)', background: '#f8fafc' }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{entry.user.username}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{entry.category}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--accent-primary)', fontFamily: 'var(--font-display)' }}>
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
          <div className="card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)', background: '#ffffff' }}>
            <Zap size={36} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
            <p style={{ fontWeight: 600 }}>No legends yet. Be the first to score points!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
