'use client';

import React, { useState, useRef, useEffect } from 'react';

interface TerminalLine {
  type: 'cmd' | 'out' | 'err' | 'info';
  text: string;
}

const SCRIPTS: Record<string, TerminalLine[]> = {
  'npm install': [
    { type: 'info', text: 'npm warn deprecated inflight@1.0.6' },
    { type: 'out', text: '' },
    { type: 'out', text: 'added 847 packages, and audited 848 packages in 12s' },
    { type: 'out', text: '' },
    { type: 'out', text: '3 packages are looking for funding' },
    { type: 'out', text: '  run `npm fund` for details' },
    { type: 'out', text: '' },
    { type: 'out', text: 'found 0 vulnerabilities' },
  ],
  'npm run dev': [
    { type: 'out', text: '' },
    { type: 'out', text: '> dev' },
    { type: 'out', text: '> next dev' },
    { type: 'out', text: '' },
    { type: 'info', text: '  ▲ Next.js 14.0.4' },
    { type: 'info', text: '  - Local:        http://localhost:3000' },
    { type: 'info', text: '  - Network:       http://192.168.1.1:3000' },
    { type: 'out', text: '' },
    { type: 'out', text: ' ✓ Ready in 2.1s' },
  ],
  'npm run build': [
    { type: 'out', text: '' },
    { type: 'out', text: '> build' },
    { type: 'out', text: '> next build' },
    { type: 'out', text: '' },
    { type: 'info', text: '  ▲ Next.js 14.0.4' },
    { type: 'out', text: '' },
    { type: 'out', text: '   Creating an optimized production build ...' },
    { type: 'out', text: ' ✓ Compiled successfully' },
    { type: 'out', text: ' ✓ Linting and checking validity of types' },
    { type: 'out', text: ' ✓ Collecting page data' },
    { type: 'out', text: ' ✓ Generating static pages (3/3)' },
    { type: 'out', text: '' },
    { type: 'out', text: 'Route (app)               Size     First Load JS' },
    { type: 'out', text: '┌ ○ /                     5.12 kB       87.4 kB' },
    { type: 'out', text: '└ ○ /products              3.8 kB        85.9 kB' },
    { type: 'out', text: '' },
    { type: 'out', text: '○  (Static)  prerendered as static content' },
  ],
  'npm test': [
    { type: 'out', text: '' },
    { type: 'out', text: '> test' },
    { type: 'out', text: '> jest' },
    { type: 'out', text: '' },
    { type: 'out', text: ' PASS  src/product.service.spec.ts' },
    { type: 'out', text: '  ProductService' },
    { type: 'out', text: '    ✓ should create a product (24ms)' },
    { type: 'out', text: '    ✓ should find all products (8ms)' },
    { type: 'out', text: '    ✓ should delete a product (5ms)' },
    { type: 'out', text: '' },
    { type: 'out', text: 'Test Suites: 1 passed, 1 total' },
    { type: 'out', text: 'Tests:       3 passed, 3 total' },
    { type: 'out', text: 'Time:        1.842s' },
  ],
  'git status': [
    { type: 'out', text: 'On branch main' },
    { type: 'out', text: 'Changes not staged for commit:' },
    { type: 'out', text: '  (use "git add <file>..." to update what will be committed)' },
    { type: 'out', text: '' },
    { type: 'info', text: '\tmodified:   src/product.service.ts' },
    { type: 'info', text: '\tmodified:   src/product.controller.ts' },
    { type: 'out', text: '' },
    { type: 'out', text: 'no changes added to commit (use "git add" and/or "git commit -a")' },
  ],
  'git add .': [],
  'git commit -m "feat: add CRUD"': [
    { type: 'out', text: '[main 3f2a1b4] feat: add CRUD' },
    { type: 'out', text: ' 2 files changed, 47 insertions(+)' },
  ],
  'ls': [
    { type: 'out', text: 'src/  package.json  tsconfig.json  README.md' },
  ],
  'ls src': [
    { type: 'out', text: 'product.controller.ts  product.module.ts  product.service.ts' },
  ],
  'clear': [],
  'help': [
    { type: 'info', text: 'Available commands:' },
    { type: 'out', text: '  npm install       Install dependencies' },
    { type: 'out', text: '  npm run dev       Start dev server' },
    { type: 'out', text: '  npm run build     Build for production' },
    { type: 'out', text: '  npm test          Run tests' },
    { type: 'out', text: '  git status        Show working tree status' },
    { type: 'out', text: '  git add .         Stage all changes' },
    { type: 'out', text: '  ls                List files' },
    { type: 'out', text: '  clear             Clear terminal' },
  ],
};

