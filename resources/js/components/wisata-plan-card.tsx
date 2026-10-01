import { Heart, Navigation } from 'lucide-react';

interface WisataPlanCardProps {
    onFavoritToggle?: () => void;
    isFavorited?: boolean;
    isLoggedIn?: boolean;
    mapsUrl?: string | null;
}

export function WisataPlanCard({ onFavoritToggle, isFavorited = false, isLoggedIn = false, mapsUrl }: WisataPlanCardProps) {
    return (
        <div className="rounded-3xl bg-surface-low p-6">
            <h2 className="mb-2 text-xl font-bold tracking-tight text-ink">Rencanakan kunjunganmu</h2>
            <p className="mb-6 leading-relaxed text-ink-muted">
                Simpan destinasi ini ke favorit agar mudah ditemukan saat menyusun perjalanan.
            </p>

            <div className="flex flex-col gap-3">
                <button
                    type="button"
                    aria-pressed={isFavorited}
                    onClick={onFavoritToggle}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                        isFavorited ? 'bg-white text-red-600 ring-1 ring-red-200 hover:bg-red-50' : 'bg-brand text-white hover:bg-brand-hover'
                    }`}
                >
                    <Heart className={`size-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} aria-hidden="true" />
                    {isFavorited ? 'Tersimpan di favorit' : isLoggedIn ? 'Simpan ke favorit' : 'Masuk untuk menyimpan'}
                </button>

                {mapsUrl && (
                    <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand px-6 py-3 font-semibold text-brand transition-colors hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                        <Navigation className="size-5" aria-hidden="true" />
                        Petunjuk arah
                    </a>
                )}
            </div>
        </div>
    );
}
