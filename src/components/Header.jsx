// src/components/Header.jsx
import React from 'react';

/**
 * Componente de cabecera para la aplicación de Gasolineras España.
 * Muestra el título principal y una descripción.
 */
function Header() {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 tracking-tight mb-2">
        ⛽ Gasolineras España
      </h1>
      <p className="text-lg text-gray-600">Encuentra el mejor precio de combustible</p>
    </header>
  );
}

export default Header;