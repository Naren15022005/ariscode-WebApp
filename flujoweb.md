# Aris Code — Complete Implementation Guide

**Versión:** 0.3.0-MVP  
**Estado:** Phase 1 ✅ + Phase 2 ✅ Complete — Phase 3 Pending  
**Última actualización:** 2026-05-04  
**Autor:** Narén Alfonso (AlnChole)

> Motor de generación de código **determinístico + workspace web** para devs en regiones con barreras de costo. Genera código, lo abres en el editor web, el agent lo mejora en tiempo real.

---

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Estado Actual](#estado-actual)
3. [Arquitectura Técnica](#arquitectura-técnica)
4. [Diseño UI/UX](#diseño-uiux)
5. [Roadmap por Fase](#roadmap-por-fase)
6. [API Reference](#api-reference)
7. [Database Schema](#database-schema)
8. [Deployment](#deployment)

---

## 🎯 Visión General

### ¿Qué es Aris Code?

**3 componentes integrados:**

```
┌──────────────────────────────────────────────────────────┐
│                   ARIS CODE ECOSYSTEM                    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. GENERATOR (Core) ✅ COMPLETO                        │
│     └─ Input: Pattern + variables                      │
│     └─ Output: Código generado (<500ms)                │
│     └─ Determinístico (mismo input = mismo output)    │
│                                                          │
│  2. WORKSPACE (Web IDE) ✅ COMPLETO                     │
│     └─ Editor multi-tab con syntax highlighting        │
│     └─ File tree organizado (recursivo)                │
│     └─ Terminal web simulado (npm, git, etc)           │
│     └─ Agent mode integrado                            │
│                                                          │
│  3. AGENT MODE (Determinístico) ✅ COMPLETO             │
│     └─ "Agregar try-catch" → Auto-envuelve async      │
│     └─ "Generar JSDoc" → Documenta métodos            │
│     └─ "Ordenar imports" → Alfabéticamente            │
│     └─ "Agregar tipos" → Promise<T> automático        │
│     └─ Diff viewer: ver qué cambió                    │
│     └─ Accept/reject: control total                   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Diferenciador vs Competitors

| Feature | Aris Code | Copilot | ChatGPT | StackBlitz |
|---------|-----------|---------|---------|-----------|
| **Generación determinística** | ✅ | ❌ | ❌ | ❌ |
| **Editor web integrado** | ✅ | ❌ | ❌ | ✅ |
| **Agent mejora código** | ✅ | ⚠️ | ✅ | ❌ |
| **Offline-capable** | ✅ | ❌ | ❌ | ⚠️ |
| **GitHub sync patterns** | ✅ | ❌ | ❌ | ❌ |
| **Bajo costo** | ✅ | ❌ | ❌ | ⚠️ |
| **Sin LLM requerido** | ✅ | ❌ | ❌ | ❌ |

---

## 📸 Estado Actual

### Dashboard (Implementado)

```
┌─────────────────────────────────────────────────────────────────┐
│ ☰ Aris Code Beta v1.0 🟢 Ollama • 344 patterns  🔍 [Código] ⚙│
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│ CONVERSACIONES       │ Buenas días/tardes, Usuario │ product.   │
│ ├─ Hoy               │                              │ service.ts │
│ │  ├─ Auth JWT...    │ [⚡icon]                    │ product.   │
│ │  └─ CRUD Productos │                              │ controller │
│ ├─ Ayer              │ What do you want to build?   │            │
│ │  ├─ Dashboard React│ [input con mic + send]       │ import {}  │
│ │  └─ E-commerce     │                              │ @Injectable│
│ ├─ Antes             │ [CRUD] [Auth] [API REST]     │ export...  │
│ │  └─ GraphQL API    │ [CLI Tool] [Tests]           │            │
│                      │ [UI Component]               │ [Copiar]   │
│ PATTERNS             │                              │ [Descargar]│
│ 🟢 NestJS (89)       │                              │            │
│ 🟠 Laravel (67)      │                              │            │
│ 🔵 React (103)       │                              │            │
│ 🟣 FastAPI (44)      │                              │            │
│                      │                              │            │
│ [Configuración]      │                              │            │
│ [Estadísticas]       │                              │            │
│ [AI Layer]           │                              │            │
│ [+ Nueva conversación│                              │            │
└─────────────────────────────────────────────────────────────────┘
```

### Workspace (Implementado en esta sesión)

```
┌──────────────────────────────────────────────────────────────────┐
│ ← | Aris Code / CRUD Productos | [2 unsaved] | Files | Term | ⚡│
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│ Files (L)           │ Editor (C)                │ Terminal (R)   │
│                     │                             │               │
│ FILES               │ ▶ src/product.service.ts  │ Terminal       │
│ ├─ src/             │                             │               │
│ │  ├─ product.      │ 1  import { Injectable }  │ $ npm install │
│ │  │  service.ts ← │ 2  import { PrismaService │ added 847 pkgs│
│ │  ├─ product.      │ 3  ...                    │               │
│ │  │  controller.ts │ [Syntax highlighting      │ $ npm run dev │
│ │  └─ product.      │  purple/green/yellow/blue]│ ✓ Running :300│
│ │     module.ts     │                             │               │
│                     │                             │ Quick cmds:   │
│ 6 files             │                             │ [npm install] │
│                     │ [path: src/...] [Copy]     │ [npm run dev] │
│                     │                             │ [npm test]    │
│                     │                             │ [git status]  │
│                     │                             │ $ _           │
├─────────────────────┴─────────────────────────────┴───────────────┤
│            OR: Agent Mode Panel (toggle)                          │
│  [Agregar try-catch] [Generar JSDoc] [Ordenar imports] [Tipos]   │
│  → Progress bar + steps → Diff viewer → [Aceptar] [Rechazar]     │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Arquitectura Técnica

### Estructura Monorepo (Estado Actual)

```
ariscode-webapp/
│
├── packages/
│   ├── shared/                  ✅ Tipos compartidos
│   │   └── src/types.ts
│   │
│   ├── core/                    ✅ Lógica de generación
│   │   └── src/
│   │       ├── domain/          ✅ Repositories interfaces
│   │       ├── application/     ✅ Use cases
│   │       └── infrastructure/  ✅ SQLite + Handlebars + GitHub
│   │
│   └── web/                     ✅ Next.js 14 App
│       └── src/
│           ├── app/
│           │   ├── page.tsx              ✅ Redirige a /dashboard
│           │   ├── layout.tsx            ✅
│           │   ├── dashboard/page.tsx    ✅ Dashboard principal
│           │   ├── workspace/[id]/       ✅ NUEVO: Editor web
│           │   │   └── page.tsx
│           │   ├── conversations/page.tsx ✅
│           │   ├── login/page.tsx        ✅
│           │   ├── register/page.tsx     ✅
│           │   ├── settings/page.tsx     ✅
│           │   └── api/
│           │       ├── generate/route.ts  ✅
│           │       ├── templates/route.ts ✅
│           │       ├── patterns/route.ts  ✅
│           │       ├── conversations/route.ts ✅
│           │       ├── workspace/[id]/files/route.ts ✅ NUEVO
│           │       ├── agent/analyze/route.ts        ✅ NUEVO
│           │       └── agent/improve/route.ts        ✅ NUEVO
│           │
│           └── components/
│               ├── dashboard/            ✅ TopBar, Sidebar, MainArea, CodePanel
│               ├── workspace/            ✅ NUEVO
│               │   ├── FileTree.tsx      ✅ Árbol recursivo
│               │   ├── CodeEditor.tsx    ✅ Editor con syntax highlighting
│               │   ├── Terminal.tsx      ✅ Terminal simulado
│               │   └── AgentPanel.tsx   ✅ Agent mode UI
│               ├── generator/            ✅ TemplateSelector, ConfigPanel, GenerateButton
│               ├── common/               ✅ LoadingSpinner, ErrorBoundary, Toast
│               └── layouts/             ✅ Header, Sidebar, Footer
│
├── patterns/                    ✅ Templates Handlebars
├── database/                    ✅ SQLite (sql.js)
└── scripts/                     ✅ Seed, migrate, github-sync
```

### Stack Completo

```
┌─────────────────────────────────────────────────────────┐
│                     USER BROWSER                        │
├─────────────────────────────────────────────────────────┤
│  Next.js 14 (SSR/Client)                               │
│  ├─ React 18 + Hooks                                   │
│  ├─ Tailwind CSS (dark theme, neutral palette)         │
│  ├─ CodeEditor (textarea + syntax highlight overlay)   │
│  └─ Terminal (simulated, with npm/git commands)        │
├─────────────────────────────────────────────────────────┤
│                  NEXT.JS API ROUTES                     │
│  ├─ /api/generate      → GenerateProjectUseCase        │
│  ├─ /api/templates     → GetTemplatesUseCase           │
│  ├─ /api/patterns      → SearchPatternsUseCase         │
│  ├─ /api/workspace/[id]/files → File CRUD             │
│  ├─ /api/agent/analyze → Code analysis                 │
│  ├─ /api/agent/improve → Deterministic improvements   │
│  └─ /api/conversations → Chat history                 │
├─────────────────────────────────────────────────────────┤
│                   @ARISCODE/CORE                        │
│  ├─ Use Cases (orchestration)                          │
│  ├─ Domain (pure entities)                             │
│  └─ Infrastructure                                     │
│      ├─ sql.js (SQLite in browser/server)             │
│      ├─ Handlebars (templates)                         │
│      ├─ FlexSearch (full-text search)                  │
│      └─ Octokit (GitHub API sync)                     │
├─────────────────────────────────────────────────────────┤
│                  DATA & STORAGE                         │
│  ├─ SQLite local (database/ariscode.db via sql.js)    │
│  ├─ localStorage (project files, workspace state)     │
│  └─ In-memory Map (server-side file store per session)│
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Diseño UI/UX

### Colores y Tema (Dark, Neutral Palette)

```
Fondos:
├─ Principal:         #171717  (neutral-900)
├─ Editor/Terminal:   #0a0a0a  (neutral-950)
├─ Elementos:         #262626  (neutral-800)
└─ Header:            #171717

Acentos:
├─ Purple:            #a855f7  (purple-400/500) — logo, activos
├─ Green:             #22c55e  (green-400/500) — Ollama, strings
├─ Yellow:            #fde047  (yellow-300) — clases
├─ Blue:              #60a5fa  (blue-400) — decoradores
├─ Amber:             #f59e0b  (amber-400) — archivos modificados
├─ Border:            #262626  (neutral-800)
├─ Text primary:      #e5e5e5  (neutral-200)
└─ Text secondary:    #737373  (neutral-500)

Syntax Highlighting:
├─ Keywords (import/export/class/async): text-purple-400
├─ Strings ('...', "..."):               text-green-400
├─ Classes (PascalCase):                 text-yellow-300
├─ Decorators (@Injectable):            text-blue-400
├─ Numbers:                              text-orange-400
└─ Comments (//):                        text-neutral-600 italic
```

### Vistas Implementadas

#### Vista 1: Dashboard `/dashboard`
- TopBar: hamburger toggle sidebar, logo, Ollama green dot, search, Code button (toggle code panel), settings, user
- Sidebar: conversaciones agrupadas por día, patterns con color dots, footer (config/stats/AI), nueva conversación button
- MainArea: time-based greeting, input field con Ctrl+K focus, quick action chips (CRUD/Auth/API REST/etc)
- CodePanel: file tabs, syntax highlighted code viewer, copy/download

#### Vista 2: Workspace `/workspace/[id]`
- TopBar: back button, breadcrumb (Aris Code / Project Name), unsaved count badge, file tree toggle, Terminal/Agent panel toggle
- FileTree: árbol recursivo, iconos por tipo de archivo (.ts=blue, .json=amber, etc), expand/collapse carpetas
- CodeEditor: textarea transparente + pre overlay con syntax highlighting, line numbers, Tab=2 spaces, copy button
- Terminal: simulated shell con npm/git commands, arrow key history, quick command buttons
- AgentPanel: 4 operaciones (try-catch, JSDoc, imports, types), progress con steps, diff viewer, accept/reject

---

## 📊 Roadmap por Fase

### FASE 1: MVP Generator + Dashboard ✅ COMPLETO
- ✅ SQLite (sql.js) funcionando
- ✅ Generador código <500ms
- ✅ Dashboard UI con sidebar, main area, code panel
- ✅ API routes: generate, templates, patterns, conversations
- ✅ Responsive design (sidebar/panel toggleable)
- ✅ Syntax highlighting en code panel

### FASE 2: Workspace + Agent Mode ✅ COMPLETO (esta sesión)
- ✅ `/workspace/[id]` page completa
- ✅ FileTree (árbol recursivo)
- ✅ CodeEditor (textarea + syntax highlight overlay, Tab support)
- ✅ Terminal simulado (npm, git, commands con delay)
- ✅ AgentPanel con 4 operaciones determinísticas:
  - ✅ Agregar try-catch en async functions
  - ✅ Generar JSDoc comments
  - ✅ Ordenar imports alfabéticamente
  - ✅ Agregar tipos de retorno Promise<T>
- ✅ Diff viewer (before/after)
- ✅ Accept/reject changes
- ✅ API /api/workspace/[id]/files (GET, POST, PUT, DELETE)
- ✅ API /api/agent/analyze (framework detection, suggestions)
- ✅ API /api/agent/improve (deterministic transformations)
- ✅ Persistencia en localStorage

### FASE 3: Features Avanzadas (Pendiente)
- ⏳ GitHub auth (clonar repos privados)
- ⏳ Git workflow real (commit, push, PR via API)
- ⏳ Marketplace de patterns (community)
- ⏳ Preview en vivo (iframe + WebContainer)
- ⏳ LLM integration opcional (Ollama local)
- ⏳ Export ZIP de proyectos
- ⏳ Onboarding tutorial

### FASE 4: Monetización (Mes 2+)
- ⏳ Freemium tier
- ⏳ PRO ($5/mes): sync + storage + agent avanzado
- ⏳ Analytics dashboard
- ⏳ Desktop app (Tauri)
- ⏳ CLI mejorado

---

## 🔌 API Reference

### Endpoints Implementados

```typescript
// Generator
POST /api/generate
  Body:     { templateId: string, projectName?: string, variables?: Record<string, any> }
  Returns:  { success: boolean, files: GeneratedFile[], projectId: string }

GET /api/templates
  Returns:  Template[]

GET /api/patterns?q=search
  Returns:  { patterns: Pattern[], total: number }

// Workspace Files
GET /api/workspace/[id]/files
  Returns:  { files: WorkspaceFile[], projectId: string }

POST /api/workspace/[id]/files
  Body:     { path: string, content: string }
  Returns:  { success: boolean, file: WorkspaceFile }

PUT /api/workspace/[id]/files
  Body:     { files: WorkspaceFile[] }
  Returns:  { success: boolean, count: number }

DELETE /api/workspace/[id]/files?path=src/foo.ts
  Returns:  { success: boolean }

// Agent
POST /api/agent/analyze
  Body:     { files: WorkspaceFile[] }
  Returns:  { analysis: { framework, language, patterns, suggestions, metrics } }

POST /api/agent/improve
  Body:     { files: WorkspaceFile[], instruction: 'try-catch'|'jsdoc'|'imports'|'types'|'all' }
  Returns:  { success: boolean, changes: FileChange[], files: WorkspaceFile[], summary }

// Conversations
GET /api/conversations
  Returns:  { conversations: Conversation[] }

POST /api/conversations
  Body:     { title: string }
  Returns:  { conversation: Conversation }
```

---

## 💾 Database Schema

### Tablas Principales (sql.js / SQLite)

```sql
-- templates (patterns para generar código)
CREATE TABLE templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  framework TEXT,
  language TEXT,
  files JSON NOT NULL,
  configSchema JSON,
  createdAt INTEGER
);

-- conversations
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL DEFAULT 'local',
  title TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  createdAt INTEGER,
  updatedAt INTEGER
);

-- conversation_messages
CREATE TABLE conversation_messages (
  id TEXT PRIMARY KEY,
  conversationId TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  metadata JSON,
  createdAt INTEGER,
  FOREIGN KEY(conversationId) REFERENCES conversations(id)
);

-- github_repositories (sync cache)
CREATE TABLE github_repositories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT,
  stars INTEGER DEFAULT 0,
  qualityScore REAL DEFAULT 0,
  lastSynced INTEGER
);
```

---

## 🚀 Deployment

### Local Development

```bash
# Setup (Windows)
corepack enable
pnpm install   # o npm install en packages/web

# Dev server
pnpm dev       # http://localhost:3000

# Seed database con patterns
pnpm db:seed

# Type check
pnpm typecheck
```

### Rutas Principales

| Ruta | Descripción |
|------|-------------|
| `/dashboard` | Dashboard principal (home) |
| `/workspace/[id]` | Editor web para un proyecto |
| `/conversations` | Lista de conversaciones |
| `/settings` | Configuración y GitHub sync |
| `/login` | Autenticación (opcional) |
| `/register` | Registro (opcional) |

### Flujo Usuario Principal

```
Dashboard
  → Usuario escribe: "CRUD Productos NestJS"
  → Click quick action "CRUD" o Enter
  → POST /api/generate { templateId: 'nestjs-crud', variables: { moduleName: 'Product' } }
  → Response: { files: [...], projectId: 'proj-123' }
  → localStorage.setItem('project-proj-123', JSON.stringify(project))
  → redirect → /workspace/proj-123

Workspace
  → Carga files de localStorage
  → FileTree muestra estructura
  → Click archivo → CodeEditor con syntax highlighting
  → Terminal: npm install, npm run dev
  → Agent tab → Selecciona "Agregar try-catch"
  → Progress animation → Diff viewer
  → Click "Aceptar cambios" → Código actualizado
```

---

## ✅ Checklist de Estado

### Completado
```
[x] SQLite (sql.js) persistente en database/ariscode.db
[x] Generator <500ms garantizado
[x] Dashboard con 3 paneles (sidebar, main, code)
[x] TopBar responsive con toggles
[x] Sidebar con conversaciones y patterns
[x] MainArea con greeting time-aware y quick actions
[x] CodePanel con syntax highlighting
[x] Workspace /workspace/[id] completo
[x] FileTree recursivo con íconos por tipo
[x] CodeEditor con overlay, line numbers, Tab support
[x] Terminal simulado con comandos reales mockeados
[x] AgentPanel con 4 operaciones determinísticas
[x] Diff viewer (before/after) en AgentPanel
[x] Accept/reject changes con persistencia localStorage
[x] API /api/workspace/[id]/files (CRUD completo)
[x] API /api/agent/analyze (framework detection)
[x] API /api/agent/improve (all 4 transformations)
[x] Responsive: paneles toggleable en todos los tamaños
```

### Pendiente (Fase 3)
```
[ ] Preview en vivo (iframe con dev server)
[ ] Git workflow real (commit, push)
[ ] Export ZIP de proyectos
[ ] LLM integration (Ollama API opcional)
[ ] Onboarding tutorial
[ ] Marketplace de patterns (community)
[ ] Tests E2E con Playwright
[ ] Lighthouse score >90
[ ] Mobile view optimizado (actualmente tablet+)
```

---

## 📝 Changelog

### v0.3.0 (2026-05-04) — Esta sesión
- ✨ Dashboard completamente rediseñado (layout fijo, componentes modulares)
- ✨ Workspace `/workspace/[id]` implementado desde cero
- ✨ FileTree recursivo con iconos por tipo de archivo
- ✨ CodeEditor con syntax highlighting real (tokenizer propio)
- ✨ Terminal simulado con 10+ comandos (npm, git, ls, clear)
- ✨ AgentPanel con 4 operaciones determinísticas
- ✨ API routes: workspace files CRUD + agent analyze/improve
- ✨ Persistencia en localStorage para estado del workspace
- 🔧 TopBar: green dot Ollama, toggleable sidebar/code panel
- 🔧 Layout: flex column correcto (era grid roto)
- 🔧 MainArea: greeting time-based, Ctrl+K shortcut, quick actions funcionales

### v0.2.0 (Sesión anterior)
- ✨ Arquitectura workspace + agent diseñada
- ✨ Diseño UI refindo
- 📦 Database schema completo
- 📚 Documentación inicial

### v0.1.0 (Inicial)
- ✅ Generator funcional (@ariscode/core)
- ✅ API routes básicas
- ✅ Monorepo setup (pnpm workspaces)

---

**Proyecto: Aris Code WebApp**  
**Estado: Phase 1 + Phase 2 completas**  
**Próxima revisión:** 2026-05-11

---

> *Haciendo accesible la generación de código para devs en regiones donde $50/mes es una barrera.*  
> *Narén Alfonso (AlnChole) | Santa Marta, Colombia | 2026*
