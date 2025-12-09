
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { debounce } from 'lodash';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Clasificaciones', href: '/clasificaciones' },
];

interface Classification {
    id: number;
    name: string;
    description: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    classifications: {
        data: Classification[];
        links: PaginationLink[];
    };
    filters: {
        search?: string;
    };
}

export default function Index({ classifications, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = useMemo(
        () =>
            debounce((query: string) => {
                router.get(
                    route('clasificaciones.index'),
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
        if (confirm('¿Eliminar esta clasificación?')) {
            router.delete(route('clasificaciones.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clasificaciones" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Clasificaciones</h2>
                    <Link href={route('clasificaciones.create')} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Nueva
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar clasificación..."
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
                                <th className="px-6 py-3">Nombre</th>
                                <th className="px-6 py-3">Descripción</th>
                                <th className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {classifications.data.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{item.name}</td>
                                    <td className="px-6 py-4">{item.description}</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <Link href={route('clasificaciones.edit', item.id)} className="text-blue-600"><Pencil className="w-4 h-4" /></Link>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
        </AppLayout>
    );
}
