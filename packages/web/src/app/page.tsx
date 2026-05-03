import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Aris Code</h1>
          <p className="text-xl text-slate-300 mb-8">
            Pattern-based code generation — fast, deterministic, offline-first
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/templates">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition">
                Generate Code
              </button>
            </Link>
            <Link href="/templates">
              <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition">
                Browse Patterns
              </button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-slate-700 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-3">⚡ Lightning Fast</h3>
            <p className="text-slate-300">Generate modules in less than 500ms with zero AI inference</p>
          </div>
          <div className="bg-slate-700 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-3">🔒 Offline First</h3>
            <p className="text-slate-300">Your code stays on your machine. SQLite knowledge base, no cloud</p>
          </div>
          <div className="bg-slate-700 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-3">📚 Auto-Updated</h3>
            <p className="text-slate-300">Daily sync with GitHub curated patterns from 1000+ quality repos</p>
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-slate-400 text-sm">
            💡 Tip: Initialize the database by visiting <code className="bg-slate-800 px-2 py-1 rounded">/api/init</code> first time
          </p>
        </div>
      </div>
    </main>
  )
}
