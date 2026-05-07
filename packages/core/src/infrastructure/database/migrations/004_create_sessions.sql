CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL DEFAULT 'local',
  deviceId TEXT,
  startedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  lastActivityAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  expiresAt DATETIME,
  ipAddress TEXT,
  userAgent TEXT,
  isActive INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_sessions_userId ON sessions(userId);
CREATE INDEX IF NOT EXISTS idx_sessions_isActive ON sessions(isActive);
CREATE INDEX IF NOT EXISTS idx_sessions_expiresAt ON sessions(expiresAt);
