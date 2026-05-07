'use client';

import { useState, useEffect, useRef } from 'react';

// ─── Welcome Tab ─────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
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

function WelcomeTab() {
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
        if (input.includes(key)) { templateId = id; break; }
      }
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
        localStorage.setItem(`project-${data.projectId}`, JSON.stringify({
          id: data.projectId,
          name: input.trim(),
          files: data.files || [],
          templateId,
          config: {},
        }));
        window.location.href = `/workspace/${data.projectId}`;
      } else {
        alert('Error: ' + (data.error || 'Failed to generate project'));
      }
    } catch {
      alert('Error generating project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-0 bg-neutral-900 flex flex-col items-center justify-center px-6 md:px-10 overflow-y-auto">
      <div className="flex flex-col items-center w-full max-w-xl -mt-10">
        <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center text-purple-400 mb-5 shadow-lg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L4.09 12.97 9 14L11 22L19.91 11.03L15 10L13 2Z" />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl font-medium text-neutral-300 mb-6 text-center tracking-tight select-none">
          {greeting},{' '}
          <span className="text-white font-bold">Usuario</span>
        </h1>

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
    </div>
  );
}

// ─── Code View ────────────────────────────────────────────────────────────────

type Token = { t: string; v: string };

const codeFiles = [
  {
    name: 'product.service.ts',
    lines: [
      { raw: "import { Injectable } from '@nestjs/common';", tokens: [{ t: 'kw', v: 'import' }, { t: 'txt', v: ' { ' }, { t: 'id', v: 'Injectable' }, { t: 'txt', v: ' } ' }, { t: 'kw', v: 'from' }, { t: 'txt', v: ' ' }, { t: 'str', v: "'@nestjs/common'" }, { t: 'txt', v: ';' }] },
      { raw: "import { PrismaService } from '../prisma/prisma.service';", tokens: [{ t: 'kw', v: 'import' }, { t: 'txt', v: ' { ' }, { t: 'id', v: 'PrismaService' }, { t: 'txt', v: ' } ' }, { t: 'kw', v: 'from' }, { t: 'txt', v: ' ' }, { t: 'str', v: "'../prisma/prisma.service'" }, { t: 'txt', v: ';' }] },
      { raw: "import { CreateProductDto } from './dto/create-product.dto';", tokens: [{ t: 'kw', v: 'import' }, { t: 'txt', v: ' { ' }, { t: 'id', v: 'CreateProductDto' }, { t: 'txt', v: ' } ' }, { t: 'kw', v: 'from' }, { t: 'txt', v: ' ' }, { t: 'str', v: "'./dto/create-product.dto'" }, { t: 'txt', v: ';' }] },
      { raw: '', tokens: [] },
      { raw: '@Injectable()', tokens: [{ t: 'dec', v: '@Injectable' }, { t: 'txt', v: '()' }] },
      { raw: 'export class ProductService {', tokens: [{ t: 'kw', v: 'export' }, { t: 'txt', v: ' ' }, { t: 'kw', v: 'class' }, { t: 'txt', v: ' ' }, { t: 'cls', v: 'ProductService' }, { t: 'txt', v: ' {' }] },
      { raw: '  constructor(private readonly prisma: PrismaService) {}', tokens: [{ t: 'txt', v: '  constructor(' }, { t: 'kw', v: 'private' }, { t: 'txt', v: ' ' }, { t: 'kw', v: 'readonly' }, { t: 'txt', v: ' prisma: ' }, { t: 'cls', v: 'PrismaService' }, { t: 'txt', v: ') {}' }] },
      { raw: '', tokens: [] },
      { raw: '  async create(dto: CreateProductDto) {', tokens: [{ t: 'txt', v: '  ' }, { t: 'kw', v: 'async' }, { t: 'txt', v: ' create(dto: ' }, { t: 'cls', v: 'CreateProductDto' }, { t: 'txt', v: ') {' }] },
      { raw: "    return this.prisma.product.create({ data: dto });", tokens: [{ t: 'txt', v: '    ' }, { t: 'kw', v: 'return' }, { t: 'txt', v: ' this.prisma.product.create({ data: dto });' }] },
      { raw: '  }', tokens: [{ t: 'txt', v: '  }' }] },
      { raw: '', tokens: [] },
      { raw: '  async findAll() {', tokens: [{ t: 'txt', v: '  ' }, { t: 'kw', v: 'async' }, { t: 'txt', v: ' findAll() {' }] },
      { raw: '    return this.prisma.product.findMany({', tokens: [{ t: 'txt', v: '    ' }, { t: 'kw', v: 'return' }, { t: 'txt', v: ' this.prisma.product.findMany({' }] },
      { raw: "      orderBy: { createdAt: 'desc' },", tokens: [{ t: 'txt', v: '      orderBy: { createdAt: ' }, { t: 'str', v: "'desc'" }, { t: 'txt', v: ' },' }] },
    ],
  },
  {
    name: 'product.controller.ts',
    lines: [
      { raw: "import { Controller, Get, Post, Body } from '@nestjs/common';", tokens: [{ t: 'kw', v: 'import' }, { t: 'txt', v: ' { ' }, { t: 'id', v: 'Controller, Get, Post, Body' }, { t: 'txt', v: ' } ' }, { t: 'kw', v: 'from' }, { t: 'txt', v: ' ' }, { t: 'str', v: "'@nestjs/common'" }, { t: 'txt', v: ';' }] },
      { raw: "import { ProductService } from './product.service';", tokens: [{ t: 'kw', v: 'import' }, { t: 'txt', v: ' { ' }, { t: 'id', v: 'ProductService' }, { t: 'txt', v: ' } ' }, { t: 'kw', v: 'from' }, { t: 'txt', v: ' ' }, { t: 'str', v: "'./product.service'" }, { t: 'txt', v: ';' }] },
      { raw: '', tokens: [] },
      { raw: "@Controller('products')", tokens: [{ t: 'dec', v: '@Controller' }, { t: 'txt', v: '(' }, { t: 'str', v: "'products'" }, { t: 'txt', v: ')' }] },
      { raw: 'export class ProductController {', tokens: [{ t: 'kw', v: 'export' }, { t: 'txt', v: ' ' }, { t: 'kw', v: 'class' }, { t: 'txt', v: ' ' }, { t: 'cls', v: 'ProductController' }, { t: 'txt', v: ' {' }] },
    ],
  },
];

