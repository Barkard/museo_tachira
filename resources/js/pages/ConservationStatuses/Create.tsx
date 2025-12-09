import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reportes de Conservación', href: '/conservacion' },
    { title: 'Nuevo Reporte', href: '#' },
];

interface Props {
    pieces: any[];
    users: any[];
}

export default function Create({ pieces, users }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        piece_id: '',
        evaluation_date: new Date().toISOString().split('T')[0],
        status_details: '',
        applied_intervention: '',
        user_id: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('conservacion.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo Reporte" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="max-w-4xl mx-auto w-full bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Registrar Reporte de Conservación</h2>
                    
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Evaluación</label>
                                <input
                                    type="date"
                                    value={data.evaluation_date}
                                    onChange={e => setData('evaluation_date', e.target.value)}
                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.evaluation_date && <div className="text-red-500 text-sm mt-1">{errors.evaluation_date}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Evaluador (Opcional)</label>
                                <select
                                    value={data.user_id}
                                    onChange={e => setData('user_id', e.target.value)}
                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">-- Usuario Actual --</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.first_name} {u.last_name}</option>
                                    ))}
                                </select>
                                {errors.user_id && <div className="text-red-500 text-sm mt-1">{errors.user_id}</div>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Detalles del Estado</label>
                                <textarea
                                    value={data.status_details}
                                    onChange={e => setData('status_details', e.target.value)}
                                    rows={3}
                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Descripción detallada del estado físico de la pieza..."
                                />
                                {errors.status_details && <div className="text-red-500 text-sm mt-1">{errors.status_details}</div>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Intervención Aplicada (Si hubo)</label>
                                <textarea
                                    value={data.applied_intervention}
                                    onChange={e => setData('applied_intervention', e.target.value)}
                                    rows={3}
                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Limpieza, restauración, fumigación..."
                                />
                                {errors.applied_intervention && <div className="text-red-500 text-sm mt-1">{errors.applied_intervention}</div>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                            <Link href={route('conservacion.index')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                Guardar Reporte
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
