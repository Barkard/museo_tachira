import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, MapPin, Save, AlignLeft } from 'lucide-react';
import React from 'react';
import TutorialGuide, { TutorialStep } from '@/components/TutorialGuide'; // <--- 1. Importación

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        location_name: '',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('ubicaciones.store'));
    };

    // <--- 2. Definición de pasos del Tutorial
    const createLocationSteps: TutorialStep[] = [
        {
            element: '#create-location-header',
            popover: {
                title: 'Registrar Nueva Ubicación',
                description: 'Aquí puedes dar de alta un nuevo espacio físico (sala, estante, vitrina) para organizar las piezas.',
                side: 'bottom',
                align: 'start',
            }
        },
        {
            element: '#location-name-input',
            popover: {
                title: 'Nombre del Espacio',
                description: 'Asigna un nombre claro y único. Ejemplos: "Sala de Historia", "Vitrina A-1", "Almacén Central".',
                side: 'right',
                align: 'center',
            }
        },
        {
            element: '#location-description-input',
            popover: {
                title: 'Descripción (Opcional)',
                description: 'Agrega detalles extra sobre dónde se encuentra exactamente este espacio o qué tipo de objetos contendrá.',
                side: 'top',
                align: 'start',
            }
        },
        {
            element: '#submit-location-btn',
            popover: {
                title: 'Guardar Ubicación',
                description: 'Finaliza el registro para que este espacio esté disponible al asignar piezas.',
                side: 'left',
                align: 'center',
            }
        }
    ];

    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Ubicaciones', href: route('ubicaciones.index') }, { title: 'Nueva', href: '#' }]} header="Nueva Ubicación">
            <Head title="Nueva Ubicación" />

            {/* <--- 3. Renderizamos el Tutorial */}
            <TutorialGuide tutorialKey="locations-create-v1" steps={createLocationSteps} />

            <div className="max-w-3xl mx-auto">
                <Link href={route('ubicaciones.index')} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Volver al listado
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* ENCABEZADO */}
                    {/* <--- 4. ID Agregado */}
                    <div id="create-location-header" className="px-6 py-5 border-b border-gray-100 bg-gray-50/80 flex items-center gap-4">
                        <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-sm">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Crear Espacio</h2>
                            <p className="text-sm text-gray-500">Defina un nuevo lugar de almacenamiento o exhibición.</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="p-8 space-y-6">
                        
                        {/* <--- 4. ID Agregado */}
                        <div id="location-name-input">
                            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" /> Nombre del Espacio *
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                                placeholder="Ej: Sala 1, Vitrina B..."
                                value={data.location_name}
                                onChange={e => setData('location_name', e.target.value)}
                                autoFocus
                            />
                            {errors.location_name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.location_name}</p>}
                            <p className="text-xs text-gray-400 mt-1">El nombre debe ser único para evitar confusiones.</p>
                        </div>

                        {/* <--- 4. ID Agregado */}
                        <div id="location-description-input">
                            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <AlignLeft className="w-4 h-4 text-gray-400" /> Descripción
                            </label>
                            <textarea
                                className="w-full rounded-lg border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                                rows={3}
                                placeholder="Detalles adicionales sobre la ubicación..."
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                            />
                        </div>

                        {/* BOTÓN FINAL */}
                        <div className="pt-6 border-t border-gray-100 flex justify-end">
                            {/* <--- 4. ID Agregado */}
                            <button 
                                id="submit-location-btn"
                                disabled={processing} 
                                className="flex items-center bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95"
                            >
                                <Save className="w-4 h-4 mr-2" /> 
                                Guardar Ubicación
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppSidebarLayout>
    );
}