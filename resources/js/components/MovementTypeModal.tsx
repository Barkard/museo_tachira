import React, { useState } from 'react';
import Modal from '@/components/Modal';
import { Save } from 'lucide-react';
import axios from 'axios';

interface MovementTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (movementType: { id: number; movement_name: string }) => void;
}

export default function MovementTypeModal({ isOpen, onClose, onSuccess }: MovementTypeModalProps) {
    const [formData, setFormData] = useState({
        movement_name: '',
    });
    const [errors, setErrors] = useState<{ movement_name?: string }>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await axios.post(route('tipos-movimiento.store'), formData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                // Reset form
                setFormData({ movement_name: '' });
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
                    console.error('Error creating movement type:', error);
                    setErrors({ movement_name: 'Error al crear el tipo de movimiento. Intente nuevamente.' });
                }
            } else {
                console.error('Error creating movement type:', error);
                setErrors({ movement_name: 'Error al crear el tipo de movimiento. Intente nuevamente.' });
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleClose = () => {
        setFormData({ movement_name: '' });
        setErrors({});
        onClose();
    };

    const inputClasses = "w-full rounded-lg border border-gray-400 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 transition-colors px-4 py-2";

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Nuevo Tipo de Movimiento">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* CAMPO NOMBRE */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Nombre del Tipo de Movimiento *
                    </label>
                    <input
                        type="text"
                        className={inputClasses}
                        placeholder="Ej: Préstamo, Donación, Restauración"
                        value={formData.movement_name}
                        onChange={e => setFormData({ ...formData, movement_name: e.target.value })}
                        autoFocus
                        disabled={processing}
                    />
                    {errors.movement_name && <p className="text-red-600 text-xs mt-1 font-medium">{errors.movement_name}</p>}
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
                        {processing ? 'Guardando...' : 'Guardar Tipo'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
