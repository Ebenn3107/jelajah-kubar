<?php

namespace App\Services;

use App\Models\Wisata;
use Illuminate\Support\Collection;

class LocalGuideService
{
    const TOP_K = 5;

    /** Keyword map per intent — detect dari pertanyaan user */
    private array $intentKeywords = [
        'count' => ['berapa total', 'berapa banyak', 'jumlah wisata', 'total wisata', 'berapa jumlah', 'total destinasi', 'jumlah destinasi', 'berapa destinasi'],
        'daftar' => ['sebutkan semua', 'apa saja', 'daftar', 'list', 'semua wisata', 'semua destinasi'],
        'kategori' => ['air terjun', 'danau', 'budaya', 'alam', 'petualangan', 'gunung', 'hutan', 'pantai', 'sungai', 'kategori'],
        'aktivitas' => ['hiking', 'mendaki', 'foto', 'fotografi', 'keluarga', 'anak', 'camping', 'berkemah', 'renang', 'berenang', 'liburan', 'jalan-jalan', 'menikmati', 'cocok'],
        'fasilitas' => ['parkir', 'toilet', 'musholla', 'makan', 'warung', 'gazebo', 'camping', 'pemandu', 'fasilitas'],
        'harga' => ['harga', 'tiket', 'biaya', 'gratis', 'bayar', 'masuk'],
        'lokasi' => ['lokasi', 'alamat', 'dimana', 'di mana', 'kecamatan', 'dekat', 'jarak', 'jalan'],
    ];

