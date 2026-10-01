import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WisataPlanCardProps {
    onFavoritToggle?: () => void;
    isFavorited?: boolean;
    isLoggedIn?: boolean;
}

export function WisataPlanCard({ onFavoritToggle, isFavorited = false, isLoggedIn = false }: WisataPlanCardProps) {
    return (
        <div className="rounded-[24px] border border-neutral-200/30 bg-white p-6 shadow-sm">
            <h4 className="mb-1 text-xl font-semibold text-neutral-900">Rencanakan Kunjunganmu</h4>
            <p className="mb-6 text-base text-neutral-600">
                Simpan destinasi ini ke favorit agar mudah ditemukan saat menyusun perjalanan.
            </p>

            <Button
                variant="outline"
                className={`w-full rounded-xl py-6 text-base font-bold ${
                    isFavorited ? 'border-red-200 text-red-600 hover:bg-red-50' : ''
                }`}
                aria-pressed={isFavorited}
                onClick={onFavoritToggle}
            >
                <Heart className={`mr-2 size-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorited ? 'Tersimpan di Favorit' : isLoggedIn ? 'Simpan ke Favorit' : 'Masuk untuk Menyimpan'}
            </Button>
        </div>
    );
}
