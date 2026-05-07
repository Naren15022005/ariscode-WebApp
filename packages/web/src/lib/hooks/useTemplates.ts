'use client';
import { useState, useEffect } from 'react';
import { api } from '../api';
import type { Pattern } from '@ariscode/shared';

export function useTemplates() {
  const [templates, setTemplates] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<{ patterns: Pattern[] }>('/api/patterns')
      .then((data) => setTemplates(data.patterns))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { templates, loading, error };
}
