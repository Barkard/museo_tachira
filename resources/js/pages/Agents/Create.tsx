import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Building2, User, Phone, MapPin } from 'lucide-react';
import React from 'react';
import TutorialGuide, { TutorialStep } from '@/components/TutorialGuide'; // <--- 1. Importación

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        unique_id: '',
        name_legal_entity: '',
        representative_name: '',
        phone_number: '',
        email_address: '',
        physical_address: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('agentes.store'));
    };

    const inputClasses = "w-full rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors";

    // <--- 2. Definición de pasos del Tutorial
    const createAgentSteps: TutorialStep[] = [
        {
            element: '#create-agent-header',
            popover: {
                title: 'Registrar Nuevo Agente',
                description: 'Utiliza este formulario para dar de alta a una persona, museo o institución en el sistema.',
                side: 'bottom',
                align: 'start',
            }
        },
        {
            element: '#agent-main-info',
            popover: {
                title: 'Identificación',
                description: 'Ingresa el nombre legal (o nombre completo de la persona) y, si aplica, el nombre del representante encargado.',
                side: 'top',
                align: 'start',
            }
        },
        {
            element: '#agent-contact-info',
            popover: {
                title: 'Datos de Contacto',
                description: 'Es importante registrar un teléfono o correo electrónico para futuras comunicaciones.',
                side: 'right',
                align: 'center',
            }
        },
        {
            element: '#agent-address-info',
            popover: {
                title: 'Dirección Física',
                description: 'Opcional: Registra la ubicación física de la entidad o persona.',
                side: 'top',
                align: 'start',
            }
        },
        {
            element: '#submit-agent-btn',
            popover: {
                title: 'Guardar Registro',
                description: 'Finaliza el proceso guardando la información en el directorio.',
                side: 'left',
                align: 'center',
            }
        }
    ];

    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Agentes', href: route('agentes.index') }, { title: 'Nuevo', href: '#' }]} header="Registrar Agente">
            <Head title="Nuevo Agente" />

            {/* <--- 3. Renderizamos el Tutorial */}
            <TutorialGuide tutorialKey="agents-create-v1" steps={createAgentSteps} />

            <div className="max-w-4xl mx-auto">
                <Link href={route('agentes.index')} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Volver al directorio
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* ENCABEZADO */}
                    {/* <--- 4. ID Agregado */}
                    <div id="create-agent-header" className="px-6 py-5 border-b border-gray-100 bg-gray-50/80 flex items-center gap-4">
                        <div className="p-3 bg-blue-600 text-white rounded-xl shadow-sm">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Nuevo Contacto</h2>
                            <p className="text-sm text-gray-500">Registre una persona natural o jurídica.</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="p-8 space-y-8">

                        {/* SECCIÓN 1: IDENTIFICACIÓN */}
                        {/* <--- 4. ID Agregado */}
                        <div id="agent-main-info" className="space-y-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b pb-2">Información Principal</h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Cédula / ID Único *
                                    </label>
                                    <input
                                        type="number"
                                        className={inputClasses}
                                        placeholder="Ej. 12345678"
                                        value={data.unique_id}
                                        onChange={e => setData('unique_id', e.target.value)}
                                        autoFocus
                                    />
                                    {errors.unique_id && <p className="text-red-500 text-xs mt-1 font-medium">{errors.unique_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nombre / Razón Social *
                                    </label>
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="Ej. Museo de Bellas Artes, Juan Pérez..."
                                        value={data.name_legal_entity}
                                        onChange={e => setData('name_legal_entity', e.target.value)}
                                    />
                                    {errors.name_legal_entity && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name_legal_entity}</p>}
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" /> Representante
                                    </label>
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="Nombre del encargado (Opcional)"
                                        value={data.representative_name}
                                        onChange={e => setData('representative_name', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN 2: CONTACTO */}
                        {/* <--- 4. ID Agregado */}
                        <div id="agent-contact-info" className="space-y-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b pb-2">Datos de Contacto</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" /> Teléfono
                                    </label>
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="+58 414..."
                                        value={data.phone_number}
                                        onChange={e => setData('phone_number', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        className={inputClasses}
                                        placeholder="correo@ejemplo.com"
                                        value={data.email_address}
                                        onChange={e => setData('email_address', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN 3: UBICACIÓN */}
                        {/* <--- 4. ID Agregado */}
                        <div id="agent-address-info" className="space-y-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b pb-2">Ubicación</h3>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400" /> Dirección Física
                                </label>
                                <textarea
                                    rows={3}
                                    className={inputClasses}
                                    placeholder="Dirección completa..."
                                    value={data.physical_address}
                                    onChange={e => setData('physical_address', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* BOTÓN FINAL */}
                        <div className="pt-6 border-t border-gray-100 flex justify-end">
                            {/* <--- 4. ID Agregado */}
                            <button
                                id="submit-agent-btn"
                                disabled={processing}
                                className="flex items-center bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
                            >
                                <Save className="w-5 h-5 mr-2" />
                                Guardar Agente
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
