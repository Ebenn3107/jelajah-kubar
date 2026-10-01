<?php

use App\Models\AiLog;
use App\Models\Fasilitas;
use App\Models\Kategori;
use App\Models\User;
use App\Models\Wisata;
use App\Services\AiContentService;
use App\Services\LocalGuideService;
use Illuminate\Support\Facades\Http;

/** Katalog kecil yang meniru data asli (nama berbahasa Inggris + kategori Indonesia). */
function seedGuideCatalog(): array
{
    $air = Kategori::create(['nama_kategori' => 'Air Terjun', 'slug' => 'air-terjun']);
    $danau = Kategori::create(['nama_kategori' => 'Danau', 'slug' => 'danau']);
    $alam = Kategori::create(['nama_kategori' => 'Alam', 'slug' => 'alam']);

    $parkir = Fasilitas::create(['nama_fasilitas' => 'Parkir']);
    $foto = Fasilitas::create(['nama_fasilitas' => 'Spot Foto']);

    $inar = Wisata::create([
        'nama_wisata' => 'Jantur Inar Waterfall', 'alamat' => 'Terajuk, Kec. Nyuatan', 'kategori_id' => $air->id,
        'deskripsi' => 'Air terjun megah setinggi 30 meter dengan tebing batu dan hutan tropis yang sejuk.',
        'harga_tiket' => 'Rp 10.000', 'jam_buka' => '07:00', 'jam_tutup' => '17:00', 'is_active' => true,
    ]);
    $inar->fasilitas()->attach([$parkir->id, $foto->id]);

    $jempang = Wisata::create([
        'nama_wisata' => 'Lake Jempang', 'alamat' => 'Tj. Isuy, Kec. Jempang', 'kategori_id' => $danau->id,
        'deskripsi' => 'Danau terbesar di Kutai Barat yang terhubung dengan Sungai Mahakam.',
        'harga_tiket' => 'Gratis', 'jam_buka' => '24 jam', 'jam_tutup' => '24 jam', 'is_active' => true,
    ]);

    $kersik = Wisata::create([
        'nama_wisata' => 'Kersik Luway Orchid Forest', 'alamat' => 'Sekolaq Darat', 'kategori_id' => $alam->id,
        'deskripsi' => 'Cagar alam habitat anggrek hitam yang langka di tanah berpasir putih.',
        'harga_tiket' => 'Rp 10.000', 'jam_buka' => '08:00', 'jam_tutup' => '16:00', 'is_active' => true,
    ]);
    $kersik->fasilitas()->attach([$parkir->id]);

    return compact('inar', 'jempang', 'kersik');
}

/** Respons DeepSeek palsu berisi JSON {"answer": ...} atau JSON bebas. */
function fakeDeepSeek(array|string $content, int $tokens = 500): void
{
    Http::fake([
        'api.deepseek.com/*' => Http::response([
            'choices' => [['message' => ['content' => is_string($content) ? $content : json_encode($content)]]],
            'usage' => ['prompt_tokens' => $tokens, 'completion_tokens' => 100, 'total_tokens' => $tokens + 100],
        ]),
    ]);
}

beforeEach(function () {
    config([
        'ai.provider' => 'deepseek',
        'ai.deepseek.api_key' => 'kunci-tes',
        'ai.limits.local_guide_per_day' => 15,
        'ai.limits.travel_planner_per_day' => 3,
        'ai.limits.daily_budget_usd' => 1.0,
    ]);
});

// ---------------------------------------------------------------- deteksi intent

test('intent dicocokkan sebagai kata utuh, bukan potongan kata', function () {
    $guide = app(LocalGuideService::class);

    // "alamat" mengandung "alam" tetapi bukan kategori Alam
    $intents = $guide->detectIntent('Apa alamat Kersik Luway?');
    expect($intents)->toContain('lokasi')->not->toContain('kategori');

    expect($guide->detectIntent('Berapa harga tiket masuk Jantur Inar?'))->toContain('harga');
    expect($guide->detectIntent('Ada tempat untuk anak-anak?'))->toContain('aktivitas');
});

