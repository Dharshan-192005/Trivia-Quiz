import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import ProgressBar from '../components/ProgressBar';
import { getRandomQuestions } from '../utils/questions';
import { Timer, CheckCircle, XCircle, Trophy, Rocket, BrainCircuit, Sparkles, Star } from 'lucide-react';
import sessionBg from '../assets/session_bg.png';

const categoryOptions = [
  { id: '9', name: 'General Knowledge', icon: '🧠', color: 'var(--choice-a)', desc: 'General topics, trivia, and facts' },
  { id: '17', name: 'Science & Nature', icon: '🔬', color: 'var(--choice-d)', desc: 'Biology, chemistry, physics, space' },
  { id: '18', name: 'Computers & Tech', icon: '💻', color: 'var(--choice-b)', desc: 'Coding, networks, hardware, internet' },
  { id: '21', name: 'Sports', icon: '⚽', color: 'var(--choice-c)', desc: 'Soccer, olympics, champions, terms' },
  { id: '22', name: 'Geography', icon: '🌍', color: '#ff007f', desc: 'Countries, capitals, mountains, flags' },
  { id: '23', name: 'History', icon: '📜', color: '#a855f7', desc: 'World wars, emperors, famous legends' }
];

const difficultyOptions = [
  { id: 'easy', name: 'Easy', color: 'var(--success)', stars: 1, desc: 'Introductory level questions' },
  { id: 'medium', name: 'Medium', color: 'var(--warning)', stars: 2, desc: 'Standard challenging parameters' },
  { id: 'advanced', name: 'Advanced', color: 'var(--error)', stars: 3, desc: 'Masterclass brain buster questions' }
];

