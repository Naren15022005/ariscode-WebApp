// Database
export const DB_PATH = './ariscode.db';
export const DB_TIMEOUT = 5000;

// Generation
export const GENERATION_TIMEOUT = 500; // ms
export const TEMPLATE_EXTENSIONS = {
  ts: '.ts',
  js: '.js',
  tsx: '.tsx',
  jsx: '.jsx',
  json: '.json',
  yaml: '.yaml',
  yml: '.yml',
};

// Quality scoring
export const QUALITY_SCORE_THRESHOLD = 70;
export const QUALITY_WEIGHTS = {
  stars: 0.3,
  recency: 0.3,
  maintenance: 0.2,
  license: 0.2,
};

// GitHub sync
export const GITHUB_SYNC_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
export const AWESOME_LISTS = [
  'awesome-nestjs',
  'awesome-laravel',
  'awesome-react',
  'awesome-typescript',
  'awesome-nodejs',
  'awesome-go',
  'awesome-python',
];

export const PERMISSIVE_LICENSES = [
  'MIT',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'ISC',
];

// IPC channels (if using Electron in future)
export const IPC_CHANNELS = {
  GENERATE_PROJECT: 'generate:project',
  GET_TEMPLATES: 'get:templates',
  SEARCH_PATTERNS: 'search:patterns',
  SEARCH_SOLUTIONS: 'search:solutions',
  SAVE_PROJECT: 'save:project',
  SYNC_GITHUB: 'sync:github',
};

// Cache
export const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
