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
