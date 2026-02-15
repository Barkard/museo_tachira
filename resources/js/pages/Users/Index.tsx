
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, SharedData, PaginationLink } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { debounce } from 'lodash';
import { Pencil, Trash2, Plus, Search, User as UserIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usuarios', href: '/usuarios' },
];

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    document_id: string;
    phone: string | null;
    role: {
        id: number;
        role_name: string;
    };
}

interface Props {
    users: {
        data: User[];
        links: PaginationLink[];
    };
    filters: {
        search?: string;
    };
}

export default function Index({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = useMemo(
        () =>
            debounce((query: string) => {
                router.get(
                    route('usuarios.index'),
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
        if (confirm('¿Eliminar este usuario?')) {
            router.delete(route('usuarios.destroy', id));
        }
    };

    const { props } = usePage<SharedData>();
    const userRole = props.auth.user?.role?.role_name;
    const isEmpleado = userRole === 'Empleado';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
                    {!isEmpleado && (
                        <Link href={route('usuarios.create')} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Nuevo Usuario
                        </Link>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, correo o cédula..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                value={search}
                                onChange={onSearchChange}
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Usuario</th>
                                    <th className="px-6 py-3">Documento / Cédula</th>
                                    <th className="px-6 py-3">Rol</th>
                                    <th className="px-6 py-3">Teléfono</th>
                                    {!isEmpleado && <th className="px-6 py-3 text-right">Acciones</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <UserIcon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.first_name} {user.last_name}</div>
                                                    <div className="text-gray-500 text-xs">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{user.document_id}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold">
                                                {user.role?.role_name || 'Sin rol'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{user.phone || '-'}</td>
                                        {!isEmpleado && (
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <Link href={route('usuarios.edit', user.id)} className="text-blue-600 p-1 hover:bg-blue-50 rounded transition-colors">
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button onClick={() => handleDelete(user.id)} className="text-red-600 p-1 hover:bg-red-50 rounded transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {users.links.length > 3 && (
                        <div className="p-4 border-t bg-gray-50 flex justify-center">
                            <div className="flex gap-1">
                                {users.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 text-sm rounded ${link.active ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
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
