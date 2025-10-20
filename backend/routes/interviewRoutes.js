const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviewHistory,
  getInterviewDetails,
  speechToText,
  textToSpeech,
  uploadAudio
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

// Voice-to-Voice routes
// Speech-to-Text: Upload audio and get transcription (protected)
router.post('/speech-to-text', protect, uploadAudio.single('audio'), speechToText);

// Text-to-Speech: Convert text to audio (protected)
router.post('/text-to-speech', protect, textToSpeech);

module.exports = router;
