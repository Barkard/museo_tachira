import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Contextos', href: '/contextos' },
    { title: 'Nuevo Contexto', href: '/contextos/create' },
];

interface Piece {
    id: number;
    piece_name: string;
    registration_number: string;
}

interface Props {
    pieces: Piece[];
}

export default function Create({ pieces }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        piece_id: '',
        provenance_location: '',
        bibliographic_references: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('contextos.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo Contexto" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="max-w-4xl mx-auto w-full bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Agregar Contexto a Pieza</h2>
                    
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Pieza</label>
                                <select
                                    value={data.piece_id}
                                    onChange={e => setData('piece_id', e.target.value)}
                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">-- Seleccione una Pieza --</option>
                                    {pieces.map(piece => (
                                        <option key={piece.id} value={piece.id}>
                                            {piece.registration_number} - {piece.piece_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.piece_id && <div className="text-red-500 text-sm mt-1">{errors.piece_id}</div>}
                                {pieces.length === 0 && (
                                    <div className="text-amber-600 text-xs mt-1">
                                        Nota: Solo aparecen piezas que aún no tienen contexto asignado.
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Procedencia / Lugar de Origen</label>
                                <input
                                    type="text"
                                    value={data.provenance_location}
                                    onChange={e => setData('provenance_location', e.target.value)}
                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ej. Excavación Templo Mayor, Donación particular..."
                                />
                                {errors.provenance_location && <div className="text-red-500 text-sm mt-1">{errors.provenance_location}</div>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Referencias Bibliográficas</label>
                                <textarea
                                    value={data.bibliographic_references}
                                    onChange={e => setData('bibliographic_references', e.target.value)}
                                    rows={4}
                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Libros, artículos o documentos relacionados..."
                                />
                                {errors.bibliographic_references && <div className="text-red-500 text-sm mt-1">{errors.bibliographic_references}</div>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                            <Link href={route('contextos.index')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
