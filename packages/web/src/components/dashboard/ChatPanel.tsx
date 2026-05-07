'use client';

import { useState, useRef, useEffect } from 'react';

const ALL_SESSIONS = [
  { id: 1, title: 'Auth JWT + NestJS', subtitle: 'nestjs-crud', time: '2 wks ago' },
  { id: 2, title: 'CRUD Productos Prisma', subtitle: null, time: '2 wks ago' },
  { id: 3, title: 'Dashboard React Tailwind', subtitle: null, time: '3 mos ago' },
  { id: 4, title: 'E-commerce microservices', subtitle: null, time: '3 mos ago' },
];

const MORE_SESSIONS = [
  { id: 5, title: 'Crear workspace para app Aris Code', subtitle: null, time: '5 mos ago' },
];

const MODELS = ['Auto', 'claude-opus-4', 'claude-sonnet-4-5', 'claude-haiku-4-5'];

interface ChatPanelProps {
  onClose: () => void;
}

export default function ChatPanel({ onClose }: ChatPanelProps) {
  const [tab, setTab] = useState<'aris' | 'chat'>('aris');
  const [input, setInput] = useState('');
  const [activeSession, setActiveSession] = useState<number | null>(null);
  const [moreExpanded, setMoreExpanded] = useState(false);

  // Toolbar states
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [model, setModel] = useState('Auto');
  const [layoutCols, setLayoutCols] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) {
        setModelOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setInput('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filtered = ALL_SESSIONS.filter(s =>
    !filterActive
      ? s.title.toLowerCase().includes(searchQuery.toLowerCase())
      : s.title.toLowerCase().includes(searchQuery.toLowerCase()) && s.subtitle
  );

  return (
    <aside className="w-64 flex-shrink-0 bg-[#161616] flex flex-col overflow-hidden border-l border-neutral-800">
      {/* Header tabs */}
      <div className="flex items-center justify-between px-3 pt-2 pb-0 border-b border-neutral-800 flex-shrink-0">
        <div className="flex items-end gap-0">
          {(['aris', 'chat'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-2 pb-2 text-[11px] font-bold tracking-wider uppercase transition border-b-2 ${
                tab === t
                  ? 'text-neutral-100 border-white'
                  : 'text-neutral-500 border-transparent hover:text-neutral-300'
              }`}
            >
              {t === 'aris' ? 'Aris Code' : 'Chat'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-0 pb-1">
          <button
            title="Nueva sesión"
            onClick={() => { setInput(''); textareaRef.current?.focus(); }}
            className="p-1.5 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 rounded transition"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            title="Configuración"
            className="p-1.5 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 rounded transition"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
          <button
            title="Más opciones"
            className="p-1.5 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 rounded transition"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
            </svg>
          </button>
          <button
            onClick={onClose}
            title="Cerrar"
            className="p-1.5 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 rounded transition"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sessions toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800 flex-shrink-0">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Sessions</span>
        <div className="flex items-center gap-0.5">
          <button
            title="Actualizar"
            onClick={handleRefresh}
            className="p-1 text-neutral-600 hover:text-neutral-300 hover:bg-neutral-800 rounded transition"
          >
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className={refreshing ? 'animate-spin' : ''}
              style={{ animationDuration: '0.6s' }}
            >
              <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.95" />
            </svg>
          </button>
          <button
            title="Buscar sesiones"
            onClick={() => { setSearchOpen(v => !v); if (searchOpen) setSearchQuery(''); }}
            className={`p-1 rounded transition ${searchOpen ? 'text-neutral-200 bg-neutral-700' : 'text-neutral-600 hover:text-neutral-300 hover:bg-neutral-800'}`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </button>
          <button
            title="Filtrar con subtítulo"
            onClick={() => setFilterActive(v => !v)}
            className={`p-1 rounded transition ${filterActive ? 'text-purple-400 bg-purple-900/30' : 'text-neutral-600 hover:text-neutral-300 hover:bg-neutral-800'}`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>
          <button
            title="Alternar vista"
            onClick={() => setLayoutCols(v => !v)}
            className={`p-1 rounded transition ${layoutCols ? 'text-neutral-200 bg-neutral-700' : 'text-neutral-600 hover:text-neutral-300 hover:bg-neutral-800'}`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="18" /><rect x="14" y="3" width="7" height="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="px-3 py-2 border-b border-neutral-800 flex-shrink-0">
          <input
            ref={searchRef}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar sesiones…"
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-200 placeholder-neutral-600 outline-none focus:border-neutral-500"
          />
        </div>
      )}

      {/* Session list */}
      <div className={`flex-1 overflow-y-auto py-1 ${layoutCols ? 'grid grid-cols-2 gap-1 px-2 py-2 content-start' : ''}`}>
        {filtered.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSession(s.id)}
            className={`text-left px-3 py-2 rounded transition ${
              layoutCols ? 'block' : 'w-full mx-0.5'
            } ${
              activeSession === s.id
                ? 'bg-neutral-800'
                : 'hover:bg-neutral-800/60'
            }`}
            style={layoutCols ? {} : { width: 'calc(100% - 4px)' }}
          >
            <div className={`flex items-start gap-2 ${layoutCols ? 'flex-col gap-1' : ''}`}>
              {!layoutCols && <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-neutral-600 flex-shrink-0" />}
              <div className="min-w-0">
                <div className="text-sm text-neutral-200 truncate leading-snug">{s.title}</div>
                {s.subtitle && <div className="text-xs text-neutral-500 truncate">{s.subtitle}</div>}
                <div className="text-[11px] text-neutral-600 mt-0.5">{s.time}</div>
              </div>
            </div>
          </button>
        ))}

        {filtered.length === 0 && searchQuery && (
          <div className="px-4 py-6 text-xs text-neutral-600 text-center">Sin resultados</div>
        )}

        {/* More section */}
        {!searchQuery && (
          <div className="mt-2">
            <button
              onClick={() => setMoreExpanded(v => !v)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest hover:text-neutral-300 transition"
            >
              <span>More</span>
              <span className="bg-neutral-700/80 text-neutral-400 rounded px-1.5 py-0.5 text-[10px] font-medium">
                {MORE_SESSIONS.length}
              </span>
            </button>
            {moreExpanded && MORE_SESSIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSession(s.id)}
                className={`w-full text-left px-3 py-2 rounded mx-0.5 transition ${
                  activeSession === s.id ? 'bg-neutral-800' : 'hover:bg-neutral-800/60'
                }`}
                style={{ width: 'calc(100% - 4px)' }}
              >
                <div className="flex items-start gap-2">
                  <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-neutral-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm text-neutral-200 truncate leading-snug">{s.title}</div>
                    <div className="text-[11px] text-neutral-600 mt-0.5">{s.time}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 px-3 pb-3 pt-2 border-t border-neutral-800">
        <div className="bg-neutral-800/80 border border-neutral-700/50 focus-within:border-neutral-500 rounded-xl overflow-hidden transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what to build"
            rows={3}
            className="w-full bg-transparent outline-none text-sm text-neutral-200 placeholder-neutral-600 px-3 pt-3 pb-1 resize-none leading-relaxed"
          />

          {/* Toolbar */}
          <div className="flex items-center justify-between px-2 pb-2 pt-1">
            <div className="flex items-center gap-0.5">
              {/* Attach */}
              <button
                title="Adjuntar archivo"
                className="p-1.5 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-700 rounded transition"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>

              {/* Model picker */}
              <div className="relative" ref={modelRef}>
                <button
                  onClick={() => setModelOpen(v => !v)}
                  className="flex items-center gap-1 px-2 py-1 text-[11px] text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700 rounded transition"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-purple-400">
                    <path d="M13 2L4.09 12.97 9 14L11 22L19.91 11.03L15 10L13 2Z" />
                  </svg>
                  <span>{model}</span>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {modelOpen && (
                  <div className="absolute bottom-full left-0 mb-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl py-1 min-w-[160px] z-50">
                    {MODELS.map((m) => (
                      <button
                        key={m}
                        onClick={() => { setModel(m); setModelOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs transition ${
                          model === m
                            ? 'text-purple-300 bg-purple-900/20'
                            : 'text-neutral-300 hover:bg-neutral-700'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sliders / options */}
              <button
                title="Opciones"
                className="p-1.5 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-700 rounded transition"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
              </button>
            </div>

            {/* Send */}
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              title="Enviar (Enter)"
              className={`p-1.5 rounded transition ${
                input.trim()
                  ? 'text-neutral-200 bg-neutral-600 hover:bg-neutral-500'
                  : 'text-neutral-600 opacity-40 cursor-not-allowed'
              }`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer badges */}
        <div className="flex items-center gap-2 mt-2">
          <button className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-300 transition">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span>Local</span>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <button className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-300 transition">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Default Approvals</span>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
