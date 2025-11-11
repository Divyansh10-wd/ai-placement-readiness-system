import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Save, Plus, Trash2, Sparkles, Eye, Download, ArrowLeft, Layout, FileCode } from 'lucide-react';
import TemplateSelector from '../components/TemplateSelector';
import ResumePreview from '../components/ResumePreview';
import LatexEditor from '../components/LatexEditor';
import LatexEditorSplit from '../components/LatexEditorSplit';
import { getTemplateById } from '../constants/resumeTemplates';

export default function ResumeBuilder() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showLatexEditor, setShowLatexEditor] = useState(null); // 'import' or 'export'
  const [showLatexEditorSplit, setShowLatexEditorSplit] = useState(false);

  const [resume, setResume] = useState({
    title: 'My Resume',
    template: 'modern',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: '',
      summary: ''
    },
    experience: [],
    education: [],
    projects: [],
    skills: {
      technical: [],
      languages: [],
      frameworks: [],
      tools: [],
      soft: []
    },
    certifications: [],
    achievements: []
  });

  const [aiSuggestions, setAiSuggestions] = useState(null);

  useEffect(() => {
    if (id) {
      fetchResume();
    }
  }, [id]);

  const fetchResume = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/resumes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setResume(data.resume);
        setAiSuggestions(data.resume.aiSuggestions);
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const url = id 
        ? `http://localhost:5000/api/resumes/${id}`
        : 'http://localhost:5000/api/resumes';
      
      const method = id ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(resume)
      });

      const data = await res.json();
      if (data.success) {
        alert(id ? 'Resume updated successfully!' : 'Resume created successfully!');
        if (!id) {
          navigate(`/resume-builder/${data.resume._id}`);
        }
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Failed to save resume');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!id) {
      alert('Please save the resume first before analyzing');
      return;
    }

    setAnalyzing(true);
    try {
      const res = await fetch(`http://localhost:5000/api/resumes/${id}/analyze`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        setAiSuggestions(data.suggestions);
        alert('AI analysis complete! Check the suggestions below.');
      } else {
        alert(data.message || 'Failed to analyze resume');
      }
    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert('Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  const addExperience = () => {
    setResume({
      ...resume,
      experience: [...resume.experience, {
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: [''],
        technologies: []
      }]
    });
  };

  const removeExperience = (index) => {
    setResume({
      ...resume,
      experience: resume.experience.filter((_, i) => i !== index)
    });
  };

  const updateExperience = (index, field, value) => {
    const updated = [...resume.experience];
    updated[index] = { ...updated[index], [field]: value };
    setResume({ ...resume, experience: updated });
  };

  const addEducation = () => {
    setResume({
      ...resume,
      education: [...resume.education, {
        institution: '',
        degree: '',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: '',
        achievements: []
      }]
    });
  };

  const removeEducation = (index) => {
    setResume({
      ...resume,
      education: resume.education.filter((_, i) => i !== index)
    });
  };

  const updateEducation = (index, field, value) => {
    const updated = [...resume.education];
    updated[index] = { ...updated[index], [field]: value };
    setResume({ ...resume, education: updated });
  };

  const addProject = () => {
    setResume({
      ...resume,
      projects: [...resume.projects, {
        name: '',
        description: '',
        technologies: [],
        link: '',
        github: '',
        highlights: []
      }]
    });
  };

  const removeProject = (index) => {
    setResume({
      ...resume,
      projects: resume.projects.filter((_, i) => i !== index)
    });
  };

  const updateProject = (index, field, value) => {
    const updated = [...resume.projects];
    updated[index] = { ...updated[index], [field]: value };
    setResume({ ...resume, projects: updated });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/resumes')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
            <p className="text-gray-600">Create your professional resume with AI assistance</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLatexEditorSplit(true)}
            disabled={!id}
            title="LaTeX Editor with Live Preview"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            <FileCode className="w-4 h-4" />
            LaTeX Editor
          </button>
          <button
            onClick={() => setShowLatexEditor('export')}
            disabled={!id}
            title="Export to LaTeX"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4" />
            Export LaTeX
          </button>
          <button
            onClick={handleAnalyze}
            disabled={analyzing || !id}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            {analyzing ? 'Analyzing...' : 'AI Analyze'}
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* AI Suggestions */}
      {aiSuggestions && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">AI Suggestions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">Overall Score</div>
              <div className="text-3xl font-bold text-blue-600">{aiSuggestions.overallScore}/100</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">ATS Score</div>
              <div className="text-3xl font-bold text-green-600">{aiSuggestions.atsScore}/100</div>
            </div>
          </div>
          {aiSuggestions.improvements && aiSuggestions.improvements.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">Top Improvements</div>
              <ul className="space-y-2">
                {aiSuggestions.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-8">
        {/* Basic Info */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Resume Title"
              value={resume.title}
              onChange={(e) => setResume({ ...resume, title: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowTemplateSelector(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <Layout className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {getTemplateById(resume.template)?.name || 'Modern'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Click to choose from 15 templates
                  </div>
                </div>
              </div>
              <span className="text-2xl">{getTemplateById(resume.template)?.preview || '📱'}</span>
            </button>
          </div>
        </div>

        {/* Personal Info */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name *"
              value={resume.personalInfo.fullName}
              onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, fullName: e.target.value } })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Email *"
              value={resume.personalInfo.email}
              onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, email: e.target.value } })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={resume.personalInfo.phone}
              onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, phone: e.target.value } })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Location"
              value={resume.personalInfo.location}
              onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, location: e.target.value } })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="url"
              placeholder="LinkedIn URL"
              value={resume.personalInfo.linkedin}
              onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, linkedin: e.target.value } })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="url"
              placeholder="GitHub URL"
              value={resume.personalInfo.github}
              onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, github: e.target.value } })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <textarea
            placeholder="Professional Summary"
            value={resume.personalInfo.summary}
            onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, summary: e.target.value } })}
            rows={4}
            className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Experience */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Experience</h2>
            <button
              onClick={addExperience}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Experience
            </button>
          </div>
          {resume.experience.map((exp, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Experience {index + 1}</h3>
                <button
                  onClick={() => removeExperience(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Company *"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Position *"
                  value={exp.position}
                  onChange={(e) => updateExperience(index, 'position', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Start Date"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="End Date"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                  disabled={exp.current}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
              <label className="flex items-center gap-2 mt-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                  className="rounded"
                />
                Currently working here
              </label>
              <textarea
                placeholder="Description (one bullet point per line)"
                value={exp.description.join('\n')}
                onChange={(e) => updateExperience(index, 'description', e.target.value.split('\n'))}
                rows={4}
                className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>

        {/* Education */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Education</h2>
            <button
              onClick={addEducation}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Education
            </button>
          </div>
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Education {index + 1}</h3>
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Institution *"
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Degree *"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Field of Study"
                  value={edu.field}
                  onChange={(e) => updateEducation(index, 'field', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="GPA"
                  value={edu.gpa}
                  onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Projects</h2>
            <button
              onClick={addProject}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          </div>
          {resume.projects.map((proj, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Project {index + 1}</h3>
                <button
                  onClick={() => removeProject(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Project Name *"
                  value={proj.name}
                  onChange={(e) => updateProject(index, 'name', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Description"
                  value={proj.description}
                  onChange={(e) => updateProject(index, 'description', e.target.value)}
                  rows={3}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Technologies (comma separated)"
                  value={proj.technologies.join(', ')}
                  onChange={(e) => updateProject(index, 'technologies', e.target.value.split(',').map(s => s.trim()))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Technical Skills (comma separated)"
              value={resume.skills.technical.join(', ')}
              onChange={(e) => setResume({ ...resume, skills: { ...resume.skills, technical: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Frameworks (comma separated)"
              value={resume.skills.frameworks.join(', ')}
              onChange={(e) => setResume({ ...resume, skills: { ...resume.skills, frameworks: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Tools (comma separated)"
              value={resume.skills.tools.join(', ')}
              onChange={(e) => setResume({ ...resume, skills: { ...resume.skills, tools: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <TemplateSelector
          selectedTemplate={resume.template}
          onSelectTemplate={(templateId) => {
            setResume({ ...resume, template: templateId });
            setShowTemplateSelector(false);
          }}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}

      {/* Resume Preview Modal */}
      {showPreview && (
        <ResumePreview
          resume={resume}
          onClose={() => setShowPreview(false)}
        />
      )}

      {/* LaTeX Editor Modal */}
      {showLatexEditor && (
        <LatexEditor
          mode={showLatexEditor}
          resumeId={id}
          token={token}
          onClose={() => setShowLatexEditor(null)}
          onImport={(importedResume) => {
            navigate(`/resume-builder/${importedResume._id}`);
          }}
        />
      )}

      {/* LaTeX Editor with Split View */}
      {showLatexEditorSplit && (
        <LatexEditorSplit
          resumeData={resume}
          token={token}
          onClose={() => setShowLatexEditorSplit(false)}
          onSave={(updatedResume) => {
            setResume(updatedResume);
            setShowLatexEditorSplit(false);
          }}
        />
      )}
    </div>
  );
}
