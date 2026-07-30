<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use App\Models\Review;
use App\Models\Wisata;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WisataController extends Controller
{
    public function welcome(): Response
    {
        $featured = Wisata::with('kategori')
            ->where('is_active', true)
            ->latest()
            ->take(3)
            ->get();

        $totalWisata = Wisata::where('is_active', true)->count();

        return Inertia::render('welcome', [
            'featured' => $featured,
            'totalWisata' => $totalWisata,
        ]);
    }

    public function index(Request $request): Response
    {
        $search = $request->search;

        $wisatas = Wisata::with('kategori')
            ->where('is_active', true)
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->whereRaw('LOWER(nama_wisata) LIKE ?', ['%' . strtolower($search) . '%'])
                        ->orWhereRaw('LOWER(alamat) LIKE ?', ['%' . strtolower($search) . '%'])
                        ->orWhereHas('kategori', fn ($k) => $k->whereRaw('LOWER(nama_kategori) LIKE ?', ['%' . strtolower($search) . '%']))
                        ->orWhereHas('fasilitas', fn ($f) => $f->whereRaw('LOWER(nama_fasilitas) LIKE ?', ['%' . strtolower($search) . '%']));
                });

                // Exact match first, then prefix, then partial
                $q->orderByRaw('
                    CASE
                        WHEN LOWER(nama_wisata) = ? THEN 0
                        WHEN LOWER(nama_wisata) LIKE ? THEN 1
                        ELSE 2
                    END
                ', [strtolower($search), strtolower($search) . '%']);
            })
            ->when($request->kategori, fn ($q, $k) => $q->whereHas('kategori', fn ($q) => $q->where('slug', $k)))
            ->orderBy('nama_wisata')
            ->paginate(10)
            ->withQueryString();

        $kategoris = Kategori::all();

        return Inertia::render('wisata/index', [
            'wisatas' => $wisatas,
            'kategoris' => $kategoris,
            'filters' => $request->only(['search', 'kategori']),
        ]);
    }

    public function show(Request $request, Wisata $wisata): Response
    {
        $wisata->load([
            'kategori',
            'galeris' => fn ($q) => $q->orderBy('sort_order'),
            'fasilitas',
            'reviews' => fn ($q) => $q->with('user')->latest(),
        ]);

        $userReview = null;
        $isFavorited = false;

        if ($request->user()) {
            $userReview = Review::where('wisata_id', $wisata->id)
                ->where('user_id', $request->user()->id)
                ->first();

            $isFavorited = $request->user()->favoritWisatas()
                ->where('wisata_id', $wisata->id)
                ->exists();
        }

        return Inertia::render('wisata/show', [
            'wisata' => $wisata,
            'userReview' => $userReview,
            'isFavorited' => $isFavorited,
        ]);
    }
}
