CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  framework TEXT,
  language TEXT DEFAULT 'typescript',
  version TEXT DEFAULT '1.0.0',
  source TEXT DEFAULT 'base' CHECK(source IN ('personal', 'github', 'base')),
  sourceUrl TEXT,
  priority INTEGER DEFAULT 3,
  files JSON NOT NULL DEFAULT '[]',
  configSchema JSON,
  userModified INTEGER DEFAULT 0,
  lastModificationHash TEXT,
  availableUpdate TEXT,
  deprecated INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id, version)
);

CREATE INDEX IF NOT EXISTS idx_templates_framework ON templates(framework);
CREATE INDEX IF NOT EXISTS idx_templates_language ON templates(language);
CREATE INDEX IF NOT EXISTS idx_templates_priority ON templates(priority);
CREATE INDEX IF NOT EXISTS idx_templates_deprecated ON templates(deprecated);
