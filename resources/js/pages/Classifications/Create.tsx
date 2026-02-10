import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Tags } from 'lucide-react';
import React from 'react';
import TutorialGuide, { TutorialStep } from '@/components/TutorialGuide'; // <--- 1. Importación

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('clasificaciones.store'));
    };

    const inputClasses = "w-full rounded-lg border border-gray-400 bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-purple-500 transition-colors";

    // <--- 2. Definición de pasos del Tutorial
    const createClassificationSteps: TutorialStep[] = [
        {
            element: '#create-classification-header',
            popover: {
                title: 'Nueva Clasificación',
                description: 'Aquí puedes definir una nueva categoría para agrupar tus piezas (ej. "Arqueología", "Documentos", "Arte").',
                side: 'bottom',
                align: 'start',
            }
        },
        {
            element: '#classification-name-input',
            popover: {
                title: 'Nombre de la Categoría',
                description: 'Escribe un nombre corto y descriptivo. Este será el que aparezca en los filtros y etiquetas.',
                side: 'top',
                align: 'start',
            }
        },
        {
            element: '#classification-description-input',
            popover: {
                title: 'Descripción',
                description: 'Opcional: Agrega detalles sobre qué tipo de objetos deben ir en esta categoría.',
                side: 'top',
                align: 'start',
            }
        },
        {
            element: '#submit-classification-btn',
            popover: {
                title: 'Guardar',
                description: 'Confirma la creación para empezar a usar esta categoría en tus piezas.',
                side: 'left',
                align: 'center',
            }
        }
    ];

    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Clasificaciones', href: route('clasificaciones.index') }, { title: 'Nueva', href: '#' }]} header="Nueva Categoría">
            <Head title="Crear Clasificación" />

            {/* <--- 3. Renderizamos el Tutorial */}
            <TutorialGuide tutorialKey="classifications-create-v1" steps={createClassificationSteps} />
            
            <div className="max-w-2xl mx-auto">
                <Link href={route('clasificaciones.index')} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Volver
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    {/* <--- 4. ID Agregado */}
                    <div id="create-classification-header" className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <Tags className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-800">Definir Clasificación</h2>
                            <p className="text-xs text-gray-500">Ej: Arqueología, Arte Colonial, Textiles...</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="p-6 space-y-5">
                        {/* CAMPO NOMBRE */}
                        {/* <--- 4. ID Agregado */}
                        <div id="classification-name-input">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Nombre de la Categoría *
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="Escribe el nombre aquí..."
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                autoFocus
                            />
                            {errors.name && <p className="text-red-600 text-xs mt-1 font-medium">{errors.name}</p>}
                        </div>

                        {/* CAMPO DESCRIPCIÓN */}
                        {/* <--- 4. ID Agregado */}
                        <div id="classification-description-input">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Descripción
                            </label>
                            <textarea
                                rows={4}
                                className={inputClasses}
                                placeholder="Detalles opcionales sobre esta clasificación..."
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                            />
                        </div>

                        {/* BOTONES */}
                        <div className="flex justify-end pt-4 border-t border-gray-100 mt-6">
                            <Link 
                                href={route('clasificaciones.index')}
                                className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </Link>
                            {/* <--- 4. ID Agregado */}
                            <button 
                                id="submit-classification-btn"
                                type="submit"
                                disabled={processing} 
                                className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-bold text-sm shadow-sm transition-all active:scale-95 disabled:opacity-70"
                            >
                                <Save className="w-4 h-4 mr-2" /> 
                                Guardar Categoría
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppSidebarLayout>
    );
}