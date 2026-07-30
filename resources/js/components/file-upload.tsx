import { useRef, useState } from 'react';
import { ImageIcon, Upload, X } from 'lucide-react';

interface FileUploadProps {
    accept?: string;
    maxSize?: number; // in bytes
    preview?: string | null; // existing foto URL
    onFileSelect: (file: File | null) => void;
    label?: string;
}

export function FileUpload({ accept = 'image/*', maxSize = 5 * 1024 * 1024, preview, onFileSelect, label = 'Foto' }: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);
    const [selected, setSelected] = useState<{ file: File; url: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFile = (file: File | null) => {
        setError(null);
        if (!file) {
            setSelected(null);
            onFileSelect(null);
            return;
        }

        if (!file.type.startsWith('image/')) {
            setError('Hanya file gambar yang diizinkan.');
            return;
        }

        if (file.size > maxSize) {
            setError(`Maksimal ${Math.round(maxSize / 1024 / 1024)}MB.`);
            return;
        }

        setSelected({ file, url: URL.createObjectURL(file) });
        onFileSelect(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files?.[0] || null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFile(e.target.files?.[0] || null);
        e.target.value = '';
    };

    const clear = () => {
        setSelected(null);
        onFileSelect(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const previewUrl = selected?.url || preview;

    return (
        <div className="space-y-2">
            {label && <label className="block text-sm font-medium text-zinc-200">{label}</label>}

            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors ${
                    dragOver ? 'border-teal-500 bg-teal-900/20' : 'border-zinc-700 hover:border-zinc-500'
                } ${previewUrl ? 'pb-4 pt-4' : 'min-h-[140px]'}`}
            >
                <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />

                {previewUrl ? (
                    <div className="relative w-full">
                        <img src={previewUrl} alt="preview" className="mx-auto max-h-48 rounded-lg object-contain" />
                        {selected && (
                            <button type="button" onClick={(e) => { e.stopPropagation(); clear(); }} className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700">
                                <X className="size-4" />
                            </button>
                        )}
                        {selected && <p className="mt-2 text-center text-xs text-zinc-400">{selected.file.name}</p>}
                    </div>
                ) : (
                    <>
                        <Upload className="mb-2 size-8 text-zinc-500" />
                        <p className="text-sm text-zinc-400">Drag & drop or <span className="text-teal-400">browse</span></p>
                        <p className="mt-1 text-xs text-zinc-600">{accept.replace('image/*', 'JPG, PNG, WEBP')} · max {Math.round(maxSize / 1024 / 1024)}MB</p>
                    </>
                )}
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
}
