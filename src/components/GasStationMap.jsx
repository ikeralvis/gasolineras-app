// src/components/GasStationMap.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // <<-- IMPORTANTE: Asegúrate de que esta línea esté presente
import L from 'leaflet';


// Para evitar que los íconos no se muestren
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const GasStationMap = ({ stations, center, zoom }) => {
  if (!stations || stations.length === 0) {
    return <p>No hay gasolineras para mostrar en el mapa.</p>;
  }

  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stations.map(station => {
        const lat = parseFloat(station['Latitud'].replace(',', '.'));
        const lon = parseFloat(station['Longitud (WGS84)'].replace(',', '.'));

        if (isNaN(lat) || isNaN(lon)) return null;

        return (
          <Marker key={station.IDEESS} position={[lat, lon]}>
            <Popup>
              <h3>{station.Rótulo}</h3>
              <p>{station.Dirección}</p>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default GasStationMap;