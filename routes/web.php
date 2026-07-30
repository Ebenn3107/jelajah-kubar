<?php

use App\Http\Controllers\Admin\AiContentController;
use App\Http\Controllers\Admin\AiLogController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FasilitasController as AdminFasilitasController;
use App\Http\Controllers\Admin\GaleriController as AdminGaleriController;
use App\Http\Controllers\Admin\KategoriController as AdminKategoriController;
use App\Http\Controllers\Admin\WisataController as AdminWisataController;
use App\Http\Controllers\FavoritController;
use App\Http\Controllers\LocalGuideController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SavedPlanController;
use App\Http\Controllers\TravelPlannerController;
use App\Http\Controllers\WisataController;
use Illuminate\Support\Facades\Route;

Route::get('/', [WisataController::class, 'welcome'])->name('home');

// Public — wisata
Route::get('wisata', [WisataController::class, 'index'])->name('wisata.index');
Route::get('wisata/{wisata:slug}', [WisataController::class, 'show'])->name('wisata.show');

// Auth — verified required
Route::middleware(['auth', 'verified'])->group(function () {
    Route::redirect('dashboard', '/');

    // Admin routes
    Route::prefix('admin')->middleware('is_admin')->name('admin.')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::resource('wisata', AdminWisataController::class)->parameter('wisata', 'wisata')->except('show');
        Route::resource('kategori', AdminKategoriController::class)->parameter('kategori', 'kategori')->except('show');
        Route::get('galeri', [AdminGaleriController::class, 'index'])->name('galeri.index');
        Route::post('galeri', [AdminGaleriController::class, 'store'])->name('galeri.store');
        Route::delete('galeri/{galeri}', [AdminGaleriController::class, 'destroy'])->name('galeri.destroy');
        Route::resource('fasilitas', AdminFasilitasController::class)->parameter('fasilitas', 'fasilitas')->except('show');
        Route::post('wisata/{wisata}/generate-content', [AiContentController::class, 'generate'])->name('wisata.generate-content')->middleware('throttle:ai');
        Route::get('ai-logs', [AiLogController::class, 'index'])->name('ai-logs.index');
    });
});

// Auth — review & favorit (login required, no email verification needed)
Route::middleware(['auth'])->group(function () {
    Route::post('wisata/{wisata}/review', [ReviewController::class, 'store'])->name('review.store')->middleware('throttle:review');
    Route::put('review/{review}', [ReviewController::class, 'update'])->name('review.update')->middleware('throttle:review');
    Route::delete('review/{review}', [ReviewController::class, 'destroy'])->name('review.destroy');

    Route::post('wisata/{wisata}/favorit', [FavoritController::class, 'toggle'])->name('favorit.toggle');
    Route::get('favorit', [FavoritController::class, 'index'])->name('favorit.index');

    // Saved plans
    Route::post('travel-planner/save', [SavedPlanController::class, 'store'])->name('saved-plans.store');
    Route::get('saved-plans', [SavedPlanController::class, 'index'])->name('saved-plans.index');
    Route::get('saved-plans/{savedPlan}', [SavedPlanController::class, 'show'])->name('saved-plans.show');
    Route::delete('saved-plans/{savedPlan}', [SavedPlanController::class, 'destroy'])->name('saved-plans.destroy');
});

require __DIR__.'/settings.php';

// Public — travel planner
Route::get('travel-planner', [TravelPlannerController::class, 'index'])->name('travel-planner.index');
Route::post('travel-planner', [TravelPlannerController::class, 'plan'])->name('travel-planner.plan')->middleware('throttle:ai');

// Public — local guide
Route::get('local-guide', [LocalGuideController::class, 'index'])->name('local-guide.index');
Route::post('local-guide', [LocalGuideController::class, 'ask'])->name('local-guide.ask')->middleware('throttle:ai');
