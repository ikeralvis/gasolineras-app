// src/components/GasStationList.jsx
import React from 'react';

/**
 * Componente para mostrar la lista de gasolineras.
 * Se adapta para mostrar una tabla en escritorio y tarjetas en móvil.
 * @param {object} props - Las props del componente.
 * @param {Array<object>} props.stations - Lista de gasolineras filtradas.
 * @param {string} props.selectedFuel - El tipo de combustible seleccionado (clave del precio).
 * @param {number|null} props.latitude - Latitud del usuario para calcular distancia.
 * @param {number|null} props.longitude - Longitud del usuario para calcular distancia.
 * @param {function} props.cleanPrice - Función para limpiar y convertir el precio.
 * @param {function} props.calculateDistance - Función para calcular la distancia.
 */
function GasStationList({ stations, selectedFuel, latitude, longitude, cleanPrice, calculateDistance }) {
  if (stations.length === 0) {
    return (
      <p className="text-gray-600 text-center py-8">
        No se encontraron gasolineras con los filtros seleccionados o dentro de la distancia especificada.
        Intenta ajustar los filtros o la ubicación.
      </p>
    );
  }

  return (
    <>
      {/* Vista de Tabla para Escritorio (oculta en móvil) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                Gasolinera
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dirección
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Municipio
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Provincia
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Distancia (Km)
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                Precio (€/L)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stations.map((station, index) => (
              <tr key={station.IDEESS + '-' + index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-4 text-sm font-medium text-gray-900">
                  {station.Rótulo}
                </td>
                <td className="px-3 py-4 text-sm text-gray-700">
                  {station.Dirección}, {station.Localidad}
                </td>
                <td className="px-3 py-4 text-sm text-gray-700">
                  {station.Municipio}
                </td>
                <td className="px-3 py-4 text-sm text-gray-700">
                  {station.Provincia}
                </td>
                <td className="px-3 py-4 text-sm text-gray-700">
                  {latitude !== null && longitude !== null
                    ? calculateDistance(
                        latitude,
                        longitude,
                        cleanPrice(station['Latitud'].replace(',', '.')),
                        cleanPrice(station['Longitud (WGS84)'].replace(',', '.'))
                      ).toFixed(2) + ' km'
                    : 'N/A'}
                </td>
                <td className="px-3 py-4 text-lg font-bold text-green-700">
                  {cleanPrice(station[selectedFuel]).toFixed(3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista de Tarjetas para Móvil (oculta en escritorio) */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {stations.map((station, index) => (
          <div key={station.IDEESS + '-' + index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-bold text-blue-800 mb-1">{station.Rótulo}</h3>
            <p className="text-sm text-gray-700">{station.Dirección}, {station.Localidad}</p>
            <p className="text-sm text-gray-600 mb-2">{station.Municipio}, {station.Provincia}</p>
            
            <div className="flex justify-between items-center mt-3">
              <p className="text-base text-gray-700">
                Distancia:{' '}
                <span className="font-semibold">
                  {latitude !== null && longitude !== null
                    ? calculateDistance(
                        latitude,
                        longitude,
                        cleanPrice(station['Latitud'].replace(',', '.')),
                        cleanPrice(station['Longitud (WGS84)'].replace(',', '.'))
                      ).toFixed(2) + ' km'
                    : 'N/A'}
                </span>
              </p>
              <p className="text-2xl font-extrabold text-green-700">
                {cleanPrice(station[selectedFuel]).toFixed(3)} €/L
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default GasStationList;