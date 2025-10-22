import { Link } from 'react-router-dom';
import { Code2, Users, CheckCircle, Trophy, MessageSquare, FileText, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
          AI Placement Readiness System
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Master your coding interviews with our comprehensive platform featuring coding challenges, AI interviews, and resume optimization tools.
        </p>
        {user && (
          <p className="text-sm text-gray-500">Welcome back, {user.name}!</p>
        )}
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link to="/problems" className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-md">
            <Code2 className="w-5 h-5" />
            Start Coding
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/dashboard" className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all">
            View Dashboard
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
          <Code2 className="w-10 h-10 text-blue-600 mx-auto mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">50+</div>
          <div className="text-sm text-gray-600">Active Problems</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
          <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">1K+</div>
          <div className="text-sm text-gray-600">Registered Users</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
          <CheckCircle className="w-10 h-10 text-blue-600 mx-auto mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">5K+</div>
          <div className="text-sm text-gray-600">Solutions Submitted</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
          <Trophy className="w-10 h-10 text-blue-600 mx-auto mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">85%</div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
      </div>

      {/* Three Powerful Modules */}
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Three Powerful Modules</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Everything you need to ace your technical interviews and land your dream job.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LeetCode-Style Coding Platform */}
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Code2 className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">LeetCode-Style Coding Platform</h3>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Practice coding problems, submit solutions, and get real-time feedback with our Judge0-powered execution engine.
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Real-time code execution</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Multiple programming languages</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Problem creation and sharing</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Detailed test case feedback</span>
            </li>
          </ul>
          <Link to="/problems" className="block w-full text-center px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
            Get Started →
          </Link>
        </div>

        {/* One-to-One AI Interview */}
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm relative">
          <div className="absolute top-4 right-4 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            Coming Soon
          </div>
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6 text-gray-400" />
            <h3 className="text-xl font-bold text-gray-500">One-to-One AI Interview</h3>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Experience realistic technical interviews with our AI interviewer. Get personalized feedback and improve your interview skills.
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span>AI-powered mock interviews</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span>Real-time feedback</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span>Performance analytics</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span>Industry-specific questions</span>
            </li>
          </ul>
          <button disabled className="block w-full text-center px-4 py-2.5 rounded-lg bg-blue-100 text-blue-400 font-medium cursor-not-allowed">
            Coming Soon
          </button>
        </div>

        {/* AI Resume Maker */}
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">AI Resume Maker</h3>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Create professional resumes tailored to your target roles using our AI-powered resume builder.
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>AI-powered content suggestions</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Industry-specific templates</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>ATS-friendly formats</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Real-time optimization tips</span>
            </li>
          </ul>
          <Link to="/resumes" className="block w-full text-center px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
            Get Started →
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-4 py-12 bg-white rounded-2xl border border-gray-200 px-8">
        <h2 className="text-3xl font-bold text-gray-900">Ready to Start Your Journey?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join thousands of developers who are already improving their coding skills and landing their dream jobs.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link to="/signup" className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-md">
            Get Started Free
          </Link>
          <Link to="/problems" className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all">
            Browse Problems
          </Link>
        </div>
      </div>
    </div>
  );
}
