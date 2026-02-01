import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { Save, RefreshCw, AlertCircle, ArrowLeft, ChevronDown } from 'lucide-react';

const STATUS_OPTIONS = [
    'En Exhibición',
    'En Depósito',
    'En Restauración',
    'En Préstamo',
    'Baja Permanente',
    'En Tránsito',
    'Pendiente de Catalogación'
];

export default function Edit({ status }: any) {
    const { data, setData, put, processing, errors } = useForm({
        status: status.status,
        description: status.description || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('estados.update', status.id));
    };

    const breadcrumbs = [
        { title: 'Estados', href: '/estados' },
        { title: 'Editar', href: '#' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Estado" />
            
            <div className="py-12 px-4 bg-slate-50/30 min-h-[calc(100vh-64px)]">
                <div className="max-w-xl mx-auto">
                    <Link 
                        href={route('estados.index')}
                        className="inline-flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Regresar al Listado
                    </Link>

                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <div className="px-10 py-8 border-b border-slate-50 bg-slate-50/50">
                            <div className="flex items-center gap-2 text-indigo-600 mb-1">
                                <RefreshCw className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Actualización de Registro</span>
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Editar Estado</h2>
                            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter italic">Registro No. {status.id}</p>
                        </div>

                        <form onSubmit={submit} className="p-10 space-y-8">
                            <div className="space-y-6">
                                {/* Selector de Status */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                        Nombre del Estado
                                    </label>
                                    <div className="relative">
                                        <select
                                            className={`w-full px-5 py-4 rounded-2xl border-2 font-bold transition-all outline-none text-slate-700 appearance-none bg-transparent relative z-10 ${
                                                errors.status 
                                                ? 'border-red-100 bg-red-50 focus:border-red-400' 
                                                : 'border-slate-100 bg-slate-50 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-50'
                                            }`}
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                        >
                                            {STATUS_OPTIONS.map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                            {!STATUS_OPTIONS.includes(status.status) && (
                                                <option value={status.status}>{status.status}</option>
                                            )}
                                        </select>
                                        <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none z-20">
                                            <ChevronDown className="w-5 h-5 text-slate-400" />
                                        </div>
                                    </div>
                                    {errors.status && (
                                        <p className="text-xs text-red-500 font-bold flex items-center mt-2 ml-1">
                                            <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                                            {errors.status}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                        Descripción
                                    </label>
                                    <textarea
                                        rows={4}
                                        className={`w-full px-5 py-4 rounded-2xl border-2 font-medium transition-all outline-none resize-none text-slate-600 ${
                                            errors.description 
                                            ? 'border-red-100 bg-red-50 focus:border-red-400' 
                                            : 'border-slate-100 bg-slate-50 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-50'
                                        }`}
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                                <button 
                                    disabled={processing} 
                                    className="w-full sm:flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group"
                                >
                                    <RefreshCw className={`w-4 h-4 ${processing ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
                                    {processing ? 'Actualizando...' : 'Actualizar Cambios'}
                                </button>
                                <Link 
                                    href={route('estados.index')} 
                                    className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 hover:text-slate-600 transition-all text-center"
                                >
                                    Descartar
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}