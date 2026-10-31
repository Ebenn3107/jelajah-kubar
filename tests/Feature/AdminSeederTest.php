<?php

use App\Models\User;
use Database\Seeders\DatabaseSeeder;

test('seeder membuat admin dari config bila diisi', function () {
    config(['app.admin_email' => 'admin@kubar.test', 'app.admin_password' => 'rahasia-panjang']);

    $this->seed(DatabaseSeeder::class);

    $admin = User::where('email', 'admin@kubar.test')->first();
    expect((bool) $admin->is_admin)->toBeTrue()
        ->and(Hash::check('rahasia-panjang', $admin->password))->toBeTrue();
    expect(User::where('email', 'test@example.com')->exists())->toBeFalse();
});

test('seeder tidak membuat admin bila config kosong', function () {
    $this->seed(DatabaseSeeder::class);

    expect(User::where('is_admin', true)->exists())->toBeFalse();
});
