const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  category: { type: String, default: 'General Knowledge' },
  difficulty: { type: String, default: 'Mixed' },
  aiInsight: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Score', scoreSchema);
