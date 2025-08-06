// src/components/FuelFilter.jsx
import React from 'react';

const fuelOptions = [
  { value: 'Precio Gasolina 95 E5', label: 'Gasolina 95 E5' },
  { value: 'Precio Gasolina 95 E10', label: 'Gasolina 95 E10' },
  { value: 'Precio Gasolina 98 E5', label: 'Gasolina 98 E5' },
  { value: 'Precio Gasolina 98 E10', label: 'Gasolina 98 E10' },
  { value: 'Precio Gasoleo A', label: 'Gasóleo A' },
  { value: 'Precio Gasoleo B', label: 'Gasóleo B' },
  { value: 'Precio Gasoleo Premium', label: 'Gasóleo Premium' },
  { value: 'Precio Gas Natural Comprimido', label: 'GNC' },
  { value: 'Precio Gas Natural Licuado', label: 'GNL' },
  { value: 'Precio Hidrogeno', label: 'Hidrógeno' },
];

function FuelFilter({ selectedFuel, onFuelChange }) {
  return (
    <div>
      <label htmlFor="fuel-type" className="block text-sm font-medium text-gray-700 mb-1">
        Tipo de Combustible:
      </label>
      <select
        id="fuel-type"
        name="fuel-type"
        value={selectedFuel}
        onChange={onFuelChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
      >
        {fuelOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FuelFilter;