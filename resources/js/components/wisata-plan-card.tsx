import { Calendar, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WisataPlanCard() {
    return (
        <div className="rounded-[24px] border border-neutral-200/30 bg-white p-6 shadow-sm">
            <h4 className="mb-1 text-xl font-semibold text-neutral-900">Plan Your Visit</h4>
            <p className="mb-6 text-base text-neutral-600">
                Connect with a certified local guide to experience the best of the black orchid blooming season.
            </p>

            <div className="mb-6 space-y-4">
                <div className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-full bg-teal-50 text-[#00685f]">
                        <Calendar className="size-5" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Best Season</p>
                        <p className="text-xs text-neutral-500">May - September</p>
                    </div>
                </div>
            </div>

            <Button className="mb-4 w-full rounded-xl py-6 text-base font-bold shadow-md disabled:opacity-50" disabled>
                Book a Guided Tour
            </Button>

            <Button variant="outline" className="w-full rounded-xl py-6 text-base font-bold disabled:opacity-50" disabled>
                <Heart className="mr-2 size-5" />
                Save to Wishlist
            </Button>
        </div>
    );
}
