# Ulasan Anonim Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pengguna memilih tampil dengan nama atau anonim per ulasan; ulasan anonim tidak membocorkan nama maupun `user_id` ke publik.

**Architecture:** Kolom boolean `anonim` (default `true`) di `reviews`. `WisataController@show` mengubah koleksi ulasan menjadi array publik di server (anonim → `user: null`, tanpa `user_id`). Form ulasan di `wisata/show.tsx` mendapat centang "Tampilkan nama saya".

**Tech Stack:** Laravel 13, Pest, Inertia 3 + React 19 + TypeScript.

Spec: `docs/superpowers/specs/2026-10-02-review-anonim-design.md`

---

## File Structure

- Create: `database/migrations/2026_10_02_000003_add_anonim_to_reviews_table.php`
- Create: `tests/Feature/ReviewAnonimTest.php`
- Modify: `app/Models/Review.php` (fillable + cast)
- Modify: `app/Http/Controllers/ReviewController.php` (validasi + simpan `anonim`)
- Modify: `app/Http/Controllers/WisataController.php:84-110` (maskir ulasan publik)
- Modify: `resources/js/pages/wisata/show.tsx` (tipe, state, form, daftar ulasan)

---

### Task 1: Migrasi dan model

**Files:**
- Create: `database/migrations/2026_10_02_000003_add_anonim_to_reviews_table.php`
- Modify: `app/Models/Review.php`

- [ ] **Step 1: Buat migrasi**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            // true = nama disembunyikan; ulasan lama ikut anonim (aman untuk privasi)
            $table->boolean('anonim')->default(true);
        });
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropColumn('anonim');
        });
    }
};
```

- [ ] **Step 2: Ubah model `Review`**

Tambah `'anonim'` ke `$fillable` dan cast:

```php
    protected $fillable = [
        'wisata_id',
        'user_id',
        'rating',
        'komentar',
        'anonim',
    ];

    protected function casts(): array
    {
        return ['anonim' => 'boolean'];
    }
```

- [ ] **Step 3: Jalankan migrasi**

Run: `php artisan migrate`
Expected: `2026_10_02_000003_add_anonim_to_reviews_table ... DONE`

- [ ] **Step 4: Commit**

```bash
git add database/migrations/2026_10_02_000003_add_anonim_to_reviews_table.php app/Models/Review.php
git commit -m "feat: tambah kolom anonim di tabel reviews"
```

---

### Task 2: Backend (TDD)

**Files:**
- Create: `tests/Feature/ReviewAnonimTest.php`
- Modify: `app/Http/Controllers/ReviewController.php`
- Modify: `app/Http/Controllers/WisataController.php:84-110`

- [ ] **Step 1: Tulis tes yang gagal**

```php
<?php

use App\Models\Review;
use App\Models\User;
use App\Models\Wisata;

function wisataAnonimTest(): Wisata
{
    return Wisata::create([
        'nama_wisata' => 'Air Terjun Anonim',
        'alamat' => 'Jl. Tes',
        'deskripsi' => 'Deskripsi',
        'is_active' => true,
    ]);
}

test('ulasan anonim tidak membocorkan nama maupun user_id', function () {
    $wisata = wisataAnonimTest();
    $reviewer = User::factory()->create(['name' => 'Budi Rahasia']);
    Review::create(['wisata_id' => $wisata->id, 'user_id' => $reviewer->id, 'rating' => 5, 'komentar' => 'Bagus sekali tempatnya', 'anonim' => true]);

    $response = $this->get(route('wisata.show', $wisata))->assertOk();

    $response->assertInertia(fn ($page) => $page
        ->where('wisata.reviews.0.user', null)
        ->missing('wisata.reviews.0.user_id'));
    expect($response->getContent())->not->toContain('Budi Rahasia');
});

test('ulasan non-anonim menampilkan nama', function () {
    $wisata = wisataAnonimTest();
    $reviewer = User::factory()->create(['name' => 'Siti Terbuka']);
    Review::create(['wisata_id' => $wisata->id, 'user_id' => $reviewer->id, 'rating' => 4, 'komentar' => 'Bagus sekali tempatnya', 'anonim' => false]);

    $this->get(route('wisata.show', $wisata))
        ->assertInertia(fn ($page) => $page->where('wisata.reviews.0.user.name', 'Siti Terbuka'));
});

test('review baru default anonim dan bisa memilih tampil nama', function () {
    $wisata = wisataAnonimTest();
    $user = User::factory()->create();
    $other = User::factory()->create();

    $this->actingAs($user)->post(route('review.store', $wisata), ['rating' => 5, 'komentar' => 'Komentar cukup panjang']);
    $this->actingAs($other)->post(route('review.store', $wisata), ['rating' => 5, 'komentar' => 'Komentar cukup panjang', 'anonim' => false]);

    expect(Review::where('user_id', $user->id)->value('anonim'))->toBeTrue()
        ->and(Review::where('user_id', $other->id)->value('anonim'))->toBeFalse();
});

