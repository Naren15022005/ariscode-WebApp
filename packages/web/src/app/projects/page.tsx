import Link from 'next/link'

export default function ProjectsPage() {
  // TODO: Fetch projects from core
  const projects: any[] = []

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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Projects</h1>
          <p className="text-lg text-slate-600">History of generated projects</p>
        </div>

        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <p className="text-slate-600 mb-4">No projects generated yet</p>
              <Link href="/templates" className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                Generate Your First Project
              </Link>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{project.name}</h3>
                    <p className="text-slate-600 text-sm">{new Date(project.createdAt).toLocaleString()}</p>
                  </div>
                  <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg transition">
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
