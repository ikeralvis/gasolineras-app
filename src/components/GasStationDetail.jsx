// src/components/GasStationDetail.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTimes, FaMapMarkerAlt, FaGasPump, FaStar, FaRegStar } from 'react-icons/fa';
import { IoLocationSharp } from 'react-icons/io5';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;

const stationIcon = L.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function GasStationDetail({ gasStations, cleanPrice, favoriteStationIds, toggleFavorite, calculateDistance }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const station = gasStations.find(s => s.IDEESS === id);

  if (!station) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Gasolinera no encontrada</h2>
        <button onClick={() => navigate('/')} className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Volver a la lista
        </button>
      </div>
    );
  }

  const isFavorite = favoriteStationIds.has(station.IDEESS);
  
  const availablePrices = Object.keys(station)
    .filter(key => key.startsWith('Precio '))
    .map(key => ({
      name: key.replace('Precio ', ''),
      price: cleanPrice(station[key]),
    }))
    .filter(fuel => fuel.price > 0);

  const nearbyStations = gasStations
    .filter(s => s.IDEESS !== station.IDEESS)
    .map(s => {
      const dist = calculateDistance(
        cleanPrice(station['Latitud'].replace(',', '.')),
        cleanPrice(station['Longitud (WGS84)'].replace(',', '.')),
        cleanPrice(s['Latitud'].replace(',', '.')),
        cleanPrice(s['Longitud (WGS84)'].replace(',', '.'))
      );
      return { ...s, distance: dist };
    })
    .filter(s => s.distance <= 10)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

  const stationLat = cleanPrice(station['Latitud'].replace(',', '.'));
  const stationLon = cleanPrice(station['Longitud (WGS84)'].replace(',', '.'));

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 mt-8">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 flex-grow">{station.Rótulo}</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => toggleFavorite(station.IDEESS)}
            className="p-2 rounded-full text-2xl text-red-500 hover:bg-gray-100 transition-colors duration-200"
            title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            {isFavorite ? <FaStar /> : <FaRegStar />}
          </button>
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-800 text-3xl">
            <FaTimes />
          </button>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-700 flex items-center"><FaMapMarkerAlt className="mr-2 text-blue-600" /> Dirección</h3>
              <p className="text-gray-600 ml-6">{station.Dirección}, {station.Localidad}</p>
              <p className="text-gray-600 ml-6">{station.Municipio}, {station.Provincia}</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-700 flex items-center"><FaGasPump className="mr-2 text-blue-600" /> Precios</h3>
              <ul className="list-disc list-inside ml-6 text-gray-600">
                {availablePrices.map(fuel => (
                  <li key={fuel.name} className="flex justify-between items-center py-1">
                    <span>{fuel.name}:</span>
                    <span className="font-bold text-lg text-blue-700">{fuel.price.toFixed(3)} €/L</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">Mapa de ubicación</h3>
            <div className="rounded-lg overflow-hidden border border-gray-300" style={{ height: '300px' }}>
              <MapContainer
                center={[stationLat, stationLon]}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[stationLat, stationLon]} icon={stationIcon}>
                  <Popup>{station.Rótulo}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
        {nearbyStations.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-700">Gasolineras cercanas</h3>
            <ul className="divide-y divide-gray-200">
              {nearbyStations.map(nearby => (
                <li key={nearby.IDEESS} className="flex justify-between items-center py-2">
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{nearby.Rótulo}</p>
                    <p className="text-sm text-gray-600">{nearby.Dirección}</p>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <IoLocationSharp className="mr-1 text-blue-500" />{nearby.distance.toFixed(2)} km
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default GasStationDetail;