<?php

namespace App\Http\Controllers;

use App\Models\Wisata;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FavoritController extends Controller
{
    public function index(Request $request): Response
    {
        $wisatas = $request->user()->favoritWisatas()
            ->with('kategori')
            ->latest()
            ->paginate(12);

        return Inertia::render('favorit/index', [
            'wisatas' => $wisatas,
        ]);
    }

    public function toggle(Request $request, Wisata $wisata): RedirectResponse
    {
        $user = $request->user();
        $exists = $user->favoritWisatas()->where('wisata_id', $wisata->id)->exists();

        if ($exists) {
            $user->favoritWisatas()->detach($wisata->id);
            Inertia::flash('toast', ['type' => 'success', 'message' => 'Dihapus dari favorit.']);
        } else {
            $user->favoritWisatas()->attach($wisata->id);
            Inertia::flash('toast', ['type' => 'success', 'message' => 'Ditambahkan ke favorit.']);
        }

        return back();
    }
}
