import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { History as HistoryIcon, Calendar, Star, PlayCircle, Trophy, HelpCircle } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const History = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/scores/my');
        setScores(res.data);
      } catch (err) {
        console.error('Error fetching quiz history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const totalPoints = scores.reduce((sum, s) => sum + s.score, 0);

  if (loading) {
    return (
      <div className="page-shell scene-page history-scene" style={{ display: 'grid', placeItems: 'center', color: '#888888' }}>
        <div>Loading History...</div>
      </div>
    );
  }

  return (
    <main className="page-shell animate-fade-in scene-page history-scene">
      <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: '#ffffff' }}>
            <HistoryIcon size={36} color="#ffffff" /> QUIZ HISTORY
          </h1>
          <p style={{ color: '#888888', marginTop: '0.25rem', fontWeight: 500 }}>Review all your previous trivia quiz results.</p>
        </div>
        {scores.length > 0 && (
          <button onClick={() => navigate('/quiz')} className="btn btn-primary">
            <PlayCircle size={18} /> Start New Quiz
          </button>
        )}
      </div>

      {scores.length > 0 ? (
        <>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', background: '#1a1a1a', borderRadius: '12px' }}>
                <PlayCircle size={20} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#666666', textTransform: 'uppercase', fontWeight: 800 }}>Total Games</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>{scores.length}</div>
              </div>
            </div>
            <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', background: '#1a1a1a', borderRadius: '12px' }}>
                <Star size={20} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#666666', textTransform: 'uppercase', fontWeight: 800 }}>Total Score</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>{totalPoints}</div>
              </div>
            </div>
            <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', background: '#1a1a1a', borderRadius: '12px' }}>
                <Trophy size={20} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#666666', textTransform: 'uppercase', fontWeight: 800 }}>Highest Score</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>{Math.max(...scores.map(s => s.score))}</div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
                    <th style={{ padding: '1.25rem 1.5rem', color: '#888888', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>Date & Time</th>
                    <th style={{ padding: '1.25rem 1.5rem', color: '#888888', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>Category</th>
                    <th style={{ padding: '1.25rem 1.5rem', color: '#888888', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>Score Obtained</th>
                    <th style={{ padding: '1.25rem 1.5rem', color: '#888888', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((score, index) => {
                    let ratingText = 'Attempted';
                    if (score.score >= 100) ratingText = 'Masterclass';
                    else if (score.score >= 60) ratingText = 'Excellent';
                    else if (score.score >= 30) ratingText = 'Good Effort';

                    return (
                      <Motion.tr initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} key={score._id}
                        style={{ borderBottom: index === scores.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.06)', transition: 'background 0.2s', cursor: 'default' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={16} color="#666666" />
                            <span>{new Date(score.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>
                          <div>{score.category}</div>
                          {score.aiInsight && (
                            <div style={{ fontSize: '0.75rem', color: '#666666', fontWeight: 600, marginTop: '0.25rem', maxWidth: '340px', fontStyle: 'italic', lineHeight: 1.4 }}>
                              "{score.aiInsight}"
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: 900, fontSize: '1.2rem', color: '#ffffff', fontFamily: 'var(--font-display)' }}>{score.score}</td>
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem' }}>
                          <span style={{ color: '#ffffff', fontWeight: 800, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                            {ratingText}
                          </span>
                        </td>
                      </Motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="card animate-fade-in" style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <HelpCircle size={48} color="#666666" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#ffffff' }}>No Quizzes Played Yet</h2>
          <p style={{ color: '#888888', marginBottom: '2rem', maxWidth: '400px', fontWeight: 500 }}>Your history is empty because you haven't played any sessions. Challenge yourself now!</p>
          <button onClick={() => navigate('/quiz')} className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
            <PlayCircle size={20} /> Start First Quiz
          </button>
        </div>
      )}
      </div>
    </main>
  );
};

export default History;
