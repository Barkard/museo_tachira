import React, { useState } from 'react';
import Modal from '@/components/Modal';
import { Save } from 'lucide-react';
import axios from 'axios';

interface ClassificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (classification: { id: number; name: string; description: string }) => void;
}

export default function ClassificationModal({ isOpen, onClose, onSuccess }: ClassificationModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await axios.post(route('clasificaciones.store'), formData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                // Reset form
                setFormData({ name: '', description: '' });
                // Call success callback with new classification
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
                    console.error('Error creating classification:', error);
                    setErrors({ name: 'Error al crear la clasificación. Intente nuevamente.' });
                }
            } else {
                console.error('Error creating classification:', error);
                setErrors({ name: 'Error al crear la clasificación. Intente nuevamente.' });
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleClose = () => {
        setFormData({ name: '', description: '' });
        setErrors({});
        onClose();
    };

    const inputClasses = "w-full rounded-lg border border-gray-400 bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-purple-500 transition-colors px-4 py-2";

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Nueva Clasificación">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* CAMPO NOMBRE */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Nombre de la Categoría *
                    </label>
                    <input
                        type="text"
                        className={inputClasses}
                        placeholder="Escribe el nombre aquí..."
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        autoFocus
                        disabled={processing}
                    />
                    {errors.name && <p className="text-red-600 text-xs mt-1 font-medium">{errors.name}</p>}
                </div>

                {/* CAMPO DESCRIPCIÓN */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Descripción
                    </label>
                    <textarea
                        rows={4}
                        className={inputClasses}
                        placeholder="Detalles opcionales sobre esta clasificación..."
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
                        className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-bold text-sm shadow-sm transition-all active:scale-95 disabled:opacity-70"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {processing ? 'Guardando...' : 'Guardar Categoría'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
