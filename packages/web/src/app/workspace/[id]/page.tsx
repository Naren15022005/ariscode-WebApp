'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FileTree from '../../../components/workspace/FileTree';
import CodeEditor from '../../../components/workspace/CodeEditor';
import Terminal from '../../../components/workspace/Terminal';
import AgentPanel from '../../../components/workspace/AgentPanel';

export interface WorkspaceFile {
  path: string;
  content: string;
  language: string;
  modified?: boolean;
}

export interface WorkspaceProject {
  id: string;
  name: string;
  files: WorkspaceFile[];
  templateId?: string;
}

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<WorkspaceProject | null>(null);
  const [activeFile, setActiveFile] = useState<WorkspaceFile | null>(null);
  const [openFiles, setOpenFiles] = useState<WorkspaceFile[]>([]);
  const [rightPanel, setRightPanel] = useState<'terminal' | 'agent'>('terminal');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadProject(); }, [projectId]);

  const loadProject = () => {
    try {
      const stored = localStorage.getItem(`project-${projectId}`);
      if (stored) {
        const data = JSON.parse(stored);
        const files: WorkspaceFile[] = (data.files || []).map((f: WorkspaceFile) => ({ ...f, modified: false }));
        const proj: WorkspaceProject = { id: projectId, name: data.name || 'Untitled', files, templateId: data.templateId };
        setProject(proj);
        if (files.length > 0) { setActiveFile(files[0]); setOpenFiles([files[0]]); }
      } else {
        const demo = makeDemoProject(projectId);
        setProject(demo);
        setActiveFile(demo.files[0]);
        setOpenFiles([demo.files[0]]);
      }
    } catch {
      const demo = makeDemoProject(projectId);
      setProject(demo);
      setActiveFile(demo.files[0]);
      setOpenFiles([demo.files[0]]);
    }
    setLoading(false);
  };

  const handleFileSelect = (file: WorkspaceFile) => {
    const projectFile = project?.files.find(f => f.path === file.path) ?? file;
    setActiveFile(projectFile);
    setOpenFiles(prev => prev.find(f => f.path === projectFile.path) ? prev : [...prev, projectFile]);
  };

  const handleFileChange = (content: string) => {
    if (!activeFile || !project) return;
    const updated = { ...activeFile, content, modified: true };
    setActiveFile(updated);
    const files = project.files.map(f => f.path === activeFile.path ? updated : f);
    const updatedProject = { ...project, files };
    setProject(updatedProject);
    setOpenFiles(prev => prev.map(f => f.path === activeFile.path ? updated : f));
    localStorage.setItem(`project-${projectId}`, JSON.stringify(updatedProject));
  };

  const handleCloseTab = (file: WorkspaceFile) => {
    const next = openFiles.filter(f => f.path !== file.path);
    setOpenFiles(next);
    if (activeFile?.path === file.path) setActiveFile(next[next.length - 1] ?? null);
  };

  const handleAgentApply = (changes: { path: string; content: string }[]) => {
    if (!project) return;
    const files = project.files.map(f => {
      const change = changes.find(c => c.path === f.path);
      return change ? { ...f, content: change.content, modified: true } : f;
    });
    const updatedProject = { ...project, files };
    setProject(updatedProject);
    if (activeFile) {
      const updated = files.find(f => f.path === activeFile.path);
      if (updated) setActiveFile(updated);
    }
    setOpenFiles(prev => prev.map(f => {
      const change = changes.find(c => c.path === f.path);
      return change ? { ...f, content: change.content, modified: true } : f;
    }));
    localStorage.setItem(`project-${projectId}`, JSON.stringify(updatedProject));
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen bg-neutral-900 items-center justify-center">
        <div className="text-neutral-500 text-sm animate-pulse">Loading workspace…</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-screen w-screen bg-neutral-900 items-center justify-center flex-col gap-4">
        <div className="text-neutral-400">Project not found</div>
        <button onClick={() => router.push('/dashboard')} className="text-purple-400 text-sm hover:underline">Back to Dashboard</button>
      </div>
    );
  }

  const modifiedCount = project.files.filter(f => f.modified).length;

  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-900 text-neutral-100 overflow-hidden">
      {/* TopBar */}
      <header className="flex items-center justify-between h-11 bg-neutral-900 border-b border-neutral-800 px-3 flex-shrink-0 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 p-1.5 rounded transition flex-shrink-0"
            title="Back to dashboard"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div className="w-6 h-6 bg-neutral-800 rounded flex items-center justify-center text-purple-400 flex-shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L4.09 12.97 9 14L11 22L19.91 11.03L15 10L13 2Z" />
            </svg>
          </div>
          <span className="text-xs text-neutral-600 hidden sm:inline">Aris Code</span>
          <span className="text-neutral-700 hidden sm:inline">/</span>
          <span className="text-sm font-medium text-white truncate max-w-48">{project.name}</span>
          {modifiedCount > 0 && (
            <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">
              {modifiedCount} unsaved
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(v => !v)}
            title="Toggle file tree"
            className={`p-1.5 rounded transition border ${sidebarOpen ? 'border-neutral-700 bg-neutral-800 text-neutral-300' : 'border-transparent text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300'}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" />
            </svg>
          </button>
          <button
            onClick={() => setRightPanel('terminal')}
            className={`px-2.5 py-1 rounded text-xs transition border ${rightPanel === 'terminal' ? 'border-neutral-700 bg-neutral-800 text-neutral-300' : 'border-transparent text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300'}`}
          >
            Terminal
          </button>
          <button
            onClick={() => setRightPanel('agent')}
            className={`px-2.5 py-1 rounded text-xs transition border flex items-center gap-1.5 ${rightPanel === 'agent' ? 'border-purple-500/40 bg-purple-500/10 text-purple-300' : 'border-transparent text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300'}`}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-purple-400">
              <path d="M13 2L4.09 12.97 9 14L11 22L19.91 11.03L15 10L13 2Z" />
            </svg>
            Agent
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <FileTree files={project.files} activeFile={activeFile} onSelect={handleFileSelect} />
        )}

        {/* Editor column */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center bg-neutral-950 border-b border-neutral-800 overflow-x-auto h-9 flex-shrink-0 scrollbar-none">
            {openFiles.map(f => (
              <div
                key={f.path}
                onClick={() => handleFileSelect(f)}
                className={`flex items-center gap-1.5 px-3 h-full border-r border-neutral-800 cursor-pointer flex-shrink-0 transition text-xs group ${
                  activeFile?.path === f.path
                    ? 'bg-neutral-900 text-white border-t-2 border-t-purple-500'
                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/50'
                }`}
              >
                {f.modified && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />}
                <span className="whitespace-nowrap">{f.path.split('/').pop()}</span>
                <button
                  onClick={e => { e.stopPropagation(); handleCloseTab(f); }}
                  className="ml-1 text-neutral-700 hover:text-neutral-400 p-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
            {openFiles.length === 0 && (
              <div className="px-3 text-neutral-700 text-xs h-full flex items-center">No files open</div>
            )}
          </div>

          {activeFile ? (
            <CodeEditor file={activeFile} onChange={handleFileChange} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-700 text-sm gap-2">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Select a file from the tree
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="w-72 xl:w-80 flex-shrink-0 flex flex-col border-l border-neutral-800 overflow-hidden">
          {rightPanel === 'terminal' ? (
            <Terminal projectName={project.name} />
          ) : (
            <AgentPanel project={project} activeFile={activeFile} onApply={handleAgentApply} />
          )}
        </div>
      </div>
    </div>
  );
}

function makeDemoProject(id: string): WorkspaceProject {
  return {
    id,
    name: 'Demo Project',
    files: [
      {
        path: 'src/product.service.ts',
        language: 'typescript',
        content: `import { Injectable } from '@nestjs/common';\nimport { PrismaService } from '../prisma/prisma.service';\nimport { CreateProductDto } from './dto/create-product.dto';\nimport { UpdateProductDto } from './dto/update-product.dto';\n\n@Injectable()\nexport class ProductService {\n  constructor(private readonly prisma: PrismaService) {}\n\n  async create(dto: CreateProductDto) {\n    return this.prisma.product.create({ data: dto });\n  }\n\n  async findAll() {\n    return this.prisma.product.findMany({\n      orderBy: { createdAt: 'desc' },\n    });\n  }\n\n  async findOne(id: string) {\n    return this.prisma.product.findUnique({ where: { id } });\n  }\n\n  async update(id: string, dto: UpdateProductDto) {\n    return this.prisma.product.update({ where: { id }, data: dto });\n  }\n\n  async remove(id: string) {\n    return this.prisma.product.delete({ where: { id } });\n  }\n}`,
      },
      {
        path: 'src/product.controller.ts',
        language: 'typescript',
        content: `import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';\nimport { ProductService } from './product.service';\nimport { CreateProductDto } from './dto/create-product.dto';\n\n@Controller('products')\nexport class ProductController {\n  constructor(private readonly productService: ProductService) {}\n\n  @Post()\n  create(@Body() dto: CreateProductDto) {\n    return this.productService.create(dto);\n  }\n\n  @Get()\n  findAll() {\n    return this.productService.findAll();\n  }\n\n  @Get(':id')\n  findOne(@Param('id') id: string) {\n    return this.productService.findOne(id);\n  }\n\n  @Delete(':id')\n  remove(@Param('id') id: string) {\n    return this.productService.remove(id);\n  }\n}`,
      },
      {
        path: 'src/product.module.ts',
        language: 'typescript',
        content: `import { Module } from '@nestjs/common';\nimport { ProductController } from './product.controller';\nimport { ProductService } from './product.service';\n\n@Module({\n  controllers: [ProductController],\n  providers: [ProductService],\n  exports: [ProductService],\n})\nexport class ProductModule {}`,
      },
    ],
  };
}
