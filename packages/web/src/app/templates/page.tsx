'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Pattern {
  id: string
  name: string
  description: string
  framework: string
  language: string
  category: string
}

export default function TemplatesPage() {
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPatterns()
  }, [])

  useEffect(() => {
    if (search) {
      const timer = setTimeout(() => {
        fetchPatterns(search)
      }, 300)
      return () => clearTimeout(timer)
    }
    fetchPatterns()
    return undefined
  }, [search])

  const fetchPatterns = async (query = '') => {
    try {
      setLoading(true)
      const url = query ? `/api/patterns?q=${encodeURIComponent(query)}` : '/api/patterns'
      const res = await fetch(url)
      const data = await res.json()
      setPatterns(data)
    } catch (error) {
      console.error('Error fetching patterns:', error)
      setPatterns([])
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
            <Link href="/solutions" className="text-slate-700 hover:text-blue-600">Solutions</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Code Templates</h1>
          <p className="text-lg text-slate-600">Browse curated patterns for your framework</p>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading templates...</p>
          </div>
        ) : patterns.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-600">No templates available yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patterns.map((pattern) => (
              <div key={pattern.id} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{pattern.name}</h3>
                <p className="text-slate-600 mb-4">{pattern.description}</p>
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{pattern.framework}</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">{pattern.language}</span>
                </div>
                <Link href={`/generate?patternId=${pattern.id}`}>
                  <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                    Generate
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
