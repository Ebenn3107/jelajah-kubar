# Rencana Lanjutan — Jelajah Kubar

Dokumen serah-terima antar sesi (termasuk sesi Claude cloud). Baca `CLAUDE.md` dulu untuk stack dan perintah.
Terakhir diperbarui: 2026-10-02.

## Status
- **Tahap 1 (bug + keamanan): selesai.** Email reviewer tidak bocor, wisata nonaktif 404, rate limit AI per IP, `is_admin` tidak mass-assignable, validasi SavedPlan/Wisata/Galeri, retrieval Local Guide, tes diperbaiki (+9 tes di `tests/Feature/AccessControlTest.php`).
- **Tahap 2 (UX non-visual): selesai.** Copy Bahasa Indonesia, publik dipaksa light (`.public-light` di `resources/css/app.css`), admin mengikuti tema, token warna `brand`, a11y, loading/empty state, komponen bersama (`PlanView`, `Pagination`, `lib/itinerary.ts`).
- Tahap 2 **tidak mengubah desain visual**: tata letak, palet, dan tipografi masih sama seperti sebelumnya.

## Tahap 3 — Redesign visual anti "AI slop" (berikutnya)
Tujuan: tampilan khas Kutai Barat/Borneo, bukan template generik.

Cara kerja:
1. Pakai skill **hallmark** (`.agents/skills/hallmark/SKILL.md`, sumber `nutlope/hallmark`) mode *audit/redesign* pada halaman yang ada, lalu skill `frontend-design`.
2. Referensi desain: `docs/ui/stitch_jelajah_kubar_tourism_platform/` (ada `DESIGN.md`) dan `docs/ui/sign-ui/` (halaman masuk/daftar). `DESIGN.md` mendefinisikan palet lengkap (termasuk sekunder amber `#855300`) dan skala tipografi (Instrument Sans) yang belum dipakai di kode.
3. Urutan halaman: beranda → `/wisata` (hero, kartu, chips) → detail wisata → Travel Planner / Pemandu Lokal → login/register → admin.
4. Jadikan token di `resources/css/app.css` (`--color-brand`, dst.) sebagai sumber tunggal; tambahkan token baru di sana, jangan hardcode.

Progres Tahap 3 (2026-10-02):
- **Beranda selesai** (`resources/js/pages/welcome.tsx`): hero dua kolom (teks kiri, foto kanan), destinasi pilihan satu besar + dua bertumpuk, dua panel alat bantu (Perencana, Pemandu). Statistik tidak lagi jadi band sendiri, melainkan satu baris di bawah pencarian. Dicek di Chromium pada 320/375/1440 px tanpa overflow horizontal, serta kondisi tanpa destinasi unggulan.
- Token baru di `resources/css/app.css`: `copper`, `amber`, `amber-soft`, `terra`, `surface`, `surface-low`, `surface-high`, `brand-soft`, `brand-deep`, `outline` (diambil dari `DESIGN.md` Stitch). Pakai token ini, jangan hardcode warna.
- Keputusan sementara: `DESIGN.md` Stitch jadi dasar palet/tipografi, struktur halaman bebas. Beranda tidak punya layar Stitch. Untuk halaman yang punya (Explore, Detail, Sign-in/up), belum diputuskan apakah mengikuti persis.
- **`/wisata` selesai** (arah baru, bukan mengikuti layar Stitch persis): foto hero besar dibuang (menduplikasi beranda dan mendorong hasil ke bawah), diganti header ringkas + toolbar sticky di bawah navbar (`top-20`) berisi `SearchBar` dan `CategoryChips`. Kartu `WisataCard` bergaya editorial (foto 4:3, kategori tembaga, harga tiket bila ada), emoji di chips dibuang, ada pil filter aktif + "Hapus semua filter", saran pencarian tanpa duplikat. Komponen baru: `components/search-bar.tsx`. `components/search-hero.tsx` sudah dihapus.
- **Detail wisata selesai** (`wisata/show.tsx`, `wisata-plan-card.tsx`): hero foto 80vh diganti judul di atas + galeri mosaik (1 besar + hingga 4 kecil, tombol "Lihat n foto" membuka lightbox yang ada; tanpa sel kosong untuk 1/2/3/5 foto, dan fallback ke foto sampul / gradien). Info praktis jadi daftar `dl` (jam, tiket, kontak dengan `tel:`, alamat), fasilitas jadi chip amber, link "Petunjuk arah" ke Google Maps bila ada koordinat, tombol Simpan muncul di header untuk mobile. Semua logika review/favorit tidak diubah. Dicek di Chromium 320/375/1280/1440 px dengan beberapa skenario data.
- **Sisa halaman selesai (2026-10-02, sesi berikutnya):** navbar/footer, Travel Planner, Pemandu Lokal, Rencana Saya, Favorit, auth (non-login/register), dashboard admin, terjemahan pengaturan/2FA/passkey, ESLint bersih. Lihat `docs/REVIEW-TAHAP-3.md` untuk daftar lengkap, keputusan yang perlu disetujui, dan yang belum diverifikasi.
- Keputusan desain Tahap 3 disetujui pemilik (hero foto dibuang, emoji chips dibuang, tata letak admin tidak dirombak). Tahap 3 dianggap selesai; sisa pekerjaan ada di bagian "Sisa pekerjaan" dan "Belum diverifikasi" pada `docs/REVIEW-TAHAP-3.md`. Navbar/footer (`public-layout.tsx`) belum disentuh.
- Cara cek visual tanpa backend: vite dev server sementara dengan stub `@inertiajs/react` dan CSS yang menambahkan `@source '../resources/js'`, lalu Playwright (`/opt/node-tools`). Folder harness tidak di-commit.

