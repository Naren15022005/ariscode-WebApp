import Link from 'next/link';

const NAV = [
  { href: '/generate', label: 'Generate' },
  { href: '/templates', label: 'Templates' },
  { href: '/projects', label: 'Projects' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/conversations', label: 'Conversations' },
];

export function Header() {
  return (
    <header className="border-b border-slate-700 bg-slate-900 px-6 py-3">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white hover:text-blue-400 transition">
          Aris Code
        </Link>
        <nav className="flex items-center gap-6">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-slate-300 hover:text-white transition"
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/settings" className="text-sm text-slate-400 hover:text-white transition">
          Settings
        </Link>
      </div>
    </header>
  );
}
