import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { Save, MoveHorizontal, AlertCircle, ArrowLeft, ChevronDown } from 'lucide-react';

// Opciones predefinidas para los tipos de movimiento
const MOVEMENT_OPTIONS = [
    'Entrada por Adquisición',
    'Entrada por Donación',
    'Salida por Préstamo',
    'Retorno de Préstamo',
    'Traslado Interno (Sede)',
    'Traslado Externo (Exhibición)',
    'Salida por Restauración',
    'Baja de Inventario'
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        movement_name: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tipos-movimiento.store'));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Tipos de Movimiento', href: '/tipos-movimiento' }, { title: 'Nuevo', href: '#' }]}>
            <Head title="Nuevo Tipo de Movimiento" />
            
            <div className="py-12 px-4 bg-slate-50/30 min-h-[calc(100vh-64px)]">
                <div className="max-w-xl mx-auto">
                    
                    <Link 
                        href={route('tipos-movimiento.index')}
                        className="inline-flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Volver al Listado
                    </Link>

                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Header del Formulario */}
                        <div className="px-10 py-8 border-b border-slate-50 bg-slate-50/50">
                            <div className="flex items-center gap-2 text-indigo-600 mb-1">
                                <MoveHorizontal className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Configuración de Flujo</span>
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nuevo Movimiento</h2>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={submit} className="p-10 space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                        Nombre / Categoría del Movimiento
                                    </label>
                                    <div className="relative">
                                        <select
                                            autoFocus
                                            className={`w-full px-5 py-4 rounded-2xl border-2 font-bold transition-all outline-none text-slate-700 appearance-none bg-transparent relative z-10 ${
                                                errors.movement_name 
                                                ? 'border-red-100 bg-red-50 focus:border-red-400' 
                                                : 'border-slate-100 bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50'
                                            }`}
                                            value={data.movement_name}
                                            onChange={e => setData('movement_name', e.target.value)}
                                        >
                                            <option value="" disabled>Seleccione un tipo...</option>
                                            {MOVEMENT_OPTIONS.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none z-20">
                                            <ChevronDown className="w-5 h-5 text-slate-400" />
                                        </div>
                                    </div>
                                    {errors.movement_name && (
                                        <p className="text-xs text-red-500 font-bold flex items-center mt-2 ml-1">
                                            <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                                            {errors.movement_name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                                <button 
                                    disabled={processing} 
                                    className="w-full sm:flex-1 bg-slate-900 hover:bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group"
                                >
                                    <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    {processing ? 'Procesando...' : 'Guardar Tipo'}
                                </button>
                                <Link 
                                    href={route('tipos-movimiento.index')} 
                                    className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 hover:text-slate-600 transition-all text-center"
                                >
                                    Cancelar
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}