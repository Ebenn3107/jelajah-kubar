import { Head, Link, router } from '@inertiajs/react';
import { Compass } from 'lucide-react';
import { useState } from 'react';
import { WisataCard } from '@/components/wisata-card';

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

export default function Welcome({ featured, totalWisata, totalKategori, totalFasilitas }: Props) {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        const q = query.trim();
        router.get('/wisata', q ? { search: q } : {});
    };

    return (
        <>
            <Head title="Beranda" />

            {/* Hero */}
            <section
    className="relative flex h-[70vh] items-center justify-center overflow-hidden bg-cover bg-bottom"
    style={{
        backgroundImage: "url('/images/backgrounds/search-bg.webp')",
    }}
>
                
                <div className="relative z-10 w-full max-w-4xl px-5 text-center">
                    <h1 className="mb-4 text-4xl font-bold leading-tight text-white drop-shadow-lg md:text-5xl">
                        Jelajahi Keindahan <br className="hidden md:block" /> Kutai Barat
                    </h1>
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
                        Jelajahi hutan hujan, air terjun megah, dan budaya Dayak yang kaya di jantung Borneo.
                    </p>

                    <div className="mx-auto flex max-w-2xl items-center rounded-full bg-white/95 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.1)] backdrop-blur transition-transform hover:scale-[1.02]">
                        <div className="flex items-center pl-6 pr-3 text-zinc-400">
                            <Compass className="size-5" />
                        </div>
                        <input
                            className="flex-grow border-none bg-transparent py-3 text-base text-zinc-900 placeholder-zinc-400 focus:outline-none"
                            placeholder="Cari air terjun, danau, atau desa..."
                            aria-label="Cari destinasi"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                        />
                        <button
                            onClick={handleSearch}
                            className="shrink-0 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:opacity-90 sm:px-8"
                        >
                            Cari
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="border-b border-zinc-100 bg-white py-12">
                <div className="mx-auto max-w-7xl px-5 md:px-16">
                    <div className="grid gap-8 text-center md:grid-cols-3">
                        <div>
                            <p className="text-4xl font-bold text-brand">{totalWisata}</p>
                            <p className="mt-1 text-sm text-zinc-500">Destinasi</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-brand">{totalKategori}</p>
                            <p className="mt-1 text-sm text-zinc-500">Kategori</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-brand">{totalFasilitas}</p>
                            <p className="mt-1 text-sm text-zinc-500">Fasilitas</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured */}
            <section className="mx-auto max-w-7xl px-5 py-16 md:px-16">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-zinc-900">Destinasi Pilihan</h2>
                    <p className="mt-2 text-zinc-500">Tempat pilihan untuk memulai perjalananmu</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {featured.map((w) => (
                        <WisataCard key={w.id} {...w} searchQuery="" />
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href="/wisata"
                        className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3 font-semibold text-white hover:opacity-90"
                    >
                        <Compass className="size-5" />
                        Lihat Semua Destinasi
                    </Link>
                </div>
            </section>
        </>
    );
}

