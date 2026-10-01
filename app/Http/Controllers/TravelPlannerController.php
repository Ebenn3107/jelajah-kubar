<?php

namespace App\Http\Controllers;

use App\Models\Wisata;
use App\Services\AiCacheService;
use App\Services\AiContentService;
use App\Services\AiQuotaService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TravelPlannerController extends Controller
{
    private const FEATURE = 'travel_planner';

    public function index(Request $request): Response
    {
        return $this->page($request, ['result' => null]);
    }

    public function plan(Request $request): Response
    {
        $validated = $request->validate([
            'durasi' => 'required|integer|min:1|max:14',
            'budget' => 'required|string|max:255',
            'minat' => 'nullable|string|max:500',
        ]);

        $cache = app(AiCacheService::class);
        $cacheParts = [
            'durasi' => (int) $validated['durasi'],
            'budget' => $cache->normalize($validated['budget']),
            'minat' => $cache->normalize($validated['minat'] ?? ''),
        ];

        // Masukan identik: jawab dari cache — gratis dan tidak memakai batas harian
        $cached = $cache->get(self::FEATURE, $cacheParts);

        if ($cached) {
            return $this->page($request, ['result' => $cached, 'error' => null, 'input' => $validated]);
        }

        $wisatas = Wisata::with(['kategori', 'fasilitas'])
            ->where('is_active', true)
            ->get();

        if ($wisatas->isEmpty()) {
            return $this->page($request, ['result' => null, 'error' => 'Belum ada data wisata tersedia.']);
        }

        $userId = $request->user()->id;
        $quotaService = app(AiQuotaService::class);
        $check = $quotaService->checkFeature($userId, self::FEATURE);

        if (! $check['allowed']) {
            return $this->page($request, [
                'result' => null,
                'error' => $quotaService->denyMessage($check, 'rencana'),
                'input' => $validated,
            ]);
        }

        $result = app(AiContentService::class)->travelPlan(
            $wisatas->toArray(),
            $validated['durasi'],
            $validated['budget'],
            $validated['minat'] ?? '',
            $userId,
        );

        if (! $result) {
            return $this->page($request, ['result' => null, 'error' => 'Gagal menghasilkan rencana perjalanan. Coba lagi.']);
        }

        $cache->put(self::FEATURE, $cacheParts, $result);

        return $this->page($request, ['result' => $result, 'error' => null, 'input' => $validated]);
    }

    /** Render halaman dengan sisa batas harian (null untuk tamu). */
    private function page(Request $request, array $props): Response
    {
        $user = $request->user();
        $check = $user ? app(AiQuotaService::class)->checkFeature($user->id, self::FEATURE) : null;

        return Inertia::render('travel-planner/index', $props + [
            'quota' => $check ? ['remaining' => $check['remaining'], 'limit' => $check['limit']] : null,
        ]);
    }
}
