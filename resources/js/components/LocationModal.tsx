import React, { useState } from 'react';
import Modal from '@/components/Modal';
import { Save } from 'lucide-react';
import axios from 'axios';

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (location: { id: number; location_name: string; description: string }) => void;
}

export default function LocationModal({ isOpen, onClose, onSuccess }: LocationModalProps) {
    const [formData, setFormData] = useState({
        location_name: '',
        description: '',
    });
    const [errors, setErrors] = useState<{ location_name?: string; description?: string }>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await axios.post(route('ubicaciones.store'), formData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                // Reset form
                setFormData({ location_name: '', description: '' });
                // Call success callback
                onSuccess(response.data.data);
                // Close modal
                onClose();
            }
        } catch (error: unknown) {
             if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status?: number; data?: { errors?: Record<string, string> } } };
                if (axiosError.response?.status === 422) {
                    // Validation errors
                    setErrors(axiosError.response.data?.errors || {});
                } else {
                    console.error('Error creating location:', error);
                    setErrors({ location_name: 'Error al crear la ubicación. Intente nuevamente.' });
                }
            } else {
                console.error('Error creating location:', error);
                setErrors({ location_name: 'Error al crear la ubicación. Intente nuevamente.' });
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleClose = () => {
        setFormData({ location_name: '', description: '' });
        setErrors({});
        onClose();
    };

    const inputClasses = "w-full rounded-lg border border-gray-400 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 transition-colors px-4 py-2";

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Nueva Ubicación">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* CAMPO NOMBRE */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Nombre de la Ubicación *
                    </label>
                    <input
                        type="text"
                        className={inputClasses}
                        placeholder="Ej: Sala 1, Vitrina B"
                        value={formData.location_name}
                        onChange={e => setFormData({ ...formData, location_name: e.target.value })}
                        autoFocus
                        disabled={processing}
                    />
                    {errors.location_name && <p className="text-red-600 text-xs mt-1 font-medium">{errors.location_name}</p>}
                </div>

                {/* CAMPO DESCRIPCIÓN */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Descripción
                    </label>
                    <textarea
                        rows={4}
                        className={inputClasses}
                        placeholder="Detalles sobre esta ubicación..."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        disabled={processing}
                    />
                </div>

                {/* BOTONES */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={processing}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-bold text-sm shadow-sm transition-all active:scale-95 disabled:opacity-70"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {processing ? 'Guardando...' : 'Guardar Ubicación'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
