<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Galeri;
use App\Models\Kategori;
use App\Models\Wisata;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_wisata' => Wisata::count(),
                'total_kategori' => Kategori::count(),
                'total_galeri' => Galeri::count(),
                'wisata_aktif' => Wisata::where('is_active', true)->count(),
            ],
        ]);
    }
}
