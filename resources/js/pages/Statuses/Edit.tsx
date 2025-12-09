
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

export default function Edit({ status }: any) {
    const { data, setData, put, processing, errors } = useForm({
        status: status.status,
        description: status.description || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('estados.update', status.id));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Estados', href: '/estados' }, { title: 'Editar', href: '#' }]}>
            <Head title="Editar Estado" />
            <div className="p-4 max-w-xl mx-auto">
                <div className="bg-white p-8 rounded-lg shadow border">
                    <h2 className="text-2xl font-bold mb-6">Editar Estado</h2>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Estado</label>
                            <input
                                type="text"
                                className="w-full border rounded p-2"
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                            />
                            {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Descripción</label>
                            <textarea
                                className="w-full border rounded p-2"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Link href={route('estados.index')} className="px-4 py-2 border rounded">Cancelar</Link>
                            <button disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded">Actualizar</button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
