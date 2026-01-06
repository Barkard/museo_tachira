import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Tags } from 'lucide-react';
import React from 'react';

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

    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Clasificaciones', href: route('clasificaciones.index') }, { title: 'Nueva', href: '#' }]} header="Nueva Categoría">
            <Head title="Crear Clasificación" />
            
            <div className="max-w-2xl mx-auto">
                <Link href={route('clasificaciones.index')} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Volver
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
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
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Nombre de la Categoría *
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="Escribe el nombre aquí..."
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-red-600 text-xs mt-1 font-medium">{errors.name}</p>}
                        </div>

                        {/* CAMPO DESCRIPCIÓN */}
                        <div>
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
                            <button 
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