
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

interface Location {
    id: number;
    location_name: string;
    description: string | null;
}

interface EditProps {
    location: Location;
}

export default function Edit({ location }: EditProps) {
    const { data, setData, put, processing, errors } = useForm<{
        location_name: string;
        description: string;
    }>({
        location_name: location.location_name,
        description: location.description || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('ubicaciones.update', location.id));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Ubicaciones', href: '/ubicaciones' }, { title: 'Editar', href: '#' }]}>
            <Head title="Editar Ubicación" />
            <div className="p-4 max-w-xl mx-auto">
                <div className="bg-white p-8 rounded-lg shadow border">
                    <h2 className="text-2xl font-bold mb-6">Editar Ubicación</h2>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nombre</label>
                            <input
                                type="text"
                                className="w-full border rounded p-2"
                                value={data.location_name}
                                onChange={e => setData('location_name', e.target.value)}
                            />
                            {errors.location_name && <p className="text-red-500 text-sm">{errors.location_name}</p>}
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
                            <button disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded">Actualizar</button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
