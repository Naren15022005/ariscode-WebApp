import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// In-memory store per project (persists within server process)
const projectStore = new Map<string, { path: string; content: string; language: string }[]>();

function inferLanguage(path: string): string {
  if (path.endsWith('.ts') || path.endsWith('.tsx')) return 'typescript';
  if (path.endsWith('.js') || path.endsWith('.jsx')) return 'javascript';
  if (path.endsWith('.py')) return 'python';
  if (path.endsWith('.php')) return 'php';
  if (path.endsWith('.json')) return 'json';
  if (path.endsWith('.md')) return 'markdown';
  if (path.endsWith('.css')) return 'css';
  if (path.endsWith('.html')) return 'html';
  return 'text';
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const files = projectStore.get(id) ?? [];
  return NextResponse.json({ files, projectId: id });
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const { path, content } = await request.json();
    if (!path) return NextResponse.json({ error: 'path is required' }, { status: 400 });

    const files = projectStore.get(id) ?? [];
    const existing = files.findIndex(f => f.path === path);
    const file = { path, content: content ?? '', language: inferLanguage(path) };

    if (existing >= 0) {
      files[existing] = file;
    } else {
      files.push(file);
    }
    projectStore.set(id, files);
    return NextResponse.json({ success: true, file });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const { files } = await request.json();
    if (!Array.isArray(files)) return NextResponse.json({ error: 'files array required' }, { status: 400 });
    projectStore.set(id, files);
    return NextResponse.json({ success: true, count: files.length });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { searchParams } = request.nextUrl;
  const path = searchParams.get('path');
  if (!path) return NextResponse.json({ error: 'path query param required' }, { status: 400 });

  const files = (projectStore.get(id) ?? []).filter(f => f.path !== path);
  projectStore.set(id, files);
  return NextResponse.json({ success: true });
}
