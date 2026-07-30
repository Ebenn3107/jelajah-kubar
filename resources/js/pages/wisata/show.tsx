import { Head, Link, router, usePage } from '@inertiajs/react';
import { Clock, ImageIcon, MapPin, MessageSquare, Phone, Star, Ticket } from 'lucide-react';
import { useState } from 'react';
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
}

interface Props {
    wisata: WisataDetail;
    userReview: ReviewItem | null;
    isFavorited: boolean;
}

function StarRating({ rating, onChange, readonly = false }: { rating: number; onChange?: (n: number) => void; readonly?: boolean }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button"
                    disabled={readonly}
                    onClick={() => onChange?.(n)}
                    className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
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

    const [reviewRating, setReviewRating] = useState(userReview?.rating || 5);
    const [reviewKomentar, setReviewKomentar] = useState(userReview?.komentar || '');
    const [editing, setEditing] = useState(false);

    const avgRating = reviews.length > 0 ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length * 10) / 10 : 0;

    const handleFavorit = () => {
        if (!auth.user) {
            router.visit('/login');
            return;
        }
        router.post(`/wisata/${wisata.id}/favorit`);
    };

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/wisata/${wisata.id}/review`, { rating: reviewRating, komentar: reviewKomentar }, { preserveScroll: true });
    };

    const handleReviewUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userReview) return;
        router.put(`/review/${userReview.id}`, { rating: reviewRating, komentar: reviewKomentar }, { preserveScroll: true });
        setEditing(false);
    };

    const handleReviewDelete = () => {
        if (!userReview || !confirm('Hapus review ini?')) return;
        router.delete(`/review/${userReview.id}`, { preserveScroll: true });
    };

    return (
        <>
            <Head title={wisata.nama_wisata} />

            {/* Hero Section */}
            <section className="relative h-[60vh] w-full overflow-hidden md:h-[80vh]">
                {primaryFoto ? (
                    <img src={primaryFoto} alt={wisata.nama_wisata} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00685f]/40 to-[#00685f]/10" />
                )}
                <div className="hero-gradient absolute inset-0" />

                <div className="absolute bottom-0 left-0 right-0 mx-auto flex max-w-[1280px] flex-col justify-end px-5 pb-16 md:px-[64px]">
                    <nav className="mb-2 flex items-center gap-2 text-sm text-white/80">
                        <a href="/wisata" className="hover:text-white">Destinations</a>
                        <span className="text-[14px]">›</span>
                        <span className="text-white">{wisata.nama_wisata}</span>
                    </nav>

                    <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white md:text-5xl">
                        {wisata.nama_wisata}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                        <div className="flex items-center text-sm text-white/90">
                            <MapPin className="mr-1 size-4" />
                            {wisata.alamat}
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-[#00685f]/40 px-3 py-1 text-sm text-white backdrop-blur-md">
                            <Star className="size-4 fill-white" />
                            {avgRating > 0 ? avgRating : '—'} <span className="text-white/70">({reviews.length} Reviews)</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-5 py-16 md:px-[64px] lg:grid-cols-12">
                <div className="lg:col-span-8">
                    {/* Description */}
                    <div className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-[#00685f]">About</h2>
                        <p className="text-lg leading-relaxed text-neutral-700">{wisata.deskripsi}</p>
                    </div>

                    {/* Info Grid */}
                    <div className="mb-8 grid gap-6 md:grid-cols-2">
                        {wisata.jam_buka && (
                            <div className="rounded-xl border border-neutral-200/30 bg-[#eff4ff] p-6 transition-all hover:shadow-lg hover:shadow-[#00685f]/5">
                                <div className="mb-2 flex items-center gap-4 text-[#00685f]">
                                    <Clock className="size-5" />
                                    <span className="text-sm font-semibold">Opening Hours</span>
                                </div>
                                <p className="text-xl font-semibold text-neutral-900">{wisata.jam_buka}</p>
                                {wisata.jam_tutup && <p className="mt-1 text-xs text-neutral-500">Until {wisata.jam_tutup}</p>}
                            </div>
                        )}
                        {wisata.harga_tiket && (
                            <div className="rounded-xl border border-neutral-200/30 bg-[#eff4ff] p-6 transition-all hover:shadow-lg hover:shadow-[#00685f]/5">
                                <div className="mb-2 flex items-center gap-4 text-[#00685f]">
                                    <Ticket className="size-5" />
                                    <span className="text-sm font-semibold">Entrance Fee</span>
                                </div>
                                <p className="text-xl font-semibold text-neutral-900">{wisata.harga_tiket}</p>
                            </div>
                        )}
                        {wisata.kontak && (
                            <div className="rounded-xl border border-neutral-200/30 bg-[#eff4ff] p-6 transition-all hover:shadow-lg hover:shadow-[#00685f]/5">
                                <div className="mb-2 flex items-center gap-4 text-[#00685f]">
                                    <Phone className="size-5" />
                                    <span className="text-sm font-semibold">Contact</span>
                                </div>
                                <p className="text-lg font-semibold text-neutral-900">{wisata.kontak}</p>
                            </div>
                        )}
                        {wisata.fasilitas && wisata.fasilitas.length > 0 && (
                            <div className="rounded-xl border border-neutral-200/30 bg-[#eff4ff] p-6 transition-all hover:shadow-lg hover:shadow-[#00685f]/5 md:col-span-2">
                                <div className="mb-3 flex items-center gap-4 text-[#00685f]">
                                    <span className="text-sm font-semibold">Facilities</span>
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
                            <h3 className="mb-4 text-xl font-semibold text-neutral-900">Gallery</h3>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                {galeris.map((g) => (
                                    <div key={g.id} className="group aspect-square cursor-zoom-in overflow-hidden rounded-2xl">
                                        {g.foto_url ? (
                                            <img src={g.foto_url} alt={g.caption || ''} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#00685f]/10 to-[#00685f]/5">
                                                <ImageIcon className="size-12 text-[#00685f]/20" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Map */}
                    <div className="mb-8">
                        <h3 className="mb-4 text-xl font-semibold text-neutral-900">Location</h3>
                        {wisata.latitude && wisata.longitude ? (
                            <WisataMap latitude={Number(wisata.latitude)} longitude={Number(wisata.longitude)} nama={wisata.nama_wisata} />
                        ) : (
                            <div className="flex h-[400px] w-full items-center justify-center rounded-2xl border border-neutral-200/30 bg-[#d9e3f6] shadow-sm">
                                <div className="flex flex-col items-center gap-2 text-[#00685f]">
                                    <MapPin className="size-10" />
                                    <p className="text-sm font-medium text-neutral-600">Location not available</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Reviews Section */}
                    <div className="mb-8">
                        <h3 className="mb-4 text-xl font-semibold text-neutral-900 flex items-center gap-2">
                            <MessageSquare className="size-5" />
                            Reviews ({reviews.length})
                        </h3>

                        {/* Review Form */}
                        {auth.user ? (
                            userReview && !editing ? (
                                <div className="mb-6 rounded-xl border border-[#00685f]/20 bg-[#eff4ff] p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-neutral-900">Your Review</p>
                                            <StarRating rating={userReview.rating} readonly />
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditing(true); setReviewRating(userReview.rating); setReviewKomentar(userReview.komentar || ''); }} className="text-xs font-semibold text-[#00685f] hover:underline">Edit</button>
                                            <button onClick={handleReviewDelete} className="text-xs font-semibold text-red-500 hover:underline">Delete</button>
                                        </div>
                                    </div>
                                    {userReview.komentar && <p className="mt-2 text-sm text-neutral-700">{userReview.komentar}</p>}
                                </div>
                            ) : (
                                <form onSubmit={editing ? handleReviewUpdate : handleReviewSubmit} className="mb-6 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                                    <p className="mb-2 text-sm font-semibold text-neutral-900">{editing ? 'Edit Review' : 'Write a Review'}</p>
                                    <StarRating rating={reviewRating} onChange={setReviewRating} />
                                    <textarea
                                        value={reviewKomentar}
                                        onChange={(e) => setReviewKomentar(e.target.value)}
                                        rows={3}
                                        placeholder="Share your experience..."
                                        className="mt-3 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-[#00685f] focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                                    />
                                    <div className="mt-3 flex gap-2">
                                        <button type="submit" className="rounded-lg bg-[#00685f] px-5 py-2 text-sm font-semibold text-white hover:opacity-90">
                                            {editing ? 'Update' : 'Submit'}
                                        </button>
                                        {editing && <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-neutral-300 px-5 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-50">Cancel</button>}
                                    </div>
                                </form>
                            )
                        ) : (
                            <div className="mb-6 rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-center">
                                <p className="text-sm text-neutral-500"><Link href="/login" className="font-semibold text-[#00685f] hover:underline">Login</Link> to write a review.</p>
                            </div>
                        )}

                        {/* Reviews List */}
                        {reviews.filter((r) => !userReview || r.id !== userReview.id).length === 0 && !userReview ? (
                            <p className="text-sm text-neutral-400">No reviews yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {reviews.filter((r) => !userReview || r.id !== userReview.id).map((r) => (
                                    <div key={r.id} className="rounded-xl border border-neutral-100 bg-white p-4 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold text-neutral-900">{r.user.name}</p>
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

            <style>{`
                .hero-gradient {
                    background: linear-gradient(to top, rgba(18, 28, 42, 0.8) 0%, rgba(18, 28, 42, 0) 50%);
                }
            `}</style>
        </>
    );
}

WisataShow.layout = null;
