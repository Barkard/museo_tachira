
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
        title: 'Editar Agente',
        href: '#',
    },
];

interface Agent {
    id: number;
    unique_id: number | null;
    name_legal_entity: string;
    agent_type: string;
}

interface Props {
    agent: Agent;
}

export default function Edit({ agent }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        unique_id: agent.unique_id?.toString() || '',
        name_legal_entity: agent.name_legal_entity || '',
        agent_type: agent.agent_type || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('agentes.update', agent.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Agente" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="max-w-xl mx-auto w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Agente</h2>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cédula / ID Único *
                            </label>
                            <input
                                type="number"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                value={data.unique_id}
                                onChange={(e) => setData('unique_id', e.target.value)}
                            />
                            {errors.unique_id && <p className="text-red-500 text-sm mt-1">{errors.unique_id}</p>}
                        </div>

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
                                {processing ? 'Actualizar Agente' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
