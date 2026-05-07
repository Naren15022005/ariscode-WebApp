'use client';
import { useTemplates } from '../../lib/hooks/useTemplates';
import { LoadingSpinner } from '../common/LoadingSpinner';
import type { Pattern } from '@ariscode/shared';

interface Props {
  selected: string | null;
  onSelect: (pattern: Pattern) => void;
}

export function TemplateSelector({ selected, onSelect }: Props) {
  const { templates, loading, error } = useTemplates();

  if (loading) return <LoadingSpinner label="Loading templates…" />;
  if (error) return <p className="text-red-400">Failed to load templates: {error}</p>;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t)}
          className={`text-left p-4 rounded-lg border transition ${
            selected === t.id
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-600 bg-slate-800 hover:border-slate-500'
          }`}
        >
          <h3 className="font-semibold text-white">{t.name}</h3>
          <p className="text-sm text-slate-400 mt-1">{t.description}</p>
          <div className="flex gap-2 mt-3">
            <span className="text-xs bg-slate-700 rounded px-2 py-0.5">{t.framework}</span>
            <span className="text-xs bg-slate-700 rounded px-2 py-0.5">{t.language}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
