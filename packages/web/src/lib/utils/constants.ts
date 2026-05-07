export const ROUTES = {
  HOME: '/',
  GENERATE: '/generate',
  TEMPLATES: '/templates',
  PROJECTS: '/projects',
  SOLUTIONS: '/solutions',
  CONVERSATIONS: '/conversations',
  SETTINGS: '/settings',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

export const API = {
  GENERATE: '/api/generate',
  PATTERNS: '/api/patterns',
  TEMPLATES: '/api/templates',
  PROJECTS: '/api/projects',
  SOLUTIONS: '/api/solutions',
  CONVERSATIONS: '/api/conversations',
  SESSIONS: '/api/sessions',
  SYNC: '/api/sync',
  INIT: '/api/init',
} as const;

export const GENERATION_TIMEOUT_MS = 500;
