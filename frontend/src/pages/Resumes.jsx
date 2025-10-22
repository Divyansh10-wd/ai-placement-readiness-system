import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, FileText, Edit, Trash2, Copy, Calendar, Sparkles, FileCode } from 'lucide-react';
import { getTemplateById } from '../constants/resumeTemplates';
import LatexEditor from '../components/LatexEditor';

export default function Resumes() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLatexImport, setShowLatexImport] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/resumes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setResumes(data.resumes);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/resumes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setResumes(resumes.filter(r => r._id !== id));
        alert('Resume deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/resumes/${id}/duplicate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchResumes();
        alert('Resume duplicated successfully');
      }
    } catch (error) {
      console.error('Error duplicating resume:', error);
      alert('Failed to duplicate resume');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTemplateColor = (template) => {
    const colors = {
      modern: 'bg-blue-100 text-blue-700',
      classic: 'bg-gray-100 text-gray-700',
      minimal: 'bg-green-100 text-green-700',
      professional: 'bg-purple-100 text-purple-700',
      creative: 'bg-pink-100 text-pink-700',
      executive: 'bg-indigo-100 text-indigo-700',
      technical: 'bg-cyan-100 text-cyan-700',
      academic: 'bg-amber-100 text-amber-700',
      simple: 'bg-slate-100 text-slate-700',
      elegant: 'bg-rose-100 text-rose-700',
      bold: 'bg-orange-100 text-orange-700',
      compact: 'bg-teal-100 text-teal-700',
      infographic: 'bg-fuchsia-100 text-fuchsia-700',
      timeline: 'bg-lime-100 text-lime-700',
      'two-column': 'bg-violet-100 text-violet-700'
    };
    return colors[template] || colors.modern;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
          <p className="text-gray-600 mt-1">Create and manage your professional resumes</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLatexImport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            <FileCode className="w-5 h-5" />
            Import from LaTeX
          </button>
          <button
            onClick={() => navigate('/resume-builder')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            Create New Resume
          </button>
        </div>
      </div>

      {/* Resumes Grid */}
      {resumes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h3>
          <p className="text-gray-600 mb-6">Create your first professional resume with AI assistance</p>
          <button
            onClick={() => navigate('/resume-builder')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Your First Resume
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume._id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
            >
              {/* Resume Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{getTemplateById(resume.template)?.preview || '📄'}</span>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {resume.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(resume.updatedAt)}</span>
                  </div>
                </div>
              </div>
              
              {/* Template Badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${getTemplateColor(resume.template)}`}>
                  {getTemplateById(resume.template)?.name || resume.template}
                </span>
              </div>

              {/* Resume Info */}
              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>{resume.personalInfo.fullName}</span>
                </div>
                {resume.experience && resume.experience.length > 0 && (
                  <div className="text-xs text-gray-500">
                    {resume.experience.length} experience{resume.experience.length !== 1 ? 's' : ''} • 
                    {resume.education?.length || 0} education • 
                    {resume.projects?.length || 0} project{resume.projects?.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {/* AI Score */}
              {resume.aiSuggestions && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-semibold text-gray-700">AI Analysis</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-xs text-gray-600">Overall</div>
                      <div className="text-lg font-bold text-blue-600">
                        {resume.aiSuggestions.overallScore}/100
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">ATS</div>
                      <div className="text-lg font-bold text-green-600">
                        {resume.aiSuggestions.atsScore}/100
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => navigate(`/resume-builder/${resume._id}`)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicate(resume._id);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(resume._id);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-lg">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">AI-Powered Resume Builder</h3>
            <p className="text-gray-700 mb-4">
              Our AI analyzes your resume and provides personalized suggestions to improve your content, 
              optimize for ATS systems, and increase your chances of landing interviews.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Get AI-powered content suggestions for summaries and experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Receive ATS compatibility scores and optimization tips</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Choose from multiple professional templates</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* LaTeX Import Modal */}
      {showLatexImport && (
        <LatexEditor
          mode="import"
          token={token}
          onClose={() => setShowLatexImport(false)}
          onImport={(importedResume) => {
            setShowLatexImport(false);
            fetchResumes();
            navigate(`/resume-builder/${importedResume._id}`);
          }}
        />
      )}
    </div>
  );
}
