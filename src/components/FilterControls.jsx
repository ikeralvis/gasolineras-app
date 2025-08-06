// src/components/FilterControls.jsx
import React from 'react';

function FilterControls({ sortBy, onSortChange, onClearFilters }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 border-t border-gray-200 pt-6">
      <div className="flex items-center space-x-2">
        <label htmlFor="sort-by" className="text-sm font-medium text-gray-700">
          Ordenar por:
        </label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={onSortChange}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
        >
          <option value="price">Precio</option>
          <option value="distance">Distancia</option>
        </select>
      </div>

      <button
        onClick={onClearFilters}
        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
      >
        Limpiar Filtros
      </button>
    </div>
  );
}

export default FilterControls;