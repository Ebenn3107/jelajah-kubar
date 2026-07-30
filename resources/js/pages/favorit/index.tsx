import { Head } from '@inertiajs/react';
import { Heart, MapPin } from 'lucide-react';
import { WisataCard } from '@/components/wisata-card';

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

interface PaginatedData {
    data: WisataItem[];
    total: number;
}

interface Props {
    wisatas: PaginatedData;
}

export default function FavoritIndex({ wisatas }: Props) {
    return (
        <>
            <Head title="My Wishlist" />

            <div className="mx-auto max-w-[1280px] px-5 py-8 md:px-[64px]">
                <div className="mb-6">
                    <h1 className="flex items-center gap-2 text-2xl font-bold text-neutral-900">
                        <Heart className="size-6 text-red-500" />
                        My Wishlist
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500">{wisatas.total} saved destinations</p>
                </div>

                {wisatas.data.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-20">
                        <Heart className="size-16 text-neutral-300" />
                        <p className="text-lg font-medium text-neutral-500">No saved destinations yet</p>
                        <p className="text-sm text-neutral-400">Browse destinations and click the heart icon to save them here.</p>
                        <a href="/wisata" className="mt-2 rounded-full bg-[#00685f] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90">
                            Explore Destinations
                        </a>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {wisatas.data.map((w) => (
                            <WisataCard key={w.id} {...w} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

