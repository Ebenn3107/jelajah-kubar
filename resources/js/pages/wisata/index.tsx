import { Head, router } from '@inertiajs/react';
import { SearchX, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CategoryChips } from '@/components/category-chips';
import { Pagination } from '@/components/pagination';
import { SearchBar } from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import { WisataCard } from '@/components/wisata-card';
import type { PaginatedData } from '@/types/pagination';

interface Kategori {
    id: number;
    nama_kategori: string;
    slug: string;
    wisatas_count?: number;
}

interface WisataItem {
    id: number;
    slug: string;
    nama_wisata: string;
    alamat: string;
    deskripsi: string;
    foto: string | null;
    foto_url?: string | null;
    rating?: number | null;
    harga_tiket?: string | null;
    kategori: { nama_kategori: string } | null;
}

interface Props {
    wisatas: PaginatedData<WisataItem>;
    kategoris: Kategori[];
    filters: { search?: string; kategori?: string };
    heroFoto?: string | null;
    totalWisata?: number;
    totalKategori?: number;
}

function SkeletonGrid() {
    return (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                    <div className="aspect-4/3 rounded-3xl bg-surface-high" />
                    <div className="mt-4 space-y-3">
                        <div className="h-3 w-1/4 rounded bg-surface-high" />
                        <div className="h-5 w-2/3 rounded bg-surface-high" />
                        <div className="h-4 w-full rounded bg-surface-low" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function WisataIndex({ wisatas, kategoris, filters, totalWisata }: Props) {
    const allCategories = ['All', ...kategoris.map((k) => k.nama_kategori)];
    const activeCategory = filters.kategori
        ? kategoris.find((k) => k.slug === filters.kategori)?.nama_kategori || 'All'
        : 'All';

    const [searching, setSearching] = useState(false);
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const counts: Record<string, number> = {
        All: totalWisata ?? wisatas.total,
        ...Object.fromEntries(kategoris.map((k) => [k.nama_kategori, k.wisatas_count || 0])),
    };

    const navigate = useCallback((params: Record<string, string>) => {
        setSearching(true);
        router.get('/wisata', params, {
            preserveState: true,
            replace: true,
            onFinish: () => setSearching(false),
        });
    }, []);

    const handleCategorySelect = (category: string) => {
        const slug = category === 'All' ? '' : kategoris.find((k) => k.nama_kategori === category)?.slug || '';
        navigate({ kategori: slug, search: filters.search || '' });
    };

    const handleSearch = useCallback((query: string) => {
        if (searchTimer.current) {
clearTimeout(searchTimer.current);
}

        if (query.length > 0 && query.length < 2) {
return;
}

        setSearching(true);
        searchTimer.current = setTimeout(() => {
            navigate({ search: query, kategori: filters.kategori || '' });
        }, 300);
    }, [navigate, filters.kategori]);

    useEffect(() => {
        return () => {
 if (searchTimer.current) {
clearTimeout(searchTimer.current);
} 
};
    }, []);

    const suggestions = kategoris.length > 0
        ? [...new Map(
            ['air terjun', 'danau', 'budaya', ...kategoris.map((k) => k.nama_kategori)].map((t) => [t.toLowerCase(), t]),
        ).values()].slice(0, 6)
        : [];

    const activeKategori = filters.kategori ? kategoris.find((k) => k.slug === filters.kategori) : undefined;
    const hasFilter = Boolean(filters.search || activeKategori);

    return (
        <>
            <Head title={filters.search ? `Cari: ${filters.search}` : 'Jelajahi Destinasi'} />

            <header className="mx-auto max-w-7xl px-5 pb-6 pt-8 md:px-16 md:pt-12">
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-copper">Destinasi</p>
                <h1 className="max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight text-ink md:text-5xl">Jelajahi Kutai Barat</h1>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-muted">
                    {totalWisata !== undefined ? `${totalWisata} destinasi` : 'Destinasi'} alam, budaya, dan petualangan. Cari berdasarkan nama, kategori, atau fasilitas.
                </p>
            </header>

            {/* Toolbar menempel di bawah navbar agar filter selalu terjangkau */}
            <div className="sticky top-20 z-30 border-y border-line/50 bg-surface/95 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-3 md:px-16 lg:flex-row lg:items-center lg:gap-6">
                    <div className="w-full lg:max-w-sm lg:shrink-0">
                        <SearchBar onSearch={handleSearch} initialValue={filters.search || ''} loading={searching} />
                    </div>
                    <div className="min-w-0 grow">
                        <CategoryChips categories={allCategories} activeCategory={activeCategory} onSelect={handleCategorySelect} counts={counts} />
                    </div>
                </div>
            </div>

            <section className="mx-auto max-w-7xl px-5 py-10 md:px-16 md:py-12">
                <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2" aria-live="polite">
                    <p className="text-sm text-ink-muted">
                        {wisatas.total === 0
                            ? 'Tidak ada destinasi ditemukan'
                            : `Menampilkan ${wisatas.from}–${wisatas.to} dari ${wisatas.total} destinasi`}
                    </p>

                    {filters.search && (
                        <button
                            type="button"
                            onClick={() => navigate({ search: '', kategori: filters.kategori || '' })}
                            className="inline-flex items-center gap-1.5 rounded-full bg-amber-soft px-3 py-1 text-sm font-medium text-brand-deep hover:bg-amber/60 focus-visible:outline-2 focus-visible:outline-brand"
                        >
                            Kata kunci: “{filters.search}” <X className="size-3.5" aria-hidden="true" />
                            <span className="sr-only">Hapus kata kunci</span>
                        </button>
                    )}
                    {hasFilter && (
                        <button
                            type="button"
                            onClick={() => navigate({ search: '', kategori: '' })}
                            className="text-sm font-semibold text-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-brand"
                        >
                            Hapus semua filter
                        </button>
                    )}
                </div>

                {searching && !wisatas.data.length ? (
                    <SkeletonGrid />
                ) : wisatas.data.length === 0 ? (
                    <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center">
                        <SearchX className="mb-5 size-14 text-outline" aria-hidden="true" />
                        <h2 className="text-xl font-bold text-ink">
                            {filters.search ? `Tidak ada hasil untuk “${filters.search}”` : 'Tidak ada destinasi ditemukan'}
                        </h2>
                        <p className="mt-2 text-ink-muted">
                            {filters.search ? 'Coba kata kunci lain, atau mulai dari salah satu saran ini.' : 'Kunjungi lagi nanti untuk destinasi baru.'}
                        </p>

                        {suggestions.length > 0 && (
                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                {suggestions.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => navigate({ search: s, kategori: '' })}
                                        className="rounded-full bg-surface-low px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-high hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        {hasFilter && (
                            <Button className="mt-8 rounded-full bg-brand px-6 hover:bg-brand-hover" onClick={() => navigate({ search: '', kategori: '' })}>
                                Lihat semua destinasi
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        <div aria-busy={searching} className={`grid grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-10 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${searching ? 'opacity-60' : ''}`}>
                            {wisatas.data.map((wisata) => (
                                <WisataCard key={wisata.id} {...wisata} searchQuery={filters.search} />
                            ))}
                        </div>

                        <Pagination links={wisatas.links} />
                    </>
                )}
            </section>
        </>
    );
}
