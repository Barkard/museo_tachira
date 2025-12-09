
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Agentes',
        href: '/agentes',
    },
];

interface Agent {
    id: number;
    name_legal_entity: string;
    agent_type: string;
    created_at: string;
}

interface Props {
    agents: {
        data: Agent[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function Index({ agents, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = useCallback(
        debounce((query: string) => {
            router.get(
                route('agentes.index'),
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
        if (confirm('¿Estás seguro de querer eliminar este agente?')) {
            router.delete(route('agentes.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Agentes" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Catálogo de Agentes</h2>
                    <Link
                        href={route('agentes.create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo Agente
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                value={search}
                                onChange={onSearchChange}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 font-semibold">Nombre / Entidad Legal</th>
                                    <th className="px-6 py-3 font-semibold">Tipo de Agente</th>
                                    <th className="px-6 py-3 font-semibold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {agents.data.length > 0 ? (
                                    agents.data.map((agent) => (
                                        <tr key={agent.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {agent.name_legal_entity}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">
                                                {agent.agent_type}
                                            </td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <Link
                                                    href={route('agentes.edit', agent.id)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(agent.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                            No se encontraron agentes.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
