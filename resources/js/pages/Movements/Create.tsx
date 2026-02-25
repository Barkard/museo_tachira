import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, ArrowRightLeft, Calendar, User, Info } from 'lucide-react';
import TutorialGuide, { TutorialStep } from '@/components/TutorialGuide'; // <--- 1. Importación

interface MovementFormData {
    piece_id: string;
    movement_type_id: string;
    agent_id: string;
    transaction_status_id: string | number;
    entry_exit_date: string;
}

interface Piece {
    id: number;
    piece_name: string;
    registration_number: string;
}

interface Agent {
    id: number;
    name_legal_entity: string;
}

interface MovementType {
    id: number;
    movement_name: string;
}

interface TransactionStatus {
    id: number;
    status: string;
}

interface Props {
    pieces?: Piece[];
    agents?: Agent[];
    types?: MovementType[];
    statuses?: TransactionStatus[];
}

export default function Create({ pieces = [], agents = [], types = [], statuses = [] }: Props) {

    // Auto-seleccionar "Completado" si existe
    const defaultStatus = (Array.isArray(statuses) ? statuses : []).find(s =>
        (s.status || '').toLowerCase().includes('complet') ||
        (s.status || '').toLowerCase().includes('final')
    )?.id || (Array.isArray(statuses) && statuses.length > 0 ? statuses[0].id : '');

    const { data, setData, post, processing, errors } = useForm<MovementFormData>({
        piece_id: '',
        movement_type_id: '',
        agent_id: '',
        transaction_status_id: defaultStatus,
        entry_exit_date: new Date().toISOString().split('T')[0],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('movimientos.store'));
    };

    const inputClasses = "w-full rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white";

    // <--- 2. Definición de pasos del Tutorial
    const createMovementSteps: TutorialStep[] = [
        {
            element: '#create-movement-header',
            popover: {
                title: 'Registrar Nuevo Movimiento',
                description: 'Utiliza este formulario para documentar cualquier cambio de ubicación, préstamo o donación de una pieza.',
                side: 'bottom',
                align: 'start',
            }
        },
        {
            element: '#movement-piece-input',
            popover: {
                title: 'Selección de Pieza',
                description: 'Elige del inventario la pieza que será movida. Puedes buscar por nombre o número de registro.',
                side: 'right',
                align: 'center',
            }
        },
        {
            element: '#movement-type-input',
            popover: {
                title: 'Tipo de Operación',
                description: 'Define qué está ocurriendo: ¿Es una salida a exposición? ¿Un préstamo? ¿Una devolución?',
                side: 'left',
                align: 'center',
            }
        },
        {
            element: '#movement-agent-input',
            popover: {
                title: 'Responsable',
                description: 'Indica qué persona o institución está involucrada en esta transacción (quién recibe o entrega).',
                side: 'right',
                align: 'center',
            }
        },
        {
            element: '#movement-submit-btn',
            popover: {
                title: 'Confirmar Registro',
                description: 'Guarda la transacción para que quede asentada en el historial oficial del museo.',
                side: 'top',
                align: 'end',
            }
        }
    ];

    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Movimientos', href: route('movimientos.index') }, { title: 'Nuevo', href: '#' }]} header="Registrar Movimiento">
            <Head title="Nuevo Movimiento" />

            {/* <--- 3. Renderizamos el Tutorial */}
            <TutorialGuide tutorialKey="movements-create-v1" steps={createMovementSteps} />

            <div className="max-w-4xl mx-auto">
                <Link href={route('movimientos.index')} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Volver al historial
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* ENCABEZADO */}
                    {/* <--- 4. ID Agregado */}
                    <div id="create-movement-header" className="px-6 py-5 border-b border-gray-100 bg-gray-50/80 flex items-center gap-4">
                        <div className="p-3 bg-blue-600 text-white rounded-xl shadow-sm">
                            <ArrowRightLeft className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Nueva Transacción</h2>
                            <p className="text-sm text-gray-500">Registre entradas, salidas o traslados de piezas.</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* SECCIÓN 1: ¿QUÉ Y CÓMO? */}
                        <div className="md:col-span-2 space-y-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b pb-2 mb-4">
                                1. Detalle de la Operación
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* <--- 4. ID Agregado */}
                                <div id="movement-piece-input">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pieza Involucrada *</label>
                                    <select
                                        className={inputClasses}
                                        value={data.piece_id}
                                        onChange={e => setData('piece_id', e.target.value)}
                                        autoFocus
                                    >
                                        <option value="">-- Buscar Pieza --</option>
                                        {pieces?.map((p: Piece) => (
                                            <option key={p.id} value={p.id}>
                                                {p.piece_name} (Reg: {p.registration_number})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.piece_id && <p className="text-red-500 text-xs mt-1 font-medium">{errors.piece_id}</p>}
                                    <p className="text-xs text-gray-400 mt-1">Seleccione la pieza del inventario.</p>
                                </div>

                                {/* <--- 4. ID Agregado */}
                                <div id="movement-type-input">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Movimiento *</label>
                                    <select
                                        className={inputClasses}
                                        value={data.movement_type_id}
                                        onChange={e => setData('movement_type_id', e.target.value)}
                                    >
                                        <option value="">-- Seleccionar Acción --</option>
                                        {types?.map((t: MovementType) => (
                                            <option key={t.id} value={t.id}>{t.movement_name}</option>
                                        ))}
                                    </select>
                                    {errors.movement_type_id && <p className="text-red-500 text-xs mt-1 font-medium">{errors.movement_type_id}</p>}
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN 2: ¿QUIÉN Y CUÁNDO? */}
                        <div className="md:col-span-2 space-y-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b pb-2 mb-4 flex items-center gap-2">
                                2. Responsables y Fechas
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* <--- 4. ID Agregado */}
                                <div id="movement-agent-input">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <User className="w-4 h-4 text-gray-400" /> Agente / Entidad *
                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            className={inputClasses}
                                            value={data.agent_id}
                                            onChange={e => setData('agent_id', e.target.value)}
                                        >
                                            <option value="">-- Seleccionar Responsable --</option>
                                            {agents?.map((a: Agent) => (
                                                <option key={a.id} value={a.id}>{a.name_legal_entity}</option>
                                            ))}
                                        </select>
                                        <Link href={route('agentes.create')} className="flex items-center justify-center px-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600" title="Crear Nuevo Agente">
                                            +
                                        </Link>
                                    </div>
                                    {errors.agent_id && <p className="text-red-500 text-xs mt-1 font-medium">{errors.agent_id}</p>}
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <Calendar className="w-4 h-4 text-gray-400" /> Fecha del Movimiento *
                                    </label>
                                    <input
                                        type="date"
                                        className={inputClasses}
                                        value={data.entry_exit_date}
                                        onChange={e => setData('entry_exit_date', e.target.value)}
                                    />
                                    {errors.entry_exit_date && <p className="text-red-500 text-xs mt-1 font-medium">{errors.entry_exit_date}</p>}
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <Info className="w-4 h-4 text-gray-400" /> Estado del Trámite *
                                    </label>
                                    <select
                                        className={inputClasses}
                                        value={data.transaction_status_id}
                                        onChange={e => setData('transaction_status_id', e.target.value)}
                                    >
                                        {statuses?.map((s: TransactionStatus) => (
                                            <option key={s.id} value={s.id}>{s.status}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* BOTÓN FINAL */}
                        {/* <--- 4. ID Agregado */}
                        <div id="movement-submit-btn" className="md:col-span-2 pt-6 border-t border-gray-100 flex justify-end">
                            <button
                                disabled={processing}
                                className="flex items-center bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
                            >
                                <Save className="w-5 h-5 mr-2" />
                                Confirmar Movimiento
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
