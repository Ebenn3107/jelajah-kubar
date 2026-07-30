<?php

namespace App\Http\Controllers;

use App\Models\Wisata;
use App\Services\AiContentService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TravelPlannerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('travel-planner/index', [
            'result' => null,
        ]);
    }

    public function plan(Request $request): Response
    {
        $validated = $request->validate([
            'durasi' => 'required|integer|min:1|max:14',
            'budget' => 'required|string|max:255',
            'minat' => 'nullable|string|max:500',
        ]);

        $wisatas = Wisata::with(['kategori', 'fasilitas'])
            ->where('is_active', true)
            ->get();

        if ($wisatas->isEmpty()) {
            return Inertia::render('travel-planner/index', [
                'result' => null,
                'error' => 'Belum ada data wisata tersedia.',
            ]);
        }

        $service = app(AiContentService::class);
        $result = $service->travelPlan(
            $wisatas->toArray(),
            $validated['durasi'],
            $validated['budget'],
            $validated['minat'] ?? '',
        );

        if (! $result) {
            return Inertia::render('travel-planner/index', [
                'result' => null,
                'error' => 'Gagal menghasilkan rencana perjalanan. Coba lagi.',
            ]);
        }

        return Inertia::render('travel-planner/index', [
            'result' => $result,
            'error' => null,
            'input' => $validated,
        ]);
    }
}
