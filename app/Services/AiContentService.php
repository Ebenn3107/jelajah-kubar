<?php

namespace App\Services;

use App\Models\AiLog;
use App\Models\Wisata;
use Illuminate\Support\Facades\Http;

class AiContentService
{
    const PRICE_INPUT_PER_1M = 0.14;
    const PRICE_OUTPUT_PER_1M = 0.28;
    const MAX_USER_CONTENT_CHARS = 12000;
    const MAX_SYSTEM_PROMPT_CHARS = 4000;

    public function generate(Wisata $wisata): array
    {
        $factualData = $this->buildFactualData($wisata);

        $narrative = $this->callDeepSeek($this->narrativePrompt(), $factualData, 'ai_content_generate');
        $metadata = $this->callDeepSeek($this->metadataPrompt(), $factualData, 'ai_content_generate');

        return [
            'deskripsi' => $narrative['deskripsi'] ?? $wisata->deskripsi,
            'ringkasan' => $narrative['ringkasan'] ?? '',
            'highlight' => $narrative['highlight'] ?? '',
            'tips_kunjungan' => $narrative['tips_kunjungan'] ?? '',
            'meta_description' => $metadata['meta_description'] ?? '',
            'seo_keywords' => $metadata['seo_keywords'] ?? '',
            'alt_text_gambar' => $metadata['alt_text_gambar'] ?? '',
            'caption_medsos' => $metadata['caption_medsos'] ?? '',
        ];
    }

    public function reviewSummary(string $wisataNama, string $kategori, $reviews, ?int $userId = null): ?string
    {
        $reviews = collect($reviews);
        if ($reviews->isEmpty()) {
            return null;
        }

        $reviewText = collect($reviews)->map(fn ($r) => "- Rating {$r->rating}/5: {$r->komentar}")->implode("\n");

        $prompt = <<<PROMPT
Kamu adalah asisten Jelajah Kubar yang merangkum review pengguna.

Berdasarkan review-review berikut untuk wisata "{$wisataNama}" (kategori: {$kategori}), buat:
1. Rangkuman singkat (2-3 kalimat) tentang apa yang umumnya dikatakan pengunjung
2. Jangan tambahkan fakta baru yang tidak ada di review
3. Jika review saling bertentangan, sebutkan kedua sisi
4. Gunakan bahasa Indonesia yang alami

Review:
{$reviewText}

Respond dengan JSON:
{"summary": "..."}
PROMPT;

        $result = $this->callDeepSeek($prompt, $reviewText, 'review_summary', $userId);

        return $result['summary'] ?? null;
    }

    public function localGuideAnswer(string $question, array $wisatas): ?string
    {
        if (empty($wisatas)) {
            return 'Maaf, saya tidak menemukan data wisata yang relevan dengan pertanyaan Anda di database Jelajah Kubar. Coba tanyakan dengan kata kunci yang berbeda.';
        }

        $context = '';
        foreach ($wisatas as $w) {
            $fas = $w['fasilitas'] ?? [];
            $fasList = is_array($fas) ? implode(', ', array_column($fas, 'nama_fasilitas')) : '';
            $kat = $w['kategori']['nama_kategori'] ?? 'Umum';

            $context .= "- {$w['nama_wisata']} ({$kat})\n";
            $context .= "  Alamat: {$w['alamat']}\n";
            $context .= "  Deskripsi: " . substr($w['deskripsi'] ?? '', 0, 200) . "\n";
            $context .= "  Harga: " . ($w['harga_tiket'] ?: 'Informasi belum tersedia') . "\n";
            $context .= "  Jam: {$w['jam_buka']} - {$w['jam_tutup']}\n";
            $context .= "  Fasilitas: " . ($fasList ?: 'Informasi belum tersedia') . "\n\n";
        }

        $prompt = <<<PROMPT
Kamu adalah Local Guide AI untuk Jelajah Kubar — asisten wisata yang membantu pengunjung menemukan informasi tentang destinasi di Kutai Barat, Kalimantan Timur.

ATURAN:
1. Jawab pertanyaan pengguna HANYA berdasarkan data yang diberikan di bawah ini
2. JANGAN menambahkan fakta, sejarah, harga, atau informasi apapun yang tidak ada di data
3. Jika informasi tidak tersedia untuk menjawab pertanyaan, katakan "Informasi belum tersedia"
4. Gunakan bahasa Indonesia yang ramah dan natural
5. Jika relevan, sebutkan nama spesifik destinasi

Pertanyaan pengguna: {$question}

Data wisata yang tersedia:
{$context}

Respond dengan JSON:
{"answer": "..."}
PROMPT;

        $result = $this->callDeepSeek($prompt, $question, 'local_guide');

        return $result['answer'] ?? 'Maaf, saya belum bisa menjawab pertanyaan itu. Coba tanyakan hal lain tentang wisata di Kutai Barat.';
    }

