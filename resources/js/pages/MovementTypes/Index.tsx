import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { debounce } from 'lodash';
import { Pencil, Trash2, Plus, Search, MoveHorizontal, ArrowRightCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tipos de Movimiento', href: '/tipos-movimiento' },
];

interface MovementType {
    id: number;
    movement_name: string;
}

interface Props {
    types: {
        data: MovementType[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function Index({ types, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = useMemo(
        () =>
            debounce((query: string) => {
                router.get(
                    route('tipos-movimiento.index'),
                    { search: query },
                    { preserveState: true, replace: true }
                );
            }, 300),
        []
    );

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        handleSearch(e.target.value);
    };

    const handleDelete = (id: number) => {
        // En un entorno real, usaría un modal personalizado en lugar de confirm
        if (confirm('¿Desea eliminar este tipo de movimiento permanentemente?')) {
            router.delete(route('tipos-movimiento.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tipos de Movimiento" />
            
            <div className="py-12 px-6 bg-slate-50/30 min-h-[calc(100vh-64px)]">
                <div className="max-w-5xl mx-auto space-y-8">
                    
                    {/* Header con Estilo Superior */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-indigo-600 animate-in slide-in-from-left duration-500">
                                <MoveHorizontal className="w-5 h-5" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Logística y Flujo</span>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Tipos de Movimiento</h1>
                            <p className="text-slate-500 font-medium">Gestione las categorías de traslado y cambio de piezas.</p>
                        </div>
                        
                        <Link 
                            href={route('tipos-movimiento.create')} 
                            className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-slate-200 active:scale-95 group"
                        >
                            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                            Nuevo Tipo
                        </Link>
                    </div>

                    {/* Barra de Búsqueda Estilizada */}
                    <div className="relative group max-w-md">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por nombre de movimiento..."
                            className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-[1.5rem] font-bold text-slate-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm"
                            value={search}
                            onChange={onSearchChange}
                        />
                    </div>

                    {/* Tabla con Diseño de Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-8 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Nombre del Movimiento</th>
                                        <th className="px-8 py-6 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {types.data.length > 0 ? (
                                        types.data.map((item) => (
                                            <tr key={item.id} className="group hover:bg-slate-50/80 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                                            <ArrowRightCircle className="w-5 h-5" />
                                                        </div>
                                                        <span className="font-bold text-slate-700 text-lg tracking-tight">{item.movement_name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Link 
                                                            href={route('tipos-movimiento.edit', item.id)} 
                                                            className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 rounded-xl transition-all hover:shadow-lg active:scale-90"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Link>
                                                        <button 
                                                            onClick={() => handleDelete(item.id)} 
                                                            className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-100 rounded-xl transition-all hover:shadow-lg active:scale-90"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={2} className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                                No se encontraron resultados
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}