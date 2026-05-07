import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface FileInput {
  path: string;
  content: string;
}

interface AnalysisResult {
  framework: string | null;
  language: string;
  patterns: string[];
  suggestions: string[];
  metrics: {
    totalLines: number;
    totalFiles: number;
    hasTests: boolean;
    hasTryCatch: boolean;
    hasJsDocs: boolean;
    importsOrdered: boolean;
    hasReturnTypes: boolean;
  };
}

function detectFramework(files: FileInput[]): string | null {
  const content = files.map(f => f.content).join('\n');
  if (content.includes('@nestjs/common') || content.includes('@Injectable')) return 'NestJS';
  if (content.includes('from \'react\'') || content.includes('from "react"')) return 'React';
  if (content.includes('from \'express\'') || content.includes('express()')) return 'Express';
  if (content.includes('from \'fastify\'')) return 'Fastify';
  if (content.includes('use Illuminate') || content.includes('<?php')) return 'Laravel';
  if (content.includes('from \'@angular')) return 'Angular';
  if (content.includes('from \'vue\'')) return 'Vue';
  return null;
}

function detectLanguage(files: FileInput[]): string {
  const exts = files.map(f => f.path.split('.').pop() ?? '');
  if (exts.some(e => e === 'tsx' || e === 'ts')) return 'TypeScript';
  if (exts.some(e => e === 'jsx' || e === 'js')) return 'JavaScript';
  if (exts.some(e => e === 'py')) return 'Python';
  if (exts.some(e => e === 'php')) return 'PHP';
  return 'Unknown';
}

function analyzeCode(files: FileInput[]): AnalysisResult {
  const allContent = files.map(f => f.content).join('\n');

  const hasTryCatch = allContent.includes('try {') || allContent.includes('try{');
  const hasJsDocs = allContent.includes('/**');
  const hasTests = files.some(f => f.path.includes('.spec.') || f.path.includes('.test.') || f.path.includes('__tests__'));
  const hasReturnTypes = /async\s+\w+\([^)]*\):\s*Promise/.test(allContent);

  const importLines = allContent.split('\n').filter(l => l.startsWith('import '));
  const importsOrdered = importLines.length < 2 || importLines.every((l, i) => i === 0 || l >= importLines[i - 1]);

  const patterns: string[] = [];
  if (allContent.includes('@Controller')) patterns.push('Controller pattern (NestJS)');
  if (allContent.includes('@Injectable')) patterns.push('Dependency injection');
  if (allContent.includes('findAll') && allContent.includes('findOne')) patterns.push('Repository pattern');
  if (allContent.includes('Create') && allContent.includes('Update') && allContent.includes('Delete')) patterns.push('CRUD operations');

  const suggestions: string[] = [];
  if (!hasTryCatch) suggestions.push('Agregar try-catch en métodos async para manejo de errores');
  if (!hasJsDocs) suggestions.push('Documentar métodos públicos con JSDoc');
  if (!importsOrdered) suggestions.push('Ordenar imports alfabéticamente');
  if (!hasReturnTypes) suggestions.push('Agregar tipos de retorno explícitos (Promise<T>)');
  if (!hasTests) suggestions.push('Crear archivos de test (.spec.ts)');
  if (suggestions.length === 0) suggestions.push('El código sigue las buenas prácticas. ¡Excelente trabajo!');

  return {
    framework: detectFramework(files),
    language: detectLanguage(files),
    patterns,
    suggestions,
    metrics: {
      totalLines: allContent.split('\n').length,
      totalFiles: files.length,
      hasTests,
      hasTryCatch,
      hasJsDocs,
      importsOrdered,
      hasReturnTypes,
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const { files } = await request.json();
    if (!Array.isArray(files)) return NextResponse.json({ error: 'files array required' }, { status: 400 });

    const analysis = analyzeCode(files as FileInput[]);
    return NextResponse.json({ success: true, analysis });
  } catch {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
