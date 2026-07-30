import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface GaleriLightboxProps {
    images: { foto_url: string | null; caption: string | null }[];
    startIndex: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function GaleriLightbox({ images, startIndex, open, onOpenChange }: GaleriLightboxProps) {
    const [idx, setIdx] = useState(startIndex);

    useEffect(() => { setIdx(startIndex); }, [startIndex]);

    const prev = () => setIdx((idx - 1 + images.length) % images.length);
    const next = () => setIdx((idx + 1) % images.length);
    const current = images[idx];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <style>{`
                [data-slot="dialog-overlay"] { z-index: 9999 !important; }
                [data-slot="dialog-content"] { z-index: 9999 !important; }
            `}</style>
            <DialogContent className="max-w-4xl border-zinc-800 bg-zinc-950 p-0 sm:max-w-[90vw]">
                <div className="relative flex h-[80vh] items-center justify-center">
                    {current?.foto_url ? (
                        <img src={current.foto_url} alt={current.caption || ''} className="max-h-full max-w-full object-contain" />
                    ) : (
                        <p className="text-zinc-500">No image</p>
                    )}

                    {images.length > 1 && (
                        <>
                            <button onClick={prev} className="absolute left-2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70">
                                <ChevronLeft className="size-6" />
                            </button>
                            <button onClick={next} className="absolute right-2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70">
                                <ChevronRight className="size-6" />
                            </button>
                        </>
                    )}

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                        {idx + 1} / {images.length}
                        {current?.caption && ` — ${current.caption}`}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
