<?php

namespace Database\Seeders;

use App\Models\Fasilitas;
use Illuminate\Database\Seeder;

class FasilitasSeeder extends Seeder
{
    public function run(): void
    {
        $list = [
            ['nama_fasilitas' => 'Parkir', 'ikon' => 'parking'],
            ['nama_fasilitas' => 'Toilet Umum', 'ikon' => 'toilet'],
            ['nama_fasilitas' => 'Musholla', 'ikon' => 'mosque'],
            ['nama_fasilitas' => 'Warung Makan', 'ikon' => 'food'],
            ['nama_fasilitas' => 'Pemandu Wisata', 'ikon' => 'guide'],
            ['nama_fasilitas' => 'Area Camping', 'ikon' => 'camping'],
            ['nama_fasilitas' => 'Spot Foto', 'ikon' => 'camera'],
            ['nama_fasilitas' => 'Gazebo', 'ikon' => 'gazebo'],
            ['nama_fasilitas' => 'Papan Informasi', 'ikon' => 'info'],
            ['nama_fasilitas' => 'Akses Kursi Roda', 'ikon' => 'wheelchair'],
        ];

        foreach ($list as $item) {
            Fasilitas::updateOrCreate(['nama_fasilitas' => $item['nama_fasilitas']], $item);
        }
    }
}
