import { Head, Link } from '@inertiajs/react';
import { Activity, Eye, FolderTree, ImageIcon, MapPin, Plus, Sofa } from 'lucide-react';

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
        { label: 'Total wisata', value: stats.total_wisata, icon: MapPin, href: '/admin/wisata' },
        { label: 'Wisata aktif', value: stats.wisata_aktif, icon: Eye, href: '/admin/wisata' },
        { label: 'Kategori', value: stats.total_kategori, icon: FolderTree, href: '/admin/kategori' },
        { label: 'Foto galeri', value: stats.total_galeri, icon: ImageIcon, href: '/admin/galeri' },
    ];

    const links = [
        { label: 'Kelola wisata', href: '/admin/wisata', icon: MapPin },
        { label: 'Kelola kategori', href: '/admin/kategori', icon: FolderTree },
        { label: 'Kelola galeri', href: '/admin/galeri', icon: ImageIcon },
        { label: 'Kelola fasilitas', href: '/admin/fasilitas', icon: Sofa },
        { label: 'Log AI', href: '/admin/ai-logs', icon: Activity },
    ];

    return (
        <>
            <Head title="Dashboard Admin" />

            <div className="flex h-full flex-1 flex-col gap-8 overflow-x-auto rounded-xl bg-background p-4 md:p-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Ringkasan konten Jelajah Kubar.</p>
                    </div>
                    <Link href="/admin/wisata/create" className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                        <Plus className="size-4" aria-hidden="true" /> Tambah wisata
                    </Link>
                </div>

                <div className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => (
                        <Link key={card.label} href={card.href} className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-brand/50 focus-visible:outline-2 focus-visible:outline-brand">
                            <card.icon className="mb-4 size-5 text-brand dark:text-brand-soft" aria-hidden="true" />
                            <p className="text-3xl font-bold tracking-tight text-foreground">{card.value}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
                        </Link>
                    ))}
                </div>

                <section aria-labelledby="pintasan">
                    <h2 id="pintasan" className="mb-4 text-lg font-semibold text-foreground">Pintasan</h2>
                    <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {links.map((l) => (
                            <li key={l.href}>
                                <Link href={l.href} className="flex items-center gap-3 rounded-xl border border-border px-5 py-4 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-brand">
                                    <l.icon className="size-4 text-muted-foreground" aria-hidden="true" /> {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
    ],
};
