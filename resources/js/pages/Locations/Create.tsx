
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('ubicaciones.store'));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Ubicaciones', href: '/ubicaciones' }, { title: 'Nueva', href: '#' }]}>
            <Head title="Nueva Ubicación" />
            <div className="p-4 max-w-xl mx-auto">
                <div className="bg-white p-8 rounded-lg shadow border">
                    <h2 className="text-2xl font-bold mb-6">Nueva Ubicación</h2>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nombre</label>
                            <input
                                type="text"
                                className="w-full border rounded p-2"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
                            <Link href={route('ubicaciones.index')} className="px-4 py-2 border rounded">Cancelar</Link>
                            <button disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
