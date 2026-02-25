import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem, SharedData, PaginationLink } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { debounce } from 'lodash';
import { Pencil, Trash2, Plus, Search, Eye, X } from 'lucide-react';
import TutorialGuide, { TutorialStep } from '@/components/TutorialGuide'; 

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Piezas',
        href: '/piezas',
    },
];

interface PieceImage {
    id: number;
    path: string;
}

interface Piece {
    id: number;
    piece_name: string;
    registration_number: string;
    classification_id: number;
    description?: string;
    brief_history?: string;
    classification?: {
        name: string;
    };
    images?: PieceImage[];
    created_at: string;
}

interface Props {
    pieces: {
        data: Piece[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search?: string;
    };
}

export default function Index({ pieces, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Debounce search to avoid too many requests
    const handleSearch = useMemo(
        () =>
            debounce((query: string) => {
                router.get(
                    route('piezas.index'),
                    { search: query },
                    { preserveState: true, replace: true }
                );
            }, 300),
        []
    );

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        handleSearch(e.target.value);
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de querer eliminar esta pieza?')) {
            router.delete(route('piezas.destroy', id));
        }
    };
    const handleView = (piece: Piece) => {
        setSelectedPiece(piece);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPiece(null);
    };

    // <--- 2. Definición de pasos del Tutorial
    const piecesSteps: TutorialStep[] = [
        {
            element: '#pieces-title',
            popover: {
                title: 'Gestión de Colección',
                description: 'Aquí administrarás todo el inventario de piezas del museo.',
                side: 'bottom',
                align: 'start',
            }
        },
        {
            element: '#create-piece-btn',
            popover: {
                title: 'Registrar Nueva Pieza',
                description: 'Presiona este botón para agregar una nueva obra a la base de datos.',
                side: 'left',
                align: 'center',
            }
        },
        {
            element: '#search-bar',
            popover: {
                title: 'Buscador Inteligente',
                description: 'Filtra rápidamente por nombre de la pieza o número de registro.',
                side: 'bottom',
                align: 'start',
            }
        },
        {
            element: '#pieces-table',
            popover: {
                title: 'Listado de Piezas',
                description: 'Aquí verás el inventario. Usa los botones a la derecha para editar o eliminar registros.',
                side: 'top',
                align: 'center',
            }
        }
    ];

    const { props } = usePage<SharedData>();
    const userRole = props.auth.user?.role?.role_name;
    const isEmpleado = userRole === 'Empleado';

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs} header="Piezas">
            <Head title="Piezas" />

            <TutorialGuide tutorialKey="pieces-index-v1" steps={piecesSteps} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center mb-6">
                    {/* <--- 4. ID Agregado */}
                    <h2 id="pieces-title" className="text-2xl font-bold text-gray-800">Inventario de Piezas</h2>
                    {!isEmpleado && (
                        <Link
                            id="create-piece-btn" 
                            href={route('piezas.create')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Nueva Pieza
                        </Link>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
                        {/* <--- 4. ID Agregado */}
                        <div id="search-bar" className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o número de registro..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                value={search}
                                onChange={onSearchChange}
                            />
                        </div>
                    </div>

                    {/* <--- 4. ID Agregado */}
                    <div id="pieces-table" className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 font-semibold">No. Registro</th>
                                    <th className="px-6 py-3 font-semibold">Nombre</th>
                                    <th className="px-6 py-3 font-semibold">Clasificación</th>
                                    <th className="px-6 py-3 font-semibold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pieces.data.length > 0 ? (
                                    pieces.data.map((piece) => (
                                        <tr key={piece.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {piece.registration_number}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">
                                                {piece.piece_name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {piece.classification?.name || 'N/A'}
                                            </td>
                                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleView(piece)}
                                                        className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
                                                        title="Ver Detalles"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {!isEmpleado && (
                                                        <>
                                                            <Link
                                                                href={route('piezas.edit', piece.id)}
                                                                className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                                                title="Editar"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(piece.id)}
                                                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={isEmpleado ? 3 : 4} className="px-6 py-8 text-center text-gray-500">
                                            No se encontraron piezas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {pieces.links.length > 3 && (
                        <div className="p-4 border-t border-gray-200 flex justify-center">
                            <div className="flex gap-1">
                                {pieces.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 rounded-md text-sm ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                ? 'text-gray-600 hover:bg-gray-100'
                                                : 'text-gray-400 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* MODAL DE DETALLES */}
                {isModalOpen && selectedPiece && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
                            
                            {/* Galería de Imágenes (Izquierda) */}
                            <div className="md:w-1/2 bg-gray-100 flex flex-col p-6 overflow-y-auto">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    Galería de Imágenes
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {selectedPiece.images && selectedPiece.images.length > 0 ? (
                                        selectedPiece.images.map((img) => (
                                            <div key={img.id} className="aspect-video rounded-xl overflow-hidden shadow-sm border border-gray-200 group relative">
                                                <img 
                                                    src={`/storage/${img.path}`} 
                                                    alt={selectedPiece.piece_name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 italic">
                                            Sin imágenes disponibles
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Detalles de la Pieza (Derecha) */}
                            <div className="md:w-1/2 p-8 flex flex-col relative overflow-y-auto">
                                <button 
                                    onClick={closeModal}
                                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                <div className="mb-6">
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
                                        {selectedPiece.registration_number}
                                    </span>
                                    <h2 className="text-3xl font-black text-gray-900 mt-2 leading-tight">
                                        {selectedPiece.piece_name}
                                    </h2>
                                    <div className="mt-2 text-gray-500 flex items-center gap-2">
                                        <span className="font-semibold text-gray-700">Clasificación:</span>
                                        {selectedPiece.classification?.name || 'N/A'}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 border-b pb-1">
                                        Breve Historia
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
                                        {selectedPiece.brief_history || 'No hay historia registrada para esta pieza.'}
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                                    <button 
                                        onClick={closeModal}
                                        className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                                    >
                                        Cerrar Vista
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppSidebarLayout>
    );
}