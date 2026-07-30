import { Link, usePage } from '@inertiajs/react';
import { Activity, BookOpen, Bot, ClipboardList, Compass, FolderGit2, FolderTree, Heart, ImageIcon, LayoutDashboard, MapPin, Route, Sofa } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { Auth, NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Jelajahi Wisata',
        href: '/wisata',
        icon: Compass,
    },
    {
        title: 'Favorit',
        href: '/favorit',
        icon: Heart,
    },
    {
        title: 'Travel Planner',
        href: '/travel-planner',
        icon: Route,
    },
    {
        title: 'My Plans',
        href: '/saved-plans',
        icon: ClipboardList,
    },
    {
        title: 'Local Guide',
        href: '/local-guide',
        icon: Bot,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Wisata',
        href: '/admin/wisata',
        icon: MapPin,
    },
    {
        title: 'Kategori',
        href: '/admin/kategori',
        icon: FolderTree,
    },
    {
        title: 'Galeri',
        href: '/admin/galeri',
        icon: ImageIcon,
    },
    {
        title: 'Fasilitas',
        href: '/admin/fasilitas',
        icon: Sofa,
    },
    {
        title: 'AI Logs',
        href: '/admin/ai-logs',
        icon: Activity,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const { isCurrentUrl } = useCurrentUrl();
    const isAdmin = !!(auth.user as Record<string, unknown>)?.is_admin;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/wisata" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />

                {isAdmin && (
                    <SidebarGroup className="px-2 py-0">
                        <SidebarGroupLabel>Admin</SidebarGroupLabel>
                        <SidebarMenu>
                            {adminNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isCurrentUrl(item.href)}
                                        tooltip={{ children: item.title }}
                                    >
                                        <Link href={item.href} prefetch>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
