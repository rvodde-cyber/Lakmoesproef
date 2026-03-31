import { useState, useEffect } from 'react';
import { Download, RefreshCw, LogOut } from 'lucide-react';
import { getAllResults, LakmoesScanResult } from '../lib/supabase';
import { signOutAdmin, onAuthStateChange, getCurrentUser } from '../lib/auth';
import { AdminLogin } from './AdminLogin';

export function AdminPanel() {
  const [results, setResults] = useState<LakmoesScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const loadResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllResults();
      setResults(data);
    } catch (err) {
      setError('Fout bij het laden van resultaten. Zorg dat je bent ingelogd.');
      console.error('Error loading results:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        if (currentUser) {
          loadResults();
        }
      } catch (err) {
        console.error('Error checking user:', err);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkUser();

    onAuthStateChange((newUser) => {
      setUser(newUser);
      if (newUser) {
        loadResults();
      }
    });
  }, []);

  const handleLogout = async () => {
    try {
      await signOutAdmin();
      setUser(null);
      setResults([]);
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  if (checkingAuth) {
    return (
      <div className="bg-slate-50 rounded-2xl p-8 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-600 mb-4" />
        <p className="text-slate-600">Controleren...</p>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLoginSuccess={() => setCheckingAuth(false)} />;
  }

  const exportToCSV = () => {
    if (results.length === 0) return;

    const headers = [
      'Datum/Tijd',
      'Sector',
      'Grootte',
      'Overall Score',
      ...results[0].filter_scores.map(f => f.filter_name)
    ];

    const rows = results.map(result => {
      const date = new Date(result.created_at || '').toLocaleString('nl-NL');
      const filterScores = result.filter_scores.map(f => f.avg_score.toFixed(2));

      return [
        date,
        result.sector,
        result.organization_size,
        result.overall_score.toFixed(1),
        ...filterScores
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `lakmoes_resultaten_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="bg-slate-50 rounded-2xl p-8 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-600 mb-4" />
        <p className="text-slate-600">Resultaten laden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl p-8 text-center border border-red-200">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadResults}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
        >
          Opnieuw proberen
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Admin Overzicht</h2>
          <p className="text-slate-600">{results.length} metingen verzameld</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Uitloggen
          </button>
          <button
            onClick={loadResults}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Ververs
          </button>
          <button
            onClick={exportToCSV}
            disabled={results.length === 0}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exporteer naar CSV
          </button>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <p className="text-slate-600">Nog geen resultaten verzameld</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm">Datum/Tijd</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm">Sector</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm">Grootte</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm">Score</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm">Filters</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm text-slate-700">
                    {new Date(result.created_at || '').toLocaleString('nl-NL')}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-700">{result.sector}</td>
                  <td className="py-3 px-4 text-sm text-slate-700">{result.organization_size}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-purple-700">
                    {result.overall_score.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4">
                    <details className="text-sm text-slate-600 cursor-pointer">
                      <summary className="font-medium text-purple-600 hover:text-purple-700">
                        Bekijk details
                      </summary>
                      <div className="mt-2 space-y-1 pl-4">
                        {result.filter_scores.map((filter) => (
                          <div key={filter.filter_id} className="flex justify-between">
                            <span className="text-slate-600">{filter.filter_name}:</span>
                            <span className="font-medium text-slate-900">{filter.avg_score.toFixed(1)}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
