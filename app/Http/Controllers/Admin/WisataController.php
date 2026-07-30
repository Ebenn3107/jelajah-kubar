<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\Wisata;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class WisataController extends Controller
{
    public function index(Request $request): Response
    {
        $wisatas = Wisata::with('kategori')
            ->when($request->search, fn ($q, $s) => $q->where('nama_wisata', 'like', "%{$s}%"))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $kategoris = Kategori::all();

        return Inertia::render('admin/wisata/index', [
            'wisatas' => $wisatas,
            'kategoris' => $kategoris,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        $kategoris = Kategori::all();

        return Inertia::render('admin/wisata/form', [
            'wisata' => null,
            'kategoris' => $kategoris,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->merge(['slug' => $request->slug ?: Str::slug($request->nama_wisata)]);

        $validated = $request->validate([
            'nama_wisata' => 'required|string|max:255',
            'slug' => 'required|string|unique:wisatas,slug',
            'kategori_id' => 'nullable|exists:kategoris,id',
            'alamat' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'harga_tiket' => 'nullable|string|max:255',
            'jam_buka' => 'nullable|string|max:255',
            'jam_tutup' => 'nullable|string|max:255',
            'kontak' => 'nullable|string|max:255',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('wisata', 'public');
        }

        Wisata::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Wisata berhasil ditambahkan.']);

        return to_route('admin.wisata.index');
    }

    public function edit(Wisata $wisata): Response
    {
        $kategoris = Kategori::all();

        return Inertia::render('admin/wisata/form', [
            'wisata' => $wisata,
            'kategoris' => $kategoris,
            'ai_content' => session('ai_content'),
        ]);
    }

    public function update(Request $request, Wisata $wisata): RedirectResponse
    {
        $request->merge(['slug' => $request->slug ?: Str::slug($request->nama_wisata)]);

        $rules = [
            'nama_wisata' => 'required|string|max:255',
            'slug' => 'required|string|unique:wisatas,slug,' . $wisata->id,
            'kategori_id' => 'nullable|exists:kategoris,id',
            'alamat' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'harga_tiket' => 'nullable|string|max:255',
            'jam_buka' => 'nullable|string|max:255',
            'jam_tutup' => 'nullable|string|max:255',
            'kontak' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ];

        // Foto bisa file atau string (path existing)
        if ($request->hasFile('foto')) {
            $rules['foto'] = 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120';
        } else {
            $rules['foto'] = 'nullable|string|max:255';
        }

        $validated = $request->validate($rules);

        if ($request->hasFile('foto')) {
            // Hapus foto lama
            if ($wisata->foto && Storage::disk('public')->exists($wisata->foto)) {
                Storage::disk('public')->delete($wisata->foto);
            }
            $validated['foto'] = $request->file('foto')->store('wisata', 'public');
        }

        $wisata->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Wisata berhasil diperbarui.']);

        return to_route('admin.wisata.index');
    }

    public function destroy(Wisata $wisata): RedirectResponse
    {
        if ($wisata->foto && Storage::disk('public')->exists($wisata->foto)) {
            Storage::disk('public')->delete($wisata->foto);
        }

        $wisata->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Wisata berhasil dihapus.']);

        return to_route('admin.wisata.index');
    }
}
