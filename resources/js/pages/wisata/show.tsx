import { Head, Link, router, usePage } from '@inertiajs/react';
import { Heart, ImageIcon, Images, MapPin, MessageSquare, Star } from 'lucide-react';
import { useState } from 'react';
import { GaleriLightbox } from '@/components/galeri-lightbox';
import { WisataMap } from '@/components/wisata-map';
import { WisataPlanCard } from '@/components/wisata-plan-card';
import type { Auth } from '@/types';

interface GaleriItem {
    id: number;
    foto: string;
    foto_url: string | null;
    caption: string | null;
    is_primary: boolean;
}

interface FasilitasItem {
    id: number;
    nama_fasilitas: string;
}

interface ReviewItem {
    id: number;
    rating: number;
    komentar: string | null;
    user: { id: number; name: string };
    created_at: string;
}

interface WisataDetail {
    id: number;
    nama_wisata: string;
    slug: string;
    alamat: string;
    deskripsi: string;
    foto: string | null;
    foto_url: string | null;
    kategori: { id: number; nama_kategori: string } | null;
    latitude: string | null;
    longitude: string | null;
    harga_tiket: string | null;
    jam_buka: string | null;
    jam_tutup: string | null;
    kontak: string | null;
    galeris: GaleriItem[];
    fasilitas: FasilitasItem[];
    reviews: ReviewItem[];
    review_summary?: string | null;
}

interface Props {
    wisata: WisataDetail;
    userReview: ReviewItem | null;
    isFavorited: boolean;
}

