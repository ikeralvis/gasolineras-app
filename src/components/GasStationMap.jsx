// src/components/GasStationMap.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Eliminar el icono por defecto para evitar errores
delete L.Icon.Default.prototype._getIconUrl;

// Icono personalizado para la ubicación del usuario (punto azul)
const userIcon = L.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Icono para las gasolineras favoritas (punto morado)
const favoriteIcon = L.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Icono para las gasolineras normales (punto rojo)
const stationIcon = L.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


function GasStationMap({ stations, userLocation, selectedFuel, cleanPrice, favoriteStationIds }) {
  if (!userLocation || userLocation.latitude === null || userLocation.longitude === null) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-100 rounded-xl">
        <p className="text-gray-600 text-lg">Cargando tu ubicación o no se ha podido obtener.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-lg overflow-hidden" style={{ height: '500px' }}>
      <MapContainer
        center={[userLocation.latitude, userLocation.longitude]}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcador para la ubicación del usuario con el nuevo icono azul */}
        <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
          <Popup>
            <span className="font-bold">¡Estás aquí!</span>
          </Popup>
        </Marker>

        {/* Marcadores para cada gasolinera */}
        {stations.map((station) => {
          const stationLat = cleanPrice(station['Latitud'].replace(',', '.'));
          const stationLon = cleanPrice(station['Longitud (WGS84)'].replace(',', '.'));
          const price = cleanPrice(station[selectedFuel]);
          const fuelLabel = selectedFuel.replace('Precio ', '');

          // Lógica para elegir el icono: favorito o normal
          const icon = favoriteStationIds.has(station.IDEESS) ? favoriteIcon : stationIcon;

          if (isNaN(stationLat) || isNaN(stationLon)) {
            return null;
          }

          return (
            <Marker key={station.IDEESS} position={[stationLat, stationLon]} icon={icon}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-gray-900">{station.Rótulo}</h3>
                  <p className="text-sm text-gray-700">{station.Dirección}</p>
                  <p className="text-lg font-bold text-blue-600 mt-2">{price.toFixed(3)} €/L</p>
                  <p className="text-xs text-gray-500">{fuelLabel}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default GasStationMap;