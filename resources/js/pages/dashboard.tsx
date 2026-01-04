import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { 
    Package, 
    MapPin, 
    Users, 
    ArrowRightLeft, 
    PlusCircle, 
    Search,
    Clock,
    TrendingUp,
    ShieldCheck
} from 'lucide-react';

export default function Dashboard() {
    const stats = {
        pieces: 1250,
        locations: 42,
        users: 5,
        movements: 12
    };

    const breadcrumbs = [
        { title: 'Panel de Control', href: route('dashboard') },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs} header="Dashboard">
            <Head title="Panel de Control" />

            <div className="space-y-6">
                
                {/* 1. BANNER DE BIENVENIDA (Compacto y limpio) */}
                <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold text-gray-800">¡Bienvenido de nuevo! 👋</h2>
                        <p className="text-gray-500 text-sm mt-1">El sistema del museo está funcionando correctamente.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Sistema En Línea</span>
                    </div>
                </div>

                {/* 2. TARJETAS DE ESTADÍSTICAS (Grid equilibrado) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        title="Piezas Totales" 
                        value={stats.pieces} 
                        icon={<Package className="w-5 h-5" />} 
                        color="blue" 
                    />
                    <StatCard 
                        title="Ubicaciones" 
                        value={stats.locations} 
                        icon={<MapPin className="w-5 h-5" />} 
                        color="emerald" 
                    />
                    <StatCard 
                        title="Movimientos Hoy" 
                        value={stats.movements} 
                        icon={<ArrowRightLeft className="w-5 h-5" />} 
                        color="amber" 
                    />
                    <StatCard 
                        title="Usuarios Activos" 
                        value={stats.users} 
                        icon={<Users className="w-5 h-5" />} 
                        color="purple" 
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* 3. COLUMNA IZQUIERDA: ACTIVIDAD RECIENTE */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[300px]">
                        <div className="p-5 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-gray-400" />
                                Actividad Reciente
                            </h3>
                            <button className="text-xs text-blue-600 font-medium hover:underline">Ver historial</button>
                        </div>
                        
                        {/* Tabla simple */}
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-400 uppercase bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Acción</th>
                                        <th className="px-6 py-3 font-medium">Detalle</th>
                                        <th className="px-6 py-3 font-medium text-right">Hace</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {/* Fila de ejemplo 1 */}
                                    <tr className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">INGRESO</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            Vasija Precolombina #402
                                            <div className="text-xs text-gray-400 mt-0.5">Por: Admin</div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-400 text-xs">10 min</td>
                                    </tr>
                                    {/* Fila de ejemplo 2 */}
                                    <tr className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">TRASLADO</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            Punta de Lanza (A Bodega 2)
                                            <div className="text-xs text-gray-400 mt-0.5">Por: Juan Pérez</div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-400 text-xs">2 horas</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 4. COLUMNA DERECHA: ACCIONES RÁPIDAS */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-full">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                            Acciones Rápidas
                        </h3>
                        <div className="space-y-3">
                            <QuickAction 
                                href={route('piezas.create')} 
                                label="Registrar Nueva Pieza" 
                                icon={<PlusCircle className="w-4 h-4" />} 
                                color="blue"
                            />
                            <QuickAction 
                                href={route('ubicaciones.create')} 
                                label="Crear Nueva Ubicación" 
                                icon={<MapPin className="w-4 h-4" />} 
                                color="emerald"
                            />
                            <QuickAction 
                                href={route('piezas.index')} 
                                label="Buscar en el Catálogo" 
                                icon={<Search className="w-4 h-4" />} 
                                color="purple"
                            />
                        </div>

                        {/* Banner Informativo Pequeño */}
                        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Recuerda registrar todos los movimientos de piezas antes de cerrar el turno.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}

// ----------------------------------------------------------------------
// COMPONENTES AUXILIARES (Internal Helpers)
// ----------------------------------------------------------------------

function StatCard({ title, value, icon, color }: any) {
    const colors: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    return (
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-default">
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${colors[color]}`}>
                {icon}
            </div>
        </div>
    );
}

function QuickAction({ label, icon, color, href }: any) {
    const colors: Record<string, string> = {
        blue: 'text-blue-600 bg-blue-50 group-hover:bg-blue-100',
        emerald: 'text-emerald-600 bg-emerald-50 group-hover:bg-emerald-100',
        purple: 'text-purple-600 bg-purple-50 group-hover:bg-purple-100',
    };

    return (
        <Link 
            href={href} 
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all group"
        >
            <div className={`p-2 rounded-lg transition-colors ${colors[color]}`}>
                {icon}
            </div>
            <span className="font-medium text-gray-700 text-sm group-hover:text-gray-900">{label}</span>
        </Link>
    );
}