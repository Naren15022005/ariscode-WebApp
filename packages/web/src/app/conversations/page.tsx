'use client';
import { useState } from 'react';
import { useConversations } from '../../lib/hooks/useConversations';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatRelative } from '../../lib/utils/formatters';

export default function ConversationsPage() {
  const { conversations, loading, error, create } = useConversations();
  const [title, setTitle] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setCreating(true);
    await create(title.trim());
    setTitle('');
    setCreating(false);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Conversations</h1>

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="New conversation title…"
            className="flex-1 bg-slate-800 border border-slate-600 rounded px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleCreate}
            disabled={creating || !title.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded font-semibold text-sm transition"
          >
            {creating ? 'Creating…' : '+ New'}
          </button>
        </div>

        {loading && <LoadingSpinner label="Loading conversations…" />}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && conversations.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p className="text-4xl mb-3">💬</p>
            <p>No conversations yet. Start one above.</p>
          </div>
        )}

        <div className="space-y-3">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white">{conv.title}</h3>
                  {conv.description && (
                    <p className="text-sm text-slate-400 mt-0.5">{conv.description}</p>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    conv.status === 'active'
                      ? 'bg-green-900 text-green-400'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {conv.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">{formatRelative(conv.updatedAt)}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
