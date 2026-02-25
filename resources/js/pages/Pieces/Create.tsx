import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { FormEventHandler, useState } from 'react';
import axios from 'axios';
import { X, Image as ImageIcon, ZoomIn, Plus } from 'lucide-react';
import ClassificationModal from '@/components/ClassificationModal';
import LocationModal from '@/components/LocationModal';
import MovementTypeModal from '@/components/MovementTypeModal';
import AgentModal from '@/components/AgentModal';
import TutorialGuide, { TutorialStep } from '@/components/TutorialGuide';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Piezas', href: '/piezas' },
    { title: 'Nueva Pieza', href: '/piezas/create' },
];

interface PieceFormData {
    registration_number: string;
    piece_name: string;
    classification_id: string;
    description: string;
    author_ethnicity: string;
    height: string;
    width: string;
    depth: string;
    realization_date: string;
    brief_history: string;
    is_research_piece: boolean;
    photograph_reference: string;
    images: File[];
    movement_type_id: string;
    agent_id: string;
    transaction_status_id: string;
    entry_exit_date: string;
    location_id: string;
}

type PieceCreateFormFields = keyof PieceFormData;

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
    // Auto-select "Completado" status if available
    const defaultStatus = transactionStatuses.find(s =>
        (s.status || s.name || '').toLowerCase().includes('complet') ||
        (s.status || s.name || '').toLowerCase().includes('final')
    ) || (transactionStatuses.length > 0 ? transactionStatuses[0] : null);

    // 1. Configuración del formulario
    const { data, setData, post, processing, errors, setError, clearErrors } = useForm<PieceFormData>({
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
        images: [],

        movement_type_id: '',
        agent_id: '',
        transaction_status_id: defaultStatus ? defaultStatus.id.toString() : '',
        entry_exit_date: new Date().toISOString().split('T')[0],
        location_id: '',
    });

    const [previews, setPreviews] = useState<string[]>([]);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [checking, setChecking] = useState<Record<string, boolean>>({});
    const [isClassificationModalOpen, setIsClassificationModalOpen] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isMovementTypeModalOpen, setIsMovementTypeModalOpen] = useState(false);
    const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);



    const [localClassifications, setLocalClassifications] = useState<Category[]>(classifications);
    const [localLocations, setLocalLocations] = useState<GenericItem[]>(locations);
    const [localMovementTypes, setLocalMovementTypes] = useState<GenericItem[]>(movementTypes);
    const [localAgents, setLocalAgents] = useState<GenericItem[]>(agents);

    const validateField = async (name: PieceCreateFormFields, value: string) => {
        // Validación de requeridos
        const requiredFields = [
            'registration_number',
            'piece_name',
            'classification_id',
            'location_id',
            'movement_type_id',
            'agent_id',
            'transaction_status_id',
            'entry_exit_date'
        ];

        if (requiredFields.includes(name)) {
            if (!value || value.toString().trim() === '') {
                setError(name as keyof typeof data, 'Este campo es obligatorio');
                return;
            } else {
                clearErrors(name as keyof typeof data);
            }
        }

        // Validación de unicidad para registration_number
        if (name === 'registration_number' && value.trim() !== '') {
            setChecking(prev => ({ ...prev, [name]: true }));
            try {
                const response = await axios.get(route('piezas.check-uniqueness'), {
                    params: { field: name, value }
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
        validateField(name as PieceCreateFormFields, value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        if (name !== 'images') {
             setData(name as Exclude<keyof PieceFormData, 'images'>, finalValue as string | boolean);
        }

        if (touched[name]) {
            validateField(name as keyof PieceFormData, value);
        }
    };

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
        const newImages = data.images.filter((_: File, i: number) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setData('images', newImages);
        setPreviews(newPreviews);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('piezas.store'));
    };

    const handleClassificationCreated = (newClassification: Category) => {
        setLocalClassifications(prev => [...prev, newClassification]);
        setData('classification_id', newClassification.id.toString());
    };

    const handleLocationCreated = (newLocation: GenericItem) => {
        setLocalLocations(prev => [...prev, newLocation]);
        setData('location_id', newLocation.id.toString());
    };

    const handleMovementTypeCreated = (newType: GenericItem) => {
        setLocalMovementTypes(prev => [...prev, newType]);
        setData('movement_type_id', newType.id.toString());
    };

    const handleAgentCreated = (newAgent: GenericItem) => {
        setLocalAgents(prev => [...prev, newAgent]);
        setData('agent_id', newAgent.id.toString());
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
                description: 'Ingresa el nombre oficial y el número de registro único de la pieza.',
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
                description: 'Define dónde se guardará la pieza inicialmente y cómo ingresó al museo.',
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

            <ClassificationModal
                isOpen={isClassificationModalOpen}
                onClose={() => setIsClassificationModalOpen(false)}
                onSuccess={handleClassificationCreated}
            />

            <LocationModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                onSuccess={handleLocationCreated}
            />

            <MovementTypeModal
                isOpen={isMovementTypeModalOpen}
                onClose={() => setIsMovementTypeModalOpen(false)}
                onSuccess={handleMovementTypeCreated}
            />

            <AgentModal
                isOpen={isAgentModalOpen}
                onClose={() => setIsAgentModalOpen(false)}
                onSuccess={handleAgentCreated}
            />


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
                {/* Global Errors Alert */}
                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <X className="h-5 w-5 text-red-500 cursor-pointer" onClick={() => clearErrors()} />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Hay errores en el formulario</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <ul className="list-disc pl-5 space-y-1">
                                        {Object.entries(errors).map(([key, error]) => (
                                            <li key={key}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="max-w-3xl mx-auto w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                    {/* <--- 4. ID Agregado */}
                    <h2 id="create-piece-header" className="text-2xl font-bold text-gray-800 mb-6">Registrar Nueva Pieza</h2>

                    <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">

                        {/* --- DATOS DE LA PIEZA --- */}
                        <div id="general-info-section" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">No. de Registro *</label>
                                <input
                                    type="text" required
                                    name="registration_number"
                                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none font-bold ${errors.registration_number ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Ej: REG-2024-001"
                                    value={data.registration_number}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {checking.registration_number && (
                                    <div className="absolute right-3 top-9">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                    </div>
                                )}
                                {errors.registration_number && <p className="text-red-500 text-sm mt-1">{errors.registration_number}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Pieza *</label>
                                <input
                                    type="text" required
                                    name="piece_name"
                                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${errors.piece_name ? 'border-red-500' : 'border-gray-300'}`}
                                    value={data.piece_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
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
                                    name="classification_id"
                                    className={`flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white ${errors.classification_id ? 'border-red-500' : 'border-gray-300'}`}
                                    value={data.classification_id}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                >
                                    <option value="">Seleccione una clasificación</option>
                                    {localClassifications.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setIsClassificationModalOpen(true)}
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
                                name="description"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                rows={3}
                                value={data.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
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
                                    <div className="flex gap-2">
                                        <select
                                            required
                                            name="location_id"
                                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white ${errors.location_id ? 'border-red-500' : 'border-gray-300'}`}
                                            value={data.location_id}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        >
                                            <option value="">Seleccione ubicación</option>
                                            {localLocations.map((l) => (
                                                <option key={l.id} value={l.id}>{l.location_name || l.name}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setIsLocationModalOpen(true)}
                                            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                            title="Nueva Ubicación"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                    {errors.location_id && <p className="text-red-500 text-sm mt-1">{errors.location_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Ingreso *</label>
                                    <div className="flex gap-2">
                                        <select
                                            required
                                            name="movement_type_id"
                                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white ${errors.movement_type_id ? 'border-red-500' : 'border-gray-300'}`}
                                            value={data.movement_type_id}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        >
                                            <option value="">Seleccione tipo</option>
                                            {localMovementTypes.filter(t =>
                                                // Mostrar solo Donación y Expedición si existen (búsqueda parcial), o todo si estamos en modo debug/inicial
                                                ['donación', 'donacion', 'expedición', 'expedicion'].some(term => (t.movement_name || '').toLowerCase().includes(term)) ||
                                                // Si el usuario acaba de crear uno nuevo que no sea de estos, lo mostramos también para no confundir
                                                data.movement_type_id === t.id.toString()
                                            ).length > 0 ? (
                                                localMovementTypes.filter(t =>
                                                    ['donación', 'donacion', 'expedición', 'expedicion'].some(term => (t.movement_name || '').toLowerCase().includes(term)) ||
                                                    data.movement_type_id === t.id.toString()
                                                ).map((t) => (
                                                    <option key={t.id} value={t.id}>{t.movement_name}</option>
                                                ))
                                            ) : (
                                                // Si no existen los tipos estándar, mostramos todos (fallback)
                                                localMovementTypes.map((t) => (
                                                    <option key={t.id} value={t.id}>{t.movement_name}</option>
                                                ))
                                            )}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setIsMovementTypeModalOpen(true)}
                                            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                            title="Nuevo Tipo de Movimiento"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                    {errors.movement_type_id && <p className="text-red-500 text-sm mt-1">{errors.movement_type_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Agente / Entidad Proveniente *</label>
                                    <div className="flex gap-2">
                                        <select
                                            required
                                            name="agent_id"
                                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white ${errors.agent_id ? 'border-red-500' : 'border-gray-300'}`}
                                            value={data.agent_id}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        >
                                            <option value="">Seleccione agente</option>
                                            {localAgents.map((a) => (
                                                <option key={a.id} value={a.id}>{a.name_legal_entity || a.name}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setIsAgentModalOpen(true)}
                                            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                            title="Nuevo Agente"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                    {errors.agent_id && <p className="text-red-500 text-sm mt-1">{errors.agent_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso *</label>
                                    <input
                                        type="date" required
                                        name="entry_exit_date"
                                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${errors.entry_exit_date ? 'border-red-500' : 'border-gray-300'}`}
                                        value={data.entry_exit_date}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.entry_exit_date && <p className="text-red-500 text-sm mt-1">{errors.entry_exit_date}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado del Trámite *</label>
                                    <select
                                        required
                                        name="transaction_status_id"
                                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white ${errors.transaction_status_id ? 'border-red-500' : 'border-gray-300'}`}
                                        value={data.transaction_status_id}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        <option value="">Seleccione estado</option>
                                        {transactionStatuses.map((s) => (
                                            <option key={s.id} value={s.id}>{s.status || s.name}</option>
                                        ))}
                                    </select>
                                    {errors.transaction_status_id && <p className="text-red-500 text-sm mt-1">{errors.transaction_status_id}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Autor / Etnia</label>
                                <input
                                    type="text"
                                    name="author_ethnicity"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={data.author_ethnicity}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Realización</label>
                                <input
                                    type="date"
                                    name="realization_date"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={data.realization_date}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
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
                                    name="height"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm focus:ring-2 focus:ring-blue-500"
                                    value={data.height}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <input
                                    type="number" step="0.01" min="0" placeholder="Ancho"
                                    name="width"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm focus:ring-2 focus:ring-blue-500"
                                    value={data.width}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <input
                                    type="number" step="0.01" min="0" placeholder="Profundida."
                                    name="depth"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm focus:ring-2 focus:ring-blue-500"
                                    value={data.depth}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Breve Historia</label>
                            <textarea
                                name="brief_history"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                rows={2}
                                value={data.brief_history}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </div>

                         <div className="flex items-center gap-2">
                            <input
                                type="checkbox" id="is_research_piece"
                                name="is_research_piece"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                checked={data.is_research_piece}
                                onChange={handleChange}
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
