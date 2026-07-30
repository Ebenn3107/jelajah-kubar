import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
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

    const handleCategorySelect = (category: string) => {
        const slug = category === 'All' ? '' : kategoris.find((k) => k.nama_kategori === category)?.slug || '';
        router.get('/wisata', { kategori: slug, search: filters.search || '' }, { preserveState: true, replace: true });
    };

    const handleSearch = (query: string) => {
        router.get('/wisata', { search: query, kategori: filters.kategori || '' }, { preserveState: true, replace: true });
    };

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
                        <p className="text-lg text-neutral-500">No destinations found matching your search.</p>
                        <Button variant="outline" className="mt-4" onClick={() => router.get('/wisata')}>
                            Clear Filters
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 text-sm text-neutral-500">
                            Showing {wisatas.from}–{wisatas.to} of {wisatas.total} destinations
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
