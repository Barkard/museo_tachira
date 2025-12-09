import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { debounce } from 'lodash';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Contextos de Piezas', href: '/contextos' },
];

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Piece {
    id: number;
    piece_name: string;
    registration_number: string;
}

interface PieceContext {
    id: number;
    piece_id: number;
    provenance_location: string;
    bibliographic_references: string;
    piece: Piece;
}

interface Props {
    contexts: {
        data: PieceContext[];
        links: PaginationLink[];
    };
    filters: {
        search?: string;
    };
}

export default function Index({ contexts, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = useMemo(
        () =>
            debounce((query: string) => {
                router.get(
                    route('contextos.index'),
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
        if (confirm('¿Eliminar este contexto?')) {
            router.delete(route('contextos.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contextos" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Contextos de Piezas</h2>
                    <Link href={route('contextos.create')} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Nuevo
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar por procedencia o pieza..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                value={search}
                                onChange={onSearchChange}
                            />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow border p-0 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Pieza</th>
                                    <th className="px-6 py-3">No. Registro</th>
                                    <th className="px-6 py-3">Procedencia</th>
                                    <th className="px-6 py-3">Referencias</th>
                                    <th className="px-6 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {contexts.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{item.piece?.piece_name || 'N/A'}</td>
                                        <td className="px-6 py-4 font-mono text-xs">{item.piece?.registration_number || 'N/A'}</td>
                                        <td className="px-6 py-4">{item.provenance_location}</td>
                                        <td className="px-6 py-4 truncate max-w-xs">{item.bibliographic_references}</td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <Link href={route('contextos.edit', item.id)} className="text-blue-600"><Pencil className="w-4 h-4" /></Link>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                                {contexts.data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                            No se encontraron contextos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination could go here if implemented in UI */}
                </div>
            </div>
        </AppLayout>
    );
}
