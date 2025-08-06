// src/components/ProximityFilter.jsx
import React from 'react';

function ProximityFilter({ latitude, longitude, geoError, distanceKm, onDistanceChange }) {
  if (geoError) {
    return (
      <div className="flex items-center justify-center col-span-1 md:col-span-2 lg:col-span-1">
        <p className="text-sm text-red-600 text-center">
          Error de geolocalización. El filtro por distancia no está disponible.
        </p>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
        Distancia Máxima (Km):
      </label>
      <input
        type="range"
        id="distance"
        min="5"
        max="50"
        step="5"
        value={distanceKm}
        onChange={onDistanceChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span>5km</span>
        <span>{distanceKm} km</span>
        <span>50km</span>
      </div>
    </div>
  );
}

export default ProximityFilter;