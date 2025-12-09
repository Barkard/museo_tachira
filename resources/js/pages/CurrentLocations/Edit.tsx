import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Historial Ubicaciones', href: '/historial-ubicaciones' },
    { title: 'Editar Registro', href: '#' },
];

interface Piece {
    id: number;
    piece_name: string;
    registration_number: string;
}

interface LocationCategory {
    id: number;
    name: string;
}

interface User {
    id: number;
    first_name: string;
    last_name: string;
}

interface CurrentLocation {
    id: number;
    piece_id: number;
    location_id: number;
    user_id: number;
    movement_date: string;
    movement_reason: string;
}

interface Props {
    location: CurrentLocation;
    pieces: Piece[];
    locations: LocationCategory[];
    users: User[];
}

export default function Edit({ location, pieces, locations, users }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        piece_id: location.piece_id.toString(),
        location_id: location.location_id.toString(),
        movement_date: location.movement_date,
        movement_reason: location.movement_reason || '',
        user_id: location.user_id.toString(),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('historial-ubicaciones.update', location.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Ubicación" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="max-w-4xl mx-auto w-full bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Editar Registro de Ubicación</h2>
                    
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pieza</label>
                                <select
                                    value={data.piece_id}
                                    onChange={e => setData('piece_id', e.target.value)}
                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">-- Seleccione una Pieza --</option>
                                    {pieces.map(p => (
                                        <option key={p.id} value={p.id}>{p.registration_number} - {p.piece_name}</option>
                                    ))}
                                </select>
                                {errors.piece_id && <div className="text-red-500 text-sm mt-1">{errors.piece_id}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                                <select
                                    value={data.location_id}
                                    onChange={e => setData('location_id', e.target.value)}
                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">-- Seleccione Ubicación --</option>
                                    {locations.map(l => (
                                        <option key={l.id} value={l.id}>{l.name}</option>
                                    ))}
                                </select>
                                {errors.location_id && <div className="text-red-500 text-sm mt-1">{errors.location_id}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Movimiento</label>
                                <input
                                    type="date"
                                    value={data.movement_date}
                                    onChange={e => setData('movement_date', e.target.value)}
                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.movement_date && <div className="text-red-500 text-sm mt-1">{errors.movement_date}</div>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo del Movimiento</label>
                                <textarea
                                    value={data.movement_reason}
                                    onChange={e => setData('movement_reason', e.target.value)}
                                    rows={3}
                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.movement_reason && <div className="text-red-500 text-sm mt-1">{errors.movement_reason}</div>}
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                                <select
                                    value={data.user_id}
                                    onChange={e => setData('user_id', e.target.value)}
                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.first_name} {u.last_name}</option>
                                    ))}
                                </select>
                                {errors.user_id && <div className="text-red-500 text-sm mt-1">{errors.user_id}</div>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                            <Link href={route('historial-ubicaciones.index')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                Actualizar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
