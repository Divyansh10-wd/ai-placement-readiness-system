import { useState } from 'react';
import api from '../utils/api';

export default function PublishProblem() {
  const [form, setForm] = useState({
    title: '',
    statement: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    publisherName: '',
    timeLimitMs: 2000,
    memoryLimitMB: 256,
  });
  const [samples, setSamples] = useState([{ input: '', output: '', explanation: '' }]);
  const [hiddenTests, setHiddenTests] = useState([{ input: '', output: '' }]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addSample = () => setSamples((s) => [...s, { input: '', output: '', explanation: '' }]);
  const addHidden = () => setHiddenTests((s) => [...s, { input: '', output: '' }]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/problems/create', {
        ...form,
        samples,
        hiddenTests,
      });
      setSuccess(`Problem created: ${data.title}`);
      setForm({ title: '', statement: '', inputFormat: '', outputFormat: '', constraints: '', publisherName: '', timeLimitMs: 2000, memoryLimitMB: 256 });
      setSamples([{ input: '', output: '', explanation: '' }]);
      setHiddenTests([{ input: '', output: '' }]);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create problem');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Publish Problem</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-700 text-sm">{success}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input className="border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={(e)=>setField('title', e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="Publisher Name" value={form.publisherName} onChange={(e)=>setField('publisherName', e.target.value)} />
        </div>
        <textarea className="w-full border rounded p-2" rows={6} placeholder="Problem Statement" value={form.statement} onChange={(e)=>setField('statement', e.target.value)} />
        <div className="grid md:grid-cols-2 gap-4">
          <textarea className="border rounded p-2" rows={3} placeholder="Input Format" value={form.inputFormat} onChange={(e)=>setField('inputFormat', e.target.value)} />
          <textarea className="border rounded p-2" rows={3} placeholder="Output Format" value={form.outputFormat} onChange={(e)=>setField('outputFormat', e.target.value)} />
        </div>
        <textarea className="w-full border rounded p-2" rows={3} placeholder="Constraints" value={form.constraints} onChange={(e)=>setField('constraints', e.target.value)} />

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Samples</label>
            <div className="space-y-2 mt-2">
              {samples.map((s, idx) => (
                <div key={idx} className="border rounded p-2 space-y-2 bg-white">
                  <textarea className="w-full border rounded p-2" rows={2} placeholder="Sample Input" value={s.input} onChange={(e)=>{
                    const v = e.target.value; setSamples((arr)=>arr.map((x,i)=> i===idx ? { ...x, input: v } : x));
                  }} />
                  <textarea className="w-full border rounded p-2" rows={2} placeholder="Sample Output" value={s.output} onChange={(e)=>{
                    const v = e.target.value; setSamples((arr)=>arr.map((x,i)=> i===idx ? { ...x, output: v } : x));
                  }} />
                  <input className="w-full border rounded px-3 py-2" placeholder="Explanation (optional)" value={s.explanation} onChange={(e)=>{
                    const v = e.target.value; setSamples((arr)=>arr.map((x,i)=> i===idx ? { ...x, explanation: v } : x));
                  }} />
                </div>
              ))}
              <button type="button" onClick={addSample} className="px-3 py-1.5 rounded bg-gray-800 text-white text-sm">Add Sample</button>
            </div>
          </div>
          <div>
            <label className="font-medium">Hidden Tests (kept server-side)</label>
            <div className="space-y-2 mt-2">
              {hiddenTests.map((s, idx) => (
                <div key={idx} className="border rounded p-2 space-y-2 bg-white">
                  <textarea className="w-full border rounded p-2" rows={2} placeholder="Hidden Input" value={s.input} onChange={(e)=>{
                    const v = e.target.value; setHiddenTests((arr)=>arr.map((x,i)=> i===idx ? { ...x, input: v } : x));
                  }} />
                  <textarea className="w-full border rounded p-2" rows={2} placeholder="Hidden Output" value={s.output} onChange={(e)=>{
                    const v = e.target.value; setHiddenTests((arr)=>arr.map((x,i)=> i===idx ? { ...x, output: v } : x));
                  }} />
                </div>
              ))}
              <button type="button" onClick={addHidden} className="px-3 py-1.5 rounded bg-gray-800 text-white text-sm">Add Hidden</button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input type="number" className="border rounded px-3 py-2" placeholder="Time Limit (ms)" value={form.timeLimitMs} onChange={(e)=>setField('timeLimitMs', Number(e.target.value))} />
          <input type="number" className="border rounded px-3 py-2" placeholder="Memory Limit (MB)" value={form.memoryLimitMB} onChange={(e)=>setField('memoryLimitMB', Number(e.target.value))} />
        </div>

        <button disabled={submitting} className="px-4 py-2 rounded bg-blue-600 text-white">
          {submitting ? 'Publishing...' : 'Publish Problem'}
        </button>
      </form>
    </div>
  );
}
