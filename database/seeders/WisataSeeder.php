<?php

namespace Database\Seeders;

use App\Models\Fasilitas;
use App\Models\Galeri;
use App\Models\Kategori;
use App\Models\Wisata;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class WisataSeeder extends Seeder
{
    public function run(): void
    {
        $json = json_decode(file_get_contents(database_path('data/data-wisata.json')), true);

        foreach ($json['wisata'] as $item) {
            $this->seedWisata($item);
        }
    }

    private function seedWisata(array $item): void
    {
        $kategori = Kategori::where('nama_kategori', $item['kategori'])->first();
        $slug = $item['slug'] ?? Str::slug($item['nama_wisata']);

        // Foto null → jangan overwrite foto yang sudah diupload
        $data = [
            'nama_wisata' => $item['nama_wisata'],
            'slug' => $slug,
            'kategori_id' => $kategori?->id,
            'alamat' => $item['alamat'],
            'deskripsi' => $item['deskripsi'] ?? '',
            'latitude' => $item['latitude'] ?? null,
            'longitude' => $item['longitude'] ?? null,
            'harga_tiket' => $item['harga_tiket'] ?? null,
            'jam_buka' => $item['jam_buka'] ?? null,
            'jam_tutup' => $item['jam_tutup'] ?? null,
            'kontak' => $item['kontak'] ?? null,
            'is_active' => $item['is_active'] ?? true,
        ];

        if (! empty($item['foto'])) {
            $data['foto'] = $item['foto'];
        }

        $wisata = Wisata::updateOrCreate(['slug' => $slug], $data);

        // Fasilitas
        if (! empty($item['fasilitas'])) {
            $fasIds = Fasilitas::whereIn('nama_fasilitas', $item['fasilitas'])->pluck('id')->all();
            if ($fasIds) {
                $wisata->fasilitas()->syncWithoutDetaching($fasIds);
            }
        }

        // Galeri
        if (! empty($item['galeri'])) {
            $sort = 0;
            foreach ($item['galeri'] as $g) {
                Galeri::updateOrCreate(
                    ['wisata_id' => $wisata->id, 'foto' => $g['foto']],
                    [
                        'caption' => $g['caption'] ?? null,
                        'is_primary' => $g['is_primary'] ?? false,
                        'sort_order' => $sort++,
                    ],
                );
            }
        }
    }
}
