import { Head, router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SearchX } from 'lucide-react';
import { CategoryChips } from '@/components/category-chips';
import { Pagination } from '@/components/pagination';
import { SearchHero } from '@/components/search-hero';
import { WisataCard } from '@/components/wisata-card';
import { Button } from '@/components/ui/button';
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-3xl border border-neutral-100 bg-white">
                    <div className="h-64 rounded-t-3xl bg-neutral-200" />
                    <div className="space-y-3 p-5">
                        <div className="h-3 w-1/3 rounded bg-neutral-200" />
                        <div className="h-5 w-2/3 rounded bg-neutral-200" />
                        <div className="h-4 w-full rounded bg-neutral-100" />
                        <div className="h-10 w-full rounded-xl bg-neutral-200" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function WisataIndex({ wisatas, kategoris, filters, heroFoto, totalWisata, totalKategori }: Props) {
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
        if (searchTimer.current) clearTimeout(searchTimer.current);
        if (query.length > 0 && query.length < 2) return;
        setSearching(true);
        searchTimer.current = setTimeout(() => {
            navigate({ search: query, kategori: filters.kategori || '' });
        }, 300);
    }, [navigate, filters.kategori]);

    useEffect(() => {
        return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
    }, []);

    const suggestions = kategoris.length > 0
        ? ['air terjun', 'danau', 'budaya', ...kategoris.slice(0, 3).map((k) => k.nama_kategori)]
        : [];

    const totalWisataCount = filters.search
        ? wisatas.total
        : (totalWisata ?? wisatas.total);

    return (
        <>
            <Head title={filters.search ? `Cari: ${filters.search}` : 'Jelajahi Destinasi'} />

            <SearchHero onSearch={handleSearch} initialValue={filters.search || ''} loading={searching} heroFoto={heroFoto} totalWisata={totalWisataCount} totalKategori={totalKategori} />

            <section className="relative z-20 mx-auto max-w-7xl -mt-8 px-5 md:px-16">
                <CategoryChips categories={allCategories} activeCategory={activeCategory} onSelect={handleCategorySelect} counts={counts} />
            </section>

            <section className="mx-auto max-w-7xl px-5 py-8 md:px-16">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900">
                            {filters.search ? `Hasil untuk "${filters.search}"` : 'Jelajahi Destinasi'}
                        </h2>
                        <p className="mt-0.5 text-sm text-neutral-500">
                            {wisatas.total === 0
                                ? 'Tidak ada destinasi ditemukan'
                                : filters.search
                                    ? `${wisatas.total} destinasi ditemukan`
                                    : `Menampilkan ${wisatas.from}–${wisatas.to} dari ${wisatas.total} destinasi`
                            }
                        </p>
                    </div>
                </div>

                {searching && !wisatas.data.length ? (
                    <SkeletonGrid />
                ) : wisatas.data.length === 0 ? (
                    <div className="flex flex-col items-center py-16 text-center">
                        <SearchX className="mb-4 size-16 text-neutral-300" />
                        <p className="text-lg font-medium text-neutral-600">
                            {filters.search ? `Tidak ada hasil untuk "${filters.search}"` : 'Tidak ada destinasi ditemukan'}
                        </p>
                        <p className="mt-1 text-sm text-neutral-500">
                            {filters.search ? 'Coba kata kunci lain atau telusuri kategori.' : 'Kunjungi lagi nanti untuk destinasi baru.'}
                        </p>

                        {suggestions.length > 0 && (
                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                {suggestions.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => navigate({ search: s, kategori: '' })}
                                        className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600 transition-colors hover:border-brand/30 hover:text-brand"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="mt-8 flex gap-3">
                            <Button className="rounded-full bg-brand px-6 hover:opacity-90" onClick={() => navigate({ search: '', kategori: '' })}>
                                Lihat Semua Destinasi
                            </Button>
                            {(filters.search || filters.kategori) && (
                                <Button variant="outline" className="rounded-full" onClick={() => navigate({ search: '', kategori: '' })}>
                                    Hapus Filter
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <div aria-busy={searching} className={`grid gap-6 transition-opacity md:grid-cols-2 lg:grid-cols-3 ${searching ? 'opacity-60' : ''}`}>
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

