import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, Package, MapPin, ChevronDown, ChevronRight, Settings, LogOut 
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AppSidebar() {
    const { url } = usePage();

    const navigation = [
        {
            group: 'Principal',
            items: [
                { name: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard, current: url.startsWith('/dashboard') },
            ]
        },
        {
            group: 'Colección',
            items: [
                {
                    name: 'Piezas',
                    icon: Package,
                    current: url.startsWith('/piezas'), 
                    subItems: [
                        { name: 'Catálogo', href: route('piezas.index') },
                        { name: 'Registrar', href: route('piezas.create') },
                    ]
                },
                {
                    name: 'Ubicaciones',
                    icon: MapPin,
                    current: url.startsWith('/ubicaciones'),
                    subItems: [
                        { name: 'Ver Lista', href: route('ubicaciones.index') },
                        { name: 'Crear Zona', href: route('ubicaciones.create') },
                    ]
                }
            ]
        },
        {
            group: 'Sistema',
            items: [
                { name: 'Ajustes', href: '#', icon: Settings, current: false },
            ]
        }
    ];

    return (
        <aside className="w-60 bg-slate-900 text-white flex flex-col h-screen border-r border-slate-800 shrink-0 transition-all duration-300 z-30">
            {/* LOGO */}
            <div className="h-14 flex items-center px-5 border-b border-slate-800 bg-slate-950">
                <span className="font-bold text-base tracking-tight text-white flex gap-1">
                    MUSEO<span className="text-blue-500">TACHIRA</span>
                </span>
            </div>

            {/* MENÚ */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
                {navigation.map((section, index) => (
                    <div key={index}>
                        <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                            {section.group}
                        </h3>
                        <div className="space-y-0.5">
                            {section.items.map((item) => (
                                <NavItem key={item.name} item={item} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* FOOTER */}
            <div className="p-3 border-t border-slate-800 bg-slate-950">
                <Link 
                    href={route('logout')} 
                    method="post" 
                    as="button" 
                    className="flex items-center w-full px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-md transition-all"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Salir
                </Link>
            </div>
        </aside>
    );
}

function NavItem({ item }: { item: any }) {
    const [isOpen, setIsOpen] = useState(item.current);

    useEffect(() => { if (item.current) setIsOpen(true); }, [item.current]);

    const hasSubItems = item.subItems && item.subItems.length > 0;
    const baseClasses = "flex items-center w-full px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 group";

    if (hasSubItems) {
        return (
            <div>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className={`${baseClasses} justify-between ${item.current ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                >
                    <div className="flex items-center gap-2">
                        <item.icon className={`w-4 h-4 ${item.current ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                        {item.name}
                    </div>
                    {isOpen ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-600" />}
                </button>
                {isOpen && (
                    <div className="mt-1 ml-4 pl-3 border-l border-slate-700/50 space-y-0.5">
                        {item.subItems.map((sub: any) => (
                            <Link key={sub.name} href={sub.href} className={`block px-3 py-1.5 text-xs rounded-md transition-colors ${window.location.href === sub.href ? "text-blue-400 bg-blue-500/10 font-semibold" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}>
                                {sub.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    }
    return (
        <Link href={item.href} className={`${baseClasses} ${item.current ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" : "text-slate-400 hover:text-white hover:bg-slate-800/50"}`}>
            <item.icon className={`w-4 h-4 mr-2 ${item.current ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
            {item.name}
        </Link>
    );
}