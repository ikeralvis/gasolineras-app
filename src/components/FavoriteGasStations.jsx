// src/components/FavoriteGasStations.jsx
import React from 'react';

function FavoriteGasStations({ stations, selectedFuel, cleanPrice, toggleFavorite, favoriteStationIds }) {
  if (stations.length === 0) {
    return (
      <p className="text-gray-600 text-center py-4">
        Aún no tienes gasolineras favoritas. Puedes añadir una desde la lista principal.
      </p>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Mis Gasolineras Favoritas</h3>

      {/* Vista de Tabla para Escritorio */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider rounded-tl-lg">
                Gasolinera
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Dirección
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Municipio
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider rounded-tr-lg">
                Precio (€/L)
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stations.map((station, index) => (
              <tr key={station.IDEESS + '-fav-' + index} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                <td className="px-3 py-4 text-sm font-medium text-gray-900">
                  {station.Rótulo}
                </td>
                <td className="px-3 py-4 text-sm text-gray-700">
                  {station.Dirección}, {station.Localidad}
                </td>
                <td className="px-3 py-4 text-sm text-gray-700">
                  {station.Municipio}
                </td>
                <td className="px-3 py-4 text-lg font-bold text-green-700">
                  {cleanPrice(station[selectedFuel]).toFixed(3)}
                </td>
                <td className="px-3 py-4 text-sm text-center">
                  <button
                    onClick={() => toggleFavorite(station.IDEESS)}
                    className="p-2 rounded-full hover:bg-red-100 transition-colors duration-200"
                    title="Quitar de favoritos"
                  >
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista de Tarjetas para Móvil */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {stations.map((station, index) => (
          <div key={station.IDEESS + '-fav-card-' + index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-blue-800">{station.Rótulo}</h3>
              <button
                onClick={() => toggleFavorite(station.IDEESS)}
                className="p-2 rounded-full hover:bg-red-100 transition-colors duration-200"
                title="Quitar de favoritos"
              >
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-700">{station.Dirección}, {station.Localidad}</p>
            <p className="text-sm text-gray-600 mb-2">{station.Municipio}, {station.Provincia}</p>
            <div className="flex justify-end items-center mt-3">
              <p className="text-2xl font-extrabold text-green-700">
                {cleanPrice(station[selectedFuel]).toFixed(3)} €/L
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoriteGasStations;