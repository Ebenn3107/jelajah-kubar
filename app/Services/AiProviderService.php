<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class AiProviderService
{
    const CACHE_PROVIDER = 'ai_provider';
    const CACHE_LOCAL_ENABLED = 'ai_local_enabled';

    /** Baca provider aktif (local | deepseek | auto), fallback ke config */
    public function getProvider(): string
    {
        return Cache::get(self::CACHE_PROVIDER, config('ai.provider', 'deepseek'));
    }

    /** Set provider runtime */
    public function setProvider(string $provider): void
    {
        Cache::forever(self::CACHE_PROVIDER, $provider);
    }

    /** Apakah Local LLM aktif? */
    public function isLocalEnabled(): bool
    {
        return Cache::get(self::CACHE_LOCAL_ENABLED, true);
    }

    /** Toggle Local LLM on/off */
    public function setLocalEnabled(bool $enabled): void
    {
        Cache::forever(self::CACHE_LOCAL_ENABLED, $enabled);
    }
}