function StarRating({ rating, onChange, readonly = false }: { rating: number; onChange?: (n: number) => void; readonly?: boolean }) {
    return (
        <div
            className="flex gap-1"
            {...(readonly ? { role: 'img', 'aria-label': `Rating ${rating} dari 5` } : { role: 'group', 'aria-label': 'Beri rating' })}
        >
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button"
                    disabled={readonly}
                    tabIndex={readonly ? -1 : undefined}
                    aria-label={`${n} bintang`}
                    aria-pressed={readonly ? undefined : n <= rating}
                    onClick={() => onChange?.(n)}
                    className={`rounded transition-colors focus-visible:outline-2 focus-visible:outline-brand ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
                >
                    <Star className={`size-6 ${n <= rating ? 'fill-amber text-amber' : 'text-line'}`} />
                </button>
            ))}
        </div>
    );
}

export default function WisataShow({ wisata, userReview, isFavorited }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const galeris = wisata.galeris || [];
    // Foto utama lebih dulu; bila galeri kosong, pakai foto sampul wisata
    const gallery: { id: number; foto_url: string | null; caption: string | null }[] = [
        ...galeris.filter((g) => g.foto_url && g.is_primary),
        ...galeris.filter((g) => g.foto_url && !g.is_primary),
    ];

    if (gallery.length === 0 && wisata.foto_url) {
        gallery.push({ id: 0, foto_url: wisata.foto_url, caption: null });
    }

    const thumbs = gallery.slice(1, 5);
    const mapsUrl = wisata.latitude && wisata.longitude
        ? `https://www.google.com/maps/dir/?api=1&destination=${wisata.latitude},${wisata.longitude}`
        : null;
    const isPhone = wisata.kontak ? /^[+\d\s()-]{7,}$/.test(wisata.kontak) : false;
    const reviews = wisata.reviews || [];

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [reviewRating, setReviewRating] = useState(userReview?.rating || 0);
    const [reviewKomentar, setReviewKomentar] = useState(userReview?.komentar || '');
    const [editing, setEditing] = useState(false);
    const [reviewProcessing, setReviewProcessing] = useState(false);
    const [reviewErrors, setReviewErrors] = useState<Record<string, string>>({});

    const reviewOptions = (onSuccess?: () => void) => ({
        preserveScroll: true,
        onStart: () => {
            setReviewProcessing(true);
            setReviewErrors({});
        },
        onSuccess,
        onError: (errs: Record<string, string>) => setReviewErrors(errs),
        onFinish: () => setReviewProcessing(false),
    });

    const avgRating = reviews.length > 0 ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length * 10) / 10 : 0;

    const handleFavorit = () => {
        if (!auth.user) {
            router.visit('/login');

            return;
        }

        router.post(`/wisata/${wisata.id}/favorit`, {}, { preserveScroll: true });
    };

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/wisata/${wisata.id}/review`, { rating: reviewRating, komentar: reviewKomentar }, reviewOptions());
    };

    const handleReviewUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!userReview) {
return;
}

        router.put(`/review/${userReview.id}`, { rating: reviewRating, komentar: reviewKomentar }, reviewOptions(() => setEditing(false)));
    };

    const handleReviewDelete = () => {
        if (!userReview || !confirm('Hapus review ini?')) {
return;
}

        router.delete(`/review/${userReview.id}`, { preserveScroll: true });
    };

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const thumbClass = (i: number): string => {
        if (thumbs.length <= 2) {
            return thumbs.length === 1 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2 md:row-span-1';
        }

        // 3 thumbnail: yang terakhir melebar agar tidak ada sel kosong
        return thumbs.length === 3 && i === 2 ? 'md:col-span-2' : '';
    };

    const infoRows: { label: string; value: React.ReactNode }[] = [
        {
            label: 'Jam buka',
            value: wisata.jam_buka ? (wisata.jam_tutup ? `${wisata.jam_buka} – ${wisata.jam_tutup}` : wisata.jam_buka) : 'Informasi belum tersedia',
        },
        { label: 'Harga tiket', value: wisata.harga_tiket || 'Informasi belum tersedia' },
        ...(wisata.kontak
            ? [{
                label: 'Kontak',
                value: isPhone
                    ? <a href={`tel:${wisata.kontak.replace(/[^\d+]/g, '')}`} className="text-brand hover:underline">{wisata.kontak}</a>
                    : wisata.kontak,
            }]
            : []),
        { label: 'Alamat', value: wisata.alamat },
    ];

    const otherReviews = reviews.filter((r) => !userReview || r.id !== userReview.id);

    return (
        <>
            <Head title={wisata.nama_wisata} />

            <div className="mx-auto max-w-7xl px-5 pb-16 pt-6 md:px-16 md:pt-8">
                <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-ink-muted">
                    <Link href="/wisata" className="hover:text-brand">Destinasi</Link>
                    <span aria-hidden="true">›</span>
                    <span aria-current="page" className="min-w-0 truncate text-ink">{wisata.nama_wisata}</span>
                </nav>

                <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="min-w-0">
                        {wisata.kategori && <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-copper">{wisata.kategori.nama_kategori}</p>}
                        <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-ink wrap-anywhere md:text-5xl">{wisata.nama_wisata}</h1>
                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-ink-muted">
                            <span className="flex items-center gap-1.5">
                                <MapPin className="size-4 shrink-0" aria-hidden="true" />
                                {wisata.alamat}
                            </span>
                            <a href="#ulasan" className="flex items-center gap-1.5 hover:text-brand">
                                <Star className="size-4 fill-amber text-amber" aria-hidden="true" />
                                <span className="font-semibold text-ink">{avgRating > 0 ? avgRating : '—'}</span>
                                <span>({reviews.length} ulasan)</span>
                            </a>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleFavorit}
                        aria-pressed={isFavorited}
                        className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:hidden"
                    >
                        <Heart className={`size-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} aria-hidden="true" />
                        {isFavorited ? 'Tersimpan' : 'Simpan'}
                    </button>
                </header>

                {/* Galeri mosaik */}
                {gallery.length > 0 ? (
                    <div className="relative">
                        <div
                            className="grid grid-cols-[minmax(0,1fr)] gap-3 overflow-hidden rounded-3xl md:h-112 md:grid-cols-4 md:grid-rows-2"
                        >
                            <button
                                type="button"
                                onClick={() => openLightbox(0)}
                                aria-label={gallery[0].caption ? `Perbesar foto: ${gallery[0].caption}` : 'Perbesar foto utama'}
                                className={`group relative aspect-4/3 overflow-hidden bg-surface-high focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand md:aspect-auto ${
                                    thumbs.length === 0 ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-2'
                                }`}
                            >
                                <img src={gallery[0].foto_url ?? ''} alt={gallery[0].caption || wisata.nama_wisata} fetchPriority="high" decoding="async" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </button>

                            {thumbs.map((g, i) => (
                                <button
                                    key={g.id}
                                    type="button"
                                    onClick={() => openLightbox(i + 1)}
                                    aria-label={g.caption ? `Perbesar foto: ${g.caption}` : `Perbesar foto ${i + 2}`}
                                    className={`group relative hidden overflow-hidden bg-surface-high focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand md:block ${thumbClass(i)}`}
                                >
                                    <img src={g.foto_url ?? ''} alt={g.caption || ''} loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                </button>
                            ))}
                        </div>

                        {gallery.length > 1 && (
                            <button
                                type="button"
                                onClick={() => openLightbox(0)}
                                className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-md transition-colors hover:bg-surface-low focus-visible:outline-2 focus-visible:outline-brand"
                            >
                                <Images className="size-4" aria-hidden="true" />
                                Lihat {gallery.length} foto
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex aspect-video items-center justify-center rounded-3xl bg-linear-to-br from-brand to-brand-deep md:aspect-21/9">
                        <ImageIcon className="size-14 text-white/20" aria-hidden="true" />
                    </div>
                )}

                <GaleriLightbox images={gallery} startIndex={lightboxIndex} open={lightboxOpen} onOpenChange={setLightboxOpen} />

                <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-x-12 gap-y-12 lg:grid-cols-12">
                    <div className="lg:col-span-8">
                        <section className="mb-12">
                            <h2 className="mb-4 text-2xl font-bold tracking-tight text-ink">Tentang</h2>
                            <p className="text-lg leading-relaxed text-ink-muted">{wisata.deskripsi}</p>
                        </section>

                        <section className="mb-12" aria-labelledby="info-praktis">
                            <h2 id="info-praktis" className="mb-4 text-2xl font-bold tracking-tight text-ink">Info praktis</h2>
                            <dl className="divide-y divide-line/60 rounded-3xl bg-surface-low px-6 py-2 md:px-8">
                                {infoRows.map((row) => (
                                    <div key={row.label} className="grid grid-cols-[minmax(0,1fr)] gap-1 py-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
                                        <dt className="text-sm font-semibold text-ink-muted">{row.label}</dt>
                                        <dd className="font-medium text-ink wrap-anywhere">{row.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </section>

                        {wisata.fasilitas && wisata.fasilitas.length > 0 && (
                            <section className="mb-12" aria-labelledby="fasilitas">
                                <h2 id="fasilitas" className="mb-4 text-2xl font-bold tracking-tight text-ink">Fasilitas</h2>
                                <ul className="flex flex-wrap gap-2">
                                    {wisata.fasilitas.map((f) => (
                                        <li key={f.id} className="rounded-full bg-amber-soft px-4 py-1.5 text-sm font-medium text-brand-deep">
                                            {f.nama_fasilitas}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <section className="mb-12" aria-labelledby="lokasi">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                <h2 id="lokasi" className="text-2xl font-bold tracking-tight text-ink">Lokasi</h2>
                                {mapsUrl && (
                                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
                                        Petunjuk arah ↗
                                    </a>
                                )}
                            </div>
                            {wisata.latitude && wisata.longitude ? (
                                <WisataMap latitude={Number(wisata.latitude)} longitude={Number(wisata.longitude)} nama={wisata.nama_wisata} className="h-96 w-full overflow-hidden rounded-3xl" />
                            ) : (
                                <div className="flex h-72 w-full items-center justify-center rounded-3xl bg-surface-high">
                                    <div className="flex flex-col items-center gap-2 text-ink-muted">
                                        <MapPin className="size-10" aria-hidden="true" />
                                        <p className="text-sm font-medium">Titik lokasi belum tersedia</p>
                                    </div>
                                </div>
                            )}
                        </section>

                        <section id="ulasan" aria-labelledby="ulasan-judul" className="scroll-mt-28">
                            <h2 id="ulasan-judul" className="mb-6 flex items-baseline gap-3 text-2xl font-bold tracking-tight text-ink">
                                Ulasan
                                <span className="text-base font-medium text-ink-muted">
                                    {reviews.length > 0 ? `${avgRating} dari 5 · ${reviews.length} ulasan` : 'Belum ada ulasan'}
                                </span>
                            </h2>

                            {wisata.review_summary && (
                                <div className="mb-6 rounded-3xl bg-surface-low p-6">
                                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand">
                                        <MessageSquare className="size-4" aria-hidden="true" />
                                        Ringkasan ulasan (dibuat AI)
                                    </h3>
                                    <p className="leading-relaxed text-ink-muted">{wisata.review_summary}</p>
                                </div>
                            )}

                            {auth.user ? (
                                userReview && !editing ? (
                                    <div className="mb-6 rounded-3xl border border-brand/25 bg-surface-low p-6">
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="mb-1 text-sm font-semibold text-ink">Ulasan kamu</p>
                                                <StarRating rating={userReview.rating} readonly />
                                            </div>
                                            <div className="flex gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditing(true);
                                                        setReviewRating(userReview.rating);
                                                        setReviewKomentar(userReview.komentar || '');
                                                    }}
                                                    className="text-sm font-semibold text-brand hover:underline"
                                                >
                                                    Ubah
                                                </button>
                                                <button type="button" onClick={handleReviewDelete} className="text-sm font-semibold text-red-600 hover:underline">Hapus</button>
                                            </div>
                                        </div>
                                        {userReview.komentar && <p className="mt-3 text-ink-muted">{userReview.komentar}</p>}
                                    </div>
                                ) : (
                                    <form onSubmit={editing ? handleReviewUpdate : handleReviewSubmit} className="mb-6 rounded-3xl border border-line bg-white p-6">
                                        <p className="mb-2 text-sm font-semibold text-ink">{editing ? 'Ubah ulasan' : 'Tulis ulasan'}</p>
                                        <StarRating rating={reviewRating} onChange={setReviewRating} />
                                        <textarea
                                            value={reviewKomentar}
                                            onChange={(e) => setReviewKomentar(e.target.value)}
                                            rows={3}
                                            placeholder="Ceritakan pengalamanmu (min. 10 karakter)..."
                                            aria-label="Komentar ulasan"
                                            className="mt-3 w-full rounded-xl border border-line px-4 py-3 text-sm text-ink placeholder:text-outline focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
                                        />
                                        {Object.values(reviewErrors).map((msg) => (
                                            <p key={msg} role="alert" className="mt-2 text-sm text-red-600">{msg}</p>
                                        ))}
                                        <div className="mt-4 flex gap-2">
                                            <button type="submit" disabled={reviewProcessing || reviewRating < 1} className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:opacity-50">
                                                {editing ? 'Simpan' : 'Kirim'}
                                            </button>
                                            {editing && (
                                                <button type="button" onClick={() => setEditing(false)} className="rounded-full border border-line px-6 py-2.5 text-sm font-semibold text-ink-muted hover:bg-surface-low">
                                                    Batal
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                )
                            ) : (
                                <div className="mb-6 rounded-3xl bg-surface-low p-6 text-center">
                                    <p className="text-ink-muted"><Link href="/login" className="font-semibold text-brand hover:underline">Masuk</Link> untuk menulis ulasan.</p>
                                </div>
                            )}

                            {otherReviews.length === 0 && !userReview ? (
                                <p className="text-ink-muted">Jadilah yang pertama menulis ulasan.</p>
                            ) : (
                                <ul className="divide-y divide-line/60">
                                    {otherReviews.map((r) => (
                                        <li key={r.id} className="py-5 first:pt-0">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold text-ink">{r.user.name}</p>
                                                    {r.created_at && (
                                                        <p className="text-xs text-ink-muted">{new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                    )}
                                                </div>
                                                <StarRating rating={r.rating} readonly />
                                            </div>
                                            {r.komentar && <p className="mt-2 leading-relaxed text-ink-muted">{r.komentar}</p>}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>

                    <aside className="lg:col-span-4">
                        <div className="sticky top-28 flex flex-col gap-6">
                            <WisataPlanCard isFavorited={isFavorited} isLoggedIn={!!auth.user} onFavoritToggle={handleFavorit} mapsUrl={mapsUrl} />
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}
