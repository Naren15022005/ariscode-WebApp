'use client';
import { useState, useEffect } from 'react';
import { api } from '../api';
import type { Conversation } from '@ariscode/shared';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => {
    setLoading(true);
    api.get<{ conversations: Conversation[] }>('/api/conversations')
      .then((data) => setConversations(data.conversations))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(refresh, []);

  const create = async (title: string) => {
    const data = await api.post<{ conversation: Conversation }>('/api/conversations', { title });
    refresh();
    return data.conversation;
  };

  return { conversations, loading, error, refresh, create };
}
