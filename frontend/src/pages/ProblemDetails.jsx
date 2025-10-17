import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../utils/api';

const LANGUAGE_OPTIONS = [
  { id: 50, value: 'c', label: 'C (GCC 9.2.0)' },
  { id: 54, value: 'cpp', label: 'C++ (G++ 9.2.0)' },
  { id: 62, value: 'java', label: 'Java (OpenJDK 13.0.1)' },
  { id: 71, value: 'python', label: 'Python 3 (3.8.1)' },
];

const DEFAULT_SNIPPETS = {
  c: '#include <stdio.h>\nint main(){\n    // read input and print\n    printf("hello\\n");\n    return 0;\n}',
  cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    ios::sync_with_stdio(false);cin.tie(nullptr);\n    cout << "hello\\n";\n    return 0;\n}',
  java: 'import java.util.*;\npublic class Main{\n  public static void main(String[] args){\n    System.out.println("hello");\n  }\n}',
  python: 'print("hello")',
};

export default function ProblemDetails() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [language, setLanguage] = useState(LANGUAGE_OPTIONS[3]); // default Python
  const [code, setCode] = useState(DEFAULT_SNIPPETS.python);
  const [stdin, setStdin] = useState('');
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/problems/${id}`);
        setProblem(data);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load problem');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const editorLang = useMemo(() => {
    if (language.value === 'cpp') return 'cpp';
    if (language.value === 'c') return 'c';
    if (language.value === 'java') return 'java';
    return 'python';
  }, [language]);

  const onLanguageChange = (e) => {
    const selected = LANGUAGE_OPTIONS.find(l => String(l.id) === e.target.value);
    setLanguage(selected);
    setCode(DEFAULT_SNIPPETS[selected.value]);
  };

  const run = async () => {
    setSubmitting(true);
    setResult(null);
    setError('');
    try {
      const { data } = await api.post('/submissions', {
        sourceCode: code,
        languageId: language.id,
        stdin,
      });
      setResult(data.result);
    } catch (e) {
      setError(e.response?.data?.message || 'Execution failed');
    } finally {
      setSubmitting(false);
    }
  };

  const runTests = async () => {
    if (!problem.samples || problem.samples.length === 0) {
      setError('No test cases available');
      return;
    }
    setSubmitting(true);
    setResult(null);
    setError('');
    
    try {
      const testResults = [];
      for (let i = 0; i < problem.samples.length; i++) {
        const sample = problem.samples[i];
        const { data } = await api.post('/submissions', {
          sourceCode: code,
          languageId: language.id,
          stdin: sample.input,
        });
        
        const expectedOutput = sample.output.trim();
        const actualOutput = (data.result.stdout || '').trim();
        const passed = actualOutput === expectedOutput;
        
        testResults.push({
          testCase: i + 1,
          input: sample.input,
          expectedOutput,
          actualOutput,
          passed,
          status: data.result.status,
          time: data.result.time,
          memory: data.result.memory,
        });
      }
      
      const allPassed = testResults.every(t => t.passed);
      setResult({
        testResults,
        allPassed,
        verdict: allPassed ? 'All Tests Passed' : 'Some Tests Failed',
      });
    } catch (e) {
      setError(e.response?.data?.message || 'Test execution failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!problem) return <p>Problem not found</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{problem.title}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="p-4 bg-white border rounded">
            <h2 className="font-semibold mb-2">Problem Statement</h2>
            <p className="whitespace-pre-wrap text-sm text-gray-800">{problem.statement}</p>
          </div>
          {problem.constraints && (
            <div className="p-4 bg-white border rounded">
              <h3 className="font-semibold mb-2">Constraints</h3>
              <p className="whitespace-pre-wrap text-sm">{problem.constraints}</p>
            </div>
          )}
          {problem.samples?.length > 0 && (
            <div className="p-4 bg-white border rounded">
              <h3 className="font-semibold mb-2">Sample Tests</h3>
              <ul className="space-y-2 text-sm">
                {problem.samples.map((s, idx) => (
                  <li key={idx} className="border rounded p-2">
                    <div><span className="font-medium">Input:</span><pre className="whitespace-pre-wrap">{s.input}</pre></div>
                    <div><span className="font-medium">Output:</span><pre className="whitespace-pre-wrap">{s.output}</pre></div>
                    {s.explanation && <div><span className="font-medium">Explanation:</span> {s.explanation}</div>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <select className="border rounded px-2 py-1" value={language.id} onChange={onLanguageChange}>
              {LANGUAGE_OPTIONS.map((l) => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
            <button onClick={run} disabled={submitting} className="px-4 py-2 rounded-lg bg-gray-600 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-50">
              {submitting ? 'Running...' : 'Run Code'}
            </button>
            <button onClick={runTests} disabled={submitting} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50">
              {submitting ? 'Testing...' : 'Submit'}
            </button>
          </div>
          <div className="border rounded overflow-hidden">
            <Editor height="350px" language={editorLang} value={code} onChange={(val)=>setCode(val)} theme="vs-dark" options={{ fontSize: 14 }} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Custom Input</label>
            <textarea className="w-full border rounded p-2" rows={4} value={stdin} onChange={(e)=>setStdin(e.target.value)} />
          </div>
          {result && result.testResults ? (
            <div className="p-4 bg-white border rounded-lg text-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Verdict:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  result.allPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {result.verdict}
                </span>
              </div>
              <div className="space-y-2">
                {result.testResults.map((test, idx) => (
                  <div key={idx} className={`p-3 rounded border ${test.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Test Case {test.testCase}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        test.passed ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'
                      }`}>
                        {test.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div><span className="font-medium">Input:</span> <code className="bg-white px-1 py-0.5 rounded">{test.input}</code></div>
                      <div><span className="font-medium">Expected:</span> <code className="bg-white px-1 py-0.5 rounded">{test.expectedOutput}</code></div>
                      <div><span className="font-medium">Got:</span> <code className="bg-white px-1 py-0.5 rounded">{test.actualOutput}</code></div>
                      {test.time && <span className="text-gray-600">Time: {test.time}s</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : result && (
            <div className="p-4 bg-white border rounded-lg text-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  result.status?.id === 3 ? 'bg-green-100 text-green-800' :
                  result.status?.id === 4 ? 'bg-red-100 text-red-800' :
                  result.status?.id === 5 ? 'bg-yellow-100 text-yellow-800' :
                  result.status?.id === 6 ? 'bg-red-100 text-red-800' :
                  result.status?.id === 11 ? 'bg-red-100 text-red-800' :
                  result.status?.id === 12 ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {result.status?.description || 'Unknown'}
                </span>
                {result.time && <span className="text-gray-500">• {result.time}s</span>}
                {result.memory && <span className="text-gray-500">• {result.memory} KB</span>}
              </div>
              {result.stdout && (
                <div>
                  <div className="font-semibold text-gray-700 mb-1">Output</div>
                  <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded border text-gray-900">{result.stdout}</pre>
                </div>
              )}
              {result.stderr && (
                <div>
                  <div className="font-semibold text-red-700 mb-1">Error Output</div>
                  <pre className="whitespace-pre-wrap bg-red-50 p-3 rounded border border-red-200 text-red-900">{result.stderr}</pre>
                </div>
              )}
              {result.compile_output && (
                <div>
                  <div className="font-semibold text-red-700 mb-1">Compilation Error</div>
                  <pre className="whitespace-pre-wrap bg-red-50 p-3 rounded border border-red-200 text-red-900">{result.compile_output}</pre>
                </div>
              )}
              {result.message && (
                <div>
                  <div className="font-semibold text-gray-700 mb-1">Message</div>
                  <p className="text-gray-600">{result.message}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
