import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import ProgressBar from '../components/ProgressBar';
import { getRandomQuestions } from '../utils/questions';
import { Timer, CheckCircle, XCircle, Trophy, Rocket, BrainCircuit, Sparkles, Star } from 'lucide-react';
import sessionBg from '../assets/session_bg.png';

const categoryOptions = [
  { id: '9', name: 'General Knowledge', icon: '🧠', color: '#ff5500', desc: 'General topics, trivia, and facts' },
  { id: '17', name: 'Science & Nature', icon: '🔬', color: '#00ff66', desc: 'Biology, chemistry, physics, space' },
  { id: '18', name: 'Computers & Tech', icon: '💻', color: '#00f0ff', desc: 'Coding, networks, hardware, internet' },
  { id: '21', name: 'Sports', icon: '⚽', color: '#fbbf24', desc: 'Soccer, Olympics, champions, terms' },
  { id: '22', name: 'Geography', icon: '🌍', color: '#ff007f', desc: 'Countries, capitals, mountains, flags' },
  { id: '23', name: 'History', icon: '📜', color: '#a855f7', desc: 'World wars, emperors, famous legends' }
];

const difficultyOptions = [
  { id: 'easy', name: 'Easy', color: '#00ff66', stars: 1, desc: 'Introductory level questions' },
  { id: 'medium', name: 'Medium', color: '#ffaa00', stars: 2, desc: 'Standard challenging parameters' },
  { id: 'advanced', name: 'Advanced', color: '#ff0055', stars: 3, desc: 'Masterclass brain buster questions' }
];

