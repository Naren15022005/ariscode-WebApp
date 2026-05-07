'use client';
import { useState } from 'react';
import { api } from '../api';
import type { GeneratedFile } from '@ariscode/shared';

interface GenerateResult {
  files: GeneratedFile[];
  success: boolean;
}

export function useGenerator() {
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (patternId: string, variables: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.post<GenerateResult>('/api/generate', { patternId, variables });
      setFiles(result.files);
      return result.files;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Generation failed';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setFiles([]); setError(null); };

  return { files, loading, error, generate, reset };
}
