import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import React, { FormEventHandler, useState } from 'react';
import { X, Image as ImageIcon, ZoomIn, Plus } from 'lucide-react';
import TutorialGuide, { TutorialStep } from '@/components/TutorialGuide';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Piezas', href: '/piezas' },
    { title: 'Nueva Pieza', href: '/piezas/create' },
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
    // 1. Configuración del formulario
    const { data, setData, post, processing, errors } = useForm({
        registration_number: '',
        piece_name: '',
        classification_id: '',
        description: '',
        author_ethnicity: '',
        height: '',
        width: '',
        depth: '',
        realization_date: '',
        brief_history: '',
        is_research_piece: false,
        photograph_reference: '',
        images: [] as File[],

        // Campos de movimiento y ubicación inicial
        movement_type_id: '',
        agent_id: '',
        transaction_status_id: transactionStatuses.length > 0 ? transactionStatuses[0].id.toString() : '',
        entry_exit_date: new Date().toISOString().split('T')[0],
        location_id: '',
    });

    // 2. Estados visuales
    const [previews, setPreviews] = useState<string[]>([]);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    // 3. Manejo de imágenes
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (data.images.length + files.length > 3) {
            alert('Solo puedes subir un máximo de 3 imágenes.');
            return;
        }

        const newImages = [...data.images, ...files];
        setData('images', newImages);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        const newImages = data.images.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setData('images', newImages);
        setPreviews(newPreviews);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('piezas.store'));
    };

    // <--- 2. Definición de pasos del Tutorial
    const createPieceSteps: TutorialStep[] = [
        {
            element: '#create-piece-header',
            popover: {
                title: 'Registro de Nueva Pieza',
                description: 'Utiliza este formulario para ingresar una obra al inventario del museo.',
                side: 'bottom',
                align: 'start',
            }
        },
        {
            element: '#general-info-section',
            popover: {
                title: 'Información Básica',
                description: 'Ingresa el número de registro único y el nombre oficial de la pieza.',
                side: 'top',
                align: 'start',
            }
        },
        {
            element: '#classification-section',
            popover: {
                title: 'Clasificación',
                description: 'Selecciona la categoría. Si no existe, puedes crear una nueva rápidamente con el botón (+).',
                side: 'right',
                align: 'center',
            }
        },
        {
            element: '#location-entry-section',
            popover: {
                title: 'Ubicación e Ingreso',
                description: 'Define dónde se encontrará la pieza inicialmente y bajo qué términos ingresa (donación, préstamo, etc.).',
                side: 'top',
                align: 'start',
            }
        },
        {
            element: '#dimensions-section',
            popover: {
                title: 'Dimensiones Físicas',
                description: 'Registra las medidas exactas (Alto, Ancho, Profundidad) en centímetros.',
                side: 'top',
                align: 'start',
            }
        },
        {
            element: '#images-section',
            popover: {
                title: 'Galería Fotográfica',
                description: 'Sube hasta 3 fotos de referencia. Puedes hacer clic en ellas para verlas en detalle.',
                side: 'top',
                align: 'center',
            }
        },
        {
            element: '#submit-btn',
            popover: {
                title: 'Guardar Registro',
                description: 'Una vez completado, haz clic aquí para guardar la pieza en la base de datos.',
                side: 'left',
                align: 'center',
            }
        }
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs} header="Nueva Pieza">
            <Head title="Nueva Pieza" />

            <TutorialGuide tutorialKey="pieces-create-v1" steps={createPieceSteps} />

            {/* --- MODAL LIGHTBOX (Zoom) --- */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
                    onClick={() => setLightboxImage(null)}
                >
                    <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
                        <img
                            src={lightboxImage}
                            alt="Detalle"
                            className="max-h-full max-w-full rounded shadow-lg object-contain"
                        />
                        <button
                            className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition"
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxImage(null);
                            }}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="max-w-3xl mx-auto w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                    {/* <--- 4. ID Agregado */}
                    <h2 id="create-piece-header" className="text-2xl font-bold text-gray-800 mb-6">Registrar Nueva Pieza</h2>

                    <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">

                        {/* --- DATOS DE LA PIEZA --- */}
                        <div id="general-info-section" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">No. de Registro *</label>
                                <input
                                    type="text" required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                    placeholder="Ej: REG-2024-001"
                                    value={data.registration_number}
                                    onChange={(e) => setData('registration_number', e.target.value)}
                                />
                                {errors.registration_number && <p className="text-red-500 text-sm mt-1">{errors.registration_number}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Pieza *</label>
                                <input
                                    type="text" required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={data.piece_name}
                                    onChange={(e) => setData('piece_name', e.target.value)}
                                />
                                {errors.piece_name && <p className="text-red-500 text-sm mt-1">{errors.piece_name}</p>}
                            </div>
                        </div>

                        {/* <--- 4. ID Agregado */}
                        <div id="classification-section">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Clasificación *</label>
                            <div className="flex gap-2">
                                <select
                                    required
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={data.classification_id}
                                    onChange={(e) => setData('classification_id', e.target.value)}
                                >
                                    <option value="">Seleccione una clasificación</option>
                                    {classifications.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => router.visit('/clasificaciones/create')}
                                    className="px-3 py-2 border border-gray-300 rounded-md bg-white text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                    title="Nueva Categoría"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            {errors.classification_id && <p className="text-red-500 text-sm mt-1">{errors.classification_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <textarea
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </div>

                        {/* --- SECCIÓN DE UBICACIÓN E INGRESO --- */}
                        <div id="location-entry-section" className="bg-blue-50/50 p-6 rounded-lg border border-blue-100 space-y-6">
                            <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Ubicación e Ingreso Inicial
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación Inicial (Saca/Sala) *</label>
                                    <select
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                        value={data.location_id}
                                        onChange={(e) => setData('location_id', e.target.value)}
                                    >
                                        <option value="">Seleccione ubicación</option>
                                        {locations.map((l) => (
                                            <option key={l.id} value={l.id}>{l.location_name || l.name}</option>
                                        ))}
                                    </select>
                                    {errors.location_id && <p className="text-red-500 text-sm mt-1">{errors.location_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Ingreso *</label>
                                    <select
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                        value={data.movement_type_id}
                                        onChange={(e) => setData('movement_type_id', e.target.value)}
                                    >
                                        <option value="">Seleccione tipo</option>
                                        {movementTypes.map((t) => (
                                            <option key={t.id} value={t.id}>{t.movement_name}</option>
                                        ))}
                                    </select>
                                    {errors.movement_type_id && <p className="text-red-500 text-sm mt-1">{errors.movement_type_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Agente / Entidad Proveniente *</label>
                                    <select
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                        value={data.agent_id}
                                        onChange={(e) => setData('agent_id', e.target.value)}
                                    >
                                        <option value="">Seleccione agente</option>
                                        {agents.map((a) => (
                                            <option key={a.id} value={a.id}>{a.name_legal_entity}</option>
                                        ))}
                                    </select>
                                    {errors.agent_id && <p className="text-red-500 text-sm mt-1">{errors.agent_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso *</label>
                                    <input
                                        type="date" required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={data.entry_exit_date}
                                        onChange={(e) => setData('entry_exit_date', e.target.value)}
                                    />
                                    {errors.entry_exit_date && <p className="text-red-500 text-sm mt-1">{errors.entry_exit_date}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Autor / Etnia</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={data.author_ethnicity}
                                    onChange={(e) => setData('author_ethnicity', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Realización</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={data.realization_date}
                                    onChange={(e) => setData('realization_date', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* --- BLOQUE DE DIMENSIONES (3 Columnas) --- */}
                        {/* <--- 4. ID Agregado */}
                        <div id="dimensions-section">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dimensiones (cm)</label>
                            <div className="grid grid-cols-3 gap-2">
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
                                    type="number" step="0.01" min="0" placeholder="Profundida."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm focus:ring-2 focus:ring-blue-500"
                                    value={data.depth} onChange={(e) => setData('depth', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Breve Historia</label>
                            <textarea
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                rows={2}
                                value={data.brief_history}
                                onChange={(e) => setData('brief_history', e.target.value)}
                            />
                        </div>

                         <div className="flex items-center gap-2">
                            <input
                                type="checkbox" id="is_research_piece"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                checked={data.is_research_piece}
                                onChange={(e) => setData('is_research_piece', e.target.checked)}
                            />
                            <label htmlFor="is_research_piece" className="block text-sm font-medium text-gray-700">¿Es pieza de investigación?</label>
                        </div>

                        {/* --- GALERÍA DE FOTOS--- */}
                        {/* <--- 4. ID Agregado */}
                        <div id="images-section" className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
                            <h3 className="text-md font-semibold text-gray-800 mb-4">Imágenes De La Pieza</h3>
                            <label className="block text-sm text-gray-600 mb-4">
                                Puedes subir hasta 3 fotografías de la pieza. Haz clic en una imagen para agrandarla.
                            </label>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Botón Subir */}
                                {previews.length < 3 && (
                                    <div className="relative flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition hover:border-blue-400 group bg-white">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="flex flex-col items-center group-hover:scale-105 transition-transform">
                                            <ImageIcon className="w-8 h-8 text-gray-400 mb-2 group-hover:text-blue-500" />
                                            <span className="text-sm text-gray-500 font-medium group-hover:text-blue-600">Agregar Foto</span>
                                        </div>
                                    </div>
                                )}

                                {/* Lista de Previsualizaciones */}
                                {previews.map((src, index) => (
                                    <div key={index} className="relative group h-40 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                                        {/* La imagen */}
                                        <img
                                            src={src}
                                            alt={`Foto ${index + 1}`}
                                            className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                                            onClick={() => setLightboxImage(src)}
                                        />

                                        {/* Botón Eliminar */}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 z-20"
                                            title="Eliminar foto"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>

                                        {/* Overlay SÓLO BOTÓN  */}
                                        <div
                                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                        >
                                            <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                                                <ZoomIn className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errors.images && <p className="text-red-500 text-sm mt-2 font-medium">{errors.images}</p>}
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                            <Link href={route('piezas.index')} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition">Cancelar</Link>
                            {/* <--- 4. ID Agregado */}
                            <button
                                id="submit-btn"
                                type="submit" disabled={processing}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium transition shadow-sm"
                            >
                                {processing ? 'Guardando...' : 'Guardar Pieza'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
