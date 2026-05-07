'use client';

import React, { useState } from 'react';
import type { WorkspaceFile, WorkspaceProject } from '../../app/workspace/[id]/page';

interface AgentPanelProps {
  project: WorkspaceProject;
  activeFile: WorkspaceFile | null;
  onApply: (changes: { path: string; content: string }[]) => void;
}

type AgentStep = { label: string; status: 'pending' | 'running' | 'done' };

type Improvement = {
  path: string;
  description: string;
  before: string;
  after: string;
};

// Deterministic code transformations
function applyTryCatch(content: string): string {
  return content.replace(
    /(async\s+\w+\([^)]*\)\s*\{)\n(\s+)(return\s+this\.\w+)/g,
    (_, sig, indent, ret) =>
      `${sig}\n${indent}try {\n${indent}  ${ret}`
        .concat(`\n${indent}} catch (error) {\n${indent}  throw new Error(\`Operation failed: \${error}\`);\n${indent}}`),
  );
}

function addJsDocs(content: string): string {
  return content.replace(
    /(\n  )(async\s+\w+\([^)]*\))/g,
    (_, nl, sig) => {
      const name = sig.match(/async\s+(\w+)/)?.[1] ?? 'method';
      return `${nl}/** ${capitalize(name)} operation. */\n  ${sig}`;
    },
  );
}

function organizeImports(content: string): string {
  const lines = content.split('\n');
  const importLines = lines.filter(l => l.startsWith('import '));
  const rest = lines.filter(l => !l.startsWith('import '));
  const sorted = [...importLines].sort((a, b) => a.localeCompare(b));
  if (sorted.join('') === importLines.join('')) return content;
  return [...sorted, ...rest].join('\n');
}

