Product Requirements Document (PRD)
Jelajah Kubar

Versi: 2.0

Status: Draft — Updated with current architecture & scope

Project Owner: Eben

---

## 1. Latar Belakang

Kabupaten Kutai Barat memiliki banyak destinasi wisata alam, budaya, dan sejarah yang belum terdokumentasi secara terpusat. Informasi mengenai tempat wisata masih tersebar di berbagai media sehingga wisatawan kesulitan memperoleh informasi yang lengkap dan terpercaya.

Jelajah Kubar dikembangkan sebagai platform digital yang menyediakan informasi wisata secara terpusat serta memanfaatkan kecerdasan buatan (AI) sebagai AI Content Assistant untuk meningkatkan kualitas konten.

---

## 2. Tujuan Produk

- Memudahkan wisatawan menemukan destinasi wisata di Kutai Barat.
- Menyediakan informasi wisata yang lengkap dan akurat.
- Mendukung promosi wisata daerah.
- Mengintegrasikan AI sebagai asisten penulis konten (AI Content Assistant), bukan sebagai sumber informasi utama.

---

## 3. Target Pengguna

**Wisatawan Lokal**
- Mencari tempat wisata untuk dikunjungi.

**Wisatawan Domestik**
- Mencari referensi wisata sebelum datang ke Kutai Barat.

**Wisatawan Internasional**
- Mencari informasi wisata dalam bahasa yang mudah dipahami (fitur multibahasa dapat menjadi pengembangan selanjutnya).

**Admin**
- Mengelola seluruh data wisata.

**Pengelola Wisata**
- Mengelola informasi destinasi yang mereka kelola (pengembangan selanjutnya).

---

## 4. Permasalahan

Saat ini:
- Informasi wisata tidak terpusat
- Deskripsi tidak lengkap
- Lokasi sulit ditemukan
- Jam operasional sering berubah
- Fasilitas tidak terdokumentasi

---

## 5. Solusi

Membangun web application yang menyediakan:
- Informasi wisata terpusat
- Galeri foto
- Peta lokasi (Leaflet + OpenStreetMap)
- Fasilitas
- Review & rating
- Favorit
- Rekomendasi
- AI Content Assistant (untuk admin)

---

## 6. Filosofi AI

AI pada Jelajah Kubar bukan sumber informasi utama, melainkan **AI Content Assistant** yang membantu admin mengubah data faktual menjadi konten berkualitas.

Prinsip utama:
- Database adalah **source of truth**.
- Fakta berasal dari admin, pengelola wisata, atau Dinas Pariwisata.
- AI tidak bertugas mencari atau menambahkan fakta baru.
- AI hanya membantu menyusun informasi agar lebih mudah dipahami, menarik, dan profesional.
- Seluruh output AI harus melalui review admin sebelum dipublikasikan.

Dengan pendekatan ini, risiko halusinasi diminimalkan dan kualitas informasi tetap di bawah kendali manusia.

---

## 7. Roadmap Pengembangan

### Versi 1.0 — Wisata Discovery
Fokus membangun fondasi aplikasi:
- Authentication (sudah selesai — login, register, 2FA, passkeys)
- CRUD Wisata + Kategori (admin)
- Halaman daftar wisata publik (grid, search, filter)
- Halaman detail wisata (info, galeri, fasilitas, maps)
- Dashboard Admin

### Versi 1.1 — Galeri & Fasilitas
- Upload multiple foto per wisata
- Galeri slider/lightbox di halaman detail
- CRUD Fasilitas + pivot

### Versi 1.5 — AI Content Assistant
- Generate deskripsi wisata
- Ringkasan wisata
- Highlight & tips
- SEO description & keywords
- Alt text gambar & caption media sosial

### Versi 2 — Fitur Komunitas
- Review & rating
- Favorit

### Versi 3 — AI untuk Pengguna
- AI Travel Planner
- AI Local Guide
- AI Review Summary

---

## 8. Fitur Utama

### Authentication
- Login ✅ (Fortify)
- Register ✅ (Fortify)
- Forgot Password ✅ (Fortify)
- Two-Factor Authentication ✅
- Passkeys / WebAuthn ✅

### Wisata
- List wisata (grid + search + filter kategori)
- Detail wisata (info, gallery, maps, fasilitas)
- Harga tiket
- Jam operasional
- Kontak
- Lokasi (Leaflet + OpenStreetMap)

