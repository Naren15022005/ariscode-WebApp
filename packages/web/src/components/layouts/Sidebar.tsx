import Link from 'next/link';

const ITEMS = [
  { href: '/generate', label: 'Generate', icon: '⚡' },
  { href: '/templates', label: 'Templates', icon: '📚' },
  { href: '/projects', label: 'Projects', icon: '📁' },
  { href: '/solutions', label: 'Solutions', icon: '🔧' },
  { href: '/conversations', label: 'Conversations', icon: '💬' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export function Sidebar() {
  return (
    <aside className="w-56 min-h-screen border-r border-slate-700 bg-slate-900 px-4 py-6 flex flex-col gap-1">
      <p className="text-xs font-semibold uppercase text-slate-500 px-3 mb-2">Menu</p>
      {ITEMS.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          <span>{icon}</span>
          {label}
        </Link>
      ))}
    </aside>
  );
}
