import { PropsWithChildren, ReactNode } from 'react';
import AppSidebar from '@/components/app-sidebar';
import { Bell, ChevronRight, Home } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

interface LayoutProps {
    header?: ReactNode;
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppSidebarLayout({ header, children, breadcrumbs }: LayoutProps) {
    const { auth } = usePage().props as any;

    return (
        <div className="flex h-screen w-full bg-gray-50 font-sans text-sm overflow-hidden">
            
            {/* BARRA LATERAL (FIJA) */}
            <AppSidebar />

            {/* CONTENIDO DERECHO (SCROLLABLE) */}
            <div className="flex-1 flex flex-col h-screen min-w-0">
                
                {/* HEADER */}
                <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20">
                    <h1 className="text-lg font-bold text-gray-800 tracking-tight">{header}</h1>

                    <div className="flex items-center gap-4">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors relative">
                            <Bell className="w-5 h-5" />
                        </button>

                        <div className="h-6 w-px bg-gray-200 mx-1"></div>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block leading-none">
                                <span className="block text-sm font-bold text-gray-700 mb-0.5">
                                    {auth.user.first_name || auth.user.name}
                                </span>
                                <span className="block text-[10px] uppercase tracking-wider text-gray-500 font-medium">
                                    Administrador
                                </span>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm ring-2 ring-white shadow-sm">
                                {auth.user.first_name ? auth.user.first_name.charAt(0) : 'U'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* CONTENIDO PRINCIPAL */}
                <main className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
                    {/* BREADCRUMBS */}
                    {breadcrumbs && breadcrumbs.length > 0 && (
                        <nav className="flex mb-4 text-[11px] text-gray-400 uppercase tracking-wide font-medium">
                            <ol className="inline-flex items-center space-x-1">
                                <li className="inline-flex items-center">
                                    <Link href={route('dashboard')} className="hover:text-blue-600 transition-colors">
                                        <Home className="w-3 h-3" />
                                    </Link>
                                </li>
                                {breadcrumbs.map((item, index) => (
                                    <li key={index} className="flex items-center">
                                        <ChevronRight className="w-3 h-3 mx-1 text-gray-300" />
                                        <Link href={item.href || '#'} className="hover:text-blue-600 transition-colors">
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    )}

                    <div className="max-w-7xl mx-auto pb-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}