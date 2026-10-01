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

    /**
     * Cek batas harian satu fitur AI (travel_planner | local_guide) untuk pengguna, plus pagar
     * anggaran global. Hanya panggilan sukses yang dihitung; jawaban dari cache tidak pernah tercatat.
     *
     * @return array{allowed: bool, reason: string|null, remaining: int, limit: int}
     */
    public function checkFeature(int $userId, string $feature): array
    {
        $limit = (int) config("ai.limits.{$feature}_per_day", 0);

        $used = AiLog::where('user_id', $userId)
            ->whereIn('type', [$feature, 'ollama_' . $feature])
            ->where('success', true)
            ->where('created_at', '>=', now()->startOfDay())
            ->count();

        $remaining = max(0, $limit - $used);

        if ($this->budgetExceeded()) {
            return ['allowed' => false, 'reason' => 'budget', 'remaining' => $remaining, 'limit' => $limit];
        }

        if ($remaining <= 0) {
            return ['allowed' => false, 'reason' => 'limit', 'remaining' => 0, 'limit' => $limit];
        }

        return ['allowed' => true, 'reason' => null, 'remaining' => $remaining, 'limit' => $limit];
    }

    /** Apakah total biaya AI semua pengguna hari ini sudah melewati pagar anggaran? */
    public function budgetExceeded(): bool
    {
        $budget = (float) config('ai.limits.daily_budget_usd', 0);

        if ($budget <= 0) {
            return false;
        }

        $spent = Cache::remember('ai_budget:' . now()->toDateString(), 60, fn () => (float) AiLog::where('success', true)
            ->where('created_at', '>=', now()->startOfDay())
            ->sum('cost'));

        return $spent >= $budget;
    }

    /** Pesan untuk pengguna saat fitur AI ditolak oleh checkFeature(). */
    public function denyMessage(array $check, string $label): string
    {
        if (($check['reason'] ?? null) === 'budget') {
            return 'Layanan AI sedang beristirahat hari ini. Coba lagi besok.';
        }

        return "Batas harian tercapai ({$check['limit']} {$label} per hari). Coba lagi besok.";
    }

    public function clearCache(int $userId): void
    {
        Cache::forget("ai_quota:{$userId}:" . now()->toDateString());
        Cache::forget('ai_budget:' . now()->toDateString());
    }
}
