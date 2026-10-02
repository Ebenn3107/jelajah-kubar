<?php

use App\Models\Wisata;

function buatWisata(array $attributes = []): Wisata
{
    return Wisata::create(array_merge([
        'nama_wisata' => 'Pulau Kumala',
        'alamat' => 'Tenggarong, Kutai Kartanegara',
        'deskripsi' => 'Pulau wisata di tengah Sungai Mahakam.',
    ], $attributes));
}

test('slug dibuat otomatis dari nama wisata', function () {
    expect(buatWisata()->slug)->toBe('pulau-kumala');
});

test('slug diberi akhiran angka jika sudah dipakai', function () {
    buatWisata();

    expect(buatWisata()->slug)->toBe('pulau-kumala-2')
        ->and(buatWisata()->slug)->toBe('pulau-kumala-3');
});

test('slug yang diisi manual tidak ditimpa', function () {
    expect(buatWisata(['slug' => 'slug-kustom'])->slug)->toBe('slug-kustom');
});

test('slug tidak berubah saat nama wisata diganti', function () {
    $wisata = buatWisata();

    $wisata->update(['nama_wisata' => 'Pulau Kumala Baru']);

    expect($wisata->fresh()->slug)->toBe('pulau-kumala');
});

test('slug memakai fallback jika nama tidak menghasilkan slug', function () {
    expect(buatWisata(['nama_wisata' => '!!!'])->slug)->toBe('wisata');
});
