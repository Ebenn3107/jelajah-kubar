# Deploy ke Shared Hosting (cPanel)

Shared hosting tidak bisa menjalankan proses Node atau worker yang terus hidup, jadi:
- **SSR dimatikan** (`INERTIA_SSR_ENABLED=false`) — halaman tetap jalan, dirender di browser.
- **Antrean sinkron** (`QUEUE_CONNECTION=sync`) — tidak perlu `queue:work`.
- **Aset dibuild di laptop**, bukan di server.

## Syarat hosting
- PHP **8.3+** dengan ekstensi `pdo_pgsql` (atau `pdo_mysql`), `mbstring`, `openssl`, `fileinfo`, `bcmath`, `intl`.
- Database PostgreSQL. Kalau hanya ada MySQL/MariaDB juga bisa: set `DB_CONNECTION=mysql`.
- Akses **Terminal/SSH** di cPanel sangat disarankan (untuk `artisan`).
- Domain/subdomain yang **document root**-nya bisa diarahkan ke folder `public`.

## 1. Siapkan paket di laptop
```bash
git pull
composer install --no-dev --optimize-autoloader
npm ci
npm run build
```
Lalu zip seluruh folder proyek **kecuali** `node_modules`, `.git`, `.env`, `tests`, `bootstrap/ssr`.
(`vendor` dan `public/build` wajib ikut — keduanya tidak ada di git.)
Setelah zip jadi, jalankan `composer install` lagi di laptop supaya paket dev kembali untuk pengembangan.

## 2. Upload ke server
1. Upload zip ke folder di luar `public_html`, misalnya `/home/USER/jelajah-kubar`, lalu ekstrak.
2. Di cPanel → **Domains**, arahkan document root domain/subdomain ke `/home/USER/jelajah-kubar/public`.
   - Kalau document root tidak bisa diubah (harus `public_html`): pindahkan isi `public/` ke `public_html/`,
     lalu di `public_html/index.php` ganti `__DIR__.'/../` menjadi `__DIR__.'/../jelajah-kubar/` (dua baris: `vendor/autoload.php` dan `bootstrap/app.php`).
3. Buat database + user di cPanel (**PostgreSQL Databases** atau **MySQL Databases**).

## 3. Buat `.env` di server
Salin `.env.example` jadi `.env`, lalu ubah:
```
APP_NAME="Jelajah Kubar"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://domain-anda.com
APP_LOCALE=id
# Cadangan tetap en: lang/id belum punya pagination.php, dan label paginasi perlu teks bawaan Laravel
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=id_ID

INERTIA_SSR_ENABLED=false
QUEUE_CONNECTION=sync
LOG_LEVEL=error

DB_CONNECTION=pgsql
DB_HOST=localhost
DB_DATABASE=...
DB_USERNAME=...
DB_PASSWORD=...

DEEPSEEK_API_KEY=...

ADMIN_EMAIL=email-admin@domain-anda.com
ADMIN_PASSWORD=password-kuat-sementara

MAIL_MAILER=smtp
MAIL_HOST=mail.domain-anda.com
MAIL_PORT=465
MAIL_SCHEME=smtps
MAIL_USERNAME=noreply@domain-anda.com
MAIL_PASSWORD=...
MAIL_FROM_ADDRESS=noreply@domain-anda.com
```
Akun email bisa dibuat di cPanel → **Email Accounts** (dibutuhkan untuk verifikasi email & reset password).

## 4. Jalankan di Terminal cPanel
```bash
cd ~/jelajah-kubar
php artisan key:generate --force
php artisan migrate --force
php artisan db:seed --force      # data wisata + akun admin dari ADMIN_EMAIL/ADMIN_PASSWORD
php artisan storage:link
php artisan optimize
```
Setelah seeding, **hapus `ADMIN_PASSWORD` dari `.env`**, jalankan `php artisan optimize` lagi, lalu ganti password lewat halaman Pengaturan → Keamanan.

Kalau `storage:link` gagal (symlink diblokir host), buat symlink lewat File Manager atau minta support hosting;
tanpa itu foto upload admin tidak akan tampil.

Pastikan folder `storage/` dan `bootstrap/cache/` bisa ditulis (permission 755/775).

## Update berikutnya
1. Di laptop: `git pull`, `composer install --no-dev --optimize-autoloader`, `npm run build`.
2. Upload ulang file yang berubah (minimal `app/`, `resources/`, `routes/`, `config/`, `database/`, `public/build/`, dan `vendor/` bila dependensi berubah). Jangan timpa `.env` dan `storage/`.
3. Di server: `php artisan migrate --force && php artisan optimize`.

## Tanpa akses Terminal?
Sebagian besar langkah `artisan` di atas butuh Terminal. Kalau hosting tidak menyediakannya, tanyakan ke support hosting
apakah SSH bisa diaktifkan — itu jauh lebih aman daripada membuat route khusus untuk menjalankan `artisan`.
