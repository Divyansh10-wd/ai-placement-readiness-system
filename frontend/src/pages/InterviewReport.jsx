import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Trophy, Clock, CheckCircle, XCircle, ArrowRight, Home, RotateCcw } from 'lucide-react';

export default function InterviewReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const report = location.state?.report;

  if (!report) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No interview report found</p>
          <Link to="/ai-interview" className="text-blue-600 hover:text-blue-700 font-semibold">
            Start New Interview
          </Link>
        </div>
      </div>
    );
  }

  const { overallScore, overallFeedback, totalQuestions, duration, questions } = report;
  const score = parseFloat(overallScore);
  const passed = questions.filter(q => q.score >= 6).length;
  const failed = totalQuestions - passed;

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-blue-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 8) return 'bg-green-100 border-green-200';
    if (score >= 6) return 'bg-blue-100 border-blue-200';
    if (score >= 4) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Interview Complete! 🎉</h1>
            <p className="text-blue-100">Here's your detailed performance report</p>
          </div>
          <div className="text-right">
            <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            <div className="text-sm text-blue-100">out of 10</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-medium">Questions</span>
            </div>
            <div className="text-2xl font-bold">{totalQuestions}</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Duration</span>
            </div>
            <div className="text-2xl font-bold">{formatDuration(duration)}</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Pass Rate</span>
            </div>
            <div className="text-2xl font-bold">{Math.round((passed / totalQuestions) * 100)}%</div>
          </div>
        </div>
      </div>

      {/* Overall Feedback */}
      <div className={`rounded-xl border-2 p-6 ${getScoreBg(score)}`}>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Overall Feedback</h2>
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{overallFeedback}</p>
      </div>

      {/* Performance Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Breakdown</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-900">{passed}</div>
              <div className="text-sm text-green-700">Strong Answers</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <div className="text-2xl font-bold text-red-900">{failed}</div>
              <div className="text-sm text-red-700">Needs Improvement</div>
            </div>
          </div>
        </div>

        {/* Score distribution */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700 mb-3">Score Distribution</h3>
          {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(scoreLevel => {
            const count = questions.filter(q => Math.round(q.score) === scoreLevel).length;
            if (count === 0) return null;
            return (
              <div key={scoreLevel} className="flex items-center gap-3">
                <span className="w-8 text-sm font-medium text-gray-600">{scoreLevel}/10</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      scoreLevel >= 8 ? 'bg-green-500' :
                      scoreLevel >= 6 ? 'bg-blue-500' :
                      scoreLevel >= 4 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${(count / totalQuestions) * 100}%` }}
                  />
                </div>
                <span className="w-12 text-sm text-gray-600">{count} Q</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question-by-Question Review */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Question-by-Question Review</h2>
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={idx} className={`p-4 rounded-lg border-2 ${getScoreBg(q.score)}`}>
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 flex-1">Q{idx + 1}: {q.question}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(q.score)}`}>
                  {q.score}/10
                </span>
              </div>
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Your Answer:</div>
                <p className="text-sm text-gray-600 bg-white/50 p-3 rounded">{q.answer}</p>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Feedback:</div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{q.feedback}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <Link
          to="/ai-interview"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          <RotateCcw className="w-5 h-5" />
          Try Another Interview
        </Link>
        <Link
          to="/"
          className="flex items-center justify-center gap-2 px-6 py-4 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
