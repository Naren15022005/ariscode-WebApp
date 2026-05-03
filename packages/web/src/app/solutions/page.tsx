import Link from 'next/link'

export default function SolutionsPage() {
  // TODO: Fetch solutions from core
  const solutions: any[] = []

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">Aris Code</Link>
          <div className="flex gap-4">
            <Link href="/templates" className="text-slate-700 hover:text-blue-600">Templates</Link>
            <Link href="/projects" className="text-slate-700 hover:text-blue-600">Projects</Link>
            <Link href="/solutions" className="text-slate-700 hover:text-blue-600">Solutions</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Error Solutions</h1>
          <p className="text-lg text-slate-600">Find solutions to common errors from our knowledge base</p>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Paste error message or search..."
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          {solutions.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <p className="text-slate-600">No solutions found. Try searching for an error message.</p>
            </div>
          ) : (
            solutions.map((solution) => (
              <div key={solution.id} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{solution.title}</h3>
                <p className="text-slate-600 mb-4">{solution.description}</p>
                {solution.code && (
                  <pre className="bg-slate-100 p-4 rounded-lg mb-4 overflow-x-auto text-sm">
                    <code>{solution.code}</code>
                  </pre>
                )}
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{solution.source}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