interface TerminalProps {
  projectName: string;
}

export default function Terminal({ projectName }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'info', text: `Aris Code Terminal — ${projectName}` },
    { type: 'info', text: 'Type "help" to see available commands.' },
    { type: 'out', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [running, setRunning] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const runCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setHistory(h => [trimmed, ...h.slice(0, 49)]);
    setHistoryIdx(-1);
    setLines(l => [...l, { type: 'cmd', text: `$ ${trimmed}` }]);
    setInput('');
    setRunning(true);

    await new Promise(r => setTimeout(r, 400 + Math.random() * 600));

    if (trimmed === 'clear') {
      setLines([{ type: 'info', text: `Aris Code Terminal — ${projectName}` }, { type: 'out', text: '' }]);
    } else {
      const output = SCRIPTS[trimmed];
      if (output !== undefined) {
        setLines(l => [...l, ...output]);
      } else {
        setLines(l => [...l, { type: 'err', text: `bash: ${trimmed}: command not found` }]);
      }
    }
    setRunning(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { runCommand(input); return; }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(next);
      setInput(history[next] ?? '');
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = historyIdx - 1;
      setHistoryIdx(next);
      setInput(next < 0 ? '' : (history[next] ?? ''));
    }
  };

  const lineColors: Record<string, string> = {
    cmd:  'text-white',
    out:  'text-neutral-400',
    err:  'text-red-400',
    info: 'text-green-400',
  };

  return (
    <div
      className="flex flex-col flex-1 bg-neutral-950 overflow-hidden font-mono text-[11px]"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-neutral-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 text-neutral-500">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
          </svg>
          <span className="text-[10px] uppercase tracking-wider">Terminal</span>
        </div>
        <button
          onClick={() => setLines([{ type: 'info', text: `Aris Code Terminal — ${projectName}` }, { type: 'out', text: '' }])}
          className="text-neutral-700 hover:text-neutral-400 text-[10px] transition"
        >
          Clear
        </button>
      </div>

      {/* Output */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {lines.map((line, i) => (
          <div key={i} className={`leading-5 whitespace-pre-wrap break-all ${lineColors[line.type]}`}>
            {line.text || ' '}
          </div>
        ))}
        {running && (
          <div className="text-neutral-600 animate-pulse">…</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick commands */}
      <div className="px-3 py-1.5 border-t border-neutral-800 flex gap-1.5 flex-wrap flex-shrink-0">
        {['npm install', 'npm run dev', 'npm test', 'git status'].map(cmd => (
          <button
            key={cmd}
            onClick={() => runCommand(cmd)}
            disabled={running}
            className="text-[10px] px-2 py-0.5 border border-neutral-800 hover:border-neutral-600 text-neutral-500 hover:text-neutral-300 rounded transition disabled:opacity-30"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-3 py-2 border-t border-neutral-800 flex items-center gap-2 flex-shrink-0">
        <span className="text-green-400 flex-shrink-0">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={running}
          placeholder="enter command…"
          className="flex-1 bg-transparent outline-none text-white placeholder-neutral-700 text-[11px]"
          autoFocus
        />
        {running && (
          <div className="w-3 h-3 border border-neutral-600 border-t-neutral-300 rounded-full animate-spin flex-shrink-0" />
        )}
      </div>
    </div>
  );
}
