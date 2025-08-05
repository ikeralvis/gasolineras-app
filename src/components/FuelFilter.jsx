// src/components/FuelFilter.jsx
import React from 'react';

/**
 * Componente para seleccionar el tipo de combustible.
 * @param {object} props - Las props del componente.
 * @param {string} props.selectedFuel - El tipo de combustible actualmente seleccionado.
 * @param {function} props.onFuelChange - Función a llamar cuando cambia la selección de combustible.
 */
function FuelFilter({ selectedFuel, onFuelChange }) {
  const fuelTypes = [
    { value: "Precio Gasolina 95 E5", label: "Gasolina 95 E5" },
    { value: "Precio Gasolina 95 E10", label: "Gasolina 95 E10" },
    { value: "Precio Gasolina 95 E5 Premium", label: "Gasolina 95 E5 Premium" },
    { value: "Precio Gasolina 98 E5", label: "Gasolina 98 E5" },
    { value: "Precio Gasolina 98 E10", label: "Gasolina 98 E10" },
    { value: "Precio Gasoleo A", label: "Gasóleo A" },
    { value: "Precio Gasoleo B", label: "Gasóleo B" },
    { value: "Precio Gasoleo Premium", label: "Gasóleo Premium" },
    { value: "Precio Biodiesel", label: "Biodiésel" },
    { value: "Precio Bioetanol", label: "Bioetanol" },
    { value: "Precio GNC", label: "GNC" },
    { value: "Precio GNL", "label": "GNL" },
    { value: "Precio GLP", label: "GLP" },
    { value: "Precio Hidrogeno", label: "Hidrógeno" },
  ];

  return (
    <div>
      <label htmlFor="fuel-type" className="block text-sm font-medium text-gray-700 mb-1">
        Tipo de Combustible:
      </label>
      <select
        id="fuel-type"
        value={selectedFuel}
        onChange={onFuelChange}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm text-gray-900"
      >
        {fuelTypes.map(fuel => (
          <option key={fuel.value} value={fuel.value}>{fuel.label}</option>
        ))}
      </select>
    </div>
  );
}

export default FuelFilter;