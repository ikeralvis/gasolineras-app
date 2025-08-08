// src/components/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const fuelTypes = [
    { value: 'Precio Gasolina 95 E5', label: 'Gasolina 95 E5' },
    { value: 'Precio Gasolina 98 E5', label: 'Gasolina 98 E5' },
    { value: 'Precio Gasolina 95 E10', label: 'Gasolina 95 E10' },
    { value: 'Precio Gasolina 98 E10', label: 'Gasolina 98 E10' },
    { value: 'Precio Gasóleo A', label: 'Gasóleo A' },
    { value: 'Precio Gasóleo Premium', label: 'Gasóleo Premium' },
    { value: 'Precio Gasóleo B', label: 'Gasóleo B' },
    { value: 'Precio Gasóleo C', label: 'Gasóleo C' },
    { value: 'Precio GLP', label: 'GLP' },
    { value: 'Precio GNC', label: 'GNC' },
    { value: 'Precio Hidrógeno', label: 'Hidrógeno' },
];

function UserProfile() {
    const { currentUser, vehicleType, updateUserVehicleType } = useAuth();
    const navigate = useNavigate();
    const [selectedFuelType, setSelectedFuelType] = useState(vehicleType || 'Precio Gasolina 95 E5');
    const [message, setMessage] = useState('');

    // Redirigir si no hay usuario logueado
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    // Sincronizar el estado local con el del contexto
    useEffect(() => {
        if (vehicleType) {
            setSelectedFuelType(vehicleType);
        }
    }, [vehicleType]);

    const handleSave = async () => {
        if (selectedFuelType) {
            await updateUserVehicleType(selectedFuelType);
            setMessage('Preferencia de combustible guardada con éxito. 🎉');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (!currentUser) {
        return null; // O un spinner, para evitar flashes
    }

    return (
        <div className="max-w-xl mx-auto container px-4 py-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Mi Perfil</h1>
                
                {/* Información del usuario */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Datos de Usuario</h2>
                    <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium text-gray-800">Correo Electrónico:</span> {currentUser.email}
                    </p>
                </div>
                
                {/* Perfil del coche */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Perfil de mi Coche</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Selecciona tu tipo de combustible preferido. La aplicación lo recordará para ti.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <select
                            value={selectedFuelType}
                            onChange={(e) => setSelectedFuelType(e.target.value)}
                            className="block w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                        >
                            {fuelTypes.map((fuel) => (
                                <option key={fuel.value} value={fuel.value}>
                                    {fuel.label}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md shadow-md hover:from-purple-600 hover:to-pink-600 transition duration-300 font-semibold"
                        >
                            Guardar preferencia
                        </button>
                    </div>
                </div>

                {message && (
                    <p className="mt-6 text-green-600 text-sm font-medium">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default UserProfile;