// src/components/Header.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Asegúrate de que esta ruta es correcta
import Modal from './Modal';


/**
 * Componente de cabecera para la aplicación de Gasolineras España.
 * Muestra el título principal y la información del usuario logueado.
 */
function Header() {
    // Usamos el hook useAuth para obtener el usuario actual
    const { currentUser } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setModalMessage("Has cerrado sesión correctamente.");
            setShowModal(true);
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            setModalMessage("Ocurrió un error al cerrar la sesión.");
            setShowModal(true);
        }
    };

    return (
        <>
            <header className="py-4 px-6 rounded-xl flex items-center justify-between mb-8 font-inter">
                {/* Contenedor vacío para empujar el título al centro */}
                <div className="flex-1"></div>
                
                {/* Título principal de la aplicación */}
                <div className="text-center flex-1">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 tracking-tight mb-2">
                        ⛽ Gasolineras España
                    </h1>
                    <p className="text-lg text-gray-600">Encuentra el mejor precio de combustible</p>
                </div>
                
                {/* Sección de usuario, alineada a la derecha */}
                <div className="flex-1 flex items-center justify-end space-x-4">
                    {currentUser ? (
                        <>
                            <span className="text-gray-600 font-medium hidden sm:block">
                                Hola, {currentUser.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 transition duration-300 font-semibold"
                            >
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <span className="text-gray-600 font-medium">
                            Bienvenido
                        </span>
                    )}
                </div>
            </header>
            <Modal isOpen={showModal} message={modalMessage} onClose={() => setShowModal(false)} />
        </>
    );
}

export default Header;