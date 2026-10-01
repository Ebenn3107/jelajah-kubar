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

Keputusan yang perlu ditanyakan ke pengguna sebelum mulai: halaman mana yang paling mengganggu, dan apakah mengikuti Stitch persis atau arah baru.

## Sisa pekerjaan (kecil)
- Terjemahkan `resources/js/pages/auth/login.tsx` dan `register.tsx` (masih Inggris). Idealnya digabung dengan redesign auth.
- SSR: `package.json` punya `build:ssr` tapi `resources/js/ssr.tsx` tidak ada, dan `use-appearance` mengakses `localStorage` di level modul. Perbaiki jika SSR mau diaktifkan (`composer dev` menjalankan `inertia:start-ssr`).
- Gaya kode: `pint --test` dan `eslint` melaporkan banyak pelanggaran lama di file yang tidak disentuh. Rapikan di commit terpisah (`composer lint`, `npm run lint`).
- Respons gagal AI (`TravelPlannerController`, `LocalGuideController`, `AiContentController`) tetap HTTP 200 dengan pesan error — sengaja, karena status non-2xx memicu modal error Inertia. Ubah hanya jika frontend ikut diubah.
- Backlog audit yang belum dikerjakan: `AiQuotaService` belum dipakai di endpoint publik (planner/guide, `user_id` null), prompt injection lewat `minat`/`question`, Local Guide menghitung kategori dengan memuat semua model (pakai `groupBy`), `wisata/index` belum meng-escape `%`/`_` di LIKE, `heroWisata` tanpa `orderBy`, indeks `ai_logs.user_id`, kolom `galeris.sort_order` bertipe tinyint (maks 255), seeder `WisataSeeder` menimpa edit admin saat di-seed ulang.
- Label "All" di chips kategori memakai total hasil filter, bukan total keseluruhan (`wisata/index.tsx`).

## Cara menjalankan lokal
- Butuh PostgreSQL (`jelajah-kubar`) dan `.env` (lihat `.env.example`).
- `php artisan serve` + `npm run dev` (SSR/queue tidak wajib).
- Admin default (hanya env local): `php artisan db:seed` → `test@example.com` / `password`.
- Verifikasi: `vendor/bin/pest`, `npx tsc --noEmit`, `npm run build`.

## Catatan untuk sesi cloud
- Jangan commit `.env`, `.claude/` (symlink absolut Windows), atau file zip di `public/images/` dan `docs/ui/`.
- Belum ada pengecekan visual di browser untuk perubahan tahap 2; cek manual halaman utama setelah tiap perubahan UI.
