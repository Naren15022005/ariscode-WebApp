'use client'

import Link from 'next/link'
import { CodePreview } from '../../components/CodePreview'

export default function PreviewPage() {
  // TODO: Get generated files from query params or session
  const files: Array<{ path: string; content: string; language: string }> = []

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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Code Preview</h1>
            <p className="text-lg text-slate-600">Review and download generated code</p>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg transition">
              Download
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
              Save Project
            </button>
          </div>
        </div>

        {files.length > 0 ? (
          <CodePreview files={files} />
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <p className="text-slate-600 mb-4">No code generated yet</p>
            <Link href="/templates" className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
              Generate Code
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
