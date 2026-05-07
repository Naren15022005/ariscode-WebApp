import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Aris Code</h1>
          <p className="text-slate-400 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded font-semibold text-white transition">
            Sign In
          </button>
          <p className="text-center text-sm text-slate-400">
            No account?{' '}
            <Link href="/register" className="text-blue-400 hover:underline">
              Register
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">
          Authentication is optional — the app works fully offline without it.
        </p>
      </div>
    </main>
  );
}
