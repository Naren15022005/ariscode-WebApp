CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL DEFAULT 'local',
  title TEXT,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'archived')),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversation_messages (
  id TEXT PRIMARY KEY,
  conversationId TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('user', 'system', 'assistant')),
  content TEXT NOT NULL,
  metadata JSON,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(conversationId) REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_conversations_userId ON conversations(userId);
CREATE INDEX IF NOT EXISTS idx_conversations_createdAt ON conversations(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_conversationId ON conversation_messages(conversationId);
