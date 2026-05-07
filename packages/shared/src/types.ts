// Pattern priorities
export enum PatternPriority {
  PERSONAL = 'PERSONAL',
  GITHUB = 'GITHUB',
  BASE = 'BASE',
}

// Solution sources
export enum SolutionSource {
  GITHUB_ISSUE = 'GITHUB_ISSUE',
  GITHUB_DISCUSSION = 'GITHUB_DISCUSSION',
  STACKOVERFLOW = 'STACKOVERFLOW',
  PERSONAL = 'PERSONAL',
}

// Sync status
export enum SyncStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

// Pattern entity
export interface Pattern {
  id: string;
  name: string;
  description: string;
  framework: string;
  language: string;
  category: string;
  template: string;
  config?: Record<string, unknown>;
  priority: PatternPriority;
  source?: string;
  gitHubUrl?: string;
  createdAt: number;
  updatedAt: number;
  userModified?: boolean;
  updateAvailable?: boolean;
}

// Template entity
export interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  variables: TemplateVariable[];
  createdAt: number;
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'boolean' | 'select' | 'multiselect';
  required: boolean;
  default?: unknown;
  options?: string[];
  description?: string;
}

// Generated file
export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

// Project entity
export interface Project {
  id: string;
  name: string;
  patternId: string;
  variables?: Record<string, unknown>;
  config?: Record<string, unknown>;
  generatedFiles?: GeneratedFile[];
  files?: GeneratedFile[];
  createdAt: number;
  updatedAt: number;
}

// Solution entity
export interface Solution {
  id: string;
  title: string;
  description: string;
  errorPattern?: string;
  error?: string;
  keywords?: string[];
  tags?: string[];
  code?: string;
  solution?: string;
  source: SolutionSource;
  sourceUrl?: string;
  gitHubUrl?: string;
  gitHubRepository?: string;
  priority?: PatternPriority;
  userModified?: boolean;
  createdAt: number;
  updatedAt: number;
}

// GitHub repository metadata
export interface GitHubRepository {
  id: string;
  name: string;
  url: string;
  stars: number;
  language: string;
  license?: string;
  lastActivity: number;
  qualityScore: number;
  lastSynced: number;
}

// Pattern score calculation
export interface PatternScore {
  stars: number;
  recency: number;
  maintenance: number;
  license: number;
  total: number;
}

// Generation config
export interface GenerationConfig {
  patternId: string;
  variables: Record<string, unknown>;
  outputPath?: string;
}

// Conversation entity
export interface Conversation {
  id: string;
  userId: string;
  title: string;
  description?: string;
  messages: ConversationMessage[];
  status: 'active' | 'archived';
  createdAt: number;
  updatedAt: number;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'system' | 'assistant';
  content: string;
  metadata?: {
    generatedProjectId?: string;
    templateUsed?: string;
  };
  createdAt: number;
}

// Session entity
export interface Session {
  id: string;
  userId: string;
  deviceId?: string;
  startedAt: number;
  lastActivityAt: number;
  expiresAt?: number;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
}

// Fix (used in solutions)
export interface Fix {
  title: string;
  code: string;
  explanation: string;
}

// Pattern version tracking
export interface PatternVersionInfo {
  id: string;
  currentVersion: string;
  userModified: boolean;
  lastModificationHash?: string;
  availableUpdate?: string;
}

// Sync result
export interface SyncResult {
  status: SyncStatus;
  patternsAdded: number;
  patternsUpdated: number;
  solutionsAdded: number;
  solutionsUpdated: number;
  lastSync: number;
  error?: string;
}
