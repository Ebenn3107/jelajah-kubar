import { Head, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface FasilitasItem {
    id: number;
    nama_fasilitas: string;
    ikon: string | null;
    wisatas_count: number;
}

interface Props {
    fasilitas: FasilitasItem[];
}

export default function AdminFasilitasIndex({ fasilitas }: Props) {
    const [nama, setNama] = useState('');
    const [ikon, setIkon] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editNama, setEditNama] = useState('');

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/fasilitas', { nama_fasilitas: nama, ikon: ikon || undefined });
        setNama('');
        setIkon('');
    };

    const handleUpdate = (id: number) => {
        router.put(`/admin/fasilitas/${id}`, { nama_fasilitas: editNama });
        setEditingId(null);
    };

    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Hapus fasilitas "${nama}"?`)) {
            router.delete(`/admin/fasilitas/${id}`);
        }
    };

    return (
        <>
            <Head title="Kelola Fasilitas" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-background p-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Kelola Fasilitas</h1>
                    <p className="text-sm text-muted-foreground">{fasilitas.length} facilities</p>
                </div>

                {/* Create */}
                <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4 shadow-sm shadow-black/20">
                    <div className="flex-1">
                        <label className="mb-1 block text-xs font-medium text-foreground">Nama Fasilitas</label>
                        <input value={nama} onChange={(e) => setNama(e.target.value)} required className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none" placeholder="WiFi, Parkir..." />
                    </div>
                    <button type="submit" className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-hover">Tambah</button>
                </form>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-card text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Nama</th>
                                <th className="px-4 py-3 font-semibold">Ikon</th>
                                <th className="px-4 py-3 font-semibold">Wisata</th>
                                <th className="px-4 py-3 font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {fasilitas.map((f) => (
                                <tr key={f.id} className="bg-background hover:bg-muted/50">
                                    {editingId === f.id ? (
                                        <>
                                            <td className="px-4 py-2">
                                                <input value={editNama} onChange={(e) => setEditNama(e.target.value)} className="w-full rounded border border-input bg-background px-2 py-1 text-sm text-foreground focus:border-brand focus:outline-none" />
                                            </td>
                                            <td className="px-4 py-2 text-muted-foreground">{f.ikon || '—'}</td>
                                            <td className="px-4 py-2 text-muted-foreground">{f.wisatas_count}</td>
                                            <td className="flex gap-2 px-4 py-2">
                                                <button onClick={() => handleUpdate(f.id)} className="rounded bg-brand px-2 py-1 text-xs font-medium text-white hover:bg-brand-hover">Simpan</button>
                                                <button onClick={() => setEditingId(null)} className="rounded border border-input px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent">Batal</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-4 py-3 font-medium text-foreground">{f.nama_fasilitas}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{f.ikon || '—'}</td>
                                            <td className="px-4 py-3">
                                                <span className="rounded-full bg-teal-100 dark:bg-teal-900/50 px-2.5 py-0.5 text-xs font-medium text-brand dark:text-brand-soft">{f.wisatas_count}</span>
                                            </td>
                                            <td className="flex gap-2 px-4 py-3">
                                                <button onClick={() => {
 setEditingId(f.id); setEditNama(f.nama_fasilitas); 
}} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-teal-600 dark:hover:text-teal-400">
                                                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </button>
                                                <button onClick={() => handleDelete(f.id, f.nama_fasilitas)} className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400">
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

AdminFasilitasIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Fasilitas', href: '/admin/fasilitas' },
    ],
};
