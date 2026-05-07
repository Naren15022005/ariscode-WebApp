'use client';

type SidebarView = 'explorer' | 'conversations';

interface SidebarNavProps {
  activeView: SidebarView;
  isOpen: boolean;
  onViewChange: (view: SidebarView) => void;
}

export default function SidebarNav({ activeView, isOpen, onViewChange }: SidebarNavProps) {
  const navItems: { id: SidebarView; label: string; icon: string }[] = [
    {
      id: 'explorer',
      label: 'Explorer',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2m-18 0h18" />
        <path d="M9 11l3 3 5-5" />
      </svg>`,
    },
    {
      id: 'conversations',
      label: 'Conversations',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>`,
    },
  ];

  return (
    <nav className="w-14 flex-shrink-0 bg-neutral-900 flex flex-col items-center py-3 gap-2 border-r border-neutral-800">
      {navItems.map((item) => {
        const isActive = activeView === item.id;
        const isItemOpen = isActive && isOpen;

        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`p-2.5 rounded transition-all duration-200 group relative ${
              isItemOpen
                ? 'bg-neutral-700 text-neutral-100 border-l-2 border-neutral-400'
                : isActive
                  ? 'bg-neutral-800 text-neutral-400 border-l-2 border-neutral-600'
                  : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800'
            }`}
            title={item.label}
          >
            <div dangerouslySetInnerHTML={{ __html: item.icon }} />
            <div className="absolute left-full ml-1.5 px-2 py-1 bg-neutral-800 text-xs text-neutral-200 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-50">
              {item.label} {isActive && !isOpen ? '(cerrado)' : ''}
            </div>
          </button>
        );
      })}
    </nav>
  );
}