function renderToken(tok: Token, i: number) {
  const cls =
    tok.t === 'kw'  ? 'text-purple-400' :
    tok.t === 'str' ? 'text-green-400' :
    tok.t === 'cls' ? 'text-yellow-300' :
    tok.t === 'dec' ? 'text-blue-400' :
    tok.t === 'id'  ? 'text-cyan-300' :
    tok.t === 'cmt' ? 'text-neutral-600 italic' :
    'text-neutral-300';
  return <span key={i} className={cls}>{tok.v}</span>;
}

function CodeView({ file }: { file: typeof codeFiles[0] }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = file.lines.map(l => l.raw).join('\n');
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-neutral-900">
      <div className="px-4 py-2 flex justify-between items-center border-b border-neutral-800 flex-shrink-0">
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-600">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <span>{file.name}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-300 transition px-2 py-1 rounded hover:bg-neutral-800"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>{copied ? 'Copiado!' : 'Copiar'}</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto py-2 font-mono text-xs leading-relaxed bg-neutral-900">
        {file.lines.map((line, i) => (
          <div key={i} className="flex px-3 hover:bg-neutral-800/40 transition-colors min-h-[1.4rem]">
            <span className="text-neutral-700 w-7 text-right mr-4 flex-shrink-0 select-none pt-px text-[11px]">
              {i + 1}
            </span>
            <span className="flex-1 whitespace-pre">
              {line.tokens.map((tok, j) => renderToken(tok, j))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-neutral-900 text-neutral-700 select-none gap-3">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      <span className="text-sm">No hay archivos abiertos</span>
    </div>
  );
}

// ─── Tab Bar ─────────────────────────────────────────────────────────────────

type TabId = 'welcome' | number;

interface Tab {
  id: TabId;
  label: string;
  isWelcome?: boolean;
  fileIndex?: number;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CodePanel() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'welcome', label: 'Welcome', isWelcome: true },
    { id: 0, label: 'product.service.ts', fileIndex: 0 },
    { id: 1, label: 'product.controller.ts', fileIndex: 1 },
  ]);
  const [activeTab, setActiveTab] = useState<TabId | null>('welcome');

  const closeTab = (id: TabId, e: React.MouseEvent) => {
    e.stopPropagation();
    const idx = tabs.findIndex(t => t.id === id);
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTab === id) {
      const next = newTabs[idx] ?? newTabs[idx - 1] ?? null;
      setActiveTab(next?.id ?? null);
    }
  };

  const activeTabData = tabs.find(t => t.id === activeTab) ?? null;

  return (
    <div className="flex-1 min-w-0 flex flex-col bg-neutral-900 overflow-hidden border-l border-neutral-800">
      {/* Tab bar */}
      <div className="flex items-end bg-neutral-950/40 border-b border-neutral-800 overflow-x-auto scrollbar-none flex-shrink-0" style={{ minHeight: 36 }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <div
              key={String(tab.id)}
              onClick={() => setActiveTab(tab.id)}
              className={`group flex items-center gap-1.5 px-3 py-2 text-xs cursor-pointer border-b-2 flex-shrink-0 transition-colors ${
                isActive
                  ? 'text-neutral-100 border-neutral-300 bg-neutral-900'
                  : 'text-neutral-500 border-transparent hover:text-neutral-300 bg-neutral-950/40 hover:bg-neutral-900/60'
              }`}
            >
              {tab.isWelcome ? (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-purple-400 flex-shrink-0">
                  <path d="M13 2L4.09 12.97 9 14L11 22L19.91 11.03L15 10L13 2Z" />
                </svg>
              ) : (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400 flex-shrink-0">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              )}
              <span className="whitespace-nowrap">{tab.label}</span>
              <button
                onClick={(e) => closeTab(tab.id, e)}
                title="Cerrar"
                className={`rounded p-0.5 transition-all ml-0.5 flex-shrink-0 ${
                  isActive
                    ? 'opacity-40 hover:opacity-100 hover:bg-neutral-700 hover:text-neutral-200'
                    : 'opacity-0 group-hover:opacity-60 hover:opacity-100 hover:bg-neutral-700 hover:text-neutral-200'
                }`}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      {/* Content */}
      {tabs.length === 0 || !activeTabData ? (
        <EmptyState />
      ) : activeTabData.isWelcome ? (
        <WelcomeTab />
      ) : (
        <CodeView file={codeFiles[activeTabData.fileIndex ?? 0]} />
      )}
    </div>
  );
}
