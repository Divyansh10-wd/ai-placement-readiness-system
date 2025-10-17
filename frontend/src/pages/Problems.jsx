import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Code, User, ArrowRight, Search } from 'lucide-react';
import api from '../utils/api';

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/problems/all');
        setProblems(data);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load problems');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = problems.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
  if (error) return <p className="text-red-600 text-center py-8">{error}</p>;

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coding Problems</h1>
          <p className="text-gray-600 mt-1">Practice and improve your coding skills</p>
        </div>
        <div className="text-sm text-gray-500">{problems.length} problems available</div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No problems found</p>
        ) : (
          filtered.map((p, idx) => (
            <div key={p._id} className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all card-hover">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono text-gray-500">#{idx + 1}</span>
                    <h3 className="font-semibold text-xl text-gray-900">{p.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{p.statement}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{p.publisherName || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Code className="w-4 h-4" />
                      <span>{p.timeLimitMs}ms / {p.memoryLimitMB}MB</span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/problems/${p._id}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg ml-4"
                >
                  Solve
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
