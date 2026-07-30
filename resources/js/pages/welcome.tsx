import { Head, Link, router } from '@inertiajs/react';
import { Compass, MapPin } from 'lucide-react';
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
}

export default function Welcome({ featured, totalWisata }: Props) {
    const handleSearch = (query: string) => {
        router.get('/wisata', { search: query });
    };

    return (
        <>
            <Head title="" />

            {/* Hero */}
            <section className="relative flex h-[70vh] items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#00685f]/80 to-[#003d38]" />
                <div className="relative z-10 w-full max-w-4xl px-5 text-center">
                    <h1 className="mb-4 text-4xl font-bold leading-tight text-white drop-shadow-lg md:text-5xl">
                        Discover the Beauty of <br className="hidden md:block" /> Kutai Barat
                    </h1>
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
                        Explore stunning rainforests, majestic waterfalls, and rich Dayak culture in the heart of Borneo.
                    </p>

                    <div className="mx-auto flex max-w-2xl items-center rounded-full bg-white/95 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.1)] backdrop-blur transition-transform hover:scale-[1.02]">
                        <div className="flex items-center pl-6 pr-3 text-zinc-400">
                            <Compass className="size-5" />
                        </div>
                        <input
                            className="flex-grow border-none bg-transparent py-3 text-base text-zinc-900 placeholder-zinc-400 focus:outline-none"
                            placeholder="Search for waterfall, lake, or village..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch((e.target as HTMLInputElement).value);
                                }
                            }}
                        />
                        <button
                            onClick={() => {
                                const input = document.querySelector<HTMLInputElement>('[data-hero-search]');
                                if (input?.value) handleSearch(input.value);
                            }}
                            className="hidden shrink-0 rounded-full bg-[#00685f] px-8 py-3 text-sm font-semibold text-white hover:opacity-90 sm:block"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="border-b border-zinc-100 bg-white py-12">
                <div className="mx-auto max-w-7xl px-5 md:px-16">
                    <div className="grid gap-8 text-center md:grid-cols-3">
                        <div>
                            <p className="text-4xl font-bold text-[#00685f]">{totalWisata}</p>
                            <p className="mt-1 text-sm text-zinc-500">Destinations</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-[#00685f]">5</p>
                            <p className="mt-1 text-sm text-zinc-500">Categories</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-[#00685f]">10+</p>
                            <p className="mt-1 text-sm text-zinc-500">Facilities</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured */}
            <section className="mx-auto max-w-7xl px-5 py-16 md:px-16">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-zinc-900">Featured Destinations</h2>
                    <p className="mt-2 text-zinc-500">Handpicked places to start your journey</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {featured.map((w) => (
                        <WisataCard key={w.id} {...w} searchQuery="" />
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href="/wisata"
                        className="inline-flex items-center gap-2 rounded-full bg-[#00685f] px-8 py-3 font-semibold text-white hover:opacity-90"
                    >
                        <Compass className="size-5" />
                        Explore All Destinations
                    </Link>
                </div>
            </section>
        </>
    );
}

