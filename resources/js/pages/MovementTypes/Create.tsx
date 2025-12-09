
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        movement_name: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tipos-movimiento.store'));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Tipos de Movimiento', href: '/tipos-movimiento' }, { title: 'Nuevo', href: '#' }]}>
            <Head title="Nuevo Tipo de Movimiento" />
            <div className="p-4 max-w-xl mx-auto">
                <div className="bg-white p-8 rounded-lg shadow border">
                    <h2 className="text-2xl font-bold mb-6">Nuevo Tipo de Movimiento</h2>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nombre del Movimiento</label>
                            <input
                                type="text"
                                className="w-full border rounded p-2"
                                value={data.movement_name}
                                onChange={e => setData('movement_name', e.target.value)}
                            />
                            {errors.movement_name && <p className="text-red-500 text-sm">{errors.movement_name}</p>}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Link href={route('tipos-movimiento.index')} className="px-4 py-2 border rounded">Cancelar</Link>
                            <button disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
