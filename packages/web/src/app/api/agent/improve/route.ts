import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type Instruction = 'try-catch' | 'jsdoc' | 'imports' | 'types' | 'all';

interface FileInput {
  path: string;
  content: string;
}

interface FileChange {
  path: string;
  before: string;
  after: string;
  linesChanged: number;
}

// Deterministic transformations — no LLM required

function addTryCatch(content: string): string {
  return content.replace(
    /(async\s+\w+\s*\([^)]*\)\s*(?::\s*\S+\s*)?\{)\n(\s+)(return\s+(?:this|await)\.\S+)/g,
    (_, sig, indent, ret) =>
      `${sig}\n${indent}try {\n${indent}  ${ret}\n${indent}} catch (error) {\n${indent}  throw new Error(\`Operation failed: \${String(error)}\`);\n${indent}}`,
  );
}

function addJsDocs(content: string): string {
  return content.replace(
    /(\n)(  )(async\s+(\w+)\s*\()/g,
    (_, nl, ind, asyncSig, name) => {
      const verb = name.startsWith('find') ? 'Retrieve' : name.startsWith('create') ? 'Create' : name.startsWith('update') ? 'Update' : name.startsWith('delete') || name.startsWith('remove') ? 'Delete' : 'Execute';
      return `${nl}${ind}/** ${verb} ${name.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}. */\n${ind}${asyncSig}`;
    },
  );
}

function sortImports(content: string): string {
  const lines = content.split('\n');
  const importBlock: string[] = [];
  const restLines: string[] = [];
  let inImports = true;

  for (const line of lines) {
    if (inImports && (line.startsWith('import ') || line === '')) {
      if (line.startsWith('import ')) importBlock.push(line);
      else if (importBlock.length > 0) { inImports = false; restLines.push(line); }
    } else {
      inImports = false;
      restLines.push(line);
    }
  }

  const sorted = [...importBlock].sort((a, b) => a.localeCompare(b));
  if (sorted.join('') === importBlock.join('')) return content;
  return [...sorted, '', ...restLines].join('\n').replace(/\n{3,}/g, '\n\n');
}

function addReturnTypes(content: string): string {
  return content.replace(
    /\b(async\s+(?:findAll|findOne|create|update|remove|delete)\s*\([^)]*\))\s*\{/g,
    (_, sig) => `${sig}: Promise<unknown> {`,
  );
}

function applyInstruction(content: string, instruction: Instruction): string {
  switch (instruction) {
    case 'try-catch': return addTryCatch(content);
    case 'jsdoc':     return addJsDocs(content);
    case 'imports':   return sortImports(content);
    case 'types':     return addReturnTypes(content);
    case 'all':       return addReturnTypes(addJsDocs(sortImports(addTryCatch(content))));
    default:          return content;
  }
}

function countChangedLines(before: string, after: string): number {
  const bLines = before.split('\n');
  const aLines = after.split('\n');
  let diff = 0;
  const len = Math.max(bLines.length, aLines.length);
  for (let i = 0; i < len; i++) {
    if (bLines[i] !== aLines[i]) diff++;
  }
  return diff;
}

export async function POST(request: NextRequest) {
  try {
    const { files, instruction } = await request.json() as { files: FileInput[]; instruction: Instruction };

    if (!Array.isArray(files) || !instruction) {
      return NextResponse.json({ error: 'files and instruction are required' }, { status: 400 });
    }

    const validInstructions: Instruction[] = ['try-catch', 'jsdoc', 'imports', 'types', 'all'];
    if (!validInstructions.includes(instruction)) {
      return NextResponse.json({ error: `Invalid instruction. Use one of: ${validInstructions.join(', ')}` }, { status: 400 });
    }

    const changes: FileChange[] = [];
    const results: FileInput[] = [];

    for (const file of files) {
      if (!/\.(ts|tsx|js|jsx)$/.test(file.path)) {
        results.push(file);
        continue;
      }
      const after = applyInstruction(file.content, instruction);
      if (after !== file.content) {
        changes.push({
          path: file.path,
          before: file.content,
          after,
          linesChanged: countChangedLines(file.content, after),
        });
      }
      results.push({ path: file.path, content: after });
    }

    return NextResponse.json({
      success: true,
      instruction,
      changes,
      files: results,
      summary: {
        filesModified: changes.length,
        totalLinesChanged: changes.reduce((acc, c) => acc + c.linesChanged, 0),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Improvement failed' }, { status: 500 });
  }
}
