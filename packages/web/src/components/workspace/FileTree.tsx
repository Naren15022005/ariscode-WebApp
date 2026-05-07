'use client';

import React, { useState } from 'react';
import type { WorkspaceFile } from '../../app/workspace/[id]/page';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'dir';
  children?: FileNode[];
  file?: WorkspaceFile;
}

function buildTree(files: WorkspaceFile[]): FileNode[] {
  const root: FileNode[] = [];
  for (const file of files) {
    const parts = file.path.split('/');
    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;
      let node = current.find(n => n.name === part);
      if (!node) {
        node = {
          name: part,
          path: parts.slice(0, i + 1).join('/'),
          type: isFile ? 'file' : 'dir',
          children: isFile ? undefined : [],
          file: isFile ? file : undefined,
        };
        current.push(node);
      }
      if (!isFile) current = node.children!;
    }
  }
  return root;
}

function getFileIcon(name: string): string {
  if (name.endsWith('.ts') || name.endsWith('.tsx')) return 'ts';
  if (name.endsWith('.js') || name.endsWith('.jsx')) return 'js';
  if (name.endsWith('.py')) return 'py';
  if (name.endsWith('.json')) return 'json';
  if (name.endsWith('.md')) return 'md';
  if (name.endsWith('.css')) return 'css';
  if (name.endsWith('.html')) return 'html';
  return 'file';
}

function FileIconEl({ name }: { name: string }) {
  const ext = getFileIcon(name);
  const colors: Record<string, string> = {
    ts: 'text-blue-400', tsx: 'text-cyan-400', js: 'text-yellow-400',
    py: 'text-green-400', json: 'text-amber-400', md: 'text-neutral-400',
    css: 'text-purple-400', html: 'text-orange-400', file: 'text-neutral-500',
  };
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`flex-shrink-0 ${colors[ext] ?? colors.file}`}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

interface TreeNodeProps {
  node: FileNode;
  depth: number;
  activeFile: WorkspaceFile | null;
  onSelect: (file: WorkspaceFile) => void;
}

function TreeNode({ node, depth, activeFile, onSelect }: TreeNodeProps) {
  const [open, setOpen] = useState(true);
  const isActive = node.type === 'file' && activeFile?.path === node.path;

  if (node.type === 'dir') {
    return (
      <div>
        <button
          onClick={() => setOpen(v => !v)}
          className="w-full flex items-center gap-1.5 px-2 py-1 text-xs text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 transition rounded"
          style={{ paddingLeft: `${8 + depth * 12}px` }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`flex-shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400 flex-shrink-0">
            {open
              ? <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              : <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            }
          </svg>
          <span className="truncate">{node.name}</span>
        </button>
        {open && node.children?.map(child => (
          <TreeNode key={child.path} node={child} depth={depth + 1} activeFile={activeFile} onSelect={onSelect} />
        ))}
      </div>
    );
  }

  return (
    <button
      onClick={() => node.file && onSelect(node.file)}
      className={`w-full flex items-center gap-1.5 px-2 py-1 text-xs rounded transition ${
        isActive
          ? 'bg-neutral-700 text-white'
          : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
      }`}
      style={{ paddingLeft: `${8 + depth * 12}px` }}
    >
      <FileIconEl name={node.name} />
      <span className="truncate">{node.name}</span>
    </button>
  );
}

interface FileTreeProps {
  files: WorkspaceFile[];
  activeFile: WorkspaceFile | null;
  onSelect: (file: WorkspaceFile) => void;
}

export default function FileTree({ files, activeFile, onSelect }: FileTreeProps) {
  const tree = buildTree(files);

  return (
    <aside className="w-52 flex-shrink-0 bg-neutral-900 border-r border-neutral-800 flex flex-col overflow-hidden">
      <div className="px-3 py-2 border-b border-neutral-800 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Files</span>
        <span className="text-[10px] text-neutral-700">{files.length} files</span>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {tree.map(node => (
          <TreeNode key={node.path} node={node} depth={0} activeFile={activeFile} onSelect={onSelect} />
        ))}
        {files.length === 0 && (
          <div className="px-3 py-4 text-center text-neutral-700 text-xs">No files</div>
        )}
      </div>
    </aside>
  );
}