test('pertanyaan daftar hanya faktual bila generik', function () {
    seedGuideCatalog();
    $guide = app(LocalGuideService::class);

    $faktual = fn (string $q) => $guide->isFactual($q, $guide->detectIntent($q));

    expect($faktual('Berapa total destinasi wisata?'))->toBeTrue();
    expect($faktual('Sebutkan semua wisata di Kutai Barat'))->toBeTrue();

    // Butuh detail, jangan dijawab hanya dengan daftar nama
    expect($faktual('Apa saja fasilitas di Kersik Luway?'))->toBeFalse();
    expect($faktual('Daftar harga tiket semua wisata'))->toBeFalse();
    expect($faktual('Apa saja yang ada di Jantur Inar?'))->toBeFalse();
});

test('daftar kategori memakai nama kategori dari database', function () {
    seedGuideCatalog();
    $guide = app(LocalGuideService::class);

    $q = 'Sebutkan semua wisata air terjun';
    $jawaban = $guide->answerFactual($q, $guide->detectIntent($q));

    expect($jawaban)->toContain('Jantur Inar Waterfall')->not->toContain('Lake Jempang');
});

// ---------------------------------------------------------------- retrieval & ranking

test('destinasi yang disebut langsung dikenali walau nama dipersingkat', function () {
    $c = seedGuideCatalog();
    $guide = app(LocalGuideService::class);

    expect($guide->findMentioned('Berapa tiket masuk Kersik Luway?')->all())->toBe([$c['kersik']->id]);
    expect($guide->findMentioned('Apa fasilitas di Jantur Inar?')->all())->toBe([$c['inar']->id]);
    expect($guide->findMentioned('Danau Jempang itu seperti apa?')->all())->toBe([$c['jempang']->id]);
    expect($guide->findMentioned('Rekomendasi tempat untuk keluarga')->all())->toBe([]);
});

test('destinasi yang disebut langsung selalu peringkat pertama', function () {
    $c = seedGuideCatalog();
    $guide = app(LocalGuideService::class);

    $q = 'Apa fasilitas di Kersik Luway?';
    $intents = $guide->detectIntent($q);
    $ranked = $guide->rank($q, $intents, $guide->retrieve($q, $intents));

    expect($ranked->first()->id)->toBe($c['kersik']->id);
});

test('kata umum tidak membuat semua destinasi cocok', function () {
    seedGuideCatalog();
    $guide = app(LocalGuideService::class);

    expect($guide->contentKeywords('Apa saja wisata yang ada di Kutai Barat?'))->toBe([]);
    expect($guide->contentKeywords('Tempat berenang yang sejuk'))->toBe(['berenang', 'sejuk']);

    // Pertanyaan di luar topik tidak menemukan apa pun (dan tidak memanggil AI)
    $q = 'Siapa presiden Indonesia?';
    $intents = $guide->detectIntent($q);
    expect($guide->rank($q, $intents, $guide->retrieve($q, $intents)))->toBeEmpty();
});

// ---------------------------------------------------------------- validasi jawaban

test('validator mempertahankan kalimat benar dan membuang nama tempat karangan', function () {
    $service = app(AiContentService::class);
    $konteks = [['nama_wisata' => 'Lake Jempang'], ['nama_wisata' => 'Jantur Inar Waterfall']];

    $hasil = $service->validateLocalGuideAnswer(
        'Harga tiket Lake Jempang adalah Gratis. Pantai Benangaq juga bagus. Danau Jempang buka 24 jam.',
        $konteks,
    );

    expect($hasil)
        ->toContain('Harga tiket Lake Jempang adalah Gratis.')
        ->toContain('Danau Jempang buka 24 jam.')
        ->not->toContain('Benangaq');
});

