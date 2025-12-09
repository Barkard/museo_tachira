
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Movimientos',
        href: '/movimientos',
    },
    {
        title: 'Nuevo Movimiento',
        href: '/movimientos/create',
    },
];

interface Catalog {
    id: number;
    movement_name?: string;
    status?: string;
}

interface Agent {
    id: number;
    name_legal_entity: string;
}

interface Props {
    movementTypes: Catalog[];
    agents: Agent[];
    statuses: Catalog[];
}

export default function Create({ movementTypes, agents, statuses }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        movement_type_id: '',
        agent_id: '',
        transaction_status_id: '',
        entry_exit_date: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('movimientos.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo Movimiento" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="max-w-2xl mx-auto w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Registrar Movimiento</h2>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de Movimiento *
                                </label>
                                <select
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={data.movement_type_id}
                                    onChange={(e) => setData('movement_type_id', e.target.value)}
                                >
                                    <option value="">Seleccione tipo</option>
                                    {movementTypes.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.movement_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.movement_type_id && <p className="text-red-500 text-sm mt-1">{errors.movement_type_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha *
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={data.entry_exit_date}
                                    onChange={(e) => setData('entry_exit_date', e.target.value)}
                                />
                                {errors.entry_exit_date && <p className="text-red-500 text-sm mt-1">{errors.entry_exit_date}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Agente (Físico/Moral) *
                            </label>
                            <select
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={data.agent_id}
                                onChange={(e) => setData('agent_id', e.target.value)}
                            >
                                <option value="">Seleccione agente</option>
                                {agents.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.name_legal_entity}
                                    </option>
                                ))}
                            </select>
                            {errors.agent_id && <p className="text-red-500 text-sm mt-1">{errors.agent_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estado de la Transacción *
                            </label>
                            <select
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={data.transaction_status_id}
                                onChange={(e) => setData('transaction_status_id', e.target.value)}
                            >
                                <option value="">Seleccione estado</option>
                                {statuses.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.status}
                                    </option>
                                ))}
                            </select>
                            {errors.transaction_status_id && <p className="text-red-500 text-sm mt-1">{errors.transaction_status_id}</p>}
                        </div>

                        <div className="flex justify-end gap-3 pt-6">
                            <Link
                                href={route('movimientos.index')}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Guardando...' : 'Guardar Movimiento'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
