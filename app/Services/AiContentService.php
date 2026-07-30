<?php

namespace App\Services;

use App\Models\Wisata;
use Illuminate\Support\Facades\Http;

class AiContentService
{
    public function generate(Wisata $wisata): array
    {
        $factualData = $this->buildFactualData($wisata);

        $narrative = $this->callDeepSeek($this->narrativePrompt(), $factualData);
        $metadata = $this->callDeepSeek($this->metadataPrompt(), $factualData);

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

    private function callDeepSeek(string $systemPrompt, string $factualData): array
    {
        $apiKey = config('ai.deepseek.api_key');

        if (!$apiKey) {
            return [];
        }

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
                        ['role' => 'user', 'content' => $factualData],
                    ],
                    'max_tokens' => config('ai.deepseek.max_tokens'),
                    'temperature' => config('ai.deepseek.temperature'),
                    'response_format' => ['type' => 'json_object'],
                ]);

            if ($response->failed()) {
                return [];
            }

            $content = $response->json('choices.0.message.content');

            return json_decode($content, true) ?? [];
        } catch (\Exception $e) {
            return [];
        }
    }
}
