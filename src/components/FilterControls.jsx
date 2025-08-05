// src/components/FilterControls.jsx
import React from 'react';

/**
 * Componente para los controles de filtrado y ordenación.
 * @param {object} props - Las props del componente.
 * @param {string} props.sortBy - Criterio de ordenación actual ('price' o 'distance').
 * @param {function} props.onSortChange - Función para cambiar el criterio de ordenación.
 * @param {function} props.onClearFilters - Función para limpiar todos los filtros.
 */
function FilterControls({ sortBy, onSortChange, onClearFilters }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 p-4 bg-gray-50 rounded-lg shadow-inner">
      {/* Selector de Ordenación */}
      <div className="w-full sm:w-auto">
        <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
          Ordenar por:
        </label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={onSortChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm text-gray-900"
        >
          <option value="price">Precio</option>
          <option value="distance">Distancia</option>
        </select>
      </div>

      {/* Botón Limpiar Filtros */}
      <div className="w-full sm:w-auto">
        <button
          onClick={onClearFilters}
          className="w-full sm:w-auto px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-md"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
}

export default FilterControls;