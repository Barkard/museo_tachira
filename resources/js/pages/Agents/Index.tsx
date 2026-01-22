import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Trash2, Plus, Search, Building2, User, Phone, Mail } from 'lucide-react';
import { debounce } from 'lodash';

export default function Index({ agents, filters }: any) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = debounce((val) => {
        router.get(route('agentes.index'), { search: val }, { preserveState: true, replace: true });
    }, 300);

    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Agentes', href: route('agentes.index') }]} header="Directorio de Agentes">
            <Head title="Agentes" />

            <div className="space-y-6">
                {/* BUSCADOR Y BOTÓN */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            className="pl-10 w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Buscar institución o persona..."
                            defaultValue={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <Link href={route('agentes.create')} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm">
                        <Plus className="h-4 w-4 mr-2" /> Nuevo Agente
                    </Link>
                </div>

                {/* TARJETAS / LISTA */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agents.data.map((agent: any) => (
                        <div key={agent.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-all group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div className="flex gap-1">
                                    <Link href={route('agentes.edit', agent.id)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-md">
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                    <button 
                                        onClick={() => confirm('¿Eliminar agente?') && router.delete(route('agentes.destroy', agent.id))}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-md"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            
                            <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{agent.name_legal_entity}</h3>
                            
                            <div className="space-y-2 mt-4 text-sm text-gray-600">
                                {agent.representative_name && (
                                    <div className="flex items-center gap-2">
                                        <User className="w-3.5 h-3.5 text-gray-400" />
                                        <span>{agent.representative_name}</span>
                                    </div>
                                )}
                                {agent.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                                        <span>{agent.phone}</span>
                                    </div>
                                )}
                                {agent.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                                        <span className="truncate">{agent.email}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                
                {agents.data.length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                        No se encontraron agentes registrados.
                    </div>
                )}
            </div>
        </AppSidebarLayout>
    );
}