'use client';
import { useState } from 'react';
import { toast, ToastContainer } from '../../components/common/Toast';

export default function SettingsPage() {
  const [githubToken, setGithubToken] = useState('');
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        toast(`Sync complete: ${data.patternsAdded ?? 0} patterns added`, 'success');
      } else {
        toast(data.error ?? 'Sync failed', 'error');
      }
    } catch {
      toast('Failed to connect to sync service', 'error');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <section className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">GitHub Sync</h2>
          <p className="text-sm text-slate-400 mb-4">
            Sync curated patterns and solutions from GitHub. Only repos with quality score &gt;70 are indexed.
          </p>
          <label className="block mb-4">
            <span className="text-sm text-slate-400">GitHub Token (optional — increases rate limit)</span>
            <input
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="ghp_…"
              className="mt-1 w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </label>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded font-semibold text-sm transition"
          >
            {syncing ? 'Syncing…' : 'Run Sync Now'}
          </button>
        </section>

        <section className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Database</h2>
          <p className="text-sm text-slate-400 mb-4">
            Current mode: <span className="text-yellow-400 font-mono">in-memory (development)</span>
          </p>
          <p className="text-xs text-slate-500">
            For production with persistent storage, install Visual Studio Build Tools and enable better-sqlite3.
          </p>
        </section>

        <section className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">About</h2>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between">
              <dt className="text-slate-400">Version</dt>
              <dd className="text-white font-mono">0.1.0-alpha</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Generation target</dt>
              <dd className="text-white font-mono">&lt;500ms</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Pattern source</dt>
              <dd className="text-white font-mono">Local SQLite + GitHub Sync</dd>
            </div>
          </dl>
        </section>
      </div>
      <ToastContainer />
    </main>
  );
}
