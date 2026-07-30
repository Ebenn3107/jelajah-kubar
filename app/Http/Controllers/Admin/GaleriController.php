<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Galeri;
use App\Models\Wisata;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GaleriController extends Controller
{
    public function index(Request $request): Response
    {
        $wisataId = $request->get('wisata_id');
        $wisatas = Wisata::select('id', 'nama_wisata')->orderBy('nama_wisata')->get();

        $galeris = collect();
        $selectedWisata = null;

        if ($wisataId) {
            $selectedWisata = Wisata::findOrFail($wisataId);
            $galeris = Galeri::where('wisata_id', $wisataId)
                ->orderBy('sort_order')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(fn ($g) => [
                    'id' => $g->id,
                    'foto' => $g->foto,
                    'foto_url' => $g->foto ? Storage::url($g->foto) : null,
                    'caption' => $g->caption,
                    'is_primary' => $g->is_primary,
                    'sort_order' => $g->sort_order,
                ]);
        }

        return Inertia::render('admin/galeri/index', [
            'galeris' => $galeris,
            'wisatas' => $wisatas,
            'selectedWisata' => $selectedWisata,
            'filters' => ['wisata_id' => $wisataId],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'wisata_id' => 'required|exists:wisatas,id',
            'foto' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
            'caption' => 'nullable|string|max:255',
            'is_primary' => 'boolean',
        ]);

        $path = $request->file('foto')->store('wisata', 'public');

        $maxSort = Galeri::where('wisata_id', $validated['wisata_id'])->max('sort_order') ?? 0;

        Galeri::create([
            'wisata_id' => $validated['wisata_id'],
            'foto' => $path,
            'caption' => $validated['caption'] ?? null,
            'is_primary' => $request->boolean('is_primary'),
            'sort_order' => $maxSort + 1,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Foto berhasil ditambahkan.']);

        return to_route('admin.galeri.index', ['wisata_id' => $validated['wisata_id']]);
    }

    public function destroy(Galeri $galeri): RedirectResponse
    {
        $wisataId = $galeri->wisata_id;

        if ($galeri->foto && Storage::disk('public')->exists($galeri->foto)) {
            Storage::disk('public')->delete($galeri->foto);
        }

        $galeri->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Foto berhasil dihapus.']);

        return to_route('admin.galeri.index', ['wisata_id' => $wisataId]);
    }
}
