import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Problems from './pages/Problems.jsx'
import ProblemDetails from './pages/ProblemDetails.jsx'
import PublishProblem from './pages/PublishProblem.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AIInterview from './pages/AIInterview.jsx'
import InterviewReport from './pages/InterviewReport.jsx'
import Resumes from './pages/Resumes.jsx'
import ResumeBuilder from './pages/ResumeBuilder.jsx'
import { useAuth } from './context/AuthContext.jsx'

function ProtectedRoute({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 text-gray-900">
      <NavBar />
      <main className="max-w-7xl mx-auto px-6 py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:id" element={<ProblemDetails />} />
          <Route
            path="/publish"
            element={
              <ProtectedRoute>
                <PublishProblem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-interview"
            element={
              <ProtectedRoute>
                <AIInterview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview-report"
            element={
              <ProtectedRoute>
                <InterviewReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resumes"
            element={
              <ProtectedRoute>
                <Resumes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-builder"
            element={
              <ProtectedRoute>
                <ResumeBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-builder/:id"
            element={
              <ProtectedRoute>
                <ResumeBuilder />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}
