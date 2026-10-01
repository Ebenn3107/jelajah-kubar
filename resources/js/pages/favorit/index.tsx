import { Head, Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { WisataCard } from '@/components/wisata-card';
import type { PaginatedData } from '@/types/pagination';

interface WisataItem {
    id: number;
    slug: string;
    nama_wisata: string;
    alamat: string;
    deskripsi: string;
    foto: string | null;
    foto_url: string | null;
    kategori: { nama_kategori: string } | null;
}

export default function FavoritIndex({ wisatas }: { wisatas: PaginatedData<WisataItem> }) {
    return (
        <>
            <Head title="Favorit Saya" />

            <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 md:px-16 md:pt-12">
                <PageHeader eyebrow="Favorit" title="Favorit Saya" description={`${wisatas.total} destinasi tersimpan`} />

                {wisatas.data.length === 0 ? (
                    <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center">
                        <Heart className="mb-5 size-14 text-outline" aria-hidden="true" />
                        <h2 className="text-xl font-bold text-ink">Belum ada destinasi favorit</h2>
                        <p className="mt-2 text-ink-muted">Buka sebuah destinasi dan tekan tombol simpan untuk menaruhnya di sini.</p>
                        <Link href="/wisata" className="mt-8 rounded-full bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-hover">
                            Jelajahi destinasi
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                            {wisatas.data.map((w) => (
                                <WisataCard key={w.id} {...w} />
                            ))}
                        </div>
                        <Pagination links={wisatas.links} />
                    </>
                )}
            </div>
        </>
    );
}
