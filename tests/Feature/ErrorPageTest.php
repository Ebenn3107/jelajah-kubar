<?php

use App\Models\User;

test('404 menampilkan halaman error Inertia', function () {
    $this->get('/halaman-yang-tidak-ada')
        ->assertNotFound()
        ->assertInertia(fn ($page) => $page->component('error')->where('status', 404));
});

test('403 untuk non-admin menampilkan halaman error Inertia', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('admin.dashboard'))
        ->assertForbidden()
        ->assertInertia(fn ($page) => $page->component('error')->where('status', 403));
});

test('permintaan JSON tetap menerima respons JSON', function () {
    $this->getJson('/halaman-yang-tidak-ada')->assertNotFound()->assertJsonStructure(['message']);
});

test('kata sandi saat ini yang salah menampilkan pesan berbahasa Indonesia', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('security.edit'))
        ->put(route('user-password.update'), [
            'current_password' => 'salah-sekali',
            'password' => 'KataSandiBaru123!',
            'password_confirmation' => 'KataSandiBaru123!',
        ])
        ->assertSessionHasErrors(['current_password' => 'Kata sandi saat ini salah.']);
});

test('kolom wajib kosong menampilkan pesan berbahasa Indonesia', function () {
    $this->actingAs(User::factory()->create())
        ->patch(route('profile.update'), ['name' => '', 'email' => ''])
        ->assertSessionHasErrors(['name' => 'Nama wajib diisi.']);
});