    public function travelPlan(array $wisatas, int $durasi, string $budget, string $minat): ?string
    {
        $wisataText = '';
        foreach ($wisatas as $w) {
            $fasilitas = $w['fasilitas'] ?? [];
            $fasilitasList = is_array($fasilitas) ? implode(', ', array_column($fasilitas, 'nama_fasilitas')) : '';
            $kategori = $w['kategori']['nama_kategori'] ?? 'Umum';

            $wisataText .= "- {$w['nama_wisata']} ({$kategori})\n";
            $wisataText .= "  Alamat: {$w['alamat']}\n";
            $wisataText .= "  Harga: " . ($w['harga_tiket'] ?: 'Informasi belum tersedia') . "\n";
            $wisataText .= "  Jam: {$w['jam_buka']} - {$w['jam_tutup']}\n";
            $wisataText .= "  Fasilitas: " . ($fasilitasList ?: 'Informasi belum tersedia') . "\n\n";
        }

        $prompt = <<<PROMPT
Kamu adalah asisten perencana perjalanan wisata untuk Jelajah Kubar (Kutai Barat, Kalimantan Timur).

Berdasarkan daftar destinasi wisata berikut, buat rencana perjalanan (itinerary) selama {$durasi} hari dengan budget {$budget}.
Minat pengguna: {$minat}

Aturan:
1. Susun itinerary per hari dengan aktivitas yang realistis
2. Setiap hari maksimal 3-4 destinasi
3. Pertimbangkan jarak antar destinasi (dalam satu area)
4. Sesuaikan dengan budget yang diberikan
5. Berikan estimasi biaya tiap destinasi (tiket masuk, transportasi lokal)
6. Jika budget tidak mencukupi untuk semua destinasi, berikan prioritas
7. Gunakan bahasa Indonesia
8. HANYA gunakan data dari daftar berikut — jangan tambah destinasi lain

Daftar destinasi:
{$wisataText}

Respond dengan JSON:
{
  "days": [
    {
      "day": 1,
      "title": "Judul Hari",
      "activities": [
        {
          "time": "08:00",
          "place": "Nama Destinasi",
          "description": "Deskripsi aktivitas",
          "estimated_cost": "Estimasi biaya"
        }
      ],
      "total_cost": "Total biaya hari ini"
    }
  ],
  "total_budget_estimate": "Estimasi total biaya",
  "tips": "Tips perjalanan"
}
PROMPT;

        $result = $this->callDeepSeek($prompt, "Buat itinerary {$durasi} hari di Kutai Barat dengan budget {$budget}", 'travel_planner');

        return $result ? json_encode($result) : null;
    }

    private function buildFactualData(Wisata $wisata): string
    {
        $data = "Nama Wisata: {$wisata->nama_wisata}\n";
        $data .= "Kategori: {$wisata->kategori?->nama_kategori}\n";
        $data .= "Alamat: {$wisata->alamat}\n";
        $data .= "Harga Tiket: " . ($wisata->harga_tiket ?: 'Informasi belum tersedia') . "\n";
        $data .= "Jam Buka: " . ($wisata->jam_buka ?: 'Informasi belum tersedia') . "\n";
        $data .= "Jam Tutup: " . ($wisata->jam_tutup ?: 'Informasi belum tersedia') . "\n";
        $data .= "Kontak: " . ($wisata->kontak ?: 'Informasi belum tersedia') . "\n";
        $data .= "Koordinat: " . ($wisata->latitude ? "{$wisata->latitude}, {$wisata->longitude}" : 'Informasi belum tersedia') . "\n";

        if ($wisata->relationLoaded('fasilitas') && $wisata->fasilitas->isNotEmpty()) {
            $data .= "Fasilitas: " . $wisata->fasilitas->pluck('nama_fasilitas')->join(', ') . "\n";
        }

        if ($wisata->deskripsi) {
            $data .= "\nDeskripsi Eksisting:\n{$wisata->deskripsi}\n";
        }

        return $data;
    }

    private function narrativePrompt(): string
    {
        return <<<PROMPT
Kamu adalah asisten konten wisata untuk Jelajah Kubar.
Tugasmu hanya menulis ulang dan menyusun informasi berdasarkan data faktual yang diberikan.
JANGAN menambahkan fakta, sejarah, angka, atau informasi apapun yang tidak ada di data.
Jika informasi tidak tersedia, tulis "Informasi belum tersedia."
Gunakan bahasa Indonesia yang baik dan menarik.

Berdasarkan data berikut, buat:
1. **deskripsi** — Paragraf deskripsi menarik (2-3 paragraf, maks 300 kata)
2. **ringkasan** — Ringkasan singkat (2-3 kalimat)
3. **highlight** — 3-5 poin utama destinasi (format bullet point, setiap poin maks 15 kata)
4. **tips_kunjungan** — 3-5 tips berkunjung (format bullet point, setiap poin maks 15 kata)

Respond dengan JSON:
{"deskripsi": "...", "ringkasan": "...", "highlight": "...", "tips_kunjungan": "..."}
PROMPT;
    }

