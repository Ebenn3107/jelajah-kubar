<?php

namespace App\Http\Controllers;

use App\Services\AiCacheService;
use App\Services\AiContentService;
use App\Services\AiQuotaService;
use App\Services\LocalGuideService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocalGuideController extends Controller
{
    private const FEATURE = 'local_guide';

    public function index(Request $request): Response
    {
        return $this->page($request, ['answer' => null, 'question' => null]);
    }

    public function ask(Request $request): Response
    {
        $validated = $request->validate([
            'question' => 'required|string|min:5|max:500',
        ]);

        $question = $validated['question'];

        $guide = app(LocalGuideService::class);

        // 1. Deteksi intent
        $intents = $guide->detectIntent($question);

        // 2. LAYER FAKTUAL — jawab langsung dari DB tanpa LLM (jumlah, daftar generik)
        if ($guide->isFactual($question, $intents)) {
            return $this->page($request, [
                'answer' => $guide->answerFactual($question, $intents),
                'question' => $question,
                'relatedWisatas' => [],
                'intents' => $intents,
            ]);
        }

        // 3. Retrieval berdasarkan intent (bukan semua data), 4. ranking + Top-K
        $ranked = $guide->rank($question, $intents, $guide->retrieve($question, $intents));

        if ($ranked->isEmpty()) {
            return $this->page($request, [
                'answer' => 'Maaf, saya tidak menemukan data wisata yang relevan dengan pertanyaan Anda di database Jelajah Kubar. Coba tanyakan dengan kata kunci yang berbeda.',
                'question' => $question,
                'relatedWisatas' => [],
                'intents' => $intents,
            ]);
        }

        $related = $ranked->map(fn ($w) => ['slug' => $w->slug, 'nama' => $w->nama_wisata]);

        // 5. Pertanyaan identik: jawab dari cache — gratis dan tidak memakai batas harian
        $cache = app(AiCacheService::class);
        $cacheParts = ['q' => $cache->normalize($question)];
        $cached = $cache->get(self::FEATURE, $cacheParts);

        if ($cached) {
            return $this->page($request, [
                'answer' => $cached,
                'question' => $question,
                'relatedWisatas' => $related,
                'intents' => $intents,
            ]);
        }

        // 6. Cek batas harian sebelum memanggil AI
        $userId = $request->user()->id;
        $quotaService = app(AiQuotaService::class);
        $check = $quotaService->checkFeature($userId, self::FEATURE);

        if (! $check['allowed']) {
            return $this->page($request, [
                'answer' => $quotaService->denyMessage($check, 'pertanyaan'),
                'question' => $question,
                'relatedWisatas' => [],
                'intents' => $intents,
            ]);
        }

        // 7. Generate jawaban dari Top-K + metadata statistik, 8. validasi nama tempat
        $service = app(AiContentService::class);
        $raw = $service->localGuideAnswer($question, $ranked->toArray(), $userId);
        $answer = $service->validateLocalGuideAnswer($raw, $ranked);

        // Hanya jawaban sungguhan yang di-cache (bukan pesan gagal/fallback)
        $squash = fn (string $t) => preg_replace('/\s+/u', ' ', trim($t));

        if ($raw !== null && $squash($raw) === $squash($answer)) {
            $cache->put(self::FEATURE, $cacheParts, $answer);
        }

        return $this->page($request, [
            'answer' => $answer,
            'question' => $question,
            'relatedWisatas' => $related,
            'intents' => $intents,
        ]);
    }

    /** Render halaman dengan sisa batas harian (null untuk tamu). */
    private function page(Request $request, array $props): Response
    {
        $user = $request->user();
        $check = $user ? app(AiQuotaService::class)->checkFeature($user->id, self::FEATURE) : null;

        return Inertia::render('local-guide/index', $props + [
            'quota' => $check ? ['remaining' => $check['remaining'], 'limit' => $check['limit']] : null,
        ]);
    }
}
