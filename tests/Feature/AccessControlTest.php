<?php

use App\Models\Review;
use App\Models\SavedPlan;
use App\Models\User;
use App\Models\Wisata;

function makeWisata(array $attrs = []): Wisata
{
    return Wisata::create($attrs + [
        'nama_wisata' => 'Air Terjun Tes',
        'alamat' => 'Jl. Tes',
        'deskripsi' => 'Deskripsi',
        'is_active' => true,
    ]);
}

test('wisata nonaktif tidak bisa dibuka publik', function () {
    $wisata = makeWisata(['is_active' => false]);

    $this->get(route('wisata.show', $wisata))->assertNotFound();
});

test('wisata aktif bisa dibuka dan tidak membocorkan email reviewer', function () {
    $wisata = makeWisata();
    $reviewer = User::factory()->create(['email' => 'rahasia@example.com']);
    Review::create(['wisata_id' => $wisata->id, 'user_id' => $reviewer->id, 'rating' => 5, 'komentar' => 'Bagus sekali tempatnya']);

    $response = $this->get(route('wisata.show', $wisata))->assertOk();

    expect($response->getContent())->not->toContain('rahasia@example.com');
});

test('favorit dan review ditolak untuk wisata nonaktif', function () {
    $wisata = makeWisata(['is_active' => false]);
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('favorit.toggle', $wisata))->assertNotFound();
    $this->actingAs($user)->post(route('review.store', $wisata), ['rating' => 5, 'komentar' => 'Komentar cukup panjang'])->assertNotFound();
});

test('non-admin mendapat 403 di area admin', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('admin.dashboard'))
        ->assertForbidden();
});

test('admin bisa membuka dashboard admin', function () {
    $admin = User::factory()->create();
    $admin->forceFill(['is_admin' => true])->save();

    $this->actingAs($admin)->get(route('admin.dashboard'))->assertOk();
});

test('user tidak bisa menghapus review milik orang lain', function () {
    $wisata = makeWisata();
    $owner = User::factory()->create();
    $review = Review::create(['wisata_id' => $wisata->id, 'user_id' => $owner->id, 'rating' => 4, 'komentar' => 'Komentar cukup panjang']);

    $this->actingAs(User::factory()->create())
        ->delete(route('review.destroy', $review))
        ->assertForbidden();
});

test('user tidak bisa menghapus saved plan milik orang lain', function () {
    $owner = User::factory()->create();
    $plan = SavedPlan::create([
        'user_id' => $owner->id, 'title' => 'Plan', 'durasi' => 2, 'budget' => '1jt', 'minat' => null, 'result' => ['days' => []],
    ]);

    $this->actingAs(User::factory()->create())
        ->delete(route('saved-plans.destroy', $plan))
        ->assertForbidden();
});

test('saved plan menolak result yang bukan JSON', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('saved-plans.store'), ['durasi' => 2, 'budget' => '1jt', 'result' => 'bukan json{'])
        ->assertSessionHasErrors('result');
});

test('endpoint AI dibatasi per IP untuk tamu', function () {
    foreach (range(1, 10) as $i) {
        $this->post(route('local-guide.ask'), [])->assertStatus(302);
    }

    $this->post(route('local-guide.ask'), [])->assertStatus(429);
});

test('daftar wisata mengirim rata-rata rating untuk kartu', function () {
    $wisata = makeWisata();
    $a = User::factory()->create();
    $b = User::factory()->create();
    Review::create(['wisata_id' => $wisata->id, 'user_id' => $a->id, 'rating' => 5, 'komentar' => 'Bagus sekali tempatnya']);
    Review::create(['wisata_id' => $wisata->id, 'user_id' => $b->id, 'rating' => 4, 'komentar' => 'Cukup bagus tempatnya']);

    $this->get(route('wisata.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('wisata/index')
            ->where('wisatas.data.0.reviews_avg_rating', fn ($v) => (float) $v === 4.5));
});
