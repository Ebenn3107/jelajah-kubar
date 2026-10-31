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

        // Admin produksi dari .env; hapus ADMIN_PASSWORD dari .env setelah seeding
        if (config('app.admin_email') && config('app.admin_password')) {
            $admin = User::firstOrNew(['email' => config('app.admin_email')]);
            $admin->forceFill([
                'name' => $admin->name ?? 'Admin',
                'password' => bcrypt(config('app.admin_password')),
                'is_admin' => true,
                'email_verified_at' => $admin->email_verified_at ?? now(),
            ])->save();
        }

        $this->call([
            KategoriSeeder::class,
            FasilitasSeeder::class,
            WisataSeeder::class,
        ]);
    }
}
