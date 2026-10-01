import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Compass, ImageIcon, MapPin, MessagesSquare, Route, Search } from 'lucide-react';
import { useState } from 'react';

interface WisataItem {
    id: number;
    nama_wisata: string;
    slug: string;
    alamat: string;
    deskripsi: string;
    foto_url: string | null;
    kategori: { nama_kategori: string } | null;
}

interface Props {
    featured: WisataItem[];
    totalWisata: number;
    totalKategori: number;
    totalFasilitas: number;
}

function FeaturedTile({ item, index, large }: { item: WisataItem; index: number; large?: boolean }) {
    const [broken, setBroken] = useState(false);

    return (
        <Link
            href={`/wisata/${item.slug}`}
            className={`group relative isolate flex min-h-72 overflow-hidden rounded-3xl bg-brand-deep text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${
                large ? 'min-h-96 md:row-span-2 md:min-h-136' : ''
            }`}
        >
            {item.foto_url && !broken ? (
                <img
                    src={item.foto_url}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={() => setBroken(true)}
                    className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            ) : (
                <div className="absolute inset-0 -z-10 flex items-center justify-center bg-linear-to-br from-brand to-brand-deep">
                    <ImageIcon className="size-14 text-white/20" aria-hidden="true" />
                </div>
            )}
            <div className="absolute inset-0 -z-10 bg-linear-to-t from-brand-deep/90 via-brand-deep/30 to-transparent" />

            <div className="mt-auto w-full min-w-0 p-6 md:p-8">
                <div className="mb-3 flex items-center gap-3 text-sm font-semibold">
                    <span className="text-amber">{String(index + 1).padStart(2, '0')}</span>
                    {item.kategori && <span className="rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur-sm">{item.kategori.nama_kategori}</span>}
                </div>
                <h3 className={`font-bold leading-tight tracking-tight wrap-anywhere ${large ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>{item.nama_wisata}</h3>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-white/80">
                    <MapPin className="size-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.alamat.split(',')[0]}</span>
                </p>
                {large && <p className="mt-4 hidden max-w-lg text-base leading-relaxed text-white/80 line-clamp-3 md:block">{item.deskripsi}</p>}
            </div>
        </Link>
    );
}

export default function Welcome({ featured, totalWisata, totalKategori, totalFasilitas }: Props) {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        const q = query.trim();
        router.get('/wisata', q ? { search: q } : {});
    };

    const [lead, ...rest] = featured;

    return (
        <>
            <Head title="Beranda" />

            {/* Hero — teks di kiri, foto bleed ke kanan */}
            <section className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-stretch gap-10 px-5 pb-16 pt-6 md:px-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 lg:pb-24 lg:pt-12">
                <div className="flex flex-col justify-center">
                    <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-copper">Kutai Barat, Kalimantan Timur</p>
                    <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-ink wrap-anywhere md:text-6xl">
                        Dari riam sampai rimba, <span className="text-brand">temukan Kubar.</span>
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
                        Air terjun, danau, dan kampung Dayak di jantung Borneo. Cari tempatnya, baca yang perlu diketahui, lalu susun perjalananmu.
                    </p>

                    <form
                        role="search"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSearch();
                        }}
                        className="mt-8 flex max-w-xl items-center rounded-full border border-line bg-white p-1.5 shadow-[0_10px_30px_rgba(18,28,42,0.08)] focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/15"
                    >
                        <Search className="ml-4 size-5 shrink-0 text-ink-muted" aria-hidden="true" />
                        <input
                            type="search"
                            className="min-w-0 grow border-none bg-transparent px-3 py-3 text-base text-ink placeholder:text-outline focus:outline-none"
                            placeholder="Cari air terjun atau danau"
                            aria-label="Cari destinasi"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button type="submit" className="shrink-0 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:px-8">
                            Cari
                        </button>
                    </form>

                    <p className="mt-6 text-sm text-ink-muted">
                        <strong className="font-semibold text-ink">{totalWisata}</strong> destinasi
                        <span aria-hidden="true"> · </span>
                        <strong className="font-semibold text-ink">{totalKategori}</strong> kategori
                        <span aria-hidden="true"> · </span>
                        <strong className="font-semibold text-ink">{totalFasilitas}</strong> jenis fasilitas
                    </p>
                </div>

                <div className="relative min-h-80 overflow-hidden rounded-3xl bg-brand-deep lg:min-h-136">
                    <img
                        src="/images/backgrounds/search-bg.webp"
                        alt="Lanskap hutan dan sungai di Kutai Barat"
                        className="absolute inset-0 size-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-brand-deep/70 to-transparent p-6 pt-20">
                        <p className="text-sm font-medium text-white/90">Hutan hujan tropis Borneo</p>
                    </div>
                </div>
            </section>

            {/* Destinasi pilihan — satu besar, sisanya bertumpuk */}
            {lead && (
                <section className="bg-surface-low py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-5 md:px-16">
                        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                            <div>
                                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-copper">Destinasi pilihan</p>
                                <h2 className="max-w-xl text-3xl font-bold tracking-tight text-ink md:text-4xl">Mulai dari tempat-tempat ini</h2>
                            </div>
                            <Link href="/wisata" className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
                                Lihat semua destinasi <ArrowRight className="size-4" aria-hidden="true" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2 md:grid-rows-2">
                            <FeaturedTile item={lead} index={0} large />
                            {rest.slice(0, 2).map((item, i) => (
                                <FeaturedTile key={item.id} item={item} index={i + 1} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Alat bantu perjalanan */}
            <section className="mx-auto max-w-7xl px-5 py-16 md:px-16 lg:py-24">
                <div className="mb-10 max-w-2xl">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-copper">Bingung mulai dari mana?</p>
                    <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">Biar asisten yang bantu menyusun</h2>
                    <p className="mt-4 text-lg leading-relaxed text-ink-muted">
                        Jawabannya selalu berdasarkan data destinasi di Jelajah Kubar, bukan tebakan.
                    </p>
                </div>

                <div className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
                    <Link
                        href="/travel-planner"
                        className="group flex flex-col rounded-3xl bg-brand p-8 text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand md:p-10"
                    >
                        <Route className="mb-8 size-8 text-amber" aria-hidden="true" />
                        <h3 className="text-2xl font-bold tracking-tight">Perencana Perjalanan</h3>
                        <p className="mt-3 grow text-base leading-relaxed text-white/85">
                            Isi lama perjalanan, anggaran, dan minatmu. Dapatkan itinerary per hari yang bisa disimpan.
                        </p>
                        <span className="mt-8 inline-flex items-center gap-2 font-semibold">
                            Susun itinerary <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </span>
                    </Link>

                    <Link
                        href="/local-guide"
                        className="group flex flex-col rounded-3xl bg-amber-soft p-8 text-brand-deep transition-colors hover:bg-amber/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand md:p-10"
                    >
                        <MessagesSquare className="mb-8 size-8 text-copper" aria-hidden="true" />
                        <h3 className="text-2xl font-bold tracking-tight">Pemandu Lokal</h3>
                        <p className="mt-3 grow text-base leading-relaxed text-ink-muted">
                            Tanyakan harga tiket, fasilitas, atau tempat yang cocok untuk keluarga. Dijawab dari data destinasi.
                        </p>
                        <span className="mt-8 inline-flex items-center gap-2 font-semibold text-copper">
                            Tanya pemandu <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </span>
                    </Link>
                </div>

                <div className="mt-10 flex justify-center">
                    <Link href="/wisata" className="inline-flex items-center gap-2 rounded-full border border-brand px-8 py-3 font-semibold text-brand transition-colors hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
                        <Compass className="size-5" aria-hidden="true" />
                        Jelajahi semua destinasi
                    </Link>
                </div>
            </section>
        </>
    );
}
