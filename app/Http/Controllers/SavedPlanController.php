<?php

namespace App\Http\Controllers;

use App\Models\SavedPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SavedPlanController extends Controller
{
    public function index(Request $request): Response
    {
        $plans = SavedPlan::where('user_id', $request->user()->id)
            ->latest()
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'durasi' => $p->durasi,
                'budget' => $p->budget,
                'minat' => $p->minat,
                'created_at' => $p->created_at->diffForHumans(),
            ]);

        return Inertia::render('saved-plans/index', [
            'plans' => $plans,
        ]);
    }

    public function show(Request $request, SavedPlan $savedPlan): Response
    {
        if ($savedPlan->user_id !== $request->user()->id) {
            abort(403);
        }

        return Inertia::render('saved-plans/show', [
            'plan' => $savedPlan,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'durasi' => 'required|integer|min:1|max:14',
            'budget' => 'required|string|max:255',
            'minat' => 'nullable|string|max:500',
            'result' => 'required|string',
        ]);

        SavedPlan::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'] ?? "{$validated['durasi']} Day Trip - " . now()->format('d M Y'),
            'durasi' => $validated['durasi'],
            'budget' => $validated['budget'],
            'minat' => $validated['minat'],
            'result' => json_decode($validated['result'], true),
        ]);

        return to_route('saved-plans.index');
    }

    public function destroy(Request $request, SavedPlan $savedPlan): RedirectResponse
    {
        if ($savedPlan->user_id !== $request->user()->id) {
            abort(403);
        }

        $savedPlan->delete();

        return to_route('saved-plans.index');
    }
}
