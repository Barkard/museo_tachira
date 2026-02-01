import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, ListChecks, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface Status {
    id: number;
    status: string;
    description: string;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    statuses: {
        data: Status[];
        links: PaginationLinks[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search: string;
    };
}

export default function Index({ statuses }: Props) {
    // IMPORTANTE: Al usar ->paginate() en Laravel, los datos reales están en .data
    const dataList = statuses.data || [];

    const handleDelete = (id: number) => {
        if (confirm('¿Está seguro de eliminar este estado?')) {
            router.delete(route('estados.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Estados', href: '/estados' }]}>
            <Head title="Categoría de Estados" />
            
            <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-600 mb-2">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <ListChecks className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Configuración de Sistema</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Categoría de Estados</h1>
                        <p className="text-slate-500 font-medium mt-1">
                            Mostrando {statuses.total} registros en total.
                        </p>
                    </div>
                    
                    <Link
                        href={route('estados.create')}
                        className="inline-flex items-center px-6 py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95 group"
                    >
                        <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                        Registrar Nuevo
                    </Link>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">
                                    <th className="px-8 py-5 border-b border-slate-100 w-20">ID</th>
                                    <th className="px-8 py-5 border-b border-slate-100">Estado</th>
                                    <th className="px-8 py-5 border-b border-slate-100">Descripción Detallada</th>
                                    <th className="px-8 py-5 border-b border-slate-100 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {dataList.length > 0 ? (
                                    dataList.map((item) => (
                                        <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6 text-slate-400 font-mono text-xs">#{item.id}</td>
                                            <td className="px-8 py-6">
                                                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-indigo-100">
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-slate-500 font-medium text-sm leading-relaxed max-w-md">
                                                {item.description || <span className="text-slate-300 italic">Sin descripción</span>}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={route('estados.edit', item.id)}
                                                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-32 text-center text-slate-400">
                                            <Activity className="w-10 h-10 mx-auto mb-4 text-slate-200" />
                                            No se encontraron registros.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    {statuses.links.length > 3 && (
                        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center gap-2">
                            {statuses.links.map((link, i) => {
                                const isNextPrev = link.label.includes('Next') || link.label.includes('Previous');
                                return (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`
                                            px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                            ${link.active ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white text-slate-400 border border-slate-200 hover:border-indigo-400 hover:text-indigo-600'}
                                            ${!link.url ? 'opacity-30 cursor-not-allowed' : ''}
                                        `}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}