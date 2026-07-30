<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'is_admin' => true,
            ],
        );

        $this->call([
            KategoriSeeder::class,
            FasilitasSeeder::class,
            WisataSeeder::class,
        ]);
    }
}
