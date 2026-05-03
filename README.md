# ariscode-WebApp
agente programador sin inteligencia artificial, version web app


## 💡 La Idea

Las herramientas de IA para programar son potentes, pero también caras. **20 a 50 dólares al mes** para algo que el 90% del tiempo solo genera código repetitivo que tú mismo podrías plantillar.

**Aris Code** nace de una pregunta simple: ¿y si construyo una herramienta que cubra ese 90% sin pagar IA, sea más rápida, funcione offline y aprenda de mi propio estilo?

La respuesta es este proyecto.

---

## 🎯 Qué es Aris Code

Aris Code es un **motor de generación y análisis de código basado en patrones**, no en modelos de lenguaje. Piensa en él como tu **biblioteca personal de código curada**, conectada al mejor open source del mundo y empaquetada en una herramienta que entiende tu estilo.

En lugar de pedirle a un LLM que invente cada respuesta (lento, caro, inconsistente), Aris Code:

1. **Mantiene una base de conocimiento** con patrones de código probados, organizados por framework, lenguaje y caso de uso.
2. **Se actualiza sola** sincronizándose con repositorios curados de GitHub (>1k estrellas, mantenidos, con licencia permisiva).
3. **Aprende de tu código** y prioriza tus patrones personales sobre los de la comunidad.
4. **Genera al instante** (<500ms) usando plantillas y manipulación de AST, no inferencia de lenguaje.
5. **Analiza código existente** para detectar patrones, duplicación, complejidad y sugerir mejoras alineadas a tu estilo.

---

## 🧭 Misión

> **Democratizar el acceso a herramientas de productividad para desarrolladores, especialmente en regiones donde las suscripciones de IA son una barrera económica real.**

Cada desarrollador en Latinoamérica, África o el Sudeste Asiático debería poder ser igual de productivo que uno en Silicon Valley, sin tener que pagar $50 USD mensuales por una IA. Aris Code es esa herramienta.

---

## 🚀 Visión

Convertir a Aris Code en el **estándar de facto** para generación de código determinística y análisis estructural de proyectos, complementando (no reemplazando) a las herramientas de IA cuando estas son verdaderamente necesarias.

En 3 años, queremos que cuando un desarrollador instale su entorno, instalar Aris Code sea tan natural como instalar Git.

---

## 🌟 Ambición

- **100.000+ desarrolladores** usándolo activamente.
- **Marketplace de patterns** alimentado por la comunidad open source.
- **Plugin oficial** en VSCode, JetBrains, Vim, Cursor.
- **Soporte de 15+ lenguajes** y 50+ frameworks.
- **Versión Team/Enterprise** sosteniendo financieramente la versión open source para siempre.
- **Conferencia anual** AristCon, hub de desarrolladores latinos.

---

## 🧩 Filosofía

Aris Code se construye sobre cinco principios no negociables:

| Principio | Significado |
|-----------|-------------|
| **Velocidad** | Si no responde en menos de 500ms, está mal hecho. |
| **Determinismo** | Mismo input → mismo output. Siempre. Sin alucinaciones. |
| **Personalización** | La herramienta aprende de ti, no al revés. |
| **Transparencia** | Siempre se ve de dónde viene cada pattern. Cero magia oculta. |
| **Offline-first** | Funciona sin internet. Tu código nunca sale de tu máquina. |

---

## 🎯 Alcance del Proyecto

### Lo que Aris Code **SÍ hace**

- ✅ Genera módulos completos (CRUD, auth, configs) para frameworks populares.
- ✅ Crea proyectos desde cero con plantillas curadas.
- ✅ Analiza código existente: estructura, complejidad, patrones, duplicación.
- ✅ Resuelve errores comunes con base de soluciones probadas.
- ✅ Se sincroniza diariamente con GitHub para mantenerse actualizado.
- ✅ Aprende de tu propio código y prioriza tus patterns personales.
- ✅ Genera diagramas de arquitectura (Mermaid) desde tu código.
- ✅ Funciona en CLI, aplicación web/desktop y extensión de VSCode.

### Lo que Aris Code **NO hace** (y está bien que no lo haga)

