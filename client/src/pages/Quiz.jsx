import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import api from '../utils/api';
import ProgressBar from '../components/ProgressBar';
import { getRandomQuestions, getTopicFallbackQuestions } from '../utils/questions';
import {
  BrainCircuit,
  CheckCircle,
  Clock3,
  Compass,
  FlaskConical,
  Gauge,
  Globe2,
  Laptop,
  ListChecks,
  Rocket,
  Sparkles,
  Star,
  Trophy,
  XCircle,
} from 'lucide-react';

const categoryOptions = [
  { id: '9', name: 'General Knowledge', icon: BrainCircuit, desc: 'Mixed facts, culture, and everyday trivia' },
  { id: '17', name: 'Science & Nature', icon: FlaskConical, desc: 'Biology, chemistry, physics, and space' },
  { id: '18', name: 'Computers & Tech', icon: Laptop, desc: 'Code, hardware, networks, and the web' },
  { id: '21', name: 'Sports', icon: Trophy, desc: 'Teams, tournaments, records, and rules' },
  { id: '22', name: 'Geography', icon: Globe2, desc: 'Countries, capitals, flags, and landmarks' },
  { id: '23', name: 'History', icon: Compass, desc: 'People, eras, wars, and turning points' },
];

const difficultyOptions = [
  { id: 'easy', name: 'Easy', desc: 'Comfortable warm-up questions', stars: 1 },
  { id: 'medium', name: 'Medium', desc: 'Balanced challenge for most rounds', stars: 2 },
  { id: 'advanced', name: 'Advanced', desc: 'Sharper questions with less room to coast', stars: 3 },
];

const gameModes = [
  { id: 'classic', name: 'Classic', desc: '15 seconds per question' },
  { id: 'survival', name: 'Survival', desc: 'One miss ends the run' },
  { id: 'speedrun', name: 'Speedrun', desc: '5 seconds per question' },
];

const quickTopics = ['Marvel Cinematic Universe', 'Ancient Greek Mythology', 'JavaScript Programming', 'World Cuisine', 'Space Exploration', 'Classical Music'];
const choiceLetters = ['A', 'B', 'C', 'D'];

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const getBestStreak = (answers) => {
  let current = 0;
  let best = 0;

  answers.forEach((answer) => {
    if (answer.isCorrect) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  });

  return best;
};

