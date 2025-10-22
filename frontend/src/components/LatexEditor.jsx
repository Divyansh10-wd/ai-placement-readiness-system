import { useState } from 'react';
import { X, Upload, Download, Eye, FileCode, AlertCircle, CheckCircle } from 'lucide-react';

export default function LatexEditor({ mode, onClose, onImport, resumeId, token }) {
  const [latexCode, setLatexCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewData, setPreviewData] = useState(null);

  // Sample LaTeX template
  const sampleLatex = `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage[hidelinks]{hyperref}

\\begin{document}

\\begin{center}
    \\textbf{\\Huge \\scshape John Doe} \\\\ \\vspace{1pt}
    \\small 123-456-7890 $|$ \\href{mailto:john@example.com}{john@example.com} $|$ 
    \\href{https://linkedin.com/in/johndoe}{LinkedIn} $|$
    \\href{https://github.com/johndoe}{GitHub}
\\end{center}

\\section{Summary}
Experienced software engineer with 5+ years in full-stack development, specializing in building scalable web applications and leading engineering teams.

\\section{Education}
  \\resumeSubheading
    {University of California}{Berkeley, CA}
    {Bachelor of Science in Computer Science}{Aug 2015 -- May 2019}

\\section{Experience}
  \\resumeSubheading
    {Tech Company Inc}{San Francisco, CA}
    {Senior Software Engineer}{Jan 2020 -- Present}
    \\resumeItem{Developed scalable web applications using React and Node.js}
    \\resumeItem{Led team of 5 engineers in agile development}
    \\resumeItem{Improved application performance by 40 percent}

  \\resumeSubheading
    {Startup XYZ}{Palo Alto, CA}
    {Software Engineer}{Jun 2019 -- Dec 2019}
    \\resumeItem{Built RESTful APIs using Express and MongoDB}
    \\resumeItem{Implemented authentication and authorization systems}

\\section{Projects}
  \\resumeProjectHeading
    {\\textbf{E-Commerce Platform}}{https://github.com/johndoe/ecommerce}
    \\resumeItem{Full-stack e-commerce application with payment integration}
    \\resumeItem{Technologies: React, Node.js, Stripe, PostgreSQL}

\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: JavaScript, Python, Java, C++} \\\\
     \\textbf{Frameworks}{: React, Node.js, Express, Django} \\\\
     \\textbf{Tools}{: Git, Docker, AWS, MongoDB}
    }}
 \\end{itemize}

\\end{document}`;

  const handleImport = async () => {
    if (!latexCode.trim()) {
      setError('Please enter LaTeX code');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('http://localhost:5000/api/resumes/import-latex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ latexCode })
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('Resume imported successfully!');
        setTimeout(() => {
          onImport(data.resume);
          onClose();
        }, 1500);
      } else {
        setError(data.message || 'Failed to import LaTeX');
      }
    } catch (err) {
      console.error('Import error:', err);
      setError('Failed to import LaTeX. Please check your code format.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    if (!latexCode.trim()) {
      setError('Please enter LaTeX code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/resumes/preview-latex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ latexCode })
      });

      const data = await res.json();

      if (data.success) {
        setPreviewData(data.resumeData);
        setSuccess('LaTeX parsed successfully! Review the preview below.');
      } else {
        setError(data.message || 'Failed to parse LaTeX');
      }
    } catch (err) {
      console.error('Preview error:', err);
      setError('Failed to parse LaTeX. Please check your code format.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`http://localhost:5000/api/resumes/${resumeId}/export-latex`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success) {
        setLatexCode(data.latexCode);
        setSuccess('Resume exported to LaTeX successfully!');
      } else {
        setError(data.message || 'Failed to export to LaTeX');
      }
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export to LaTeX');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([latexCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.tex';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSuccess('LaTeX file downloaded!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCode className="w-8 h-8 text-green-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {mode === 'import' ? 'Import from LaTeX' : 'Export to LaTeX'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {mode === 'import' 
                    ? 'Paste your LaTeX resume code below' 
                    : 'Download your resume as LaTeX code'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Alerts */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">Success</p>
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          )}

          {/* LaTeX Editor */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-900">
                LaTeX Code
              </label>
              {mode === 'import' && (
                <button
                  onClick={() => setLatexCode(sampleLatex)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Load Sample Template
                </button>
              )}
            </div>
            <textarea
              value={latexCode}
              onChange={(e) => setLatexCode(e.target.value)}
              placeholder={mode === 'import' ? 'Paste your LaTeX code here...' : 'Click "Export" to generate LaTeX code'}
              className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              readOnly={mode === 'export' && !latexCode}
            />
            <p className="mt-2 text-xs text-gray-500">
              {mode === 'import' 
                ? 'Supports standard LaTeX resume formats (moderncv, article with custom commands, etc.)'
                : 'Standard LaTeX format compatible with Overleaf and other LaTeX editors'}
            </p>
          </div>

          {/* Preview Data */}
          {previewData && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Preview Parsed Data</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {previewData.personalInfo.fullName || 'Not found'}</p>
                <p><strong>Email:</strong> {previewData.personalInfo.email || 'Not found'}</p>
                <p><strong>Experience Entries:</strong> {previewData.experience?.length || 0}</p>
                <p><strong>Education Entries:</strong> {previewData.education?.length || 0}</p>
                <p><strong>Projects:</strong> {previewData.projects?.length || 0}</p>
                <p><strong>Skills:</strong> {previewData.skills?.technical?.length || 0} technical skills found</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {mode === 'import' 
                ? 'Preview before importing to verify the data is parsed correctly'
                : 'Download the .tex file to use with LaTeX editors'}
            </div>
            <div className="flex items-center gap-3">
              {mode === 'import' ? (
                <>
                  <button
                    onClick={handlePreview}
                    disabled={loading || !latexCode.trim()}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={loading || !latexCode.trim()}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    <Upload className="w-4 h-4" />
                    {loading ? 'Importing...' : 'Import Resume'}
                  </button>
                </>
              ) : (
                <>
                  {!latexCode && (
                    <button
                      onClick={handleExport}
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
                    >
                      <FileCode className="w-4 h-4" />
                      {loading ? 'Exporting...' : 'Export to LaTeX'}
                    </button>
                  )}
                  {latexCode && (
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Download .tex File
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
