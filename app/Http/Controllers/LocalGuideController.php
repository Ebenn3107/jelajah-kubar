<?php

namespace App\Http\Controllers;

use App\Services\AiContentService;
use App\Services\AiQuotaService;
use App\Services\LocalGuideService;
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

        $guide = app(LocalGuideService::class);

        // 1. Deteksi intent
        $intents = $guide->detectIntent($question);

        // 2. LAYER FAKTUAL — jawab langsung dari DB tanpa LLM (count, daftar)
        if ($guide->isFactual($question, $intents)) {
            $factual = $guide->answerFactual($question, $intents);

            return Inertia::render('local-guide/index', [
                'answer' => $factual,
                'question' => $question,
                'relatedWisatas' => [],
                'intents' => $intents,
            ]);
        }

        // 3. Retrieval berdasarkan intent (bukan semua data)
        $wisatas = $guide->retrieve($question, $intents);

        // 4. Ranking + Top-K
        $ranked = $guide->rank($question, $intents, $wisatas);

        if ($ranked->isEmpty()) {
            return Inertia::render('local-guide/index', [
                'answer' => 'Maaf, saya tidak menemukan data wisata yang relevan dengan pertanyaan Anda di database Jelajah Kubar. Coba tanyakan dengan kata kunci yang berbeda.',
                'question' => $question,
                'relatedWisatas' => [],
                'intents' => $intents,
            ]);
        }

        // 5. Cek kuota harian sebelum memanggil AI, lalu generate jawaban dari Top-K + metadata statistik
        $userId = $request->user()->id;
        $quotaService = app(AiQuotaService::class);

        if (! $quotaService->check($userId)['allowed']) {
            return Inertia::render('local-guide/index', [
                'answer' => 'Kuota AI harian Anda sudah habis. Coba lagi besok.',
                'question' => $question,
                'relatedWisatas' => [],
                'intents' => $intents,
            ]);
        }

        $service = app(AiContentService::class);
        $answer = $service->localGuideAnswer($question, $ranked->toArray(), $userId);
        $quotaService->clearCache($userId);

        // 6. Validasi respons — pastikan destinasi yang disebut ada di context
        $answer = $service->validateLocalGuideAnswer($answer, $ranked);

        return Inertia::render('local-guide/index', [
            'answer' => $answer,
            'question' => $question,
            'relatedWisatas' => $ranked->map(fn ($w) => ['slug' => $w->slug, 'nama' => $w->nama_wisata]),
            'intents' => $intents,
        ]);
    }
}
