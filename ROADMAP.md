# Roadmap — Jelajah Kubar

> **Visi:** Platform digital informasi wisata Kabupaten Kutai Barat yang terpusat, menggunakan AI sebagai asisten konten untuk meningkatkan kualitas informasi.

---

## Status Legend

| Simbol | Arti |
|--------|------|
| ✅ | Selesai |
| 🟡 | Parsial / perlu polish |
| ⏳ | Belum dimulai |
| 📅 | Direncanakan |

---

## ✅ V1 — Fondasi Aplikasi

### ✅ V1.0 — Wisata Discovery
- [x] Authentication (Fortify: login, register, 2FA, passkeys, email verification)
- [x] Model Wisata + Kategori
- [x] CRUD Wisata (admin)
- [x] CRUD Kategori (admin)
- [x] Halaman daftar wisata (grid, search, filter kategori)
- [x] Halaman detail wisata (info, fasilitas, galeri, map)
- [x] Dashboard Admin
- [x] Sidebar navigasi
- [x] Leaflet Map interaktif (V1.2)

### ✅ V1.1 — Galeri & Fasilitas
- [x] Migration + model Galeri & Fasilitas
- [x] Upload foto (drag & drop, storage)
- [x] Galeri grid di detail wisata
- [x] Fasilitas badges
- [x] Manage galeri admin
- [x] Manage fasilitas admin

### ✅ V1.5 — AI Content Assistant
- [x] DeepSeek API integration
- [x] Generate deskripsi, ringkasan, highlight, tips
- [x] Generate SEO meta, keywords, alt text, caption
- [x] Review & edit sebelum publish
- [x] Anti-halucination prompt

### ✅ Polish V1
- [x] Foto real (upload + storage + tampil)
- [x] Welcome page (hero, stats, featured, navbar)
- [x] Admin dark theme
- [x] Search enhancement (ILIKE, multi-field, debounce, ranking)
- [x] Card clickable + animasi hover
- [x] Bug fixes (slug duplicate, nullable fields, namespace)

---

## ✅ V2 — Fitur Komunitas

- [x] Review & Rating (1-5 bintang, komentar, edit, hapus)
- [x] Favorit / Wishlist (toggle, halaman sendiri)
- [x] Rating average real-time
- [x] Sidebar link favorit

---

## 🟡 Polish Lanjutan

| Item | Prioritas | Status | Catatan |
|------|-----------|--------|---------|
| Galeri lightbox (klik foto → preview) | Rendah | 🟡 | Bisa pakai Dialog shadcn/ui |
| Highlight keyword di hasil search | Rendah | 🟡 | Parsing di frontend |
| Upload foto dari form wisata (file input) | Rendah | 🟡 | Udah partial via FileUpload component |
| Hero foto dari galeri (is_primary) | Rendah | 🟡 | Udah ambil primary/galeri, tapi fallback gradient |

---

## ⏳ V3 — AI untuk Pengguna

| Fitur | Prioritas | Catatan |
|-------|-----------|---------|
| AI Travel Planner | Sedang | Input durasi + budget → itinerary |
| AI Local Guide | Sedang | Tanya jawab tentang destinasi (RAG) |
| AI Review Summary | Rendah | Rangkuman otomatis review pengguna |
| Semantic Search | Rendah | Cari berdasarkan makna, bukan keyword |

---

## 📅 V4 — Fitur Lanjutan

| Fitur | Prioritas | Catatan |
|-------|-----------|---------|
| Multi bahasa | Sedang | Indonesia + Inggris |
| Event wisata | Rendah | CRUD event + tampil di kalender |
| Pencarian lanjutan | Sedang | Autocomplete, search history, filter harga/fasilitas |
| Sorting | Rendah | Nama, rating, terbaru, terdekat |

---

## 📅 V5 — Skalabilitas & Monetisasi

| Fitur | Prioritas | Catatan |
|-------|-----------|---------|
| Role pengelola wisata | Sedang | Pisah admin vs pengelola |
| Booking / Tiket online | Rendah | Butuh partnership |
| PWA (Progressive Web App) | Rendah | Installable, offline |
| Notifikasi | Rendah | Email / in-app |
| Deployment production | Sedang | Railway / VPS |

---

## Catatan Teknis

### Teknologi
| Stack | Versi |
|-------|-------|
| Laravel | 13.x |
| React | 19.x |
| Inertia.js | 3.x |
| TypeScript | 5.7 |
| Tailwind CSS | 4.x |
| PostgreSQL | 16.x |
| Leaflet + OSM | Maps |
| DeepSeek API | AI |

### AI Philosophy
- Database adalah **source of truth**
- AI hanya **content assistant**, bukan sumber informasi
- Semua output AI harus **direview admin** sebelum publish
- Anti-halucination: prompt eksplisit, data faktual terbatas

### Design System
- Palet: Teal (`#00685f`) + Copper (`#855300`)
- Font: Instrument Sans
- Layout: 1280px max-width, 12-grid
- Shape: 24px radius (cards), pill (buttons/chips)
- Icons: Lucide React

---

*Roadmap ini diperbarui secara berkala. Untuk detail perubahan per rilis, lihat [CHANGELOG.md](CHANGELOG.md).*