test('validator tidak mengembalikan jawaban mentah bila semua kalimat mengarang', function () {
    $service = app(AiContentService::class);

    $hasil = $service->validateLocalGuideAnswer(
        'Pantai Benangaq sangat indah. Hutan Lindung Wehea dekat sini.',
        [['nama_wisata' => 'Lake Jempang']],
    );

    expect($hasil)->not->toContain('Benangaq')->not->toContain('Wehea')->toContain('Lake Jempang');
});

test('validator memberi pesan aman untuk jawaban kosong', function () {
    expect(app(AiContentService::class)->validateLocalGuideAnswer(null, []))->toContain('belum bisa menjawab');
});

// ---------------------------------------------------------------- alur lengkap (HTTP palsu)

test('pertanyaan spesifik menghasilkan jawaban dan satu panggilan AI tercatat untuk pengguna', function () {
    $c = seedGuideCatalog();
    $user = User::factory()->create();
    fakeDeepSeek(['answer' => 'Tiket masuk Kersik Luway Orchid Forest Rp 10.000.']);

    $this->actingAs($user)
        ->post(route('local-guide.ask'), ['question' => 'Berapa harga tiket Kersik Luway?'])
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('answer', 'Tiket masuk Kersik Luway Orchid Forest Rp 10.000.')
            ->where('relatedWisatas.0.slug', $c['kersik']->slug)
            ->where('quota.remaining', 14)
            ->where('quota.limit', 15));

    Http::assertSentCount(1);
    expect(AiLog::where('user_id', $user->id)->where('type', 'local_guide')->count())->toBe(1);

    // Konteks yang dikirim ke model memuat harga destinasi yang ditanya
    Http::assertSent(fn ($request) => str_contains(json_encode($request['messages']), 'Rp 10.000'));
});

test('pertanyaan identik dijawab dari cache tanpa panggilan AI dan tanpa memotong batas', function () {
    seedGuideCatalog();
    $user = User::factory()->create();
    fakeDeepSeek(['answer' => 'Tiket masuk Kersik Luway Orchid Forest Rp 10.000.']);

    $this->actingAs($user)->post(route('local-guide.ask'), ['question' => 'Berapa harga tiket Kersik Luway?'])->assertOk();

    // Variasi huruf besar/tanda baca dianggap pertanyaan yang sama
    $this->actingAs($user)
        ->post(route('local-guide.ask'), ['question' => 'berapa harga tiket kersik luway']);
    $this->actingAs($user)
        ->post(route('local-guide.ask'), ['question' => 'Berapa harga tiket Kersik Luway??'])
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('answer', 'Tiket masuk Kersik Luway Orchid Forest Rp 10.000.')
            ->where('quota.remaining', 14));

    Http::assertSentCount(1);
});

test('batas harian pemandu menolak pertanyaan baru tetapi cache tetap menjawab', function () {
    seedGuideCatalog();
    config(['ai.limits.local_guide_per_day' => 1]);
    $user = User::factory()->create();
    fakeDeepSeek(['answer' => 'Tiket masuk Kersik Luway Orchid Forest Rp 10.000.']);

    $this->actingAs($user)->post(route('local-guide.ask'), ['question' => 'Berapa harga tiket Kersik Luway?'])->assertOk();

    $this->actingAs($user)
        ->post(route('local-guide.ask'), ['question' => 'Apa fasilitas di Jantur Inar?'])
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('answer', fn ($v) => str_contains($v, 'Batas harian tercapai'))
            ->where('quota.remaining', 0));

    // Pertanyaan pertama (identik) masih bisa dijawab dari cache
    $this->actingAs($user)
        ->post(route('local-guide.ask'), ['question' => 'Berapa harga tiket Kersik Luway?'])
        ->assertInertia(fn ($page) => $page->where('answer', 'Tiket masuk Kersik Luway Orchid Forest Rp 10.000.'));

    Http::assertSentCount(1);
});

