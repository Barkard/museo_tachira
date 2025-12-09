
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Agentes',
        href: '/agentes',
    },
    {
        title: 'Nuevo Agente',
        href: '/agentes/create',
    },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name_legal_entity: '',
        agent_type: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('agentes.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo Agente" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="max-w-xl mx-auto w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Registrar Nuevo Agente</h2>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre o Entidad Legal *
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                value={data.name_legal_entity}
                                onChange={(e) => setData('name_legal_entity', e.target.value)}
                            />
                            {errors.name_legal_entity && <p className="text-red-500 text-sm mt-1">{errors.name_legal_entity}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo de Agente *
                            </label>
                            <select
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={data.agent_type}
                                onChange={(e) => setData('agent_type', e.target.value)}
                            >
                                <option value="">Seleccione un tipo</option>
                                <option value="Persona">Persona</option>
                                <option value="Institución">Institución</option>
                                <option value="Organización">Organización</option>
                            </select>
                            {errors.agent_type && <p className="text-red-500 text-sm mt-1">{errors.agent_type}</p>}
                        </div>

                        <div className="flex justify-end gap-3 pt-6">
                            <Link
                                href={route('agentes.index')}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Guardando...' : 'Guardar Agente'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
