// src/components/GasStationDetail.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTimes, FaMapMarkerAlt, FaGasPump, FaStar, FaRegStar, FaHeart, FaRegHeart, FaRoad, FaEuroSign } from 'react-icons/fa';
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

const userIcon = L.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const brandIcons = {
  'REPSOL': L.icon({ iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Repsol_2025_%28vertical%29.svg/1200px-Repsol_2025_%28vertical%29.svg.png', iconSize: [35, 35], iconAnchor: [17, 35], popupAnchor: [0, -35] }),
  'CEPSA': L.icon({ iconUrl: 'https://play-lh.googleusercontent.com/AV0znG48I5oLdDYr7k-4oDfM4w4FW5n80VtOCjwNvfeSEeyieK5IEC030IEPDXnqdA', iconSize: [35, 35], iconAnchor: [17, 35], popupAnchor: [0, -35] }),
  'BP BILBAO': L.icon({ iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Bp_textlogo.svg/1200px-Bp_textlogo.svg.png', iconSize: [35, 35], iconAnchor: [17, 35], popupAnchor: [0, -35] }),
  'SHELL': L.icon({ iconUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Shell_logo.svg/640px-Shell_logo.svg.png', iconSize: [35, 35], iconAnchor: [17, 35], popupAnchor: [0, -35] }),
  'GALP': L.icon({ iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Galp_Logo_2024.svg/1200px-Galp_Logo_2024.svg.png', iconSize: [35, 35], iconAnchor: [17, 35], popupAnchor: [0, -35] }),
  'PETRONOR': L.icon({ iconUrl: 'https://petronor.eus/wp-content/themes/petronorx/img/logomobile2024.png', iconSize: [30, 30], iconAnchor: [17, 35], popupAnchor: [0, -35] }),
  'AVIA': L.icon({ iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ7chHUael4wTWHcfha2PYpC3XjraWyXX17w&s', iconSize: [35, 35], iconAnchor: [17, 35], popupAnchor: [0, -35] }),
  'PETROPRIX': L.icon({ iconUrl: 'https://petroprix.com/wp-content/uploads/2022/04/Rojo.svg', iconSize: [55, 55], iconAnchor: [17, 35], popupAnchor: [0, -35] }),
  'COSTCO': L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/5977/5977579.png', iconSize: [55, 55], iconAnchor: [17, 35], popupAnchor: [0, -35] }),
  'CARREFOUR': L.icon({ iconUrl: 'https://www.uclm.es/-/media/Files/A01-Asistencia-Direccion/A01-135-Vicerrectorado-Transferencia/MECENAZGO/carrefour.ashx?h=338&w=450&la=es', iconSize: [60, 45], iconAnchor: [17, 35], popupAnchor: [0, -35] }),
  'NAFTE': L.icon({ iconUrl: 'https://nafte.es/wp-content/uploads/2018/05/logo-nafte.png', iconSize: [60, 45], iconAnchor: [17, 35], popupAnchor: [0, -35] }),
  'EROSKI': L.icon({ iconUrl: 'https://pbs.twimg.com/profile_images/1214914494813618176/4oYlKZVB_400x400.png', iconSize: [30, 30], iconAnchor: [17, 35], popupAnchor: [0, -35] }),
};


function GasStationDetail({ gasStations, cleanPrice, favoriteStationIds, toggleFavorite, calculateDistance, userLocation }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liters, setLiters] = useState('');

  // Desplazamiento al inicio de la página al cargar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const station = useMemo(() => gasStations.find(s => s.IDEESS === id), [gasStations, id]);

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
  const stationLat = cleanPrice(station['Latitud'].replace(',', '.'));
  const stationLon = cleanPrice(station['Longitud (WGS84)'].replace(',', '.'));
  const distance = userLocation ? calculateDistance(userLocation.latitude, userLocation.longitude, stationLat, stationLon) : null;
  
  const availablePrices = useMemo(() => {
    return Object.keys(station)
      .filter(key => key.startsWith('Precio '))
      .map(key => ({
        name: key.replace('Precio ', ''),
        price: cleanPrice(station[key]),
      }))
      .filter(fuel => fuel.price > 0);
  }, [station, cleanPrice]);
  
  // Calculadora de coste de repostaje
  const calculatedCost = useMemo(() => {
    if (!liters || availablePrices.length === 0) {
      return 0;
    }
    return cleanPrice(liters) * availablePrices[0].price;
  }, [liters, availablePrices, cleanPrice]);
  
  // AHORA CALCULAMOS LAS ESTACIONES CERCANAS DENTRO DE ESTE COMPONENTE
  const nearbyStations = useMemo(() => {
    if (!gasStations.length || !station) return [];
    
    const nearby = gasStations
      .filter(s => s.IDEESS !== station.IDEESS)
      .map(s => {
        const sLat = cleanPrice(s['Latitud'].replace(',', '.'));
        const sLon = cleanPrice(s['Longitud (WGS84)'].replace(',', '.'));
        const dist = calculateDistance(stationLat, stationLon, sLat, sLon);
        return { ...s, distance: dist };
      })
      .filter(s => s.distance <= 5) // Muestra gasolineras en un radio de 5km
      .sort((a, b) => a.distance - b.distance);
    return nearby;
  }, [gasStations, station, cleanPrice, calculateDistance, stationLat, stationLon]);

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
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800 text-3xl">
            <FaTimes />
          </button>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-700 flex items-center"><IoLocationSharp className="mr-2 text-blue-600" /> Dirección</h3>
              <p className="text-gray-600 ml-6">{station.Dirección}, {station.Localidad}</p>
              <p className="text-gray-600 ml-6">{station.Municipio}, {station.Provincia}</p>
              {distance && (
                <p className="flex items-center text-gray-700 mt-2 ml-6">
                  <FaRoad className="text-gray-500 mr-2" />
                  Distancia: <span className="font-semibold ml-1">{distance.toFixed(2)} km</span>
                </p>
              )}
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
            <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
              <h4 className="font-bold text-xl text-gray-800 mb-4">Calculadora de Coste</h4>
              <p className="text-sm text-gray-600 mb-4">Calcula el coste de repostar en esta gasolinera.</p>
              <div className="flex items-center">
                <label htmlFor="liters-input" className="sr-only">Litros a repostar</label>
                <input
                  id="liters-input"
                  type="number"
                  value={liters}
                  onChange={(e) => setLiters(e.target.value)}
                  placeholder="Litros a repostar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                />
                <span className="bg-gray-200 px-3 py-2 border border-gray-300 rounded-r-md text-gray-600">L</span>
              </div>
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg mt-4 shadow-md">
                <div className="flex items-center">
                  <FaEuroSign className="text-blue-600 mr-2 text-xl" />
                  <span className="font-semibold text-gray-700">Coste estimado:</span>
                </div>
                <span className="text-xl font-bold text-blue-800">
                  {calculatedCost.toFixed(2)} €
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">Gasolineras cercanas en el mapa</h3>
            <div className="rounded-lg overflow-hidden border border-gray-300" style={{ height: '500px' }}>
              <MapContainer
                center={[stationLat, stationLon]}
                zoom={14}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {userLocation && userLocation.latitude !== null && (
                  <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
                    <Popup>
                      <span className="font-bold">¡Estás aquí!</span>
                    </Popup>
                  </Marker>
                )}
                
                {[station, ...nearbyStations.slice(0, 5)].map(s => {
                  const currentStationLat = cleanPrice(s['Latitud'].replace(',', '.'));
                  const currentStationLon = cleanPrice(s['Longitud (WGS84)'].replace(',', '.'));
                  
                  let markerIcon = brandIcons[s.Rótulo.toUpperCase()] || stationIcon;
                  
                  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${currentStationLat},${currentStationLon}&travelmode=driving`;
      
                  if (isNaN(currentStationLat) || isNaN(currentStationLon)) {
                    return null;
                  }
      
                  return (
                    <Marker key={s.IDEESS} position={[currentStationLat, currentStationLon]} icon={markerIcon}>
                      <Popup>
                        <div className="p-2 flex flex-col items-center">
                          <h3 className="font-bold text-gray-900 text-center">{s.Rótulo}</h3>
                          <p className="text-sm text-gray-700 text-center">{s.Dirección}</p>
                          {availablePrices.length > 0 && (
                            <p className="text-lg font-bold text-blue-600 mt-2">{availablePrices[0].price.toFixed(3)} €/L</p>
                          )}
                          <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 transition duration-300 font-semibold text-sm"
                          >
                            Cómo llegar
                          </a>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
      {nearbyStations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-700">Gasolineras cercanas</h3>
          <ul className="divide-y divide-gray-200">
            {nearbyStations.slice(0, 5).map(nearby => (
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
  );
}

export default GasStationDetail;
