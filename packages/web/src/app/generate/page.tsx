'use client'

import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { CodePreview } from '../../components/CodePreview'

interface GeneratedFile {
  path: string
  content: string
  language: string
}

export default function GeneratePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const patternId = searchParams.get('patternId')

  const [files, setFiles] = useState<GeneratedFile[]>([])
  const [loading, setLoading] = useState(false)
  const [variables, setVariables] = useState<Record<string, string>>({})

  const handleGenerate = async () => {
    if (!patternId) return

    try {
      setLoading(true)
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patternId, variables }),
      })

      const data = await res.json()
      if (data.success) {
        setFiles(data.files)
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Generation error:', error)
      alert('Failed to generate code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">Aris Code</Link>
          <div className="flex gap-4">
            <Link href="/templates" className="text-slate-700 hover:text-blue-600">Templates</Link>
            <Link href="/projects" className="text-slate-700 hover:text-blue-600">Projects</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Configuration</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Pattern ID</label>
                <input
                  type="text"
                  value={patternId || ''}
                  readOnly
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  placeholder="e.g., my-project"
                  value={variables.name || ''}
                  onChange={(e) => setVariables({ ...variables, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !patternId}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-semibold transition"
              >
                {loading ? 'Generating...' : 'Generate Code'}
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            {files.length > 0 ? (
              <div>
                <div className="mb-4 flex gap-2">
                  <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg transition">
                    Download
                  </button>
                  <button
                    onClick={() => router.push('/projects')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    Save Project
                  </button>
                </div>
                <CodePreview files={files} />
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                <p className="text-slate-600 mb-4">Generate code to see preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
