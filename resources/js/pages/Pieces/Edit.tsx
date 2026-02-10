
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
        title: 'Editar Pieza',
        href: '#',
    },
];

interface Category {
    id: number;
    name: string;
}

interface PieceImage {
    id: number;
    path: string;
}

interface Piece {
    id: number;
    piece_name: string;
    registration_number: string;
    classification_id: number;
    description?: string;
    author_ethnicity?: string;
    dimensions?: {
        height?: string;
        width?: string;
        thickness?: string;
    } | null;
        height?: string;
        width?: string;
        depth?: string;
    realization_date?: string;
    brief_history?: string;
    reference_value?: number;
    is_research_piece: boolean;
    photograph_reference?: string;
    images?: PieceImage[];
}

interface Props {
    piece: Piece;
    classifications: Category[];
}

export default function Edit({ piece, classifications }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        piece_name: piece.piece_name || '',
        registration_number: piece.registration_number || '',
        classification_id: piece.classification_id.toString(),
        description: piece.description || '',
        author_ethnicity: piece.author_ethnicity || '',
        dimensions: {
            height: piece.dimensions?.height || '',
            width: piece.dimensions?.width || '',
            thickness: piece.dimensions?.thickness || '',
        },
            height: piece.height || '',
            width: piece.width || '',
            depth: piece.depth || '',
        realization_date: piece.realization_date || '',
        brief_history: piece.brief_history || '',
        reference_value: piece.reference_value || '',
        is_research_piece: Boolean(piece.is_research_piece),
        photograph_reference: piece.photograph_reference || '',
        images: [] as File[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('piezas.update', piece.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Pieza" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="max-w-3xl mx-auto w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Pieza</h2>

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
                                {/* Bloque de dimensiones */}
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    <input 
                                        type="number" step="0.01" min="0" placeholder="Alto"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm focus:ring-2 focus:ring-blue-500"
                                        value={data.height} onChange={(e) => setData('height', e.target.value)}
                                    />
                                    <input 
                                        type="number" step="0.01" min="0" placeholder="Ancho"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm focus:ring-2 focus:ring-blue-500"
                                        value={data.width} onChange={(e) => setData('width', e.target.value)}
                                    />
                                    <input 
                                        type="number" step="0.01" min="0" placeholder="Prof."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm focus:ring-2 focus:ring-blue-500"
                                        value={data.depth} onChange={(e) => setData('depth', e.target.value)}
                                    />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none mt-2"
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
                            </div>
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

                        {/* SECCIÓN DE IMÁGENES */}
                        <div className="space-y-6 pt-4">
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Galería de Imágenes</h3>
                            
                            {/* Imágenes Existentes */}
                            {piece.images && piece.images.length > 0 && (
                                <div className="grid grid-cols-3 gap-4">
                                    {piece.images.map((img) => (
                                        <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                                            <img src={img.path} alt="Pieza" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Subir Nuevas */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Añadir Nuevas Imágenes (Máximo 3 totales)</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => setData('images', e.target.files ? Array.from(e.target.files) : [])}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                                {data.images.length > 0 && (
                                    <div className="text-xs text-gray-400">
                                        {data.images.length} archivo(s) seleccionado(s)
                                    </div>
                                )}
                            </div>
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
                                {processing ? 'Actualizar Pieza' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
