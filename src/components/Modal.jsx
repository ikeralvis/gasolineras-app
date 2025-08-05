// src/components/Modal.jsx
import React from 'react';

/**
 * Componente de modal genérico para mostrar mensajes al usuario.
 * @param {object} props - Las props del componente.
 * @param {boolean} props.isOpen - Si el modal está abierto o no.
 * @param {string} props.message - El mensaje a mostrar en el modal.
 * @param {function} props.onClose - Función a llamar cuando el modal se cierra.
 */
function Modal({ isOpen, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full text-center transform transition-all duration-300 ease-out scale-100 opacity-100">
        <p className="text-lg font-semibold text-gray-800 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default Modal;