const getCurrentStreak = (answers) => {
  let streak = 0;

  for (let index = answers.length - 1; index >= 0; index -= 1) {
    if (!answers[index].isCorrect) break;
    streak += 1;
  }

  return streak;
};

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameState, setGameState] = useState('lobby');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [aiEvaluation, setAiEvaluation] = useState('');
  const [selectedCat, setSelectedCat] = useState(localStorage.getItem('trivia_pref_category') || '9');
  const [selectedDiff, setSelectedDiff] = useState(localStorage.getItem('trivia_pref_difficulty') || 'medium');
  const [gameMode, setGameMode] = useState('classic');
  const [questionCount, setQuestionCount] = useState(10);
  const [customTopic, setCustomTopic] = useState('');
  const [activeTab, setActiveTab] = useState('categories');
  const [setupStep, setSetupStep] = useState(0);
  const [sessionAnswers, setSessionAnswers] = useState([]);
  const [powerups, setPowerups] = useState({
    fiftyFifty: { used: false, active: false },
    timeFreeze: { used: false, active: false },
    skip: { used: false },
  });
  const [hiddenOptions, setHiddenOptions] = useState([]);

  const navigate = useNavigate();
  const categoryName = categoryOptions.find(c => c.id === selectedCat)?.name || 'General Knowledge';
  const currentQ = questions[currentIndex];
  const answeredCount = sessionAnswers.length;
  const correctCount = sessionAnswers.filter(answer => answer.isCorrect).length;
  const accuracy = answeredCount ? Math.round((correctCount / answeredCount) * 100) : 0;
  const bestStreak = getBestStreak(sessionAnswers);
  const currentStreak = getCurrentStreak(sessionAnswers);
  const selectedTopicLabel = activeTab === 'custom' ? customTopic.trim() || 'Custom topic' : categoryName;
  const selectedModeLabel = gameModes.find(mode => mode.id === gameMode)?.name || 'Classic';
  const selectedDifficultyLabel = difficultyOptions.find(diff => diff.id === selectedDiff)?.name || 'Medium';
  const setupSteps = [
    { label: 'Topic', value: selectedTopicLabel },
    { label: 'Mode', value: selectedModeLabel },
    { label: 'Difficulty', value: selectedDifficultyLabel },
    { label: 'Length', value: `${questionCount} questions` },
  ];

  const fetchQuestions = async () => {
    localStorage.setItem('trivia_pref_category', selectedCat);
    localStorage.setItem('trivia_pref_difficulty', selectedDiff);
    setGameState('loading');
    setAiEvaluation('');

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
      const topicFallback = activeTab === 'custom'
        ? getTopicFallbackQuestions(customTopic, questionCount)
        : null;
      setQuestions(topicFallback || getRandomQuestions(questionCount));
    }

    setGameState('playing');
    setTimeLeft(gameMode === 'speedrun' ? 5 : 15);
    setCurrentIndex(0);
    setScore(0);
    setSessionAnswers([]);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setHiddenOptions([]);
    setPowerups({
      fiftyFifty: { used: false, active: false },
      timeFreeze: { used: false, active: false },
      skip: { used: false },
    });
  };

  const finishGame = async (finalScore = score) => {
    setScore(finalScore);
    setGameState('finished');
    try {
      const displayCategory = activeTab === 'custom' ? `AI Topic: ${customTopic}` : categoryName;
      const res = await api.post('/scores', { score: finalScore, category: displayCategory });
      setAiEvaluation(res.data.aiInsight);
    } catch (err) {
      console.error('Failed to save score', err);
    }
  };

  const moveToNextQuestion = (nextScore) => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setTimeLeft(gameMode === 'speedrun' ? 5 : 15);
      setHiddenOptions([]);
      setPowerups(prev => ({
        ...prev,
        timeFreeze: { ...prev.timeFreeze, active: false },
      }));
    } else {
      finishGame(nextScore);
    }
  };

  const handleAnswer = (answer) => {
    if (!currentQ || selectedAnswer) return;

    setSelectedAnswer(answer);
    const correct = answer === currentQ.correct;
    setIsCorrect(correct);

    const basePoints = gameMode === 'speedrun' ? 20 : 10;
    const timeBonus = gameMode === 'speedrun' ? timeLeft * 4 : timeLeft * 2;
    const earned = correct ? Math.max(basePoints, timeBonus) : 0;
    const nextScore = score + earned;
    if (earned > 0) setScore(nextScore);

    setSessionAnswers(prev => ([
      ...prev,
      {
        question: currentQ.question,
        selected: answer,
        correct: currentQ.correct,
        options: currentQ.options,
        explanation: currentQ.explanation,
        isCorrect: correct,
        earned,
        timeSpent: (gameMode === 'speedrun' ? 5 : 15) - timeLeft,
      },
    ]));

    setTimeout(() => {
      if (gameMode === 'survival' && !correct) {
        finishGame(score);
        return;
      }
      moveToNextQuestion(nextScore);
    }, 1700);
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && !selectedAnswer && !powerups.timeFreeze.active) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (timeLeft === 0 && !selectedAnswer && gameState === 'playing') {
      handleAnswer(null);
    }
    // handleAnswer intentionally reads the current question state at timeout.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, gameState, selectedAnswer, powerups.timeFreeze.active]);

  const useFiftyFifty = () => {
    if (powerups.fiftyFifty.used || selectedAnswer || !currentQ) return;
    const incorrectOptions = currentQ.options.filter(opt => opt !== currentQ.correct);
    setHiddenOptions(shuffleArray(incorrectOptions).slice(0, 2));
    setPowerups(prev => ({ ...prev, fiftyFifty: { used: true, active: true } }));
  };

  const useTimeFreeze = () => {
    if (powerups.timeFreeze.used || selectedAnswer) return;
    setPowerups(prev => ({ ...prev, timeFreeze: { used: true, active: true } }));
  };

  const useSkip = () => {
    if (powerups.skip.used || selectedAnswer) return;
    setPowerups(prev => ({ ...prev, skip: { used: true } }));
    if (currentQ) {
      setSessionAnswers(prev => ([
        ...prev,
        {
          question: currentQ.question,
          selected: null,
          correct: currentQ.correct,
          options: currentQ.options,
          explanation: currentQ.explanation,
          isCorrect: false,
          earned: 0,
          timeSpent: (gameMode === 'speedrun' ? 5 : 15) - timeLeft,
          skipped: true,
        },
      ]));
    }
    moveToNextQuestion(score);
  };

  if (gameState === 'lobby') {
    return (
      <main className="quiz-shell">
        <div className="quiz-panel quiz-builder animate-fade-in">
          <aside className="builder-rail glass-panel">
            <div className="eyebrow">
              <Sparkles size={16} />
              Quiz setup
            </div>
            <h1 style={{ marginTop: '0.7rem', fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>Build your round</h1>
            <p style={{ marginTop: '0.8rem', color: 'var(--text-secondary)' }}>
              Move through each launch step and watch your quiz card assemble in real time.
            </p>

            <div className="builder-steps">
              {setupSteps.map((step, index) => (
                <button
                  key={step.label}
                  type="button"
                  className={`builder-step ${setupStep === index ? 'active' : ''} ${setupStep > index ? 'done' : ''}`}
                  onClick={() => setSetupStep(index)}
                >
                  <span>{index + 1}</span>
                  <div>
                    <strong>{step.label}</strong>
                    <small>{step.value}</small>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="builder-stage glass-panel">
            <AnimatePresence mode="wait">
              {setupStep === 0 && (
                <Motion.div
                  key="topic"
                  initial={{ opacity: 0, x: 34 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.28 }}
                >
                  <StageHeader icon={<BrainCircuit size={22} />} title="Choose your quiz world" copy="Pick a curated arena or switch to a custom topic for an AI-style round." />
                  <div className="builder-tabs">
                    <button className={`btn ${activeTab === 'categories' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('categories')}>Categories</button>
                    <button className={`btn ${activeTab === 'custom' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('custom')}>Custom Topic</button>
                  </div>

                  {activeTab === 'categories' ? (
                    <div className="category-carousel">
                      {categoryOptions.map((cat, index) => {
                        const Icon = cat.icon;
                        const active = selectedCat === cat.id;
                        return (
                          <Motion.button
                            key={cat.id}
                            type="button"
                            className={`category-tile choice-tone-${index % 4} ${active ? 'active' : ''}`}
                            onClick={() => setSelectedCat(cat.id)}
                            whileHover={{ y: -6, rotate: active ? 0 : -1 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Icon size={26} />
                            <strong>{cat.name}</strong>
                            <span>{cat.desc}</span>
                          </Motion.button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="custom-topic-console">
                      <label className="label">Topic prompt</label>
                      <input
                        className="input-field"
                        value={customTopic}
                        onChange={(e) => setCustomTopic(e.target.value)}
                        placeholder="Try: Marvel, JavaScript programming, cloud computing..."
                      />
                      <div className="topic-chips">
                        {quickTopics.map(topic => (
                          <button key={topic} type="button" className="btn btn-secondary" onClick={() => setCustomTopic(topic)}>
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </Motion.div>
              )}

              {setupStep === 1 && (
                <Motion.div key="mode" initial={{ opacity: 0, x: 34 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28 }}>
                  <StageHeader icon={<Gauge size={22} />} title="Choose the pressure" copy="Classic is balanced, Survival is unforgiving, and Speedrun rewards fast instincts." />
                  <div className="mode-selector">
                    {gameModes.map((mode, index) => (
                      <Motion.button
                        key={mode.id}
                        type="button"
                        className={`mode-card choice-tone-${index} ${gameMode === mode.id ? 'active' : ''}`}
                        onClick={() => setGameMode(mode.id)}
                        whileHover={{ y: -7 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="mode-orb">{index + 1}</span>
                        <strong>{mode.name}</strong>
                        <small>{mode.desc}</small>
                      </Motion.button>
                    ))}
                  </div>
                </Motion.div>
              )}

              {setupStep === 2 && (
                <Motion.div key="difficulty" initial={{ opacity: 0, x: 34 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28 }}>
                  <StageHeader icon={<Star size={22} />} title="Set the difficulty" copy="Tune the challenge level before the first question lands." />
                  <div className="difficulty-ladder">
                    {difficultyOptions.map((diff) => (
                      <button key={diff.id} type="button" className={`difficulty-row ${selectedDiff === diff.id ? 'active' : ''}`} onClick={() => setSelectedDiff(diff.id)}>
                        <div>
                          <strong>{diff.name}</strong>
                          <span>{diff.desc}</span>
                        </div>
                        <span style={{ display: 'inline-flex', gap: 3 }}>
                          {Array.from({ length: diff.stars }).map((_, starIndex) => (
                            <Star key={starIndex} size={16} fill="currentColor" />
                          ))}
                        </span>
                      </button>
                    ))}
                  </div>
                </Motion.div>
              )}

              {setupStep === 3 && (
                <Motion.div key="length" initial={{ opacity: 0, x: 34 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28 }}>
                  <StageHeader icon={<ListChecks size={22} />} title="Pick the round length" copy="Choose a quick sprint or a longer quiz session." />
                  <div className="question-wheel">
                    {[5, 10, 15, 20].map((count) => (
                      <button key={count} type="button" className={`question-node ${questionCount === count ? 'active' : ''}`} onClick={() => setQuestionCount(count)}>
                        <strong>{count}</strong>
                        <span>questions</span>
                      </button>
                    ))}
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>

            <div className="builder-actions">
              <button className="btn btn-secondary" disabled={setupStep === 0} onClick={() => setSetupStep(step => Math.max(step - 1, 0))}>
                Back
              </button>
              {setupStep < setupSteps.length - 1 ? (
                <button
                  className="btn btn-primary"
                  disabled={setupStep === 0 && activeTab === 'custom' && !customTopic.trim()}
                  onClick={() => setSetupStep(step => Math.min(step + 1, setupSteps.length - 1))}
                >
                  Continue
                </button>
              ) : (
                <Motion.button
                  className="btn btn-primary"
                  disabled={activeTab === 'custom' && !customTopic.trim()}
                  onClick={fetchQuestions}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Rocket size={19} />
                  Launch Round
                </Motion.button>
              )}
            </div>
          </section>

          <aside className="launch-card glass-panel">
            <div className="eyebrow">Ready card</div>
            <h2>{selectedTopicLabel}</h2>
            <div className="launch-stat-grid">
              <div><span>Mode</span><strong>{selectedModeLabel}</strong></div>
              <div><span>Level</span><strong>{selectedDifficultyLabel}</strong></div>
              <div><span>Length</span><strong>{questionCount}</strong></div>
              <div><span>Timer</span><strong>{gameMode === 'speedrun' ? '5s' : '15s'}</strong></div>
            </div>
          </aside>
        </div>
      </main>
    );
  }

  if (gameState === 'loading') {
    return (
      <main className="quiz-shell" style={{ display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <BrainCircuit className="animate-float" size={62} color="var(--accent-primary)" />
          <h2 style={{ marginTop: '1rem' }}>Generating questions</h2>
          <p style={{ marginTop: '0.45rem', color: 'var(--text-secondary)' }}>
            Preparing {activeTab === 'custom' ? customTopic : categoryName}
          </p>
        </div>
      </main>
    );
  }

  if (gameState === 'finished') {
    return (
      <main className="quiz-shell">
        <Motion.section
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="quiz-panel"
        >
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1rem' }}>
            <Trophy size={70} color="var(--accent-secondary)" />
            <h1 style={{ marginTop: '1rem', fontSize: '2.4rem' }}>Round complete</h1>
            <p style={{ marginTop: '0.45rem', color: 'var(--text-secondary)' }}>{activeTab === 'custom' ? customTopic : categoryName}</p>
            <div style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 900, marginTop: '0.9rem' }}>{score}</div>
            <div style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Mode: {gameModes.find(mode => mode.id === gameMode)?.name}</div>
          </div>

          <section className="stats-grid" style={{ marginBottom: '1rem' }}>
            <ResultMetric label="Accuracy" value={`${accuracy}%`} hint={`${correctCount} of ${answeredCount || questions.length} correct`} />
            <ResultMetric label="Best streak" value={bestStreak} hint="Correct answers in a row" />
            <ResultMetric label="Questions played" value={answeredCount} hint={`${questions.length} planned`} />
            <ResultMetric label="Average points" value={answeredCount ? Math.round(score / answeredCount) : 0} hint="Per answered question" />
          </section>

          {aiEvaluation && (
            <div className="list-row" style={{ alignItems: 'flex-start', textAlign: 'left', marginBottom: '1.4rem' }}>
              <Sparkles size={18} color="var(--accent-primary)" />
              <p style={{ color: 'var(--text-secondary)' }}>{aiEvaluation}</p>
            </div>
          )}

          <section className="card" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div>
                <div className="eyebrow">Answer review</div>
                <h2 style={{ marginTop: '0.35rem', fontSize: '1.35rem' }}>Learn from this round</h2>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontWeight: 800 }}>{correctCount} correct</div>
            </div>

            <div className="review-list">
              {sessionAnswers.map((answer, index) => (
                <article key={`${answer.question}-${index}`} className={`review-item ${answer.isCorrect ? 'good' : 'bad'}`}>
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                    <div className="choice-bubble">{index + 1}</div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1rem', lineHeight: 1.35 }}>{answer.question}</h3>
                      <div className="review-meta">
                        <span>{answer.isCorrect ? 'Correct' : answer.skipped || !answer.selected ? 'Unanswered' : 'Incorrect'}</span>
                        <span>{answer.timeSpent}s</span>
                        <span>+{answer.earned}</span>
                      </div>
                      <div style={{ display: 'grid', gap: '0.35rem', marginTop: '0.75rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>
                          Your answer: <strong style={{ color: answer.isCorrect ? 'var(--success)' : 'var(--error)' }}>{answer.selected || 'No answer'}</strong>
                        </span>
                        {!answer.isCorrect && (
                          <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>
                            Correct answer: <strong style={{ color: 'var(--success)' }}>{answer.correct}</strong>
                          </span>
                        )}
                        {answer.explanation && (
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>{answer.explanation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setGameState('lobby')}>
              <Rocket size={18} />
              Play Again
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Dashboard</button>
          </div>
        </Motion.section>
      </main>
    );
  }

  const isUrgent = timeLeft <= 5 && !powerups.timeFreeze.active;

  return (
    <main className="quiz-shell">
      <div className="quiz-panel">
        <section style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div>
            <div className="eyebrow">{activeTab === 'custom' ? customTopic : categoryName}</div>
            <h1 style={{ marginTop: '0.35rem', fontSize: 'clamp(1.7rem, 4vw, 2.6rem)' }}>Question {currentIndex + 1} of {questions.length}</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'stretch', flexWrap: 'wrap' }}>
            <div className="hud-metric">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontWeight: 800, fontSize: '0.78rem' }}>
                <Clock3 size={15} /> Time
              </span>
              <strong style={{ color: isUrgent ? 'var(--error)' : 'var(--accent-primary)' }}>{powerups.timeFreeze.active ? 'Frozen' : `${timeLeft}s`}</strong>
            </div>
            <div className="hud-metric">
              <span style={{ color: 'var(--text-secondary)', fontWeight: 800, fontSize: '0.78rem' }}>Score</span>
              <strong>{score}</strong>
            </div>
            <div className="hud-metric">
              <span style={{ color: 'var(--text-secondary)', fontWeight: 800, fontSize: '0.78rem' }}>Streak</span>
              <strong style={{ color: 'var(--accent-tertiary)' }}>{currentStreak}</strong>
            </div>
          </div>
        </section>

        <ProgressBar current={currentIndex + 1} total={questions.length} />

        {!selectedAnswer && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap', margin: '1rem 0' }}>
            <button className="btn btn-secondary" disabled={powerups.fiftyFifty.used} onClick={useFiftyFifty}>50:50</button>
            <button className="btn btn-secondary" disabled={powerups.timeFreeze.used} onClick={useTimeFreeze}>
              {powerups.timeFreeze.active ? 'Time Frozen' : 'Freeze Time'}
            </button>
            <button className="btn btn-secondary" disabled={powerups.skip.used} onClick={useSkip}>Skip</button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <Motion.section
            key={currentIndex}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`glass-panel ${selectedAnswer ? 'feedback-pulse' : ''}`}
            style={{ marginTop: '1rem', padding: '2rem' }}
          >
            <div className="eyebrow">Select the best answer</div>
            <h2 style={{ margin: '0.75rem 0 1.5rem', fontSize: 'clamp(1.35rem, 3vw, 2rem)', lineHeight: 1.25 }}>
              {currentQ?.question}
            </h2>

            <div className="option-grid">
              {currentQ?.options.map((opt, index) => {
                if (hiddenOptions.includes(opt)) {
                  return <div key={opt} />;
                }

                const answered = !!selectedAnswer;
                const selected = selectedAnswer === opt;
                const correctAnswer = opt === currentQ.correct;
                const stateClass = answered && correctAnswer ? 'good' : answered && selected && !isCorrect ? 'bad' : '';

                return (
                  <Motion.button
                    key={opt}
                    className={`quiz-choice-btn choice-tone-${index % 4} ${stateClass}`}
                    disabled={answered}
                    onClick={() => handleAnswer(opt)}
                    whileHover={answered ? {} : { scale: 1.012 }}
                    whileTap={answered ? {} : { scale: 0.99 }}
                    style={{ opacity: answered && !selected && !correctAnswer ? 0.48 : 1 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <span className="choice-bubble">{choiceLetters[index]}</span>
                      <span style={{ fontWeight: 800 }}>{opt}</span>
                    </div>
                    {answered && selected && (isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />)}
                    {answered && !selected && correctAnswer && <CheckCircle size={20} />}
                  </Motion.button>
                );
              })}
            </div>

            {selectedAnswer && currentQ?.explanation && (
              <Motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="list-row" style={{ alignItems: 'flex-start', marginTop: '1.3rem' }}>
                <Sparkles size={18} color={isCorrect ? 'var(--success)' : 'var(--warning)'} />
                <p style={{ color: 'var(--text-secondary)' }}>{currentQ.explanation}</p>
              </Motion.div>
            )}
          </Motion.section>
        </AnimatePresence>
      </div>
    </main>
  );
};

const SettingsPanel = ({ title, icon, children }) => (
  <section className="card">
    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.9rem', fontSize: '1.05rem' }}>
      {icon}
      {title}
    </h2>
    <div style={{ display: 'grid', gap: '0.65rem' }}>{children}</div>
  </section>
);

const StageHeader = ({ icon, title, copy }) => (
  <header className="stage-header">
    <div className="stage-icon">{icon}</div>
    <div>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  </header>
);

const ResultMetric = ({ label, value, hint }) => (
  <div className="card stat-card" style={{ minHeight: 126 }}>
    <span className="stat-label">{label}</span>
    <span className="stat-value" style={{ color: 'var(--accent-primary)' }}>{value}</span>
    <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 700 }}>{hint}</span>
  </div>
);

export default Quiz;
