
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import axios from 'axios';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    document_id: string;
    phone: string | null;
    birth_date: string | null;
}

interface Props {
    user: User;
}

type UserEditFormFields = 'document_id' | 'first_name' | 'last_name' | 'email' | 'phone' | 'birth_date';

export default function Edit({ user }: Props) {
    const { data, setData, put, processing, errors, setError, clearErrors } = useForm({
        document_id: user.document_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone || '',
        birth_date: user.birth_date || '',
    });

    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [checking, setChecking] = useState<Record<string, boolean>>({});

    const validateField = async (name: UserEditFormFields, value: string) => {
        if (['document_id', 'first_name', 'last_name', 'email'].includes(name)) {
            if (!value || value.trim() === '') {
                setError(name as keyof typeof data, 'Este campo es requerido');
                return;
            } else {
                clearErrors(name as keyof typeof data);
            }
        }

        if ((name === 'document_id' || name === 'email') && value !== user[name as keyof User] && value.length > 3) {
            setChecking(prev => ({ ...prev, [name]: true }));
            try {
                const response = await axios.get(route('usuarios.check-uniqueness'), {
                    params: { 
                        [name]: value,
                        exclude_id: user.id
                    }
                });
                if (response.data.exists) {
                    setError(name as keyof typeof data, response.data.message);
                } else {
                    clearErrors(name as keyof typeof data);
                }
            } catch (error) {
                console.error(`Error checking ${name}`, error);
            } finally {
                setChecking(prev => ({ ...prev, [name]: false }));
            }
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name as UserEditFormFields, value);
    };

    const handleChange = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(name as UserEditFormFields, value);
        if (touched[name]) {
            validateField(name as UserEditFormFields, value);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('usuarios.update', user.id));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Usuarios', href: route('usuarios.index') }, { title: 'Editar', href: '#' }]}>
            <Head title="Editar Usuario" />
            <div className="p-4 max-w-4xl mx-auto">
                <div className="bg-white p-8 rounded-lg shadow border">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Editar Usuario</h2>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Documento / Cédula FIRST */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Documento / Cédula *</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="document_id"
                                        className={`w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none ${errors.document_id ? 'border-red-500' : 'border-gray-300'}`}
                                        value={data.document_id}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {checking.document_id && (
                                        <div className="absolute right-3 top-2.5">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                        </div>
                                    )}
                                </div>
                                {errors.document_id && <p className="text-red-500 text-xs mt-1">{errors.document_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre(s) *</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    className={`w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
                                    value={data.first_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido(s) *</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    className={`w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
                                    value={data.last_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico *</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        className={`w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        value={data.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {checking.email && (
                                        <div className="absolute right-3 top-2.5">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                        </div>
                                    )}
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono (Opcional)</label>
                                <input
                                    type="text"
                                    name="phone"
                                    className={`w-full border rounded-md p-2 border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none`}
                                    value={data.phone}
                                    onChange={handleChange}
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento (Opcional)</label>
                                <input
                                    type="date"
                                    name="birth_date"
                                    className={`w-full border rounded-md p-2 border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none`}
                                    value={data.birth_date}
                                    onChange={handleChange}
                                />
                                {errors.birth_date && <p className="text-red-500 text-xs mt-1">{errors.birth_date}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Link 
                                href={route('usuarios.index')} 
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </Link>
                            <button 
                                type="submit"
                                disabled={processing || checking.document_id || checking.email} 
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Guardando...' : 'Actualizar Usuario'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
