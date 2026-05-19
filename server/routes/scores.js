const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};

// Post score
router.post('/', auth, async (req, res) => {
  try {
    const { score, category } = req.body;
    
    // Generate AI evaluation insight using Gemini
    let aiInsight = `Awesome run! You showed great cognitive agility in ${category}.`;
    try {
      const prompt = `As the Trivia X gamified AI game master, evaluate a challenger who scored ${score} points in the category '${category}' out of 10 total questions. Write a brief, highly engaging 2-sentence performance review with relevant emojis. Keep it fun, encouraging, and rewarding (Duolingo or Quizizz style). Respond with only the raw review text.`;
      
      const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (apiResponse.ok) {
        const data = await apiResponse.json();
        const text = data.candidates[0].content.parts[0].text;
        if (text && text.trim().length > 0) {
          aiInsight = text.trim();
        }
      }
    } catch (err) {
      console.warn('Gemini score evaluation failed, using fallback congrats badge...', err);
    }

    const newScore = new Score({
      user: req.user.id,
      score,
      category,
      aiInsight
    });
    await newScore.save();

    // Update user's total score and games played
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalScore: score, gamesPlayed: 1 }
    });

    res.json(newScore);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's scores
router.get('/my', auth, async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Score.find()
      .populate('user', 'username avatar')
      .sort({ score: -1 })
      .limit(10);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
