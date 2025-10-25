import { useState } from 'react';
import { Upload, FileJson, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '../utils/api';

export default function BulkPublishProblems() {
  const [file, setFile] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith('.json')) {
      setError('Please upload a JSON file');
      return;
    }

    setFile(uploadedFile);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (Array.isArray(json)) {
          setProblems(json);
          setError('');
        } else if (json.problems && Array.isArray(json.problems)) {
          setProblems(json.problems);
          setError('');
        } else {
          setError('JSON must be an array of problems or have a "problems" array');
        }
      } catch (err) {
        setError('Invalid JSON file: ' + err.message);
      }
    };
    
    reader.readAsText(uploadedFile);
  };

  const handleSubmit = async () => {
    if (problems.length === 0) {
      setError('No problems to upload');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { data } = await api.post('/problems/bulk-create', { problems });
      setResult(data);
      setProblems([]);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload problems');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        title: "Two Sum",
        statement: "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
        inputFormat: "First line: n (array size)\\nSecond line: n space-separated integers\\nThird line: target",
        outputFormat: "Two space-separated indices",
        constraints: "2 <= n <= 10^4\\n-10^9 <= nums[i] <= 10^9",
        samples: [
          {
            input: "4\\n2 7 11 15\\n9",
            output: "0 1",
            explanation: "nums[0] + nums[1] = 2 + 7 = 9"
          }
        ],
        hiddenTests: [
          {
            input: "3\\n3 2 4\\n6",
            output: "1 2"
          }
        ],
        timeLimitMs: 2000,
        memoryLimitMB: 256
      },
      {
        title: "Reverse String",
        statement: "Write a function that reverses a string.",
        inputFormat: "A single string",
        outputFormat: "The reversed string",
        constraints: "1 <= string length <= 10^5",
        samples: [
          {
            input: "hello",
            output: "olleh",
            explanation: "Reverse each character"
          }
        ],
        hiddenTests: [
          {
            input: "world",
            output: "dlrow"
          }
        ],
        timeLimitMs: 1000,
        memoryLimitMB: 128
      }
    ];

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'problems-template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bulk Publish Problems</h1>
        <p className="text-gray-600 mt-1">Upload multiple coding problems at once using a JSON file</p>
      </div>

      {/* Download Template */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900">Need a template?</h3>
            <p className="text-sm text-blue-700 mt-1">Download our JSON template to see the required format</p>
            <button
              onClick={downloadTemplate}
              className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Download Template
            </button>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <label className="block">
          <div className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
            <div className="text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700">
                {file ? file.name : 'Click to upload JSON file'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {problems.length > 0 ? `${problems.length} problems loaded` : 'JSON format required'}
              </p>
            </div>
          </div>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {problems.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Preview ({problems.length} problems)</h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {problems.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                  <FileJson className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium">{idx + 1}.</span>
                  <span>{p.title || 'Untitled'}</span>
                  <span className="text-gray-500 text-xs ml-auto">
                    {p.samples?.length || 0} samples, {p.hiddenTests?.length || 0} hidden
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {problems.length > 0 && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Upload className="w-5 h-5" />
            {loading ? 'Uploading...' : `Upload ${problems.length} Problems`}
          </button>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Results</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Success</span>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-2">{result.created}</p>
              <p className="text-sm text-green-600">Problems created</p>
            </div>

            {result.failed > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="w-5 h-5" />
                  <span className="font-semibold">Failed</span>
                </div>
                <p className="text-2xl font-bold text-red-900 mt-2">{result.failed}</p>
                <p className="text-sm text-red-600">Problems failed</p>
              </div>
            )}
          </div>

          {result.errors && result.errors.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Errors:</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {result.errors.map((err, idx) => (
                  <div key={idx} className="bg-red-50 border border-red-200 rounded p-3 text-sm">
                    <p className="font-medium text-red-900">Problem #{err.index + 1}: {err.title}</p>
                    <p className="text-red-700 text-xs mt-1">{err.error}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setResult(null);
              setProblems([]);
              setFile(null);
            }}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Upload More Problems
          </button>
        </div>
      )}

      {/* Format Guide */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">JSON Format Guide</h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Required fields:</strong> title, statement</p>
          <p><strong>Optional fields:</strong> inputFormat, outputFormat, constraints, samples, hiddenTests, timeLimitMs, memoryLimitMB</p>
          <p className="text-xs text-gray-500 mt-3">
            Example: <code className="bg-gray-100 px-2 py-1 rounded">{"[{\"title\": \"Problem 1\", \"statement\": \"...\", ...}]"}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
