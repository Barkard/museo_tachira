import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Trash2, Plus, Search, Tags } from 'lucide-react';
import { debounce } from 'lodash';

export default function Index({ classifications, filters }: any) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = debounce((value) => {
        router.get(
            route('clasificaciones.index'),
            { search: value },
            { preserveState: true, replace: true }
        );
    }, 300);

    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar esta categoría? Esto podría afectar a las piezas asociadas.')) {
            router.delete(route('clasificaciones.destroy', id));
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Clasificaciones', href: route('clasificaciones.index') }]} header="Clasificación de Piezas">
            <Head title="Clasificaciones" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar categoría..."
                            className="pl-10 w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            defaultValue={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <Link href={route('clasificaciones.create')} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm">
                        <Plus className="h-4 w-4 mr-2" /> Nueva Categoría
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Descripción</th>
                                <th className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {classifications.data.map((item: any) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                                <Tags className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-gray-900">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{item.description || '-'}</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <Link href={route('clasificaciones.edit', item.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {classifications.data.length === 0 && (
                        <div className="p-12 text-center text-gray-500">No hay clasificaciones registradas.</div>
                    )}
                </div>
            </div>
        </AppSidebarLayout>
    );
}