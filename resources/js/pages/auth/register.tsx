
import { Head, Link, useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        document_id: '',
        birth_date: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Registrarse" />

            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Crear una cuenta
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{' '}
                        <Link
                            href={route('login')}
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={submit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                    Nombre
                                </label>
                                <input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Nombre"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                />
                                {errors.first_name && (
                                    <p className="mt-2 text-sm text-red-600">{errors.first_name}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                                    Apellido
                                </label>
                                <input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Apellido"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                />
                                {errors.last_name && (
                                    <p className="mt-2 text-sm text-red-600">{errors.last_name}</p>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="document_id" className="block text-sm font-medium text-gray-700">
                                Cédula / Documento ID
                            </label>
                            <input
                                id="document_id"
                                name="document_id"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Cédula"
                                value={data.document_id}
                                onChange={(e) => setData('document_id', e.target.value)}
                            />
                            {errors.document_id && (
                                <p className="mt-2 text-sm text-red-600">{errors.document_id}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">
                                Fecha de Nacimiento
                            </label>
                            <input
                                id="birth_date"
                                name="birth_date"
                                type="date"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                value={data.birth_date}
                                onChange={(e) => setData('birth_date', e.target.value)}
                            />
                            {errors.birth_date && (
                                <p className="mt-2 text-sm text-red-600">{errors.birth_date}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Correo Electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Correo Electrónico"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Contraseña"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                Confirmar Contraseña
                            </label>
                            <input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Confirmar Contraseña"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {processing ? 'Registrando...' : 'Registrarse'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
