const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  type: { type: String, enum: ['frontend', 'backend', 'devops', 'python', 'machineLearning', 'dbms', 'java', 'cpp', 'oops', 'behavioral', 'systemDesign', 'technical', 'mixed'], default: 'technical' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
  questions: [{
    question: String,
    answer: String,
    feedback: String,
    score: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  overallScore: { type: Number, default: 0 },
  overallFeedback: String,
  duration: Number, // in seconds
  createdAt: { type: Date, default: Date.now },
  completedAt: Date
});

module.exports = mongoose.model('Interview', interviewSchema);
