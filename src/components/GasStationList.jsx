// src/components/GasStationList.jsx
import React from 'react';

function GasStationList({ stations, selectedFuel, latitude, longitude, cleanPrice, calculateDistance, toggleFavorite, favoriteStationIds }) {
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
      {/* Vista de Tabla para Escritorio */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-md mt-6">
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
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio (€/L)
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                Favorito
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
                <td className="px-3 py-4 text-sm text-center">
                  <button
                    onClick={() => toggleFavorite(station.IDEESS)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    title={favoriteStationIds.has(station.IDEESS) ? "Quitar de favoritos" : "Añadir a favoritos"}
                  >
                    {favoriteStationIds.has(station.IDEESS) ? (
                      <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista de Tarjetas para Móvil */}
      <div className="md:hidden grid grid-cols-1 gap-4 mt-6">
        {stations.map((station, index) => (
          <div key={station.IDEESS + '-card-' + index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-blue-800">{station.Rótulo}</h3>
              <button
                onClick={() => toggleFavorite(station.IDEESS)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                title={favoriteStationIds.has(station.IDEESS) ? "Quitar de favoritos" : "Añadir a favoritos"}
              >
                {favoriteStationIds.has(station.IDEESS) ? (
                  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
              </button>
            </div>
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