const choiceLetters = ['A', 'B', 'C', 'D'];
const choiceClasses = ['choice-a', 'choice-b', 'choice-c', 'choice-d'];

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

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
  const [gameMode, setGameMode] = useState('classic'); // classic, survival, speedrun
  const [questionCount, setQuestionCount] = useState(10); // 5, 10, 15, 20
  const [customTopic, setCustomTopic] = useState('');
  const [activeTab, setActiveTab] = useState('categories'); // categories, custom

  // Powerups / Lifelines state
  const [powerups, setPowerups] = useState({
    fiftyFifty: { used: false, active: false },
    timeFreeze: { used: false, active: false },
    skip: { used: false }
  });
  const [hiddenOptions, setHiddenOptions] = useState([]);
  
  const navigate = useNavigate();

  const activeCategory = selectedCat;
  const activeDifficulty = selectedDiff;
  const categoryName = categoryOptions.find(c => c.id === activeCategory)?.name || 'General Knowledge';

  const fetchQuestions = async () => {
    localStorage.setItem('trivia_pref_category', selectedCat);
    localStorage.setItem('trivia_pref_difficulty', selectedDiff);

    setGameState('loading');
    try {
      let url = `/quiz/generate?difficulty=${selectedDiff}&limit=${questionCount}`;
      if (activeTab === 'custom' && customTopic.trim()) {
        url += `&topic=${encodeURIComponent(customTopic.trim())}`;
      } else {
        url += `&category=${selectedCat}`;
      }

      const res = await api.get(url);
      
      if (res.data && res.data.length > 0) {
        setQuestions(res.data);
      } else {
        throw new Error('No questions returned');
      }
    } catch (err) {
      console.warn('Gemini endpoint failed, loading backup static questions...', err);
      const localQs = getRandomQuestions(questionCount);
      setQuestions(localQs);
    }
    setGameState('playing');
    setTimeLeft(gameMode === 'speedrun' ? 5 : 15);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setHiddenOptions([]);
    setPowerups({
      fiftyFifty: { used: false, active: false },
      timeFreeze: { used: false, active: false },
      skip: { used: false }
    });
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && !selectedAnswer && !powerups.timeFreeze.active) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !selectedAnswer && gameState === 'playing') {
      handleAnswer(null);
    }
  }, [timeLeft, gameState, selectedAnswer, powerups.timeFreeze.active]);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    const correct = answer === questions[currentIndex].correct;
    setIsCorrect(correct);
    if (correct) {
      const basePoints = gameMode === 'speedrun' ? 20 : 10;
      const timeBonus = gameMode === 'speedrun' ? timeLeft * 4 : timeLeft * 2;
      setScore(score + Math.max(basePoints, timeBonus));
    }

    setTimeout(() => {
      if (gameMode === 'survival' && !correct) {
        finishGame(score);
        return;
      }

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimeLeft(gameMode === 'speedrun' ? 5 : 15);
        setHiddenOptions([]);
        setPowerups(prev => ({
          ...prev,
          timeFreeze: { ...prev.timeFreeze, active: false }
        }));
      } else {
        const finalScore = score + (correct ? Math.max(gameMode === 'speedrun' ? 20 : 10, gameMode === 'speedrun' ? timeLeft * 4 : timeLeft * 2) : 0);
        finishGame(finalScore);
      }
    }, 3000);
  };

  const finishGame = async (finalScore = score) => {
    setGameState('finished');
    try {
      const displayCategory = activeTab === 'custom' ? `AI Topic: ${customTopic}` : categoryName;
      const res = await api.post('/scores', { 
        score: finalScore, 
        category: displayCategory 
      });
      
      setAiEvaluation(res.data.aiInsight);
    } catch (err) {
      console.error('Failed to save score', err);
    }
  };

  const useFiftyFifty = () => {
    if (powerups.fiftyFifty.used || selectedAnswer) return;
    const currentQ = questions[currentIndex];
    const incorrectOptions = currentQ.options.filter(opt => opt !== currentQ.correct);
    const shuffledIncorrect = shuffleArray(incorrectOptions);
    const toRemove = shuffledIncorrect.slice(0, 2);
    setHiddenOptions(toRemove);
    setPowerups(prev => ({
      ...prev,
      fiftyFifty: { used: true, active: true }
    }));
  };

  const useTimeFreeze = () => {
    if (powerups.timeFreeze.used || selectedAnswer) return;
    setPowerups(prev => ({
      ...prev,
      timeFreeze: { used: true, active: true }
    }));
  };

  const useSkip = () => {
    if (powerups.skip.used || selectedAnswer) return;
    setPowerups(prev => ({
      ...prev,
      skip: { used: true }
    }));
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setTimeLeft(gameMode === 'speedrun' ? 5 : 15);
      setHiddenOptions([]);
      setPowerups(prev => ({
        ...prev,
        timeFreeze: { ...prev.timeFreeze, active: false }
      }));
    } else {
      finishGame(score);
    }
  };

  // High-fidelity background images cover mixed with a space nebula overlay
  const mainContainerStyle = {
    padding: '3rem 2rem', 
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
    background: `radial-gradient(circle at center, rgba(16, 11, 33, 0.94) 0%, rgba(7, 5, 13, 0.98) 100%), url(${sessionBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    flexDirection: 'column',
    color: '#f8fafc',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative'
  };

  if (gameState === 'lobby') {
    return (
      <div style={mainContainerStyle}>
        <div className="page-container animate-fade-in" style={{ maxWidth: '1050px', width: '100%', margin: '0 auto' }}>
          
          {/* Header Title with Neon Glowing Effects */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <BrainCircuit size={56} color="#00f0ff" style={{ marginBottom: '0.75rem', filter: 'drop-shadow(0 0 15px rgba(0, 240, 255, 0.7))' }} />
            <h1 className="animate-flicker" style={{ 
              fontSize: '2.75rem', 
              fontWeight: 950, 
              fontFamily: 'var(--font-display)', 
              letterSpacing: '-0.02em', 
              color: '#ffffff', 
              textTransform: 'uppercase', 
              margin: 0,
              textShadow: '0 0 15px rgba(255, 0, 127, 0.7), 0 0 2px rgba(255, 0, 127, 0.8)'
            }}>
              Quiz Configuration
            </h1>
            <p style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.95rem', margin: '0.5rem 0 0 0', textShadow: '0 0 8px rgba(0, 0, 0, 0.5)' }}>
              Select parameters to customize your dynamic synthwave space trivia quest.
            </p>
          </div>

          {/* Tab Switcher: Standard Categories vs Custom AI Topic */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            background: 'rgba(5, 4, 12, 0.95)',
            border: '2px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '5px',
            maxWidth: '380px',
            margin: '0 auto 2.5rem auto',
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.4)'
          }}>
            <button
              onClick={() => setActiveTab('categories')}
              style={{
                flex: 1,
                padding: '0.65rem 1.25rem',
                borderRadius: '12px',
                background: activeTab === 'categories' ? 'linear-gradient(90deg, #ff007f, #8b5cf6)' : 'transparent',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'categories' ? '0 0 15px rgba(255, 0, 127, 0.4)' : 'none',
                textShadow: activeTab === 'categories' ? '0 0 5px #ffffff' : 'none'
              }}
            >
              📁 Standard Modes
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              style={{
                flex: 1,
                padding: '0.65rem 1.25rem',
                borderRadius: '12px',
                background: activeTab === 'custom' ? 'linear-gradient(90deg, #00f0ff, #3b82f6)' : 'transparent',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'custom' ? '0 0 15px rgba(0, 240, 255, 0.4)' : 'none',
                textShadow: activeTab === 'custom' ? '0 0 5px #ffffff' : 'none'
              }}
            >
              🔮 Custom AI Topic
            </button>
          </div>

          {/* Category Panel / Custom AI Topic Console */}
          <div className="card card-bob" style={{
            padding: '2rem',
            background: 'rgba(12, 9, 28, 0.82)',
            border: '2px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '26px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(20px)',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            {activeTab === 'categories' ? (
              <>
                <h2 style={{ 
                  fontSize: '1.05rem', 
                  fontWeight: 900, 
                  marginBottom: '1.5rem', 
                  fontFamily: 'var(--font-display)', 
                  color: '#00f0ff', 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)', 
                  paddingBottom: '0.6rem', 
                  letterSpacing: '0.04em',
                  textShadow: '0 0 10px rgba(0, 240, 255, 0.4)'
                }}>
                  1. SELECT TRIVIA CHANNEL
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {categoryOptions.map((cat) => {
                    const isActive = selectedCat === cat.id;
                    return (
                      <motion.button
                        key={cat.id}
                        onClick={() => setSelectedCat(cat.id)}
                        whileHover={{ scale: 1.025 }}
                        whileTap={{ scale: 0.985 }}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          textAlign: 'left',
                          padding: '1.25rem 1.5rem',
                          gap: '0.35rem',
                          border: isActive ? `2.5px solid ${cat.color}` : '1.5px solid rgba(255, 255, 255, 0.08)',
                          background: isActive ? `${cat.color}15` : 'rgba(255, 255, 255, 0.02)',
                          boxShadow: isActive ? `0 0 20px ${cat.color}55, inset 0 0 8px ${cat.color}22` : 'none',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          width: '100%'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{ fontSize: '1.4rem', filter: isActive ? `drop-shadow(0 0 6px ${cat.color})` : 'none' }}>{cat.icon}</span>
                            <span style={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff', textShadow: isActive ? `0 0 8px ${cat.color}88` : 'none' }}>{cat.name}</span>
                          </div>
                          {isActive && (
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 8px ${cat.color}` }}>
                              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }} />
                            </div>
                          )}
                        </div>
                        <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 550, lineHeight: 1.35 }}>{cat.desc}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Custom AI Topic Panel */
              <>
                <h2 style={{ 
                  fontSize: '1.05rem', 
                  fontWeight: 900, 
                  marginBottom: '0.75rem', 
                  fontFamily: 'var(--font-display)', 
                  color: '#ff007f', 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)', 
                  paddingBottom: '0.6rem', 
                  letterSpacing: '0.04em',
                  textShadow: '0 0 10px rgba(255, 0, 127, 0.4)'
                }}>
                  1. DYNAMIC CUSTOM AI TOPIC
                </h2>
                <p style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '1.25rem', fontWeight: 550 }}>
                  Inject any custom trivia topic (e.g. video games, pop culture, space, specialized subjects) to prompt the Gemini AI.
                </p>
                
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <input
                    type="text"
                    placeholder="e.g., Marvel Cinematic Universe, Ancient Greek Mythology, JavaScript Programming..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'rgba(5, 4, 12, 0.75)',
                      border: '1.5px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      padding: '0.85rem 1.1rem',
                      borderRadius: '14px',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      outline: 'none',
                      transition: 'all 0.15s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#00f0ff';
                      e.target.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.35)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#ff007f', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '0.25rem', textShadow: '0 0 6px rgba(255,0,127,0.3)' }}>Quick Ideas:</span>
                  {['Anime Classics 🎏', 'Cyberpunk Sci-Fi 🤖', 'French Culinary 🥖', 'Web Development 🌐', 'Space Quest 🚀', 'Classical Music 🎻'].map((idea) => (
                    <button
                      key={idea}
                      onClick={() => setCustomTopic(idea.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim())}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        color: '#cbd5e1',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => { e.target.style.background = 'rgba(0,240,255,0.1)'; e.target.style.color = '#00f0ff'; e.target.style.borderColor = '#00f0ff'; }}
                      onMouseLeave={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.04)'; e.target.style.color = '#cbd5e1'; e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)'; }}
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Bottom 3-Column Cyber Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem'
          }}>
            {/* Column 1: Game Mode */}
            <div className="card card-bob-delay" style={{ background: 'rgba(12, 9, 28, 0.82)', border: '2px solid rgba(255, 255, 255, 0.06)', borderRadius: '26px', padding: '1.75rem', textAlign: 'left', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)' }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 950, color: '#00f0ff', marginBottom: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', textShadow: '0 0 8px rgba(0,240,255,0.3)' }}>
                2. GAME MODE
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  { id: 'classic', name: 'Classic Round ⏳', desc: '15s limit. Relaxed and standard.', color: '#00f0ff' },
                  { id: 'survival', name: 'Sudden Death 💀', desc: '1 strike and you are OUT!', color: '#ff0055' },
                  { id: 'speedrun', name: 'Speedrun ⚡', desc: '5s sprint! Double point bonuses.', color: '#fbbf24' }
                ].map((mode) => {
                  const isActive = gameMode === mode.id;
                  return (
                    <motion.button
                      key={mode.id}
                      onClick={() => setGameMode(mode.id)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: '16px',
                        background: isActive ? `${mode.color}15` : 'rgba(255, 255, 255, 0.02)',
                        border: isActive ? `2px solid ${mode.color}` : '1.5px solid rgba(255, 255, 255, 0.06)',
                        boxShadow: isActive ? `0 0 15px ${mode.color}44, inset 0 0 6px ${mode.color}11` : 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff', textShadow: isActive ? `0 0 6px ${mode.color}55` : 'none' }}>{mode.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '2px', fontWeight: 550 }}>{mode.desc}</div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Choose Difficulty */}
            <div className="card card-bob" style={{ background: 'rgba(12, 9, 28, 0.82)', border: '2px solid rgba(255, 255, 255, 0.06)', borderRadius: '26px', padding: '1.75rem', textAlign: 'left', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)' }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 950, color: '#ff007f', marginBottom: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', textShadow: '0 0 8px rgba(255,0,127,0.3)' }}>
                3. DIFFICULTY
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {difficultyOptions.map((diff) => {
                  const isActive = selectedDiff === diff.id;
                  return (
                    <motion.button
                      key={diff.id}
                      onClick={() => setSelectedDiff(diff.id)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1rem',
                        background: isActive ? `${diff.color}15` : 'rgba(255, 255, 255, 0.02)',
                        border: isActive ? `2px solid ${diff.color}` : '1.5px solid rgba(255, 255, 255, 0.06)',
                        boxShadow: isActive ? `0 0 15px ${diff.color}44` : 'none',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        color: '#ffffff'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.92rem', color: diff.color, textShadow: isActive ? `0 0 6px ${diff.color}55` : 'none' }}>{diff.name}</span>
                        <span style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 550, marginTop: '2px' }}>{diff.desc}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '1px' }}>
                        {Array.from({ length: diff.stars }).map((_, idx) => (
                          <Star key={idx} size={11} color={diff.color} fill={diff.color} style={{ filter: isActive ? `drop-shadow(0 0 4px ${diff.color})` : 'none' }} />
                        ))}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Column 3: Quest Length */}
            <div className="card card-bob-delay" style={{ background: 'rgba(12, 9, 28, 0.82)', border: '2px solid rgba(255, 255, 255, 0.06)', borderRadius: '26px', padding: '1.75rem', textAlign: 'left', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)' }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 950, color: '#a855f7', marginBottom: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', textShadow: '0 0 8px rgba(168,85,247,0.3)' }}>
                4. QUEST LENGTH
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[5, 10, 15, 20].map((count) => {
                  const isActive = questionCount === count;
                  return (
                    <motion.button
                      key={count}
                      onClick={() => setQuestionCount(count)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1rem',
                        background: isActive ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        border: isActive ? '2px solid #a855f7' : '1.5px solid rgba(255, 255, 255, 0.06)',
                        boxShadow: isActive ? '0 0 15px rgba(168, 85, 247, 0.45)' : 'none',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        color: '#ffffff'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.92rem', textShadow: isActive ? '0 0 5px #a855f7' : 'none' }}>{count} Questions</span>
                        <span style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 550, marginTop: '2px' }}>
                          {count === 5 ? 'Quick sprint' : count === 10 ? 'Standard match' : count === 15 ? 'Endurance focus' : 'Ultimate marathon'}
                        </span>
                      </div>
                      <div style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        border: '1.5px solid ' + (isActive ? '#a855f7' : 'rgba(255,255,255,0.3)'),
                        background: isActive ? '#a855f7' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isActive ? '0 0 8px #a855f7' : 'none'
                      }}>
                        {isActive && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ffffff' }} />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Play Button CTA (Pulsing Laser Gradient with shimmer effects) */}
          <div style={{ textAlign: 'center' }}>
            <motion.button 
              disabled={activeTab === 'custom' && !customTopic.trim()}
              onClick={fetchQuestions} 
              className="btn btn-primary shimmer-effect" 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ 
                padding: '1.1rem 5.5rem', 
                fontSize: '1.15rem', 
                borderRadius: '20px',
                fontWeight: 900,
                letterSpacing: '0.05em',
                background: 'linear-gradient(90deg, #ff007f, #8b5cf6, #00f0ff)',
                border: '2px solid #ffffff',
                boxShadow: '0 0 25px rgba(139, 92, 246, 0.65), 0 0 10px rgba(0, 240, 255, 0.4)',
                opacity: (activeTab === 'custom' && !customTopic.trim()) ? 0.5 : 1,
                cursor: (activeTab === 'custom' && !customTopic.trim()) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                color: '#ffffff',
                textShadow: '0 0 8px rgba(255, 255, 255, 0.8)'
              }}
            >
              LAUNCH QUEST 🚀
            </motion.button>
          </div>

        </div>
      </div>
    );
  }

  if (gameState === 'loading') {
    return (
      <div style={mainContainerStyle}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: '#94a3b8' }}>
          <div style={{ textAlign: 'center' }}>
            <BrainCircuit className="animate-float" size={60} color="#00f0ff" style={{ marginBottom: '1.25rem', filter: 'drop-shadow(0 0 15px rgba(0, 240, 255, 0.7))' }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: '#ffffff', textShadow: '0 0 10px rgba(0,240,255,0.4)', letterSpacing: '0.02em' }}>SYNTHESIZING QUESTIONS</h2>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '0.5rem', fontWeight: 600 }}>Gemini AI assembling space-trivia arrays on {activeTab === 'custom' ? customTopic : categoryName}</p>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const finalScore = score;
    return (
      <div style={mainContainerStyle}>
        <div style={{ maxWidth: '600px', width: '100%', margin: '2rem auto', padding: '1rem' }}>
          <motion.div 
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel" 
            style={{ 
              padding: '3.5rem', 
              textAlign: 'center', 
              background: 'rgba(15, 12, 30, 0.92)', 
              border: '2.5px solid #00f0ff', 
              boxShadow: '0 0 25px rgba(0, 240, 255, 0.35)',
              borderRadius: '28px'
            }}
          >
            <Trophy size={80} color="#fbbf24" style={{ marginBottom: '1.25rem', filter: 'drop-shadow(0 0 15px rgba(251, 191, 36, 0.5))' }} />
            <h2 style={{ fontSize: '2.25rem', fontWeight: 950, marginBottom: '0.35rem', fontFamily: 'var(--font-display)', color: '#ffffff', textShadow: '0 0 12px rgba(0,240,255,0.6)' }}>QUEST COMPLETED!</h2>
            <p style={{ color: '#94a3b8', marginBottom: '1.75rem', fontWeight: 600 }}>Category: <span style={{ color: '#ffffff', fontWeight: 800 }}>{activeTab === 'custom' ? customTopic : categoryName}</span></p>
            
            <div style={{ 
              padding: '1.75rem 1.25rem', 
              marginBottom: '1.75rem', 
              background: 'rgba(5, 4, 12, 0.7)', 
              border: '1.5px solid rgba(255, 255, 255, 0.08)',
              borderBottom: '5px solid #ff007f',
              borderRadius: '22px',
              boxShadow: 'inset 0 0 15px rgba(0,0,0,0.6)'
            }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 850 }}>Final Score</span>
              <div style={{ fontSize: '3.5rem', fontWeight: 950, color: '#ff007f', fontFamily: 'var(--font-display)', margin: '0.15rem 0', textShadow: '0 0 15px rgba(255,0,127,0.7)' }}>{finalScore}</div>
              <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700 }}>Mode: {gameMode === 'survival' ? 'Sudden Death 💀' : gameMode === 'speedrun' ? 'Speedrun ⚡' : 'Classic ⏳'}</span>
            </div>

            {/* AI Performance Evaluation */}
            {aiEvaluation && (
              <div className="card" style={{ 
                background: 'rgba(5, 4, 12, 0.55)', 
                borderColor: 'rgba(0, 240, 255, 0.15)', 
                padding: '1.25rem',
                marginBottom: '2.5rem',
                textAlign: 'left',
                borderLeft: '4px solid #00f0ff',
                boxShadow: 'inset 0 0 10px rgba(0, 240, 255, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#00f0ff', marginBottom: '0.4rem', fontWeight: 900, fontSize: '0.85rem', textShadow: '0 0 5px rgba(0,240,255,0.4)' }}>
                  <Sparkles size={14} /> DYNAMIC AI PERFORMANCE EVALUATION
                </div>
                <p style={{ color: '#e2e8f0', fontSize: '0.88rem', lineHeight: 1.5, fontWeight: 550 }}>
                  "{aiEvaluation}"
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <motion.button 
                onClick={() => setGameState('lobby')} 
                className="btn btn-primary shimmer-effect" 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{ 
                  flex: 1, 
                  padding: '1rem', 
                  borderRadius: '16px', 
                  background: 'linear-gradient(90deg, #ff007f, #8b5cf6)', 
                  border: '1px solid #ffffff',
                  boxShadow: '0 0 15px rgba(255, 0, 127, 0.4)' 
                }}
              >
                <Rocket size={16} /> Play Again
              </motion.button>
              <button 
                onClick={() => navigate('/dashboard')} 
                className="btn btn-secondary" 
                style={{ 
                  flex: 1, 
                  padding: '1rem', 
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1.5px solid rgba(255,255,255,0.1)',
                  color: '#ffffff'
                }}
              >
                Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isUrgent = timeLeft <= 5 && !powerups.timeFreeze.active;

  return (
    <div style={mainContainerStyle}>
      <div style={{ maxWidth: '850px', width: '100%', margin: '0 auto', zIndex: 5 }}>
        
        {/* Quiz Dashboard Headers */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ color: '#00f0ff', fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', textShadow: '0 0 8px rgba(0, 240, 255, 0.5)' }}>
              Category: {activeTab === 'custom' ? customTopic : categoryName}
            </span>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff', marginTop: '2px', textShadow: '0 0 5px rgba(255,255,255,0.2)' }}>Question {currentIndex + 1} of {questions.length}</h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Heartbeat Flashing Urgent Timer box */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              color: isUrgent ? '#ff0055' : '#00f0ff',
              background: 'rgba(5, 4, 12, 0.82)',
              border: '2px solid ' + (isUrgent ? '#ff0055' : '#00f0ff'),
              padding: '6px 14px',
              borderRadius: '14px',
              boxShadow: isUrgent ? '0 0 20px rgba(255, 0, 85, 0.75)' : powerups.timeFreeze.active ? '0 0 15px rgba(0, 240, 255, 0.5)' : 'none',
              textShadow: '0 0 5px currentColor',
              animation: isUrgent ? 'bob 0.4s ease-in-out infinite alternate' : 'none'
            }}>
              <Timer size={16} />
              <span style={{ fontWeight: 900, fontSize: '1rem', fontFamily: 'var(--font-display)' }}>
                {powerups.timeFreeze.active ? '❄️ FROZEN' : `${timeLeft}s`}
              </span>
            </div>
            <div className="card" style={{ padding: '0.5rem 1.25rem', background: 'rgba(12, 9, 28, 0.85)', borderRadius: '14px', border: '1.5px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
              <span style={{ color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 700 }}>Score: </span>
              <span style={{ fontWeight: 950, color: '#ff007f', fontSize: '1.1rem', textShadow: '0 0 8px rgba(255, 0, 127, 0.5)' }}>{score}</span>
            </div>
          </div>
        </div>
        
        <ProgressBar current={currentIndex + 1} total={questions.length} />

        {/* Power-ups Panel */}
        {!selectedAnswer && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1.5rem',
            marginBottom: '0.75rem'
          }}>
            <motion.button
              disabled={powerups.fiftyFifty.used}
              onClick={useFiftyFifty}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '0.55rem 1.25rem',
                fontSize: '0.8rem',
                fontWeight: 900,
                borderRadius: '12px',
                opacity: powerups.fiftyFifty.used ? 0.35 : 1,
                border: '2px solid ' + (powerups.fiftyFifty.used ? 'rgba(255,255,255,0.05)' : '#00ff66'),
                background: powerups.fiftyFifty.used ? 'rgba(255,255,255,0.02)' : 'rgba(0, 255, 102, 0.12)',
                color: powerups.fiftyFifty.used ? '#64748b' : '#00ff66',
                cursor: powerups.fiftyFifty.used ? 'not-allowed' : 'pointer',
                boxShadow: powerups.fiftyFifty.used ? 'none' : '0 0 10px rgba(0, 255, 102, 0.25)',
                transition: 'all 0.15s ease'
              }}
            >
              🪄 50:50
            </motion.button>
            
            <motion.button
              disabled={powerups.timeFreeze.used}
              onClick={useTimeFreeze}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '0.55rem 1.25rem',
                fontSize: '0.8rem',
                fontWeight: 900,
                borderRadius: '12px',
                opacity: powerups.timeFreeze.used ? 0.35 : 1,
                border: '2px solid ' + (powerups.timeFreeze.used ? 'rgba(255,255,255,0.05)' : '#00f0ff'),
                background: powerups.timeFreeze.used ? 'rgba(255,255,255,0.02)' : 'rgba(0, 240, 255, 0.12)',
                color: powerups.timeFreeze.used ? '#64748b' : '#00f0ff',
                cursor: powerups.timeFreeze.used ? 'not-allowed' : 'pointer',
                boxShadow: powerups.timeFreeze.active ? '0 0 15px rgba(0, 240, 255, 0.5)' : powerups.timeFreeze.used ? 'none' : '0 0 10px rgba(0, 240, 255, 0.25)',
                transition: 'all 0.15s ease'
              }}
            >
              ❄️ {powerups.timeFreeze.active ? 'FROZEN!' : 'Freeze Time'}
            </motion.button>
            
            <motion.button
              disabled={powerups.skip.used}
              onClick={useSkip}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '0.55rem 1.25rem',
                fontSize: '0.8rem',
                fontWeight: 900,
                borderRadius: '12px',
                opacity: powerups.skip.used ? 0.35 : 1,
                border: '2px solid ' + (powerups.skip.used ? 'rgba(255,255,255,0.05)' : '#fbbf24'),
                background: powerups.skip.used ? 'rgba(255,255,255,0.02)' : 'rgba(251, 191, 36, 0.12)',
                color: powerups.skip.used ? '#64748b' : '#fbbf24',
                cursor: powerups.skip.used ? 'not-allowed' : 'pointer',
                boxShadow: powerups.skip.used ? 'none' : '0 0 10px rgba(251, 191, 36, 0.25)',
                transition: 'all 0.15s ease'
              }}
            >
              ⏭️ Skip
            </motion.button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ 
              position: 'relative',
              padding: '4rem 3rem 3rem 3rem', 
              marginTop: '2.5rem', 
              textAlign: 'center', 
              background: 'rgba(14, 10, 31, 0.88)', 
              border: '2.5px solid #00f0ff', 
              borderRadius: '26px',
              boxShadow: '0 0 25px rgba(0, 240, 255, 0.35), inset 0 0 15px rgba(0, 240, 255, 0.15)',
              backdropFilter: 'blur(20px)'
            }}
          >
            {/* Overlapping Hot-Pink Neon Question Circle - PERFECT Image Replica! */}
            <div style={{
              position: 'absolute',
              top: '-32px',
              left: '32px',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: '2.5px solid #ff007f',
              background: '#07050d',
              boxShadow: '0 0 22px rgba(255, 0, 127, 0.65), inset 0 0 10px rgba(255, 0, 127, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}>
              <span style={{ fontSize: '2.1rem', fontWeight: 950, color: '#ffffff', textShadow: '0 0 10px #ff007f, 0 0 2px #ffffff' }}>?</span>
            </div>

            {/* Question Text */}
            <h2 style={{ 
              fontSize: '1.75rem', 
              fontWeight: 850, 
              marginBottom: '3rem', 
              lineHeight: 1.45, 
              color: '#ffffff',
              fontFamily: 'var(--font-body)',
              textShadow: '0 0 8px rgba(255,255,255,0.1)'
            }}>
              {currentQ?.question}
            </h2>

            {/* Options Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
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

                const isHidden = hiddenOptions.includes(opt);
                if (isHidden) {
                  return <div key={i} style={{ height: '0px', opacity: 0, overflow: 'hidden' }} />;
                }

                return (
                  <motion.button
                    key={i}
                    disabled={isAnsweredState}
                    onClick={() => handleAnswer(opt)}
                    className={`quiz-choice-btn ${baseClass}`}
                    whileHover={isAnsweredState ? {} : { scale: 1.025 }}
                    whileTap={isAnsweredState ? {} : { scale: 0.985 }}
                    style={{ 
                      background: bg,
                      borderBottom: borderBottom,
                      opacity: opacity,
                      cursor: isAnsweredState ? 'default' : 'pointer',
                      transform: (isAnsweredState && selectedAnswer === opt) ? 'translateY(3px)' : undefined,
                      borderBottomWidth: (isAnsweredState && selectedAnswer === opt) ? '2px' : undefined,
                      boxShadow: isAnsweredState ? 'none' : '0 4px 15px rgba(0,0,0,0.4)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', width: '90%' }}>
                      <div className="choice-bubble">{letter}</div>
                      <span style={{ fontSize: '0.98rem', fontWeight: 700, wordBreak: 'break-word', color: '#ffffff' }}>{opt}</span>
                    </div>
                    
                    {selectedAnswer === opt && (
                      isCorrect ? <CheckCircle size={18} color="white" /> : <XCircle size={18} color="white" />
                    )}
                    {selectedAnswer && opt === currentQ.correct && selectedAnswer !== opt && (
                      <CheckCircle size={18} color="white" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* AI Explanation Accordion Box */}
            {selectedAnswer && currentQ?.explanation && (
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
                style={{ 
                  marginTop: '2.25rem', 
                  background: 'rgba(5, 4, 12, 0.7)', 
                  borderColor: isCorrect ? 'rgba(0, 255, 102, 0.2)' : 'rgba(255, 0, 85, 0.2)',
                  textAlign: 'left',
                  padding: '1.1rem 1.25rem',
                  borderLeft: `4px solid ${isCorrect ? '#00ff66' : '#ff0055'}`,
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 900, fontSize: '0.8rem', color: isCorrect ? '#00ff66' : '#ff0055', marginBottom: '0.2rem', textShadow: `0 0 5px ${isCorrect ? '#00ff66' : '#ff0055'}77` }}>
                  <Sparkles size={13} /> DYNAMIC AI EXPLANATION
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.45, fontWeight: 550 }}>
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
