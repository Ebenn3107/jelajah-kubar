<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Akun admin dengan kredensial default hanya untuk lokal
        if (app()->environment('local')) {
            $admin = User::firstOrNew(['email' => 'test@example.com']);
            $admin->forceFill([
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'is_admin' => true,
            ])->save();
        }

        $this->call([
            KategoriSeeder::class,
            FasilitasSeeder::class,
            WisataSeeder::class,
        ]);
    }
}
