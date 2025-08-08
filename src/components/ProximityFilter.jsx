// src/components/ProximityFilter.jsx
import React from 'react';

function ProximityFilter({ latitude, longitude, geoError, distanceKm, onDistanceChange }) {
  const isGeoEnabled = latitude !== null && longitude !== null && !geoError;

  return (
    <div>
      <label htmlFor="distance-filter" className="block text-sm font-medium text-gray-700 mb-1">
        Distancia máxima (km):
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type="number"
          id="distance-filter"
          value={distanceKm}
          onChange={onDistanceChange}
          disabled={!isGeoEnabled}
          min="1"
          max="50"
          className="block w-full rounded-md border-gray-300 pl-3 pr-10 p-2 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm
            disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm">km</span>
        </div>
      </div>
      {!isGeoEnabled && (
        <p className="mt-2 text-xs text-red-600">
          La geolocalización no está disponible. No se puede filtrar por distancia.
        </p>
      )}
    </div>
  );
}

export default ProximityFilter;