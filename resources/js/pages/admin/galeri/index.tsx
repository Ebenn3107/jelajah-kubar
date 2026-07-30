import { Head, Link, router } from '@inertiajs/react';
import { ImageIcon, Trash2, Star } from 'lucide-react';
import { useState } from 'react';
import { FileUpload } from '@/components/file-upload';

interface GaleriItem {
    id: number;
    foto: string;
    foto_url: string | null;
    caption: string | null;
    is_primary: boolean;
    sort_order: number;
}

interface Props {
    galeris: GaleriItem[];
    wisatas: { id: number; nama_wisata: string }[];
    selectedWisata: { id: number; nama_wisata: string } | null;
    filters: { wisata_id?: string };
}

export default function AdminGaleriIndex({ galeris, wisatas, selectedWisata, filters }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [caption, setCaption] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!filters.wisata_id || !file) return;

        const formData = new FormData();
        formData.append('wisata_id', filters.wisata_id);
        formData.append('foto', file);
        if (caption) formData.append('caption', caption);

        router.post('/admin/galeri', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        setCaption('');
        setFile(null);
    };

    const handleDelete = (id: number) => {
        if (confirm('Hapus foto ini?')) {
            router.delete(`/admin/galeri/${id}`);
        }
    };

    return (
        <>
            <Head title="Kelola Galeri" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-zinc-950 p-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Kelola Galeri</h1>
                    <p className="text-sm text-zinc-500">Manage destination photos</p>
                </div>

                {/* Select Wisata */}
                <div className="flex flex-wrap items-center gap-3">
                    <label className="text-sm font-medium text-zinc-200">Pilih Wisata:</label>
                    <select
                        value={filters.wisata_id || ''}
                        onChange={(e) => router.get('/admin/galeri', { wisata_id: e.target.value })}
                        className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                        <option value="" className="bg-zinc-950">— Pilih —</option>
                        {wisatas.map((w) => (
                            <option key={w.id} value={w.id} className="bg-zinc-950">{w.nama_wisata}</option>
                        ))}
                    </select>
                    <Link href="/admin/wisata/create" className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-zinc-800">
                        + Buat Wisata Baru
                    </Link>
                </div>

                {selectedWisata && (
                    <>
                        {/* Upload Form */}
                        <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm shadow-black/20">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="md:col-span-2">
                                    <FileUpload
                                        label="Upload Foto"
                                        onFileSelect={(f) => setFile(f)}
                                    />
                                </div>
                                <div className="flex flex-col justify-end gap-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-zinc-200">Caption</label>
                                        <input
                                            value={caption}
                                            onChange={(e) => setCaption(e.target.value)}
                                            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-teal-500 focus:outline-none"
                                            placeholder="Deskripsi foto"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!file}
                                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
                                    >
                                        Upload
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Grid */}
                        {galeris.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 py-20 text-zinc-500">
                                <ImageIcon className="size-12 text-zinc-600" />
                                <p>Belum ada foto untuk "{selectedWisata.nama_wisata}"</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {galeris.map((g) => (
                                    <div key={g.id} className="group relative overflow-hidden rounded-xl border border-zinc-800">
                                        {g.foto_url ? (
                                            <img src={g.foto_url} alt={g.caption || ''} className="aspect-square w-full object-cover" />
                                        ) : (
                                            <div className="flex aspect-square items-center justify-center bg-zinc-800 text-zinc-600">
                                                <ImageIcon className="size-16" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                                            <button onClick={() => handleDelete(g.id)} className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700">
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                            <p className="text-xs text-white/80">{g.caption || '—'}</p>
                                            {g.is_primary && (
                                                <span className="mt-1 inline-flex items-center gap-1 rounded bg-teal-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                                    <Star className="size-2.5" /> Primary
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

AdminGaleriIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Galeri', href: '/admin/galeri' },
    ],
};
