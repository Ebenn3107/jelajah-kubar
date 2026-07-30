<?php

namespace App\Services;

use App\Models\AiLog;
use Illuminate\Support\Facades\Cache;

class AiQuotaService
{
    const DAILY_TOKEN_LIMIT = 50000;
    const DAILY_COST_LIMIT = 0.10; // USD

    public function check(int $userId): array
    {
        $today = now()->startOfDay();

        $usage = Cache::remember("ai_quota:{$userId}:" . now()->toDateString(), 60, function () use ($userId, $today) {
            return [
                'total_tokens' => AiLog::where('user_id', $userId)
                    ->where('created_at', '>=', $today)
                    ->where('success', true)
                    ->sum('total_tokens'),
                'total_cost' => AiLog::where('user_id', $userId)
                    ->where('created_at', '>=', $today)
                    ->where('success', true)
                    ->sum('cost'),
                'total_calls' => AiLog::where('user_id', $userId)
                    ->where('created_at', '>=', $today)
                    ->count(),
            ];
        });

        $remainingTokens = max(0, self::DAILY_TOKEN_LIMIT - $usage['total_tokens']);
        $remainingCost = max(0, self::DAILY_COST_LIMIT - $usage['total_cost']);

        return [
            'allowed' => $remainingTokens > 0 && $remainingCost > 0,
            'remaining_tokens' => $remainingTokens,
            'remaining_cost' => round($remainingCost, 8),
            'total_tokens_today' => $usage['total_tokens'],
            'total_calls_today' => $usage['total_calls'],
        ];
    }

    public function clearCache(int $userId): void
    {
        Cache::forget("ai_quota:{$userId}:" . now()->toDateString());
    }
}
