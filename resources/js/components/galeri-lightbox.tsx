import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

interface GaleriLightboxProps {
    images: { foto_url: string | null; caption: string | null }[];
    startIndex: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function GaleriLightbox({ images, startIndex, open, onOpenChange }: GaleriLightboxProps) {
    const [idx, setIdx] = useState(startIndex);

    useEffect(() => { setIdx(startIndex); }, [startIndex]);

    const count = Math.max(images.length, 1);
    const prev = () => setIdx((idx - 1 + count) % count);
    const next = () => setIdx((idx + 1) % count);
    const current = images[idx];

    useEffect(() => {
        if (!open) {
            return;
        }

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                setIdx((i) => (i - 1 + count) % count);
            } else if (e.key === 'ArrowRight') {
                setIdx((i) => (i + 1) % count);
            }
        };
        window.addEventListener('keydown', onKey);

        return () => window.removeEventListener('keydown', onKey);
    }, [open, count]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl border-zinc-800 bg-zinc-950 p-0 sm:max-w-[90vw]">
                <DialogTitle className="sr-only">Galeri foto</DialogTitle>
                <DialogDescription className="sr-only">Gunakan tombol panah kiri dan kanan untuk berpindah foto.</DialogDescription>
                <div className="relative flex h-[80vh] items-center justify-center">
                    {current?.foto_url ? (
                        <img src={current.foto_url} alt={current.caption || ''} className="max-h-full max-w-full object-contain" />
                    ) : (
                        <p className="text-zinc-400">Tidak ada gambar</p>
                    )}

                    {images.length > 1 && (
                        <>
                            <button type="button" onClick={prev} aria-label="Foto sebelumnya" className="absolute left-2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70">
                                <ChevronLeft className="size-6" />
                            </button>
                            <button type="button" onClick={next} aria-label="Foto berikutnya" className="absolute right-2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70">
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
