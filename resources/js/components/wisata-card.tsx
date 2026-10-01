import { Link } from '@inertiajs/react';
import { ImageIcon, MapPin, Star } from 'lucide-react';
import { useState } from 'react';

function highlightText(text: string, query: string | undefined): React.ReactNode {
    if (!query || query.length < 2) {
return text;
}

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));

    return parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
            ? <mark key={i} className="rounded-sm bg-amber-200/70 px-0.5 text-inherit dark:bg-amber-600/40">{part}</mark>
            : part,
    );
}

interface WisataCardProps {
    id: number;
    slug: string;
    nama_wisata: string;
    alamat: string;
    deskripsi: string;
    foto?: string | null;
    foto_url?: string | null;
    kategori?: { nama_kategori: string } | null;
    rating?: number | null;
    searchQuery?: string;
}

export function WisataCard({ slug, nama_wisata, alamat, deskripsi, foto_url, kategori, rating, searchQuery }: WisataCardProps) {
    const [broken, setBroken] = useState(false);

    return (
        <Link href={`/wisata/${slug}`} className="group block h-full">
            <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(0,0,0,0.12)]">
                <div className="relative h-64 overflow-hidden rounded-t-3xl">
                    {foto_url && !broken ? (
                        <img
                            src={foto_url}
                            alt={nama_wisata}
                            loading="lazy"
                            decoding="async"
                            onError={() => setBroken(true)}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-brand/20 to-brand/5">
                            <ImageIcon className="size-16 text-brand/30" />
                        </div>
                    )}

                    {kategori && (
                        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur-md">
                            {kategori.nama_kategori}
                        </div>
                    )}

                    {rating ? (
                        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 backdrop-blur-md">
                            <Star className="size-3.5 fill-amber-500 text-amber-500" aria-hidden="true" />
                            <span className="text-xs font-medium text-neutral-900">{Number(rating).toFixed(1)}</span>
                        </div>
                    ) : null}
                </div>

                <div className="flex grow flex-col p-5">
                    <div className="mb-1 flex items-center gap-1 text-sm text-brand">
                        <MapPin className="size-3.5" />
                        <span className="text-xs font-medium">{alamat.split(',')[0]}</span>
                    </div>

                    <h3 className="mb-1.5 text-lg font-semibold text-neutral-900">{highlightText(nama_wisata, searchQuery)}</h3>

                    <p className="mb-4 grow text-sm leading-relaxed text-neutral-600 line-clamp-2">{highlightText(deskripsi, searchQuery)}</p>

                    <span className="inline-flex w-full items-center justify-center rounded-xl border border-brand px-4 py-2.5 text-sm font-semibold text-brand transition-all group-hover:bg-brand group-hover:text-white active:scale-[0.98]">
                        Lihat Detail
                    </span>
                </div>
            </div>
        </Link>
    );
}