## Sisa pekerjaan (kecil)
Dikerjakan 2026-10-02 (sesi cloud): login/register berbahasa Indonesia, sanitasi prompt (`sanitizeUserInput`), escape LIKE di `wisata/index`, Local Guide via GROUP BY, `heroWisata` orderBy, migrasi indeks `ai_logs(user_id, created_at)` dan `galeris.sort_order` unsigned integer, `WisataSeeder` memakai `firstOrCreate`, hitungan chips hanya wisata aktif, `eslint --fix`.
**Belum diverifikasi** (sesi cloud tidak punya `vendor/`: composer diblok network policy dan PHP 8.3 < 8.4): jalankan `composer test`, `php artisan migrate`, dan cek manual `/wisata` + Local Guide + Travel Planner.

Masih tersisa:
- `AiQuotaService` belum dipakai di endpoint publik (planner/guide, `user_id` null); saat ini hanya rate limit per IP. Perlu keputusan: kuota harian per IP atau wajib login.
- Pint (`composer lint`) belum dijalankan.
- 3 error ESLint `react-hooks/set-state-in-effect`: `galeri-lightbox.tsx`, `public-layout.tsx`, `admin/wisata/form.tsx` (butuh perubahan perilaku, uji di browser).
- SSR: tidak ada bug ditemukan. Plugin `@inertiajs/vite` memakai `app.tsx` sebagai entry SSR bila `ssr.tsx` tidak ada, `localStorage` hanya diakses di dalam fungsi yang dijaga, dan Leaflet di-import dinamis. Tetap perlu dicoba: `npm run build:ssr` lalu `php artisan inertia:start-ssr`.
- Respons gagal AI tetap HTTP 200 dengan pesan error — sengaja (status non-2xx memicu modal error Inertia).

## Cara menjalankan lokal
- Butuh PostgreSQL (`jelajah-kubar`) dan `.env` (lihat `.env.example`).
- `php artisan serve` + `npm run dev` (SSR/queue tidak wajib).
- Admin default (hanya env local): `php artisan db:seed` → `test@example.com` / `password`.
- Verifikasi: `vendor/bin/pest`, `npx tsc --noEmit`, `npm run build`.

## Catatan untuk sesi cloud
- Jangan commit `.env`, `.claude/` (symlink absolut Windows), atau file zip di `public/images/` dan `docs/ui/`.
- Belum ada pengecekan visual di browser untuk perubahan tahap 2; cek manual halaman utama setelah tiap perubahan UI.
