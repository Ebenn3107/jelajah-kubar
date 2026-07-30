<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('wisatas', function (Blueprint $table) {
            $table->foreignId('kategori_id')->nullable()->constrained()->nullOnDelete();
            $table->string('slug')->unique()->after('nama_wisata');
            $table->decimal('latitude', 10, 8)->nullable()->after('deskripsi');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
            $table->string('harga_tiket')->nullable()->after('longitude');
            $table->string('jam_buka')->nullable()->after('harga_tiket');
            $table->string('jam_tutup')->nullable()->after('jam_buka');
            $table->string('kontak')->nullable()->after('jam_tutup');
            $table->boolean('is_active')->default(true)->after('kontak');
        });
    }

    public function down(): void
    {
        Schema::table('wisatas', function (Blueprint $table) {
            $table->dropForeign(['kategori_id']);
            $table->dropColumn([
                'kategori_id', 'slug', 'latitude', 'longitude',
                'harga_tiket', 'jam_buka', 'jam_tutup', 'kontak', 'is_active',
            ]);
        });
    }
};
