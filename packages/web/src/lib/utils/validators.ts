export function isValidPatternId(id: string): boolean {
  return /^[a-z0-9-]+$/.test(id) && id.length >= 2 && id.length <= 64;
}

export function isNonEmpty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateGenerationConfig(body: unknown): { patternId: string; variables: Record<string, unknown> } | null {
  if (!body || typeof body !== 'object') return null;
  const { patternId, variables } = body as Record<string, unknown>;
  if (!isNonEmpty(patternId)) return null;
  return { patternId: patternId as string, variables: (variables as Record<string, unknown>) ?? {} };
}