    private function metadataPrompt(): string
    {
        return <<<PROMPT
Kamu adalah asisten konten wisata untuk Jelajah Kubar.
Tugasmu hanya menulis ulang dan menyusun informasi berdasarkan data faktual yang diberikan.
JANGAN menambahkan fakta, sejarah, angka, atau informasi apapun yang tidak ada di data.
Gunakan bahasa Indonesia.

Berdasarkan data berikut, buat:
1. **meta_description** — Meta description untuk SEO (maks 160 karakter)
2. **seo_keywords** — 5-10 kata kunci SEO (format comma-separated)
3. **alt_text_gambar** — Alt text untuk foto utama (1-2 kalimat, deskriptif)
4. **caption_medsos** — Caption media sosial yang engaging (1 kalimat, maks 100 karakter)

Respond dengan JSON:
{"meta_description": "...", "seo_keywords": "...", "alt_text_gambar": "...", "caption_medsos": "..."}
PROMPT;
    }

    private function callDeepSeek(string $systemPrompt, string $userContent, string $type = 'ai_general', ?int $userId = null): array
    {
        $apiKey = config('ai.deepseek.api_key');
        $startTime = hrtime(true);

        if (!$apiKey) {
            $this->log($type, 'no_api_key', 0, 0, 0, 0, false, 'API key not configured', $userId);
            return [];
        }

        $systemPrompt = mb_substr($systemPrompt, 0, self::MAX_SYSTEM_PROMPT_CHARS);
        $userContent = mb_substr($userContent, 0, self::MAX_USER_CONTENT_CHARS);

        try {
            $response = Http::timeout(30)
                ->withHeaders([
                    'Authorization' => "Bearer {$apiKey}",
                    'Content-Type' => 'application/json',
                ])
                ->post('https://api.deepseek.com/v1/chat/completions', [
                    'model' => config('ai.deepseek.model'),
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user', 'content' => $userContent],
                    ],
                    'max_tokens' => config('ai.deepseek.max_tokens'),
                    'temperature' => config('ai.deepseek.temperature'),
                    'response_format' => ['type' => 'json_object'],
                ]);

            $elapsed = hrtime(true) - $startTime;
            $responseTimeMs = (int) ($elapsed / 1_000_000);

            if ($response->failed()) {
                $this->log($type, config('ai.deepseek.model'), 0, 0, 0, $responseTimeMs, false, "HTTP {$response->status()}", $userId);
                return [];
            }

            $data = $response->json();
            $usage = $data['usage'] ?? [];
            $promptTokens = $usage['prompt_tokens'] ?? 0;
            $completionTokens = $usage['completion_tokens'] ?? 0;
            $totalTokens = $usage['total_tokens'] ?? 0;

            $cost = ($promptTokens / 1_000_000 * self::PRICE_INPUT_PER_1M)
                  + ($completionTokens / 1_000_000 * self::PRICE_OUTPUT_PER_1M);
            $cost = round($cost, 10);

            $this->log($type, config('ai.deepseek.model'), $promptTokens, $completionTokens, $totalTokens, $responseTimeMs, true, null, $userId, $cost);

            $content = $data['choices'][0]['message']['content'] ?? '';

            return json_decode($content, true) ?? [];
        } catch (\Exception $e) {
            $elapsed = hrtime(true) - $startTime;
            $responseTimeMs = (int) ($elapsed / 1_000_000);
            $this->log($type, config('ai.deepseek.model'), 0, 0, 0, $responseTimeMs, false, $e->getMessage(), $userId);

            return [];
        }
    }

    private function log(string $type, string $model, int $promptTokens, int $completionTokens, int $totalTokens, int $responseTimeMs, bool $success, ?string $error = null, ?int $userId = null, ?float $cost = null): void
    {
        try {
            AiLog::create([
                'user_id' => $userId,
                'type' => $type,
                'model' => $model,
                'prompt_tokens' => $promptTokens,
                'completion_tokens' => $completionTokens,
                'total_tokens' => $totalTokens,
                'cost' => $cost ?? 0,
                'response_time_ms' => $responseTimeMs,
                'success' => $success,
                'error_message' => $error,
            ]);
        } catch (\Exception) {
        }
    }
}
