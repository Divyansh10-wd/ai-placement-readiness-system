import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Upload, FileText, Sparkles, TrendingUp, AlertCircle, CheckCircle, Download, RefreshCw } from 'lucide-react';

export default function ResumeAnalysis() {
  const { token } = useAuth();
  const [inputMode, setInputMode] = useState('upload'); // 'upload' or 'paste'
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [improving, setImproving] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [improvement, setImprovement] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setError(null);
      
      // Read file content for text files
      if (uploadedFile.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (event) => {
          setResumeText(event.target.result);
        };
        reader.readAsText(uploadedFile);
      } else if (uploadedFile.type === 'application/pdf') {
        // PDF files will be sent directly to backend for parsing
        console.log('PDF file selected:', uploadedFile.name);
      }
    }
  };

  const handleTextChange = (e) => {
    setResumeText(e.target.value);
    setError(null);
  };

  const handleModeChange = (mode) => {
    setInputMode(mode);
    setFile(null);
    setResumeText('');
    setError(null);
  };

  const handleAnalyze = async () => {
    // Check if we have either a PDF file or resume text
    if (!file && !resumeText.trim()) {
      setError('Please upload a resume file or paste your resume text');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      let res, data;

      // Handle PDF file upload
      if (file && file.type === 'application/pdf') {
        const formData = new FormData();
        formData.append('file', file);

        res = await fetch('http://localhost:5000/api/resumes/analyze-pdf', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        data = await res.json();
        
        if (data.success) {
          setAnalysis(data.analysis);
          // Update resume text with extracted text from PDF
          if (data.extractedText) {
            setResumeText(data.extractedText);
          }
        } else {
          setError(data.message || 'Failed to analyze resume');
        }
      } 
      // Handle text input
      else if (resumeText.trim()) {
        res = await fetch('http://localhost:5000/api/resumes/analyze-text', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ resumeText })
        });

        data = await res.json();
        
        if (data.success) {
          setAnalysis(data.analysis);
        } else {
          setError(data.message || 'Failed to analyze resume');
        }
      }
    } catch (err) {
      console.error('Error analyzing resume:', err);
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleImprove = async () => {
    if (!resumeText.trim()) {
      setError('Please upload a resume or paste your resume text');
      return;
    }

    setImproving(true);
    setError(null);
    setImprovement(null);

    try {
      const res = await fetch('http://localhost:5000/api/resumes/improve-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          resumeText,
          analysisContext: analysis 
        })
      });

      const data = await res.json();
      
      if (data.success) {
        setImprovement(data.improvement);
      } else {
        setError(data.message || 'Failed to improve resume');
      }
    } catch (err) {
      console.error('Error improving resume:', err);
      setError('Failed to improve resume. Please try again.');
    } finally {
      setImproving(false);
    }
  };

  const downloadImprovedResume = () => {
    if (!improvement?.improvedText) return;

    const blob = new Blob([improvement.improvedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'improved-resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-10 h-10 text-purple-600" />
          <h1 className="text-4xl font-bold text-gray-900">AI Resume Analysis</h1>
        </div>
        <p className="text-lg text-gray-600">
          Powered by Groq AI - Get instant feedback and improvements for your resume
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Your Resume</h2>
        
        {/* Mode Selection Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => handleModeChange('upload')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              inputMode === 'upload'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload File
            </div>
          </button>
          <button
            onClick={() => handleModeChange('paste')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              inputMode === 'paste'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Paste Text
            </div>
          </button>
        </div>
        
        <div className="space-y-4">
          {/* File Upload */}
          {inputMode === 'upload' && (
            <div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  id="resume-upload"
                  accept=".txt,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <Upload className="w-12 h-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Supports TXT and PDF files (Max 5MB)
                    </p>
                  </div>
                </label>
              </div>
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> PDF must contain selectable text. Scanned PDFs or image-based PDFs won't work. 
                  If your PDF fails to parse, please use the "Paste Text" option instead.
                </p>
              </div>
            </div>
          )}

          {/* Text Area */}
          {inputMode === 'paste' && (
            <textarea
              value={resumeText}
              onChange={handleTextChange}
              placeholder="Paste your resume text here..."
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAnalyze}
              disabled={analyzing || (!file && !resumeText.trim())}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze Resume
                </>
              )}
            </button>

            <button
              onClick={handleImprove}
              disabled={improving || !resumeText.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {improving ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  Improve Resume
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-sm font-semibold text-gray-600 mb-2">Overall Score</div>
              <div className="text-4xl font-bold text-blue-600">{analysis.overallScore}/100</div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${analysis.overallScore}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-sm font-semibold text-gray-600 mb-2">ATS Score</div>
              <div className="text-4xl font-bold text-green-600">{analysis.atsScore}/100</div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${analysis.atsScore}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-sm font-semibold text-gray-600 mb-2">Impact Score</div>
              <div className="text-4xl font-bold text-purple-600">{analysis.impactScore}/100</div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${analysis.impactScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Strengths */}
          {analysis.strengths && analysis.strengths.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {analysis.strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {analysis.weaknesses && analysis.weaknesses.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {analysis.weaknesses.map((weakness, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-orange-600 font-bold mt-1">!</span>
                    <span className="text-gray-700">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Recommendations
              </h3>
              <ul className="space-y-3">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold mt-1">{i + 1}.</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Improvement Results */}
      {improvement && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Improved Resume</h2>
            </div>
            <button
              onClick={downloadImprovedResume}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>

          {/* Key Changes */}
          {improvement.keyChanges && improvement.keyChanges.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Key Improvements Made</h3>
              <ul className="space-y-2">
                {improvement.keyChanges.map((change, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">•</span>
                    <span className="text-gray-700">{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improved Text */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Improved Resume Text</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                {improvement.improvedText}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-lg">
            <FileText className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">How It Works</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">1.</span>
                <span>Choose to either upload your resume file or paste the text content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">2.</span>
                <span>Click "Analyze Resume" to get detailed feedback on strengths and weaknesses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">3.</span>
                <span>Click "Improve Resume" to get an AI-enhanced version with better formatting and content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">4.</span>
                <span>Download the improved version and use it for your job applications</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