### Review & Rating (V2)
- Rating
- Komentar

### Favorit (V2)
- Simpan wisata
- Hapus favorit

### Search
- Keyword
- Filter kategori
- Filter lokasi

### Dashboard Admin
- Kelola data (wisata, kategori, galeri, fasilitas)
- Statistik

### AI Content Assistant (V1.5)
- Generate deskripsi, ringkasan, highlight, tips
- Generate meta description & SEO keywords
- Generate alt text & caption

---

## 9. Functional Requirements

FR-01 — Pengguna dapat melihat daftar wisata.
FR-02 — Pengguna dapat melihat detail wisata.
FR-03 — Admin dapat menambah wisata.
FR-04 — Admin dapat mengubah wisata.
FR-05 — Admin dapat menghapus wisata.
FR-06 — Pengguna dapat mencari wisata.
FR-07 — Pengguna dapat memfilter wisata berdasarkan kategori.
FR-08 — Admin dapat mengelola kategori.
FR-09 — Admin dapat mengelola galeri foto.
FR-10 — Admin dapat mengelola fasilitas.
FR-11 — Admin dapat generate konten dengan AI (V1.5).
FR-12 — Pengguna dapat memberikan rating (V2).
FR-13 — Pengguna dapat menulis review (V2).
FR-14 — Pengguna dapat menyimpan favorit (V2).

---

## 10. Non Functional Requirements

- Responsive — mobile friendly
- Aman (auth, 2FA, email verification)
- Mudah digunakan
- Loading cepat (Inertia SSR)
- SEO Friendly (server-side rendering)
- Premium Minimalism design (refer to DESIGN.md)

---

## 11. Tech Stack

### Backend
- Laravel 13
- PostgreSQL (database)
- Laravel Fortify (auth)
- DeepSeek API (AI Content Assistant — V1.5)

### Frontend
- React 19 + Inertia 3
- TypeScript (strict mode)
- Tailwind CSS 4
- shadcn/ui (component library)
- Lucide React (icons)
- Leaflet + OpenStreetMap (maps)

### Build & Deployment
- Vite 8
- Inertia SSR (server-side rendering)
- Railway / VPS (planned)

---

## 12. Design System

Refer to full design system documentation:
`docs/ui/stitch_jelajah_kubar_tourism_platform/kubar_heritage_horizon/DESIGN.md`

### Ringkasan Design Tokens

| Token | Value | Source |
|-------|-------|--------|
| Primary | `#00685f` (Teal — rivers & rainforests) | Google Stitch |
| Secondary | `#855300` (Copper — gold craft & sunsets) | Google Stitch |
| Background | `#f8f9ff` (White-blue) | Google Stitch |
| Font | Instrument Sans | Project default |
| Icons | Lucide React | Project dependency |
| Card radius | 24px | Google Stitch |
| Button shape | Pill (`rounded-full`) | Google Stitch |
| Layout max-width | 1280px | Google Stitch |
| Grid | 12-col desktop, 4-col mobile | Google Stitch |

### Layout
- Fixed-Fluid hybrid grid
- 1280px max-width container
- 12-column grid (desktop), 4-column (mobile)
- Base-8 spacing system
- Progressive disclosure pattern untuk halaman detail

---

## 13. User Experience

Halaman detail wisata mengutamakan informasi yang mudah dipindai (scannable):

1. Foto utama (hero)
2. Nama wisata
3. Lokasi
4. Rating
5. Harga tiket
6. Jam operasional
7. Highlight utama
8. Galeri
9. Peta lokasi
10. Artikel lengkap (opsional — progressive disclosure)

---

## 14. Success Metrics

- Pengguna dapat menemukan informasi wisata dengan mudah.
- Admin dapat mengelola data tanpa kesulitan.
- AI mampu menghasilkan konten yang relevan berdasarkan data wisata.
- Waktu muat halaman tetap baik meskipun jumlah data bertambah.

---

## 15. Future Roadmap

### Versi 2:
- Multi bahasa
- Review & rating
- Favorit
- Event wisata

### Versi 3:
- AI Travel Planner
- AI Local Guide
- AI Review Summary
- Booking & tiket online
- Cuaca
- Notifikasi
- PWA
- Mobile App
