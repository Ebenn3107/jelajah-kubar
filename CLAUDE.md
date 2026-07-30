# CLAUDE.md — Jelajah Kubar

## Project
Aplikasi web eksplorasi wisata Kutai Kartanegara (Kubar), Kalimantan Timur.
**Stack:** Laravel 13 + React 19 + Inertia 3 + TypeScript + Tailwind 4 + shadcn/ui
**Database:** PostgreSQL (`jelajah-kubar`)
**Auth:** Laravel Fortify (login, register, 2FA, passkeys, email verification)
**Build:** Vite 8
**SSR:** Inertia SSR (server-side rendering) — `php artisan inertia:start-ssr`

## Commands
- `composer dev` — run app (server + queue + vite + SSR concurrently)
- `php artisan migrate:fresh --seed` — reset DB + seed
- `npm run dev` — Vite dev server
- `npm run build` — build client assets
- `npm run build:ssr` — build client + SSR bundle
- `php artisan inertia:start-ssr` — start SSR server (port 13714)
- `php artisan inertia:check-ssr` — check SSR health
- `composer test` — full test suite (lint + types + test)
- `composer lint` — PHP CS fixer (Pint)
- `npm run lint` — ESLint
- `npm run format` — Prettier

## Architecture
- **Inertia.js SPA** — no REST API. Controllers return Inertia responses, data flows through Laravel → Inertia → React props.
- **Routes:** Type-safe via Laravel Wayfinder (`resources/js/routes/`)
- **Pages:** `resources/js/pages/` — satu file per route, layout di `app.tsx`
- **Components:** shadcn/ui di `resources/js/components/ui/`, app components di `resources/js/components/`
- **Models** di `app/Models/`, Controllers di `app/Http/Controllers/`

## Key Files
- `routes/web.php` — web routes
- `routes/settings.php` — settings routes
- `app/Models/Wisata.php` — model wisata (nama_wisata, alamat, deskripsi, foto)
- `resources/js/pages/` — Inertia page components
- `resources/js/components/app-sidebar.tsx` — sidebar navigation

## Memory
Claude memory files: `C:\Users\lenov\.claude\projects\c--Projek-Kuliah-Github-jelajah-kubar\memory\`
