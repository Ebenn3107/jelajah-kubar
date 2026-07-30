import { Head, Link, router, usePage } from '@inertiajs/react';
import { Compass, Trees } from 'lucide-react';
import { login, register } from '@/routes';
import { WisataCard } from '@/components/wisata-card';
import type { Auth } from '@/types';

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
    const { auth } = usePage<{ auth: Auth }>().props;

    const handleSearch = (query: string) => {
        router.get('/wisata', { search: query });
    };

    return (
        <>
            <Head title="Jelajah Kubar" />

            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full bg-[#f8f9ff]/95 backdrop-blur-md dark:bg-zinc-950/95">
                <nav className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-5 md:px-[64px]">
                    <Link href="/" className="flex items-center gap-2">
                        <Trees className="size-7 text-[#00685f]" />
                        <span className="text-xl font-semibold tracking-tight text-[#00685f] dark:text-teal-400">
                            Jelajah Kubar
                        </span>
                    </Link>

                    <div className="hidden items-center gap-8 md:flex">
                        <Link href="/" className="border-b-2 border-[#00685f] pb-1 text-sm font-bold text-[#00685f] dark:text-teal-400">
                            Home
                        </Link>
                        <Link href="/wisata" className="text-sm text-zinc-600 transition-colors hover:text-[#00685f] dark:text-zinc-400 dark:hover:text-teal-400">
                            Destinations
                        </Link>
                        {auth.user ? (
                            <Link
                                href="/admin/dashboard"
                                className="rounded-full bg-[#00685f] px-6 py-2 text-sm font-semibold text-white hover:opacity-90"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href={login()} className="text-sm font-semibold text-zinc-700 hover:text-[#00685f] dark:text-zinc-300">
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="rounded-full bg-[#00685f] px-6 py-2 text-sm font-semibold text-white hover:opacity-90"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu */}
                    <Link href="/wisata" className="flex items-center gap-1 text-sm font-semibold text-[#00685f] md:hidden">
                        <Compass className="size-5" /> Explore
                    </Link>
                </nav>
            </header>

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

                    {/* Search */}
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
            <section className="border-b border-zinc-100 bg-[#f8f9ff] py-12 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mx-auto max-w-[1280px] px-5 md:px-[64px]">
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
            <section className="mx-auto max-w-[1280px] px-5 py-16 md:px-[64px]">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Featured Destinations</h2>
                    <p className="mt-2 text-zinc-500">Handpicked places to start your journey</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {featured.map((w) => (
                        <WisataCard key={w.id} {...w} />
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

            {/* Footer */}
            <footer className="border-t border-zinc-200 bg-[#f8f9ff] py-12 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mx-auto max-w-[1280px] px-5 md:px-[64px]">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-2">
                            <Trees className="size-6 text-[#00685f]" />
                            <span className="text-lg font-semibold text-[#00685f] dark:text-teal-400">Jelajah Kubar</span>
                        </div>
                        <p className="text-sm text-zinc-500">
                            © 2026 Jelajah Kubar. Discover the Heart of Borneo.
                        </p>
                        <div className="flex gap-4 text-sm text-zinc-500">
                            <Link href="/wisata" className="hover:text-[#00685f]">Destinations</Link>
                            <a href="#" className="hover:text-[#00685f]">About</a>
                            <a href="#" className="hover:text-[#00685f]">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
