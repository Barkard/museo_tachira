import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, MapPin, Activity, Users } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
            icon: LayoutGrid,
        },
        {
            title: 'Piezas',
            href: route('piezas.index'),
            icon: BookOpen,
        },
        {
            title: 'Movimientos',
            href: route('movimientos.index'),
            icon: BookOpen,
        },
        {
            title: 'Agentes',
            href: route('agentes.index'),
            icon: BookOpen,
        },
        {
            title: 'Clasificaciones',
            href: route('clasificaciones.index'),
            icon: Folder,
        },
        {
            title: 'Ubicaciones',
            href: route('ubicaciones.index'),
            icon: Folder,
        },
        {
            title: 'Contextos',
            href: route('contextos.index'),
            icon: BookOpen,
        },
        {
            title: 'Historial Ubicaciones',
            href: route('historial-ubicaciones.index'),
            icon: MapPin,
        },
        {
            title: 'Conservación',
            href: route('conservacion.index'),
            icon: Activity,
        },
        {
            title: 'Roles',
            href: route('roles.index'),
            icon: Users,
        },
        {
            title: 'Tipos de Movimiento',
            href: route('tipos-movimiento.index'),
            icon: Folder,
        },
        {
            title: 'Estados',
            href: route('estados.index'),
            icon: Folder,
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('dashboard')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
