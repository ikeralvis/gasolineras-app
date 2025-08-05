// src/components/ProximityFilter.jsx
import React from 'react';

/**
 * Componente para mostrar la ubicación actual del usuario y el filtro de distancia.
 * @param {object} props - Las props del componente.
 * @param {number|null} props.latitude - Latitud del usuario.
 * @param {number|null} props.longitude - Longitud del usuario.
 * @param {string|null} props.geoError - Mensaje de error de geolocalización.
 * @param {number} props.distanceKm - Distancia máxima en kilómetros.
 * @param {function} props.onDistanceChange - Función para actualizar la distancia.
 */
function ProximityFilter({ latitude, longitude, geoError, distanceKm, onDistanceChange }) {
  return (
    <>
      {/* Muestra la ubicación obtenida automáticamente */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tu Ubicación Actual:
        </label>
        <p className="text-gray-900 text-base">
          {latitude !== null && longitude !== null
            ? `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`
            : 'Obteniendo ubicación...'}
        </p>
        {geoError && (
            <p className="text-red-500 text-xs mt-1">{geoError}</p>
        )}
      </div>

      {/* Input de Distancia */}
      <div>
        <label htmlFor="distance-km" className="block text-sm font-medium text-gray-700 mb-1">
          Distancia máxima (Km):
        </label>
        <input
          type="number"
          id="distance-km"
          value={distanceKm}
          onChange={onDistanceChange}
          min="1"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
        />
      </div>
    </>
  );
}

export default ProximityFilter;