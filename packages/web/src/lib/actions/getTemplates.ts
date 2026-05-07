'use server';
import { SqlitePatternRepository } from '@ariscode/core';

const repo = new SqlitePatternRepository();

export async function getTemplates() {
  return repo.findAll();
}
