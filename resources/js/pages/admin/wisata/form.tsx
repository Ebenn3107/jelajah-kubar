import { Head, Link, router } from '@inertiajs/react';
import { Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const formRef = useRef<HTMLFormElement>(null);

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

        // Content-Type multipart diatur Inertia otomatis (boundary harus ikut)
        const options = {
            onStart: () => {
                setProcessing(true);
                setErrors({});
            },
            onError: (errs: Record<string, string>) => setErrors(errs),
            onFinish: () => setProcessing(false),
        };

        if (isEdit) {
            formData.append('_method', 'PUT');
            router.post(`/admin/wisata/${wisata.id}`, formData, options);
        } else {
            router.post('/admin/wisata', formData, options);
        }
    };

    const handleGenerate = () => {
        if (!wisata) {
return;
}

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
            onFinish: () => setLoading(false),
        });
    };

    const handleApplyAll = () => {
        if (!preview) {
return;
}

        const form = formRef.current;

        if (!form) {
return;
}

        // Hanya deskripsi yang punya kolom di database; pakai versi yang sudah diedit di panel AI
        const ai = form.elements.namedItem('ai_deskripsi') as HTMLTextAreaElement | null;
        const target = form.elements.namedItem('deskripsi') as HTMLTextAreaElement | null;

        if (target) {
target.value = ai?.value ?? preview.deskripsi;
}

        setPreview(null);
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Wisata' : 'Tambah Wisata'} />

            <div className="mx-auto max-w-3xl rounded-xl bg-background p-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground">{isEdit ? 'Edit Wisata' : 'Tambah Wisata'}</h1>
                    <p className="text-sm text-muted-foreground">{isEdit ? 'Perbarui informasi destinasi wisata.' : 'Buat destinasi wisata baru.'}</p>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    {Object.keys(errors).length > 0 && (
                        <div role="alert" className="rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-700 dark:text-red-300">
                            <p className="mb-1 font-semibold">Data belum bisa disimpan:</p>
                            <ul className="list-inside list-disc">
                                {Object.entries(errors).map(([field, msg]) => (
                                    <li key={field}>{msg}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/20">
                        <h2 className="mb-4 text-lg font-semibold text-foreground">Informasi Dasar</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-foreground">Nama Wisata *</label>
                                <input name="nama_wisata" defaultValue={wisata?.nama_wisata || ''} required className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Kategori</label>
                                <select name="kategori_id" defaultValue={wisata?.kategori_id || ''} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500">
                                    <option value="" className="bg-background">Pilih kategori</option>
                                    {kategoris.map((k) => (
                                        <option key={k.id} value={k.id} className="bg-background">{k.nama_kategori}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Status</label>
                                <select name="is_active" defaultValue={wisata ? (wisata.is_active ? '1' : '0') : '1'} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500">
                                    <option value="1" className="bg-background">Aktif</option>
                                    <option value="0" className="bg-background">Nonaktif</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-foreground">Alamat *</label>
                                <input name="alamat" defaultValue={wisata?.alamat || ''} required className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-foreground">Deskripsi</label>
                                <textarea name="deskripsi" rows={4} defaultValue={wisata?.deskripsi || ''} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/20">
                        <h2 className="mb-4 text-lg font-semibold text-foreground">Informasi Tambahan</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Harga Tiket</label>
                                <input name="harga_tiket" defaultValue={wisata?.harga_tiket || ''} placeholder="Rp 15.000" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Kontak</label>
                                <input name="kontak" defaultValue={wisata?.kontak || ''} placeholder="No. Telepon" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Jam Buka</label>
                                <input name="jam_buka" defaultValue={wisata?.jam_buka || ''} placeholder="08:00" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Jam Tutup</label>
                                <input name="jam_tutup" defaultValue={wisata?.jam_tutup || ''} placeholder="17:00" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Latitude</label>
                                <input name="latitude" defaultValue={wisata?.latitude || ''} placeholder="-0.416667" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Longitude</label>
                                <input name="longitude" defaultValue={wisata?.longitude || ''} placeholder="115.916667" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
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
                        <div className="rounded-xl border border-teal-300 dark:border-teal-700/50 bg-card p-6 shadow-sm shadow-black/20">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-teal-600 dark:text-teal-400">Konten Hasil AI</h2>
                                <button type="button" onClick={() => setPreview(null)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
                                    <X className="size-4" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Deskripsi</label>
                                    <textarea name="ai_deskripsi" rows={4} defaultValue={preview.deskripsi} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-teal-500 focus:outline-none" />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Ringkasan</label>
                                        <textarea name="ai_ringkasan" rows={2} defaultValue={preview.ringkasan} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-teal-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Meta Description (SEO)</label>
                                        <textarea name="ai_meta" rows={2} defaultValue={preview.meta_description} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-teal-500 focus:outline-none" />
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Highlight</label>
                                        <textarea name="ai_highlight" rows={3} defaultValue={preview.highlight} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-teal-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Tips Kunjungan</label>
                                        <textarea name="ai_tips" rows={3} defaultValue={preview.tips_kunjungan} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-teal-500 focus:outline-none" />
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-muted-foreground">SEO Keywords</label>
                                        <input name="ai_keywords" defaultValue={preview.seo_keywords} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-teal-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Caption Medsos</label>
                                        <input name="ai_caption" defaultValue={preview.caption_medsos} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-teal-500 focus:outline-none" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-3">
                                <button type="button" onClick={handleApplyAll} className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700">
                                    Terapkan Deskripsi ke Form
                                </button>
                                <button type="button" onClick={() => setPreview(null)} className="rounded-lg border border-input px-5 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent">
                                    Discard
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <button type="submit" disabled={processing} className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50">
                            {processing ? 'Menyimpan...' : isEdit ? 'Perbarui Wisata' : 'Simpan Wisata'}
                        </button>
                        {isEdit && (
                            <button
                                type="button"
                                onClick={handleGenerate}
                                disabled={loading}
                                className="inline-flex items-center gap-2 rounded-lg border border-teal-300 dark:border-teal-700 px-6 py-2.5 text-sm font-semibold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 disabled:opacity-50"
                            >
                                <Sparkles className={`size-4 ${loading ? 'animate-pulse' : ''}`} />
                                {loading ? 'Membuat konten...' : 'Buat Konten (AI)'}
                            </button>
                        )}
                        <Link href="/admin/wisata" className="rounded-lg border border-input px-6 py-2.5 text-sm font-semibold text-foreground/80 hover:bg-accent">
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