    /** Deteksi intent dari pertanyaan */
    public function detectIntent(string $question): array
    {
        $lower = strtolower($question);
        $intents = [];

        foreach ($this->intentKeywords as $intent => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($lower, $keyword)) {
                    $intents[] = $intent;
                    break;
                }
            }
        }

        // Fallback: selalu ada intent umum
        if (empty($intents)) {
            $intents[] = 'umum';
        }

        return array_values(array_unique($intents));
    }

    /** Apakah pertanyaan bisa dijawab langsung dari DB tanpa LLM? */
    public function isFactual(string $question, array $intents): bool
    {
        return in_array('count', $intents) || in_array('daftar', $intents);
    }

    /** Jawaban faktual langsung dari database (tanpa LLM) */
    public function answerFactual(string $question, array $intents): ?string
    {
        $lower = strtolower($question);
        $total = Wisata::where('is_active', true)->count();
        $kategoriTotal = Wisata::where('is_active', true)->count();
        $perKategori = Wisata::where('is_active', true)
            ->with('kategori')
            ->get()
            ->groupBy(fn ($w) => $w->kategori?->nama_kategori ?? 'Lainnya')
            ->map->count()
            ->sortDesc();

        if (in_array('count', $intents)) {
            $bagian = $perKategori->map(fn ($c, $k) => "{$k}: {$c}")->join(', ');

            return "Saat ini ada {$total} destinasi wisata di Kabupaten Kutai Barat. "
                . "Rincian per kategori: {$bagian}.";
        }

        // daftar — dengan filter kategori kalau disebut
        $kategoriFilter = null;
        foreach (['air terjun', 'danau', 'budaya', 'alam', 'petualangan', 'gunung', 'pantai', 'sungai'] as $k) {
            if (str_contains($lower, $k)) {
                $kategoriFilter = match ($k) {
                    'air terjun' => 'Air Terjun',
                    'danau' => 'Danau',
                    'budaya' => 'Budaya',
                    'alam', 'hutan' => 'Alam',
                    'petualangan', 'gunung' => 'Petualangan',
                    'pantai', 'sungai' => 'Alam',
                    default => null,
                };
                break;
            }
        }

        $query = Wisata::where('is_active', true);
        if ($kategoriFilter) {
            $query->whereHas('kategori', fn ($q) => $q->where('nama_kategori', $kategoriFilter));
        }

        $namaList = $query->orderBy('nama_wisata')->pluck('nama_wisata');

        if ($namaList->isEmpty()) {
            return "Maaf, saya tidak menemukan destinasi wisata pada kategori tersebut.";
        }

        $prefix = $kategoriFilter ? "Berikut daftar wisata {$kategoriFilter} di Kutai Barat" : "Berikut daftar destinasi wisata di Kutai Barat";

        return $prefix . " (total {$namaList->count()}):\n- " . $namaList->join("\n- ");
    }

    /** Retrieval berdasarkan intent — query SQL spesifik, bukan semua data */
    public function retrieve(string $question, array $intents): Collection
    {
        $lower = strtolower($question);
        $keywords = array_filter(
            array_map('strtolower', preg_split('/[\s,]+/', $question)),
            fn ($w) => strlen($w) >= 3,
        );

        $query = Wisata::with(['kategori', 'fasilitas'])->where('is_active', true);

        // Selalu cari keyword di nama/deskripsi
        if (! empty($keywords)) {
            $query->where(function ($q) use ($keywords) {
                foreach ($keywords as $word) {
                    $q->orWhereRaw('LOWER(nama_wisata) LIKE ?', ['%' . $word . '%'])
                      ->orWhereRaw('LOWER(deskripsi) LIKE ?', ['%' . $word . '%']);
                }
            });
        }

        // Intent spesifik → tambah filter SQL yang tepat
        foreach ($intents as $intent) {
            match ($intent) {
                'kategori' => $query->orWhereHas('kategori', function ($q) use ($keywords) {
                    foreach ($keywords as $word) {
                        $q->whereRaw('LOWER(nama_kategori) LIKE ?', ['%' . $word . '%']);
                    }
                }),
                'fasilitas' => $query->orWhereHas('fasilitas', function ($q) use ($keywords) {
                    foreach ($keywords as $word) {
                        $q->whereRaw('LOWER(nama_fasilitas) LIKE ?', ['%' . $word . '%']);
                    }
                }),
                'lokasi' => $query->orWhere(function ($q) use ($keywords) {
                    foreach ($keywords as $word) {
                        $q->orWhereRaw('LOWER(alamat) LIKE ?', ['%' . $word . '%']);
                    }
                }),
                'harga' => $query->orWhere(function ($q) use ($keywords) {
                    foreach ($keywords as $word) {
                        $q->orWhereRaw('LOWER(harga_tiket) LIKE ?', ['%' . $word . '%']);
                    }
                }),
                default => null,
            };
        }

        return $query->limit(20)->get();
    }

    /** Ranking — skor berdasarkan kecocokan intent, ambil Top-K */
    public function rank(string $question, array $intents, Collection $wisatas): Collection
    {
        $lower = strtolower($question);
        $keywords = array_filter(
            array_map('strtolower', preg_split('/[\s,]+/', $question)),
            fn ($w) => strlen($w) >= 3,
        );

        return $wisatas
            ->map(function ($w) use ($lower, $keywords, $intents) {
                $score = 0;
                $nama = strtolower($w->nama_wisata);
                $deskripsi = strtolower($w->deskripsi ?? '');
                $alamat = strtolower($w->alamat ?? '');
                $kategori = strtolower($w->kategori?->nama_kategori ?? '');
                $fasilitas = $w->fasilitas->pluck('nama_fasilitas')->implode(' ');

                foreach ($keywords as $word) {
                    if (str_contains($nama, $word)) $score += 3;
                    if (str_contains($deskripsi, $word)) $score += 1;
                    if (str_contains($alamat, $word)) $score += 1;
                    if (str_contains($kategori, $word)) $score += 2;
                    if (str_contains(strtolower($fasilitas), $word)) $score += 1.5;
                }

                foreach ($intents as $intent) {
                    match ($intent) {
                        'harga' => $w->harga_tiket ? $score += 0.5 : null,
                        'lokasi' => $w->latitude ? $score += 0.5 : null,
                        default => null,
                    };
                }

                $w->relevance_score = round($score, 1);

                return $w;
            })
            ->filter(fn ($w) => $w->relevance_score > 0)
            ->sortByDesc('relevance_score')
            ->take(self::TOP_K)
            ->values();
    }

    /** Metadata statistik — disisipkan ke context LLM biar gak salah hitung */
    public function buildMetadata(): string
    {
        $total = Wisata::where('is_active', true)->count();
        $perKategori = Wisata::where('is_active', true)
            ->with('kategori')
            ->get()
            ->groupBy(fn ($w) => $w->kategori?->nama_kategori ?? 'Lainnya')
            ->map->count()
            ->sortDesc()
            ->map(fn ($c, $k) => "{$k}: {$c}")
            ->join(', ');

        return "TOTAL_DESTINASI_TERSEDIA: {$total}\n"
            . "DISTRIBUSI_KATEGORI: {$perKategori}\n";
    }
}
