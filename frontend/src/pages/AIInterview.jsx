import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Send, Play, Square, Trophy, Clock, MessageSquare, Brain, Sparkles, Volume2, VolumeX, Loader } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext.jsx';
import { useBrowserSpeechRecognition } from '../hooks/useBrowserSpeechRecognition';

export default function AIInterview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Interview state
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewId, setInterviewId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions] = useState(10);
  
  // Interview settings
  const [interviewType, setInterviewType] = useState('frontend');
  const [difficulty, setDifficulty] = useState('medium');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [showEvaluation, setShowEvaluation] = useState(false);
  
  // Timer
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);
  
  // Browser-based speech recognition (FREE)
  const { isListening, transcript, error: voiceError, isSupported, startListening, stopListening, resetTranscript } = useBrowserSpeechRecognition();
  const [useBrowserSpeech, setUseBrowserSpeech] = useState(true); // Toggle for browser speech
  
  // Audio playback for questions (ElevenLabs)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);

  // Start timer when interview begins
  useEffect(() => {
    if (interviewStarted) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [interviewStarted]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start interview
  const startInterview = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/interviews/start', {
        type: interviewType,
        difficulty
      });
      
      setInterviewId(data.interviewId);
      setCurrentQuestion(data.question);
      setInterviewStarted(true);
      setQuestionNumber(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  // Submit answer
  const submitAnswer = async () => {
    if (!answer.trim()) {
      setError('Please provide an answer before submitting');
      return;
    }

    if (answer.trim().length < 20) {
      setError('Please provide a more detailed answer (at least 20 characters)');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/interviews/answer', {
        interviewId,
        question: currentQuestion,
        answer
      });

      setEvaluation(data.evaluation);
      setShowEvaluation(true);

      // Wait 3 seconds to show evaluation, then move to next question
      setTimeout(() => {
        if (data.completed) {
          completeInterview();
        } else {
          setCurrentQuestion(data.nextQuestion);
          setQuestionNumber(data.questionNumber);
          setAnswer('');
          setShowEvaluation(false);
          setEvaluation(null);
        }
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  // Complete interview
  const completeInterview = async () => {
    try {
      const { data } = await api.post(`/interviews/${interviewId}/complete`);
      navigate('/interview-report', { state: { report: data } });
    } catch (err) {
      setError('Failed to complete interview');
    }
  };

  // Toggle browser speech recognition
  const toggleSpeechRecognition = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  // Play question as audio (ElevenLabs TTS)
  const playQuestionAudio = async (text) => {
    if (!text || isPlayingAudio) return;

    setIsPlayingAudio(true);
    try {
      const { data } = await api.post('/interviews/text-to-speech', 
        { text },
        { responseType: 'blob' }
      );

      const audioUrl = URL.createObjectURL(data);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
        setError('Failed to play audio. Please try again.');
      };

      await audio.play();
    } catch (err) {
      console.error('TTS error:', err);
      setIsPlayingAudio(false);
      setError('Audio playback failed. Check if ElevenLabs API is configured.');
    }
  };

  // Stop audio playback
  const stopAudioPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlayingAudio(false);
    }
  };

  // Update answer when transcript changes
  useEffect(() => {
    if (transcript) {
      setAnswer(transcript);
    }
  }, [transcript]);

  if (!interviewStarted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12">
        <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Mock Interview</h1>
            <p className="text-gray-600">Practice with our AI interviewer and get instant feedback</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Interview Type</label>
              <div className="grid grid-cols-4 gap-3 mb-3">
                <button
                  onClick={() => setInterviewType('frontend')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    interviewType === 'frontend'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-sm">🎨 Frontend</div>
                </button>
                <button
                  onClick={() => setInterviewType('backend')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    interviewType === 'backend'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-sm">⚙️ Backend</div>
                </button>
                <button
                  onClick={() => setInterviewType('devops')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    interviewType === 'devops'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-sm">🚀 DevOps</div>
                </button>
                <button
                  onClick={() => setInterviewType('dbms')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    interviewType === 'dbms'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-sm">🗄️ DBMS</div>
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-3">
                <button
                  onClick={() => setInterviewType('python')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    interviewType === 'python'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-sm">🐍 Python</div>
                </button>
                <button
                  onClick={() => setInterviewType('java')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    interviewType === 'java'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-sm">☕ Java</div>
                </button>
                <button
                  onClick={() => setInterviewType('cpp')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    interviewType === 'cpp'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-sm">⚡ C++</div>
                </button>
                <button
                  onClick={() => setInterviewType('oops')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    interviewType === 'oops'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-sm">🎯 OOPs</div>
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={() => setInterviewType('machineLearning')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    interviewType === 'machineLearning'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-sm">🤖 ML/AI</div>
                </button>
                <button
                  onClick={() => setInterviewType('systemDesign')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    interviewType === 'systemDesign'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-sm">🏗️ System Design</div>
                </button>
                <button
                  onClick={() => setInterviewType('behavioral')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    interviewType === 'behavioral'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-sm">💬 Behavioral</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Difficulty Level</label>
              <div className="grid grid-cols-3 gap-3">
                {['easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`p-3 rounded-lg border-2 transition-all capitalize ${
                      difficulty === level
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">What to Expect:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• {totalQuestions} questions tailored to your selection</li>
                <li>• 🎙️ <strong>Voice-to-Voice:</strong> Speak your answers or type them</li>
                <li>• 🔊 Questions read aloud automatically</li>
                <li>• Instant AI-powered feedback after each answer</li>
                <li>• Detailed performance report at the end</li>
                <li>• Practice as many times as you want</li>
              </ul>
            </div>

            <button
              onClick={startInterview}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <Play className="w-5 h-5" />
              {loading ? 'Starting Interview...' : 'Start Interview'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      {/* Header with progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Interview Session</h2>
            <p className="text-sm text-gray-600 capitalize">{interviewType} • {difficulty} level</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5" />
              <span className="font-mono text-lg font-semibold">{formatTime(elapsedTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">{questionNumber} / {totalQuestions}</span>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Question {questionNumber}</h3>
              <button
                onClick={() => isPlayingAudio ? stopAudioPlayback() : playQuestionAudio(currentQuestion)}
                disabled={!currentQuestion}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isPlayingAudio ? (
                  <>
                    <Square className="w-4 h-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    Play Question
                  </>
                )}
              </button>
            </div>
            <p className="text-gray-800 text-lg leading-relaxed">{currentQuestion}</p>
          </div>
        </div>

        {/* Evaluation feedback */}
        {showEvaluation && evaluation && (
          <div className={`mb-6 p-4 rounded-lg border-2 ${
            evaluation.score >= 7 ? 'bg-green-50 border-green-200' : 
            evaluation.score >= 5 ? 'bg-yellow-50 border-yellow-200' : 
            'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className={`w-5 h-5 ${
                evaluation.score >= 7 ? 'text-green-600' : 
                evaluation.score >= 5 ? 'text-yellow-600' : 
                'text-red-600'
              }`} />
              <span className="font-semibold">Score: {evaluation.score}/10</span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{evaluation.feedback}</p>
          </div>
        )}

        {/* Answer input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Your Answer</label>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSpeechRecognition}
                disabled={loading || showEvaluation || !isSupported}
                className={`p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isListening 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200 animate-pulse' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input (FREE)'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <span className="text-xs text-gray-500">{answer.length} characters</span>
            </div>
          </div>
          
          {/* Voice status indicators */}
          {isListening && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">🎤 Listening... Speak your answer (FREE browser speech recognition)</span>
            </div>
          )}
          
          {!isSupported && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <span className="text-sm text-yellow-700">⚠️ Voice input not supported. Please use Chrome or Edge browser.</span>
            </div>
          )}
          
          {voiceError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <span className="text-sm text-red-700">{voiceError}</span>
            </div>
          )}
          
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here... (minimum 20 characters)"
            className="w-full border-2 border-gray-300 rounded-lg p-4 min-h-[200px] focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={loading || showEvaluation}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={submitAnswer}
              disabled={loading || showEvaluation || !answer.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {loading ? 'Submitting...' : 'Submit Answer'}
            </button>
            <button
              onClick={completeInterview}
              className="px-6 py-3 rounded-lg border-2 border-red-600 text-red-600 font-semibold hover:bg-red-50 transition-all"
            >
              <Square className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tips card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-3">💡 Interview Tips:</h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>• <strong>Voice Input (FREE):</strong> Click mic button - requires internet connection</li>
          <li>• <strong>Voice Output:</strong> Click "Play Question" to hear questions</li>
          <li>• <strong>Typing:</strong> You can always type your answer instead</li>
          <li>• Take your time to think before answering</li>
          <li>• Provide specific examples when possible</li>
          <li>• Structure your answers clearly (situation, action, result)</li>
          <li>• Be honest - the AI is here to help you improve</li>
        </ul>
      </div>
    </div>
  );
}
