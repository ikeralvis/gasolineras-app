// src/components/GasStationList.jsx
import React from 'react';
import { FaHeart, FaRegHeart, FaArrowDown } from 'react-icons/fa'; // Importamos el icono FaArrowDown

function GasStationList({ stations, selectedFuel, latitude, longitude, cleanPrice, calculateDistance, toggleFavorite, favoriteStationIds }) {
  if (stations.length === 0) {
    return (
      <p className="text-gray-600 text-center py-8">
        No se encontraron gasolineras con los filtros seleccionados o dentro de la distancia especificada.
        Intenta ajustar los filtros o la ubicación.
      </p>
    );
  }

  // Calculamos el precio promedio de las gasolineras visibles
  const allPrices = stations.map(s => cleanPrice(s[selectedFuel])).filter(price => price > 0);
  const averagePrice = allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length;

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
            {stations.map((station, index) => {
              const price = cleanPrice(station[selectedFuel]);
              const isBelowAverage = price < averagePrice;

              return (
                <tr key={station.IDEESS + '-' + index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-4 text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <span>{station.Rótulo}</span>
                      {isBelowAverage && (
                        <FaArrowDown className="ml-2 text-green-600" title="Precio por debajo de la media" />
                      )}
                    </div>
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
                  <td className={`px-3 py-4 text-lg font-bold ${isBelowAverage ? 'text-green-700' : 'text-gray-900'}`}>
                    {price.toFixed(3)}
                  </td>
                  <td className="px-3 py-4 text-sm text-center">
                    <button
                      onClick={() => toggleFavorite(station.IDEESS)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      title={favoriteStationIds.has(station.IDEESS) ? "Quitar de favoritos" : "Añadir a favoritos"}
                    >
                      {favoriteStationIds.has(station.IDEESS) ? (
                        <FaHeart className="w-6 h-6 text-red-500" />
                      ) : (
                        <FaRegHeart className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Vista de Tarjetas para Móvil */}
      <div className="md:hidden grid grid-cols-1 gap-4 mt-6">
        {stations.map((station, index) => {
          const price = cleanPrice(station[selectedFuel]);
          const isBelowAverage = price < averagePrice;

          return (
            <div key={station.IDEESS + '-card-' + index} className={`bg-white p-4 rounded-lg shadow-md border-2 ${isBelowAverage ? 'border-green-400' : 'border-gray-200'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <h3 className="text-lg font-bold text-blue-800">{station.Rótulo}</h3>
                  {isBelowAverage && (
                    <FaArrowDown className="ml-2 text-green-600" title="Precio por debajo de la media" />
                  )}
                </div>
                <button
                  onClick={() => toggleFavorite(station.IDEESS)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  title={favoriteStationIds.has(station.IDEESS) ? "Quitar de favoritos" : "Añadir a favoritos"}
                >
                  {favoriteStationIds.has(station.IDEESS) ? (
                    <FaHeart className="w-6 h-6 text-red-500" />
                  ) : (
                    <FaRegHeart className="w-6 h-6 text-gray-400" />
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
                <p className={`text-2xl font-extrabold ${isBelowAverage ? 'text-green-700' : 'text-gray-900'}`}>
                  {price.toFixed(3)} €/L
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default GasStationList;