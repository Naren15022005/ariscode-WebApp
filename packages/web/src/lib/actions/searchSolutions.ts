'use server';
import { SqliteSolutionRepository } from '@ariscode/core';

const repo = new SqliteSolutionRepository();

export async function searchSolutions(query: string) {
  if (!query.trim()) return repo.findAll();
  return repo.search(query);
}
