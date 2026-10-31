# Ulasan anonim per ulasan — Desain

Tanggal: 2026-10-02

## Latar belakang

Halaman `wisata/show` menampilkan nama asli akun (`r.user.name`) di setiap ulasan, dan datanya ikut terkirim lewat props Inertia. Pengguna tidak punya pilihan. Awalnya diminta "profil publik"; setelah dibahas, kebutuhan sebenarnya adalah kontrol privasi, jadi cakupan diperkecil menjadi pilihan tampil/anonim **per ulasan**.

## Keputusan

- Pilihan anonim ditentukan saat menulis/mengedit ulasan, bukan di pengaturan profil.
- Default ulasan baru: **anonim**. Pengguna harus mencentang untuk menampilkan nama.
- Ulasan lama menjadi anonim (default migrasi). Nama yang sekarang terlihat di ulasan lama akan hilang.
- Nama saat registrasi tetap wajib dan tidak berubah.
- Tidak dibuat: halaman profil publik, `display_name`, `bio`, toggle `profil_publik`, poles `settings/profile`.

## Data

Satu migrasi: kolom `anonim` boolean, `default(true)`, di tabel `reviews`. Tambahkan ke `$fillable`/casts `Review`.

## Backend

- `ReviewController@store` dan `update` memvalidasi `anonim` sebagai boolean dan menyimpannya.
- `WisataController@show` (query `reviews` dengan `with('user:id,name')`): untuk ulasan anonim, kirim `user: null` dan jangan sertakan `user_id`. Penyamaran dilakukan di server agar tidak terbaca lewat props Inertia.
- `userReview` (ulasan milik pengguna yang sedang login) tetap dikirim utuh, termasuk nilai `anonim` untuk mengisi form edit.

## Frontend (`resources/js/pages/wisata/show.tsx`)

- Form ulasan baru dan form edit mendapat centang "Tampilkan nama saya", dengan teks bantu: "Jika tidak dicentang, ulasan tampil sebagai Pengguna anonim".
- Tipe `ReviewItem.user` menjadi `{ name: string } | null`, dan `user_id` dihapus dari tipe ulasan publik.
- Daftar ulasan menampilkan `r.user?.name ?? 'Pengguna anonim'`.

## Tes

Satu tes fitur: respons halaman wisata tidak memuat nama maupun `user_id` untuk ulasan anonim, dan memuat nama untuk ulasan non-anonim. Ditambah cek bahwa `store`/`update` menyimpan nilai `anonim`.

## Di luar cakupan

Halaman profil publik dan poles halaman pengaturan profil; bisa menjadi pekerjaan terpisah.
