import { Head, Link, router } from '@inertiajs/react';
import { Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FileUpload } from '@/components/file-upload';
import type { Wisata } from '@/types';

interface Props {
    wisata: Wisata | null;
    kategoris: { id: number; nama_kategori: string }[];
    ai_content?: AiContent | null;
}

interface AiContent {
    deskripsi: string;
    ringkasan: string;
    highlight: string;
    tips_kunjungan: string;
    meta_description: string;
    seo_keywords: string;
    alt_text_gambar: string;
    caption_medsos: string;
}

export default function AdminWisataForm({ wisata, kategoris, ai_content: initialAi }: Props) {
    const isEdit = !!wisata;
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<AiContent | null>(null);
    const [fotoFile, setFotoFile] = useState<File | null>(null);

    useEffect(() => {
        if (initialAi) {
            setPreview(initialAi);
        }
    }, [initialAi]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Override foto dengan file dari komponen upload
        if (fotoFile) {
            formData.set('foto', fotoFile);
        }

        if (isEdit) {
            formData.append('_method', 'PUT');
            router.post(`/admin/wisata/${wisata.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } else {
            router.post('/admin/wisata', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        }
    };

    const handleGenerate = () => {
        if (!wisata) return;
        setLoading(true);
        router.visit(`/admin/wisata/${wisata.id}/generate-content`, {
            method: 'post',
            preserveState: true,
            preserveScroll: true,
            only: ['ai_content', 'errors', 'wisata'],
            onSuccess: () => {
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            },
        });
    };

    const handleApplyAll = () => {
        if (!preview) return;
        // Cari form elements dan set value
        const form = document.querySelector<HTMLFormElement>('form');
        if (!form) return;

        const setVal = (name: string, value: string) => {
            const el = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
            if (el) el.value = value;
        };

        setVal('deskripsi', preview.deskripsi);
        setVal('ai_ringkasan', preview.ringkasan);
        setVal('ai_highlight', preview.highlight);
        setVal('ai_tips', preview.tips_kunjungan);
        setVal('meta_description', preview.meta_description);
        setVal('seo_keywords', preview.seo_keywords);
        setVal('alt_text_gambar', preview.alt_text_gambar);
        setVal('caption_medsos', preview.caption_medsos);

        setPreview(null);
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Wisata' : 'Tambah Wisata'} />

            <div className="mx-auto max-w-3xl rounded-xl bg-zinc-950 p-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Wisata' : 'Tambah Wisata'}</h1>
                    <p className="text-sm text-zinc-500">{isEdit ? 'Update informasi destinasi wisata.' : 'Buat destinasi wisata baru.'}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm shadow-black/20">
                        <h2 className="mb-4 text-lg font-semibold text-zinc-100">Informasi Dasar</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-zinc-200">Nama Wisata *</label>
                                <input name="nama_wisata" defaultValue={wisata?.nama_wisata || ''} required className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-200">Kategori</label>
                                <select name="kategori_id" defaultValue={wisata?.kategori_id || ''} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500">
                                    <option value="" className="bg-zinc-950">Pilih kategori</option>
                                    {kategoris.map((k) => (
                                        <option key={k.id} value={k.id} className="bg-zinc-950">{k.nama_kategori}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-200">Status</label>
                                <select name="is_active" defaultValue={wisata ? (wisata.is_active ? '1' : '0') : '1'} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500">
                                    <option value="1" className="bg-zinc-950">Active</option>
                                    <option value="0" className="bg-zinc-950">Inactive</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-zinc-200">Alamat *</label>
                                <input name="alamat" defaultValue={wisata?.alamat || ''} required className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-zinc-200">Deskripsi</label>
                                <textarea name="deskripsi" rows={4} defaultValue={wisata?.deskripsi || ''} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm shadow-black/20">
                        <h2 className="mb-4 text-lg font-semibold text-zinc-100">Informasi Tambahan</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-200">Harga Tiket</label>
                                <input name="harga_tiket" defaultValue={wisata?.harga_tiket || ''} placeholder="Rp 15.000" className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-200">Kontak</label>
                                <input name="kontak" defaultValue={wisata?.kontak || ''} placeholder="No. Telepon" className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-200">Jam Buka</label>
                                <input name="jam_buka" defaultValue={wisata?.jam_buka || ''} placeholder="08:00" className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-200">Jam Tutup</label>
                                <input name="jam_tutup" defaultValue={wisata?.jam_tutup || ''} placeholder="17:00" className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-200">Latitude</label>
                                <input name="latitude" defaultValue={wisata?.latitude || ''} placeholder="-0.416667" className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-200">Longitude</label>
                                <input name="longitude" defaultValue={wisata?.longitude || ''} placeholder="115.916667" className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                            </div>
                            <div className="md:col-span-2">
                                <FileUpload
                                    label="Foto Utama"
                                    preview={wisata?.foto_url || null}
                                    onFileSelect={(f) => setFotoFile(f)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* AI Preview Panel */}
                    {preview && (
                        <div className="rounded-xl border border-teal-700/50 bg-zinc-900 p-6 shadow-sm shadow-black/20">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-teal-400">AI Generated Content</h2>
                                <button type="button" onClick={() => setPreview(null)} className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300">
                                    <X className="size-4" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-zinc-400">Deskripsi</label>
                                    <textarea name="ai_deskripsi" rows={4} defaultValue={preview.deskripsi} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-teal-500 focus:outline-none" />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-zinc-400">Ringkasan</label>
                                        <textarea name="ai_ringkasan" rows={2} defaultValue={preview.ringkasan} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-teal-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-zinc-400">Meta Description (SEO)</label>
                                        <textarea name="ai_meta" rows={2} defaultValue={preview.meta_description} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-teal-500 focus:outline-none" />
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-zinc-400">Highlight</label>
                                        <textarea name="ai_highlight" rows={3} defaultValue={preview.highlight} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-teal-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-zinc-400">Tips Kunjungan</label>
                                        <textarea name="ai_tips" rows={3} defaultValue={preview.tips_kunjungan} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-teal-500 focus:outline-none" />
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-zinc-400">SEO Keywords</label>
                                        <input name="ai_keywords" defaultValue={preview.seo_keywords} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-teal-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-zinc-400">Caption Medsos</label>
                                        <input name="ai_caption" defaultValue={preview.caption_medsos} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-teal-500 focus:outline-none" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-3">
                                <button type="button" onClick={handleApplyAll} className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700">
                                    Apply All to Form
                                </button>
                                <button type="button" onClick={() => setPreview(null)} className="rounded-lg border border-zinc-700 px-5 py-2 text-sm font-semibold text-zinc-400 hover:bg-zinc-800">
                                    Discard
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <button type="submit" className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">
                            {isEdit ? 'Update Wisata' : 'Simpan Wisata'}
                        </button>
                        {isEdit && (
                            <button
                                type="button"
                                onClick={handleGenerate}
                                disabled={loading}
                                className="inline-flex items-center gap-2 rounded-lg border border-teal-700 px-6 py-2.5 text-sm font-semibold text-teal-400 hover:bg-teal-900/30 disabled:opacity-50"
                            >
                                <Sparkles className={`size-4 ${loading ? 'animate-pulse' : ''}`} />
                                {loading ? 'Generating...' : 'Generate Content (AI)'}
                            </button>
                        )}
                        <Link href="/admin/wisata" className="rounded-lg border border-zinc-700 px-6 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800">
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

AdminWisataForm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Wisata', href: '/admin/wisata' },
        { title: 'Form', href: '#' },
    ],
};
