// src/components/GasStationList.jsx
import React from 'react';
import { FaHeart, FaRegHeart, FaArrowDown } from 'react-icons/fa';

function GasStationList({ stations, selectedFuel, latitude, longitude, cleanPrice, calculateDistance, toggleFavorite, favoriteStationIds, onStationClick }) {
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
  const averagePrice = allPrices.length > 0 ? allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length : 0;
  const fuelLabel = selectedFuel.replace('Precio ', '');

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
                Distancia (Km)
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {fuelLabel} (€/L)
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                Favorito
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stations.map((station, index) => {
              const price = cleanPrice(station[selectedFuel]);
              const isBelowAverage = price > 0 && price < averagePrice;
              const isFavorite = favoriteStationIds.has(station.IDEESS);
              const distance = (latitude !== null && longitude !== null)
                ? calculateDistance(
                    latitude,
                    longitude,
                    cleanPrice(station['Latitud'].replace(',', '.')),
                    cleanPrice(station['Longitud (WGS84)'].replace(',', '.'))
                  ).toFixed(2)
                : null;

              return (
                <tr 
                  key={station.IDEESS + '-' + index} 
                  className="hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                  onClick={() => onStationClick(station)}
                >
                  <td className="px-3 py-4 text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <span>{station.Rótulo}</span>
                      {isBelowAverage && (
                        <FaArrowDown className="ml-2 text-green-600" title="Precio por debajo de la media" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{station.Dirección}</p>
                    <p className="text-xs text-gray-500">{station.Municipio}, {station.Provincia}</p>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-700">
                    {distance ? `${distance} km` : 'N/A'}
                  </td>
                  <td className={`px-3 py-4 text-lg font-bold ${isBelowAverage ? 'text-green-700' : 'text-blue-600'}`}>
                    {price.toFixed(3)}
                  </td>
                  <td className="px-3 py-4 text-sm text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(station.IDEESS);
                      }}
                      className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
                      title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                    >
                      {isFavorite ? (
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
          const isBelowAverage = price > 0 && price < averagePrice;
          const isFavorite = favoriteStationIds.has(station.IDEESS);
          const distance = (latitude !== null && longitude !== null)
            ? calculateDistance(
                latitude,
                longitude,
                cleanPrice(station['Latitud'].replace(',', '.')),
                cleanPrice(station['Longitud (WGS84)'].replace(',', '.'))
              ).toFixed(2)
            : null;

          return (
            <div 
              key={station.IDEESS + '-card-' + index} 
              className={`bg-white p-4 rounded-lg shadow-md border-2 ${isBelowAverage ? 'border-green-400' : 'border-gray-200'} cursor-pointer`}
              onClick={() => onStationClick(station)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-bold text-blue-800">{station.Rótulo}</h3>
                    {isBelowAverage && (
                      <FaArrowDown className="ml-2 text-green-600" title="Precio por debajo de la media" />
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{station.Dirección}</p>
                  <p className="text-sm text-gray-600 mb-2">{station.Municipio}, {station.Provincia}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(station.IDEESS);
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                >
                  {isFavorite ? (
                    <FaHeart className="w-6 h-6 text-red-500" />
                  ) : (
                    <FaRegHeart className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex justify-between items-center mt-3">
                <p className="text-base text-gray-700">
                  Distancia:{' '}
                  <span className="font-semibold">
                    {distance ? `${distance} km` : 'N/A'}
                  </span>
                </p>
                <p className={`text-2xl font-extrabold ${isBelowAverage ? 'text-green-700' : 'text-blue-600'}`}>
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