# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Use `bun` as the package manager (not npm/yarn).

```bash
bun run dev       # start dev server at http://localhost:3000
bun run build     # production build
bun run preview   # preview production build
bun run generate  # static site generation
bun run lint      # ESLint check
```

After installing new dependencies, `nuxt prepare` runs automatically via postinstall.

## Architecture

**veille-techno** is a Nuxt 4 (Vue 3 SSR) application for tech monitoring, styled with Tailwind CSS via Nuxt UI.

**Stack:**
- Nuxt 4 with `app/` directory layout
- Nuxt UI 4 (`@nuxt/ui`) — component library, auto-imported, no explicit imports needed
- Supabase (`@nuxtjs/supabase`) — backend/auth, configured via `SUPABASE_URL` and `SUPABASE_KEY` env vars
- TypeScript — types are partially generated in `.nuxt/` (never edit manually)
- ESLint via `@nuxt/eslint` — config extends `.nuxt/eslint.config.mjs`

**Key conventions:**
- Nuxt auto-imports are active: components, composables, and Vue APIs (`ref`, `computed`, etc.) are available without import statements
- Nuxt UI components (`UButton`, `UCard`, etc.) are globally available — no import needed
- App code lives in `app/` — Nuxt 4 layout with `app/app.vue` as root, `app/pages/`, `app/components/`, `app/composables/` etc.
- Server routes go in `server/api/` and `server/routes/`
- TypeScript tsconfig references `.nuxt/tsconfig.*.json` (generated) — run `bun run dev` once before editing to generate them
