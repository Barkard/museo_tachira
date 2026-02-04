import AppLogoIcon from '@/components/app-logo-icon';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-[800px]">
            {/* LADO IZQUIERDO (Formulario) */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="mx-auto grid w-[380px] gap-6">
                    <div className="flex flex-col gap-2 text-center">
                        <div className="flex justify-center mb-4">
                            {/* Logo del Museo */}
                            <div className="bg-blue-50 p-3 rounded-xl">
                                <AppLogoIcon className="h-10 w-10 text-blue-600" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title || 'Bienvenido'}</h1>
                        {description && (
                            <p className="text-sm text-gray-500 text-balance">
                                {description}
                            </p>
                        )}
                    </div>
                    
                    <div className="grid gap-4">
                        {children}
                    </div>
                </div>
            </div>

            {/* LADO DERECHO (Imagen Decorativa) */}
            <div className="hidden bg-slate-900 lg:block relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-slate-900/20 z-10" />
                <img
                    src="/img/LoginImage.jpg"
                    alt="Museo Background"
                    className="h-full w-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
                />
                <div className="absolute bottom-10 left-10 z-20 text-white max-w-md">
                    <h3 className="text-xl font-bold">Sistema de Gestión de Colecciones</h3>
                    <p className="text-sm text-slate-300 mt-2">Museo del Táchira</p>
                </div>
            </div>
        </div>
    );
}