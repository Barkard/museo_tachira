
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        <h2 className="text-2xl font-bold mb-4">Bienvenido al Museo</h2>
                        <p className="text-lg mb-6">Hola, {auth.user.first_name} {auth.user.last_name}!</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                                <h3 className="font-semibold text-lg text-blue-800 mb-2">Colecciones</h3>
                                <p className="text-blue-600">Gestione las piezas del museo.</p>
                            </div>
                            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                                <h3 className="font-semibold text-lg text-green-800 mb-2">Movimientos</h3>
                                <p className="text-green-600">Registre entradas y salidas.</p>
                            </div>
                            <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                                <h3 className="font-semibold text-lg text-purple-800 mb-2">Reportes</h3>
                                <p className="text-purple-600">Ver estadísticas y estados.</p>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                            >
                                Cerrar Sesión
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
