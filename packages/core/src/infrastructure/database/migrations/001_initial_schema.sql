-- Migration: 001_initial_schema.sql
-- Created: 2026-05-05
-- Description: Initial database schema for Aris Code

-- 1. Templates table
CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  framework TEXT,
  language TEXT,
  version TEXT DEFAULT '1.0.0',
  source TEXT DEFAULT 'base',
  templateContent TEXT NOT NULL,
  configSchema TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Projects table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  templateId TEXT NOT NULL,
  config TEXT NOT NULL,
  files TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(templateId) REFERENCES templates(id)
);

-- 3. Project files table
CREATE TABLE IF NOT EXISTS project_files (
  id TEXT PRIMARY KEY,
  projectId TEXT NOT NULL,
  path TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT,
  modifiedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(projectId) REFERENCES projects(id),
  UNIQUE(projectId, path)
);

-- 4. Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  title TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Conversation messages table
CREATE TABLE IF NOT EXISTS conversation_messages (
  id TEXT PRIMARY KEY,
  conversationId TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  generatedProjectId TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(conversationId) REFERENCES conversations(id),
  FOREIGN KEY(generatedProjectId) REFERENCES projects(id)
);

-- 6. Workspace sessions table
CREATE TABLE IF NOT EXISTS workspace_sessions (
  id TEXT PRIMARY KEY,
  projectId TEXT NOT NULL,
  startedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  lastActivityAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  gitStatus TEXT,
  agentRunning BOOLEAN DEFAULT 0,
  FOREIGN KEY(projectId) REFERENCES projects(id)
);

-- 7. Agent operations table
CREATE TABLE IF NOT EXISTS agent_operations (
  id TEXT PRIMARY KEY,
  projectId TEXT NOT NULL,
  instruction TEXT,
  status TEXT DEFAULT 'pending',
  changes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  completedAt DATETIME,
  FOREIGN KEY(projectId) REFERENCES projects(id)
);

-- 8. GitHub repositories table
CREATE TABLE IF NOT EXISTS github_repositories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  stars INTEGER DEFAULT 0,
  lastSync DATETIME,
  qualityScore REAL DEFAULT 0,
  patterns TEXT,
  solutions TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 9. Solutions table
CREATE TABLE IF NOT EXISTS solutions (
  id TEXT PRIMARY KEY,
  errorPattern TEXT NOT NULL,
  solution TEXT NOT NULL,
  framework TEXT,
  language TEXT,
  source TEXT DEFAULT 'github',
  votes INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_templateId ON projects(templateId);
CREATE INDEX IF NOT EXISTS idx_project_files_projectId ON project_files(projectId);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_conversationId ON conversation_messages(conversationId);
CREATE INDEX IF NOT EXISTS idx_workspace_sessions_projectId ON workspace_sessions(projectId);
CREATE INDEX IF NOT EXISTS idx_agent_operations_projectId ON agent_operations(projectId);
