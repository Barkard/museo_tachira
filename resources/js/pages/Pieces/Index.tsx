
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react'; // Import router instead of Inertia
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Piezas',
        href: '/piezas',
    },
];

interface Piece {
    id: number;
    piece_name: string;
    registration_number: string;
    classification_id: number;
    classification?: {
        name: string;
    };
    created_at: string;
}

interface Props {
    pieces: {
        data: Piece[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search?: string;
    };
}

export default function Index({ pieces, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    // Debounce search to avoid too many requests
    const handleSearch = useCallback(
        debounce((query: string) => {
            router.get(
                route('piezas.index'),
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
        if (confirm('¿Estás seguro de querer eliminar esta pieza?')) {
            router.delete(route('piezas.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Piezas" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Inventario de Piezas</h2>
                    <Link
                        href={route('piezas.create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva Pieza
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o número de registro..."
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
                                    <th className="px-6 py-3 font-semibold">No. Registro</th>
                                    <th className="px-6 py-3 font-semibold">Nombre</th>
                                    <th className="px-6 py-3 font-semibold">Clasificación</th>
                                    <th className="px-6 py-3 font-semibold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pieces.data.length > 0 ? (
                                    pieces.data.map((piece) => (
                                        <tr key={piece.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {piece.registration_number}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">
                                                {piece.piece_name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {piece.classification?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <Link
                                                    href={route('piezas.edit', piece.id)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(piece.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            No se encontraron piezas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {pieces.links.length > 3 && (
                        <div className="p-4 border-t border-gray-200 flex justify-center">
                            <div className="flex gap-1">
                                {pieces.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 rounded-md text-sm ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                ? 'text-gray-600 hover:bg-gray-100'
                                                : 'text-gray-400 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
