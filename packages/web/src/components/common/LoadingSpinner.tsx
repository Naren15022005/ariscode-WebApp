interface Props {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

export function LoadingSpinner({ size = 'md', label = 'Loading…' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-2" aria-label={label}>
      <div className={`${sizes[size]} animate-spin rounded-full border-2 border-slate-600 border-t-blue-500`} />
      {label && <span className="text-sm text-slate-400">{label}</span>}
    </div>
  );
}
