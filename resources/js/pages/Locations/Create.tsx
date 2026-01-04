import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { ArrowLeft, Save, MapPin } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('ubicaciones.store'));
    };

    const breadcrumbs = [
        { title: 'Ubicaciones', href: route('ubicaciones.index') },
        { title: 'Nueva', href: '#' },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs} header="Nueva Ubicación">
            <Head title="Nueva Ubicación" />
            
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link href={route('ubicaciones.index')} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Volver al listado
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Registrar Nuevo Espacio</h2>
                            <p className="text-xs text-gray-500">Define una nueva ubicación física para almacenar piezas.</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="p-6 space-y-6">
                        
                        {/* NOMBRE */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Nombre de la Ubicación <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className={`w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm ${errors.name ? 'border-red-300' : ''}`}
                                placeholder="Ej: Sala de Exhibición 1, Depósito B..."
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* DESCRIPCIÓN */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Descripción (Opcional)
                            </label>
                            <textarea
                                rows={4}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                                placeholder="Detalles adicionales sobre este espacio..."
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                            />
                        </div>

                        {/* BOTONES */}
                        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                            <Link href={route('ubicaciones.index')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                Cancelar
                            </Link>
                            <button type="submit" disabled={processing} className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 transition-colors disabled:opacity-25">
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