import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';
import { 
    User, Mail, Lock, Save, CheckCircle, 
    BadgeCheck, Settings, Calendar
} from 'lucide-react';

interface Props {
    user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        birth_date: string;
    };
}

const EditProfile = ({ user }: Props) => {
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        birth_date: user.birth_date || '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50 min-h-[calc(100vh-64px)]">
                <div className="max-w-4xl mx-auto">
                    {/* Encabezado */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-blue-600 rounded-lg shadow-blue-200 shadow-lg">
                            <Settings className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Ajustes de Cuenta</h1>
                            <p className="text-slate-500 text-sm">Administra tu información personal y seguridad del sistema.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Columna Izquierda: Info Resumen */}
                        <div className="md:col-span-1">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                                <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-md">
                                    <User className="w-12 h-12 text-slate-400" />
                                </div>
                                <h2 className="font-bold text-slate-800 text-lg">
                                    {user.first_name} {user.last_name}
                                </h2>
                                <p className="text-slate-500 text-sm mb-4 italic">
                                    {user.email}
                                </p>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    Administrador
                                </span>
                            </div>
                        </div>

                        {/* Columna Derecha: Formulario */}
                        <div className="md:col-span-2">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                        <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm">
                                            <BadgeCheck className="w-4 h-4 text-blue-500" />
                                            Información del Perfil
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Nombres</label>
                                                <input
                                                    type="text"
                                                    value={data.first_name}
                                                    onChange={(e) => setData('first_name', e.target.value)}
                                                    className="w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all text-sm"
                                                />
                                                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Apellidos</label>
                                                <input
                                                    type="text"
                                                    value={data.last_name}
                                                    onChange={(e) => setData('last_name', e.target.value)}
                                                    className="w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all text-sm"
                                                />
                                                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Fecha de Nacimiento</label>
                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        value={data.birth_date}
                                                        onChange={(e) => setData('birth_date', e.target.value)}
                                                        className="w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all text-sm pl-10"
                                                    />
                                                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                </div>
                                                {errors.birth_date && <p className="text-red-500 text-xs mt-1">{errors.birth_date}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Correo Electrónico</label>
                                                <div className="relative">
                                                    <input
                                                        type="email"
                                                        value={data.email}
                                                        onChange={(e) => setData('email', e.target.value)}
                                                        className="w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all text-sm pl-10"
                                                    />
                                                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                </div>
                                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                        <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm">
                                            <Lock className="w-4 h-4 text-blue-500" />
                                            Seguridad
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Nueva Clave</label>
                                                <input
                                                    type="password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    className="w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all text-sm"
                                                    placeholder="Dejar en blanco para mantener"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Confirmar Clave</label>
                                                <input
                                                    type="password"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    className="w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all text-sm"
                                                />
                                            </div>
                                        </div>
                                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-4">
                                    {recentlySuccessful && (
                                        <span className="text-green-600 font-bold text-xs flex items-center gap-1 italic animate-bounce">
                                            <CheckCircle className="w-4 h-4" /> ¡Perfil Actualizado!
                                        </span>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all disabled:opacity-50 shadow-lg flex items-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        {processing ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default EditProfile;