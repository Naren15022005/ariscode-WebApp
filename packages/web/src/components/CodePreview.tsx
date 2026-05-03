'use client'

import React from 'react'

interface CodePreviewProps {
  files: Array<{
    path: string
    content: string
    language: string
  }>
}

export function CodePreview({ files }: CodePreviewProps) {
  const [activeTab, setActiveTab] = React.useState(0)

  if (files.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
        <p className="text-slate-600">No code to preview</p>
      </div>
    )
  }

  const activeFile = files[activeTab]

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="border-b border-slate-200 flex overflow-x-auto">
        {files.map((file, idx) => (
          <button
            key={file.path}
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-3 font-mono text-sm whitespace-nowrap transition ${
              idx === activeTab
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            {file.path}
          </button>
        ))}
      </div>
      <pre className="p-4 overflow-x-auto bg-slate-900 text-slate-100">
        <code>{activeFile.content}</code>
      </pre>
    </div>
  )
}
