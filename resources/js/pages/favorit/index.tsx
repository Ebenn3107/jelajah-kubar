import { Head, Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';
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

            <div className="mx-auto max-w-7xl px-5 py-8 md:px-16">
                <div className="mb-6">
                    <h1 className="flex items-center gap-2 text-2xl font-bold text-neutral-900">
                        <Heart className="size-6 text-red-500" aria-hidden="true" />
                        Favorit Saya
                    </h1>
                    <p className="mt-1 text-sm text-neutral-600">{wisatas.total} destinasi tersimpan</p>
                </div>

                {wisatas.data.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-20">
                        <Heart className="size-16 text-neutral-300" aria-hidden="true" />
                        <p className="text-lg font-medium text-neutral-600">Belum ada destinasi favorit</p>
                        <p className="text-sm text-neutral-600">Buka destinasi dan tekan tombol favorit untuk menyimpannya di sini.</p>
                        <Link href="/wisata" className="mt-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover">
                            Jelajahi Destinasi
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
