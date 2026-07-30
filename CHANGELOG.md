# Changelog — Jelajah Kubar

Semua perubahan signifikan pada proyek ini akan dicatat di sini.

Format mengacu pada [Keep a Changelog](https://keepachangelog.com/id/),
dan versi mengikuti [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2026-07-30

### Added
#### V1.0 — Wisata Discovery
- Migrations: tabel `kategoris`, `wisata_user_favorit`, field baru di `wisatas` (slug, kategori_id, koordinat, harga, jam, kontak, is_active)
- Models: `Wisata` (slug otomatis, relasi kategori/galeri/fasilitas/favorit), `Kategori`
- Controllers: `WisataController` (index & show publik), `Admin\WisataController` (CRUD), `Admin\KategoriController`, `Admin\DashboardController`
- Halaman publik: daftar wisata (`/wisata`) dengan grid + search + filter kategori, detail wisata (`/wisata/{slug}`)
- Halaman admin: CRUD wisata, CRUD kategori, dashboard statistik
- Sidebar: link "Jelajahi Wisata" publik + group Admin
- Components: `SearchHero`, `CategoryChips`, `WisataCard`, `WisataPlanCard`

#### V1.1 — Galeri & Fasilitas
- Migrations: tabel `galeris`, `fasilitas`, pivot `fasilitas_wisata`
- Models: `Galeri`, `Fasilitas`
- Controllers: `Admin\GaleriController`, `Admin\FasilitasController`
- Halaman admin galeri (pilih wisata → upload/hapus foto)
- Halaman admin fasilitas (CRUD)
- Galeri grid di detail wisata, fasilitas badges
- Seeder: 10 fasilitas default + attach ke semua destinasi

#### V1.2 — Leaflet Map
- Component `WisataMap` dengan OpenStreetMap tile, marker, popup
- Scroll zoom disabled default, enable on click
- Detail wisata menampilkan map interaktif dari koordinat database

#### V1.5 — AI Content Assistant
- Config `config/ai.php` untuk DeepSeek API
- Service `AiContentService` — 2 API calls (narrative + metadata)
- Anti-halucination prompt (hanya gunakan data faktual)
- Controller + route `POST /admin/wisata/{id}/generate-content`
- Tombol "Generate Content" di form edit wisata
- Panel preview 8 output AI (deskripsi, ringkasan, highlight, tips, SEO meta, keywords, alt text, caption)
- Apply All to Form + Discard

#### V2 — Review, Rating & Favorit
- Migration: tabel `reviews` (1 user 1 review per wisata)
- Models: `Review`, relasi `reviews()` di Wisata & User
- Relasi `favoritWisatas()` di User
- Controllers: `ReviewController` (CRUD), `FavoritController` (toggle + index)
- Halaman favorit (`/favorit`) dengan grid wisata favorit
- Sidebar link "Favorit"
- Form review + rating bintang di detail wisata
- Rating average real-time dari database

#### Polish & Infrastructure
- **Theme**: Admin panel dark theme (bg-zinc-950, card bg-zinc-900, teal accent)
- **Welcome page**: Hero section, stats, featured destinations grid, navbar guest/login
- **Foto real**: Drag & drop upload component (`FileUpload`), storage symlink, upload ke `storage/app/public/wisata/`, append `foto_url` di model
- **Idempotent seeders**: `updateOrCreate` untuk menghindari duplicate saat seed ulang
- **CLAUD.md**: Dokumentasi proyek untuk Claude
- **Memory files**: Claude memory di `C:\Users\lenov\.claude\projects\...\memory\`
- **MCP**: Laravel Boost MCP server di `.claude/settings.local.json`

### Fixed
- Typo namespace `use app\Models` → `use App\Models` di WisataSeeder
- Class name `wisata` → `WisataSeeder`
- WisataSeeder tidak dipanggil di DatabaseSeeder
- `deskripsi` pakai `string()` → `text()` di migration
- APP_NAME, timezone (Asia/Makassar), locale (id)
- Foto & deskripsi nullable di database (migration baru)
- Slug duplicate error → `$request->merge(['slug' => ...])` sebelum validasi
- Admin resource parameter names (`{wisatum}` → `{wisata}`)
- AI Content flash data tidak sampai ke frontend → return Inertia langsung
- Duplikasi tombol "Save to Wishlist" → dirapihkan ke `WisataPlanCard`

### Search Enhancement
- Case-insensitive search (LOWER + ILIKE)
- Multi-field: nama_wisata, alamat, kategori, fasilitas
- Ranking relevansi: exact match → prefix → partial
- Debounce 300ms di frontend
- Min 2 karakter validasi
- GIN trigram indexes (`pg_trgm`) untuk performa
- Empty state dengan saran pencarian + kategori

### Security
- 2FA (Two-Factor Authentication)
- Passkeys / WebAuthn
- Email verification
- Rate limiting login (5/min)
- Authorization di controllers (user_id check)

---

## [1.0.0-rc.1] — 2026-07-23

### Added
- Init proyek dari Laravel React Starter Kit
- Model `Wisata` + migration + seeder awal (3 destinasi Kukar)
- Laravel Fortify: login, register, 2FA, passkeys, email verification
- Konfigurasi PostgreSQL
- Inertia SSR setup
- Layout: sidebar, auth, settings
- Halaman: welcome, dashboard, auth pages, settings

---

## Daftar Isi

- `[1.0.0]` — Rilis penuh V1 + V2
- `[1.0.0-rc.1]` — Starter kit + setup awal
