import { Head, Link, router } from '@inertiajs/react';
import { Edit3, Plus, Search, Trash2 } from 'lucide-react';
import type { Wisata } from '@/types';

interface WisataPaginated {
    data: (Wisata & { kategori?: { nama_kategori: string } | null })[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
}

interface Props {
    wisatas: WisataPaginated;
    kategoris: { id: number; nama_kategori: string }[];
    filters: { search?: string };
}

export default function AdminWisataIndex({ wisatas, filters }: Props) {
    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Hapus "${nama}"?`)) {
            router.delete(`/admin/wisata/${id}`);
        }
    };

    return (
        <>
            <Head title="Kelola Wisata" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl bg-zinc-950 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Kelola Wisata</h1>
                        <p className="text-sm text-zinc-500">{wisatas.total} destinations</p>
                    </div>
                    <Link href="/admin/wisata/create" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">
                        <Plus className="size-4" /> Add Wisata
                    </Link>
                </div>

                {/* Search */}
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                    <input
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        placeholder="Search wisata..."
                        defaultValue={filters.search || ''}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                router.get('/admin/wisata', { search: (e.target as HTMLInputElement).value }, { preserveState: true, replace: true });
                            }
                        }}
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-zinc-800">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-900 text-zinc-400">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Nama</th>
                                <th className="px-4 py-3 font-semibold">Kategori</th>
                                <th className="px-4 py-3 font-semibold">Lokasi</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {wisatas.data.map((wisata) => (
                                <tr key={wisata.id} className="bg-zinc-950 hover:bg-zinc-900/50">
                                    <td className="px-4 py-3 font-medium text-zinc-100">{wisata.nama_wisata}</td>
                                    <td className="px-4 py-3 text-zinc-400">{wisata.kategori?.nama_kategori || '—'}</td>
                                    <td className="px-4 py-3 text-zinc-400">{wisata.alamat.split(',')[0]}</td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${wisata.is_active ? 'bg-emerald-900/50 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                                            {wisata.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="flex gap-2 px-4 py-3">
                                        <Link href={`/admin/wisata/${wisata.id}/edit`} className="rounded-md p-2 text-zinc-500 hover:bg-zinc-800 hover:text-teal-400">
                                            <Edit3 className="size-4" />
                                        </Link>
                                        <button onClick={() => handleDelete(wisata.id, wisata.nama_wisata)} className="rounded-md p-2 text-zinc-500 hover:bg-red-900/30 hover:text-red-400">
                                            <Trash2 className="size-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {wisatas.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {Array.from({ length: wisatas.last_page }, (_, i) => i + 1).map((page) => (
                            <Link
                                key={page}
                                href={`/admin/wisata?page=${page}`}
                                className={`rounded-lg px-3 py-1.5 text-sm ${page === wisatas.current_page ? 'bg-teal-600 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
                                preserveState
                            >
                                {page}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

AdminWisataIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Wisata', href: '/admin/wisata' },
    ],
};
