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

// Icono genérico para gasolineras sin marca
const defaultStationIcon = L.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Mapeo de rótulos a iconos de marca
const brandIcons = {
  'REPSOL': L.icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Repsol_2025_%28vertical%29.svg/1200px-Repsol_2025_%28vertical%29.svg.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
  }),
  'CEPSA': L.icon({
    iconUrl: 'https://play-lh.googleusercontent.com/AV0znG48I5oLdDYr7k-4oDfM4w4FW5n80VtOCjwNvfeSEeyieK5IEC030IEPDXnqdA',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
  }),
  'BP BILBAO': L.icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Bp_textlogo.svg/1200px-Bp_textlogo.svg.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
  }),
  'SHELL': L.icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Shell_logo.svg/640px-Shell_logo.svg.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
  }),
  'GALP': L.icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Galp_Logo_2024.svg/1200px-Galp_Logo_2024.svg.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
  }),
  'PETRONOR': L.icon({
    iconUrl: 'https://petronor.eus/wp-content/themes/petronorx/img/logomobile2024.png',
    iconSize: [30, 30],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
  }),
  'AVIA': L.icon({
    iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ7chHUael4wTWHcfha2PYpC3XjraWyXX17w&s',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
  }),
  'PETROPRIX': L.icon({
    iconUrl: 'https://petroprix.com/wp-content/uploads/2022/04/Rojo.svg',
    iconSize: [55, 55],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
  }),
  'COSTCO': L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/5977/5977579.png',
    iconSize: [55, 55],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
  }),
  'CARREFOUR': L.icon({
    iconUrl: 'https://www.uclm.es/-/media/Files/A01-Asistencia-Direccion/A01-135-Vicerrectorado-Transferencia/MECENAZGO/carrefour.ashx?h=338&w=450&la=es',
    iconSize: [60, 45],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
  }),
  'NAFTE': L.icon({
    iconUrl: 'https://nafte.es/wp-content/uploads/2018/05/logo-nafte.png',
    iconSize: [60, 45],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
  }),
  'EROSKI': L.icon({
    iconUrl: 'https://pbs.twimg.com/profile_images/1214914494813618176/4oYlKZVB_400x400.png',
    iconSize: [30, 30],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
  }),

  // Puedes añadir más marcas aquí
};

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

          let markerIcon;

          // 1. Verificar si es una gasolinera favorita
          if (favoriteStationIds.has(station.IDEESS)) {
            markerIcon = favoriteIcon;
          } else {
            // 2. Si no es favorita, buscar por el rótulo de la marca
            const brand = station.Rótulo.toUpperCase();
            markerIcon = brandIcons[brand] || defaultStationIcon;
          }

          if (isNaN(stationLat) || isNaN(stationLon)) {
            return null;
          }

          return (
            <Marker key={station.IDEESS} position={[stationLat, stationLon]} icon={markerIcon}>
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