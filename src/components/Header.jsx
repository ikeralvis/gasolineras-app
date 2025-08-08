import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import Modal from './Modal';
import logo from '/icon.png';
import { LogOut, UserRound } from 'lucide-react'; // Importamos los iconos de lucide-react
import { Link } from 'react-router-dom'; // Importamos Link para la navegación

/**
 * Componente de cabecera para la aplicación de Gasolineras España.
 * Muestra el título principal y la información del usuario logueado.
 */
function Header() {
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
            <div className="container mx-auto px-4 mb-8">
                <header className="max-w-4xl mx-auto py-4 px-4 sm:px-6 bg-white shadow-lg rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 font-inter">
                    {/* Contenedor del logo y título */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <Link to="/">
                            <img src={logo} alt="Logo de Gasolineras" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl transition-transform duration-300 transform hover:scale-110" />
                        </Link>
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-0">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                                    Gasolineras España
                                </span>
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Encuentra el mejor precio de combustible</p>
                        </div>
                    </div>
                    
                    {/* Sección de usuario y botones de acción */}
                    <div className="flex items-center justify-center sm:justify-end gap-2 mt-2 sm:mt-0">
                        {currentUser ? (
                            <>
                                <span className="hidden md:inline text-gray-600 font-medium text-sm sm:text-base">
                                    Hola, {currentUser.email}
                                </span>
                                {/* Botón para ir al perfil de usuario */}
                                <Link
                                    to="/perfil"
                                    className="px-2 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition duration-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1"
                                    aria-label="Ir a mi perfil"
                                >
                                    <span className="hidden sm:inline">Perfil</span>
                                    <UserRound size={16} className="sm:hidden" />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-2 py-1 sm:px-4 sm:py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 transition duration-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1"
                                    aria-label="Cerrar sesión"
                                >
                                    <span className="hidden sm:inline">Cerrar sesión</span>
                                    <LogOut size={16} className="sm:hidden" />
                                </button>
                            </>
                        ) : (
                            <span className="text-gray-600 font-medium text-sm">
                                Bienvenido
                            </span>
                        )}
                    </div>
                </header>
            </div>
            <Modal isOpen={showModal} message={modalMessage} onClose={() => setShowModal(false)} />
        </>
    );
}

export default Header;
