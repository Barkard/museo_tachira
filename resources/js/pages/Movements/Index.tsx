
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Movimientos',
        href: '/movimientos',
    },
];

interface Movement {
    id: number;
    movement_catalog: { movement_name: string };
    agent: { name_legal_entity: string };
    transaction_status: { status: string };
    user: { name: string };
    entry_exit_date: string;
}

interface Props {
    movements: {
        data: Movement[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function Index({ movements, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = useCallback(
        debounce((query: string) => {
            router.get(
                route('movimientos.index'),
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
        if (confirm('¿Estás seguro de querer eliminar este movimiento?')) {
            router.delete(route('movimientos.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Movimientos" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Registro de Movimientos</h2>
                    <Link
                        href={route('movimientos.create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo Movimiento
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar por agente..."
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
                                    <th className="px-6 py-3 font-semibold">Tipo de Movimiento</th>
                                    <th className="px-6 py-3 font-semibold">Agente</th>
                                    <th className="px-6 py-3 font-semibold">Estado</th>
                                    <th className="px-6 py-3 font-semibold">Fecha</th>
                                    <th className="px-6 py-3 font-semibold">Usuario</th>
                                    <th className="px-6 py-3 font-semibold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {movements.data.length > 0 ? (
                                    movements.data.map((movement) => (
                                        <tr key={movement.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {movement.movement_catalog?.movement_name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">
                                                {movement.agent?.name_legal_entity || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                                    {movement.transaction_status?.status || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {movement.entry_exit_date}
                                            </td>
                                             <td className="px-6 py-4 text-gray-600 text-xs">
                                                {movement.user?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <Link
                                                    href={route('movimientos.edit', movement.id)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(movement.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            No se encontraron movimientos.
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
