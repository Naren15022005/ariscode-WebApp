CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL DEFAULT 'local',
  name TEXT NOT NULL,
  template TEXT NOT NULL,
  config JSON NOT NULL DEFAULT '{}',
  generatedFiles JSON NOT NULL DEFAULT '[]',
  status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'generated', 'saved')),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  exportPath TEXT,
  FOREIGN KEY(template) REFERENCES templates(id)
);

CREATE INDEX IF NOT EXISTS idx_projects_userId ON projects(userId);
CREATE INDEX IF NOT EXISTS idx_projects_createdAt ON projects(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
