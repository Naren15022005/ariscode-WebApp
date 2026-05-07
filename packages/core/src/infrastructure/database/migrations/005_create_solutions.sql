CREATE TABLE IF NOT EXISTS solutions (
  id TEXT PRIMARY KEY,
  errorMessage TEXT NOT NULL,
  errorKeywords TEXT,
  cause TEXT,
  fixes JSON NOT NULL DEFAULT '[]',
  sourceUrl TEXT,
  framework TEXT,
  language TEXT,
  votes INTEGER DEFAULT 0,
  flaggedAsOutdated INTEGER DEFAULT 0,
  userModified INTEGER DEFAULT 0,
  source TEXT DEFAULT 'base' CHECK(source IN ('GITHUB_ISSUE', 'GITHUB_DISCUSSION', 'STACKOVERFLOW', 'PERSONAL', 'base')),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS solution_votes (
  id TEXT PRIMARY KEY,
  solutionId TEXT NOT NULL,
  userId TEXT NOT NULL,
  voteType TEXT CHECK(voteType IN ('up', 'down')),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(solutionId, userId),
  FOREIGN KEY(solutionId) REFERENCES solutions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_solutions_errorKeywords ON solutions(errorKeywords);
CREATE INDEX IF NOT EXISTS idx_solutions_framework ON solutions(framework);
CREATE INDEX IF NOT EXISTS idx_solutions_votes ON solutions(votes DESC);
