// src/components/AveragePriceDisplay.jsx
import React from 'react';

function AveragePriceDisplay({ selectedFuelLabel, averagePrice, distanceKm, showDistanceInfo }) {
  return (
    <div className="mt-6 mb-6 p-4 bg-gray-50 rounded-lg shadow-inner flex flex-col md:flex-row items-center justify-between">
      <div className="text-center md:text-left mb-2 md:mb-0">
        <p className="text-sm font-medium text-gray-600">Precio Medio de {selectedFuelLabel}:</p>
        <p className="text-2xl font-bold text-green-700">
          {averagePrice} €/L
        </p>
      </div>
      {showDistanceInfo && (
        <div className="text-center md:text-right">
          <p className="text-sm font-medium text-gray-600">
            Dentro de un radio de:
          </p>
          <p className="text-lg font-bold text-blue-600">
            {distanceKm} km
          </p>
        </div>
      )}
    </div>
  );
}

export default AveragePriceDisplay;