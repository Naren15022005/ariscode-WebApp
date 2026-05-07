'use client';
import { useState, useEffect } from 'react';
import { api } from '../api';
import type { Project } from '@ariscode/shared';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => {
    setLoading(true);
    api.get<{ projects: Project[] }>('/api/projects')
      .then((data) => setProjects(data.projects))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(refresh, []);

  const saveProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    await api.post('/api/projects', project);
    refresh();
  };

  return { projects, loading, error, refresh, saveProject };
}
