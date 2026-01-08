import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Building2, User } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name_legal_entity: '',
        agent_type: 'Persona', 
        representative_name: '',
        email: '',
        phone: '',
        address: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('agentes.store'));
    };

    const inputClasses = "w-full rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500";

    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Agentes', href: route('agentes.index') }, { title: 'Nuevo', href: '#' }]} header="Registrar Nuevo Agente">
            <Head title="Crear Agente" />
            
            <div className="max-w-2xl mx-auto">
                <Link href={route('agentes.index')} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Volver al directorio
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <User className="w-5 h-5" />
                        </div>
                        <h2 className="font-bold text-gray-800">Datos del Agente</h2>
                    </div>

                    <form onSubmit={submit} className="p-6 space-y-5">
                        
                        {/* TIPO DE AGENTE (SOLUCIÓN AL ERROR) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Agente *</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 border rounded-xl p-4 cursor-pointer transition-all ${data.agent_type === 'Persona' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="agent_type" value="Persona" checked={data.agent_type === 'Persona'} onChange={e => setData('agent_type', e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                                        <div>
                                            <span className="block font-bold text-gray-900">Persona Natural</span>
                                            <span className="text-xs text-gray-500">Donante particular, investigador, etc.</span>
                                        </div>
                                    </div>
                                </label>
                                <label className={`flex-1 border rounded-xl p-4 cursor-pointer transition-all ${data.agent_type === 'Entidad' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="agent_type" value="Entidad" checked={data.agent_type === 'Entidad'} onChange={e => setData('agent_type', e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                                        <div>
                                            <span className="block font-bold text-gray-900">Entidad / Institución</span>
                                            <span className="text-xs text-gray-500">Museo, Universidad, Gobierno.</span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                            {errors.agent_type && <p className="text-red-500 text-xs mt-1">{errors.agent_type}</p>}
                        </div>

                        {/* NOMBRE */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Legal / Razón Social *</label>
                            <input type="text" className={inputClasses} value={data.name_legal_entity} onChange={e => setData('name_legal_entity', e.target.value)} placeholder="Ej: María Pérez o Museo de Ciencias" />
                            {errors.name_legal_entity && <p className="text-red-500 text-xs mt-1">{errors.name_legal_entity}</p>}
                        </div>

                        {/* REPRESENTANTE (Solo si es entidad) */}
                        {data.agent_type === 'Entidad' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Persona de Contacto</label>
                                <input type="text" className={inputClasses} value={data.representative_name} onChange={e => setData('representative_name', e.target.value)} placeholder="¿Con quién nos comunicamos?" />
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                <input type="text" className={inputClasses} value={data.phone} onChange={e => setData('phone', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                                <input type="email" className={inputClasses} value={data.email} onChange={e => setData('email', e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección Física</label>
                            <textarea rows={3} className={inputClasses} value={data.address} onChange={e => setData('address', e.target.value)} />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button disabled={processing} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-bold text-sm shadow-md">
                                <Save className="w-4 h-4 mr-2" /> Guardar Agente
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppSidebarLayout>
    );
}