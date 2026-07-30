<?php

namespace Database\Seeders;

use App\Models\Fasilitas;
use App\Models\Kategori;
use App\Models\Wisata;
use Illuminate\Database\Seeder;

class WisataSeeder extends Seeder
{
    public function run(): void
    {
        $kategoris = Kategori::pluck('id', 'slug');
        $fas = Fasilitas::pluck('id', 'nama_fasilitas');

        $w1 = Wisata::updateOrCreate(['slug' => 'kersik-luway-orchid-forest'], [
            'nama_wisata' => 'Kersik Luway Orchid Forest',
            'slug' => 'kersik-luway-orchid-forest',
            'kategori_id' => $kategoris['alam'],
            'alamat' => 'Sekolaq Darat, Kutai Barat, Kalimantan Timur',
            'deskripsi' => 'Spanning over 5,000 hectares, Kersik Luway is a protected nature reserve famous for its unique sandy soil and being the primary habitat of the rare Coelogyne pandurata, the Black Orchid.',
            'foto' => 'kersik-luway.jpg',
            'latitude' => -0.416667,
            'longitude' => 115.916667,
            'harga_tiket' => 'Rp 15.000 / Domestic, Rp 50.000 / International',
            'jam_buka' => '08:00 - 17:00',
            'jam_tutup' => '17:00',
            'kontak' => '0812-3456-7890',
            'is_active' => true,
        ]);
        $w1->fasilitas()->syncWithoutDetaching([$fas['Parkir'], $fas['Toilet Umum'], $fas['Musholla'], $fas['Papan Informasi'], $fas['Pemandu Wisata']]);

        $w2 = Wisata::updateOrCreate(['slug' => 'jantur-inar-waterfall'], [
            'nama_wisata' => 'Jantur Inar Waterfall',
            'slug' => 'jantur-inar-waterfall',
            'kategori_id' => $kategoris['air-terjun'],
            'alamat' => 'Sandas, Kutai Barat, Kalimantan Timur',
            'deskripsi' => 'A majestic 30-meter waterfall surrounded by lush tropical greenery, perfect for nature photography.',
            'foto' => 'jantur-inar.jpg',
            'latitude' => -0.433333,
            'longitude' => 115.883333,
            'harga_tiket' => 'Rp 10.000',
            'jam_buka' => '07:00 - 17:00',
            'jam_tutup' => '17:00',
            'kontak' => null,
            'is_active' => true,
        ]);
        $w2->fasilitas()->syncWithoutDetaching([$fas['Parkir'], $fas['Spot Foto'], $fas['Warung Makan'], $fas['Gazebo']]);

        $w3 = Wisata::updateOrCreate(['slug' => 'lake-jempang'], [
            'nama_wisata' => 'Lake Jempang',
            'slug' => 'lake-jempang',
            'kategori_id' => $kategoris['danau'],
            'alamat' => 'Jempang, Kutai Barat, Kalimantan Timur',
            'deskripsi' => 'The largest lake in the region, famous for its incredible birdlife and unique floating houses.',
            'foto' => 'lake-jempang.jpg',
            'latitude' => -0.383333,
            'longitude' => 116.000000,
            'harga_tiket' => 'Gratis',
            'jam_buka' => '24 jam',
            'jam_tutup' => '24 jam',
            'kontak' => null,
            'is_active' => true,
        ]);
        $w3->fasilitas()->syncWithoutDetaching([$fas['Parkir'], $fas['Warung Makan'], $fas['Spot Foto'], $fas['Gazebo']]);

        $w4 = Wisata::updateOrCreate(['slug' => 'barong-tongkok-village'], [
            'nama_wisata' => 'Barong Tongkok Village',
            'slug' => 'barong-tongkok-village',
            'kategori_id' => $kategoris['budaya'],
            'alamat' => 'Barong Tongkok, Kutai Barat, Kalimantan Timur',
            'deskripsi' => 'Experience the rich Dayak culture and stay in traditional Luuq longhouses with local families.',
            'foto' => 'barong-tongkok.jpg',
            'latitude' => -0.450000,
            'longitude' => 115.933333,
            'harga_tiket' => 'Rp 25.000 (donasi budaya)',
            'jam_buka' => '08:00 - 16:00',
            'jam_tutup' => '16:00',
            'kontak' => '0821-2345-6789',
            'is_active' => true,
        ]);
        $w4->fasilitas()->syncWithoutDetaching([$fas['Parkir'], $fas['Toilet Umum'], $fas['Musholla'], $fas['Pemandu Wisata'], $fas['Papan Informasi']]);

        $w5 = Wisata::updateOrCreate(['slug' => 'mount-kelam'], [
            'nama_wisata' => 'Mount Kelam',
            'slug' => 'mount-kelam',
            'kategori_id' => $kategoris['petualangan'],
            'alamat' => 'Kutai Barat, Kalimantan Timur',
            'deskripsi' => 'A popular destination for hikers offering panoramic, 360-degree views of the Bornean rainforest.',
            'foto' => 'mount-kelam.jpg',
            'latitude' => -0.366667,
            'longitude' => 115.850000,
            'harga_tiket' => 'Rp 20.000',
            'jam_buka' => '05:00 - 16:00',
            'jam_tutup' => '16:00',
            'kontak' => null,
            'is_active' => true,
        ]);
        $w5->fasilitas()->syncWithoutDetaching([$fas['Parkir'], $fas['Area Camping'], $fas['Spot Foto'], $fas['Gazebo']]);

        $w6 = Wisata::updateOrCreate(['slug' => 'mahakam-river-tour'], [
            'nama_wisata' => 'Mahakam River Tour',
            'slug' => 'mahakam-river-tour',
            'kategori_id' => $kategoris['petualangan'],
            'alamat' => 'Mahakam River, Kutai Barat, Kalimantan Timur',
            'deskripsi' => 'Scenic boat rides along the historic Mahakam River to spot rare Irrawaddy dolphins and river life.',
            'foto' => 'mahakam-river.jpg',
            'latitude' => -0.466667,
            'longitude' => 115.900000,
            'harga_tiket' => 'Rp 100.000 - Rp 500.000 (sewa perahu)',
            'jam_buka' => '06:00 - 18:00',
            'jam_tutup' => '18:00',
            'kontak' => '0852-3456-7890',
            'is_active' => true,
        ]);
        $w6->fasilitas()->syncWithoutDetaching([$fas['Parkir'], $fas['Warung Makan'], $fas['Spot Foto']]);
    }
}
