import { Head, Link, router, usePage } from '@inertiajs/react';
import { Clock, ImageIcon, MapPin, MessageSquare, Phone, Star, Ticket } from 'lucide-react';
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
                    <Star className={`size-6 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}`} />
                </button>
            ))}
        </div>
    );
}

export default function WisataShow({ wisata, userReview, isFavorited }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const primaryFoto = wisata.galeris?.find((g) => g.is_primary)?.foto_url || wisata.foto_url;
    const galeris = wisata.galeris || [];
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

    return (
        <>
            <Head title={wisata.nama_wisata} />

            {/* Hero Section */}
            <section className="relative h-[60vh] w-full overflow-hidden md:h-[80vh]">
                {primaryFoto ? (
                    <img src={primaryFoto} alt={wisata.nama_wisata} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-brand/40 to-brand/10" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-ink/80 from-0% to-transparent to-50%" />

                <div className="absolute bottom-0 left-0 right-0 mx-auto flex max-w-[1280px] flex-col justify-end px-5 pb-16 md:px-[64px]">
                    <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-sm text-white/90">
                        <Link href="/wisata" className="hover:text-white">Destinasi</Link>
                        <span aria-hidden="true" className="text-[14px]">›</span>
                        <span aria-current="page" className="text-white">{wisata.nama_wisata}</span>
                    </nav>

                    <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white md:text-5xl">
                        {wisata.nama_wisata}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                        <div className="flex items-center text-sm text-white/90">
                            <MapPin className="mr-1 size-4" aria-hidden="true" />
                            {wisata.alamat}
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-brand/40 px-3 py-1 text-sm text-white backdrop-blur-md">
                            <Star className="size-4 fill-white" />
                            {avgRating > 0 ? avgRating : '—'} <span className="text-white/90">({reviews.length} Review)</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-5 py-16 md:px-[64px] lg:grid-cols-12">
                <div className="lg:col-span-8">
                    {/* Description */}
                    <div className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-brand">Tentang</h2>
                        <p className="text-lg leading-relaxed text-neutral-700">{wisata.deskripsi}</p>
                    </div>

                    {/* Info Grid */}
                    <div className="mb-8 grid gap-6 md:grid-cols-2">
                        <div className="rounded-xl border border-neutral-200/30 bg-[#eff4ff] p-6 transition-all hover:shadow-lg hover:shadow-brand/5">
                            <div className="mb-2 flex items-center gap-4 text-brand">
                                <Clock className="size-5" />
                                <span className="text-sm font-semibold">Jam Buka</span>
                            </div>
                            <p className="text-xl font-semibold text-neutral-900">
                                {wisata.jam_buka ? (wisata.jam_tutup ? `${wisata.jam_buka} - ${wisata.jam_tutup}` : wisata.jam_buka) : '24 Jam'}
                            </p>
                            {wisata.jam_buka && wisata.jam_tutup && <p className="mt-1 text-xs text-neutral-600">Buka setiap hari</p>}
                        </div>
                        <div className="rounded-xl border border-neutral-200/30 bg-[#eff4ff] p-6 transition-all hover:shadow-lg hover:shadow-brand/5">
                            <div className="mb-2 flex items-center gap-4 text-brand">
                                <Ticket className="size-5" />
                                <span className="text-sm font-semibold">Harga Tiket</span>
                            </div>
                            <p className="text-xl font-semibold text-neutral-900">{wisata.harga_tiket || 'Gratis / Sukarela'}</p>
                        </div>
                        {wisata.kontak && (
                            <div className="rounded-xl border border-neutral-200/30 bg-[#eff4ff] p-6 transition-all hover:shadow-lg hover:shadow-brand/5">
                                <div className="mb-2 flex items-center gap-4 text-brand">
                                    <Phone className="size-5" />
                                    <span className="text-sm font-semibold">Kontak</span>
                                </div>
                                <p className="text-lg font-semibold text-neutral-900">{wisata.kontak}</p>
                            </div>
                        )}
                        {wisata.fasilitas && wisata.fasilitas.length > 0 && (
                            <div className="rounded-xl border border-neutral-200/30 bg-[#eff4ff] p-6 transition-all hover:shadow-lg hover:shadow-brand/5 md:col-span-2">
                                <div className="mb-3 flex items-center gap-4 text-brand">
                                    <span className="text-sm font-semibold">Fasilitas</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {wisata.fasilitas.map((f) => (
                                        <span key={f.id} className="rounded-full border border-neutral-200/50 bg-white px-4 py-1.5 text-sm font-medium text-neutral-700 shadow-sm">
                                            {f.nama_fasilitas}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Galeri */}
                    {galeris.length > 0 && (
                        <div className="mb-8">
                            <h3 className="mb-4 text-xl font-semibold text-neutral-900">Galeri</h3>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                {galeris.map((g, i) => (
                                    <button
                                        key={g.id}
                                        type="button"
                                        onClick={() => {
 setLightboxIndex(i); setLightboxOpen(true); 
}}
                                        aria-label={g.caption ? `Perbesar foto: ${g.caption}` : `Perbesar foto ${i + 1}`}
                                        className="group aspect-square overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-brand"
                                    >
                                        {g.foto_url ? (
                                            <img src={g.foto_url} alt={g.caption || ''} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-brand/10 to-brand/5">
                                                <ImageIcon className="size-12 text-brand/20" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <GaleriLightbox
                        images={galeris}
                        startIndex={lightboxIndex}
                        open={lightboxOpen}
                        onOpenChange={setLightboxOpen}
                    />

                    {/* Map */}
                    <div className="mb-8">
                        <h3 className="mb-4 text-xl font-semibold text-neutral-900">Lokasi</h3>
                        {wisata.latitude && wisata.longitude ? (
                            <WisataMap latitude={Number(wisata.latitude)} longitude={Number(wisata.longitude)} nama={wisata.nama_wisata} />
                        ) : (
                            <div className="flex h-[400px] w-full items-center justify-center rounded-2xl border border-neutral-200/30 bg-[#d9e3f6] shadow-sm">
                                <div className="flex flex-col items-center gap-2 text-brand">
                                    <MapPin className="size-10" />
                                    <p className="text-sm font-medium text-neutral-600">Lokasi belum tersedia</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* AI Review Summary */}
                    {wisata.review_summary && (
                        <div className="mb-6 rounded-xl border border-teal-100 bg-teal-50 p-5">
                            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-800">
                                <MessageSquare className="size-4" />
                                Ringkasan Review (AI)
                            </h3>
                            <p className="text-sm leading-relaxed text-teal-700">{wisata.review_summary}</p>
                        </div>
                    )}

                    {/* Reviews Section */}
                    <div className="mb-8">
                        <h3 className="mb-4 text-xl font-semibold text-neutral-900 flex items-center gap-2">
                            <MessageSquare className="size-5" />
                            Review ({reviews.length})
                        </h3>

                        {/* Review Form */}
                        {auth.user ? (
                            userReview && !editing ? (
                                <div className="mb-6 rounded-xl border border-brand/20 bg-[#eff4ff] p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-neutral-900">Review Kamu</p>
                                            <StarRating rating={userReview.rating} readonly />
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => {
 setEditing(true); setReviewRating(userReview.rating); setReviewKomentar(userReview.komentar || ''); 
}} className="text-xs font-semibold text-brand hover:underline">Ubah</button>
                                            <button type="button" onClick={handleReviewDelete} className="text-xs font-semibold text-red-600 hover:underline">Hapus</button>
                                        </div>
                                    </div>
                                    {userReview.komentar && <p className="mt-2 text-sm text-neutral-700">{userReview.komentar}</p>}
                                </div>
                            ) : (
                                <form onSubmit={editing ? handleReviewUpdate : handleReviewSubmit} className="mb-6 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                                    <p className="mb-2 text-sm font-semibold text-neutral-900">{editing ? 'Ubah Review' : 'Tulis Review'}</p>
                                    <StarRating rating={reviewRating} onChange={setReviewRating} />
                                    <textarea
                                        value={reviewKomentar}
                                        onChange={(e) => setReviewKomentar(e.target.value)}
                                        rows={3}
                                        placeholder="Ceritakan pengalamanmu (min. 10 karakter)..."
                                        aria-label="Komentar review"
                                        className="mt-3 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                                    />
                                    {Object.values(reviewErrors).map((msg) => (
                                        <p key={msg} role="alert" className="mt-2 text-sm text-red-600">{msg}</p>
                                    ))}
                                    <div className="mt-3 flex gap-2">
                                        <button type="submit" disabled={reviewProcessing || reviewRating < 1} className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-50">
                                            {editing ? 'Simpan' : 'Kirim'}
                                        </button>
                                        {editing && <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-neutral-300 px-5 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-50">Batal</button>}
                                    </div>
                                </form>
                            )
                        ) : (
                            <div className="mb-6 rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-center">
                                <p className="text-sm text-neutral-600"><Link href="/login" className="font-semibold text-brand hover:underline">Masuk</Link> untuk menulis review.</p>
                            </div>
                        )}

                        {/* Reviews List */}
                        {reviews.filter((r) => !userReview || r.id !== userReview.id).length === 0 && !userReview ? (
                            <p className="text-sm text-neutral-600">Belum ada review.</p>
                        ) : (
                            <div className="space-y-4">
                                {reviews.filter((r) => !userReview || r.id !== userReview.id).map((r) => (
                                    <div key={r.id} className="rounded-xl border border-neutral-100 bg-white p-4 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-neutral-900">{r.user.name}</p>
                                                {r.created_at && (
                                                    <p className="text-xs text-neutral-600">{new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                )}
                                            </div>
                                            <StarRating rating={r.rating} readonly />
                                        </div>
                                        {r.komentar && <p className="mt-2 text-sm text-neutral-600">{r.komentar}</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column — Sidebar */}
                <div className="lg:col-span-4">
                    <div className="sticky top-24 flex flex-col gap-6">
                        <WisataPlanCard
                            isFavorited={isFavorited}
                            isLoggedIn={!!auth.user}
                            onFavoritToggle={handleFavorit}
                        />
                    </div>
                </div>
            </section>

        </>
    );
}

