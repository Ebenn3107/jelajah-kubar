import { Head, Link } from '@inertiajs/react';
import { LayoutDashboard, MapPin, FolderTree, Eye } from 'lucide-react';

interface Stats {
    total_wisata: number;
    total_kategori: number;
    total_galeri: number;
    wisata_aktif: number;
}

interface Props {
    stats: Stats;
}

export default function AdminDashboard({ stats }: Props) {
    const cards = [
        { label: 'Total Wisata', value: stats.total_wisata, icon: MapPin, href: '/admin/wisata', color: 'text-teal-400 bg-teal-900/50' },
        { label: 'Wisata Aktif', value: stats.wisata_aktif, icon: Eye, href: '/admin/wisata', color: 'text-emerald-400 bg-emerald-900/50' },
        { label: 'Kategori', value: stats.total_kategori, icon: FolderTree, href: '/admin/kategori', color: 'text-amber-400 bg-amber-900/50' },
        { label: 'Galeri', value: stats.total_galeri, icon: LayoutDashboard, href: '#', color: 'text-blue-400 bg-blue-900/50' },
    ];

    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-zinc-950 p-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-sm text-zinc-500">Overview of your Jelajah Kubar content.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => (
                        <Link key={card.label} href={card.href} className="block">
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm shadow-black/20 transition-all hover:shadow-md hover:shadow-black/30">
                                <div className={`mb-4 inline-flex rounded-lg p-3 ${card.color}`}>
                                    <card.icon className="size-6" />
                                </div>
                                <p className="text-3xl font-bold text-zinc-100">{card.value}</p>
                                <p className="mt-1 text-sm text-zinc-400">{card.label}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm shadow-black/20">
                    <h2 className="mb-4 text-lg font-semibold text-zinc-100">Quick Actions</h2>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/admin/wisata/create" className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">
                            + Add Wisata
                        </Link>
                        <Link href="/admin/wisata" className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800">
                            Manage Wisata
                        </Link>
                        <Link href="/admin/kategori" className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800">
                            Manage Kategori
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
    ],
};
