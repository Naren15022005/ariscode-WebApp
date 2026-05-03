# Contexto del Proyecto — Aris Code WebApp

## ¿Qué es Aris Code?

Motor de generación de código **determinístico**, basado en patrones (templates + AST), sin IA en runtime. Genera módulos completos en <500ms desde una knowledge base local SQLite que se **sincroniza diariamente con GitHub** para mantenerse actualizada con patrones probados y soluciones a problemas comunes. La versión web reemplaza el Electron desktop con Next.js 14, manteniendo el mismo core desacoplado.

**Misión:** democratizar herramientas de productividad para devs en regiones donde $50/mes de IA es una barrera real.

---

## Lo que entendí del README

- **No es un LLM wrapper.** Cero inferencia en runtime; todo es template + búsqueda estructural.
- **Offline-first:** la DB es SQLite local, el código nunca sale del equipo.
- **3 niveles de patterns + soluciones:** personal (máxima prioridad) > GitHub curado (auto-sync diario) > base seed.
- **GitHub Integration bidireccional:**
  - **Sync desde GitHub:** extrae patterns de repos populares, soluciones desde Issues/Discussions, detecta best practices vía AST.
  - **Manejo de problemas:** curador automático de soluciones comunes basadas en issues reales de la comunidad.
  - **Quality scorer:** solo repos con >1k estrellas, mantenidos activamente, con licencia permisiva y buena documentación.
- **Roadmap actual:** el proyecto tiene ya Fase 1 (CLI) completada con `create`, `search`, `error` y 3 patterns iniciales. La **Fase 3 (Web/Desktop)** es lo que construiremos aquí. La **Fase 2 (GitHub Sync)** se integra en paralelo.
- **Stack confirmado:** Next.js 14 + Tailwind + shadcn/ui + better-sqlite3 + Handlebars + FlexSearch + Octokit.


---

## Stack que usaremos

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14 App Router |
| Estilos | Tailwind CSS + shadcn/ui |
| Lenguaje | TypeScript (strict) |
| DB | SQLite vía `better-sqlite3` |
| Templates | Handlebars |
| Búsqueda | FlexSearch |
| Parsers AST | @babel/parser, php-parser |
| Package manager | pnpm (Corepack) |
| Build desktop (futuro) | Tauri |

---

## Arquitectura objetivo (Clean Architecture)

```
packages/
├── core/         ← lógica de negocio pura, sin dependencias de UI
│   ├── domain/        ← entidades + interfaces de repositorio
│   ├── application/   ← use cases (GenerateProject, GetTemplates, SaveProject)
│   └── infrastructure/← SQLite, Handlebars, FlexSearch, GitHub scraper
├── web/          ← Next.js 14 (App Router) — solo consume core
│   ├── app/           ← páginas y layouts
│   ├── components/    ← UI components (shadcn/ui)
│   └── lib/           ← hooks, server actions
└── shared/       ← tipos y constantes compartidos
patterns/         ← templates Handlebars organizados por framework
database/         ← ariscode.db (SQLite)
scripts/          ← seed, sync GitHub, tooling
```

**Regla absoluta:** `core` jamás importa de `web`. La dependencia fluye hacia adentro.

---

## Pasos para construir el proyecto

### Paso 1 — Inicializar el monorepo
- `pnpm init` + configurar `pnpm-workspace.yaml`
- Configurar TypeScript base (`tsconfig.base.json`)
- ESLint + Prettier
- Estructura de carpetas `packages/core`, `packages/web`, `packages/shared`

### Paso 3 — Package `shared`
- Tipos: `Project`, `Template`, `GeneratedFile`, `Pattern`, `Solution`, `GitHubRepository`
- Enums: `PatternPriority` (Personal, GitHub, Base), `SolutionSource` (GitHub Issue, Discussion, StackOverflow)
- Constantes de rutas, configuración, awesome lists y filtros de quality scoring

### Paso 4 — Package `core` — Domain
- Entidades puras: `Project`, `Template`, `GeneratedFile`, `Solution`, `GitHubRepository`
- Interfaces de repositorio: `ITemplateRepository`, `IProjectRepository`, `IPatternRepository`, `ISolutionRepository`
- Value objects: `PatternScore`, `GenerationConfig`, `RepositoryMetadata`

### Paso 5 — Package `core` — Infrastructure
- `SqliteTemplateRepository` (better-sqlite3)
- `SqliteSolutionRepository` (mejor-sqlite3, para soluciones de problemas)
- `HandlebarsGenerator` (templates + helpers custom)
- `FlexSearchIndex` (búsqueda full-text sobre patterns y soluciones)
- `MemoryCache` (cache in-process para queries frecuentes)
- **GitHub Sync module:**
  - `GitHubScraper` (Octokit) — extrae repos desde awesome lists
  - `QualityScorer` — calcula score: estrellas + recencia + mantenimiento + licencia + docs
  - `ASTAnalyzer` — extrae patterns desde código fuente (babel, php-parser)
  - `IssueExtractor` — parsea Issues/Discussions para soluciones comunes
  - `SyncCronService` — orquesta el ciclo diario (fetch → score → extract → upsert)

