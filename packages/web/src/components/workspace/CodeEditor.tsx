'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { WorkspaceFile } from '../../app/workspace/[id]/page';

interface CodeEditorProps {
  file: WorkspaceFile;
  onChange: (content: string) => void;
}

type Token = { type: 'kw' | 'str' | 'cls' | 'dec' | 'cmt' | 'num' | 'txt'; value: string };

function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const keywords = new Set(['import', 'export', 'from', 'class', 'interface', 'type', 'const', 'let', 'var', 'function', 'async', 'await', 'return', 'if', 'else', 'for', 'while', 'new', 'this', 'extends', 'implements', 'private', 'public', 'protected', 'readonly', 'static', 'abstract', 'override', 'void', 'null', 'undefined', 'true', 'false', 'try', 'catch', 'throw', 'of', 'in', 'delete', 'typeof', 'instanceof', 'default', 'switch', 'case', 'break', 'continue', 'module', 'require']);

  while (i < line.length) {
    // Single-line comment
    if (line[i] === '/' && line[i + 1] === '/') {
      tokens.push({ type: 'cmt', value: line.slice(i) });
      break;
    }
    // Decorator
    if (line[i] === '@') {
      let j = i + 1;
      while (j < line.length && /\w/.test(line[j])) j++;
      tokens.push({ type: 'dec', value: line.slice(i, j) });
      i = j;
      continue;
    }
    // String (single quote)
    if (line[i] === "'") {
      let j = i + 1;
      while (j < line.length && line[j] !== "'") { if (line[j] === '\\') j++; j++; }
      tokens.push({ type: 'str', value: line.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    // String (double quote)
    if (line[i] === '"') {
      let j = i + 1;
      while (j < line.length && line[j] !== '"') { if (line[j] === '\\') j++; j++; }
      tokens.push({ type: 'str', value: line.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    // Template literal
    if (line[i] === '`') {
      let j = i + 1;
      while (j < line.length && line[j] !== '`') { if (line[j] === '\\') j++; j++; }
      tokens.push({ type: 'str', value: line.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    // Number
    if (/[0-9]/.test(line[i]) && (i === 0 || !/\w/.test(line[i - 1]))) {
      let j = i;
      while (j < line.length && /[0-9.]/.test(line[j])) j++;
      tokens.push({ type: 'num', value: line.slice(i, j) });
      i = j;
      continue;
    }
    // Word (keyword or identifier)
    if (/[a-zA-Z_$]/.test(line[i])) {
      let j = i;
      while (j < line.length && /\w/.test(line[j])) j++;
      const word = line.slice(i, j);
      if (keywords.has(word)) {
        tokens.push({ type: 'kw', value: word });
      } else if (/^[A-Z]/.test(word)) {
        tokens.push({ type: 'cls', value: word });
      } else {
        tokens.push({ type: 'txt', value: word });
      }
      i = j;
      continue;
    }
    // Plain text / punctuation
    const last = tokens[tokens.length - 1];
    if (last?.type === 'txt') {
      last.value += line[i];
    } else {
      tokens.push({ type: 'txt', value: line[i] });
    }
    i++;
  }
  return tokens;
}

const tokenColors: Record<string, string> = {
  kw:  'text-purple-400',
  str: 'text-green-400',
  cls: 'text-yellow-300',
  dec: 'text-blue-400',
  cmt: 'text-neutral-600 italic',
  num: 'text-orange-400',
  txt: 'text-neutral-300',
};

export default function CodeEditor({ file, onChange }: CodeEditorProps) {
  const [content, setContent] = useState(file.content);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setContent(file.content); }, [file.path, file.content]);

  const syncScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const newContent = content.slice(0, start) + '  ' + content.slice(end);
      setContent(newContent);
      onChange(newContent);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      });
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const lines = content.split('\n');

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-neutral-950 font-mono text-xs">
      {/* File path bar */}
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-neutral-800 flex-shrink-0">
        <div className="flex items-center gap-2 text-neutral-500">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
          </svg>
          <span>{file.path}</span>
          {file.modified && <span className="text-amber-400">●</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-neutral-700 text-[10px]">{lines.length} lines</span>
          <button
            onClick={handleCopy}
            className="text-neutral-600 hover:text-neutral-300 text-[10px] px-2 py-0.5 rounded hover:bg-neutral-800 transition"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Editor body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Line numbers */}
        <div
          ref={highlightRef}
          className="flex-shrink-0 w-10 overflow-hidden bg-neutral-950 border-r border-neutral-800 select-none"
          style={{ overflowY: 'hidden' }}
        >
          <div className="py-3">
            {lines.map((_, i) => (
              <div key={i} className="text-neutral-700 text-right pr-2 leading-6 text-[11px]">
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Syntax highlight layer */}
        <div className="absolute left-10 top-0 right-0 bottom-0 pointer-events-none overflow-auto" style={{ zIndex: 1 }}>
          <div className="py-3 px-3 leading-6 text-[12px] whitespace-pre">
            {lines.map((line, i) => (
              <div key={i} className="min-h-[1.5rem]">
                {tokenize(line).map((tok, j) => (
                  <span key={j} className={tokenColors[tok.type]}>{tok.value}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Actual textarea (transparent, on top) */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onScroll={syncScroll}
          spellCheck={false}
          className="flex-1 bg-transparent text-transparent caret-white resize-none outline-none py-3 px-3 leading-6 text-[12px] overflow-auto"
          style={{ zIndex: 2, position: 'relative', caretColor: '#e4e4e7', fontFamily: 'inherit' }}
        />
      </div>
    </div>
  );
}
