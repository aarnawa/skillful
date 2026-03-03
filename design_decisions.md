# Skillful — Design Decisions

A concise breakdown of *why* this app is built the way it is, what tradeoffs were made, and what the alternatives look like.

---

## 1. Overall Architecture

### Why Next.js?

Next.js gives us **one project** that serves both frontend React pages and backend API routes. There's no separate Express server, no CORS config, no two-repo headache. For a solo/small-team project, this is a huge productivity win.

| Option | Pros | Cons |
|--------|------|------|
| **Next.js (chosen)** | Single codebase, file-based routing, server-side rendering, API routes built in | Opinionated structure, heavier than plain Vite for pure SPAs |
| Vite + Express | Full control, smaller bundles | Two processes to run, CORS setup, no SSR out of the box |
| Remix | Similar to Next.js, great data loading | Smaller ecosystem, fewer tutorials |
| Plain React + Firebase | Zero backend code | Vendor lock-in, harder to migrate later |

**Tradeoff**: Next.js is heavier than a plain Vite SPA, but the unified frontend + API routes eliminates an entire class of integration complexity.

### Folder Structure: `frontend/`, `backend/`, [db/](file:///Users/aarnawa/Projects/skillful/skillful.db)

```
src/
├── frontend/       # Components, utilities, anything rendered in the browser
│   ├── components/
│   └── lib/
├── backend/        # Business logic, service functions
│   └── services/
├── db/             # Schema, seed data, database connection
└── app/            # Next.js pages and API route handlers (thin wrappers)
```

The goal is **separation of concerns**. API route files in `app/api/` are thin — they parse the request, call a service function, and return the response. The actual logic lives in `backend/services/`. This matters because:

- You can unit-test services without HTTP.
- Swapping Next.js for Express later means rewriting routes, not logic.
- New developers can find things by role, not by framework convention.

**Alternative**: Keep everything in `app/api/` (the Next.js default). Simpler to start, but logic and HTTP handling get tangled as the app grows.

---

## 2. Database

### Why SQLite + better-sqlite3?

