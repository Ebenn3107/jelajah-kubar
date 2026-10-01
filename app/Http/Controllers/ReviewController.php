<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Wisata;
use App\Services\AiContentService;
use App\Services\AiQuotaService;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function store(Request $request, Wisata $wisata): RedirectResponse
    {
        abort_unless($wisata->is_active, 404);

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

        try {
            Review::create([
                'wisata_id' => $wisata->id,
                'user_id' => $request->user()->id,
                'rating' => $validated['rating'],
                'komentar' => $validated['komentar'] ?? null,
            ]);
        } catch (UniqueConstraintViolationException) {
            // Double-submit: review sudah dibuat oleh request pertama
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Kamu sudah mereview wisata ini.']);

            return back();
        }

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

    /** Ringkasan AI dijalankan setelah response terkirim agar request tidak menunggu LLM */
    private function refreshReviewSummary(Wisata $wisata, int $userId): void
    {
        app()->terminating(fn () => $this->buildReviewSummary($wisata, $userId));
    }

    private function buildReviewSummary(Wisata $wisata, int $userId): void
    {
        try {
            $quota = app(AiQuotaService::class)->check($userId);
            if (! $quota['allowed']) {
                return;
            }

            if (! $wisata->reviews()->exists()) {
                $wisata->updateQuietly(['review_summary' => null]);
                return;
            }

            // Batasi 30 review terbaru agar prompt tidak membengkak
            $reviews = $wisata->reviews()->latest()->limit(30)->get();
            $wisata->load('kategori');

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
        } catch (\Throwable $e) {
            report($e);
        }
    }
}
