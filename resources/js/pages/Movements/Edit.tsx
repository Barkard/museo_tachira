import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, ArrowRightLeft, Calendar, User } from 'lucide-react';


interface MovementFormData {
    piece_id: string | number;
    movement_type_id: string | number;
    agent_id: string | number;
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

interface Movement {
    id: number;
    piece_id: number;
    movement_type_id: number;
    agent_id: number;
    entry_exit_date: string;
}

interface Props {
    movement: Movement;
    pieces?: Piece[];
    agents?: Agent[];
    types?: MovementType[];
}

export default function Edit({ movement, pieces = [], agents = [], types = [] }: Props) {


    const { data, setData, put, processing, errors } = useForm<MovementFormData>({
        piece_id: movement.piece_id || '',
        movement_type_id: movement.movement_type_id || '',
        agent_id: movement.agent_id || '',
        entry_exit_date: movement.entry_exit_date ? movement.entry_exit_date.split('T')[0] : '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('movimientos.update', movement.id));
    };

    const inputClasses = "w-full rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white";

    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Movimientos', href: route('movimientos.index') }, { title: 'Editar', href: '#' }]} header="Editar Movimiento">
            <Head title="Editar Movimiento" />

            <div className="max-w-4xl mx-auto">
                <Link href={route('movimientos.index')} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Volver al historial
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/80 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-500 text-white rounded-xl shadow-sm">
                                <ArrowRightLeft className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Editar Transacción</h2>
                                <p className="text-sm text-gray-500">Modificando movimiento #{movement.id}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* SECCIÓN 1 */}
                        <div className="md:col-span-2 space-y-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b pb-2 mb-4">
                                1. Detalle de la Operación
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-2">Pieza Involucrada *</label>
                                    <select
                                        className={inputClasses}
                                        value={data.piece_id}
                                        onChange={e => setData('piece_id', e.target.value)}
                                    >
                                        <option value="">-- Buscar Pieza --</option>
                                        {pieces?.map((p: Piece) => (
                                            <option key={p.id} value={p.id}>
                                                {p.piece_name} (Reg: {p.registration_number})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.piece_id && <p className="text-red-500 text-xs mt-1 font-medium">{errors.piece_id}</p>}
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-2">Tipo de Movimiento *</label>
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

                        {/* SECCIÓN 2 */}
                        <div className="md:col-span-2 space-y-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b pb-2 mb-4 flex items-center gap-2">
                                2. Responsables y Fechas
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <User className="w-4 h-4 text-gray-400" /> Agente / Entidad *
                                    </label>
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
                            </div>
                        </div>

                        {/* BOTÓN FINAL */}
                        <div className="md:col-span-2 pt-6 border-t border-gray-100 flex justify-end">
                            <button
                                disabled={processing}
                                className="flex items-center bg-amber-500 text-white px-8 py-3 rounded-xl hover:bg-amber-600 font-bold shadow-lg shadow-amber-200 transition-all active:scale-95"
                            >
                                <Save className="w-5 h-5 mr-2" />
                                Actualizar Movimiento
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
