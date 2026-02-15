import Heading from '@/components/heading';
import { type PropsWithChildren } from 'react';

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="px-4 py-8 max-w-4xl mx-auto">
            <Heading
                title="Ajustes de Cuenta"
                description="Gestiona la información de tu perfil y la seguridad de tu acceso"
            />

            <div className="mt-8 flex flex-col">
                <div className="flex-1">
                    <section className="space-y-12">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
