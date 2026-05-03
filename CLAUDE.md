# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Aris Code Web** is a pattern-based code generation tool — no AI/LLM at runtime. It generates deterministic code (<500ms) from curated templates stored in a local SQLite knowledge base. The web version targets the same mission as the desktop app but packaged as a Next.js 14 web application (optionally bundled with Tauri for desktop).

Core philosophy: **Velocity · Determinism · Personalization · Transparency · Offline-first**

## Monorepo Structure (Target)

```
ariscode-webapp/
├── packages/
│   ├── core/         # Framework-agnostic business logic — never imports React/Commander/VSCode
│   ├── web/          # Next.js 14 frontend + API routes
│   └── shared/       # Shared types, constants, IPC channel names
├── patterns/         # Curated Handlebars templates organized by framework
├── database/         # SQLite file (ariscode.db)
└── scripts/          # Tooling, seeding, GitHub sync cron
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS, shadcn/ui |
| Language | TypeScript (strict) |
| Database | SQLite via `better-sqlite3` (embedded, no server) |
| Templates | Handlebars with custom helpers |
| Full-text search | FlexSearch |
| AST parsers | `@babel/parser` (JS/TS), `php-parser` (PHP) |
| GitHub API | `@octokit/rest` |
| Package manager | pnpm (via Corepack) |

## Architecture Layers

The backend follows Clean Architecture. The dependency rule is strict: outer layers depend on inner layers, never the reverse.

```
Presentation  →  Application (Use Cases)  →  Domain  →  Infrastructure
```

- **Domain:** Pure entities (`Project`, `Template`, `GeneratedFile`, `Solution`) and repository interfaces. Zero external dependencies.
- **Application:** Use cases (`GenerateProjectUseCase`, `GetTemplatesUseCase`, `SaveProjectUseCase`, `SyncGitHubUseCase`) orchestrate domain + infra via interfaces.
- **Infrastructure:** Concrete implementations — SQLite repositories, Handlebars generator, FlexSearch index, GitHub scraper, AST parsers, Issue extractor.
- **Presentation:** Next.js pages/components, API routes, server actions. Calls use cases only.

### GitHub Sync Module (Infrastructure)

The sync pipeline runs daily as a cron job:
1. **Discovery:** queries awesome lists + trending APIs, filters by license + stars + maintenance
2. **Scoring:** quality score = (stars × 0.3) + (recency × 0.3) + (maintenance × 0.2) + (license × 0.2)
3. **Extraction:** AST analysis for patterns, Issue/Discussion parsing for solutions
4. **Indexing:** inserts into SQLite, reindexes FlexSearch, protects user-modified entries

Only repos scoring >70 are processed. User-modified patterns are never overwritten; marked as "update available".

## Knowledge Base Priority

Pattern lookup and issue resolution always resolves in this order:
1. **Personal patterns/solutions** (user-created) — highest priority, never auto-overwritten
2. **GitHub curated patterns/solutions** — auto-synced daily, scored >70 (stars + recency + docs + community activity)
3. **Built-in base patterns/solutions** — initial seed, used as fallback

## GitHub Integration

Aris Code automatically syncs with GitHub to:
- **Extract proven patterns** from popular repositories (awesome-* lists, trending, >1k stars)
- **Curate error solutions** from GitHub Issues and discussions
- **Detect best practices** via AST analysis of high-quality open source code
- **Stay updated** with daily cron job filtering repos by quality score (stars + maintenance status + license + docs)
- **Respect user ownership** — patterns/solutions modified locally are never silently overwritten, marked as "update available"

The sync pipeline filters for permissive licenses (MIT, Apache 2.0, BSD) and actively maintained projects.

## Common Commands (once scaffold is in place)

```powershell
# Install dependencies
corepack enable
corepack prepare pnpm@latest --activate
pnpm install

# Development
pnpm dev          # Start Next.js dev server

# Build
pnpm build        # Production build

# Type checking
pnpm typecheck    # tsc --noEmit

# Tests
pnpm test         # Run all tests
pnpm test packages/core   # Run tests for a single package
```

## Key Invariants

- The `core` package must never import from `web`, `cli`, or any UI framework.
- All generated output must be deterministic: same template + same config = same output, always.
- Generation target: <500ms end-to-end from pattern match to file output.
- SQLite database lives locally; user code/patterns never leave the machine.
- Pattern updates from GitHub sync mark existing user-modified patterns as "update available" — they are never silently overwritten.
- Only repositories with quality score >70 (stars + recency + maintenance + license) are synced from GitHub.
- GitHub sync never executes external code; it only extracts templates and documented solutions.
