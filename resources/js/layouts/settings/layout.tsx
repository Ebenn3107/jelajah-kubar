import { Link, usePage } from '@inertiajs/react';
import { Palette, ShieldCheck, User } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { PageHeader } from '@/components/page-header';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { Auth, NavItem } from '@/types';

const sidebarNavItems: (NavItem & { admin?: boolean })[] = [
    { title: 'Profil', href: edit(), icon: User },
    { title: 'Keamanan', href: editSecurity(), icon: ShieldCheck },
    // Situs publik selalu terang; pilihan tema hanya berlaku di panel admin
    { title: 'Tampilan', href: editAppearance(), icon: Palette, admin: true },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const { auth } = usePage<{ auth: Auth }>().props;
    const items = sidebarNavItems.filter((item) => !item.admin || auth.user?.is_admin);

    return (
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 md:px-16 md:pt-12">
            <PageHeader
                eyebrow="Akun"
                title="Pengaturan"
                description="Kelola profil dan keamanan akun Anda."
            />

            <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                <nav
                    className="flex gap-2 overflow-x-auto lg:w-56 lg:shrink-0 lg:flex-col"
                    aria-label="Pengaturan"
                >
                    {items.map((item) => {
                        const active = isCurrentOrParentUrl(item.href);

                        return (
                            <Link
                                key={toUrl(item.href)}
                                href={item.href}
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    'flex items-center gap-3 rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-brand',
                                    active
                                        ? 'bg-brand text-white'
                                        : 'text-ink-muted hover:bg-surface-low hover:text-brand',
                                )}
                            >
                                {item.icon && <item.icon className="size-4" aria-hidden="true" />}
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                <div className="min-w-0 flex-1 lg:max-w-2xl">
                    <section className="space-y-8">{children}</section>
                </div>
            </div>
        </div>
    );
}
