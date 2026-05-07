'use client';

interface Props {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
}

export function GenerateButton({ onClick, loading, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition flex items-center gap-2"
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {loading ? 'Generating…' : '⚡ Generate'}
    </button>
  );
}
