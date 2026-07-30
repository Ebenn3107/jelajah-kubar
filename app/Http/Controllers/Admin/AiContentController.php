<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\Wisata;
use App\Services\AiContentService;
use App\Services\AiQuotaService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiContentController extends Controller
{
    public function generate(Request $request, Wisata $wisata): Response
    {
        $quota = app(AiQuotaService::class)->check($request->user()->id);

        if (! $quota['allowed']) {
            $kategoris = Kategori::all();

            return Inertia::render('admin/wisata/form', [
                'wisata' => $wisata,
                'kategoris' => $kategoris,
                'ai_content' => null,
                'errors' => ['ai_error' => 'Daily AI quota exceeded. Tokens used today: ' . $quota['total_tokens_today']],
            ]);
        }

        $wisata->load(['kategori', 'fasilitas']);

        $service = app(AiContentService::class);
        $result = $service->generate($wisata);

        $kategoris = Kategori::all();

        app(AiQuotaService::class)->clearCache($request->user()->id);

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