test('pagar anggaran global menghentikan fitur AI untuk semua pengguna', function () {
    seedGuideCatalog();
    config(['ai.limits.daily_budget_usd' => 0.5]);
    AiLog::create([
        'user_id' => User::factory()->create()->id, 'type' => 'local_guide', 'model' => 'tes',
        'prompt_tokens' => 0, 'completion_tokens' => 0, 'total_tokens' => 0,
        'response_time_ms' => 1, 'success' => true, 'cost' => 0.6,
    ]);
    Http::fake();

    $this->actingAs(User::factory()->create())
        ->post(route('local-guide.ask'), ['question' => 'Berapa harga tiket Kersik Luway?'])
        ->assertInertia(fn ($page) => $page->where('answer', fn ($v) => str_contains($v, 'beristirahat')));

    Http::assertNothingSent();
});

test('jawaban AI yang gagal tidak di-cache dan tidak memotong batas', function () {
    seedGuideCatalog();
    $user = User::factory()->create();
    Http::fake(['api.deepseek.com/*' => Http::response([], 500)]);

    $this->actingAs($user)
        ->post(route('local-guide.ask'), ['question' => 'Berapa harga tiket Kersik Luway?'])
        ->assertInertia(fn ($page) => $page
            ->where('answer', fn ($v) => str_contains($v, 'belum bisa menjawab'))
            ->where('quota.remaining', 15));

    fakeDeepSeek(['answer' => 'Tiket masuk Kersik Luway Orchid Forest Rp 10.000.']);

    $this->actingAs($user)
        ->post(route('local-guide.ask'), ['question' => 'Berapa harga tiket Kersik Luway?'])
        ->assertInertia(fn ($page) => $page->where('answer', 'Tiket masuk Kersik Luway Orchid Forest Rp 10.000.'));
});

test('pertanyaan di luar topik tidak memanggil AI', function () {
    seedGuideCatalog();
    Http::fake();

    $this->actingAs(User::factory()->create())
        ->post(route('local-guide.ask'), ['question' => 'Siapa presiden Indonesia?'])
        ->assertInertia(fn ($page) => $page->where('answer', fn ($v) => str_contains($v, 'tidak menemukan data wisata')));

    Http::assertNothingSent();
});

// ---------------------------------------------------------------- planner

test('planner memakai cache untuk masukan identik dan menghormati batas harian', function () {
    seedGuideCatalog();
    config(['ai.limits.travel_planner_per_day' => 1]);
    $user = User::factory()->create();
    fakeDeepSeek(['days' => [], 'total_budget_estimate' => 'Rp 500.000', 'tips' => 'Bawa jas hujan.'], 800);

    $input = ['durasi' => 2, 'budget' => 'Rp 500.000', 'minat' => 'air terjun'];

    $this->actingAs($user)->post(route('travel-planner.plan'), $input)
        ->assertInertia(fn ($page) => $page->where('error', null)->where('quota.remaining', 0));

    // Identik (beda huruf/tanda baca) => dari cache, batas tidak terpakai
    $this->actingAs($user)->post(route('travel-planner.plan'), ['minat' => 'Air Terjun!'] + $input)
        ->assertInertia(fn ($page) => $page->where('error', null)->has('result'));

    // Masukan berbeda => ditolak karena batas harian habis
    $this->actingAs($user)->post(route('travel-planner.plan'), ['durasi' => 3] + $input)
        ->assertInertia(fn ($page) => $page
            ->where('result', null)
            ->where('error', fn ($v) => str_contains($v, 'Batas harian tercapai')));

    Http::assertSentCount(1);
});

test('pertanyaan wisata gratis menemukan destinasi bertiket Gratis', function () {
    $c = seedGuideCatalog();
    $guide = app(LocalGuideService::class);

    $q = 'Wisata apa yang gratis?';
    $intents = $guide->detectIntent($q);
    $ranked = $guide->rank($q, $intents, $guide->retrieve($q, $intents));

    expect($ranked->first()->id)->toBe($c['jempang']->id);
});
