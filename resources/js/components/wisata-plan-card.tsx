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
            <h4 className="mb-1 text-xl font-semibold text-neutral-900">Plan Your Visit</h4>
            <p className="mb-6 text-base text-neutral-600">
                Connect with a certified local guide to experience the best of the black orchid blooming season.
            </p>

            <Button className="mb-4 w-full rounded-xl py-6 text-base font-bold shadow-md disabled:opacity-50" disabled>
                Book a Guided Tour
            </Button>

            <Button
                variant="outline"
                className={`w-full rounded-xl py-6 text-base font-bold ${
                    isFavorited ? 'border-red-200 text-red-600 hover:bg-red-50' : ''
                }`}
                disabled={!isLoggedIn}
                onClick={onFavoritToggle}
            >
                <Heart className={`mr-2 size-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorited ? 'Saved to Wishlist' : 'Save to Wishlist'}
            </Button>
        </div>
    );
}
