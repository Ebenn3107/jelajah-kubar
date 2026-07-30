<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\Wisata;
use App\Services\AiContentService;
use Inertia\Inertia;
use Inertia\Response;

class AiContentController extends Controller
{
    public function generate(Wisata $wisata): Response
    {
        $wisata->load(['kategori', 'fasilitas']);

        $service = app(AiContentService::class);
        $result = $service->generate($wisata);

        $kategoris = Kategori::all();

        if (empty($result['deskripsi'])) {
            return Inertia::render('admin/wisata/form', [
                'wisata' => $wisata,
                'kategoris' => $kategoris,
                'ai_content' => null,
                'errors' => ['ai_error' => 'Gagal generate konten. Periksa API key atau coba lagi.'],
            ]);
        }

        return Inertia::render('admin/wisata/form', [
            'wisata' => $wisata,
            'kategoris' => $kategoris,
            'ai_content' => $result,
        ]);
    }
}
