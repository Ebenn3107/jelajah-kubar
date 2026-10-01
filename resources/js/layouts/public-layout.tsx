import { Link, router, usePage } from '@inertiajs/react';
import { Heart, LogOut, Menu, Settings, Trees, User as UserIcon, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Auth } from '@/types';
import { login, register } from '@/routes';
import { edit } from '@/routes/profile';

interface PublicLayoutProps {
    children: React.ReactNode;
}

const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/wisata', label: 'Destinasi' },
    { href: '/travel-planner', label: 'Perencana Perjalanan' },
    { href: '/local-guide', label: 'Pemandu Lokal' },
];

export default function PublicLayout({ children }: PublicLayoutProps) {
    const page = usePage<{ auth: Auth }>();
    const { auth } = page.props;
    const currentUrl: string = page.url as string;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const isAdmin = Boolean(auth.user?.is_admin);

    // Tutup menu saat pindah halaman (reset state saat render, bukan di effect)
    const [lastUrl, setLastUrl] = useState(currentUrl);

    if (lastUrl !== currentUrl) {
        setLastUrl(currentUrl);
        setMobileOpen(false);
        setMenuOpen(false);
    }

    // Tutup menu saat klik di luar atau tekan Escape

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setMenuOpen(false);
                setMobileOpen(false);
            }
        };
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);

        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, []);

    const isActive = (href: string): boolean => {
        if (href === '/') {
            return currentUrl === '/';
        }

        return currentUrl === href || currentUrl.startsWith(`${href}/`) || currentUrl.startsWith(`${href}?`);
    };

    const itemClass = 'flex items-center gap-3 px-4 py-2.5 text-sm text-ink-muted hover:bg-surface-low hover:text-brand focus-visible:bg-surface-low focus-visible:outline-none';

    return (
        <div className="public-light min-h-screen bg-surface text-ink">
            <a
                href="#konten"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
            >
                Lewati ke konten
            </a>

            <header className="sticky top-0 z-50 w-full bg-surface/95 backdrop-blur-md">
                <nav aria-label="Navigasi utama" className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-16">
                    <Link href="/" className="flex items-center gap-2">
                        <Trees className="size-7 text-brand" />
                        <span className="text-xl font-semibold tracking-tight text-brand">Jelajah Kubar</span>
                    </Link>

                    <div className="hidden items-center gap-8 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                aria-current={isActive(link.href) ? 'page' : undefined}
                                className={`text-sm transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-brand ${
                                    isActive(link.href) ? 'border-b-2 border-brand pb-1 font-bold text-brand' : 'text-ink-muted'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {auth.user ? (
                            <div className="flex items-center gap-3">
                                <Link href="/favorit" className="rounded-full p-2 text-ink-muted hover:bg-surface-low hover:text-brand focus-visible:outline-2 focus-visible:outline-brand" aria-label="Favorit">
                                    <Heart className="size-5" />
                                </Link>

                                <div ref={menuRef} className="relative">
                                    <button
                                        type="button"
                                        aria-haspopup="menu"
                                        aria-expanded={menuOpen}
                                        onClick={() => setMenuOpen((o) => !o)}
                                        className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:border-brand/30 hover:text-brand"
                                    >
                                        <UserIcon className="size-4" />
                                        <span className="hidden lg:inline">{auth.user.name}</span>
                                    </button>
                                    {menuOpen && (
                                        <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-line/60 bg-white py-2 shadow-[0_10px_30px_rgba(18,28,42,0.1)]">
                                            {isAdmin && (
                                                <Link href="/admin/dashboard" role="menuitem" className={itemClass}>
                                                    <Settings className="size-4" /> Dashboard Admin
                                                </Link>
                                            )}
                                            <Link href="/saved-plans" role="menuitem" className={itemClass}>
                                                <Heart className="size-4" /> Rencana Tersimpan
                                            </Link>
                                            <Link href={edit()} role="menuitem" className={itemClass}>
                                                <Settings className="size-4" /> Pengaturan Profil
                                            </Link>
                                            <hr className="my-1 border-line/50" />
                                            <button
                                                type="button"
                                                role="menuitem"
                                                onClick={() => router.post('/logout')}
                                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut className="size-4" /> Keluar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href={login()} className="text-sm font-semibold text-ink hover:text-brand">Masuk</Link>
                                <Link href={register()} className="rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white hover:bg-brand-hover">Daftar</Link>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileOpen((o) => !o)}
                        className="rounded-full p-2 text-ink-muted hover:bg-surface-low md:hidden"
                        aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                    </button>
                </nav>

                {mobileOpen && (
                    <div className="border-t border-line/50 bg-white px-5 pb-6 pt-4 md:hidden">
                        <div className="flex flex-col gap-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    aria-current={isActive(link.href) ? 'page' : undefined}
                                    className={`py-1 text-base font-medium ${isActive(link.href) ? 'font-bold text-brand' : 'text-ink-muted hover:text-brand'}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <hr className="my-2 border-line/50" />
                            {auth.user ? (
                                <div className="flex flex-col gap-2">
                                    <Link href="/favorit" className="rounded-full border border-line px-5 py-2.5 text-center text-sm font-semibold text-ink">Favorit</Link>
                                    <Link href="/saved-plans" className="rounded-full border border-line px-5 py-2.5 text-center text-sm font-semibold text-ink">Rencana Tersimpan</Link>
                                    {isAdmin && (
                                        <Link href="/admin/dashboard" className="rounded-full border border-line px-5 py-2.5 text-center text-sm font-semibold text-ink">Dashboard Admin</Link>
                                    )}
                                    <Link href={edit()} className="rounded-full border border-line px-5 py-2.5 text-center text-sm font-semibold text-ink">Pengaturan Profil</Link>
                                    <button type="button" onClick={() => router.post('/logout')} className="rounded-full border border-red-200 px-5 py-2.5 text-center text-sm font-semibold text-red-600">Keluar</button>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <Link href={login()} className="flex-1 rounded-full border border-line px-5 py-2.5 text-center text-sm font-semibold text-ink">Masuk</Link>
                                    <Link href={register()} className="flex-1 rounded-full bg-brand px-5 py-2.5 text-center text-sm font-semibold text-white">Daftar</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>

            <main id="konten">{children}</main>

            <footer className="bg-surface-low">
                <div className="mx-auto max-w-7xl px-5 py-14 md:px-16">
                    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
                        <div>
                            <Link href="/" className="inline-flex items-center gap-2 text-brand">
                                <Trees className="size-6" aria-hidden="true" />
                                <span className="text-lg font-semibold">Jelajah Kubar</span>
                            </Link>
                            <p className="mt-4 max-w-sm leading-relaxed text-ink-muted">
                                Panduan wisata Kutai Barat, Kalimantan Timur: dari air terjun dan danau sampai budaya Dayak.
                            </p>
                        </div>
                        <nav aria-label="Jelajahi">
                            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-copper">Jelajahi</p>
                            <ul className="space-y-3 text-ink-muted">
                                <li><Link href="/wisata" className="hover:text-brand">Destinasi</Link></li>
                                <li><Link href="/favorit" className="hover:text-brand">Favorit</Link></li>
                            </ul>
                        </nav>
                        <nav aria-label="Alat bantu">
                            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-copper">Alat bantu</p>
                            <ul className="space-y-3 text-ink-muted">
                                <li><Link href="/travel-planner" className="hover:text-brand">Perencana Perjalanan</Link></li>
                                <li><Link href="/local-guide" className="hover:text-brand">Pemandu Lokal</Link></li>
                            </ul>
                        </nav>
                    </div>
                    <p className="mt-12 border-t border-line/50 pt-6 text-sm text-ink-muted">© {new Date().getFullYear()} Jelajah Kubar. Temukan jantung Borneo.</p>
                </div>
            </footer>
        </div>
    );
}
