import { Head, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Kategori {
    id: number;
    nama_kategori: string;
    slug: string;
    deskripsi: string | null;
    wisatas_count: number;
}

interface Props {
    kategoris: Kategori[];
}

export default function AdminKategoriIndex({ kategoris }: Props) {
    const [nama, setNama] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editNama, setEditNama] = useState('');
    const [editDeskripsi, setEditDeskripsi] = useState('');

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/kategori', { nama_kategori: nama, deskripsi });
        setNama('');
        setDeskripsi('');
    };

    const handleUpdate = (id: number) => {
        router.put(`/admin/kategori/${id}`, { nama_kategori: editNama, deskripsi: editDeskripsi });
        setEditingId(null);
    };

    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Hapus kategori "${nama}"?`)) {
            router.delete(`/admin/kategori/${id}`);
        }
    };

    return (
        <>
            <Head title="Kelola Kategori" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-zinc-950 p-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Kelola Kategori</h1>
                    <p className="text-sm text-zinc-500">{kategoris.length} categories</p>
                </div>

                {/* Create Form */}
                <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-sm shadow-black/20">
                    <div className="flex-1">
                        <label className="mb-1 block text-xs font-medium text-zinc-200">Nama Kategori</label>
                        <input value={nama} onChange={(e) => setNama(e.target.value)} required className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                    </div>
                    <div className="flex-1">
                        <label className="mb-1 block text-xs font-medium text-zinc-200">Deskripsi</label>
                        <input value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                    </div>
                    <button type="submit" className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700">Tambah</button>
                </form>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-zinc-800">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-900 text-zinc-400">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Nama</th>
                                <th className="px-4 py-3 font-semibold">Slug</th>
                                <th className="px-4 py-3 font-semibold">Deskripsi</th>
                                <th className="px-4 py-3 font-semibold">Wisata</th>
                                <th className="px-4 py-3 font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {kategoris.map((k) => (
                                <tr key={k.id} className="bg-zinc-950 hover:bg-zinc-900/50">
                                    {editingId === k.id ? (
                                        <>
                                            <td className="px-4 py-2">
                                                <input value={editNama} onChange={(e) => setEditNama(e.target.value)} className="w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm text-zinc-100 focus:border-teal-500 focus:outline-none" />
                                            </td>
                                            <td className="px-4 py-2 text-zinc-500">{k.slug}</td>
                                            <td className="px-4 py-2">
                                                <input value={editDeskripsi} onChange={(e) => setEditDeskripsi(e.target.value)} className="w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm text-zinc-100 focus:border-teal-500 focus:outline-none" />
                                            </td>
                                            <td className="px-4 py-2 text-zinc-400">{k.wisatas_count}</td>
                                            <td className="flex gap-2 px-4 py-2">
                                                <button onClick={() => handleUpdate(k.id)} className="rounded bg-teal-600 px-2 py-1 text-xs font-medium text-white hover:bg-teal-700">Save</button>
                                                <button onClick={() => setEditingId(null)} className="rounded border border-zinc-700 px-2 py-1 text-xs font-medium text-zinc-400 hover:bg-zinc-800">Cancel</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-4 py-3 font-medium text-zinc-100">{k.nama_kategori}</td>
                                            <td className="px-4 py-3 text-zinc-500">{k.slug}</td>
                                            <td className="max-w-xs truncate px-4 py-3 text-zinc-400">{k.deskripsi || '—'}</td>
                                            <td className="px-4 py-3">
                                                <span className="rounded-full bg-teal-900/50 px-2.5 py-0.5 text-xs font-medium text-teal-400">{k.wisatas_count}</span>
                                            </td>
                                            <td className="flex gap-2 px-4 py-3">
                                                <button onClick={() => { setEditingId(k.id); setEditNama(k.nama_kategori); setEditDeskripsi(k.deskripsi || ''); }} className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-teal-400">
                                                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </button>
                                                <button onClick={() => handleDelete(k.id, k.nama_kategori)} className="rounded-md p-1.5 text-zinc-500 hover:bg-red-900/30 hover:text-red-400">
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

AdminKategoriIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Kategori', href: '/admin/kategori' },
    ],
};