test('update review mengubah pilihan anonim', function () {
    $wisata = wisataAnonimTest();
    $user = User::factory()->create();
    $review = Review::create(['wisata_id' => $wisata->id, 'user_id' => $user->id, 'rating' => 4, 'komentar' => 'Komentar cukup panjang', 'anonim' => true]);

    $this->actingAs($user)->put(route('review.update', $review), ['rating' => 4, 'komentar' => 'Komentar cukup panjang', 'anonim' => false]);

    expect($review->fresh()->anonim)->toBeFalse();
});
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `php artisan test tests/Feature/ReviewAnonimTest.php`
Expected: FAIL (nama bocor / `anonim` tidak tersimpan).

- [ ] **Step 3: `ReviewController` — validasi dan simpan `anonim`**

Di `store` dan `update`, tambahkan aturan pada array `validate`:

```php
            'anonim' => 'sometimes|boolean',
```

Di `store`, pada `Review::create([...])` tambahkan:

```php
                'anonim' => $validated['anonim'] ?? true,
```

`update` sudah memakai `$review->update($validated)`, jadi `anonim` ikut tersimpan bila dikirim.

- [ ] **Step 4: `WisataController@show` — maskir ulasan di server**

Ganti blok setelah `$wisata->load([...])` dengan menambahkan (sebelum `$userReview = null;`):

```php
        // Nama hanya dikirim untuk ulasan non-anonim; user_id tidak pernah dikirim
        $wisata->setRelation('reviews', $wisata->reviews->map(fn ($r) => [
            'id' => $r->id,
            'rating' => $r->rating,
            'komentar' => $r->komentar,
            'created_at' => $r->created_at,
            'user' => $r->anonim ? null : ['name' => $r->user->name],
        ]));
```

- [ ] **Step 5: Jalankan tes, pastikan lulus**

Run: `php artisan test tests/Feature/ReviewAnonimTest.php tests/Feature/AccessControlTest.php`
Expected: semua PASS.

- [ ] **Step 6: Commit**

```bash
git add tests/Feature/ReviewAnonimTest.php app/Http/Controllers/ReviewController.php app/Http/Controllers/WisataController.php
git commit -m "feat: sembunyikan nama pada ulasan anonim di sisi server"
```

---

### Task 3: Frontend

**Files:**
- Modify: `resources/js/pages/wisata/show.tsx`

- [ ] **Step 1: Tipe `ReviewItem`**

```tsx
interface ReviewItem {
    id: number;
    rating: number;
    komentar: string | null;
    user: { name: string } | null;
    anonim?: boolean;
    created_at: string;
}
```

(`anonim` hanya ada pada `userReview`, yang dikirim dari model utuh.)

- [ ] **Step 2: State dan payload**

Setelah state `reviewKomentar`:

```tsx
    const [reviewAnonim, setReviewAnonim] = useState(userReview?.anonim ?? true);
```

Ubah payload di `handleReviewSubmit` dan `handleReviewUpdate` menjadi `{ rating: reviewRating, komentar: reviewKomentar, anonim: reviewAnonim }`.

Pada tombol "Ubah" (di dalam `onClick`) tambahkan `setReviewAnonim(userReview.anonim ?? true);`.

- [ ] **Step 3: Centang di form**

Di dalam `<form>` ulasan, tepat setelah `<textarea ... />`:

```tsx
                                        <label className="mt-3 flex items-start gap-2 text-sm text-ink">
                                            <input
                                                type="checkbox"
                                                checked={!reviewAnonim}
                                                onChange={(e) => setReviewAnonim(!e.target.checked)}
                                                className="mt-0.5 size-4 accent-brand"
                                            />
                                            <span>
                                                Tampilkan nama saya
                                                <span className="block text-xs text-ink-muted">Jika tidak dicentang, ulasan tampil sebagai Pengguna anonim</span>
                                            </span>
                                        </label>
```

- [ ] **Step 4: Daftar ulasan**

Ganti `{r.user.name}` menjadi `{r.user?.name ?? 'Pengguna anonim'}`.

- [ ] **Step 5: Type-check dan lint**

Run: `npm run types:check && npm run lint:check`
Expected: tanpa error baru.

- [ ] **Step 6: Verifikasi manual di browser**

Run: `composer dev`, login, buka halaman wisata, tulis ulasan tanpa centang → tampil "Pengguna anonim" saat dilihat tanpa login; ubah dengan centang → nama tampil.

- [ ] **Step 7: Commit**

```bash
git add resources/js/pages/wisata/show.tsx
git commit -m "feat: pilihan tampil nama atau anonim di form ulasan"
```

---

### Task 4: Verifikasi akhir

- [ ] **Step 1:** Run `composer lint` lalu `php artisan test`. Expected: semua PASS.
