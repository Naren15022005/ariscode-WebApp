interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  codePanelOpen: boolean;
  onToggleCodePanel: () => void;
  layoutView: 'compact' | 'split' | 'fullscreen' | 'mobile';
  onLayoutViewChange: (view: 'compact' | 'split' | 'fullscreen' | 'mobile') => void;
}

export default function TopBar({
  onToggleSidebar,
  onToggleCodePanel,
  codePanelOpen,
  layoutView,
  onLayoutViewChange
}: TopBarProps) {
  const layoutOptions: { id: 'compact' | 'split' | 'fullscreen' | 'mobile'; icon: string; title: string }[] = [
    {
      id: 'compact',
      title: 'Compact',
      icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>`
    },
    {
      id: 'split',
      title: 'Split',
      icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="8" height="18" />
        <rect x="13" y="3" width="8" height="18" />
        <line x1="11" y1="3" x2="11" y2="21" />
      </svg>`
    },
    {
      id: 'fullscreen',
      title: 'Fullscreen',
      icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" />
      </svg>`
    },
    {
      id: 'mobile',
      title: 'Mobile',
      icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12" y2="18.01" />
      </svg>`
    },
  ];

  return (
    <header className="flex items-center justify-between bg-neutral-900 h-12 border-b border-neutral-800 flex-shrink-0 px-3 gap-2">
      {/* Left */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 p-1.5 rounded transition flex-shrink-0"
          title="Toggle sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="w-7 h-7 bg-neutral-800 rounded-md flex items-center justify-center text-purple-400 flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L4.09 12.97 9 14L11 22L19.91 11.03L15 10L13 2Z" />
          </svg>
        </div>

        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-sm font-semibold text-white whitespace-nowrap">Aris Code</span>
          <span className="bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap">Beta v1.0</span>
          <span className="text-xs text-neutral-600 whitespace-nowrap hidden sm:inline">344 patterns</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          {layoutOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onLayoutViewChange(option.id)}
              className={`p-1 rounded transition ${
                layoutView === option.id
                  ? 'text-neutral-100'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title={option.title}
            >
              <div dangerouslySetInnerHTML={{ __html: option.icon }} />
            </button>
          ))}
        </div>

        <button
          onClick={onToggleCodePanel}
          className={`p-1 rounded transition ${
            codePanelOpen
              ? 'text-purple-300'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </button>

        <button className="text-neutral-500 hover:text-neutral-300 transition">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>

        <button className="text-neutral-500 hover:text-neutral-300 transition">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        <button className="text-neutral-500 hover:text-neutral-300 transition">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      </div>
    </header>
  );
}
