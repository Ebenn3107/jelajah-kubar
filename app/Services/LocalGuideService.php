<?php

namespace App\Services;

use App\Models\Kategori;
use App\Models\Wisata;
use Illuminate\Support\Collection;

class LocalGuideService
{
    const TOP_K = 5;

    /** Keyword map per intent — dicocokkan sebagai KATA UTUH (bukan potongan kata) */
    private array $intentKeywords = [
        'count' => ['berapa total', 'berapa banyak', 'jumlah wisata', 'total wisata', 'berapa jumlah', 'total destinasi', 'jumlah destinasi', 'berapa destinasi'],
        'daftar' => ['sebutkan semua', 'apa saja', 'daftar', 'list', 'semua wisata', 'semua destinasi'],
        'kategori' => ['air terjun', 'danau', 'budaya', 'alam', 'petualangan', 'gunung', 'hutan', 'pantai', 'sungai', 'kategori'],
        'aktivitas' => ['hiking', 'mendaki', 'foto', 'fotografi', 'keluarga', 'anak', 'camping', 'berkemah', 'renang', 'berenang', 'liburan', 'jalan-jalan', 'menikmati', 'cocok'],
        'fasilitas' => ['parkir', 'toilet', 'musholla', 'makan', 'makanan', 'warung', 'gazebo', 'camping', 'pemandu', 'fasilitas'],
        'harga' => ['harga', 'tiket', 'tarif', 'karcis', 'biaya', 'gratis', 'bayar', 'masuk'],
        'lokasi' => ['lokasi', 'alamat', 'letak', 'dimana', 'di mana', 'kecamatan', 'dekat', 'jarak', 'jalan', 'rute', 'akses'],
    ];

    /** Kata umum yang tidak boleh dipakai sebagai kata kunci pencarian isi destinasi */
    private const STOPWORDS = [
        'yang', 'dan', 'atau', 'di', 'ke', 'dari', 'untuk', 'dengan', 'pada', 'dalam', 'ini', 'itu', 'ada', 'adalah',
        'apa', 'apakah', 'saja', 'siapa', 'bagaimana', 'berapa', 'mana', 'dimana', 'kapan', 'kenapa', 'mengapa',
        'saya', 'aku', 'kami', 'kita', 'anda', 'kamu', 'bisa', 'boleh', 'mau', 'ingin', 'tolong', 'mohon', 'dong', 'ya', 'nih',
        'wisata', 'destinasi', 'tempat', 'lokasi', 'kutai', 'barat', 'kubar', 'kalimantan', 'timur', 'tentang', 'info', 'informasi',
        'sebutkan', 'semua', 'daftar', 'list', 'harga', 'tiket', 'masuk', 'tarif', 'biaya', 'cocok', 'ada', 'tidak', 'sih', 'lah',
        'jam', 'buka', 'tutup', 'paling', 'sangat', 'lebih', 'banyak', 'total', 'jumlah',
        'alamat', 'fasilitas', 'tempatnya', 'letak', 'rute', 'akses', 'kategori', 'jarak', 'dekat', 'bayar', 'karcis',
    ];

    /** Kata generik pada nama destinasi — tidak membedakan satu destinasi dari yang lain */
    private const GENERIC_NAME_WORDS = [
        'air', 'terjun', 'danau', 'lake', 'waterfall', 'wisata', 'pantai', 'bukit', 'gunung', 'hutan', 'forest',
        'taman', 'desa', 'kampung', 'sungai', 'pulau', 'goa', 'gua', 'park', 'beach', 'mountain', 'river',
    ];

    /** Cache per-instance: destinasi yang disebut langsung, per pertanyaan */
    private array $mentionedCache = [];

    private function hasWord(string $haystackLower, string $needleLower): bool
    {
        return (bool) preg_match('/(?<![\p{L}\p{N}])' . preg_quote($needleLower, '/') . '(?![\p{L}\p{N}])/u', $haystackLower);
    }

    /** @return string[] */
    private function tokenize(string $textLower): array
    {
        return preg_split('/[^\p{L}\p{N}]+/u', $textLower, -1, PREG_SPLIT_NO_EMPTY) ?: [];
    }

    /** Kata kunci isi: token >= 3 huruf yang bukan kata umum */
    public function contentKeywords(string $question): array
    {
        return array_values(array_unique(array_filter(
            $this->tokenize(mb_strtolower($question)),
            fn ($w) => mb_strlen($w) >= 3 && ! in_array($w, self::STOPWORDS, true),
        )));
    }

