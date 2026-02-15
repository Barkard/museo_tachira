
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { FormEventHandler, useState } from 'react';
import axios from 'axios';

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
}

interface Props {
    piece: Piece;
    classifications: Category[];
}

type PieceEditFormFields = 'registration_number' | 'piece_name' | 'classification_id' | 'description' | 'author_ethnicity' | 'height' | 'width' | 'depth' | 'realization_date' | 'brief_history' | 'is_research_piece' | 'photograph_reference';

export default function Edit({ piece, classifications }: Props) {
    const { data, setData, put, processing, errors, setError, clearErrors } = useForm({
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
    });

    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [checking, setChecking] = useState<Record<string, boolean>>({});

    const validateField = async (name: PieceEditFormFields, value: string) => {
        // Validación de requeridos
        const requiredFields = [
            'registration_number', 
            'piece_name', 
            'classification_id'
        ];

        if (requiredFields.includes(name)) {
            if (!value || value.toString().trim() === '') {
                setError(name as keyof typeof data, 'Este campo es requerido');
                return;
            } else {
                clearErrors(name as keyof typeof data);
            }
        }

        // Validación de unicidad para registration_number
        if (name === 'registration_number' && value.trim() !== '' && value !== piece.registration_number) {
            setChecking(prev => ({ ...prev, [name]: true }));
            try {
                const response = await axios.get(route('piezas.check-uniqueness'), {
                    params: { field: name, value, exclude_id: piece.id }
                });

                if (response.data && !response.data.valid) {
                    setError(name as keyof typeof data, response.data.error);
                } else {
                    clearErrors(name as keyof typeof data);
                }
            } catch (e) {
                console.error('Error validating field:', e);
            } finally {
                setChecking(prev => ({ ...prev, [name]: false }));
            }
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name as PieceEditFormFields, value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        
        setData(name as PieceEditFormFields, finalValue as any);
        
        if (touched[name]) {
            validateField(name as PieceEditFormFields, value);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('piezas.update', piece.id));
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
                                    name="piece_name"
                                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${errors.piece_name ? 'border-red-500' : 'border-gray-300'}`}
                                    value={data.piece_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.piece_name && <p className="text-red-500 text-sm mt-1">{errors.piece_name}</p>}

                                {/* Bloque de dimensiones */}
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    <input
                                        type="number" step="0.01" min="0" placeholder="Alto"
                                        name="height"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm focus:ring-2 focus:ring-blue-500"
                                        value={data.height} onChange={handleChange}
                                    />
                                    <input
                                        type="number" step="0.01" min="0" placeholder="Ancho"
                                        name="width"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm focus:ring-2 focus:ring-blue-500"
                                        value={data.width} onChange={handleChange}
                                    />
                                    <input
                                        type="number" step="0.01" min="0" placeholder="Prof."
                                        name="depth"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm focus:ring-2 focus:ring-blue-500"
                                        value={data.depth} onChange={handleChange}
                                    />
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        name="registration_number"
                                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none mt-2 font-bold ${errors.registration_number ? 'border-red-500' : 'border-gray-300'}`}
                                        value={data.registration_number}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {checking.registration_number && (
                                        <div className="absolute right-3 top-4">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                        </div>
                                    )}
                                </div>
                                {errors.registration_number && <p className="text-red-500 text-sm mt-1">{errors.registration_number}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Clasificación *
                            </label>
                            <select
                                required
                                name="classification_id"
                                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white ${errors.classification_id ? 'border-red-500' : 'border-gray-300'}`}
                                value={data.classification_id}
                                onChange={handleChange}
                                onBlur={handleBlur}
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
                                name="description"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                rows={3}
                                value={data.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
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
                                    name="author_ethnicity"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={data.author_ethnicity}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.author_ethnicity && <p className="text-red-500 text-sm mt-1">{errors.author_ethnicity}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dimensiones (cm)</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <input
                                        type="number" step="0.01" placeholder="Alto"
                                        name="dimensions.height"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={data.dimensions?.height}
                                        onChange={handleChange}
                                    />
                                    <input
                                        type="number" step="0.01" placeholder="Ancho"
                                        name="dimensions.width"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={data.dimensions?.width}
                                        onChange={handleChange}
                                    />
                                    <input
                                        type="number" step="0.01" placeholder="Grosor"
                                        name="dimensions.thickness"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={data.dimensions?.thickness}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha de Realización
                                </label>
                                <input
                                    type="date"
                                    name="realization_date"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={data.realization_date}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
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
                                name="brief_history"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                rows={2}
                                value={data.brief_history}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                             {errors.brief_history && <p className="text-red-500 text-sm mt-1">{errors.brief_history}</p>}
                        </div>

                         <div className="flex items-center gap-2 mt-4">
                            <input
                                type="checkbox"
                                id="is_research_piece"
                                name="is_research_piece"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                checked={data.is_research_piece}
                                onChange={handleChange}
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
                                {processing ? 'Actualizar Pieza' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
