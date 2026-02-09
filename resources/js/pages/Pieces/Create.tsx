
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Piezas',
        href: '/piezas',
    },
    {
        title: 'Nueva Pieza',
        href: '/piezas/create',
    },
];

interface Category {
    id: number;
    name: string;
}

interface GenericItem {
    id: number;
    name?: string;
    status?: string;
    movement_name?: string;
    name_legal_entity?: string;
    location_name?: string;
}

interface Props {
    classifications: Category[];
    agents: GenericItem[];
    movementTypes: GenericItem[];
    transactionStatuses: GenericItem[];
    locations: GenericItem[];
}

export default function Create({ 
    classifications, 
    agents, 
    movementTypes, 
    transactionStatuses, 
    locations 
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        piece_name: '',
        registration_number: '',
        classification_id: '',
        description: '',
        author_ethnicity: '',
        dimensions: {
            height: '',
            width: '',
            thickness: '',
        },
        realization_date: '',
        brief_history: '',
        reference_value: '',
        is_research_piece: false,
        photograph_reference: '',
        images: [] as File[],

        // Campos de movimiento y ubicación inicial
        movement_type_id: '',
        agent_id: '',
        transaction_status_id: '',
        entry_exit_date: new Date().toISOString().split('T')[0],
        location_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('piezas.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva Pieza" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="max-w-3xl mx-auto w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Registrar Nueva Pieza</h2>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre de la Pieza *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={data.piece_name}
                                    onChange={(e) => setData('piece_name', e.target.value)}
                                />
                                {errors.piece_name && <p className="text-red-500 text-sm mt-1">{errors.piece_name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    No. de Registro *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={data.registration_number}
                                    onChange={(e) => setData('registration_number', e.target.value)}
                                />
                                {errors.registration_number && <p className="text-red-500 text-sm mt-1">{errors.registration_number}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Clasificación *
                            </label>
                            <select
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={data.classification_id}
                                onChange={(e) => setData('classification_id', e.target.value)}
                            >
                                <option value="">Seleccione una clasificación</option>
                                {classifications.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            {errors.classification_id && <p className="text-red-500 text-sm mt-1">{errors.classification_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descripción
                            </label>
                            <textarea
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Autor / Etnia
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={data.author_ethnicity}
                                    onChange={(e) => setData('author_ethnicity', e.target.value)}
                                />
                                {errors.author_ethnicity && <p className="text-red-500 text-sm mt-1">{errors.author_ethnicity}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Dimensiones (cm)
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Alto"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={data.dimensions.height}
                                            onChange={(e) => setData('dimensions', { ...data.dimensions, height: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Ancho"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={data.dimensions.width}
                                            onChange={(e) => setData('dimensions', { ...data.dimensions, width: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Grosor"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={data.dimensions.thickness}
                                            onChange={(e) => setData('dimensions', { ...data.dimensions, thickness: e.target.value })}
                                        />
                                    </div>
                                </div>
                                {errors.dimensions && <p className="text-red-500 text-sm mt-1">{errors.dimensions}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha de Realización
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={data.realization_date}
                                    onChange={(e) => setData('realization_date', e.target.value)}
                                />
                                {errors.realization_date && <p className="text-red-500 text-sm mt-1">{errors.realization_date}</p>}
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Valor de Referencia
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={data.reference_value}
                                    onChange={(e) => setData('reference_value', e.target.value)}
                                />
                                {errors.reference_value && <p className="text-red-500 text-sm mt-1">{errors.reference_value}</p>}
                            </div>
                        </div>

                        {/* SECCIÓN DE UBICACIÓN E INGRESO (Restaurada) */}
                        <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-100 space-y-6">
                            <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2">Ubicación e Ingreso</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Ingreso/Movimiento *</label>
                                    <select
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                                        value={data.movement_type_id}
                                        onChange={(e) => setData('movement_type_id', e.target.value)}
                                    >
                                        <option value="">Seleccione tipo...</option>
                                        {movementTypes.map((t) => (
                                            <option key={t.id} value={t.id}>{t.movement_name}</option>
                                        ))}
                                    </select>
                                    {errors.movement_type_id && <p className="text-red-500 text-sm mt-1">{errors.movement_type_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Agente / Donante / Entidad *</label>
                                    <select
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                                        value={data.agent_id}
                                        onChange={(e) => setData('agent_id', e.target.value)}
                                    >
                                        <option value="">Seleccione agente...</option>
                                        {agents.map((a) => (
                                            <option key={a.id} value={a.id}>{a.name_legal_entity || a.name}</option>
                                        ))}
                                    </select>
                                    {errors.agent_id && <p className="text-red-500 text-sm mt-1">{errors.agent_id}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado de la Transacción *</label>
                                    <select
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                                        value={data.transaction_status_id}
                                        onChange={(e) => setData('transaction_status_id', e.target.value)}
                                    >
                                        <option value="">Seleccione estado...</option>
                                        {transactionStatuses.map((s) => (
                                            <option key={s.id} value={s.id}>{s.status}</option>
                                        ))}
                                    </select>
                                    {errors.transaction_status_id && <p className="text-red-500 text-sm mt-1">{errors.transaction_status_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso *</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-900"
                                        value={data.entry_exit_date}
                                        onChange={(e) => setData('entry_exit_date', e.target.value)}
                                    />
                                    {errors.entry_exit_date && <p className="text-red-500 text-sm mt-1">{errors.entry_exit_date}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-blue-700 underline decoration-blue-500/30">Ubicación Inicial (Sala / Depósito) *</label>
                                <select
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-gray-900 border-2 border-blue-400/50"
                                    value={data.location_id}
                                    onChange={(e) => setData('location_id', e.target.value)}
                                >
                                    <option value="">Seleccione ubicación...</option>
                                    {locations.map((l) => (
                                        <option key={l.id} value={l.id}>{l.name}</option>
                                    ))}
                                </select>
                                {errors.location_id && <p className="text-red-500 text-sm mt-1">{errors.location_id}</p>}
                            </div>
                        </div>

                        {/* SECCIÓN DE IMÁGENES */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">Imágenes (Máximo 3, JPG/PNG)</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => setData('images', e.target.files ? Array.from(e.target.files) : [])}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                            {data.images.length > 0 && (
                                <div className="text-xs text-gray-400 pt-1">
                                    {data.images.length} archivo(s) seleccionado(s)
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Breve Historia
                            </label>
                            <textarea
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                rows={2}
                                value={data.brief_history}
                                onChange={(e) => setData('brief_history', e.target.value)}
                            />
                             {errors.brief_history && <p className="text-red-500 text-sm mt-1">{errors.brief_history}</p>}
                        </div>

                         <div className="flex items-center gap-2 mt-4">
                            <input
                                type="checkbox"
                                id="is_research_piece"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                checked={data.is_research_piece}
                                onChange={(e) => setData('is_research_piece', e.target.checked)}
                            />
                            <label htmlFor="is_research_piece" className="block text-sm font-medium text-gray-700">
                                ¿Es pieza de investigación?
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-6">
                            <Link
                                href={route('piezas.index')}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Guardando...' : 'Guardar Pieza'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
