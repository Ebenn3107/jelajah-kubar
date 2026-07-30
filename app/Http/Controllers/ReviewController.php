<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Wisata;
use App\Services\AiContentService;
use App\Services\AiQuotaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function store(Request $request, Wisata $wisata): RedirectResponse
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'komentar' => 'nullable|string|min:10|max:1000',
        ]);

        $existing = Review::where('wisata_id', $wisata->id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existing) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Kamu sudah mereview wisata ini.']);

            return back();
        }

        Review::create([
            'wisata_id' => $wisata->id,
            'user_id' => $request->user()->id,
            'rating' => $validated['rating'],
            'komentar' => $validated['komentar'],
        ]);

        $this->refreshReviewSummary($wisata, $request->user()->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Review berhasil ditambahkan.']);

        return back();
    }

    public function update(Request $request, Review $review): RedirectResponse
    {
        if ($review->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'komentar' => 'nullable|string|min:10|max:1000',
        ]);

        $review->update($validated);

        $this->refreshReviewSummary($review->wisata, $request->user()->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Review berhasil diperbarui.']);

        return back();
    }

    public function destroy(Request $request, Review $review): RedirectResponse
    {
        if ($review->user_id !== $request->user()->id) {
            abort(403);
        }

        $wisata = $review->wisata;
        $review->delete();

        $this->refreshReviewSummary($wisata, $request->user()->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Review berhasil dihapus.']);

        return back();
    }

    private function refreshReviewSummary(Wisata $wisata, int $userId): void
    {
        try {
            $quota = app(AiQuotaService::class)->check($userId);
            if (! $quota['allowed']) {
                return;
            }

            $wisata->load(['reviews', 'kategori']);
            $reviews = $wisata->reviews;

            if ($reviews->isEmpty()) {
                $wisata->updateQuietly(['review_summary' => null]);
                return;
            }

            $service = app(AiContentService::class);
            $summary = $service->reviewSummary(
                $wisata->nama_wisata,
                $wisata->kategori?->nama_kategori ?? 'Umum',
                $reviews,
                $userId,
            );

            if ($summary) {
                $wisata->updateQuietly(['review_summary' => $summary]);
            }

            app(AiQuotaService::class)->clearCache($userId);
        } catch (\Exception) {
            // Silently fail
        }
    }
}
