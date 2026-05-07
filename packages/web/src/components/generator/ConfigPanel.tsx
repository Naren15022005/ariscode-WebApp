'use client';

interface Props {
  variables: Record<string, unknown>;
  onChange: (vars: Record<string, unknown>) => void;
  schema?: Record<string, unknown>;
}

export function ConfigPanel({ variables, onChange, schema }: Props) {
  const properties = (schema as any)?.properties ?? {};
  const keys = Object.keys(properties);

  if (keys.length === 0) {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
        <p className="text-sm text-slate-400">No configuration needed for this template.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 space-y-4">
      <h3 className="text-sm font-semibold text-white">Configuration</h3>
      {keys.map((key) => {
        const field = properties[key] as any;
        const value = (variables[key] ?? field.default ?? '') as string;

        if (field.enum) {
          return (
            <label key={key} className="block">
              <span className="text-xs text-slate-400">{key}</span>
              <select
                className="mt-1 w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white"
                value={value}
                onChange={(e) => onChange({ ...variables, [key]: e.target.value })}
              >
                {field.enum.map((opt: string) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </label>
          );
        }

        if (field.type === 'boolean') {
          return (
            <label key={key} className="flex items-center gap-3">
              <input
                type="checkbox"
                className="rounded"
                checked={!!variables[key]}
                onChange={(e) => onChange({ ...variables, [key]: e.target.checked })}
              />
              <span className="text-sm text-slate-300">{field.description ?? key}</span>
            </label>
          );
        }

        return (
          <label key={key} className="block">
            <span className="text-xs text-slate-400">
              {key}{(schema as any)?.required?.includes(key) ? ' *' : ''}
            </span>
            <input
              type="text"
              className="mt-1 w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white placeholder-slate-500"
              placeholder={field.description ?? key}
              value={value}
              onChange={(e) => onChange({ ...variables, [key]: e.target.value })}
            />
          </label>
        );
      })}
    </div>
  );
}
