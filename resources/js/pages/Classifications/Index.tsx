import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { SharedData, PaginationLink } from '@/types';
import { useState, ChangeEvent, useMemo } from 'react';
import { Pencil, Trash2, Plus, Search, Tags, FolderOpen } from 'lucide-react';
import { debounce } from 'lodash';
import TutorialGuide, { TutorialStep } from '@/components/TutorialGuide'; // <--- 1. Importación

interface Classification {
    id: number;
    name: string;
    description: string | null;
    pieces_count?: number; // Opcional: si tu backend envía el conteo de piezas
}

interface PaginatedClassifications {
    data: Classification[];
    links: PaginationLink[];
}

interface IndexProps {
    classifications: PaginatedClassifications;
    filters: {
        search?: string;
    };
}

export default function Index({ classifications, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = useMemo(
        () =>
            debounce((value: string) => {
                router.get(
                    route('clasificaciones.index'),
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
        if (confirm('¿Estás seguro de eliminar esta categoría? Las piezas asociadas podrían quedar sin clasificación.')) {
            router.delete(route('clasificaciones.destroy', id));
        }
    };

    const breadcrumbs = [
        { title: 'Gestión de Colección', href: '#' },
        { title: 'Clasificaciones', href: route('clasificaciones.index') },
    ];

    // <--- 2. Definición de pasos del Tutorial
    const classificationSteps: TutorialStep[] = [
        {
            element: '#classifications-search',
            popover: {
                title: 'Buscador de Categorías',
                description: 'Filtra las clasificaciones por nombre (ej. "Arqueología", "Etnografía").',
                side: 'bottom',
                align: 'start',
            }
        },
        {
            element: '#create-classification-btn',
            popover: {
                title: 'Nueva Categoría',
                description: 'Crea un nuevo grupo para organizar las piezas del museo.',
                side: 'left',
                align: 'center',
            }
        },
        {
            element: '#classifications-table',
            popover: {
                title: 'Listado de Categorías',
                description: 'Aquí ves todas las categorías existentes. Puedes editarlas o eliminarlas si no tienen piezas importantes asociadas.',
                side: 'top',
                align: 'center',
            }
        }
    ];

    const { props } = usePage<SharedData>();
    const userRole = props.auth.user?.role?.role_name;
    const isEmpleado = userRole === 'Empleado';

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs} header="Clasificaciones">
            <Head title="Clasificaciones" />

            {/* <--- 3. Renderizamos el Tutorial */}
            <TutorialGuide tutorialKey="classifications-index-v1" steps={classificationSteps} />

            <div className="space-y-6">

                {/* BARRA DE HERRAMIENTAS */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* <--- 4. ID Agregado */}
                    <div id="classifications-search" className="relative w-full sm:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar categoría..."
                            className="pl-10 block w-full rounded-lg border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            value={search}
                            onChange={onSearchChange}
                        />
                    </div>

                    {!isEmpleado && (
                        /* <--- 4. ID Agregado */
                        <Link
                            id="create-classification-btn"
                            href={route('clasificaciones.create')}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Categoría
                        </Link>
                    )}
                </div>

                {/* TABLA */}
                {/* <--- 4. ID Agregado */}
                <div id="classifications-table" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {classifications.data.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                <Tags className="w-8 h-8 text-blue-300" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No hay categorías registradas</h3>
                            <p className="mt-1 text-gray-500 text-sm">Comienza creando la primera categoría para organizar tu colección.</p>
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
                                    {classifications.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                                                        <FolderOpen className="h-4 w-4" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-500 max-w-lg truncate">{item.description || '-'}</div>
                                            </td>
                                            {!isEmpleado && (
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-3">
                                                        <Link href={route('clasificaciones.edit', item.id)} className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1.5 rounded-md hover:bg-blue-100 transition-colors">
                                                            <Pencil className="w-4 h-4" />
                                                        </Link>
                                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-md hover:bg-red-100 transition-colors">
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

                    {classifications.links && classifications.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <span className="text-xs text-gray-500">Mostrando {classifications.data.length} registros</span>
                        </div>
                    )}
                </div>
            </div>
        </AppSidebarLayout>
    );
}