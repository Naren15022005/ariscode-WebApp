'use client';

import { useState, useEffect, useRef } from 'react';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

const quickActions = [
  {
    label: 'CRUD',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    label: 'Auth',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    label: 'API REST',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    label: 'CLI Tool',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
  {
    label: 'Tests',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    label: 'UI Component',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
];

export default function MainArea() {
  const [input, setInput] = useState('');
  const [greeting] = useState(getGreeting);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleQuickAction = (label: string) => {
    setInput(label + ' ');
    inputRef.current?.focus();
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);

      // Map quick actions to template IDs
      const templateMap: Record<string, string> = {
        'CRUD': 'nestjs-crud',
        'Auth': 'hello-world',
        'API REST': 'express-api',
        'CLI Tool': 'hello-world',
        'Tests': 'hello-world',
        'UI Component': 'react-component',
      };

      let templateId = 'hello-world';
      for (const [key, id] of Object.entries(templateMap)) {
        if (input.includes(key)) {
          templateId = id;
          break;
        }
      }

      // Call API to generate project
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          projectName: input.trim(),
          variables: { moduleName: input.trim(), name: input.trim(), componentName: 'Component', resource: 'items', port: 3000 },
        }),
      });

      const data = await response.json();

      if (data.success && data.projectId) {
        // Save project to localStorage
        localStorage.setItem(`project-${data.projectId}`, JSON.stringify({
          id: data.projectId,
          name: input.trim(),
          files: data.files || [],
          templateId,
          config: {},
        }));

        // Redirect to workspace
        window.location.href = `/workspace/${data.projectId}`;
      } else {
        alert('Error: ' + (data.error || 'Failed to generate project'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 min-w-0 bg-neutral-900 flex flex-col items-center justify-center px-6 md:px-10 overflow-y-auto">
      <div className="flex flex-col items-center w-full max-w-xl -mt-10">
        {/* Icon */}
        <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center text-purple-400 mb-5 shadow-lg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L4.09 12.97 9 14L11 22L19.91 11.03L15 10L13 2Z" />
          </svg>
        </div>

        {/* Greeting */}
        <h1 className="text-2xl md:text-3xl font-medium text-neutral-300 mb-6 text-center tracking-tight select-none">
          {greeting},{' '}
          <span className="text-white font-bold">Usuario</span>
        </h1>

        {/* Input */}
        <div className="w-full mb-5">
          <div className="bg-neutral-800 border border-neutral-700/60 hover:border-neutral-600 focus-within:border-purple-500/50 rounded-lg px-4 py-3 flex items-center gap-3 transition-colors">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="What do you want to build?"
              className="flex-1 bg-transparent outline-none text-white placeholder-neutral-600 text-sm"
            />
            <div className="flex gap-1 flex-shrink-0">
              <button className="w-7 h-7 hover:bg-neutral-700 rounded flex items-center justify-center text-neutral-600 hover:text-neutral-400 transition">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || loading}
                className="w-7 h-7 hover:bg-neutral-700 rounded flex items-center justify-center text-neutral-600 hover:text-neutral-400 disabled:opacity-30 transition"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 justify-center">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => handleQuickAction(action.label)}
              className="border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800 rounded-full px-3.5 py-1.5 text-sm text-neutral-400 hover:text-neutral-200 flex items-center gap-2 transition-colors"
            >
              <span className="text-neutral-600">{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
