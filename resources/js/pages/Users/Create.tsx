import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import axios from 'axios';
import TutorialGuide, { TutorialStep } from '@/components/TutorialGuide';

type UserFormFields = 'document_id' | 'first_name' | 'last_name' | 'email' | 'phone' | 'birth_date';

export default function Create() {
    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        document_id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        birth_date: '',
    });

    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [checking, setChecking] = useState<Record<string, boolean>>({});

    const validateField = async (name: UserFormFields, value: string) => {
        if (!value || value.trim() === '') {
            setError(name, 'Este campo es requerido');
            return;
        } 
        
        clearErrors(name);

        if ((name === 'document_id' || name === 'email') && value.length > 3) {
            setChecking(prev => ({ ...prev, [name]: true }));
            try {
                const response = await axios.get(route('usuarios.check-uniqueness'), {
                    params: { [name]: value }
                });
                if (response.data.exists) {
                    setError(name, response.data.message);
                } else {
                    clearErrors(name);
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
        validateField(name as UserFormFields, value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(name as UserFormFields, value);
        if (touched[name]) {
            validateField(name as UserFormFields, value);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('usuarios.store'));
    };

    // <--- Configuración de los pasos del Tutorial
    const createUserSteps: TutorialStep[] = [
        {
            element: '#create-user-header',
            popover: {
                title: 'Registro de Usuario',
                description: 'Utiliza este formulario para dar de alta a un nuevo empleado en el sistema.',
                side: 'bottom',
                align: 'start',
            }
        },
        {
            element: '#document-section',
            popover: {
                title: 'Documento de Identidad',
                description: 'Ingresa la cédula o documento. IMPORTANTE: Este número será la contraseña inicial del usuario.',
                side: 'top',
                align: 'start',
            }
        },
        {
            element: '#names-section',
            popover: {
                title: 'Datos Personales',
                description: 'Completa los nombres y apellidos del usuario tal como aparecen en su identificación.',
                side: 'top',
                align: 'start',
            }
        },
        {
            element: '#email-section',
            popover: {
                title: 'Correo Institucional',
                description: 'Ingresa un correo único. El sistema verificará automáticamente si ya está en uso.',
                side: 'top',
                align: 'start',
            }
        },
        {
            element: '#submit-btn',
            popover: {
                title: 'Finalizar Registro',
                description: 'Haz clic aquí para guardar. El usuario podrá acceder inmediatamente con su cédula como clave.',
                side: 'left',
                align: 'center',
            }
        }
    ];

    return (
        <AppLayout breadcrumbs={[{ title: 'Usuarios', href: route('usuarios.index') }, { title: 'Nuevo', href: '#' }]}>
            <Head title="Registrar Usuario" />
            
            {/* <--- Componente TutorialGuide */}
            <TutorialGuide tutorialKey="users-create-v1" steps={createUserSteps} />

            <div className="p-4 max-w-4xl mx-auto">
                <div className="bg-white p-8 rounded-lg shadow border">
                    <div className="mb-6">
                        {/* <--- ID Agregado */}
                        <h2 id="create-user-header" className="text-2xl font-bold text-gray-800">Registrar Nuevo Usuario</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            El nuevo usuario tendrá rol de <strong>Empleado</strong> y su contraseña inicial será su <strong>Cédula</strong>.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Documento / Cédula FIRST */}
                            {/* <--- ID Agregado */}
                            <div id="document-section" className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Documento / Cédula *</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="document_id"
                                        className={`w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none ${errors.document_id ? 'border-red-500' : 'border-gray-300'}`}
                                        value={data.document_id}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Ingrese el número de identificación"
                                    />
                                    {checking.document_id && (
                                        <div className="absolute right-3 top-2.5">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                        </div>
                                    )}
                                </div>
                                {errors.document_id && <p className="text-red-500 text-xs mt-1">{errors.document_id}</p>}
                            </div>

                            {/* <--- ID Agregado */}
                            <div id="names-section">
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

                            {/* <--- ID Agregado */}
                            <div id="email-section">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico *</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        className={`w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        value={data.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="ejemplo@correo.com"
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
                            {/* <--- ID Agregado */}
                            <button 
                                id="submit-btn"
                                type="submit"
                                disabled={processing || checking.document_id || checking.email} 
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Guardando...' : 'Registrar Usuario'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}