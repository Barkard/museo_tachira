import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, ChangeEvent } from 'react';
import { Pencil, Trash2, Plus, Search, User, Phone, Mail, Building2 } from 'lucide-react';
import { debounce } from 'lodash';
import TutorialGuide, { TutorialStep } from '@/components/TutorialGuide'; // <--- 1. Importación

interface Agent {
    id: number;
    name_legal_entity: string;
    representative_name: string | null;
    email_address: string | null;
    phone_number: string | null;
}

interface PaginatedAgents {
    data: Agent[];
    links: any[];
}

interface IndexProps {
    agents: PaginatedAgents;
    filters: {
        search?: string;
    };
}

export default function Index({ agents, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = debounce((value) => {
        router.get(
            route('agentes.index'),
            { search: value },
            { preserveState: true, replace: true }
        );
    }, 300);

    const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        handleSearch(e.target.value);
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este agente? Se perderá el historial asociado.')) {
            router.delete(route('agentes.destroy', id));
        }
    };

    const breadcrumbs = [
        { title: 'Gestión', href: '#' },
        { title: 'Agentes y Entidades', href: route('agentes.index') },
    ];

    // <--- 2. Definición de pasos del Tutorial
    const agentsSteps: TutorialStep[] = [
        {
            element: '#agents-search',
            popover: {
                title: 'Buscador de Contactos',
                description: 'Encuentra rápidamente personas o instituciones por nombre, teléfono o email.',
                side: 'bottom',
                align: 'start',
            }
        },
        {
            element: '#create-agent-btn',
            popover: {
                title: 'Nuevo Agente',
                description: 'Registra una nueva persona, museo u organización para asociarla a los movimientos.',
                side: 'left',
                align: 'center',
            }
        },
        {
            element: '#agents-grid',
            popover: {
                title: 'Directorio',
                description: 'Aquí se muestran todas las entidades registradas. Cada tarjeta contiene los datos de contacto principales.',
                side: 'top',
                align: 'center',
            }
        }
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs} header="Directorio de Agentes">
            <Head title="Agentes y Entidades" />

            {/* <--- 3. Renderizamos el Tutorial */}
            <TutorialGuide tutorialKey="agents-index-v1" steps={agentsSteps} />

            <div className="space-y-6">

                {/* BARRA DE HERRAMIENTAS */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* <--- 4. ID Agregado */}
                    <div id="agents-search" className="relative w-full sm:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar nombre, representante..."
                            className="pl-10 block w-full rounded-lg border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            value={search}
                            onChange={onSearchChange}
                        />
                    </div>

                    {/* <--- 4. ID Agregado */}
                    <Link
                        id="create-agent-btn"
                        href={route('agentes.create')}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Registrar Agente
                    </Link>
                </div>

                {/* GRID DE TARJETAS */}
                {/* <--- 4. ID Agregado */}
                <div id="agents-grid">
                    {agents.data.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="w-8 h-8 text-blue-300" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No hay agentes registrados</h3>
                            <p className="mt-1 text-gray-500 text-sm">Comienza agregando personas o instituciones a la base de datos.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {agents.data.map((agent) => (
                                <div key={agent.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                <Building2 className="w-6 h-6" />
                                            </div>
                                            <div className="flex gap-2">
                                                <Link href={route('agentes.edit', agent.id)} className="text-gray-400 hover:text-blue-600 transition-colors">
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button onClick={() => handleDelete(agent.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <h3 className="font-bold text-gray-900 text-lg mb-1 truncate" title={agent.name_legal_entity}>
                                            {agent.name_legal_entity}
                                        </h3>
                                        
                                        {agent.representative_name && (
                                            <p className="text-sm text-gray-500 flex items-center gap-2 mb-4">
                                                <User className="w-3 h-3" />
                                                {agent.representative_name}
                                            </p>
                                        )}

                                        <div className="space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-3">
                                            <div className="flex items-center gap-2 truncate">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                {agent.phone_number || <span className="text-gray-300 italic">Sin teléfono</span>}
                                            </div>
                                            <div className="flex items-center gap-2 truncate">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                {agent.email_address || <span className="text-gray-300 italic">Sin correo</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {agents.links && agents.links.length > 3 && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex gap-1">
                                {agents.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 rounded-md text-sm ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                ? 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
                                                : 'text-gray-300 border border-gray-200 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppSidebarLayout>
    );
}