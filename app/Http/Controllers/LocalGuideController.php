<?php

namespace App\Http\Controllers;

use App\Models\Wisata;
use App\Services\AiContentService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocalGuideController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('local-guide/index', [
            'answer' => null,
            'question' => null,
        ]);
    }

    public function ask(Request $request): Response
    {
        $validated = $request->validate([
            'question' => 'required|string|min:5|max:500',
        ]);

        $question = $validated['question'];

        // Cari wisata relevan dari DB berdasarkan keyword di pertanyaan
        $keywords = explode(' ', $question);
        $wisatas = Wisata::with(['kategori', 'fasilitas'])
            ->where('is_active', true)
            ->where(function ($q) use ($keywords) {
                foreach ($keywords as $word) {
                    if (strlen($word) < 3) continue;
                    $q->orWhereRaw('LOWER(nama_wisata) LIKE ?', ['%' . strtolower($word) . '%'])
                      ->orWhereRaw('LOWER(deskripsi) LIKE ?', ['%' . strtolower($word) . '%'])
                      ->orWhereRaw('LOWER(alamat) LIKE ?', ['%' . strtolower($word) . '%'])
                      ->orWhereHas('kategori', fn ($k) => $k->whereRaw('LOWER(nama_kategori) LIKE ?', ['%' . strtolower($word) . '%']))
                      ->orWhereHas('fasilitas', fn ($f) => $f->whereRaw('LOWER(nama_fasilitas) LIKE ?', ['%' . strtolower($word) . '%']));
                }
            })
            ->get();

        $service = app(AiContentService::class);
        $answer = $service->localGuideAnswer($question, $wisatas->toArray());

        return Inertia::render('local-guide/index', [
            'answer' => $answer,
            'question' => $question,
            'relatedWisatas' => $wisatas->map(fn ($w) => ['slug' => $w->slug, 'nama' => $w->nama_wisata]),
        ]);
    }
}
