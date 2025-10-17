import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Code2, Home, FileEdit, LayoutDashboard, MessageSquare, FileText, User, LogOut } from 'lucide-react';

export default function NavBar() {
  const { token, setToken, setUser, user } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
      isActive 
        ? 'text-blue-600 bg-blue-50' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-full mx-auto px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-gray-900 font-semibold text-base hover:text-blue-600 transition-colors">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span>AI Placement System</span>
          </Link>

          {/* Navigation Links - All in one line */}
          <div className="flex items-center gap-0">
            <NavLink to="/" className={linkClass}>
              <Home className="w-4 h-4" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/problems" className={linkClass}>
              <Code2 className="w-4 h-4" />
              <span>Problems</span>
            </NavLink>
            <NavLink to="/publish" className={linkClass}>
              <FileEdit className="w-4 h-4" />
              <span>Create Problem</span>
            </NavLink>
            <NavLink to="/dashboard" className={linkClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>
            <button disabled className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
              <MessageSquare className="w-4 h-4" />
              <span>AI Interview</span>
              <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-semibold ml-1">Soon</span>
            </button>
            <button disabled className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
              <FileText className="w-4 h-4" />
              <span>Resume Maker</span>
              <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-semibold ml-1">Soon</span>
            </button>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            {token ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700">
                  <User className="w-4 h-4" />
                  <span>{user?.name || 'User'}</span>
                </div>
                <button 
                  onClick={logout} 
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/signup" 
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
