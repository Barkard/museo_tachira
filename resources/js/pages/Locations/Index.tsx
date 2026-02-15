import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { SharedData, PaginationLink } from '@/types';
import { useState, ChangeEvent, useMemo } from 'react';
import { Pencil, Trash2, Plus, Search, MapPin } from 'lucide-react';
import { debounce } from 'lodash';
import TutorialGuide, { TutorialStep } from '@/components/TutorialGuide'; 

interface Location {
    id: number;
    location_name: string;
    description: string | null;
}

interface PaginatedLocations {
    data: Location[];
    links: PaginationLink[];
}

interface IndexProps {
    locations: PaginatedLocations;
    filters: {
        search?: string;
    };
}

export default function Index({ locations, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = useMemo(
        () =>
            debounce((value: string) => {
                router.get(
                    route('ubicaciones.index'),
                    { search: value },
                    { preserveState: true, replace: true }
                );
            }, 300),
        []
    );

    const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        handleSearch(e.target.value);
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar esta ubicación?')) {
            router.delete(route('ubicaciones.destroy', id));
        }
    };

    const breadcrumbs = [
        { title: 'Gestión de Colección', href: '#' },
        { title: 'Ubicaciones', href: route('ubicaciones.index') },
    ];

    // <--- 2. Definición de pasos del Tutorial
    const locationsSteps: TutorialStep[] = [
        {
            element: '#locations-search',
            popover: {
                title: 'Buscador de Ubicaciones',
                description: 'Encuentra rápidamente una sala, estante o vitrina específica por su nombre.',
                side: 'bottom',
                align: 'start',
            }
        },
        {
            element: '#create-location-btn',
            popover: {
                title: 'Nueva Ubicación',
                description: 'Registra un nuevo espacio físico donde se pueden almacenar piezas (Ej. "Sala 1", "Vitrina A").',
                side: 'left',
                align: 'center',
            }
        },
        {
            element: '#locations-table',
            popover: {
                title: 'Listado de Espacios',
                description: 'Aquí puedes ver y gestionar todas las zonas registradas en el museo.',
                side: 'top',
                align: 'center',
            }
        }
    ];

    const { props } = usePage<SharedData>();
    const userRole = props.auth.user?.role?.role_name;
    const isEmpleado = userRole === 'Empleado';

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs} header="Ubicaciones del Museo">
            <Head title="Ubicaciones" />

            <TutorialGuide tutorialKey="locations-index-v1" steps={locationsSteps} />

            <div className="space-y-6">

                {/* BARRA DE HERRAMIENTAS */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* <--- 4. ID Agregado */}
                    <div id="locations-search" className="relative w-full sm:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar sala, estante..."
                            className="pl-10 block w-full rounded-lg border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            value={search}
                            onChange={onSearchChange}
                        />
                    </div>

                    {!isEmpleado && (
                        /* <--- 4. ID Agregado */
                        <Link
                            id="create-location-btn"
                            href={route('ubicaciones.create')}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Ubicación
                        </Link>
                    )}
                </div>

                {/* TABLA DE RESULTADOS */}
                {/* <--- 4. ID Agregado */}
                <div id="locations-table" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {locations.data.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <MapPin className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No se encontraron ubicaciones</h3>
                            <p className="mt-1 text-gray-500 text-sm">Prueba con otra búsqueda o crea una nueva ubicación.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Descripción</th>
                                        {!isEmpleado && <th className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {locations.data.map((loc: Location) => (
                                        <tr key={loc.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                                        <MapPin className="h-4 w-4" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{loc.location_name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-500 max-w-xs truncate">{loc.description || '-'}</div>
                                            </td>
                                            {!isEmpleado && (
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-3">
                                                        <Link href={route('ubicaciones.edit', loc.id)} className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1.5 rounded-md hover:bg-blue-100 transition-colors">
                                                            <Pencil className="w-4 h-4" />
                                                        </Link>
                                                        <button onClick={() => handleDelete(loc.id)} className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-md hover:bg-red-100 transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Paginación simple */}
                    {locations.links && locations.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <span className="text-xs text-gray-500">Mostrando {locations.data.length} resultados</span>
                        </div>
                    )}
                </div>
            </div>
        </AppSidebarLayout>
    );
}