import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, SharedData, PaginationLink } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { debounce } from 'lodash';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Historial de Ubicaciones', href: '/historial-ubicaciones' },
];



interface CurrentLocation {
    id: number;
    piece: { piece_name: string; registration_number: string };
    location_category: { name: string };
    user: { first_name: string; last_name: string };
    movement_date: string;
    movement_reason: string;
}

interface Props {
    locations: {
        data: CurrentLocation[];
        links: PaginationLink[];
    };
    filters: {
        search?: string;
    };
}

export default function Index({ locations, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = useMemo(
        () =>
            debounce((query: string) => {
                router.get(
                    route('historial-ubicaciones.index'),
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
        if (confirm('¿Eliminar este registro de ubicación?')) {
            router.delete(route('historial-ubicaciones.destroy', id));
        }
    };

    const { props } = usePage<SharedData>();
    const userRole = props.auth.user.role?.role_name;
    const isEmpleado = userRole === 'Empleado';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Historial Ubicaciones" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Historial de Ubicaciones</h2>
                    {!isEmpleado && (
                        <Link href={route('historial-ubicaciones.create')} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Nuevo Movimiento
                        </Link>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar por pieza o ubicación..."
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
                                    <th className="px-6 py-3">Fecha</th>
                                    <th className="px-6 py-3">Pieza</th>
                                    <th className="px-6 py-3">Ubicación</th>
                                    <th className="px-6 py-3">Motivo</th>
                                    <th className="px-6 py-3">Responsable</th>
                                    {!isEmpleado && <th className="px-6 py-3 text-right">Acciones</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {locations.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{item.movement_date}</td>
                                        <td className="px-6 py-4 font-medium">
                                            {item.piece?.registration_number} - {item.piece?.piece_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.location_category?.name || 'N/A'} {/* Corrected relation access in frontend might need check */}
                                        </td>
                                        <td className="px-6 py-4 truncate max-w-xs">{item.movement_reason}</td>
                                        <td className="px-6 py-4 text-xs text-gray-500">
                                            {item.user?.first_name} {item.user?.last_name}
                                        </td>
                                        {!isEmpleado && (
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <Link href={route('historial-ubicaciones.edit', item.id)} className="text-blue-600"><Pencil className="w-4 h-4" /></Link>
                                                <button onClick={() => handleDelete(item.id)} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {locations.data.length === 0 && (
                                    <tr>
                                        <td colSpan={isEmpleado ? 5 : 6} className="px-6 py-4 text-center text-gray-500">
                                            No se encontraron registros.
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
