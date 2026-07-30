import { Head, Link, router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CategoryChips } from '@/components/category-chips';
import { SearchHero } from '@/components/search-hero';
import { WisataCard } from '@/components/wisata-card';
import { Button } from '@/components/ui/button';

interface Kategori {
    id: number;
    nama_kategori: string;
    slug: string;
}

interface WisataItem {
    id: number;
    slug: string;
    nama_wisata: string;
    alamat: string;
    deskripsi: string;
    foto: string | null;
    foto_url?: string | null;
    kategori: { nama_kategori: string } | null;
}

interface PaginatedData {
    data: WisataItem[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    wisatas: PaginatedData;
    kategoris: Kategori[];
    filters: { search?: string; kategori?: string };
}

export default function WisataIndex({ wisatas, kategoris, filters }: Props) {
    const allCategories = ['All', ...kategoris.map((k) => k.nama_kategori)];
    const activeCategory = filters.kategori
        ? kategoris.find((k) => k.slug === filters.kategori)?.nama_kategori || 'All'
        : 'All';

    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const navigate = useCallback((params: Record<string, string>) => {
        router.get('/wisata', params, { preserveState: true, replace: true });
    }, []);

    const handleCategorySelect = (category: string) => {
        const slug = category === 'All' ? '' : kategoris.find((k) => k.nama_kategori === category)?.slug || '';
        navigate({ kategori: slug, search: filters.search || '' });
    };

    const handleSearch = useCallback((query: string) => {
        // Clear previous timer
        if (searchTimer.current) clearTimeout(searchTimer.current);

        // Min 2 chars validation
        if (query.length > 0 && query.length < 2) return;

        searchTimer.current = setTimeout(() => {
            navigate({ search: query, kategori: filters.kategori || '' });
        }, 300);
    }, [navigate, filters.kategori]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (searchTimer.current) clearTimeout(searchTimer.current);
        };
    }, []);

    const suggestions = kategoris.length > 0
        ? [
            `Try searching for "air terjun"`,
            `Try searching for "danau"`,
            `Browse category: ${kategoris.slice(0, 3).map(k => k.nama_kategori).join(', ')}`,
        ]
        : [];

    return (
        <>
            <Head title="Explore Destinations" />

            <SearchHero onSearch={handleSearch} />

            {/* Category Chips */}
            <section className="relative z-20 mx-auto max-w-[1280px] -mt-8 px-5 md:px-[64px]">
                <CategoryChips categories={allCategories} activeCategory={activeCategory} onSelect={handleCategorySelect} />
            </section>

            {/* Destination Grid */}
            <section className="mx-auto max-w-[1280px] px-5 py-16 md:px-[64px]">
                {wisatas.data.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-lg font-medium text-neutral-500">
                            {filters.search
                                ? `No results for "${filters.search}"`
                                : 'No destinations found'}
                        </p>
                        <p className="mt-2 text-sm text-neutral-400">
                            {filters.search
                                ? 'Try different keywords or browse categories below.'
                                : 'Check back later for new destinations.'}
                        </p>

                        {/* Suggestions */}
                        {suggestions.length > 0 && (
                            <div className="mx-auto mt-8 max-w-md">
                                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Suggestions</p>
                                <div className="flex flex-col gap-2">
                                    {suggestions.map((s, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                const match = s.match(/"([^"]+)"/);
                                                if (match) handleSearch(match[1]);
                                            }}
                                            className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-600 transition-colors hover:border-[#00685f]/30 hover:text-[#00685f]"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            <Button variant="outline" className="rounded-full" onClick={() => navigate({ search: '', kategori: '' })}>
                                Clear All Filters
                            </Button>
                            {kategoris.map((k) => (
                                <button
                                    key={k.id}
                                    onClick={() => navigate({ kategori: k.slug, search: '' })}
                                    className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:border-[#00685f]/30 hover:text-[#00685f]"
                                >
                                    {k.nama_kategori}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 text-sm text-neutral-500">
                            {filters.search
                                ? `Found ${wisatas.total} result${wisatas.total > 1 ? 's' : ''} for "${filters.search}"`
                                : `Showing ${wisatas.from}–${wisatas.to} of ${wisatas.total} destinations`
                            }
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {wisatas.data.map((wisata) => (
                                <WisataCard key={wisata.id} {...wisata} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {wisatas.last_page > 1 && (
                            <div className="mt-12 flex justify-center gap-2">
                                {wisatas.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                                            link.active
                                                ? 'bg-[#00685f] text-white'
                                                : link.url
                                                  ? 'bg-white text-neutral-600 hover:bg-neutral-100'
                                                  : 'cursor-not-allowed text-neutral-400'
                                        }`}
                                        preserveState
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </section>
        </>
    );
}

WisataIndex.layout = null;