const choiceLetters = ['A', 'B', 'C', 'D'];
const choiceClasses = ['choice-a', 'choice-b', 'choice-c', 'choice-d'];

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameState, setGameState] = useState('lobby'); // lobby, loading, playing, finished
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [aiEvaluation, setAiEvaluation] = useState('');
  
  // Lobby configurations
  const [selectedCat, setSelectedCat] = useState(localStorage.getItem('trivia_pref_category') || '9');
  const [selectedDiff, setSelectedDiff] = useState(localStorage.getItem('trivia_pref_difficulty') || 'medium');
  
  const navigate = useNavigate();

  const activeCategory = selectedCat;
  const activeDifficulty = selectedDiff;
  const categoryName = categoryOptions.find(c => c.id === activeCategory)?.name || 'General Knowledge';

  const fetchQuestions = async () => {
    // Save selections locally
    localStorage.setItem('trivia_pref_category', selectedCat);
    localStorage.setItem('trivia_pref_difficulty', selectedDiff);

    setGameState('loading');
    try {
      // Fetch dynamic Gemini LLM generated questions from backend
      const res = await api.get(`/quiz/generate?category=${selectedCat}&difficulty=${selectedDiff}`);
      
      if (res.data && res.data.length > 0) {
        setQuestions(res.data);
      } else {
        throw new Error('No questions returned');
      }
    } catch (err) {
      console.warn('Gemini endpoint failed, loading backup static questions...', err);
      const localQs = getRandomQuestions(10);
      setQuestions(localQs);
    }
    setGameState('playing');
    setTimeLeft(15);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && !selectedAnswer) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !selectedAnswer && gameState === 'playing') {
      handleAnswer(null);
    }
  }, [timeLeft, gameState, selectedAnswer]);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    const correct = answer === questions[currentIndex].correct;
    setIsCorrect(correct);
    if (correct) setScore(score + Math.max(10, timeLeft * 2));

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimeLeft(15);
      } else {
        finishGame();
      }
    }, 3000);
  };

  const finishGame = async () => {
    setGameState('finished');
    try {
      const res = await api.post('/scores', { 
        score, 
        category: categoryName 
      });
      
      setAiEvaluation(res.data.aiInsight);
    } catch (err) {
      console.error('Failed to save score', err);
    }
  };

  const mainContainerStyle = {
    padding: '2rem', 
    minHeight: '100vh',
    backgroundImage: `url(${sessionBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  // Lobby Configuration Render State
  if (gameState === 'lobby') {
    return (
      <div style={mainContainerStyle}>
        <div className="page-container animate-fade-in" style={{ maxWidth: '950px', margin: '0 auto' }}>
          
          {/* Header Title */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <BrainCircuit size={60} color="var(--accent-primary)" style={{ marginBottom: '0.75rem', filter: 'drop-shadow(0 4px 10px rgba(234, 88, 12, 0.25))' }} />
            <h1 style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>QUIZ CONFIGURE</h1>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '1.05rem' }}>Select your category and difficulty to launch the quest.</p>
          </div>

          {/* Categories grid */}
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>1. SELECT CATEGORY</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
            {categoryOptions.map((cat) => {
              const isActive = selectedCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className="quiz-choice-btn"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    padding: '1.5rem',
                    gap: '0.5rem',
                    border: isActive ? `3px solid ${cat.color}` : '2px solid rgba(0, 0, 0, 0.06)',
                    background: '#ffffff',
                    boxShadow: isActive ? `0 8px 24px -5px ${cat.color}33` : '0 2px 4px rgba(0,0,0,0.01)',
                    opacity: isActive ? 1 : 0.8,
                    borderRadius: '20px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.75rem' }}>{cat.icon}</span>
                    <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)' }}>{cat.name}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.4 }}>{cat.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Difficulty grid */}
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>2. CHOOSE DIFFICULTY</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', marginBottom: '3.5rem' }}>
            {difficultyOptions.map((diff) => {
              const isActive = selectedDiff === diff.id;
              return (
                <button
                  key={diff.id}
                  onClick={() => setSelectedDiff(diff.id)}
                  className="quiz-choice-btn"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    padding: '1.5rem',
                    gap: '0.5rem',
                    border: isActive ? `3px solid ${diff.color}` : '2px solid rgba(0, 0, 0, 0.06)',
                    background: '#ffffff',
                    boxShadow: isActive ? `0 8px 24px -5px ${diff.color}33` : '0 2px 4px rgba(0,0,0,0.01)',
                    opacity: isActive ? 1 : 0.8,
                    borderRadius: '20px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.15rem', color: diff.color }}>{diff.name}</span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: diff.stars }).map((_, idx) => (
                        <Star key={idx} size={14} color={diff.color} fill={diff.color} />
                      ))}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{diff.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Submit play CTA */}
          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={fetchQuestions} 
              className="btn btn-primary" 
              style={{ padding: '1.25rem 4rem', fontSize: '1.2rem', borderRadius: '20px' }}
            >
              START QUIZ QUEST ⚡
            </button>
          </div>

        </div>
      </div>
    );
  }

  if (gameState === 'loading') {
    return (
      <div style={mainContainerStyle}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'var(--text-secondary)' }}>
          <div style={{ textAlign: 'center' }}>
            <BrainCircuit className="animate-float" size={60} color="var(--accent-primary)" style={{ marginBottom: '1rem', filter: 'drop-shadow(0 4px 10px rgba(234, 88, 12, 0.2))' }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>Consulting Gemini LLM...</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Synthesizing expert trivia questions on {categoryName}</p>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div style={mainContainerStyle}>
        <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '1rem' }}>
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel" 
            style={{ padding: '3.5rem', textAlign: 'center' }}
          >
            <Trophy size={90} color="#fbbf24" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 4px 15px rgba(251, 191, 36, 0.3))' }} />
            <h2 style={{ fontSize: '2.75rem', fontWeight: 900, marginBottom: '0.5rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>QUEST COMPLETED!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontWeight: 600 }}>Category: <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{categoryName}</span></p>
            
            <div style={{ 
              padding: '2rem 1.5rem', 
              marginBottom: '2rem', 
              background: '#f8fafc', 
              border: '2px solid rgba(0, 0, 0, 0.04)',
              borderBottom: '5px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '24px' 
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>Final Score</span>
              <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--accent-primary)', fontFamily: 'var(--font-display)', margin: '0.25rem 0' }}>{score}</div>
            </div>

            {/* AI Game Master Performance Review */}
            {aiEvaluation && (
              <div className="card" style={{ 
                background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.06), rgba(14, 165, 233, 0.04))', 
                borderColor: 'rgba(234, 88, 12, 0.15)', 
                padding: '1.5rem',
                marginBottom: '2.5rem',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.85rem' }}>
                  <Sparkles size={16} /> 🔮 GEMINI AI SCORING EVALUATION
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
                  "{aiEvaluation}"
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <button onClick={() => setGameState('lobby')} className="btn btn-primary" style={{ flex: 1, padding: '1.25rem' }}>
                <Rocket size={18} /> Play Again
              </button>
              <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ flex: 1, padding: '1.25rem' }}>
                Go to Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div style={mainContainerStyle}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        
        {/* Quiz Dashboard Headers */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Gemini AI Category: {categoryName}
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Question {currentIndex + 1} of {questions.length}</h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              color: timeLeft <= 5 ? 'var(--error)' : 'var(--accent-primary)',
              background: '#ffffff',
              border: '2px solid rgba(0, 0, 0, 0.05)',
              padding: '6px 12px',
              borderRadius: '12px'
            }}>
              <Timer size={18} />
              <span style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>{timeLeft}s</span>
            </div>
            <div className="card" style={{ padding: '0.5rem 1.25rem', background: '#ffffff', borderRadius: '12px', borderBottomWidth: '4px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700 }}>Score: </span>
              <span style={{ fontWeight: 900, color: 'var(--accent-primary)', fontSize: '1.1rem' }}>{score}</span>
            </div>
          </div>
        </div>
        
        <ProgressBar current={currentIndex + 1} total={questions.length} />

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            className="glass-panel"
            style={{ padding: '3.5rem', marginTop: '2rem', textAlign: 'center' }}
          >
            {/* Question Text */}
            <h2 style={{ 
              fontSize: '1.8rem', 
              fontWeight: 800, 
              marginBottom: '3.5rem', 
              lineHeight: 1.45, 
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)'
            }}>
              {currentQ?.question}
            </h2>

            {/* Options Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {currentQ?.options.map((opt, i) => {
                const letter = choiceLetters[i] || 'A';
                const baseClass = choiceClasses[i] || 'choice-a';
                
                let bg = undefined;
                let borderBottom = undefined;
                let opacity = 1;
                let isAnsweredState = !!selectedAnswer;

                if (isAnsweredState) {
                  if (selectedAnswer === opt) {
                    bg = isCorrect ? 'var(--success)' : 'var(--error)';
                    borderBottom = isCorrect ? '5px solid #065f46' : '5px solid #991b1b';
                  } else if (opt === currentQ.correct) {
                    bg = 'var(--success)';
                    borderBottom = '5px solid #065f46';
                  } else {
                    opacity = 0.35;
                  }
                }

                return (
                  <button
                    key={i}
                    disabled={isAnsweredState}
                    onClick={() => handleAnswer(opt)}
                    className={`quiz-choice-btn ${baseClass}`}
                    style={{ 
                      background: bg,
                      borderBottom: borderBottom,
                      opacity: opacity,
                      cursor: isAnsweredState ? 'default' : 'pointer',
                      transform: (isAnsweredState && selectedAnswer === opt) ? 'translateY(3px)' : undefined,
                      borderBottomWidth: (isAnsweredState && selectedAnswer === opt) ? '2px' : undefined
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '90%' }}>
                      <div className="choice-bubble">{letter}</div>
                      <span style={{ fontSize: '1rem', fontWeight: 700, wordBreak: 'break-word' }}>{opt}</span>
                    </div>
                    
                    {selectedAnswer === opt && (
                      isCorrect ? <CheckCircle size={22} color="white" /> : <XCircle size={22} color="white" />
                    )}
                    {selectedAnswer && opt === currentQ.correct && selectedAnswer !== opt && (
                      <CheckCircle size={22} color="white" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* AI Explanation Accordion Box */}
            {selectedAnswer && currentQ?.explanation && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
                style={{ 
                  marginTop: '2.5rem', 
                  background: '#f8fafc', 
                  borderColor: isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  textAlign: 'left',
                  padding: '1.25rem 1.5rem',
                  borderLeft: `4px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.85rem', color: isCorrect ? 'var(--success)' : 'var(--error)', marginBottom: '0.25rem' }}>
                  <Sparkles size={14} /> 💡 DYNAMIC AI EXPLANATION
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, fontWeight: 500 }}>
                  {currentQ.explanation}
                </p>
              </motion.div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;
