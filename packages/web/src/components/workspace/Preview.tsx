'use client';

import React, { useState, useEffect } from 'react';

interface PreviewProps {
  projectId: string;
  files?: Array<{ path: string; content: string }>;
}

export default function Preview({ projectId, files = [] }: PreviewProps) {
  const [iframeUrl, setIframeUrl] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // For MVP, generate a simple HTML preview
    if (files.length > 0) {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Preview</title>
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                margin: 0;
                padding: 20px;
                background: #f5f5f5;
              }
              .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              h1 { color: #333; margin: 0 0 10px 0; }
              .file { margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 3px solid #007bff; }
              .file-name { font-weight: bold; color: #007bff; font-size: 12px; margin-bottom: 10px; }
              code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-size: 13px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>📦 Generated Project Preview</h1>
              <p>Project ID: <code>${projectId}</code></p>
              <hr>
              ${files.map(f => `
                <div class="file">
                  <div class="file-name">📄 ${f.path}</div>
                  <pre style="margin: 0; overflow-x: auto;"><code>${escapeHtml(f.content.substring(0, 500))}</code></pre>
                </div>
              `).join('')}
              <p style="color: #666; font-size: 12px;">✓ Project loaded successfully</p>
            </div>
          </body>
        </html>
      `;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setIframeUrl(url);
      setIsRunning(true);
    }
  }, [projectId, files]);

  const escapeHtml = (text: string) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900">
      {/* Header */}
      <div className="px-4 py-2 border-b border-neutral-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">🔍 Preview</span>
          {isRunning && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
        </div>
        <button
          onClick={() => location.reload()}
          className="text-xs text-neutral-600 hover:text-neutral-300 px-2 py-1 rounded hover:bg-neutral-800"
        >
          Refresh
        </button>
      </div>

      {/* Preview Area */}
      {iframeUrl ? (
        <iframe
          src={iframeUrl}
          className="flex-1 border-none bg-white"
          title="Project Preview"
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-neutral-600">
          No preview available
        </div>
      )}
    </div>
  );
}
