// src/components/AveragePriceDisplay.jsx
import React from 'react';

/**
 * Componente para mostrar el precio medio del combustible.
 * @param {object} props - Las props del componente.
 * @param {string} props.selectedFuelLabel - Etiqueta del combustible seleccionado.
 * @param {number} props.averagePrice - Precio medio calculado.
 * @param {number|null} props.distanceKm - Distancia máxima usada para el cálculo.
 * @param {boolean} props.showDistanceInfo - Si se debe mostrar la información de distancia.
 */
function AveragePriceDisplay({ selectedFuelLabel, averagePrice, distanceKm, showDistanceInfo }) {
  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
      <p className="text-lg font-semibold text-blue-800">
        Precio medio de {selectedFuelLabel}:{' '}
        <span className="text-blue-600 text-2xl font-bold">{averagePrice} €/litro</span>
      </p>
      {showDistanceInfo && (
        <p className="text-sm text-blue-700 mt-1">
          (Calculado para estaciones dentro de {distanceKm} km de tu ubicación)
        </p>
      )}
    </div>
  );
}

export default AveragePriceDisplay;