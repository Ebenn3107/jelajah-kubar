<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Fasilitas;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FasilitasController extends Controller
{
    public function index(): Response
    {
        $fasilitas = Fasilitas::withCount('wisatas')->latest()->get();

        return Inertia::render('admin/fasilitas/index', [
            'fasilitas' => $fasilitas,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_fasilitas' => 'required|string|max:255|unique:fasilitas,nama_fasilitas',
            'ikon' => 'nullable|string|max:255',
        ]);

        Fasilitas::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Fasilitas berhasil ditambahkan.']);

        return to_route('admin.fasilitas.index');
    }

    public function update(Request $request, Fasilitas $fasilitas): RedirectResponse
    {
        $validated = $request->validate([
            'nama_fasilitas' => 'required|string|max:255|unique:fasilitas,nama_fasilitas,' . $fasilitas->id,
            'ikon' => 'nullable|string|max:255',
        ]);

        $fasilitas->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Fasilitas berhasil diperbarui.']);

        return to_route('admin.fasilitas.index');
    }

    public function destroy(Fasilitas $fasilitas): RedirectResponse
    {
        if ($fasilitas->wisatas()->count() > 0) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Fasilitas tidak bisa dihapus karena masih terhubung dengan wisata.']);

            return back();
        }

        $fasilitas->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Fasilitas berhasil dihapus.']);

        return to_route('admin.fasilitas.index');
    }
}
