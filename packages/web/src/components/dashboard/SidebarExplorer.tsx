'use client';

import { useState } from 'react';

interface FolderItem {
  name: string;
  type: 'folder' | 'file';
  icon: string;
  status?: 'modified' | 'untracked';
  children?: FolderItem[];
}

const folderStructure: FolderItem[] = [
  {
    name: 'ARISCODE-WEBAPP',
    type: 'folder',
    icon: '📁',
    children: [
      {
        name: '.github',
        type: 'folder',
        icon: '📁',
        children: [],
      },
      {
        name: 'database',
        type: 'folder',
        icon: '🗄️',
        children: [],
      },
      {
        name: 'node_modules',
        type: 'folder',
        icon: '📦',
        children: [],
      },
      {
        name: 'packages',
        type: 'folder',
        icon: '📦',
        children: [
          { name: 'core', type: 'folder', icon: '📁' },
          { name: 'shared', type: 'folder', icon: '📁' },
          { name: 'web', type: 'folder', icon: '📁' },
        ],
      },
      {
        name: 'patterns',
        type: 'folder',
        icon: '🎨',
        children: [],
      },
      {
        name: 'scripts',
        type: 'folder',
        icon: '📄',
        children: [],
      },
      {
        name: '.gitignore',
        type: 'file',
        icon: '⚙️',
        status: 'modified',
      },
      {
        name: 'CLAUDE.md',
        type: 'file',
        icon: '📘',
      },
      {
        name: 'package.json',
        type: 'file',
        icon: '📦',
        status: 'modified',
      },
    ],
  },
];

interface TreeItemProps {
  item: FolderItem;
  level: number;
}

function TreeItem({ item, level }: TreeItemProps) {
  const [expanded, setExpanded] = useState(item.type === 'folder' && level === 0);

  const isExpandable = item.type === 'folder' && item.children && item.children.length > 0;

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-2 py-1 hover:bg-neutral-800/50 cursor-pointer rounded text-sm group transition ${
          item.status === 'modified' ? 'text-amber-600' : 'text-neutral-400'
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => isExpandable && setExpanded(!expanded)}
      >
        {isExpandable && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`flex-shrink-0 transition-transform text-neutral-500 ${expanded ? 'rotate-90' : ''}`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        )}
        {!isExpandable && <div className="w-3.5" />}
        <span>{item.icon}</span>
        <span className="truncate flex-1">{item.name}</span>
        {item.status === 'modified' && <span className="text-[10px] text-amber-600 opacity-70 font-medium">M</span>}
      </div>

      {expanded && isExpandable && item.children && (
        <div>
          {item.children.map((child, idx) => (
            <TreeItem key={`${child.name}-${idx}`} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SidebarExplorer() {
  return (
    <aside className="w-56 lg:w-64 flex-shrink-0 bg-neutral-900 flex flex-col overflow-hidden border-r border-neutral-800">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-400">
            <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2m-18 0h18" />
          </svg>
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Explorer</span>
        </div>
        <button className="p-1 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 rounded transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {folderStructure.map((item, idx) => (
          <TreeItem key={`${item.name}-${idx}`} item={item} level={0} />
        ))}
      </div>

      <div className="border-t border-neutral-800 px-4 py-3">
        <button className="w-full px-3 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded text-sm font-medium text-neutral-200 flex items-center justify-center gap-2 transition">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <span>Clonar Repositorio</span>
        </button>
      </div>
    </aside>
  );
}
