import React, { useState } from 'react';
import Modal from '@/components/Modal';
import { Save } from 'lucide-react';
import axios from 'axios';

interface AgentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (agent: { id: number; name_legal_entity: string; agent_type: string }) => void;
}

export default function AgentModal({ isOpen, onClose, onSuccess }: AgentModalProps) {
    const [formData, setFormData] = useState({
        unique_id: '',
        name_legal_entity: '',
        agent_type: 'Persona',
        representative_name: '',
        email: '',
        phone: '',
        address: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await axios.post(route('agentes.store'), formData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                // Reset form
                setFormData({
                    unique_id: '',
                    name_legal_entity: '',
                    agent_type: 'Persona',
                    representative_name: '',
                    email: '',
                    phone: '',
                    address: '',
                });
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
                    console.error('Error creating agent:', error);
                    setErrors({ name_legal_entity: 'Error al crear el agente/entidad. Intente nuevamente.' });
                }
            } else {
                console.error('Error creating agent:', error);
                setErrors({ name_legal_entity: 'Error al crear el agente/entidad. Intente nuevamente.' });
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleClose = () => {
        setFormData({
            unique_id: '',
            name_legal_entity: '',
            agent_type: 'Persona',
            representative_name: '',
            email: '',
            phone: '',
            address: '',
        });
        setErrors({});
        onClose();
    };

    const inputClasses = "w-full rounded-lg border border-gray-400 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 transition-colors px-4 py-2";

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Nuevo Agente / Entidad">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* CAMPO ID ÚNICO */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            ID Único / Cédula / RIF *
                        </label>
                        <input
                            type="number"
                            className={inputClasses}
                            placeholder="Ej: 12345678"
                            value={formData.unique_id}
                            onChange={e => setFormData({ ...formData, unique_id: e.target.value })}
                            autoFocus
                            disabled={processing}
                        />
                        {errors.unique_id && <p className="text-red-600 text-xs mt-1 font-medium">{errors.unique_id}</p>}
                    </div>

                    {/* CAMPO TIPO AGENTE */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Tipo de Agente *
                        </label>
                        <select
                            className={inputClasses}
                            value={formData.agent_type}
                            onChange={e => setFormData({ ...formData, agent_type: e.target.value })}
                            disabled={processing}
                        >
                            <option value="Persona">Persona</option>
                            <option value="Entidad">Entidad</option>
                            <option value="Institución">Institución</option>
                        </select>
                        {errors.agent_type && <p className="text-red-600 text-xs mt-1 font-medium">{errors.agent_type}</p>}
                    </div>
                </div>

                {/* CAMPO NOMBRE */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Nombre / Razón Social *
                    </label>
                    <input
                        type="text"
                        className={inputClasses}
                        placeholder="Nombre completo o nombre de la institución"
                        value={formData.name_legal_entity}
                        onChange={e => setFormData({ ...formData, name_legal_entity: e.target.value })}
                        disabled={processing}
                    />
                    {errors.name_legal_entity && <p className="text-red-600 text-xs mt-1 font-medium">{errors.name_legal_entity}</p>}
                </div>

                {/* CAMPO REPRESENTANTE (Opcional) */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Representante (Opcional)
                    </label>
                    <input
                        type="text"
                        className={inputClasses}
                        placeholder="Nombre del contacto principal"
                        value={formData.representative_name}
                        onChange={e => setFormData({ ...formData, representative_name: e.target.value })}
                        disabled={processing}
                    />
                     {errors.representative_name && <p className="text-red-600 text-xs mt-1 font-medium">{errors.representative_name}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {/* CAMPO EMAIL (Opcional) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Email (Opcional)
                        </label>
                        <input
                            type="email"
                            className={inputClasses}
                            placeholder="correo@ejemplo.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            disabled={processing}
                        />
                         {errors.email && <p className="text-red-600 text-xs mt-1 font-medium">{errors.email}</p>}
                    </div>

                     {/* CAMPO TELEFONO (Opcional) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Teléfono (Opcional)
                        </label>
                        <input
                            type="text"
                            className={inputClasses}
                            placeholder="+58 ..."
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            disabled={processing}
                        />
                         {errors.phone && <p className="text-red-600 text-xs mt-1 font-medium">{errors.phone}</p>}
                    </div>
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
                        {processing ? 'Guardando...' : 'Guardar Agente'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
