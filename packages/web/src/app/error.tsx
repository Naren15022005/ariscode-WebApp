'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-neutral-900">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
