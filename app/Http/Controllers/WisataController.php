<?php

namespace App\Http\Controllers;

use App\Models\Fasilitas;
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
            'totalKategori' => Kategori::count(),
            'totalFasilitas' => Fasilitas::count(),
        ]);
    }

    public function index(Request $request): Response
    {
        $search = is_string($request->search) ? $request->search : null;
        $like = '%' . addcslashes(strtolower((string) $search), '%_\\') . '%';
        $prefix = addcslashes(strtolower((string) $search), '%_\\') . '%';

        $wisatas = Wisata::with('kategori')
            ->withAvg('reviews', 'rating')
            ->where('is_active', true)
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->whereRaw('LOWER(nama_wisata) LIKE ?', [$like])
                        ->orWhereRaw('LOWER(alamat) LIKE ?', [$like])
                        ->orWhereHas('kategori', fn ($k) => $k->whereRaw('LOWER(nama_kategori) LIKE ?', [$like]))
                        ->orWhereHas('fasilitas', fn ($f) => $f->whereRaw('LOWER(nama_fasilitas) LIKE ?', [$like]));
                });

                $q->orderByRaw('
                    CASE
                        WHEN LOWER(nama_wisata) = ? THEN 0
                        WHEN LOWER(nama_wisata) LIKE ? THEN 1
                        ELSE 2
                    END
                ', [strtolower($search), $prefix]);
            })
            ->when($request->kategori, fn ($q, $k) => $q->whereHas('kategori', fn ($q) => $q->where('slug', $k)))
            ->orderBy('nama_wisata')
            ->paginate(10)
            ->withQueryString();

        $kategoris = Kategori::withCount(['wisatas' => fn ($q) => $q->where('is_active', true)])->get();

        // Foto hero dari wisata pertama yang punya foto
        $heroWisata = Wisata::where('is_active', true)
            ->whereNotNull('foto')
            ->orderBy('nama_wisata')
            ->first();

        return Inertia::render('wisata/index', [
            'wisatas' => $wisatas,
            'kategoris' => $kategoris,
            'filters' => $request->only(['search', 'kategori']),
            'heroFoto' => $heroWisata?->foto_url,
            'totalWisata' => Wisata::where('is_active', true)->count(),
            'totalKategori' => Kategori::count(),
        ]);
    }

    public function show(Request $request, Wisata $wisata): Response
    {
        abort_unless($wisata->is_active, 404);

        $wisata->load([
            'kategori',
            'galeris' => fn ($q) => $q->orderBy('sort_order'),
            'fasilitas',
            'reviews' => fn ($q) => $q->with('user:id,name')->latest(),
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
