<?php

namespace App\Services;

use App\Models\Wisata;
use Illuminate\Support\Facades\Cache;

/**
 * Cache jawaban AI untuk masukan yang identik. Kunci memuat "versi data" destinasi, sehingga
 * jawaban otomatis kedaluwarsa begitu destinasi ditambah, diubah, atau dinonaktifkan.
 * Hanya jawaban yang berhasil disimpan; kegagalan tidak pernah di-cache.
 */
class AiCacheService
{
    /** Normalisasi teks bebas: huruf kecil, tanda baca dibuang, spasi dirapikan. */
    public function normalize(string $text): string
    {
        $text = mb_strtolower($text);
        $text = preg_replace('/[^\p{L}\p{N}\s]+/u', ' ', $text) ?? '';

        return trim(preg_replace('/\s+/u', ' ', $text) ?? '');
    }

    public function get(string $namespace, array $parts): mixed
    {
        return Cache::get($this->key($namespace, $parts));
    }

    public function put(string $namespace, array $parts, mixed $value): void
    {
        if ($value === null || $value === '' || $value === []) {
            return;
        }

        $days = max(1, (int) config("ai.cache_days.{$namespace}", 1));

        Cache::put($this->key($namespace, $parts), $value, now()->addDays($days));
    }

    private function key(string $namespace, array $parts): string
    {
        return 'ai_cache:' . $namespace . ':' . sha1(json_encode($parts)) . ':' . $this->dataVersion();
    }

    private function dataVersion(): string
    {
        $row = Wisata::where('is_active', true)->selectRaw('COUNT(*) as total, MAX(updated_at) as terakhir')->first();

        return substr(sha1(($row->total ?? 0) . '|' . ($row->terakhir ?? '')), 0, 12);
    }
}
