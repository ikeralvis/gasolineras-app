// src/components/Header.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Asegúrate de que esta ruta es correcta
import Modal from './Modal';
import logo from '/icon.png';


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
            <header className="py-4 px-6 bg-white shadow-lg rounded-xl flex items-center justify-between mb-8 font-inter">
                {/* Contenedor del logo y título */}
                <div className="flex items-center space-x-4 flex-1">
                    <img src={logo} alt="Logo de Gasolineras" className="w-12 h-12 rounded-xl transition-transform duration-300 transform hover:scale-110" />
                    <div className="flex-1">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                                Gasolineras España
                            </span>
                        </h1>
                        <p className="text-sm text-gray-500 hidden sm:block">Encuentra el mejor precio de combustible</p>
                    </div>
                </div>
                
                {/* Sección de usuario, alineada a la derecha */}
                <div className="flex items-center justify-end space-x-4">
                    {currentUser ? (
                        <>
                            <span className="text-gray-600 font-medium hidden sm:block text-sm">
                                Hola, {currentUser.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 transition duration-300 font-semibold text-sm"
                            >
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                       <span className="text-gray-600 font-medium text-sm">
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