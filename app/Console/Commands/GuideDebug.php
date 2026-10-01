<?php

namespace App\Console\Commands;

use App\Services\AiContentService;
use App\Services\LocalGuideService;
use Illuminate\Console\Command;

class GuideDebug extends Command
{
    protected $signature = 'guide:debug {question : Pertanyaan yang ingin ditelusuri} {--ask : Panggil AI sungguhan (memakai kuota API, tanpa batas pengguna)}';

    protected $description = 'Telusuri bagaimana Pemandu Lokal memproses satu pertanyaan: intent, destinasi terdeteksi, peringkat, dan (opsional) jawaban AI.';

    public function handle(LocalGuideService $guide, AiContentService $ai): int
    {
        $question = (string) $this->argument('question');
        $intents = $guide->detectIntent($question);

        $this->line('Intent       : ' . implode(', ', $intents));
        $this->line('Kata kunci   : ' . (implode(', ', $guide->contentKeywords($question)) ?: '(tidak ada)'));

        $mentioned = $guide->findMentioned($question);
        $this->line('Disebut      : ' . ($mentioned->isEmpty() ? '(tidak ada destinasi yang disebut langsung)' : 'id ' . $mentioned->implode(', ')));

        if ($guide->isFactual($question, $intents)) {
            $this->info('Jalur        : FAKTUAL (dijawab dari database tanpa AI)');
            $this->newLine();
            $this->line((string) $guide->answerFactual($question, $intents));

            return self::SUCCESS;
        }

        $ranked = $guide->rank($question, $intents, $guide->retrieve($question, $intents));

        if ($ranked->isEmpty()) {
            $this->warn('Jalur        : TIDAK ADA DATA RELEVAN (AI tidak dipanggil)');

            return self::SUCCESS;
        }

        $this->info('Jalur        : AI dengan konteks Top-' . $ranked->count());
        $this->table(
            ['Skor', 'Destinasi', 'Kategori', 'Tiket'],
            $ranked->map(fn ($w) => [$w->relevance_score, $w->nama_wisata, $w->kategori?->nama_kategori, $w->harga_tiket ?: '-'])->all(),
        );

        if (! $this->option('ask')) {
            $this->line('Tambahkan --ask untuk melihat jawaban AI.');

            return self::SUCCESS;
        }

        $raw = $ai->localGuideAnswer($question, $ranked->toArray());
        $this->newLine();
        $this->line('Jawaban mentah     : ' . ($raw ?? '(gagal/kosong)'));
        $this->line('Setelah validasi   : ' . $ai->validateLocalGuideAnswer($raw, $ranked));

        return self::SUCCESS;
    }
}
