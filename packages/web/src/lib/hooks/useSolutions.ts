'use client';
import { useState } from 'react';
import { api } from '../api';
import type { Solution } from '@ariscode/shared';

export function useSolutions() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ q: query });
      const data = await api.get<{ solutions: Solution[] }>(`/api/solutions?${params}`);
      setSolutions(data.solutions);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const clear = () => setSolutions([]);

  return { solutions, loading, error, search, clear };
}