- ❌ No razona sobre arquitecturas complejas ni hace análisis de negocio.
- ❌ No genera código completamente novedoso ni inventa soluciones.
- ❌ No reemplaza un LLM cuando se necesita creatividad o razonamiento abstracto.
- ❌ No explica conceptos didácticamente.
- ❌ No debuggea problemas que requieran inferencia contextual profunda.

Para ese 5-10% de tareas, Aris Code se integra opcionalmente con un LLM como **fallback**, manteniendo el costo en menos de $1/mes en uso típico.

---

## 🏗️ Cómo Funciona

```
┌─────────────────────────────────────────────┐
│  TU INPUT                                    │
│  $ aris create "auth jwt nestjs"             │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  PATTERN MATCHER                             │
│  Busca en tu Knowledge Base local            │
│  → 3 patterns matching                       │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  KNOWLEDGE BASE (SQLite local)               │
│  ├─ Patterns personales (prioridad máxima)   │
│  ├─ Patterns de GitHub curados (auto-sync)   │
│  └─ Soluciones a errores comunes             │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  CODE GENERATOR                              │
│  Plantillas + AST manipulation               │
│  → 8 archivos generados en 2.1s              │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Estrategia Técnica

### Stack Principal

- **Core:** TypeScript + Node.js 20+
- **Database:** SQLite (vía `better-sqlite3`) — embebido, sin servidor
- **Search:** FlexSearch para full-text search
- **Parsers:** `@babel/parser` (JS/TS), `php-parser` (PHP), `tree-sitter` (universal, futuro)
- **Templates:** Handlebars con extensiones custom
- **GitHub API:** `@octokit/rest`
- **CLI:** Commander.js + Inquirer + Chalk + Ora
- **Web UI:** Next.js 14 + Tailwind + shadcn/ui (empaquetable con Tauri)
- **VSCode:** Extension API oficial

### Arquitectura

Monorepo con paquetes independientes pero compartidos:

```
aris-code/
├── packages/
│   ├── core/         # Motor compartido (lógica de negocio)
│   ├── cli/          # Interfaz de línea de comandos
│   ├── web/          # Aplicación web/desktop
│   └── vscode/       # Extensión de VSCode
├── patterns/         # Patterns curados iniciales
├── docs/             # Documentación
└── scripts/          # Tooling y CI
```

El **core es agnóstico de UI**: jamás importa dependencias de Commander, React o VSCode. Cada interfaz es un consumidor del core.

### Estrategia de Datos

**3 niveles de prioridad** en la knowledge base:

1. **Personal (prioridad máxima):** Patterns que tú creas. Siempre se sugieren primero.
2. **GitHub curado (prioridad media):** Patterns extraídos automáticamente de repos populares.
3. **Manual base (prioridad baja):** Patterns iniciales del proyecto, usados como fallback.

### Estrategia de Auto-Actualización

Cron diario que:

1. Consulta awesome lists curadas (awesome-nestjs, awesome-laravel, etc).
2. Filtra repos con score >70 (combinando estrellas, recencia, salud, docs).
3. Extrae patterns nuevos vía análisis AST.
4. Versiona: nunca sobrescribe patterns que tú modificaste, los marca como "actualización disponible".

---

## 🗺️ Roadmap

### Fase 1 — Core + CLI (Mes 1) `🟡 En desarrollo`
- [x] Arquitectura del proyecto
- [x] Diseño del esquema de base de datos
- [ ] Pattern Matcher con búsqueda full-text
- [ ] Code Generator con Handlebars
- [ ] CLI con comandos `create`, `search`, `error`
- [ ] 20 patterns iniciales (NestJS, Laravel, React)

### Fase 2 — Análisis + GitHub Sync (Mes 2) `⚪ Pendiente`
- [ ] AST analyzer (JS/TS, PHP)
- [ ] Detector de patterns y duplicación
- [ ] Comparador con knowledge base
- [ ] GitHub scraper con quality scoring
- [ ] Cron de sincronización diaria

### Fase 3 — Web/Desktop UI (Mes 3) `⚪ Pendiente`
- [ ] Dashboard con estadísticas
- [ ] Browse de patterns con filtros
- [ ] Wizard interactivo de generación
- [ ] Visualizador de análisis
- [ ] Empaquetado con Tauri

### Fase 4 — VSCode Extension (Mes 4) `⚪ Pendiente`
- [ ] Comandos en paleta y atajos
- [ ] Quick fixes desde errores
- [ ] CodeLens con métricas
- [ ] Hover providers
- [ ] Publicación en Marketplace

### Año 2 — Plataforma `🔵 Futuro`
- [ ] Marketplace público de patterns
- [ ] Soporte de Python, Java, C#, Rust, Go
- [ ] Plugin system para terceros
- [ ] Integración con LLM local (Ollama)
- [ ] Versión Team/Enterprise

---

## 📊 Métricas de Éxito

Cómo sabremos que Aris Code está funcionando:

| Métrica | Objetivo Año 1 | Objetivo Año 3 |
|---------|----------------|----------------|
| Usuarios activos mensuales | 1.000 | 100.000 |
| Patterns en knowledge base | 500 | 10.000 |
| Tiempo promedio por comando | <500ms | <300ms |
| Frameworks soportados | 10 | 50+ |
| Estrellas en GitHub | 1.000 | 25.000 |
| Costo mensual de IA por usuario | <$1 | <$0.10 |

---

## 🤝 Contribuir

Aris Code está en fase temprana. Si te gusta la idea y quieres aportar, hay muchas formas:

- **Patterns nuevos:** Comparte un pattern de un framework que conoces bien.
- **Bug reports:** Encuentra problemas y repórtalos en Issues.
- **Documentación:** Mejora ejemplos, traduce docs, escribe tutoriales.
- **Code:** Toma un issue marcado como `good first issue` y mándale PR.
- **Feedback:** Cuéntanos cómo lo usas, qué te falta, qué te sobra.

Próximamente: `CONTRIBUTING.md` con guías detalladas.

---

## 📜 Licencia

Aris Code es **open source bajo licencia MIT**. Úsalo, modifícalo, distribúyelo. La única condición es mantener el aviso de copyright original.

Las versiones futuras Pro/Team serán de pago, pero el core siempre será libre y gratuito.

---

## 💜 Créditos

Creado y mantenido por **[Narén Alfonso Navarro Chole](https://github.com/Alfonsito)** desde Santa Marta, Colombia 🇨🇴.

Inspirado en el ecosistema de herramientas como Yeoman, Plop, Hygen, Prettier y ESLint, llevándolo al siguiente nivel con análisis estructural y auto-actualización.

Forma parte del ecosistema **ARIS**:
- 🤖 [A.R.I.S](#) — Agente IA personal
- 🎟️ [ArisRifas](#) — Plataforma de rifas
- 🍽️ [ArisGourmet](#) — Sistema de pedidos para restaurantes
- ⚡ **Aris Code** — Esta herramienta

---

<div align="center">

### *"Si una herramienta no te hace 10x más productivo, no merece estar en tu stack."*

**Aris Code** está construida sobre esa convicción.

⭐ Si te gusta la idea, dale star al repo y síguenos para no perderte el lanzamiento.

</div>

## CLI — Instrucciones rápidas

La CLI de Aris Code permite generar proyectos a partir de patterns locales.

- Guía completa: [instruccionesCLI.md](instruccionesCLI.md)

Resumen rápido:

- Requisitos: Node.js 18+ (recomendado), `pnpm` o `npm`.
- Instalar dependencias (recomendado con Corepack + pnpm):

```powershell
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
```

Si no usas `pnpm`:

```powershell
npm install
```

- Ejecutar en desarrollo (ejemplo):

```powershell
npm run dev -- create hello-world myapp
# o con pnpm
pnpm run dev -- create hello-world myapp
```

- Comandos principales: `create`, `search`, `error`.

Para más detalles y troubleshooting, consulta [instruccionesCLI.md](instruccionesCLI.md).

## Release v1.0.0

La versión `v1.0.0` incluye: comando `create` con templates Handlebars, `search`, `error` con soluciones iniciales, patterns `hello-world`, `nestjs-crud` y `react-component`, tests y binarios empaquetados. Consulta [CHANGELOG.md](CHANGELOG.md) para más detalles.