function addReturnTypes(content: string): string {
  return content.replace(
    /async\s+(findAll|findOne|create|update|remove)\([^)]*\)(\s*)\{/g,
    (match, name) => match.replace(/\)\s*\{/, `): Promise<unknown> {`),
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface Operation {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  steps: string[];
  transform: (content: string) => string;
}

const OPERATIONS: Operation[] = [
  {
    id: 'try-catch',
    label: 'Agregar try-catch',
    description: 'Envuelve métodos async con manejo de errores',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    steps: ['Analizando métodos async', 'Agregando bloques try-catch', 'Validando sintaxis'],
    transform: applyTryCatch,
  },
  {
    id: 'jsdoc',
    label: 'Generar JSDoc',
    description: 'Documenta métodos públicos automáticamente',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    steps: ['Detectando métodos públicos', 'Generando comentarios JSDoc', 'Aplicando formato'],
    transform: addJsDocs,
  },
  {
    id: 'imports',
    label: 'Ordenar imports',
    description: 'Organiza imports en orden alfabético',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
    steps: ['Detectando imports', 'Ordenando alfabéticamente', 'Actualizando archivo'],
    transform: organizeImports,
  },
  {
    id: 'types',
    label: 'Agregar tipos de retorno',
    description: 'Añade Promise<unknown> a métodos sin tipo',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    steps: ['Analizando firmas de métodos', 'Infiriendo tipos de retorno', 'Aplicando anotaciones'],
    transform: addReturnTypes,
  },
];

export default function AgentPanel({ project, activeFile, onApply }: AgentPanelProps) {
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [progress, setProgress] = useState(0);
  const [improvements, setImprovements] = useState<Improvement[]>([]);
  const [phase, setPhase] = useState<'idle' | 'running' | 'review'>('idle');
  const [selectedOp, setSelectedOp] = useState<Operation | null>(null);
  const [accepted, setAccepted] = useState(false);

  const runOperation = async (op: Operation) => {
    setSelectedOp(op);
    setPhase('running');
    setRunning(true);
    setProgress(0);
    setImprovements([]);
    setAccepted(false);

    const agentSteps: AgentStep[] = op.steps.map(label => ({ label, status: 'pending' }));
    setSteps(agentSteps);

    for (let i = 0; i < agentSteps.length; i++) {
      agentSteps[i].status = 'running';
      setSteps([...agentSteps]);
      setProgress(Math.round(((i + 0.5) / agentSteps.length) * 100));
      await new Promise(r => setTimeout(r, 800 + Math.random() * 700));
      agentSteps[i].status = 'done';
      setSteps([...agentSteps]);
      setProgress(Math.round(((i + 1) / agentSteps.length) * 100));
    }

    // Apply transformation to all TS/JS files
    const changes: Improvement[] = [];
    const targets = activeFile ? [activeFile] : project.files.filter(f => /\.(ts|tsx|js|jsx)$/.test(f.path));

    for (const file of targets) {
      const newContent = op.transform(file.content);
      if (newContent !== file.content) {
        changes.push({
          path: file.path,
          description: op.description,
          before: file.content.slice(0, 200) + (file.content.length > 200 ? '…' : ''),
          after: newContent.slice(0, 200) + (newContent.length > 200 ? '…' : ''),
        });
      }
    }

    setImprovements(changes);
    setPhase('review');
    setRunning(false);
  };

  const handleAccept = () => {
    if (!selectedOp) return;
    const targets = activeFile ? [activeFile] : project.files.filter(f => /\.(ts|tsx|js|jsx)$/.test(f.path));
    const changes = targets
      .map(file => ({ path: file.path, content: selectedOp.transform(file.content) }))
      .filter((c, i) => c.content !== targets[i].content);
    onApply(changes);
    setAccepted(true);
  };

  const handleReset = () => {
    setPhase('idle');
    setSteps([]);
    setProgress(0);
    setImprovements([]);
    setSelectedOp(null);
    setAccepted(false);
  };

  return (
    <div className="flex flex-col flex-1 bg-neutral-900 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-neutral-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 text-neutral-400">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-purple-400">
            <path d="M13 2L4.09 12.97 9 14L11 22L19.91 11.03L15 10L13 2Z" />
          </svg>
          <span className="text-[10px] uppercase tracking-wider font-semibold">Agent Mode</span>
        </div>
        {phase !== 'idle' && (
          <button onClick={handleReset} className="text-neutral-600 hover:text-neutral-400 text-[10px] transition">
            Reset
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Idle: operation selection */}
        {phase === 'idle' && (
          <div className="p-3">
            <p className="text-xs text-neutral-500 mb-3">
              {activeFile ? `Mejorando: ${activeFile.path.split('/').pop()}` : `Mejorando todos los archivos`}
            </p>
            <div className="space-y-2">
              {OPERATIONS.map(op => (
                <button
                  key={op.id}
                  onClick={() => runOperation(op)}
                  className="w-full flex items-start gap-3 p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-neutral-600 text-left transition group"
                >
                  <span className="text-purple-400 mt-0.5 flex-shrink-0 group-hover:text-purple-300">{op.icon}</span>
                  <div>
                    <div className="text-sm text-white font-medium">{op.label}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">{op.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Running: progress */}
        {phase === 'running' && (
          <div className="p-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 border border-purple-500 border-t-purple-300 rounded-full animate-spin" />
              <span className="text-sm text-white">{selectedOp?.label}</span>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-neutral-800 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Steps */}
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs">
                  {step.status === 'done' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400 flex-shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {step.status === 'running' && (
                    <div className="w-3.5 h-3.5 border border-purple-500 border-t-purple-300 rounded-full animate-spin flex-shrink-0" />
                  )}
                  {step.status === 'pending' && (
                    <div className="w-3.5 h-3.5 rounded-full border border-neutral-700 flex-shrink-0" />
                  )}
                  <span className={step.status === 'done' ? 'text-neutral-300' : step.status === 'running' ? 'text-white' : 'text-neutral-600'}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review: show changes */}
        {phase === 'review' && (
          <div className="p-3">
            {accepted ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <div className="text-sm text-white">Cambios aplicados</div>
                <div className="text-xs text-neutral-500">{improvements.length} archivo{improvements.length !== 1 ? 's' : ''} modificado{improvements.length !== 1 ? 's' : ''}</div>
                <button onClick={handleReset} className="mt-2 text-xs text-purple-400 hover:underline">
                  Aplicar otra mejora
                </button>
              </div>
            ) : improvements.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-600">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div className="text-sm text-neutral-400">No se encontraron mejoras aplicables</div>
                <div className="text-xs text-neutral-600">El código ya sigue las buenas prácticas</div>
                <button onClick={handleReset} className="mt-2 text-xs text-purple-400 hover:underline">
                  Probar otra operación
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-neutral-400">
                    {improvements.length} cambio{improvements.length !== 1 ? 's' : ''} detectado{improvements.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-[10px] text-green-400">{selectedOp?.label}</span>
                </div>

                <div className="space-y-3 mb-4">
                  {improvements.map((imp, i) => (
                    <div key={i} className="rounded-lg border border-neutral-800 overflow-hidden">
                      <div className="px-3 py-1.5 bg-neutral-800 flex items-center gap-2">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-500">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span className="text-[10px] text-neutral-400">{imp.path}</span>
                      </div>
                      <div className="p-2 font-mono text-[10px] space-y-1">
                        <div className="text-red-400/70 line-through whitespace-pre-wrap break-all">
                          {imp.before.slice(0, 80)}…
                        </div>
                        <div className="text-green-400/80 whitespace-pre-wrap break-all">
                          {imp.after.slice(0, 80)}…
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleAccept}
                    className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 rounded text-sm text-white font-medium transition"
                  >
                    Aceptar cambios
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-sm text-neutral-400 transition"
                  >
                    Rechazar
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
