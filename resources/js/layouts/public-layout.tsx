import { Link, router, usePage } from '@inertiajs/react';
import { Heart, LogOut, Menu, Settings, Trees, User as UserIcon, X } from 'lucide-react';
import { useState } from 'react';
import { login, register } from '@/routes';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';

interface PublicLayoutProps {
    children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const page = usePage<{ auth: Auth }>();
    const { auth } = page.props;
    const currentUrl: string = page.url as string;
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/wisata', label: 'Destinations' },
        { href: '/travel-planner', label: 'Travel Planner' },
        { href: '/local-guide', label: 'Local Guide' },
    ];

    const isActive = (href: string): boolean => {
        if (href === '/') return currentUrl === '/';
        return currentUrl.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-[#f8f9ff]">
            <header className="sticky top-0 z-50 w-full bg-[#f8f9ff]/95 backdrop-blur-md">
                <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-16">
                    <Link href="/" className="flex items-center gap-2">
                        <Trees className="size-7 text-[#00685f]" />
                        <span className="text-xl font-semibold tracking-tight text-[#00685f]">Jelajah Kubar</span>
                    </Link>

                    <div className="hidden items-center gap-8 md:flex">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href}
                                className={`text-sm transition-colors hover:text-[#00685f] ${
                                    isActive(link.href) ? 'border-b-2 border-[#00685f] pb-1 font-bold text-[#00685f]' : 'text-zinc-600'
                                }`}>
                                {link.label}
                            </Link>
                        ))}

                        {auth.user ? (
                            <div className="flex items-center gap-3">
                                <Link href="/favorit" className="text-zinc-600 hover:text-[#00685f]" aria-label="Wishlist"><Heart className="size-5" /></Link>

                                <div className="relative group">
                                    <button className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-[#00685f]/30 hover:text-[#00685f]">
                                        <UserIcon className="size-4" />
                                        <span className="hidden lg:inline">{auth.user.name}</span>
                                    </button>
                                    <div className="invisible absolute right-0 top-full z-50 mt-2 w-48 origin-top-right scale-95 rounded-xl border border-zinc-200 bg-white py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:scale-100 group-hover:opacity-100">
                                        {auth.user.is_admin && (
                                            <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-teal-50 hover:text-[#00685f]">
                                                <Settings className="size-4" /> Admin Dashboard
                                            </Link>
                                        )}
                                        <Link href={edit()} className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-teal-50 hover:text-[#00685f]">
                                            <Settings className="size-4" /> Profile Settings
                                        </Link>
                                        <hr className="my-1 border-zinc-100" />
                                        <button onClick={() => router.post('/logout')} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                                            <LogOut className="size-4" /> Log out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href={login()} className="text-sm font-semibold text-zinc-700 hover:text-[#00685f]">Log in</Link>
                                <Link href={register()} className="rounded-full bg-[#00685f] px-6 py-2 text-sm font-semibold text-white hover:opacity-90">Register</Link>
                            </div>
                        )}
                    </div>

                    <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-zinc-600 md:hidden" aria-label="Menu">
                        {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                    </button>
                </nav>

                {mobileOpen && (
                    <div className="border-t border-zinc-200 bg-white px-5 pb-6 pt-4 md:hidden">
                        <div className="flex flex-col gap-3">
                            {navLinks.map((link) => (
                                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                                    className={`text-sm font-medium ${isActive(link.href) ? 'text-[#00685f] font-bold' : 'text-zinc-700 hover:text-[#00685f]'}`}>
                                    {link.label}
                                </Link>
                            ))}
                            <hr className="my-2 border-zinc-200" />
                            {auth.user ? (
                                <div className="flex flex-col gap-2">
                                    <Link href={edit()} onClick={() => setMobileOpen(false)} className="rounded-full border border-zinc-300 px-5 py-2.5 text-center text-sm font-semibold text-zinc-700">Profile Settings</Link>
                                    <button onClick={() => { setMobileOpen(false); router.post('/logout'); }} className="rounded-full border border-red-200 px-5 py-2.5 text-center text-sm font-semibold text-red-600">Log out</button>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <Link href={login()} className="flex-1 rounded-full border border-zinc-300 px-5 py-2.5 text-center text-sm font-semibold text-zinc-700">Log in</Link>
                                    <Link href={register()} className="flex-1 rounded-full bg-[#00685f] px-5 py-2.5 text-center text-sm font-semibold text-white">Register</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>

            <main>{children}</main>

            <footer className="border-t border-zinc-200 bg-white py-12">
                <div className="mx-auto max-w-7xl px-5 md:px-16">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-2">
                            <Trees className="size-6 text-[#00685f]" />
                            <span className="text-lg font-semibold text-[#00685f]">Jelajah Kubar</span>
                        </div>
                        <div className="flex gap-6 text-sm text-zinc-500">
                            <Link href="/wisata" className="hover:text-[#00685f]">Destinations</Link>
                            <Link href="/travel-planner" className="hover:text-[#00685f]">Travel Planner</Link>
                            <Link href="/local-guide" className="hover:text-[#00685f]">Local Guide</Link>
                        </div>
                        <p className="text-sm text-zinc-400">© 2026 Jelajah Kubar. Discover the Heart of Borneo.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
