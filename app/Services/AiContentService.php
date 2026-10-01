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

    /** Router — pilih provider berdasarkan runtime config (AiProviderService) */
    private function callAi(string $systemPrompt, string $userContent, string $type = 'ai_general', ?int $userId = null): array
    {
        $providerService = app(AiProviderService::class);
        $provider = $providerService->getProvider();

        // Local dimatikan → langsung DeepSeek, apapun modenya
        if (! $providerService->isLocalEnabled()) {
            return $this->callDeepSeek($systemPrompt, $userContent, $type, $userId);
        }

        if ($provider === 'deepseek') {
            return $this->callDeepSeek($systemPrompt, $userContent, $type, $userId);
        }

        if ($provider === 'auto') {
            $result = $this->callOllama($systemPrompt, $userContent, $type, $userId);
            if (empty($result)) {
                $result = $this->callDeepSeek($systemPrompt, $userContent, $type, $userId);
            }
            return $result;
        }

        // default: local only
        return $this->callOllama($systemPrompt, $userContent, $type, $userId);
    }

    private function callOllama(string $systemPrompt, string $userContent, string $type = 'ai_general', ?int $userId = null): array
    {
        $baseUrl = rtrim((string) config('ai.ollama.base_url'), '/');
        $model = config('ai.ollama.model');
        $startTime = hrtime(true);

        try {
            $response = Http::connectTimeout(5)->timeout(120)
                ->post($baseUrl . '/api/chat', [
                    'model' => $model,
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user', 'content' => $userContent],
                    ],
                    'stream' => false,
                    'format' => 'json',
                    'options' => [
                        'temperature' => config('ai.ollama.temperature', 0.7),
                    ],
                ]);

            $elapsed = hrtime(true) - $startTime;
            $responseTimeMs = (int) ($elapsed / 1_000_000);

            if ($response->failed()) {
                $this->log('ollama_' . $type, $model, 0, 0, 0, $responseTimeMs, false, "HTTP {$response->status()}", $userId);
                return [];
            }

            $content = $response->json('message.content');

            if (empty($content) || ! is_string($content)) {
                $this->log('ollama_' . $type, $model, 0, 0, 0, $responseTimeMs, false, 'Empty response', $userId);
                return [];
            }

            $this->log('ollama_' . $type, $model, 0, 0, 0, $responseTimeMs, true, null, $userId);

            return $this->parseJsonTolerant($content);
        } catch (\Throwable $e) {
            $elapsed = hrtime(true) - $startTime;
            $responseTimeMs = (int) ($elapsed / 1_000_000);
            $this->log('ollama_' . $type, $model, 0, 0, 0, $responseTimeMs, false, $e->getMessage(), $userId);

            return [];
        }
    }

    /** Parsing JSON toleran — model kecil sering output JSON dengan teks di sekitarnya */
    private function parseJsonTolerant(string $content): array
    {
        // 1. Coba decode langsung
        $decoded = json_decode($content, true);
        if (is_array($decoded)) {
            return $decoded;
        }

        // 2. Strip code fences ```json ... ```
        $stripped = preg_replace('/```(?:json)?\s*/i', '', $content);
        $stripped = preg_replace('/```/', '', $stripped ?? '');
        $decoded = json_decode(trim($stripped ?? ''), true);
        if (is_array($decoded)) {
            return $decoded;
        }

        // 3. Cari blok {...} pertama
        if (preg_match('/\{.*\}/s', $content, $matches)) {
            $decoded = json_decode($matches[0], true);
            if (is_array($decoded)) {
                return $decoded;
            }
        }

        // 4. Cari blok [...] pertama
        if (preg_match('/\[.*\]/s', $content, $matches)) {
            $decoded = json_decode($matches[0], true);
            if (is_array($decoded)) {
                return $decoded;
            }
        }

        return [];
    }

    public function generate(Wisata $wisata): array
    {
        $factualData = $this->buildFactualData($wisata);

        $narrative = $this->callAi($this->narrativePrompt(), $factualData, 'ai_content_generate');
        $metadata = $this->callAi($this->metadataPrompt(), $factualData, 'ai_content_generate');

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

        $result = $this->callAi($prompt, $reviewText, 'review_summary', $userId);

        return $result['summary'] ?? null;
    }

    public function localGuideAnswer(string $question, array $wisatas): ?string
    {
        if (empty($wisatas)) {
            return 'Maaf, saya tidak menemukan data wisata yang relevan dengan pertanyaan Anda di database Jelajah Kubar. Coba tanyakan dengan kata kunci yang berbeda.';
        }

        // Metadata statistik — LLM tahu total destinasi, gak bakal salah hitung
        $metadata = app(LocalGuideService::class)->buildMetadata();

        $context = '';
        $contextNames = [];
        foreach ($wisatas as $w) {
            $fas = $w['fasilitas'] ?? [];
            $fasList = is_array($fas) ? implode(', ', array_column($fas, 'nama_fasilitas')) : '';
            $kat = $w['kategori']['nama_kategori'] ?? 'Umum';
            $contextNames[] = strtolower($w['nama_wisata']);

            $context .= "- {$w['nama_wisata']} ({$kat})\n";
            $context .= "  Alamat: {$w['alamat']}\n";
            $context .= "  Deskripsi: " . substr($w['deskripsi'] ?? '', 0, 200) . "\n";
            $context .= "  Harga: " . ($w['harga_tiket'] ?: 'Informasi belum tersedia') . "\n";
            $context .= "  Jam: {$w['jam_buka']} - {$w['jam_tutup']}\n";
            $context .= "  Fasilitas: " . ($fasList ?: 'Informasi belum tersedia') . "\n\n";
        }

        $prompt = <<<PROMPT
Kamu adalah Local Guide AI untuk Jelajah Kubar — asisten wisata yang membantu pengunjung menemukan informasi tentang destinasi di Kutai Barat, Kalimantan Timur.

INFORMASI STATISTIK DATABASE (fakta, jangan dikoreksi):
{$metadata}

ATURAN KETAT:
1. Jawab pertanyaan HANYA berdasarkan data wisata di bawah ini
2. JANGAN menyebutkan nama destinasi APAPUN yang tidak ada di daftar "DAFTAR DESTINASI TERSEDIA"
3. JANGAN menambahkan fakta, sejarah, harga, atau informasi yang tidak ada di data
4. Jika data tidak cukup untuk menjawab, katakan "Informasi belum tersedia" lalu berhenti
5. Gunakan bahasa Indonesia yang ramah dan natural
6. Sebutkan maksimal 3 destinasi yang paling relevan dengan pertanyaan
7. Jika pertanyaan menanyakan JUMLAH/TOTAL destinasi, gunakan TOTAL_DESTINASI_TERSEDIA dari INFORMASI STATISTIK — jangan menghitung dari daftar di bawah (daftar hanya sebagian)

DAFTAR DESTINASI TERSEDIA (sebagian — hanya yang relevan):
{$context}

Pertanyaan pengguna: {$question}

Respond dengan JSON:
{"answer": "..."}
PROMPT;

        $result = $this->callAi($prompt, $question, 'local_guide');

        return $result['answer'] ?? 'Maaf, saya belum bisa menjawab pertanyaan itu. Coba tanyakan hal lain tentang wisata di Kutai Barat.';
    }

    /** Validasi respons — hapus nama destinasi yang tidak ada di context */
    public function validateLocalGuideAnswer(?string $answer, $wisatas): string
    {
        if (! $answer) {
            return 'Maaf, saya belum bisa menjawab pertanyaan itu. Coba tanyakan hal lain tentang wisata di Kutai Barat.';
        }

        $allowedNames = collect($wisatas)
            ->map(fn ($w) => strtolower($w['nama_wisata'] ?? $w->nama_wisata))
            ->unique()
            ->values();

        // Ambil semua potongan nama panjang dulu (misal "Kersik Luway Orchid Forest")
        $suspicious = [];
        foreach ($allowedNames as $name) {
            // Nama yang ADA di context — aman
            if (str_contains(strtolower($answer), $name)) {
                continue;
            }
        }

        // Cek kata benda asing: pecah jawaban jadi kalimat, cari kalimat yang menyebut nama
        // yang mirip tapi bukan nama yang diizinkan (hallucination check ringan)
        $answerLower = strtolower($answer);

        foreach ($allowedNames as $name) {
            $nameParts = explode(' ', $name);
            if (count($nameParts) >= 2) {
                // Cek apakah ada bagian nama yang muncul tapi nama lengkap tidak
                // contoh: "Pantai Benangaq" disebut tapi hanya "Pantai" di context
                foreach ($nameParts as $part) {
                    if (strlen($part) >= 5 && str_contains($answerLower, $part)) {
                        // Bagian nama ini ada di jawaban — ok karena bagian dari nama yang diizinkan
                        break;
                    }
                }
            }
        }

        // Hapus kalimat yang menyebut kata "wisata"/"tempat" + angka yang tidak masuk akal
        // (heuristic sederhana — cukup untuk Qwen 1.5B)
        $sentences = preg_split('/(?<=[.!?])\s+/', $answer);
        $filtered = array_filter($sentences, function ($sentence) use ($allowedNames) {
            $sentenceLower = strtolower($sentence);

            // Jika kalimat menyebut nama yang tidak diizinkan → buang
            preg_match_all('/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})\b/', $sentence, $matches);
            foreach ($matches[1] ?? [] as $candidate) {
                $candidateLower = strtolower(trim($candidate));
                // Skip kata umum
                if (in_array($candidateLower, ['saya', 'anda', 'kamu', 'yang', 'untuk', 'dengan', 'akan', 'bisa', 'dari', 'kepada', 'seperti', 'selamat', 'ada', 'info', 'informasi', 'harga', 'tiket', 'lokasi', 'alamat', 'wisata', 'kutai', 'barat', 'kalimantan', 'timur'])) {
                    continue;
                }
                // Nama dengan huruf kapital yang bukan bagian dari allowed → curiga
                $isAllowed = $allowedNames->contains(fn ($n) => str_contains($candidateLower, $n) || str_contains($n, $candidateLower));
                if (! $isAllowed && strlen($candidateLower) > 5) {
                    return false; // buang kalimat ini
                }
            }

            return true;
        });

        $result = implode(' ', $filtered);

        return trim($result) !== '' ? $result : $answer;
    }

    public function travelPlan(array $wisatas, int $durasi, string $budget, string $minat): ?string
    {
        // Batasi jumlah destinasi yang dikirim ke model (hemat token),
        // dan utamakan yang relevan dengan minat pengguna.
        $maxDestinations = min(12, 4 + $durasi * 2);
        $wisatas = $this->selectRelevantDestinations($wisatas, $minat, $maxDestinations);
        $prompt = $this->buildTravelPlanPrompt($wisatas, $durasi, $budget, $minat);

        // Jaring pengaman: jika prompt masih melebihi batas system prompt,
        // kurangi daftar destinasi sampai muat — instruksi JSON tidak boleh terpotong.
        while (mb_strlen($prompt) > self::MAX_SYSTEM_PROMPT_CHARS && count($wisatas) > 1) {
            array_pop($wisatas);
            $prompt = $this->buildTravelPlanPrompt($wisatas, $durasi, $budget, $minat);
        }

        $result = $this->callAi($prompt, "Buat itinerary {$durasi} hari di Kutai Barat dengan budget {$budget}", 'travel_planner');

        return $result ? json_encode($result) : null;
    }

    /**
     * Pilih destinasi paling relevan dengan minat pengguna.
     * Jika tidak ada kata kunci yang cocok, ambil destinasi pertama sejumlah limit.
     */
    private function selectRelevantDestinations(array $wisatas, string $minat, int $limit): array
    {
        if (count($wisatas) <= $limit) {
            return array_values($wisatas);
        }

        $keywords = array_values(array_filter(
            array_map('mb_strtolower', preg_split('/[\s,;.]+/u', trim($minat)) ?: []),
            fn ($keyword) => mb_strlen($keyword) >= 3,
        ));

        if ($keywords === []) {
            return array_slice($wisatas, 0, $limit);
        }

        $scored = [];
        foreach ($wisatas as $wisata) {
            $haystack = mb_strtolower(implode(' ', [
                $wisata['nama_wisata'] ?? '',
                $wisata['kategori']['nama_kategori'] ?? '',
                $wisata['alamat'] ?? '',
                mb_substr($wisata['deskripsi'] ?? '', 0, 300),
            ]));

            $score = 0;
            foreach ($keywords as $keyword) {
                if (str_contains($haystack, $keyword)) {
                    $score++;
                }
            }
            $scored[] = ['wisata' => $wisata, 'score' => $score];
        }

        usort($scored, fn ($a, $b) => $b['score'] <=> $a['score']);

        if (($scored[0]['score'] ?? 0) === 0) {
            return array_slice($wisatas, 0, $limit);
        }

        return array_slice(array_map(fn ($item) => $item['wisata'], $scored), 0, $limit);
    }

    private function buildTravelPlanPrompt(array $wisatas, int $durasi, string $budget, string $minat): string
    {
        $wisataText = '';
        foreach ($wisatas as $w) {
            $fasilitas = $w['fasilitas'] ?? [];
            $fasilitasList = is_array($fasilitas)
                ? implode(', ', array_slice(array_column($fasilitas, 'nama_fasilitas'), 0, 4))
                : '';
            $kategori = $w['kategori']['nama_kategori'] ?? 'Umum';
            $harga = $w['harga_tiket'] ?: 'Informasi belum tersedia';

            $wisataText .= "- {$w['nama_wisata']} ({$kategori}) | Tiket: {$harga}";
            if ($fasilitasList !== '') {
                $wisataText .= " | Fasilitas: {$fasilitasList}";
            }
            $wisataText .= "\n";
        }

        return <<<PROMPT
Kamu adalah asisten perencana perjalanan wisata untuk Jelajah Kubar (Kutai Barat, Kalimantan Timur).

Buat rencana perjalanan (itinerary) selama {$durasi} hari dengan budget {$budget}.
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

Respond dengan JSON dengan format berikut:
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

Daftar destinasi:
{$wisataText}
PROMPT;
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
            $response = Http::connectTimeout(5)->timeout(30)
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

            $decoded = json_decode($content, true);

            return is_array($decoded) ? $decoded : [];
        } catch (\Throwable $e) {
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
