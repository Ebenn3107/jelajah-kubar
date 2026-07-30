<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Wisata;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function store(Request $request, Wisata $wisata): RedirectResponse
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'komentar' => 'nullable|string|max:1000',
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
            'komentar' => 'nullable|string|max:1000',
        ]);

        $review->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Review berhasil diperbarui.']);

        return back();
    }

    public function destroy(Request $request, Review $review): RedirectResponse
    {
        if ($review->user_id !== $request->user()->id) {
            abort(403);
        }

        $review->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Review berhasil dihapus.']);

        return back();
    }
}
