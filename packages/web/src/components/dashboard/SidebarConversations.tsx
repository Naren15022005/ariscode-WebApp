'use client';

import { useState } from 'react';

const conversations: Record<string, string[]> = {
  Hoy: ['Auth JWT + NestJS', 'CRUD Productos Prisma'],
  Ayer: ['Dashboard React Tailwind', 'E-commerce microservices'],
  Antes: ['GraphQL API Gateway'],
};

const patterns = [
  { name: 'NestJS', count: 89, color: 'bg-green-500' },
  { name: 'Laravel', count: 67, color: 'bg-orange-500' },
  { name: 'React', count: 103, color: 'bg-cyan-400' },
  { name: 'FastAPI', count: 44, color: 'bg-purple-500' },
];

const footerLabels = ['Configuración', 'Estadísticas', 'AI Layer'];

export default function SidebarConversations() {
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [activePattern, setActivePattern] = useState<string | null>(null);

  return (
    <aside className="w-56 lg:w-64 flex-shrink-0 bg-neutral-900 flex flex-col overflow-hidden border-r border-neutral-800">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-400">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Conversaciones</span>
        </div>
        <button className="p-1 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 rounded transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-3 scrollbar-thin">
        <div className="px-3 mb-5">
          <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-2 px-2">
            Conversaciones
          </div>
          {Object.entries(conversations).map(([group, convs]) => (
            <div key={group}>
              <div className="text-[10px] text-neutral-600 mt-2 mb-0.5 px-2">{group}</div>
              {convs.map((conv) => (
                <button
                  key={conv}
                  onClick={() => setActiveConv(conv)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition text-sm ${
                    activeConv === conv
                      ? 'bg-neutral-800 text-neutral-100'
                      : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 text-neutral-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="truncate">{conv}</span>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="px-3">
          <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-2 px-2">
            Patterns
          </div>
          {patterns.map((p) => (
            <button
              key={p.name}
              onClick={() => setActivePattern(p.name)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition text-sm ${
                activePattern === p.name
                  ? 'bg-neutral-800 text-neutral-100'
                  : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
              }`}
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.color}`} />
              <span className="flex-1">{p.name}</span>
              <span className="text-neutral-600 text-xs tabular-nums">{p.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-800 px-3 py-2.5">
        {footerLabels.map((label) => (
          <button
            key={label}
            className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded text-left transition text-sm text-neutral-600 hover:text-neutral-300 hover:bg-neutral-800/50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>{label}</span>
          </button>
        ))}

        <button className="w-full mt-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-md text-sm text-neutral-200 flex items-center justify-center gap-2 transition">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Nueva conversación</span>
        </button>
      </div>
    </aside>
  );
}
