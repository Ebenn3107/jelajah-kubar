<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
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
        $wisatas = Wisata::with('kategori')
            ->where('is_active', true)
            ->when($request->search, fn ($q, $s) => $q->where('nama_wisata', 'like', "%{$s}%"))
            ->when($request->kategori, fn ($q, $k) => $q->whereHas('kategori', fn ($q) => $q->where('slug', $k)))
            ->paginate(12)
            ->withQueryString();

        $kategoris = Kategori::all();

        return Inertia::render('wisata/index', [
            'wisatas' => $wisatas,
            'kategoris' => $kategoris,
            'filters' => $request->only(['search', 'kategori']),
        ]);
    }

    public function show(Wisata $wisata): Response
    {
        $wisata->load(['kategori', 'galeris' => fn ($q) => $q->orderBy('sort_order'), 'fasilitas']);

        return Inertia::render('wisata/show', [
            'wisata' => $wisata,
        ]);
    }
}
