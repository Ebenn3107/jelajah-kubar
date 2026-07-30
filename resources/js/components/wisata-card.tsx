import { Link } from '@inertiajs/react';
import { ImageIcon, MapPin, Star } from 'lucide-react';

interface WisataCardProps {
    id: number;
    slug: string;
    nama_wisata: string;
    alamat: string;
    deskripsi: string;
    foto?: string | null;
    foto_url?: string | null;
    kategori?: { nama_kategori: string } | null;
    rating?: number;
}

export function WisataCard({ slug, nama_wisata, alamat, deskripsi, foto_url, kategori, rating = 4.5 }: WisataCardProps) {
    return (
        <Link href={`/wisata/${slug}`} className="group block h-full">
            <div className="flex h-full flex-col overflow-hidden rounded-[24px] border border-neutral-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(0,0,0,0.12)]">
                <div className="relative h-64 overflow-hidden rounded-t-[24px]">
                    {foto_url ? (
                        <img src={foto_url} alt={nama_wisata} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#00685f]/20 to-[#00685f]/5">
                            <ImageIcon className="size-16 text-[#00685f]/30" />
                        </div>
                    )}

                    <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 backdrop-blur-md">
                        <Star className="size-3.5 fill-amber-500 text-amber-500" />
                        <span className="text-xs font-medium text-neutral-900">{rating}</span>
                    </div>
                </div>

                <div className="flex flex-grow flex-col p-6">
                    <div className="mb-1 flex items-center gap-1 text-[#00685f]">
                        <MapPin className="size-3.5" />
                        <span className="text-xs font-medium">{alamat.split(',')[0]}</span>
                        {kategori && (
                            <>
                                <span className="text-neutral-300">•</span>
                                <span className="text-xs">{kategori.nama_kategori}</span>
                            </>
                        )}
                    </div>

                    <h3 className="mb-2 text-xl font-semibold text-neutral-900">{nama_wisata}</h3>

                    <p className="mb-6 flex-grow text-base text-neutral-600 line-clamp-2">{deskripsi}</p>

                    <span className="inline-flex w-full items-center justify-center rounded-xl border border-[#00685f] px-4 py-3 text-sm font-semibold text-[#00685f] transition-all group-hover:bg-[#00685f] group-hover:text-white group-active:scale-[0.98]">
                        View Details
                    </span>
                </div>
            </div>
        </Link>
    );
}
