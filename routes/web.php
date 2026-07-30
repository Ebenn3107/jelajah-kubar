<?php

use App\Http\Controllers\Admin\AiContentController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FasilitasController as AdminFasilitasController;
use App\Http\Controllers\Admin\GaleriController as AdminGaleriController;
use App\Http\Controllers\Admin\KategoriController as AdminKategoriController;
use App\Http\Controllers\Admin\WisataController as AdminWisataController;
use App\Http\Controllers\WisataController;
use Illuminate\Support\Facades\Route;

Route::get('/', [WisataController::class, 'welcome'])->name('home');

// Public — wisata
Route::get('wisata', [WisataController::class, 'index'])->name('wisata.index');
Route::get('wisata/{wisata:slug}', [WisataController::class, 'show'])->name('wisata.show');

// Auth — verified required
Route::middleware(['auth', 'verified'])->group(function () {
    Route::redirect('dashboard', '/admin/dashboard');

    // Admin routes
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::resource('wisata', AdminWisataController::class)->parameter('wisata', 'wisata')->except('show');
        Route::resource('kategori', AdminKategoriController::class)->parameter('kategori', 'kategori')->except('show');
        Route::get('galeri', [AdminGaleriController::class, 'index'])->name('galeri.index');
        Route::post('galeri', [AdminGaleriController::class, 'store'])->name('galeri.store');
        Route::delete('galeri/{galeri}', [AdminGaleriController::class, 'destroy'])->name('galeri.destroy');
        Route::resource('fasilitas', AdminFasilitasController::class)->parameter('fasilitas', 'fasilitas')->except('show');
        Route::post('wisata/{wisata}/generate-content', [AiContentController::class, 'generate'])->name('wisata.generate-content');
    });
});

require __DIR__.'/settings.php';
