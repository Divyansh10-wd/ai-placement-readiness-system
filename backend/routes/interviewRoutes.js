const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviewHistory,
  getInterviewDetails
} = require('../controllers/interviewController');

// Start new interview (protected)
router.post('/start', protect, startInterview);

// Submit answer and get next question (protected)
router.post('/answer', protect, submitAnswer);

// Complete interview and get report (protected)
router.post('/:interviewId/complete', protect, completeInterview);

// Get interview history (protected)
router.get('/history', protect, getInterviewHistory);

// Get specific interview details (protected)
router.get('/:interviewId', protect, getInterviewDetails);

module.exports = router;
