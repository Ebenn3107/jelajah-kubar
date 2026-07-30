<?php

namespace Database\Seeders;

use App\Models\Kategori;
use Illuminate\Database\Seeder;

class KategoriSeeder extends Seeder
{
    public function run(): void
    {
        $kategoris = [
            ['nama_kategori' => 'Alam', 'slug' => 'alam', 'deskripsi' => 'Destinasi wisata alam seperti hutan, gunung, dan sungai.'],
            ['nama_kategori' => 'Budaya', 'slug' => 'budaya', 'deskripsi' => 'Destinasi wisata budaya dan tradisi masyarakat Dayak.'],
            ['nama_kategori' => 'Air Terjun', 'slug' => 'air-terjun', 'deskripsi' => 'Destinasi air terjun yang menakjubkan di Kutai Barat.'],
            ['nama_kategori' => 'Danau', 'slug' => 'danau', 'deskripsi' => 'Danau-danau indah di wilayah Kutai Barat.'],
            ['nama_kategori' => 'Petualangan', 'slug' => 'petualangan', 'deskripsi' => 'Destinasi untuk kegiatan petualangan dan olahraga alam.'],
        ];

        foreach ($kategoris as $kategori) {
            Kategori::updateOrCreate(['slug' => $kategori['slug']], $kategori);
        }
    }
}