### Paso 6 — Package `core` — Application (Use Cases)
- `GetTemplatesUseCase` — busca y prioriza patterns
- `GenerateProjectUseCase` — orquesta búsqueda + generación + guardado
- `SaveProjectUseCase` — persiste proyectos generados
- `SearchPatternsUseCase` — full-text search con FlexSearch
- `SearchSolutionsUseCase` — busca soluciones por error o problema
- `SyncGitHubUseCase` — ejecuta el ciclo de sincronización (extrae, puntúa, indexa)

### Paso 7 — Package `web` — Next.js 14
- Setup: `create-next-app` con App Router + Tailwind + shadcn/ui
- API Routes / Server Actions que consumen los use cases del core
- Páginas:
  - `/` — Home: selector de template + wizard de configuración
  - `/templates` — Browse de patterns con filtros
  - `/projects` — Historial de proyectos generados
  - `/solutions` — Buscar soluciones a errores/problemas comunes
  - `/preview` — Vista previa del código generado
  - `/admin/sync-status` — Estado de la sincronización GitHub (último run, repos procesados, patterns/soluciones agregadas)

### Paso 7 — Seed inicial de patterns
- `hello-world`, `nestjs-crud`, `react-component` (migrar del CLI)
- Agregar: `next-page`, `express-router`, `laravel-controller`

### Paso 8 — GitHub Sync (Fase 2 integrada)
**Pipeline completo de sincronización diaria:**

1. **Discovery:**
   - Consulta awesome lists curadas (`awesome-nestjs`, `awesome-laravel`, `awesome-react`, etc)
   - Busca trending repos por lenguaje y framework
   - Filtra por: licencia permisiva, >1k estrellas, mantenidos en últimos 3 meses

2. **Quality Scoring:**
   - Calcula score: `(stars × 0.3) + (recency_score × 0.3) + (maintenance_score × 0.2) + (license_bonus × 0.2)`
   - Solo procesa repos con score >70

3. **Pattern Extraction:**
   - AST analysis: extrae estructuras comunes (`@babel/parser` para TS/JS, `php-parser` para PHP)
   - Identifica archivos de configuración, entrypoints, arquitectura típica
   - Mapea a templates Handlebars

4. **Solution Extraction:**
   - Parsea Issues cerradas con etiquetas como `solution`, `workaround`, `fix`
   - Extrae Discussions relevantes sobre errores comunes
   - Indexa con keywords para búsqueda full-text

5. **Versionado y Protección:**
   - Si un pattern/solución existe pero el user lo modificó: marca como "update available", nunca sobrescribe
   - Mantiene audit trail de qué fue agregado, cuándo, desde qué repo

6. **Indexación:**
   - Inserta en SQLite con timestamps
   - Reindexa FlexSearch
   - Genera reportes de cambios (X patterns nuevos, Y soluciones agregadas)

### Paso 9 — Testing
- Vitest para core (unit tests de use cases y domain)
- Playwright para web (E2E del flujo de generación)

### Paso 10 — Build & deploy
- Docker para hosting web (opcional)
- Tauri wrapper para distribución desktop (Fase 3 final)

---

## Invariantes que nunca romperemos

1. Mismo input → mismo output (determinismo total).
2. Generación < 500ms end-to-end.
3. El código del usuario nunca sale de su máquina.
4. `core` no importa nada de `web`, CLI ni VSCode.
5. Los patterns y soluciones personales nunca se sobrescriben automáticamente por GitHub sync; se marcan como "update available".
6. Solo se procesan repos de GitHub con score >70 (filtros estrictos de calidad).
7. Solo se indexan soluciones de repos confiables; nunca se ejecuta código del sync.

---

## GitHub Sync — Pilar central del proyecto

El GitHub Sync no es un "nice-to-have" sino **la razón por la que Aris Code es viable económicamente**: convierte la comunidad open source en una knowledge base auto-actualizada sin costo operativo.

### Flujo de datos

```
Awesome lists + Trending APIs
        ↓
GitHub Scraper (Octokit)
        ↓
Quality Scorer (stars × 0.3 + recency × 0.3 + maintenance × 0.2 + license × 0.2)
        ↓
[Filter: score >70]
        ↓
AST Analyzer (patterns) + Issue Parser (solutions)
        ↓
SQLite Insert (con versionado y protección de user modifications)
        ↓
FlexSearch Reindex
        ↓
Web UI Dashboard (últimos cambios, estadísticas)
```

### Qué se extrae

**Patterns:**
- Estructura típica de proyectos (folders, entrypoints, config files)
- CRUD módulos completos (models, controllers, routes, tests)
- Setup de auth, middlewares, databases
- Config patterns (env files, build configs, CI/CD yamls)

**Soluciones:**
- Issues cerrados etiquetados como `solution`, `workaround`, `bug-fix`
- Discussions sobre problemas + soluciones probadas
- Code snippets de fixes reales
- Errores comunes + pasos para resolverlos

### Beneficios

- **Escalabilidad:** agregar 500+ patterns nuevos cada semana sin trabajo manual
- **Actualizabilidad:** patterns viejos se vuelven automáticamente "outdated" cuando hay versiones nuevas
- **Confiabilidad:** solo patterns de repos probados (1k+ estrellas, mantenidos)
- **Costo:** cero infraestructura; solo un cron diario que cuesta <$1/mes en compute

