import AppSidebarLayout from '@/layouts/app/app-sidebar-layout'; 
import { Head, Link, router, usePage } from '@inertiajs/react';
import { SharedData, PaginationLink } from '@/types';
import React, { useState, useMemo } from 'react';
import { debounce } from 'lodash';
import { Pencil, Trash2, Plus, Search, ArrowRightLeft } from 'lucide-react';
import TutorialGuide, { TutorialStep } from '@/components/TutorialGuide'; // <--- 1. Importación

interface Movement {
    id: number;
    movement_catalog: { movement_name: string };
    agent: { name_legal_entity: string };
    transaction_status: { status: string };
    user: { name: string; first_name?: string; last_name?: string };
    piece: { piece_name: string; registration_number: string } | null;
    entry_exit_date: string;
}

interface Props {
    movements: {
        data: Movement[];
        links: PaginationLink[];
    };
    filters: {
        search?: string;
    };
}

export default function Index({ movements, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = useMemo(
        () =>
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
        if (confirm('¿Estás seguro de querer eliminar este registro de movimiento?')) {
            router.delete(route('movimientos.destroy', id));
        }
    };

    const breadcrumbs = [
        { title: 'Gestión', href: '#' },
        { title: 'Historial de Movimientos', href: route('movimientos.index') },
    ];

    // <--- 2. Definición de pasos del Tutorial
    const movementsSteps: TutorialStep[] = [
        {
            element: '#movements-search',
            popover: {
                title: 'Buscador de Movimientos',
                description: 'Filtra el historial por nombre de pieza o agente involucrado.',
                side: 'bottom',
                align: 'start',
            }
        },
        {
            element: '#create-movement-btn',
            popover: {
                title: 'Registrar Nuevo Movimiento',
                description: 'Registra una entrada, salida, préstamo o donación de una pieza.',
                side: 'left',
                align: 'center',
            }
        },
        {
            element: '#movements-table',
            popover: {
                title: 'Historial Detallado',
                description: 'Consulta la bitácora completa de transacciones. Aquí verás qué pieza se movió, quién la recibió y cuándo.',
                side: 'top',
                align: 'center',
            }
        }
    ];

    const { props } = usePage<SharedData>();
    const userRole = props.auth.user?.role?.role_name;
    const isEmpleado = userRole === 'Empleado';

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs} header="Historial de Movimientos">
            <Head title="Movimientos" />

            {/* <--- 3. Renderizamos el Tutorial */}
            <TutorialGuide tutorialKey="movements-index-v1" steps={movementsSteps} />

            <div className="space-y-6">
                
                {/* BARRA DE HERRAMIENTAS */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* <--- 4. ID Agregado */}
                    <div id="movements-search" className="relative w-full sm:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por pieza o agente..."
                            className="pl-10 block w-full rounded-lg border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            value={search}
                            onChange={onSearchChange}
                        />
                    </div>
                    
                    {!isEmpleado && (
                        /* <--- 4. ID Agregado */
                        <Link
                            id="create-movement-btn"
                            href={route('movimientos.create')}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Registrar Movimiento
                        </Link>
                    )}
                </div>

                {/* TABLA */}
                {/* <--- 4. ID Agregado */}
                <div id="movements-table" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pieza</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Agente / Entidad</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                                    {!isEmpleado && <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {movements.data.length > 0 ? (
                                    movements.data.map((movement) => (
                                        <tr key={movement.id} className="hover:bg-gray-50 transition-colors">
                                            {/* COLUMNA PIEZA */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                                        <ArrowRightLeft className="h-4 w-4" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-gray-900">
                                                            {movement.piece ? movement.piece.piece_name : 'Pieza No Asignada'}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Reg: {movement.piece?.registration_number || '-'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                                    {movement.movement_catalog?.movement_name || 'Desconocido'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{movement.agent?.name_legal_entity || 'N/A'}</div>
                                                <div className="text-xs text-gray-500">Estado: {movement.transaction_status?.status}</div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {movement.entry_exit_date}
                                            </td>

                                            {!isEmpleado && (
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={route('movimientos.edit', movement.id)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors">
                                                            <Pencil className="w-4 h-4" />
                                                        </Link>
                                                        <button onClick={() => handleDelete(movement.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={isEmpleado ? 4 : 5} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <ArrowRightLeft className="w-10 h-10 text-gray-300 mb-2" />
                                                <p>No se encontraron movimientos registrados.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Paginación */}
                    {movements.links && movements.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <span className="text-xs text-gray-500">Mostrando {movements.data.length} registros</span>
                        </div>
                    )}
                </div>
            </div>
        </AppSidebarLayout>
    );
}