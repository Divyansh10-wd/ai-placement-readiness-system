import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/problems/all');
        const mine = user ? data.filter((p) => p.publisherName === user.name) : [];
        setProblems(mine);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load problems');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">My Published Problems</h1>
      {problems.length === 0 ? (
        <p className="text-sm text-gray-600">No problems yet. <Link to="/publish" className="text-blue-600">Publish one</Link>.</p>
      ) : (
        <ul className="space-y-2">
          {problems.map((p) => (
            <li key={p._id} className="p-4 bg-white border rounded">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-lg">{p.title}</h3>
                  <p className="text-sm text-gray-600">Published: {new Date(p.createdAt).toLocaleString()}</p>
                </div>
                <Link to={`/problems/${p._id}`} className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm">Open</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
