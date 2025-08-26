// src/components/ClosestGasStation.jsx
import React from 'react';

function ClosestGasStation({ station, selectedFuel, cleanPrice, distance, onStationClick }) {
  if (!station) {
    return null;
  }

  const fuelPrice = cleanPrice(station[selectedFuel]);
  const fuelLabel = selectedFuel.replace('Precio ', '');

  return (
    <div className="bg-blue-100 p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-bold text-blue-800 mb-2">Gasolinera Más Cercana</h3>
      <div className="flex justify-between items-center cursor-pointer hover:bg-blue-200 transition-colors duration-200" onClick={() => onStationClick(station)}>
        <div>
          <p className="font-semibold text-gray-800">{station.Rótulo}</p>

          <p className="text-sm text-gray-600">{station.Dirección}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-blue-600">{fuelPrice.toFixed(3)} €/L</p>
          <p className="text-xs text-gray-500">{fuelLabel}</p>
          <p className="text-xs font-medium text-gray-700 mt-1">A {distance.toFixed(1)} km</p>
        </div>
      </div>
    </div>
  );
}

export default ClosestGasStation;