    /** Deteksi intent dari pertanyaan (kata utuh) */
    public function detectIntent(string $question): array
    {
        $lower = mb_strtolower($question);
        $intents = [];

        foreach ($this->intentKeywords as $intent => $keywords) {
            foreach ($keywords as $keyword) {
                if ($this->hasWord($lower, $keyword)) {
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

    /**
     * Destinasi aktif yang disebut langsung dalam pertanyaan.
     * Cocok bila token pembeda nama (di luar kata generik) muncul: token yang unik milik satu
     * destinasi (>= 5 huruf) cukup; selain itu minimal separuh token pembeda harus muncul.
     */
    public function findMentioned(string $question): Collection
    {
        $key = mb_strtolower($question);

        if (isset($this->mentionedCache[$key])) {
            return $this->mentionedCache[$key];
        }

        $tokens = $this->tokenize($key);
        $all = Wisata::where('is_active', true)->get(['id', 'nama_wisata']);

        $distinct = $all->mapWithKeys(fn ($w) => [
            $w->id => array_values(array_diff($this->tokenize(mb_strtolower($w->nama_wisata)), self::GENERIC_NAME_WORDS)),
        ]);

        $ownerCount = [];
        foreach ($distinct as $words) {
            foreach (array_unique($words) as $word) {
                $ownerCount[$word] = ($ownerCount[$word] ?? 0) + 1;
            }
        }

        $ids = $all->filter(function ($w) use ($distinct, $ownerCount, $tokens) {
            $words = $distinct[$w->id];

            if (empty($words)) {
                return false;
            }

            $hits = array_intersect($words, $tokens);

            foreach ($hits as $hit) {
                if (mb_strlen($hit) >= 5 && ($ownerCount[$hit] ?? 0) === 1) {
                    return true;
                }
            }

            return count($hits) >= (int) ceil(count($words) / 2) && count($hits) > 0;
        })->pluck('id');

        return $this->mentionedCache[$key] = $ids;
    }

    /**
     * Apakah pertanyaan bisa dijawab langsung dari DB tanpa LLM?
     * Hitung total selalu faktual. Pertanyaan "daftar" hanya faktual bila generik: tidak menyebut
     * destinasi tertentu dan tidak menanyakan harga/fasilitas/lokasi/aktivitas (itu butuh detail).
     */
    public function isFactual(string $question, array $intents): bool
    {
        if (in_array('count', $intents, true)) {
            return true;
        }

        if (! in_array('daftar', $intents, true)) {
            return false;
        }

        $detailIntents = ['harga', 'fasilitas', 'lokasi', 'aktivitas'];

        if (array_intersect($detailIntents, $intents)) {
            return false;
        }

        return $this->findMentioned($question)->isEmpty();
    }

    /** Jawaban faktual langsung dari database (tanpa LLM) */
    public function answerFactual(string $question, array $intents): ?string
    {
        $lower = mb_strtolower($question);
        $total = Wisata::where('is_active', true)->count();
        $perKategori = $this->countPerKategori();

        if (in_array('count', $intents)) {
            $bagian = $perKategori->map(fn ($c, $k) => "{$k}: {$c}")->join(', ');

            return "Saat ini ada {$total} destinasi wisata di Kabupaten Kutai Barat. "
                . "Rincian per kategori: {$bagian}.";
        }

        // daftar — filter kategori sesuai nama kategori di database yang disebut dalam pertanyaan
        $kategoriFilter = Kategori::pluck('nama_kategori')
            ->first(fn ($nama) => $this->hasWord($lower, mb_strtolower($nama)));

        $query = Wisata::where('is_active', true);

        if ($kategoriFilter) {
            $query->whereHas('kategori', fn ($q) => $q->where('nama_kategori', $kategoriFilter));
        } else {
            // Kata kategori umum yang bukan nama kategori (mis. "pantai"): cari di nama/deskripsi,
            // supaya "daftar pantai" tidak mengembalikan semua destinasi.
            $kataKategori = array_values(array_filter(
                $this->intentKeywords['kategori'],
                fn ($k) => $k !== 'kategori' && $this->hasWord($lower, $k),
            ));

            if ($kataKategori) {
                $query->where(function ($q) use ($kataKategori) {
                    foreach ($kataKategori as $k) {
                        $pattern = '%' . $this->escapeLike($k) . '%';
                        $q->orWhereRaw('LOWER(nama_wisata) LIKE ?', [$pattern])
                            ->orWhereRaw('LOWER(deskripsi) LIKE ?', [$pattern]);
                    }
                });
                $kategoriFilter = implode(' / ', $kataKategori);
            }
        }

        $namaList = $query->orderBy('nama_wisata')->pluck('nama_wisata');

        if ($namaList->isEmpty()) {
            return 'Maaf, saya tidak menemukan destinasi wisata pada kategori tersebut.';
        }

        $prefix = $kategoriFilter ? "Berikut daftar wisata {$kategoriFilter} di Kutai Barat" : 'Berikut daftar destinasi wisata di Kutai Barat';

        return $prefix . " (total {$namaList->count()}):\n- " . $namaList->join("\n- ");
    }

    /** Jumlah wisata aktif per kategori, dihitung di database (tanpa memuat model) */
    private function countPerKategori(): Collection
    {
        return Wisata::where('wisatas.is_active', true)
            ->leftJoin('kategoris', 'kategoris.id', '=', 'wisatas.kategori_id')
            ->selectRaw("COALESCE(kategoris.nama_kategori, 'Lainnya') as nama, COUNT(*) as total")
            ->groupByRaw("COALESCE(kategoris.nama_kategori, 'Lainnya')")
            ->pluck('total', 'nama')
            ->map(fn ($c) => (int) $c)
            ->sortDesc();
    }

    private function escapeLike(string $v): string
    {
        return addcslashes($v, '%_\\');
    }

    /** Retrieval berdasarkan intent — query SQL spesifik, bukan semua data */
    public function retrieve(string $question, array $intents): Collection
    {
        $keywords = $this->contentKeywords($question);
        $mentioned = $this->findMentioned($question);

        $query = Wisata::with(['kategori', 'fasilitas'])->where('is_active', true);

        // Keyword + intent + destinasi yang disebut digabung (OR) dalam satu grup agar is_active tetap berlaku
        $query->where(function ($group) use ($keywords, $intents, $mentioned) {
            $like = fn ($col) => function ($q) use ($col, $keywords) {
                foreach ($keywords as $w) {
                    $q->orWhereRaw("LOWER($col) LIKE ?", ['%' . $this->escapeLike($w) . '%']);
                }
            };

            foreach ($keywords as $word) {
                $pattern = '%' . $this->escapeLike($word) . '%';
                $group->orWhereRaw('LOWER(nama_wisata) LIKE ?', [$pattern])
                    ->orWhereRaw('LOWER(deskripsi) LIKE ?', [$pattern]);
            }

            if ($mentioned->isNotEmpty()) {
                $group->orWhereIn('wisatas.id', $mentioned->all());
            }

            foreach ($intents as $intent) {
                match ($intent) {
                    'kategori' => $group->orWhereHas('kategori', $like('nama_kategori')),
                    'fasilitas' => $group->orWhereHas('fasilitas', $like('nama_fasilitas')),
                    'lokasi' => $group->orWhere($like('alamat')),
                    'harga' => $group->orWhere($like('harga_tiket')),
                    default => null,
                };
            }
        });

        return $query->limit(20)->get();
    }

    /** Ranking — skor berdasarkan kecocokan intent, ambil Top-K. Destinasi yang disebut langsung selalu di atas. */
    public function rank(string $question, array $intents, Collection $wisatas): Collection
    {
        $keywords = $this->contentKeywords($question);
        $mentioned = $this->findMentioned($question);

        return $wisatas
            ->map(function ($w) use ($keywords, $intents, $mentioned) {
                $score = 0;
                $nama = mb_strtolower($w->nama_wisata);
                $deskripsi = mb_strtolower($w->deskripsi ?? '');
                $alamat = mb_strtolower($w->alamat ?? '');
                $kategori = mb_strtolower($w->kategori?->nama_kategori ?? '');
                $fasilitas = mb_strtolower($w->fasilitas->pluck('nama_fasilitas')->implode(' '));

                foreach ($keywords as $word) {
                    if (str_contains($nama, $word)) {
                        $score += 3;
                    }

                    if (str_contains($deskripsi, $word)) {
                        $score += 1;
                    }

                    if (str_contains($alamat, $word)) {
                        $score += 1;
                    }

                    if (str_contains($kategori, $word)) {
                        $score += 2;
                    }

                    if (str_contains($fasilitas, $word)) {
                        $score += 1.5;
                    }
                }

                foreach ($intents as $intent) {
                    match ($intent) {
                        'harga' => $w->harga_tiket ? $score += 0.5 : null,
                        'lokasi' => $w->latitude ? $score += 0.5 : null,
                        default => null,
                    };
                }

                if ($mentioned->contains($w->id)) {
                    $score += 100;
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
        $perKategori = $this->countPerKategori()
            ->map(fn ($c, $k) => "{$k}: {$c}")
            ->join(', ');

        return "TOTAL_DESTINASI_TERSEDIA: {$total}\n"
            . "DISTRIBUSI_KATEGORI: {$perKategori}\n";
    }
}
