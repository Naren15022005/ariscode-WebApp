CREATE TABLE IF NOT EXISTS github_repositories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner TEXT NOT NULL,
  name TEXT NOT NULL,
  fullName TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  stars INTEGER DEFAULT 0,
  language TEXT,
  topics TEXT,
  license TEXT,
  isPermissive INTEGER DEFAULT 0,
  score REAL DEFAULT 0,
  lastCommitDate DATETIME,
  daysSinceLastCommit INTEGER,
  issueClosureRate REAL,
  prMergeRate REAL,
  hasTests INTEGER DEFAULT 0,
  testCoverage REAL,
  lastScrapedAt DATETIME,
  nextSyncAt DATETIME,
  UNIQUE(fullName)
);

CREATE TABLE IF NOT EXISTS sync_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  syncStartedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  syncEndedAt DATETIME,
  status TEXT CHECK(status IN ('running', 'success', 'failed')),
  reposProcessed INTEGER DEFAULT 0,
  patternsAdded INTEGER DEFAULT 0,
  patternsUpdated INTEGER DEFAULT 0,
  solutionsAdded INTEGER DEFAULT 0,
  errorMessage TEXT,
  UNIQUE(syncStartedAt)
);

CREATE INDEX IF NOT EXISTS idx_repos_score ON github_repositories(score DESC);
CREATE INDEX IF NOT EXISTS idx_repos_lastScrapedAt ON github_repositories(lastScrapedAt);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON sync_logs(status);
