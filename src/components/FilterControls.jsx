import React from 'react';

/**
 * Componente que contiene los controles de ordenación y el botón para limpiar los filtros.
 */
function FilterControls({ sortBy, onSortChange, onClearFilters }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Selector de ordenación */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label htmlFor="sort-by" className="text-gray-700 text-sm font-medium whitespace-nowrap">
          Ordenar por:
        </label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={onSortChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        >
          <option value="price">Precio</option>
          <option value="distance">Distancia</option>
        </select>
      </div>

      {/* Botón para limpiar filtros */}
      <button
        onClick={onClearFilters}
        className="text-red-600 border border-transparent hover:border-red-600 hover:bg-red-50 transition-all duration-200 px-4 py-2 rounded-md font-semibold text-sm w-full sm:w-auto"
      >
        Limpiar Filtros
      </button>
    </div>
  );
}

export default FilterControls;