For a local prototype, SQLite is unbeatable: **zero setup**, no Docker, no connection strings. The database is just a file ([skillful.db](file:///Users/aarnawa/Projects/skillful/skillful.db)).

| Option | Pros | Cons |
|--------|------|------|
| **SQLite (chosen)** | Zero config, fast reads, portable file | No concurrent writes from multiple servers |
| PostgreSQL | Production-grade, concurrent writes, rich querying | Requires running a server or Docker |
| MongoDB | Flexible schema, JSON-native | Overkill for structured tree data |
| JSON files | Simplest possible | No querying, no transactions, doesn't scale |

**Tradeoff**: SQLite can't handle concurrent write-heavy workloads from multiple servers. But for a single-user prototype, it's perfect. When ready for production, Drizzle makes it straightforward to swap to PostgreSQL — the schema and queries stay nearly identical.

### WAL Mode

```ts
sqlite.pragma("journal_mode = WAL");
```

This one line enables Write-Ahead Logging, which lets reads happen concurrently with writes. Without WAL, SQLite locks the entire database during writes. Since Next.js can serve multiple requests simultaneously, this prevents blocking.

### Why Drizzle ORM?

Drizzle provides **type-safe queries** with a TypeScript-first API. Your schema *is* your type definition — the [Skill](file:///Users/aarnawa/Projects/skillful/src/db/schema.ts#43-44) type is inferred directly from the table definition.

| Option | Pros | Cons |
|--------|------|------|
| **Drizzle (chosen)** | Type-safe, lightweight, SQL-like API, great migration support | Newer, smaller community than Prisma |
| Prisma | Large community, great docs, visual studio | Heavier runtime, own query engine, slower cold starts |
| Knex | Mature, flexible query builder | No type inference from schema |
| Raw SQL | Full control, no abstraction | No type safety, error-prone, tedious |

**Tradeoff**: Drizzle is newer than Prisma but significantly lighter — no separate query engine binary. The API reads like SQL, which is a benefit if you know SQL and a learning curve if you don't.

### Self-Referential Tree (Adjacency List)

The `skills` table uses `parentId` to reference itself:

```
Basketball (parentId: null)
├── Ball Handling (parentId: 1)
│   ├── Dribbling (parentId: 2)
│   └── Crossover (parentId: 2)
└── Shooting (parentId: 1)
```

This is the **adjacency list** pattern — the simplest tree structure in SQL.

| Pattern | Pros | Cons |
|---------|------|------|
| **Adjacency list (chosen)** | Simple schema, easy inserts/moves | Fetching full tree requires building in code |
| Nested sets | Fast subtree queries in SQL | Complex inserts, hard to understand |
| Materialized path (`/1/2/5`) | Easy "find ancestors" queries | String manipulation, fragile |
| Closure table | Fast queries for any relationship | Extra junction table, more storage |

**Tradeoff**: We fetch *all* skills and build the tree in JavaScript ([getSkillTree()](file:///Users/aarnawa/Projects/skillful/src/backend/services/skills.ts#16-43)). This is fine for <1000 nodes. For a massive tree (10k+ nodes), you'd want nested sets or closure tables to query subtrees directly in SQL.

---

## 3. Frontend

### Hexagonal Skill Nodes

The hexagon shape uses a pure CSS `clip-path` — no SVG, no canvas, no image assets:

```css
.hex-clip {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}
```

**Why not SVG or Canvas?** CSS clip-path is simpler to style (backgrounds, gradients, borders all work normally), doesn't require a rendering library, and is hardware-accelerated. The downside: you can't put a true "border" on a clip-path (the border gets clipped too), so we fake it by stacking two hex layers — a slightly larger colored one behind a smaller inner one.

### Icon System (Lucide)

Instead of emojis (which render differently across OS/browser), we use [Lucide React](https://lucide.dev/) — a clean, consistent SVG icon library.

The icon mapping lives in a single file (`frontend/lib/icons.tsx`):

```ts
const ICON_MAP: Record<string, LucideIcon> = {
  "basketball": CircleDot,
  "dribbling": Dribbble,
  ...
};
```

**Why a map instead of storing component names in the DB?** The database stores plain strings (`"basketball"`). This decouples the data from the React component library. If we switched from Lucide to Heroicons, we'd update one file — not the database.

**Alternatives**: Emoji (inconsistent rendering), custom SVGs (high maintenance), icon fonts like FontAwesome (larger bundle, licensing).

### Theme System (next-themes)

Light/dark mode uses CSS custom properties, toggled by adding/removing a `.dark` class on `<html>`:

```css
:root {          /* light mode values */  }
.dark {          /* dark mode values */  }
@theme {         /* Tailwind reads from CSS vars */ }
```

`next-themes` handles the toggle, persistence (localStorage), and prevents the flash-of-wrong-theme on page load via `suppressHydrationWarning`.

**Why not Tailwind's built-in `dark:` prefix?** That works, but it means scattering `dark:bg-gray-900 dark:text-white` across every element. With CSS variables, you define the palette once and every component automatically adapts. It's dramatically less code to maintain.

**Alternative**: `prefers-color-scheme` media query (no manual toggle), or a React context (reinventing what `next-themes` already does).

### State Management: Plain `useState` + `fetch`

There's no Redux, no Zustand, no React Query. State is local `useState` in page components, and data is fetched with `fetch()`.

**Why?** The app has simple data flow: load the skill tree, display it, POST to practice. There's no cross-page shared state, no optimistic updates, no real-time sync. Adding a state library would be premature abstraction.

**When you'd add one**:
- **React Query / SWR**: If you need caching, background refetching, or optimistic mutations.
- **Zustand**: If multiple unrelated components need the same state (e.g., a global "selected skill" that affects the sidebar and the main view).
- **Redux**: Almost never for new projects — Zustand does the same thing with less boilerplate.

---

## 4. API Design

### REST + Route Handlers

Each endpoint is a file in `app/api/`:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/skills` | GET | Fetch the full skill tree |
| `/api/progress` | GET | Fetch user progress |
| `/api/progress` | POST | Add XP to a skill |
| `/api/progress` | PATCH | Reset/reduce a skill level |
| `/api/seed` | POST | Seed the database |

**Why REST over tRPC or GraphQL?**

| Option | Pros | Cons |
|--------|------|------|
| **REST (chosen)** | Simple, universal, easy to debug with curl | No type safety across client-server boundary |
| tRPC | End-to-end type safety, no API layer | Tightly coupled to TypeScript, harder to use from non-TS clients |
| GraphQL | Flexible queries, great for complex data | Overkill for simple CRUD, extra tooling (Apollo, codegen) |

**Tradeoff**: REST is the simplest to understand and debug. tRPC would eliminate the `fetch()` boilerplate and give type-safe API calls, but adds a dependency and concept layer. For a learning project, REST makes the data flow explicit and visible.

### Thin Routes, Thick Services

The API route files are intentionally minimal — they validate input, call a service, and return JSON. The business logic (XP calculation, tree building, level validation) lives in `backend/services/`.

```
Route (thin):     Parse request → Call service → Return response
Service (thick):  Database queries, XP math, validation rules
```

This pattern is borrowed from enterprise backend architecture (Controller → Service → Repository). It's slightly more files, but each file has a single clear responsibility.

---

## 5. Key Tradeoffs Summary

| Decision | Chose simplicity | Would choose complexity when... |
|----------|-----------------|-------------------------------|
| SQLite | ✅ Zero setup | Multiple servers need write access |
| `fetch` + `useState` | ✅ No extra libraries | Caching, optimistic updates, or shared state needed |
| Adjacency list tree | ✅ Simple schema | Tree has 10k+ nodes or needs SQL subtree queries |
| REST | ✅ Universal, debuggable | Type-safe client-server calls become essential |
| CSS variables for theming | ✅ Define once | Need per-component theme overrides |
| Client-side tree building | ✅ Works for <1k nodes | Need paginated or lazy-loaded tree branches |

---

## 6. What I'd Change for Production

1. **PostgreSQL** — swap SQLite via Drizzle config change. Needed for multi-user concurrent writes.
2. **Authentication** — add NextAuth.js or Clerk. Right now `userId: 1` is hardcoded.
3. **React Query** — replace raw `fetch` for automatic caching, loading states, and error boundaries.
4. **Input validation** — add Zod schemas to API routes for runtime type checking.
5. **Testing** — add Vitest for service unit tests, Playwright for E2E browser tests.
6. **CI/CD** — GitHub Actions to run lint, typecheck, and tests on every PR.
