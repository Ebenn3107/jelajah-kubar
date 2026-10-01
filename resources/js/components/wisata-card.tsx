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
    harga_tiket?: string | null;
    searchQuery?: string;
}

export function WisataCard({ slug, nama_wisata, alamat, deskripsi, foto_url, kategori, rating, harga_tiket, searchQuery }: WisataCardProps) {
    const [broken, setBroken] = useState(false);

    return (
        <Link href={`/wisata/${slug}`} className="group flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-surface-high">
                {foto_url && !broken ? (
                    <img
                        src={foto_url}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        onError={() => setBroken(true)}
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex size-full items-center justify-center bg-linear-to-br from-brand to-brand-deep">
                        <ImageIcon className="size-12 text-white/20" aria-hidden="true" />
                    </div>
                )}

                {rating ? (
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 backdrop-blur-md">
                        <Star className="size-3.5 fill-amber text-amber" aria-hidden="true" />
                        <span className="text-xs font-semibold text-ink">{Number(rating).toFixed(1)}</span>
                    </div>
                ) : null}
            </div>

            <div className="flex grow flex-col pt-4">
                {kategori && <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-copper">{kategori.nama_kategori}</p>}

                <h3 className="text-xl font-bold leading-snug tracking-tight text-ink wrap-anywhere transition-colors group-hover:text-brand">
                    {highlightText(nama_wisata, searchQuery)}
                </h3>

                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-muted">
                    <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{alamat.split(',')[0]}</span>
                </p>

                <p className="mt-3 grow text-sm leading-relaxed text-ink-muted line-clamp-2">{highlightText(deskripsi, searchQuery)}</p>

                <p className="mt-4 text-sm font-semibold text-ink">
                    {harga_tiket ? `Tiket ${harga_tiket}` : 'Lihat detail'}
                    <span aria-hidden="true" className="ml-1 inline-block text-brand transition-transform group-hover:translate-x-1">→</span>
                </p>
            </div>
        </Link>
    );
}
