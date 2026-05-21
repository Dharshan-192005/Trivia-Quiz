import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Trophy, Zap } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

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
      <div className="page-shell scene-page leaderboard-scene" style={{ display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Trophy className="animate-float" size={54} color="#ffffff" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff' }}>Loading Rankings...</h2>
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

  const getRankBrightness = (rank) => {
    if (rank === 1) return '#ffffff';
    if (rank === 2) return '#aaaaaa';
    if (rank === 3) return '#666666';
    return '#444444';
  };

  return (
    <main className="page-shell animate-fade-in scene-page leaderboard-scene">
      <div className="page-container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <Trophy size={60} color="#ffffff" style={{ marginBottom: '0.75rem' }} />
          <h1 style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: '#ffffff' }}>HALL OF FAME</h1>
          <p style={{ color: '#888888', marginTop: '0.25rem', fontWeight: 500 }}>Honoring the absolute legends across all categories.</p>
        </div>

        {board.length > 0 ? (
          <>
            {/* Podium */}
            {topThree.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '4rem', flexWrap: 'wrap', padding: '0 1rem' }}>
                {podiumOrder.map((entry) => {
                  const isFirst = entry.rank === 1;
                  const podiumHeights = { 1: '180px', 2: '140px', 3: '110px' };
                  const brightness = getRankBrightness(entry.rank);
                  return (
                    <Motion.div
                      key={entry._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 100, delay: entry.rank * 0.15 }}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', order: entry.rank === 2 ? 1 : entry.rank === 1 ? 2 : 3 }}
                    >
                      <div style={{
                        background: '#111111',
                        border: `1px solid ${isFirst ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'}`,
                        borderBottom: `4px solid ${isFirst ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '24px',
                        padding: '2rem 1.5rem 1.5rem',
                        width: isFirst ? '200px' : '170px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        position: 'relative',
                        boxShadow: isFirst ? '0 12px 40px rgba(0,0,0,0.8)' : '0 4px 12px rgba(0,0,0,0.5)',
                        transform: isFirst ? 'scale(1.06)' : 'scale(1)',
                        zIndex: isFirst ? 2 : 1,
                      }}>
                        <div style={{
                          position: 'absolute', top: '-16px', width: '34px', height: '34px', borderRadius: '50%',
                          background: brightness, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 900, color: '#000000', fontSize: '1rem', border: '2px solid #000000',
                        }}>
                          {entry.rank}
                        </div>
                        <img src={entry.user.avatar} alt="avatar" style={{ width: isFirst ? '78px' : '64px', height: isFirst ? '78px' : '64px', borderRadius: '50%', border: `2px solid ${brightness}`, background: '#1a1a1a', marginBottom: '0.75rem' }} />
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.25rem', textAlign: 'center', color: '#ffffff', fontFamily: 'var(--font-display)' }}>{entry.user.username}</h3>
                        <span style={{ fontSize: '0.72rem', color: '#666666', marginBottom: '0.75rem', fontWeight: 600 }}>{entry.category}</span>
                        <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-display)' }}>{entry.score}</span>
                      </div>
                      <div style={{
                        width: isFirst ? '160px' : '130px',
                        height: podiumHeights[entry.rank],
                        background: brightness,
                        borderRadius: '12px 12px 0 0',
                        marginTop: '12px',
                        display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '12px',
                      }}>
                        <span style={{ fontSize: '2rem', fontWeight: 900, color: '#000000', opacity: 0.4, fontFamily: 'var(--font-display)' }}>#{entry.rank}</span>
                      </div>
                    </Motion.div>
                  );
                })}
              </div>
            )}

            {/* Runners up */}
            {runnersUp.length > 0 && (
              <div style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', borderBottom: '4px solid rgba(255,255,255,0.1)', borderRadius: '20px', overflow: 'hidden' }}>
                {runnersUp.map((entry, index) => {
                  const actualRank = index + 4;
                  return (
                    <Motion.div key={entry._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 2rem', borderBottom: index === runnersUp.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.06)', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#1a1a1a'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, width: '30px', color: '#666666' }}>#{actualRank}</span>
                        <img src={entry.user.avatar} alt="avatar" style={{ width: 42, height: 42, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', background: '#1a1a1a' }} />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff' }}>{entry.user.username}</div>
                          <div style={{ fontSize: '0.75rem', color: '#666666', fontWeight: 600 }}>{entry.category}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-display)' }}>{entry.score}</span>
                    </Motion.div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="card" style={{ padding: '4rem', textAlign: 'center', color: '#888888' }}>
            <Zap size={36} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
            <p style={{ fontWeight: 600 }}>No legends yet. Be the first to score points!</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Leaderboard;
