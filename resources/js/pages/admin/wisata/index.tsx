import { Head, Link, router } from '@inertiajs/react';
import { Edit3, Plus, Search, Trash2 } from 'lucide-react';
import { Pagination } from '@/components/pagination';
import type { Wisata } from '@/types';
import type { PaginatedData } from '@/types/pagination';

type WisataPaginated = PaginatedData<Wisata & { kategori?: { nama_kategori: string } | null }>;

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

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl bg-background p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Kelola Wisata</h1>
                        <p className="text-sm text-muted-foreground">{wisatas.total} destinasi</p>
                    </div>
                    <Link href="/admin/wisata/create" className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover">
                        <Plus className="size-4" /> Tambah Wisata
                    </Link>
                </div>

                {/* Search */}
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                        placeholder="Cari wisata..."
                        aria-label="Cari wisata"
                        defaultValue={filters.search || ''}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                router.get('/admin/wisata', { search: (e.target as HTMLInputElement).value }, { preserveState: true, replace: true });
                            }
                        }}
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-card text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Nama</th>
                                <th className="px-4 py-3 font-semibold">Kategori</th>
                                <th className="px-4 py-3 font-semibold">Lokasi</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {wisatas.data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                                        {filters.search ? `Tidak ada wisata untuk "${filters.search}".` : 'Belum ada wisata.'}
                                    </td>
                                </tr>
                            )}
                            {wisatas.data.map((wisata) => (
                                <tr key={wisata.id} className="bg-background hover:bg-muted/50">
                                    <td className="px-4 py-3 font-medium text-foreground">{wisata.nama_wisata}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{wisata.kategori?.nama_kategori || '—'}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{wisata.alamat.split(',')[0]}</td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${wisata.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                                            {wisata.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="flex gap-2 px-4 py-3">
                                        <Link href={`/admin/wisata/${wisata.id}/edit`} aria-label={`Ubah ${wisata.nama_wisata}`} className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-teal-600 dark:hover:text-teal-400">
                                            <Edit3 className="size-4" />
                                        </Link>
                                        <button type="button" aria-label={`Hapus ${wisata.nama_wisata}`} onClick={() => handleDelete(wisata.id, wisata.nama_wisata)} className="rounded-md p-2 text-muted-foreground hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400">
                                            <Trash2 className="size-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination links={wisatas.links} />
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
