# Panduan review — Redesign Tahap 3

Branch: `claude/rencana-selanjutnya-5nmhko`. Semua perubahan hanya di frontend (`resources/js`, `resources/css/app.css`), kecuali bagian "Backlog keamanan" di bawah.

## Cara menjalankan
```
git fetch origin claude/rencana-selanjutnya-5nmhko && git checkout claude/rencana-selanjutnya-5nmhko
composer install && npm ci
php artisan migrate        # ada 2 migrasi baru (indeks ai_logs, sort_order galeri)
composer dev               # atau: php artisan serve + npm run dev
composer test              # BELUM pernah dijalankan (lihat "Belum diverifikasi")
```

## Halaman yang didesain ulang (urutan saran review)
| Halaman | URL | File utama |
|---|---|---|
| Beranda | `/` | `pages/welcome.tsx` |
| Daftar destinasi | `/wisata` | `pages/wisata/index.tsx`, `components/{search-bar,category-chips,wisata-card,pagination}.tsx` |
| Detail destinasi | `/wisata/{slug}` | `pages/wisata/show.tsx`, `components/wisata-plan-card.tsx` |
| Navbar + footer (semua halaman publik) | — | `layouts/public-layout.tsx` |
| Perencana Perjalanan | `/travel-planner` | `pages/travel-planner/index.tsx`, `components/plan-view.tsx` |
| Pemandu Lokal | `/local-guide` | `pages/local-guide/index.tsx` |
| Rencana Saya | `/saved-plans`, `/saved-plans/{id}` | `pages/saved-plans/*` |
| Favorit | `/favorit` | `pages/favorit/index.tsx` |
| Auth: lupa/atur ulang/konfirmasi kata sandi, verifikasi email, 2FA | `/forgot-password` dst. | `layouts/auth/auth-simple-layout.tsx`, `pages/auth/*`, `lib/auth-styles.ts` |
| Login / Daftar | `/login`, `/register` | hanya diterjemahkan (sudah mengikuti desain `docs/ui/sign-ui`) |
| Admin: dashboard | `/admin/dashboard` | `pages/admin/dashboard.tsx` |
| Admin: wisata, kategori, galeri, fasilitas, log AI | `/admin/*` | hanya token warna + terjemahan, tata letak tidak diubah |
| Pengaturan | `/settings/*` | hanya terjemahan |

Komponen baru: `components/page-header.tsx`, `components/search-bar.tsx`. Token warna baru ada di `resources/css/app.css` (blok `@theme`), diambil dari `docs/ui/.../DESIGN.md`.

## Keputusan desain (disetujui pemilik 2026-10-02)
Keputusan 1, 2, dan 3 diterima; untuk 3, tata letak admin **tidak dirombak**.

1. **Tidak mengikuti layar Stitch persis.** Palet dan tipografi dari `DESIGN.md` dipakai, struktur halaman dirancang ulang (hero foto besar di `/wisata` dan detail dibuang karena mendorong konten ke bawah dan menduplikasi beranda).
2. **Emoji di chips kategori dibuang.**
3. **Footer admin sidebar:** "Repository"/"Documentation" (sisa starter kit Laravel) diganti "Lihat situs"; logo Laravel diganti ikon pohon.
4. **Halaman admin tidak ditata ulang**, hanya konsistensi warna dan bahasa. Beri tahu kalau ingin dirombak.
5. Admin tetap mengikuti tema terang/gelap; halaman publik dipaksa terang (`.public-light`).

## Belum diverifikasi (sesi cloud tidak punya PHP 8.4 / vendor)
- `composer test`, `php artisan migrate`, dan semua perubahan PHP hanya lolos `php -l`.
- Tampilan di Laravel sungguhan (data nyata, font Instrument Sans dari Bunny, tile peta OSM). Pratinjau saya memakai harness Vite + data contoh di Chromium 320/375/1280/1440 px: tanpa error konsol dan tanpa scroll horizontal.
- Halaman admin (wisata/kategori/galeri/fasilitas/log AI), pengaturan, login/register, dan 2FA hanya dicek lewat lint + tipe, bukan visual (kecuali dashboard admin dan halaman auth sederhana).
- `npm run build` / `build:ssr` (butuh `php artisan wayfinder:generate`).
- ESLint (`npx eslint resources/js`) dan `tsc` bersih; Pint belum dijalankan.

## Catatan teknis
- Rating di kartu `/wisata` hanya tampil bila controller mengirim `rating` (belum dihitung di `WisataController@index`).
- `components/search-hero.tsx` sudah tidak dipakai (belum dihapus).
- Warna `teal-*` untuk badge status di admin sengaja dibiarkan.
