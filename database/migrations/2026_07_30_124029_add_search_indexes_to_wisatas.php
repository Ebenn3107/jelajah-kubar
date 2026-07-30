<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('CREATE EXTENSION IF NOT EXISTS pg_trgm');

        DB::statement('CREATE INDEX IF NOT EXISTS wisatas_nama_trgm_idx ON wisatas USING GIN (nama_wisata gin_trgm_ops)');
        DB::statement('CREATE INDEX IF NOT EXISTS wisatas_alamat_trgm_idx ON wisatas USING GIN (alamat gin_trgm_ops)');
        DB::statement('CREATE INDEX IF NOT EXISTS wisatas_is_active_idx ON wisatas (is_active)');
    }

    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS wisatas_nama_trgm_idx');
        DB::statement('DROP INDEX IF EXISTS wisatas_alamat_trgm_idx');
        DB::statement('DROP INDEX IF EXISTS wisatas_is_active_idx');
    }
};
